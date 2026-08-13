import { useState } from 'react';
import './RentalForm.css';

export default function RentalForm({ product, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    rentalLocation: '',
    startDate: '',
    endDate: '',
    userPhoto: null,
    userPhotoPreview: '',
    phoneNumber: '',
    verificationId: null,
    verificationIdPreview: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [fieldName]: file,
          [fieldName + 'Preview']: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.rentalLocation || !formData.startDate || !formData.endDate) {
        throw new Error('Please fill in all required fields');
      }

      if (!formData.phoneNumber) {
        throw new Error('Phone number is required');
      }

      if (!formData.userPhoto) {
        throw new Error('Please upload your photo');
      }

      if (!formData.verificationId) {
        throw new Error('Please upload verification document');
      }

      const rentalData = {
        productId: product.id,
        rentalLocation: formData.rentalLocation,
        startDate: formData.startDate,
        endDate: formData.endDate,
        phoneNumber: formData.phoneNumber
      };

      await onSubmit(rentalData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rental-form-container">
      <div className="rental-form-card">
        <h2>Rental Request for {product?.name}</h2>
        <p className="rental-info">
          Rental Price: <strong>₹{product?.rental_price}/month</strong>
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <section className="form-section">
            <h3>Personal Information</h3>

            <div className="form-group">
              <label>Full Name (from your profile)</label>
              <input type="text" disabled value="Your Name" />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+977 9841234567"
                required
              />
            </div>

            <div className="form-group">
              <label>Your Photo *</label>
              <div className="file-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'userPhoto')}
                  required
                />
                {formData.userPhotoPreview && (
                  <img src={formData.userPhotoPreview} alt="Preview" className="photo-preview" />
                )}
              </div>
              <small>Upload a clear photo of yourself for verification</small>
            </div>

            <div className="form-group">
              <label>Verification Document (ID) *</label>
              <div className="file-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'verificationId')}
                  required
                />
                {formData.verificationIdPreview && (
                  <img src={formData.verificationIdPreview} alt="Preview" className="photo-preview" />
                )}
              </div>
              <small>Upload a clear photo of your ID/Passport/Driving License</small>
            </div>
          </section>

          {/* Rental Details */}
          <section className="form-section">
            <h3>Rental Details</h3>

            <div className="form-group">
              <label>Location for Rental Use *</label>
              <input
                type="text"
                name="rentalLocation"
                value={formData.rentalLocation}
                onChange={handleChange}
                placeholder="e.g., Kathmandu, Apartment #5, Lakeside"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </section>

          {/* Terms */}
          <section className="form-section">
            <div className="terms-checkbox">
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>I agree to the rental terms and conditions. I will keep the product in good condition and return it on the agreed date.</span>
              </label>
            </div>
          </section>

          {/* Buttons */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Processing...' : 'Submit Rental Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
