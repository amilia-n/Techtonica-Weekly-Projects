import React, { useState } from 'react';
import moment from 'moment-timezone';

const AddNewEvent = () => {
  const [event, setEvent] = useState({
    name: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    description: ''
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Use local timezone for conversion
    const startDateTime = moment(
      `${event.startDate} ${event.startTime}`,
      'YYYY-MM-DD HH:mm'
    ).toISOString();

    const endDateTime = moment(
      `${event.endDate} ${event.endTime}`,
      'YYYY-MM-DD HH:mm'
    ).toISOString();

    const eventData = {
      name: event.name,
      start_time: startDateTime,
      end_time: endDateTime,
      location: event.location,
      category: event.category,
      description: event.description
    };

    try {
      const response = await fetch('http://localhost:4000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        // Clear form after successful submission
        setEvent({
          name: '',
          startDate: '',
          startTime: '',
          endDate: '',
          endTime: '',
          location: '',
          description: ''
        });
        alert('Event added successfully!');
      } else {
        throw new Error('Failed to add event');
      }
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Event Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={event.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={event.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group time-input">
          <label htmlFor="startTime">Start Time:</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={event.startTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={event.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group time-input">
          <label htmlFor="endTime">End Time:</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={event.endTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={event.location}
            onChange={handleChange}
            required
          />
        </div>


        <div className="form-group textarea-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={event.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button type="submit">Add Event</button>
        </div>
      </form>
    </div>
  );
};

export default AddNewEvent;
