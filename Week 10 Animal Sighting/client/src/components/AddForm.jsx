// Form component for adding new species, individuals, and sightings with validation
import { useState } from 'react';
import './AddForm.css';
import addIcon from '../assets/add.png';

const API_BASE_URL = 'http://localhost:3000/api';

function AddForm({ activeTab, speciesData, onDataUpdate }) {
  const handleSubmit = async (type, formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      onDataUpdate(); // Call the parent's data refresh function
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleSpeciesSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      commonName: e.target.elements[0].value,
      scientificName: e.target.elements[1].value,
      wildPopulation: parseInt(e.target.elements[2].value),
      conservationStatus: e.target.elements[3].value
    };
    await handleSubmit('species', formData);
    e.target.reset();
  };

  const handleIndividualSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      nickname: e.target.elements[0].value,
      species_id: parseInt(e.target.elements[1].value)
    };
    await handleSubmit('individuals', formData);
    e.target.reset();
  };

  const handleSightingSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const imageFile = formData.get('image');
    
    // Here you would typically upload the image to a storage service
    // and get back a URL. For now, we'll use a placeholder URL
    const imageUrl = 'placeholder_url';

    const sightingData = {
      individual_id: parseInt(formData.get('individual')),
      sighting_time: formData.get('datetime'),
      location: formData.get('location'),
      appeared_healthy: formData.get('healthy') === 'on',
      sighter_email: formData.get('email'),
      image_url: imageUrl
    };

    await handleSubmit('sightings', sightingData);
    e.target.reset();
  };

  return (
    <div className="form-container">
      {activeTab === 'species' && (
        <form className="species-form" onSubmit={handleSpeciesSubmit} role="form">
          <h2>Add New Species</h2>
          <input type="text" placeholder="Common Name" required name="commonName" />
          <input type="text" placeholder="Scientific Name" required name="scientificName" />
          <input type="number" placeholder="Population in Wild" required name="wildPopulation" />
          <select required name="conservationStatus">
            <option value="">Select Conservation Status</option>
            <option value="Critically Endangered">Critically Endangered</option>
            <option value="Endangered">Endangered</option>
            <option value="Vulnerable">Vulnerable</option>
            <option value="Near Threatened">Near Threatened</option>
            <option value="Least Concern">Least Concern</option>
          </select>
          <button type="submit">Add Species</button>
        </form>
      )}

      {activeTab === 'individual' && (
        <form className="individual-form" onSubmit={handleIndividualSubmit} role="form">
          <h2>Add New Individual</h2>
          <input type="text" placeholder="Nickname" required name="nickname" />
          <select required name="species">
            <option value="">Select Species</option>
            {speciesData.map(species => (
              <option key={species.id} value={species.id}>
                {species.commonName}
              </option>
            ))}
          </select>
          <button type="submit">Add Individual</button>
        </form>
      )}

      {activeTab === 'sighting' && (
        <form className="sighting-form" onSubmit={handleSightingSubmit} role="form">
          <h2>Add New Sighting</h2>
          <select required name="individual">
            <option value="">Select Individual</option>
            {speciesData.flatMap(species =>
              species.individuals.map(individual => (
                <option key={individual.id} value={individual.id}>
                  {individual.nickname} ({species.commonName})
                </option>
              ))
            )}
          </select>
          <input type="datetime-local" required name="datetime" />
          <input type="text" placeholder="Location" required name="location" />
          <div className="checkbox-container">
            <label>
              <input type="checkbox" name="healthy" />
              Appeared Healthy
            </label>
          </div>
          <input type="email" placeholder="Your Email" required name="email" />
          <div className="file-upload-container">
            <label className="file-upload">
              <img src={addIcon} alt="Upload" />
              <span>Upload Image</span>
              <input type="file" name="image" accept="image/*" />
            </label>
          </div>
          <button type="submit">Add Sighting</button>
        </form>
      )}
    </div>
  );
}

export default AddForm;