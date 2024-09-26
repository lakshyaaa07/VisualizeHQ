import React from 'react';
import './HypnoticLoader.css';

const HypnoticLoader = ({ loadingText = "Something is cooking...", glitch = false }) => {
  return (
    <div className="loader-container">
      <div className="hypnotic"></div>
      <div className="loading-text">
        {glitch ? (
          <div className="glitch-wrapper">
            <div className="glitch" data-glitch="Loading">Loading</div>
          </div>
        ) : (
          loadingText
        )}
      </div>
    </div>
  );
};

export default HypnoticLoader;
