import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

// Mock data - in a real app, this would come from an API
const mockListings = [
  {
    id: 1,
    title: 'Calculus Textbook',
    price: 30,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHc6bvqAyFbiuU83qRVh0_T_y7crI-9BELgQ&s',
    category: 'Textbooks',
    postedDate: '2 days ago',
    condition: 'Like New'
  },
  {
    id: 2,
    title: 'Graphing Calculator',
    price: 50,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl5snOp3ge8Y3wxXHBUmoPSAfyiSXk1pKWOQ&s',
    category: 'Electronics',
    postedDate: '1 week ago',
    condition: 'Good'
  },
  {
    id: 3,
    title: 'Dorm Mini Fridge',
    price: 80,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcv8HsTmlitbDcSd8Eg4Bx4ywcUjFNfBjDBw&s',
    category: 'Furniture',
    postedDate: '3 days ago',
    condition: 'Excellent'
  },
  {
    id: 4,
    title: 'Bicycle',
    price: 120,
    image: 'https://indian-retailer.s3.ap-south-1.amazonaws.com/s3fs-public/interview1400.jpg',
    category: 'Transportation',
    postedDate: '5 days ago',
    condition: 'Good'
  },
];

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const { currentUser } = useAuth();

  useEffect(() => {
    // Simulate API call
    const fetchListings = async () => {
      // In a real app, you would fetch from your backend API
      // const response = await fetch('/api/listings');
      // const data = await response.json();
      
      // For now, using mock data
      setTimeout(() => {
        setListings(mockListings);
        setLoading(false);
      }, 500);
    };

    fetchListings();
  }, []);

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || listing.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Textbooks', 'Electronics', 'Furniture', 'Transportation', 'Clothing', 'Other'];

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Campus Bazar</h1>
          <p>Buy and sell used items within your campus community</p>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="category-filter"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          {!currentUser && (
            <div className="auth-buttons">
              <Link to="/register" className="btn primary">Sign Up</Link>
              <Link to="/login" className="btn secondary">Login</Link>
            </div>
          )}
        </div>
      </section>

      <section className="featured-listings">
        <h2>Featured Listings</h2>
        <div className="listings-grid">
          {filteredListings.map(listing => (
            <div key={listing.id} className="listing-card">
              <Link to={`/listing/${listing.id}`} className="listing-link">
                <div className="listing-image">
                  <img src={listing.image} alt={listing.title} />
                </div>
                <div className="listing-details">
                  <h3>{listing.title}</h3>
                  <p className="price">${listing.price}</p>
                  <div className="listing-meta">
                    <span className="category">{listing.category}</span>
                    <span className="condition">{listing.condition}</span>
                  </div>
                  <p className="posted-date">Posted {listing.postedDate}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="categories">
        <h2>Browse by Category</h2>
        <div className="category-grid">
          {categories.filter(cat => cat !== 'All').map(category => (
            <div 
              key={category} 
              className="category-card"
              onClick={() => setCategoryFilter(category)}
            >
              <h3>{category}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
