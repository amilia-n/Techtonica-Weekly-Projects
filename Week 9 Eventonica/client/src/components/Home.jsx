import React, { useState } from 'react';
import HeartToggle from './HeartToggle';

const Home = () => {
  // Function to check if a location is remote (contains a URL)
  const isRemoteLocation = (location) => {
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
    return urlPattern.test(location);
  };

  const initialEvents = [
    {
      id: 1,
      name: "Tech Conference 2024",
      start_time: "2024-04-15 09:00 AM",
      end_time: "2024-04-15 05:00 PM",
      location: "San Francisco Convention Center",
      pinned: true
    },
    {
      id: 2,
      name: "Summer Music Festival",
      start_time: "2024-04-20 02:00 PM",
      end_time: "2024-04-20 10:00 PM",
      location: "Golden Gate Park",
      pinned: false
    },
    {
      id: 3,
      name: "Cooking Workshop",
      start_time: "2024-04-25 06:00 PM",
      end_time: "2024-04-25 08:00 PM",
      location: "zoom.us/j/123456789",
      pinned: true
    },
    {
      id: 4,
      name: "Startup Networking Night",
      start_time: "2024-05-01 07:00 PM",
      end_time: "2024-05-01 09:30 PM",
      location: "WeWork Downtown",
      pinned: false
    },
    {
      id: 5,
      name: "Yoga in the Park",
      start_time: "2024-05-05 08:00 AM",
      end_time: "2024-05-05 09:30 AM",
      location: "Mission Dolores Park",
      pinned: false
    },
    {
      id: 6,
      name: "AI & Machine Learning Summit",
      start_time: "2024-05-10 10:00 AM",
      end_time: "2024-05-10 06:00 PM",
      location: "meet.google.com/abc-defg-hij",
      pinned: true
    },
    {
      id: 7,
      name: "Local Artists Showcase",
      start_time: "2024-05-15 05:00 PM",
      end_time: "2024-05-15 09:00 PM",
      location: "SF Art Gallery",
      pinned: false
    },
    {
      id: 8,
      name: "Wine Tasting Evening",
      start_time: "2024-05-20 06:30 PM",
      end_time: "2024-05-20 08:30 PM",
      location: "Napa Valley Vineyard",
      pinned: false
    },
    {
      id: 9,
      name: "Web Development Workshop",
      start_time: "2024-05-25 09:00 AM",
      end_time: "2024-05-25 04:00 PM",
      location: "teams.microsoft.com/meeting/123",
      pinned: true
    },
    {
      id: 10,
      name: "Photography Exhibition",
      start_time: "2024-05-30 11:00 AM",
      end_time: "2024-05-30 07:00 PM",
      location: "SF Museum of Modern Art",
      pinned: false
    }
  ];

  const [events, setEvents] = useState(initialEvents);
  const [sortConfig, setSortConfig] = useState({
    name: 0,
    start_time: 0,
    end_time: 0,
    location: 0
  });

  const sortEvents = (field) => {
    const newSortConfig = { ...sortConfig };
    Object.keys(newSortConfig).forEach(key => {
      if (key !== field) newSortConfig[key] = 0;
    });
    
    newSortConfig[field] = sortConfig[field] === 0 ? 1 : sortConfig[field] === 1 ? -1 : 0;
    setSortConfig(newSortConfig);

    let sortedEvents = [...events];
    
    // Separate pinned and unpinned events
    const pinnedEvents = sortedEvents.filter(event => event.pinned);
    const unpinnedEvents = sortedEvents.filter(event => !event.pinned);
    
    // Sort only unpinned events based on the selected field
    if (newSortConfig[field] !== 0) {
      unpinnedEvents.sort((a, b) => {
        if (field === 'name') {
          return newSortConfig[field] * a.name.localeCompare(b.name);
        } else if (field === 'location') {
          // Sort by remote/live first, then by location name
          const aIsRemote = isRemoteLocation(a.location);
          const bIsRemote = isRemoteLocation(b.location);
          if (aIsRemote !== bIsRemote) {
            return newSortConfig[field] * (aIsRemote ? -1 : 1);
          }
          return newSortConfig[field] * a.location.localeCompare(b.location);
        } else {
          const dateA = new Date(field === 'start_time' ? a.start_time : a.end_time);
          const dateB = new Date(field === 'start_time' ? b.start_time : b.end_time);
          return newSortConfig[field] * (dateA - dateB);
        }
      });
    } else {
      // Default sort by start time for unpinned events
      unpinnedEvents.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
    }
    
    // Combine pinned (unsorted) with sorted unpinned events
    setEvents([...pinnedEvents, ...unpinnedEvents]);
  };

  const togglePinned = (eventId) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, pinned: !event.pinned }
        : event
    ));
  };

  return (
    <div className="home-container">
      <div className="table-container">
        <h2>Upcoming Events</h2>
        <table className="events-table">
          <thead>
            <tr>
              <th>Pinned</th>
              <th>
                <div className="header-content">
                  <span>Event Name</span>
                  <button onClick={() => sortEvents('name')} className="sort-button">↕</button>
                </div>
              </th>
              <th>
                <div className="header-content">
                  <span>Start Time</span>
                  <button onClick={() => sortEvents('start_time')} className="sort-button">↕</button>
                </div>
              </th>
              <th>
                <div className="header-content">
                  <span>End Time</span>
                  <button onClick={() => sortEvents('end_time')} className="sort-button">↕</button>
                </div>
              </th>
              <th>
                <div className="header-content">
                  <span>Location</span>
                  <button onClick={() => sortEvents('location')} className="sort-button">↕</button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>
                  <HeartToggle
                    id={event.id}
                    checked={event.pinned}
                    onChange={() => togglePinned(event.id)}
                  />
                </td>
                <td>{event.name}</td>
                <td>{event.start_time}</td>
                <td>{event.end_time}</td>
                <td>{event.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home; 