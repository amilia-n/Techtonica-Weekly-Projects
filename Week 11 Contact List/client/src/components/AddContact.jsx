// Form component for adding new contact

import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import "./AddContact.css";

function AddContact({ contact, isEditing = false, onCancel }) {
  const [formData, setFormData] = useState({
    contact_name: contact?.contact_name || "",
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

  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      tags: checked 
        ? [...prev.tags, value]
        : prev.tags.filter(tag => tag !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
        throw new Error('Failed to save contact');
      }

      onCancel();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-new">
      <div className="form-header">
        <div className="cancel-btn" onClick={onCancel}>Cancel</div>
        <div>{isEditing ? 'Edit Contact' : 'New Contact'}</div>
        <div 
          className="done-btn" 
          onClick={handleSubmit}
          style={{ opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Saving...' : (isEditing ? 'Update' : 'Done')}
        </div>
      </div>

      <div className="add-img">
        <FontAwesomeIcon icon={faImage} style={{color: "#442c2e", fontSize: "2rem"}} />
      </div>

      <div className="add-btn">Add Photo Btn</div>

      <div className="add-detail-container">
        <div>FistName</div>
        <div>LastName</div>
        <div>+ Btn to add new #</div>
        <div>+ Btn to add new email</div>
        <div>+ Btn to add new tags</div>
        <div>Notes form</div>
      </div>
    </div>
  );
}

export default AddContact;
