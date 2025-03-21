import { useState } from 'react'
import './App.css'
import writeIcon from './assets/write.png'
import searchIcon from './assets/search.png'
import addIcon from './assets/add.png'

function App() {
  const [activeTab, setActiveTab] = useState('species')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    conservationStatus: '',
    minPopulation: '',
    maxPopulation: '',
    startDate: '',
    endDate: ''
  })
  const [editingState, setEditingState] = useState({
    species: null,
    individual: null,
    sighting: null
  })

  // Example data - to be replaced with actual data 
  const speciesData = [
    {
      id: 1,
      commonName: "Amur Leopard",
      scientificName: "Panthera pardus orientalis",
      wildPopulation: 100,
      conservationStatus: "CR",
      individuals: [
        {
          id: 1,
          nickname: "Leo",
          sightings: [
            {
              id: 1,
              imageUrl: "path/to/image.jpg",
              location: "Yellowstone North Gate",
              dateTime: "2023-10-14T15:30:00",
              appearedHealthy: true,
              sighterEmail: "scientist1@example.com"
            }
          ]
        }
      ]
    },
    {
      id: 2,
      commonName: "Black Rhino",
      scientificName: "Diceros bicornis",
      wildPopulation: 6480,
      conservationStatus: "CR",
      individuals: [
        {
          id: 2,
          nickname: "Rhino",
          sightings: [] // No sightings for this individual
        }
      ]
    },
    {
      id: 3,
      commonName: "Bornean Orangutan",
      scientificName: "Pongo pygmaeus",
      wildPopulation: 104700,
      conservationStatus: "CR",
      individuals: [] // No individuals for this species
    }
  ]

  const handleEdit = (type, id) => {
    setEditingState(prev => ({
      ...prev,
      [type]: id
    }))
  }

  const handleSave = (type, id, updatedData) => {
    // API call to update the data
    console.log(`Saving ${type} with id ${id}:`, updatedData)
    setEditingState(prev => ({
      ...prev,
      [type]: null
    }))
  }

  const handleCancel = (type) => {
    setEditingState(prev => ({
      ...prev,
      [type]: null
    }))
  }

  const handleImageChange = (e) => {
    // Handle image change
  }

  return (
    <div className='body'>
      <div className='app'>
        <div className="main-container">
          {/* Search and Filter Section */}
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
                  <option value="CR">Critically Endangered</option>
                  <option value="EN">Endangered</option>
                  <option value="VU">Vulnerable</option>
                  <option value="NT">Near Threatened</option>
                  <option value="LC">Least Concern</option>
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

          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button 
              className={`tab-button ${activeTab === 'species' ? 'active' : ''}`}
              onClick={() => setActiveTab('species')}
            >
              <p data-title="Species">Species</p>
            </button>
            <button 
              className={`tab-button ${activeTab === 'individual' ? 'active' : ''}`}
              onClick={() => setActiveTab('individual')}
            >
              <p data-title="Individual">Individual</p>
            </button>
            <button 
              className={`tab-button ${activeTab === 'sighting' ? 'active' : ''}`}
              onClick={() => setActiveTab('sighting')}
            >
              <p data-title="Sighting">Sighting</p>
            </button>
          </div>

          {/* Form Container */}
          <div className="form-container">
            {activeTab === 'species' && (
              <form className="species-form">
                <h2>Add New Species</h2>
                <input type="text" placeholder="Common Name" required />
                <input type="text" placeholder="Scientific Name" required />
                <input type="number" placeholder="Population in Wild" required />
                <select required>
                  <option value="">Select Conservation Status</option>
                  <option value="CR">Critically Endangered</option>
                  <option value="EN">Endangered</option>
                  <option value="VU">Vulnerable</option>
                  <option value="NT">Near Threatened</option>
                  <option value="LC">Least Concern</option>
                </select>
                <button type="submit">Add Species</button>
              </form>
            )}

            {activeTab === 'individual' && (
              <form className="individual-form">
                <h2>Add New Individual</h2>
                <input type="text" placeholder="Nickname" required />
                <select required>
                  <option value="">Select Species</option>
                  {/* Species options to be populated dynamically */}
                </select>
                <button type="submit">Add Individual</button>
              </form>
            )}

            {activeTab === 'sighting' && (
              <form className="sighting-form">
                <h2>Add New Sighting</h2>
                <div className="file-upload-container">
                  <img src={addIcon} alt="Upload" className="upload-icon" />
                  <span className="upload-text">Click to upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                <input type="datetime-local" required />
                <select required>
                  <option value="">Select Individual</option>
                  {/* Individual options to be populated dynamically */}
                </select>
                <input type="text" placeholder="Location" required />
                <label>
                  <input type="checkbox" />
                  Animal Appeared Healthy
                </label>
                <input type="email" placeholder="Sighter Email" required />
                <button type="submit">Add Sighting</button>
              </form>
            )}
          </div>

          {/* Data Display Section */}
          <div className="data-container">
            {speciesData.map(species => (
              <div key={species.id} className="species-card">
                <div className="species-header">
                  <div className="header-content">
                    <h3>{species.commonName}</h3>
                    <button 
                      className="edit-button"
                      onClick={() => handleEdit('species', species.id)}
                      title={editingState.species === species.id ? 'Cancel' : 'Edit'}
                    >
                      <img src={writeIcon} alt="Edit" />
                    </button>
                  </div>
                  {editingState.species === species.id ? (
                    <div className="edit-form">
                      <input type="text" defaultValue={species.commonName} placeholder="Common Name" />
                      <input type="text" defaultValue={species.scientificName} placeholder="Scientific Name" />
                      <input type="number" defaultValue={species.wildPopulation} placeholder="Population" />
                      <select defaultValue={species.conservationStatus}>
                        <option value="CR">Critically Endangered</option>
                        <option value="EN">Endangered</option>
                        <option value="VU">Vulnerable</option>
                        <option value="NT">Near Threatened</option>
                        <option value="LC">Least Concern</option>
                      </select>
                      <div className="edit-actions">
                        <button onClick={() => handleSave('species', species.id, {})}>Save</button>
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
                          <button 
                            className="edit-button"
                            onClick={() => handleEdit('individual', individual.id)}
                            title={editingState.individual === individual.id ? 'Cancel' : 'Edit'}
                          >
                            <img src={writeIcon} alt="Edit" />
                          </button>
                        </div>
                        
                        {editingState.individual === individual.id ? (
                          <div className="edit-form">
                            <input type="text" defaultValue={individual.nickname} placeholder="Nickname" />
                            <select defaultValue={individual.species_id}>
                              {/* Species options will be populated dynamically */}
                            </select>
                            <div className="edit-actions">
                              <button onClick={() => handleSave('individual', individual.id, {})}>Save</button>
                              <button onClick={() => handleCancel('individual')}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          individual.sightings && individual.sightings.length > 0 && (
                            <div className="sightings-container">
                              {individual.sightings.map(sighting => (
                                <div key={sighting.id} className="sighting-card">
                                  <div className="header-content">
                                    <h5>Sighting Details</h5>
                                    <button 
                                      className="edit-button"
                                      onClick={() => handleEdit('sighting', sighting.id)}
                                      title={editingState.sighting === sighting.id ? 'Cancel' : 'Edit'}
                                    >
                                      <img src={writeIcon} alt="Edit" />
                                    </button>
                                  </div>
                                  
                                  {editingState.sighting === sighting.id ? (
                                    <div className="edit-form">
                                      <input type="file" accept="image/*" />
                                      <input type="datetime-local" defaultValue={sighting.dateTime} />
                                      <input type="text" defaultValue={sighting.location} placeholder="Location" />
                                      <label>
                                        <input type="checkbox" defaultChecked={sighting.appearedHealthy} />
                                        Animal Appeared Healthy
                                      </label>
                                      <input type="email" defaultValue={sighting.sighterEmail} placeholder="Sighter Email" />
                                      <div className="edit-actions">
                                        <button onClick={() => handleSave('sighting', sighting.id, {})}>Save</button>
                                        <button onClick={() => handleCancel('sighting')}>Cancel</button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <img 
                                        src={sighting.imageUrl} 
                                        alt={`Sighting of ${individual.nickname}`}
                                        className="sighting-image"
                                      />
                                      <div className="sighting-details">
                                        <p><strong>Location:</strong> {sighting.location}</p>
                                        <p><strong>Date/Time:</strong> {new Date(sighting.dateTime).toLocaleString()}</p>
                                        <p><strong>Health Status:</strong> {sighting.appearedHealthy ? 'Healthy' : 'Not Healthy'}</p>
                                        <p><strong>Sighter:</strong> {sighting.sighterEmail}</p>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}
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
      </div>
    </div>
  )
}

export default App
