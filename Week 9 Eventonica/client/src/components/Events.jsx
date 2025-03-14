import React, { useReducer, useEffect } from 'react';
import moment from 'moment';
import AddNewEvent from './AddNewEvent';
import AddNewParticipant from './AddNewParticipant';

const initialState = {
  events: [],
  participants: {},
  selectedEvent: null,
  searchTerm: '',
  startDate: '',
  endDate: '',
  selectedCategory: ''
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_EVENTS':
      return { ...state, events: action.payload };
    case 'SET_PARTICIPANTS':
      return { ...state, participants: { ...state.participants, [action.eventId]: action.payload } };
    case 'SET_SELECTED_EVENT':
      return { ...state, selectedEvent: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_START_DATE':
      return { ...state, startDate: action.payload };
    case 'SET_END_DATE':
      return { ...state, endDate: action.payload };
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    default:
      return state;
  }
};

const Events = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'conference', label: 'Conference' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'social', label: 'Social' },
    { value: 'tech', label: 'Technology' },
    { value: 'music', label: 'Music' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (state.selectedEvent) {
      fetchParticipants(state.selectedEvent.id);
    }
  }, [state.selectedEvent]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/events');
      const data = await response.json();
      dispatch({ type: 'SET_EVENTS', payload: data });
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchParticipants = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/events/${eventId}/participants`);
      const data = await response.json();
      dispatch({ type: 'SET_PARTICIPANTS', eventId, payload: data });
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const formatDateTime = (dateTime) => {
    return moment(dateTime).format('MMMM D, YYYY h:mm A');
  };

  const filteredEvents = state.events.filter(event => {
    const matchesSearch = !state.searchTerm || 
      event.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(state.searchTerm.toLowerCase());

    const matchesCategory = !state.selectedCategory || 
      event.category?.toLowerCase() === state.selectedCategory.toLowerCase();

    const eventDate = moment(event.start_time);
    const matchesStartDate = !state.startDate || eventDate.isSameOrAfter(state.startDate, 'day');
    const matchesEndDate = !state.endDate || eventDate.isSameOrBefore(state.endDate, 'day');

    return matchesSearch && matchesCategory && matchesStartDate && matchesEndDate;
  });

  return (
    <div className="events-page">
      <div className="search-container">
        <div className="search-row">
          <input
            type="text"
            placeholder="Search events..."
            value={state.searchTerm}
            onChange={(e) => dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })}
            className="search-input"
          />
          <select
            value={state.selectedCategory}
            onChange={(e) => dispatch({ type: 'SET_SELECTED_CATEGORY', payload: e.target.value })}
            className="category-select"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        <div className="date-filters">
          <div className="date-input-group">
            <label>Start Date</label>
            <input
              type="date"
              value={state.startDate}
              onChange={(e) => dispatch({ type: 'SET_START_DATE', payload: e.target.value })}
              className="date-input"
            />
          </div>
          <div className="date-input-group">
            <label>End Date</label>
            <input
              type="date"
              value={state.endDate}
              onChange={(e) => dispatch({ type: 'SET_END_DATE', payload: e.target.value })}
              className="date-input"
            />
          </div>
        </div>
      </div>

      <div className="forms-container">
        <AddNewEvent />
        <AddNewParticipant />
      </div>

      <div className="data-container">
        <h2>Events</h2>
        <div className="events-list">
          {filteredEvents.map(event => (
            <div 
              key={event.id} 
              className="event-card"
              onClick={() => dispatch({ type: 'SET_SELECTED_EVENT', payload: event })}
            >
              <h3>{event.name}</h3>
              <div className="event-date">
                {formatDateTime(event.start_time)} - {formatDateTime(event.end_time)}
              </div>
              <div className="event-description">
                <p><strong>Location:</strong> {event.location}</p>
                {event.description && <p>{event.description}</p>}
              </div>
              {event.category && (
                <span className="event-category">{event.category}</span>
              )}
            </div>
          ))}
          {filteredEvents.length === 0 && (
            <p className="no-events">No events found matching your search.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
