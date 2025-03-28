import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faAddressCard, faPenToSquare, faCircleUser } from '@fortawesome/free-regular-svg-icons';
import "./Contact.css";

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function Contact({ onAddContact }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showIndividual, setShowIndividual] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  const closeError = () => {
    setError(null);
  };

  const fetchContacts = useCallback(async (query = searchQuery) => {
    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(`http://localhost:3000/contacts?search=${encodedQuery}`);
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const data = await response.json();
      setContacts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
      fetchContacts(query);
    }, 300),
    [fetchContacts]
  );

  useEffect(() => {
    fetchContacts();
  }, []); 

  const handleSearch = (e) => {
    const query = e.target.value;
    debouncedSearch(query);
  };

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setShowIndividual(true);
    setIsEditing(false);
    setEditFormData(null);
  };

  const handleReturnToList = () => {
    setShowIndividual(false);
    setSelectedContact(null);
    setIsEditing(false);
    setEditFormData(null);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditFormData({
      contact_name: selectedContact.contact_name,
      phone: selectedContact.phone,
      email: selectedContact.email || "",
      note: selectedContact.note || "",
      tags: selectedContact.tags !== 'No Tags' ? selectedContact.tags.split(", ") : []
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async () => {
    // Validate required fields
    if (!editFormData.contact_name?.trim()) {
      setError('Contact name is required');
      return;
    }
    if (!editFormData.phone?.trim()) {
      setError('Phone number is required');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/contacts/${selectedContact.contact_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        throw new Error('Failed to update contact');
      }

      // Fetch updated contacts first
      await fetchContacts();
      
      // Then update the selected contact with the latest data
      const updatedContact = await fetch(`http://localhost:3000/contacts/${selectedContact.contact_id}`).then(res => res.json());
      setSelectedContact(updatedContact);
      
      // Finally switch back to display mode
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      console.log('Selected contact:', selectedContact);
      console.log('Attempting to delete contact with ID:', selectedContact.contact_id);
      const url = `http://localhost:3000/contacts/${selectedContact.contact_id}`;
      console.log('Delete URL:', url);
      
      const response = await fetch(url, {
        method: 'DELETE',
      });

      console.log('Delete response status:', response.status);
      
      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || response.statusText;
          console.log('Error response data:', errorData);
        } catch (e) {
          errorMessage = `Server error (${response.status})`;
          console.log('Error parsing response:', e);
        }
        console.error('Delete failed:', errorMessage);
        throw new Error(`Failed to delete contact: ${errorMessage}`);
      }

      const result = await response.json();
      console.log('Delete successful:', result);
      
      setShowIndividual(false);
      setSelectedContact(null);
      fetchContacts(); // Refresh the contacts list
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Loading contacts...</div>;

  return (
    <>
      {error && (
        <div className="error-popup-overlay" onClick={closeError}>
          <div className="error-popup" onClick={e => e.stopPropagation()}>
            <div className="error-popup-message">{error}</div>
            <button className="error-popup-button" onClick={closeError}>OK</button>
          </div>
        </div>
      )}
      <div className="list-all" style={{ display: showIndividual ? 'none' : 'flex' }}>
        <div className="header">
          <div className="search">
            <FontAwesomeIcon icon={faMagnifyingGlass} style={{color: "#acadaf"}} />
            <input 
              type="text" 
              placeholder="Search by name, phone, or tag" 
              className="search-input"
              onChange={handleSearch}
            />
          </div>
          <button className="add" onClick={onAddContact} data-testid="add-button">
            <FontAwesomeIcon icon={faUserPlus} style={{color: "#442c2e"}} />
          </button>
        </div>
        <div className="contact-list">
          <div className="listallheader header-font">All Contacts</div>
          {contacts.length === 0 ? (
            <div className="no-contacts">No contacts found</div>
          ) : (
            contacts.map(contact => (
              <div 
                key={contact.contact_id} 
                className="summary-container"
                onClick={() => handleContactClick(contact)}
                style={{ cursor: 'pointer' }}
              >
                <div className="summary-header">
                  <div className="summary-img">
                    <FontAwesomeIcon icon={faCircleUser} style={{color: "#442c2e", fontSize: "2.5rem"}} />
                  </div>
                  <div>
                    <div className="summary-name">{contact.contact_name}</div>
                    <div className="tags">
                      {contact.tags !== 'No Tags' && contact.tags.split(', ').map((tag, index) => (
                        <span key={index} className={`tag${tag}`}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="summary-details">
                  <div className="contact-info">
                    <div className="number">📱 {contact.phone}</div>
                    {contact.email && <div className="email">✉️ {contact.email}</div>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="individual" style={{ display: showIndividual ? 'block' : 'none' }}>
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
                      className={`tag${tag} ${editFormData.tags.includes(tag) ? '' : 'selected'}`}
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
                <input
                  type="text"
                  name="tags"
                  value={editFormData.tags.join(", ")}
                  onChange={(e) => setEditFormData(prev => ({
                    ...prev,
                    tags: e.target.value.split(", ").filter(tag => tag.trim() !== "")
                  }))}
                  style={{ display: 'none' }}
                />
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
                  <button onClick={handleEditSubmit} className="save-edit-btn">
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
    </>
  );
}

export default Contact;
