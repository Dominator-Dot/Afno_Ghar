import { useState } from 'react';
import './CustomizationModal.css';

export default function CustomizationModal({ isOpen, product, onClose, onConfirm }) {
  const [customization, setCustomization] = useState({
    color: '',
    material: '',
    height: '',
    width: '',
    length: ''
  });
  const [skipCustomization, setSkipCustomization] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomization(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProceedToPay = () => {
    if (skipCustomization) {
      onConfirm(null);
    } else {
      onConfirm(customization);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Customize Your Product</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <p className="modal-subtitle">
            Want to customize <strong>{product?.name}</strong>? Choose your preferences below:
          </p>

          <div className="customization-options">
            <div className="custom-group">
              <label>Color *</label>
              <select 
                name="color" 
                value={customization.color}
                onChange={handleChange}
              >
                <option value="">Select Color</option>
                <option value="black">Black</option>
                <option value="brown">Brown</option>
                <option value="gray">Gray</option>
                <option value="beige">Beige</option>
                <option value="white">White</option>
                <option value="burgundy">Burgundy</option>
              </select>
            </div>

            <div className="custom-group">
              <label>Material *</label>
              <select 
                name="material" 
                value={customization.material}
                onChange={handleChange}
              >
                <option value="">Select Material</option>
                <option value="leather">Leather</option>
                <option value="fabric">Fabric</option>
                <option value="suede">Suede</option>
                <option value="microfiber">Microfiber</option>
                <option value="cotton">Cotton</option>
              </select>
            </div>

            <div className="custom-group">
              <label>Height (cm)</label>
              <input 
                type="number" 
                name="height" 
                value={customization.height}
                onChange={handleChange}
                placeholder="e.g., 80"
                min="0"
              />
            </div>

            <div className="custom-group">
              <label>Width (cm)</label>
              <input 
                type="number" 
                name="width" 
                value={customization.width}
                onChange={handleChange}
                placeholder="e.g., 200"
                min="0"
              />
            </div>

            <div className="custom-group">
              <label>Length (cm)</label>
              <input 
                type="number" 
                name="length" 
                value={customization.length}
                onChange={handleChange}
                placeholder="e.g., 100"
                min="0"
              />
            </div>
          </div>

          <div className="skip-customization">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={skipCustomization}
                onChange={(e) => setSkipCustomization(e.target.checked)}
              />
              <span>I don't want to customize. Use default specifications.</span>
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleProceedToPay}>
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
