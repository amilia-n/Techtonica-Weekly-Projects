import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faPenToSquare, faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { useState } from 'react';
import "./Individual.css";

function Individual({ 
  selectedContact, 
  isEditing, 
  setIsEditing, 
  handleReturnToList, 
  handleEditClick, 
  handleEditSubmit, 
  handleDelete 
}) {
  const [editFormData, setEditFormData] = useState({
    contact_name: selectedContact?.contact_name || "",
    phone: selectedContact?.phone || "",
    email: selectedContact?.email || "",
    note: selectedContact?.note || "",
    tags: selectedContact?.tags !== 'No Tags' ? selectedContact.tags.split(", ") : []
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    handleEditSubmit(editFormData);
  };

  return (
    <div className="individual">
      <div className="individual-header">
        <button className="return-to-list" onClick={handleReturnToList}> 
          <FontAwesomeIcon icon={faAddressCard} style={{color: "#442c2e"}} />  
        </button> 
        <div className="individualtitle header-font">Contact Details</div>
        <button className="change-detail" data-testid="edit-button" onClick={handleEditClick}>
          <FontAwesomeIcon icon={faPenToSquare} style={{color: "#442c2e"}} />
        </button>
      </div>
      {selectedContact && (
        <>
          <div className="contact-img">
            <FontAwesomeIcon icon={faCircleUser} style={{color: "#442c2e", fontSize: "4rem"}} />
          </div>
          {isEditing ? (
            <div className="edit-form">
              <div className="tag-options2">
                {['Friend', 'Work', 'Family', 'Networking', 'Other'].map((tag) => (
                  <span
                    key={tag}
                    className={`tag${tag} ${editFormData.tags.includes(tag) ? 'selected' : 'unselected'}`}
                    onClick={() => {
                      setEditFormData(prev => ({
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
              <div className="required-field">
                <input
                  type="text"
                  name="contact_name"
                  placeholder="Contact Name"
                  value={editFormData.contact_name}
                  onChange={handleEditChange}
                  className="edit-input"
                  required
                />
              </div>
              <div className="required-field">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={editFormData.phone}
                  onChange={handleEditChange}
                  className="edit-input"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={editFormData.email}
                  onChange={handleEditChange}
                  className="edit-input"
                />
              </div>
              <div>
                <textarea
                  name="note"
                  placeholder="Add Notes"
                  value={editFormData.note}
                  onChange={handleEditChange}
                  className="edit-textarea"
                />
              </div>
              <div className="edit-actions">
                <button onClick={() => setIsEditing(false)} className="cancel-edit-btn">
                  Cancel
                </button>
                <button onClick={handleSubmit} className="save-edit-btn">
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="contact-name header-font">{selectedContact.contact_name}</div>
              <div className="contact-detail">
                <div className="tags2">
                  {selectedContact.tags !== 'No Tags' && selectedContact.tags.split(', ').map((tag, index) => (
                    <span key={index} className={`tag${tag}`}>{tag}</span>
                  ))}
                </div>
                <div className="detail-list">
                  <div className="detail-item1">
                    <label>Phone Number: {selectedContact.phone}</label>
                  </div>
                  <div className="detail-item2">
                    <label>Email: {selectedContact.email || 'No email provided'}</label>
                  </div>
                  <div className="detail-item3">
                    <label>Notes: {selectedContact.note || 'No notes provided'}</label>
                  </div>
                </div>
                <button className="delete-btn" onClick={handleDelete}>Delete Contact</button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Individual;