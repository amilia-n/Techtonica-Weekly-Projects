import React, { useState, useEffect } from 'react';

const AddNewParticipant = () => {
  const [participant, setParticipant] = useState({
    firstName: '',
    lastName: '',
    email: '',
    status: 'Guest',
    note: '',
    eventId: ''
  });

  const [events, setEvents] = useState([]);
  const statusOptions = ['Host', 'Volunteer', 'Student', 'Guest'];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/events');
      const data = await response.json();
      setEvents(data);
      if (data.length > 0) {
        setParticipant(prev => ({ ...prev, eventId: data[0].id }));
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParticipant(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(participant),
      });

      if (response.ok) {
        // Clear form after successful submission
        setParticipant({
          firstName: '',
          lastName: '',
          email: '',
          status: 'Guest',
          note: '',
          eventId: participant.eventId // Keep the same event selected
        });
        alert('Participant added successfully!');
      } else {
        throw new Error('Failed to add participant');
      }
    } catch (error) {
      console.error('Error adding participant:', error);
      alert('Failed to add participant. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Participant</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="eventId">Event:</label>
          <select
            id="eventId"
            name="eventId"
            value={participant.eventId}
            onChange={handleChange}
            required
          >
            <option value="">Select an event</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={participant.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={participant.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={participant.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={participant.status}
            onChange={handleChange}
            required
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group textarea-group">
          <label htmlFor="note">Note:</label>
          <textarea
            id="note"
            name="note"
            value={participant.note}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button type="submit">Add Participant</button>
        </div>
      </form>
    </div>
  );
};

export default AddNewParticipant;
