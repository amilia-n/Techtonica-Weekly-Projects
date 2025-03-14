import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

// Setup the localizer by providing the moment object
const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/events');
      const data = await response.json();
      // Transform the data to match the calendar event format
      const formattedEvents = data.map(event => ({
        title: event.title,
        start: new Date(event.start_date),
        end: new Date(event.end_date),
        allDay: event.all_day || false
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleNavigate = (action) => {
    const newDate = new Date(currentDate);
    if (action === 'PREV') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (action === 'NEXT') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (action === 'TODAY') {
      newDate.setMonth(new Date().getMonth());
      newDate.setFullYear(new Date().getFullYear());
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => handleNavigate('PREV')}>Previous</button>
        <button onClick={() => handleNavigate('TODAY')}>Today</button>
        <button onClick={() => handleNavigate('NEXT')}>Next</button>
        <h2>{moment(currentDate).format('MMMM YYYY')}</h2>
      </div>
      <div className="calendar-wrapper">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          views={['month']}
          date={currentDate}
          onNavigate={date => setCurrentDate(date)}
          style={{ height: '600px' }}
        />
      </div>
    </div>
  );
};

export default Calendar;
