import { useState } from "react";
import Home from './pages/Home';
import Contact from "./components/Contact";
import AddContact from "./components/AddContact";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [editingContact, setEditingContact] = useState(null);

  const handleAddContact = () => {
    setCurrentView('add');
    setEditingContact(null);
  };

  const handleEditContact = (contact) => {
    setCurrentView('edit');
    setEditingContact(contact);
  };

  const handleReturnToHome = () => {
    setCurrentView('home');
    setEditingContact(null);
  };

  const renderView = () => {
    switch (currentView) {
      case 'add':
        return <AddContact onCancel={handleReturnToHome} />;
      case 'edit':
        return <AddContact contact={editingContact} isEditing={true} onCancel={handleReturnToHome} />;
      default:
        return <Home onAddContact={handleAddContact} onEditContact={handleEditContact} />;
    }
  };

  return (
    <div className="App">
      {renderView()}
    </div>
  );
}

export default App;
