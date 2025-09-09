import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/CreateListing.css';

const CreateListing = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Textbooks',
    condition: 'Good',
    images: [],
    contactMethod: 'in-app',
    phone: '',
    location: currentUser?.university || '',
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const categories = [
    'Textbooks',
    'Electronics',
    'Furniture',
    'Clothing',
    'Stationery',
    'Sports',
    'Other'
  ];

  const conditions = [
    'New',
    'Like New',
    'Good',
    'Fair',
    'Poor'
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'images') {
      const newImages = Array.from(files);
      if (newImages.length + previewImages.length > 5) {
        setError('You can upload a maximum of 5 images');
        return;
      }
      
      // Create preview URLs for the new images
      const newPreviews = newImages.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...newPreviews]);
      
      // Store the files in formData
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const removeImage = (index) => {
    const newPreviews = [...previewImages];
    const newImages = [...formData.images];
    
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(newPreviews[index]);
    
    newPreviews.splice(index, 1);
    newImages.splice(index, 1);
    
    setPreviewImages(newPreviews);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const validateStep1 = () => {
    if (!formData.title.trim()) {
      setError('Please enter a title for your listing');
      return false;
    }
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price');
      return false;
    }
    if (!formData.description.trim() || formData.description.trim().length < 20) {
      setError('Please provide a detailed description (at least 20 characters)');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (previewImages.length === 0) {
      setError('Please add at least one photo of your item');
      return false;
    }
    return true;
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError('');
    
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateStep1() || !validateStep2()) {
      setCurrentStep(1);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would upload the images to a storage service
      // and then send the listing data to your backend
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a mock listing
      const newListing = {
        id: `item-${Math.random().toString(36).substr(2, 9)}`,
        ...formData,
        price: parseFloat(formData.price),
        postedDate: new Date().toISOString(),
        seller: {
          id: currentUser.id,
          name: currentUser.name,
          university: currentUser.university
        },
        status: 'active',
        images: previewImages, // In a real app, these would be URLs from your storage service
      };
      
      console.log('New listing created:', newListing);
      
      // Redirect to the listing page or home
      navigate(`/listing/${newListing.id}`);
      
    } catch (err) {
      setError('Failed to create listing. Please try again.');
      console.error('Error creating listing:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render step 1: Basic Information
  const renderStep1 = () => (
    <>
      <h2>What are you selling?</h2>
      <p className="step-description">Enter the details of your item below.</p>
      
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Calculus Textbook 3rd Edition"
          required
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">Price ($) *</label>
          <div className="price-input">
            <span className="currency">$</span>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0.00"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="condition">Condition *</label>
        <div className="condition-options">
          {conditions.map(cond => (
            <label key={cond} className="condition-option">
              <input
                type="radio"
                name="condition"
                value={cond}
                checked={formData.condition === cond}
                onChange={handleChange}
              />
              <span className="condition-label">{cond}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Provide a detailed description of your item..."
          rows="5"
          required
        />
        <div className="hint">
          Include details like brand, model, size, color, and any flaws or damage
        </div>
      </div>
    </>
  );

  // Render step 2: Add Photos
  const renderStep2 = () => (
    <>
      <h2>Add Photos</h2>
      <p className="step-description">Upload clear photos of your item. First photo will be the main one.</p>
      
      <div className="image-upload-container">
        {previewImages.length === 0 ? (
          <div className="empty-state">
            <div className="upload-icon">
              <i className="fas fa-camera"></i>
            </div>
            <p>Drag & drop photos here, or click to browse</p>
            <span className="hint">You can upload up to 5 photos</span>
          </div>
        ) : (
          <div className="image-preview-grid">
            {previewImages.map((src, index) => (
              <div key={index} className="image-preview">
                <img src={src} alt={`Preview ${index + 1}`} />
                <button 
                  type="button" 
                  className="remove-image"
                  onClick={() => removeImage(index)}
                  aria-label="Remove image"
                >
                  &times;
                </button>
                {index === 0 && <div className="main-label">Main</div>}
              </div>
            ))}
            {previewImages.length < 5 && (
              <div className="add-more-images">
                <i className="fas fa-plus"></i>
                <span>Add more</span>
              </div>
            )}
          </div>
        )}
        
        <input
          type="file"
          id="images"
          name="images"
          accept="image/*"
          onChange={handleChange}
          multiple
          className="file-input"
        />
        <label htmlFor="images" className="file-input-label"></label>
      </div>
    </>
  );

  // Render step 3: Contact & Location
  const renderStep3 = () => (
    <>
      <h2>Contact & Location</h2>
      <p className="step-description">How would you like to be contacted about this listing?</p>
      
      <div className="form-group">
        <label>Contact Method *</label>
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="contactMethod"
              value="in-app"
              checked={formData.contactMethod === 'in-app'}
              onChange={handleChange}
            />
            <span className="radio-label">
              <i className="fas fa-comment-dots"></i>
              <div>
                <strong>In-app messaging</strong>
                <small>Buyers will contact you through the app</small>
              </div>
            </span>
          </label>
          
          <label className="radio-option">
            <input
              type="radio"
              name="contactMethod"
              value="phone"
              checked={formData.contactMethod === 'phone'}
              onChange={handleChange}
            />
            <span className="radio-label">
              <i className="fas fa-phone"></i>
              <div>
                <strong>Phone call</strong>
                <small>Your number will be shown to buyers</small>
              </div>
            </span>
          </label>
        </div>
      </div>
      
      {formData.contactMethod === 'phone' && (
        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(123) 456-7890"
            required={formData.contactMethod === 'phone'}
          />
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="location">Location *</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., Main Campus, Dorm 5"
          required
        />
        <div className="hint">
          Where can buyers meet you to see/pick up the item?
        </div>
      </div>
      
      <div className="form-group terms-checkbox">
        <label className="checkbox-option">
          <input type="checkbox" required />
          <span>I certify that this listing follows our <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a></span>
        </label>
      </div>
    </>
  );

  // Render step 4: Review & Publish
  const renderStep4 = () => (
    <div className="review-listing">
      <h2>Review Your Listing</h2>
      <p className="step-description">Make sure everything looks good before publishing.</p>
      
      <div className="review-section">
        <h3>Item Details</h3>
        <div className="review-grid">
          <div className="review-main-image">
            {previewImages[0] ? (
              <img src={previewImages[0]} alt={formData.title} />
            ) : (
              <div className="no-image">No Image</div>
            )}
            <div className="image-count">
              <i className="fas fa-images"></i> {previewImages.length} {previewImages.length === 1 ? 'photo' : 'photos'}
            </div>
          </div>
          
          <div className="review-details">
            <h4>{formData.title}</h4>
            <p className="price">${parseFloat(formData.price).toFixed(2)}</p>
            
            <div className="detail-row">
              <span className="detail-label">Condition:</span>
              <span className="detail-value">{formData.condition}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Category:</span>
              <span className="detail-value">{formData.category}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Location:</span>
              <span className="detail-value">{formData.location}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Contact:</span>
              <span className="detail-value">
                {formData.contactMethod === 'phone' 
                  ? `Phone: ${formData.phone}` 
                  : 'In-app messaging'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="review-section">
          <h3>Description</h3>
          <p className="description-text">
            {formData.description || 'No description provided.'}
          </p>
        </div>
        
        <div className="review-section">
          <h3>Seller Information</h3>
          <div className="seller-info">
            <div className="seller-avatar">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="seller-name">{currentUser?.name || 'User'}</div>
              <div className="seller-university">{currentUser?.university || 'University'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const steps = [
    { number: 1, label: 'Details' },
    { number: 2, label: 'Photos' },
    { number: 3, label: 'Contact' },
    { number: 4, label: 'Review' }
  ];

  return (
    <div className="create-listing-container">
      <div className="create-listing-header">
        <h1>Create a New Listing</h1>
        <p>Sell your pre-loved items to other students on campus</p>
      </div>
      
      <div className="stepper">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className={`step ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}>
              <div className="step-number">{currentStep > step.number ? '✓' : step.number}</div>
              <div className="step-label">{step.label}</div>
            </div>
            {index < steps.length - 1 && <div className={`step-connector ${currentStep > step.number + 1 ? 'completed' : ''}`}></div>}
          </React.Fragment>
        ))}
      </div>
      
      <form onSubmit={currentStep === 4 ? handleSubmit : handleNext} className="listing-form">
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-content">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>
        
        <div className="form-actions">
          {currentStep > 1 && (
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              Back
            </button>
          )}
          
          <div className="spacer"></div>
          
          {currentStep < 4 ? (
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              Next: {steps[currentStep].label} <i className="fas fa-arrow-right"></i>
            </button>
          ) : (
            <button 
              type="submit" 
              className="btn btn-success"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <><i className="fas fa-spinner fa-spin"></i> Publishing...</>
              ) : (
                <><i className="fas fa-check"></i> Publish Listing</>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
