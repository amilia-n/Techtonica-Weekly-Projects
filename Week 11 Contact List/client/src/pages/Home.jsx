// Main page component to display components

import { useState } from "react";
import "./Home.css";
import Contact from "../components/Contact";
import AddContact from "../components/AddContact";

function Home() {
  const [showAddContact, setShowAddContact] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const handleAddContact = () => {
    setShowAddContact(true);
    setEditingContact(null);
  };

  const handleEditContact = (contact) => {
    setShowAddContact(true);
    setEditingContact(contact);
  };

  const handleCloseAddContact = () => {
    setShowAddContact(false);
    setEditingContact(null);
  };

  return (
    <div className="home">
      <div className="main-container">
        <div className="display">
          <Contact onAddContact={handleAddContact} onEditContact={handleEditContact} />
          {showAddContact && (
            <div className="overlay">
              <AddContact 
                contact={editingContact} 
                isEditing={!!editingContact} 
                onCancel={handleCloseAddContact} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
