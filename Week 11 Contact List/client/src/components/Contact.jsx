import { useState, useEffect, useCallback, forwardRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
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

const Contact = forwardRef(({ onAddContact, onContactClick, showIndividual }, ref) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Expose fetchContacts to parent component
  useEffect(() => {
    if (ref) {
      ref.current = fetchContacts;
    }
  }, [ref, fetchContacts]);

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

  if (loading) return <div className="loading">Loading contacts...</div>;

  return (
    <>
      {error && (
        <div className="error-popup-overlay" onClick={() => setError(null)}>
          <div className="error-popup" onClick={e => e.stopPropagation()}>
            <div className="error-popup-message">{error}</div>
            <button className="error-popup-button" onClick={() => setError(null)}>OK</button>
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
                onClick={() => onContactClick(contact)}
                style={{ cursor: 'pointer' }}
              >
                <div className="summary-header">
                  <div className="summary-img">
                    <FontAwesomeIcon icon={faCircleUser} style={{color: "#442c2e", fontSize: "2.5rem"}} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="summary-name">{contact.contact_name}</div>
                    <div className="tags">
                      {contact.tags !== 'No Tags' && contact.tags.split(', ').map((tag, index) => {
                        // Convert tag to proper format for CSS class
                        const tagClass = tag.replace(/\s+/g, '');
                        return (
                          <span 
                            key={index} 
                            className={`tag${tagClass}`}
                            style={{ 
                              display: 'inline-block'
                            }}
                          >
                            {tag}
                          </span>
                        );
                      })}
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
    </>
  );
});

export default Contact;
