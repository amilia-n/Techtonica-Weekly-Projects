// Component for displaying contact
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faImage, faAddressCard, faPenToSquare, faCircleUser } from '@fortawesome/free-regular-svg-icons';
import "./Contact.css";

function Contact({ onAddContact, onEditContact }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showIndividual, setShowIndividual] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch(`http://localhost:3000/contacts?search=${searchQuery}`);
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
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    fetchContacts();
  };

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setShowIndividual(true);
  };

  const handleReturnToList = () => {
    setShowIndividual(false);
    setSelectedContact(null);
  };

  if (loading) return <div className="loading">Loading contacts...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
      <div className="list-all" style={{ display: showIndividual ? 'none' : 'flex' }}>
        <div className="header">
          <div className="search">
            <FontAwesomeIcon icon={faMagnifyingGlass} style={{color: "#acadaf"}} />
            <input 
              type="text" 
              placeholder="Search" 
              className="search-input"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <button className="add" onClick={onAddContact}>
            <FontAwesomeIcon icon={faUserPlus} style={{color: "#442c2e"}} />
          </button>
        </div>
        <div className="contact-list">
          <div className="listallheader">All Contacts</div>
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
          <h2>Contact Details</h2>
          <button className="change-detail" onClick={() => onEditContact(selectedContact)}>
            <FontAwesomeIcon icon={faPenToSquare} style={{color: "#442c2e"}} />
          </button>
        </div>
        {selectedContact && (
          <>
            <div className="contact-img">
              <FontAwesomeIcon icon={faCircleUser} style={{color: "#442c2e", fontSize: "3rem"}} />
            </div>
            <div className="contact-name">{selectedContact.contact_name}</div>
            <div className="contact-detail">
              <div className="tags">
                {selectedContact.tags !== 'No Tags' && selectedContact.tags.split(', ').map((tag, index) => (
                  <span key={index} className={`tag${tag}`}>{tag}</span>
                ))}
              </div>
              <div className="detail-list">
                <div className="detail-item">
                  <label>Phone Number:</label>
                  <p>{selectedContact.phone}</p>
                </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <p>{selectedContact.email || 'No email provided'}</p>
                </div>
                <div className="detail-item">
                  <label>Notes:</label>
                  <p>{selectedContact.note || 'No notes provided'}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Contact;
