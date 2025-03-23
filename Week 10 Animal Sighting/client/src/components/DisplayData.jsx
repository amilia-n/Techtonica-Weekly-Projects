// Component for displaying and managing species, individuals, and sightings data with search and filters
import { useState } from 'react';
import './DisplayData.css';
import writeIcon from '../assets/write.png';
import searchIcon from '../assets/search.png';
import deleteIcon from '../assets/delete.png';
import addIcon from '../assets/add.png';
import noimg from '../assets/noimg.png';

const API_BASE_URL = 'http://localhost:3000/api';

function DisplayData({ speciesData, onDataUpdate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    conservationStatus: '',
    minPopulation: '',
    maxPopulation: '',
    startDate: '',
    endDate: ''
  });
  const [editingState, setEditingState] = useState({
    species: null,
    individual: null,
    sighting: null
  });

  const handleEdit = (type, id) => {
    setEditingState(prev => ({
      ...prev,
      [type]: id
    }));
  };

  const handleSave = async (type, id, updatedData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${type}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      onDataUpdate(); // Call parent's data refresh function
      setEditingState(prev => ({
        ...prev,
        [type]: null
      }));
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleDelete = async (type, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/${type}/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Network response was not ok');

        onDataUpdate(); // Call parent's data refresh function
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleCancel = (type) => {
    setEditingState(prev => ({
      ...prev,
      [type]: null
    }));
  };

  const renderSightingEditForm = (sighting) => (
    <form className="edit-form" onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const imageFile = formData.get('image');
      
      const imageUrl = imageFile.size > 0 ? 'new_placeholder_url' : sighting.imageUrl;

      const updatedData = {
        individual_id: parseInt(formData.get('individual')),
        sighting_time: formData.get('datetime'),
        location: formData.get('location'),
        appeared_healthy: formData.get('healthy') === 'on',
        sighter_email: formData.get('email'),
        image_url: imageUrl
      };
      handleSave('sightings', sighting.id, updatedData);
    }}>
      <input
        type="datetime-local"
        name="datetime"
        defaultValue={sighting.dateTime?.slice(0, 16)}
        required
      />
      <input
        type="text"
        name="location"
        defaultValue={sighting.location}
        placeholder="Location"
        required
      />
      <label>
        <input
          type="checkbox"
          name="healthy"
          defaultChecked={sighting.appearedHealthy}
        />
        Appeared Healthy
      </label>
      <input
        type="email"
        name="email"
        defaultValue={sighting.sighterEmail}
        placeholder="Sighter's Email"
        required
      />
      {sighting.imageUrl ? (
        <div className="current-image-container">
          <img 
            src={sighting.imageUrl} 
            alt="Current sighting" 
            className="current-sighting-image"
          />
          <p className="current-image-label">Current Image</p>
        </div>
      ) : (
        <div className="current-image-container">
          <img 
            src={noimg} 
            alt="No image available" 
            className="current-sighting-image"
          />
          <p className="current-image-label">No Image Available</p>
        </div>
      )}
      <div className="file-upload-container">
        <input
          type="file"
          name="image"
          accept="image/*"
        />
        <img src={addIcon} alt="Upload" className="upload-icon" />
        <p className="upload-text">
          {sighting.imageUrl ? 'Choose a new image' : 'Upload an image'}
        </p>
      </div>
      <div className="edit-actions">
        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => handleCancel('sighting')}>
          Cancel
        </button>
      </div>
    </form>
  );

  // Filter data based on search query and filters
  const filteredData = speciesData.filter(species => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      species.commonName.toLowerCase().includes(searchLower) ||
      species.scientificName.toLowerCase().includes(searchLower);

    const matchesStatus = !filters.conservationStatus || 
      species.conservationStatus === filters.conservationStatus;

    const matchesPopulation = 
      (!filters.minPopulation || species.wildPopulation >= parseInt(filters.minPopulation)) &&
      (!filters.maxPopulation || species.wildPopulation <= parseInt(filters.maxPopulation));

    const matchesDates = (!filters.startDate && !filters.endDate) || 
      species.individuals.some(individual =>
        individual.sightings.some(sighting => {
          const sightingDate = new Date(sighting.dateTime);
          return (!filters.startDate || sightingDate >= new Date(filters.startDate)) &&
                 (!filters.endDate || sightingDate <= new Date(filters.endDate));
        })
      );

    return matchesSearch && matchesStatus && matchesPopulation && matchesDates;
  });

  return (
    <>
      <div className="search-section">
        <div className="search-container">
          <img src={searchIcon} alt="Search" className="search-icon" />
          <input 
            type="text" 
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-section">
          <span className="filter-label">Filter by:</span>
          <div className="filter-container">
            <select 
              value={filters.conservationStatus}
              onChange={(e) => setFilters({...filters, conservationStatus: e.target.value})}
              className="filter-select"
            >
              <option value="">Conservation Status</option>
              <option value="Critically Endangered">Critically Endangered</option>
              <option value="Endangered">Endangered</option>
              <option value="Vulnerable">Vulnerable</option>
              <option value="Near Threatened">Near Threatened</option>
              <option value="Least Concern">Least Concern</option>
            </select>
            <input 
              type="number" 
              placeholder="Min Population"
              value={filters.minPopulation}
              onChange={(e) => setFilters({...filters, minPopulation: e.target.value})}
              className="filter-input"
            />
            <input 
              type="number" 
              placeholder="Max Population"
              value={filters.maxPopulation}
              onChange={(e) => setFilters({...filters, maxPopulation: e.target.value})}
              className="filter-input"
            />
            <input 
              type="date" 
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              className="filter-input"
            />
            <input 
              type="date" 
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              className="filter-input"
            />
          </div>
        </div>
      </div>

      <div className="data-container">
        <div className="species-list">
          {filteredData.map(species => (
            <div key={species.id} className="species-card">
              <div className="species-header">
                <div className="header-content">
                  <h3>{species.commonName}</h3>
                  <div className="button-group">
                    <button 
                      className="edit-button"
                      onClick={() => handleEdit('species', species.id)}
                      title={editingState.species === species.id ? 'Cancel' : 'Edit'}
                    >
                      <img src={writeIcon} alt="Edit" />
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDelete('species', species.id)}
                      title="Delete"
                    >
                      <img src={deleteIcon} alt="Delete" />
                    </button>
                  </div>
                </div>
                {editingState.species === species.id ? (
                  <div className="edit-form">
                    <input type="text" defaultValue={species.commonName} placeholder="Common Name" id="commonName" />
                    <input type="text" defaultValue={species.scientificName} placeholder="Scientific Name" id="scientificName" />
                    <input type="number" defaultValue={species.wildPopulation} placeholder="Population" id="wildPopulation" />
                    <select defaultValue={species.conservationStatus} id="conservationStatus">
                      <option value="Critically Endangered">Critically Endangered</option>
                      <option value="Endangered">Endangered</option>
                      <option value="Vulnerable">Vulnerable</option>
                      <option value="Near Threatened">Near Threatened</option>
                      <option value="Least Concern">Least Concern</option>
                    </select>
                    <div className="edit-actions">
                      <button onClick={(e) => {
                        e.preventDefault();
                        const form = e.target.closest('.edit-form');
                        const updatedData = {
                          commonName: form.querySelector('#commonName').value,
                          scientificName: form.querySelector('#scientificName').value,
                          wildPopulation: parseInt(form.querySelector('#wildPopulation').value),
                          conservationStatus: form.querySelector('#conservationStatus').value
                        };
                        handleSave('species', species.id, updatedData);
                      }}>Save</button>
                      <button onClick={() => handleCancel('species')}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="species-details">
                    <p><strong>Scientific Name:</strong> {species.scientificName}</p>
                    <p><strong>Population:</strong> {species.wildPopulation}</p>
                    <p><strong>Status:</strong> {species.conservationStatus}</p>
                  </div>
                )}
              </div>
              
              {species.individuals && species.individuals.length > 0 && (
                <div className="individuals-container">
                  {species.individuals.map(individual => (
                    <div key={individual.id} className="individual-card">
                      <div className="header-content">
                        <h4>{individual.nickname}</h4>
                        <div className="button-group">
                          <button 
                            className="edit-button"
                            onClick={() => handleEdit('individual', individual.id)}
                            title={editingState.individual === individual.id ? 'Cancel' : 'Edit'}
                          >
                            <img src={writeIcon} alt="Edit" />
                          </button>
                          <button 
                            className="delete-button"
                            onClick={() => handleDelete('individuals', individual.id)}
                            title="Delete"
                          >
                            <img src={deleteIcon} alt="Delete" />
                          </button>
                        </div>
                      </div>
                      
                      {editingState.individual === individual.id ? (
                        <div className="edit-form">
                          <input type="text" defaultValue={individual.nickname} placeholder="Nickname" id="nickname" />
                          <select defaultValue={individual.species_id} id="species_id">
                            {speciesData.map(s => (
                              <option key={s.id} value={s.id}>
                                {s.commonName}
                              </option>
                            ))}
                          </select>
                          <div className="edit-actions">
                            <button onClick={(e) => {
                              e.preventDefault();
                              const form = e.target.closest('.edit-form');
                              const updatedData = {
                                nickname: form.querySelector('#nickname').value,
                                species_id: parseInt(form.querySelector('#species_id').value)
                              };
                              handleSave('individuals', individual.id, updatedData);
                              setEditingState(prev => ({
                                ...prev,
                                'individual': null
                              }));
                            }}>Save</button>
                            <button onClick={() => handleCancel('individual')}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        individual.sightings && individual.sightings.length > 0 ? (
                          <div className="sightings-wrapper">
                            <div className="sightings-header">
                              <div className="header-content">
                                <h5>Sighting Details</h5>
                              </div>
                            </div>
                            
                            <div className="sightings-container">
                              {individual.sightings.map(sighting => (
                                <div key={sighting.id} className="sighting-card">
                                  <div className="sighting-header">
                                    <button 
                                      className="delete-button"
                                      onClick={() => handleDelete('sightings', sighting.id)}
                                      title="Delete"
                                    >
                                      <img src={deleteIcon} alt="Delete" />
                                    </button>
                                  </div>
                                  <img 
                                    src={sighting.imageUrl ? sighting.imageUrl : noimg} 
                                    alt={`Sighting of ${individual.nickname}`}
                                    className="sighting-image"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = noimg;
                                    }}
                                  />
                                  <div className="sighting-details">
                                    <div className="sighting-details-header">
                                      <div className="button-group">
                                        <button 
                                          className="edit-button"
                                          onClick={() => handleEdit('sighting', sighting.id)}
                                          title={editingState.sighting === sighting.id ? 'Cancel' : 'Edit'}
                                        >
                                          <img src={writeIcon} alt="Edit" />
                                        </button>
                                      </div>
                                    </div>
                                    {editingState.sighting === sighting.id ? (
                                      renderSightingEditForm(sighting)
                                    ) : (
                                      <>
                                        <p><strong>Location:</strong> {sighting.location}</p>
                                        <p><strong>Date/Time:</strong> {new Date(sighting.dateTime).toLocaleString()}</p>
                                        <p><strong>Health Status:</strong> {sighting.appearedHealthy ? 'Healthy' : 'Not Healthy'}</p>
                                        <p><strong>Sighter:</strong> {sighting.sighterEmail}</p>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="no-data-message">
                            No Existing Data
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default DisplayData;