// Form component for adding new contact

import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import "./AddContact.css";

function AddContact({ contact, isEditing = false, onCancel }) {
  const [formData, setFormData] = useState({
    firstName: contact?.firstName || "",
    lastName: contact?.lastName || "",
    phone: contact?.phone || "",
    email: contact?.email || "",
    note: contact?.note || "",
    tags: contact?.tags?.split(", ") || []
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.firstName.trim()) {
      setError('First Name is required');
      return;
    }
    if (!formData.lastName.trim()) {
      setError('Last Name is required');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return;
    }

    setLoading(true);

    try {
      const url = isEditing 
        ? `http://localhost:3000/contacts/${contact.contact_id}`
        : 'http://localhost:3000/contacts';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save contact');
      }

      onCancel();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const closeError = () => {
    setError(null);
  };

  return (
    <>
      <div className="add-new">
        <div className="form-header">
          <div className="cancel-btn" onClick={onCancel}>Cancel</div>
          <div className='newcontact-title header-font'>Add New Contact</div>
          <div 
            className="submit-new" 
            onClick={handleSubmit}
            style={{ opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update' : 'Done')}
          </div>
        </div>

        <div className="display-img">
          <FontAwesomeIcon icon={faImage} style={{color: "#442c2e", fontSize: "3rem"}} />
        </div>

        <div className="add-img-btn">Add Photo</div>
        <div className='tags3'>
          <div className="tag-options">
            {['Friend', 'Work', 'Family', 'Networking', 'Other'].map((tag) => (
              <span
                key={tag}
                className={`tag${tag} ${formData.tags.includes(tag) ? 'selected' : ''  }`}
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    tags: prev.tags.includes(tag)
                      ? prev.tags.filter(t => t !== tag)
                      : [...prev.tags, tag]
                  }));
                }}
                style={{ cursor: 'pointer' }}
              >
                {tag}
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Space for Tag Selection"
            id="tags3"
            name="tags"
            value={formData.tags.join(", ")}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              tags: e.target.value.split(", ").filter(tag => tag.trim() !== "")
            }))}
            style={{ display: 'none' }}
          />
        </div>
        <form className="add-detail-container" onSubmit={handleSubmit}>
          <div className="required-field">
            <input
              type="text"
              placeholder="First Name"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="required-field">
            <input
              type="text"
              placeholder="Last Name"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="required-field">
            <input
              type="tel"
              placeholder="Phone Number"
              id="phoneNumber"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <textarea
              id="note"
              placeholder="Enter Notes"
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows="4"
            />
          </div>
        </form>
      </div>

      {error && (
        <>
          <div className="error-popup-overlay" onClick={closeError} />
          <div className="error-popup">
            <div className="error-popup-message">{error}</div>
            <button className="error-popup-button" onClick={closeError}>OK</button>
          </div>
        </>
      )}
    </>
  );
}

export default AddContact;
