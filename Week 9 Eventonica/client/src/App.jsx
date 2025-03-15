// import { useState } from 'react'

import {React, useEffect, useReducer} from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./components/Home"
import Calendar from "./components/Calendar"
import Events from "./components/Events"
import mockEvents from "./assets/mockData.json"
import './App.css'

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

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchParticipants = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/events/${eventId}/participants`);
      const data = await response.json();
      dispatch({ type: 'SET_PARTICIPANTS', eventId, payload: data });
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/events');
      const data = await response.json();
      dispatch({ type: 'SET_EVENTS', payload: data });
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // get the events
  useEffect(() => {
    fetchEvents()
  }, []);
  
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home events={state.events} />} />
            <Route path="/events" element={<Events state={state} fetchParticipants={fetchParticipants} dispatch={dispatch} />} />
            <Route path="/calendar" element={<Calendar events={state.events} dispatch={dispatch} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App
