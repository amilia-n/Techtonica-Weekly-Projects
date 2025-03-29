// Main page component to display components

import { useState, useRef } from "react";
import "./Home.css";
import Contact from "../components/Contact";
import AddContact from "../components/AddContact";
import Individual from "../components/Individual";

function Home() {
  const [showAddContact, setShowAddContact] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showIndividual, setShowIndividual] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const contactRef = useRef(null);

  const handleAddContact = () => {
    setShowAddContact(true);
    setEditingContact(null);
  };

  const handleCloseAddContact = () => {
    setShowAddContact(false);
    setEditingContact(null);
  };

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setShowIndividual(true);
    setIsEditing(false);
  };

  const handleReturnToList = () => {
    setShowIndividual(false);
    setSelectedContact(null);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditSubmit = async (editFormData) => {
    if (!editFormData.contact_name?.trim()) {
      return;
    }
    if (!editFormData.phone?.trim()) {
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

      const updatedContact = await fetch(`http://localhost:3000/contacts/${selectedContact.contact_id}`).then(res => res.json());
      setSelectedContact(updatedContact);
      setIsEditing(false);
      
      // Refresh the contact list
      if (contactRef.current) {
        contactRef.current();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/contacts/${selectedContact.contact_id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }
      
      setShowIndividual(false);
      setSelectedContact(null);
      
      if (contactRef.current) {
        contactRef.current();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="home">
      <div className="main-container">
        <div className="display">
          <Contact 
            ref={contactRef}
            onAddContact={handleAddContact} 
            onContactClick={handleContactClick}
            showIndividual={showIndividual}
          />
          {showIndividual && (
            <Individual
              selectedContact={selectedContact}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              handleReturnToList={handleReturnToList}
              handleEditClick={handleEditClick}
              handleEditSubmit={handleEditSubmit}
              handleDelete={handleDelete}
            />
          )}
          {showAddContact && (
            <div className="overlay">
              <AddContact 
                contact={editingContact} 
                isEditing={!!editingContact} 
                onCancel={handleCloseAddContact}
                onSuccess={() => {
                  if (contactRef.current) {
                    contactRef.current();
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
