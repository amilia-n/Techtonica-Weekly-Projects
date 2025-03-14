import React from 'react';
import './HeartToggle.css';

const HeartToggle = ({ id, checked, onChange }) => {
  return (
    <div className="heart-toggle">
      <input 
        id={`toggle-heart-${id}`} 
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={`toggle-heart-${id}`}>❤</label>
    </div>
  );
};

export default HeartToggle; 