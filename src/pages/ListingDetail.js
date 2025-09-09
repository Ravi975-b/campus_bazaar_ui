import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/ListingDetail.css';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [message, setMessage] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isReported, setIsReported] = useState(false);

  // Mock data - in a real app, this would be fetched from an API
  const mockListing = {
    id: id,
    title: 'Textbook: Introduction to React',
    price: 45.99,
    category: 'Books',
    condition: 'Like New',
    description: 'Hardly used Introduction to React textbook. No highlights or notes inside. Perfect condition!',
    images: [
      'https://m.media-amazon.com/images/I/81x8Qt-q1ZL._UF1000,1000_QL80_.jpg',
      'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602424550i/55625842.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIm1laW9xhB0G-EJvNtDBLEWICEdUm17u35Q&s'
    ],
    seller: {
      id: 'user123',
      name: 'Alex Johnson',
      rating: 4.8,
      university: 'State University',
      joinDate: '2023-01-15',
      listings: 12
    },
    postedDate: '2023-11-10',
    location: 'State University, Main Campus',
    tags: ['textbook', 'react', 'programming', 'computer science']
  };

  useEffect(() => {
    // Simulate API call
    const fetchListing = async () => {
      try {
        // In a real app, you would fetch the listing by ID
        // const response = await fetch(`/api/listings/${id}`);
        // const data = await response.json();
        // setListing(data);
        
        // Using mock data for now
        setListing(mockListing);
        setLoading(false);
      } catch (err) {
        setError('Failed to load listing. Please try again later.');
        setLoading(false);
        console.error('Error fetching listing:', err);
      }
    };

    fetchListing();
  }, [id]);

  const handleContactSeller = (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login', { state: { from: `/listing/${id}` } });
      return;
    }
    // In a real app, this would send a message to the seller
    alert(`Message sent to ${listing.seller.name}: ${message}`);
    setMessage('');
  };

  const handleAddToFavorites = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/listing/${id}` } });
      return;
    }
    setIsFavorite(!isFavorite);
    // In a real app, this would update the user's favorites in the backend
  };

  const handleReportListing = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/listing/${id}` } });
      return;
    }
    setIsReported(true);
    // In a real app, this would submit a report to the admin
    alert('Thank you for reporting. Our team will review this listing.');
  };

  const handleShareListing = () => {
    // In a real app, this would use the Web Share API or similar
    const shareUrl = `${window.location.origin}/listing/${id}`;
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `Check out this listing: ${listing.title} for $${listing.price}`,
        url: shareUrl,
      })
      .catch(error => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return <div className="loading">Loading listing details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!listing) {
    return <div className="not-found">Listing not found</div>;
  }

  return (
    <div className="listing-detail">
      <div className="listing-container">
        {/* Image Gallery */}
        <div className="image-gallery">
          <div className="main-image">
            <img 
              src={listing.images[activeImage]} 
              alt={listing.title} 
              className="active-image"
            />
          </div>
          <div className="thumbnail-container">
            {listing.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${listing.title} - ${index + 1}`}
                className={`thumbnail ${index === activeImage ? 'active' : ''}`}
                onClick={() => setActiveImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <div className="product-header">
            <h1>{listing.title}</h1>
            <div className="price">${listing.price.toFixed(2)}</div>
            <div className="meta-info">
              <span className="condition">{listing.condition}</span>
              <span className="category">{listing.category}</span>
              <span className="location">{listing.location}</span>
            </div>
            <div className="posted-date">Posted on {new Date(listing.postedDate).toLocaleDateString()}</div>
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{listing.description}</p>
          </div>

          <div className="tags">
            {listing.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>

          <div className="action-buttons">
            <button 
              className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
              onClick={handleAddToFavorites}
            >
              {isFavorite ? '★ Saved' : '☆ Save'}
            </button>
            <button className="share-btn" onClick={handleShareListing}>
              Share
            </button>
            {!isReported ? (
              <button className="report-btn" onClick={handleReportListing}>
                Report
              </button>
            ) : (
              <span className="reported">Reported</span>
            )}
          </div>
        </div>

        {/* Seller Info */}
        <div className="seller-info">
          <h3>Seller Information</h3>
          <div className="seller-details">
            <div className="seller-avatar">
              {listing.seller.name.charAt(0)}
            </div>
            <div className="seller-meta">
              <h4>{listing.seller.name}</h4>
              <div className="rating">
                {'★'.repeat(Math.floor(listing.seller.rating))}
                {'☆'.repeat(5 - Math.floor(listing.seller.rating))}
                <span>({listing.seller.rating})</span>
              </div>
              <div className="university">{listing.seller.university}</div>
              <div className="member-since">Member since {new Date(listing.seller.joinDate).getFullYear()}</div>
              <div className="listings-count">{listing.seller.listings} listings</div>
            </div>
          </div>

          {currentUser?.uid !== listing.seller.id && (
            <form onSubmit={handleContactSeller} className="contact-form">
              <h4>Contact Seller</h4>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Message ${listing.seller.name.split(' ')[0]} about ${listing.title}`}
                required
              />
              <button type="submit" className="contact-btn">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
