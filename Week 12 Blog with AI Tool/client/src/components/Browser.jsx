import React from 'react';

const Browser = () => {
  return (
    <div className="mockup-browser border-base-300 border w-full bg-base-100" >
      <div className="mockup-browser-toolbar">
        <div className="input">https://tracker.gg/valorant</div>
      </div>
      <div className="grid place-content-center border-t border-base-300 h-full">
        <iframe
        src="https://tracker.gg/valorant"
        className="w-full h-full min-h-[60vh] min-w-[97.1vw]"
        title="Valorant Stats"
        style={{ transform: 'scale(1)' }}
        />
      </div>
    </div>

  );
};

export default Browser;