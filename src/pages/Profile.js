import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('listings');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    university: '',
    studentId: '',
    phone: '',
    joinDate: new Date().toISOString().split('T')[0],
  });
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/profile' } });
      return;
    }

    // Simulate loading user data
    const loadUserData = async () => {
      try {
        // In a real app, you would fetch this from your backend
        // const response = await fetch(`/api/users/${currentUser.uid}`);
        // const data = await response.json();
        
        // Mock data
        const mockUserData = {
          name: currentUser.displayName || 'User',
          email: currentUser.email,
          university: 'State University',
          studentId: 'S' + Math.floor(1000000 + Math.random() * 9000000),
          phone: '(555) 123-4567',
          joinDate: '2023-01-15',
        };
        
        setUserData(mockUserData);
        
        // Mock listings data
        const mockListings = [
          {
            id: '1',
            title: 'Textbook: Introduction to React',
            price: 45.99,
            category: 'Books',
            condition: 'Like New',
            image: 'https://via.placeholder.com/300x200?text=Textbook',
            postedDate: '2023-11-10',
            status: 'active',
            views: 124,
            saved: 8,
          },
          {
            id: '2',
            title: 'Desk Lamp - LED',
            price: 25.00,
            category: 'Electronics',
            condition: 'Good',
            image: 'https://via.placeholder.com/300x200?text=Desk+Lamp',
            postedDate: '2023-11-05',
            status: 'sold',
            views: 89,
            saved: 5,
          },
        ];
        
        setListings(mockListings);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Error loading profile:', err);
        setLoading(false);
      }
    };

    loadUserData();
  }, [currentUser, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, you would update the user's profile in your backend
      // await fetch(`/api/users/${currentUser.uid}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData)
      // });
      
      // For demo purposes, just log the data
      console.log('Profile updated:', userData);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    }
    
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      setError('Failed to log out');
      console.error('Logout error:', err);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real app, you would delete the user's account
      // await fetch(`/api/users/${currentUser.uid}`, { method: 'DELETE' });
      // await logout();
      // navigate('/');
      alert('Account deletion would be processed here');
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {userData.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h1>{userData.name}</h1>
          <p className="email">{userData.email}</p>
          <p className="university">{userData.university} • Student ID: {userData.studentId}</p>
          <p className="member-since">Member since {new Date(userData.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
          
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{listings.length}</span>
              <span className="stat-label">Listings</span>
            </div>
            <div className="stat">
              <span className="stat-value">4.8</span>
              <span className="stat-label">Rating</span>
            </div>
            <div className="stat">
              <span className="stat-value">12</span>
              <span className="stat-label">Sold</span>
            </div>
          </div>
        </div>
        
        <div className="profile-actions">
          {!editing ? (
            <button 
              className="edit-profile-btn"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <button 
              className="save-profile-btn"
              onClick={handleSaveProfile}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          )}
          <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <nav className="profile-nav">
            <button 
              className={`nav-item ${activeTab === 'listings' ? 'active' : ''}`}
              onClick={() => setActiveTab('listings')}
            >
              My Listings
            </button>
            <button 
              className={`nav-item ${activeTab === 'purchases' ? 'active' : ''}`}
              onClick={() => setActiveTab('purchases')}
            >
              My Purchases
            </button>
            <button 
              className={`nav-item ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              Saved Items
            </button>
            <button 
              className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              Messages
            </button>
            <button 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Account Settings
            </button>
          </nav>

          {activeTab === 'settings' && (
            <div className="account-actions">
              <h3>Account</h3>
              <button 
                className="delete-account-btn"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          )}
        </div>

        <div className="profile-main">
          {activeTab === 'listings' && (
            <div className="listings-grid">
              {listings.length > 0 ? (
                listings.map((item) => (
                  <div key={item.id} className="listing-card">
                    <img src={item.image} alt={item.title} className="listing-image" />
                    <div className="listing-details">
                      <h3>{item.title}</h3>
                      <div className="listing-meta">
                        <span className="price">${item.price.toFixed(2)}</span>
                        <span className={`status ${item.status}`}>{item.status}</span>
                      </div>
                      <div className="listing-stats">
                        <span>👁️ {item.views} views</span>
                        <span>💾 {item.saved} saves</span>
                      </div>
                      <div className="listing-actions">
                        <button className="edit-btn">Edit</button>
                        <button className="delete-btn">Delete</button>
                        {item.status === 'active' && (
                          <button className="mark-sold-btn">Mark as Sold</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>You haven't created any listings yet.</p>
                  <button 
                    className="create-listing-btn"
                    onClick={() => navigate('/create-listing')}
                  >
                    Create Your First Listing
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'purchases' && (
            <div className="empty-tab">
              <h2>Your Purchases</h2>
              <p>Your purchase history will appear here.</p>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="empty-tab">
              <h2>Saved Items</h2>
              <p>Items you save will appear here.</p>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="empty-tab">
              <h2>Messages</h2>
              <p>Your messages will appear here.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-form">
              <h2>Edit Profile</h2>
              {error && <div className="error-message">{error}</div>}
              
              <form onSubmit={handleSaveProfile}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    disabled={!editing}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    disabled={!editing}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="university">University</label>
                  <input
                    type="text"
                    id="university"
                    name="university"
                    value={userData.university}
                    onChange={handleInputChange}
                    disabled={!editing}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    disabled={!editing}
                  />
                </div>
                
                {editing && (
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="save-btn"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>
              
              <div className="password-section">
                <h3>Change Password</h3>
                <button 
                  className="change-password-btn"
                  onClick={() => alert('Password change functionality would be implemented here')}
                >
                  Change Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
