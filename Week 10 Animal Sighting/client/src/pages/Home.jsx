// Main page component managing tab navigation and data fetching for the animal sighting app

import { useState, useEffect } from 'react';
import './Home.css';
import AddForm from '../components/AddForm';
import DisplayData from '../components/DisplayData';

const API_BASE_URL = 'http://localhost:3000/api';

function Home() {
  const [activeTab, setActiveTab] = useState('species');
  const [speciesData, setSpeciesData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/species`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSpeciesData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='body'>
      <div className='app'>
        <div className="main-container">
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

          {/* Always display both components */}
          <div className="content-container">
            <AddForm 
              activeTab={activeTab}
              speciesData={speciesData}
              onDataUpdate={fetchData}
            />

            <DisplayData 
              activeTab={activeTab}
              speciesData={speciesData}
              onDataUpdate={fetchData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

