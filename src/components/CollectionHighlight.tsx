import React from 'react';

const CollectionHighlight: React.FC = () => {
  return (
    <section className="collection-highlight">
      <div className="collection-grid">
        <div className="collection-item casual">
          <div className="collection-content">
            <span className="collection-tag">Casual</span>
            <h3 className="collection-title">Collection</h3>
          </div>
        </div>
        <div className="collection-item big-vibe">
          <div className="collection-content">
            <span className="collection-tag">Big Vibe</span>
            <h3 className="collection-title">Collection</h3>
          </div>
        </div>
        <div className="collection-item summer">
          <div className="collection-content">
            <span className="collection-tag">Summer</span>
            <h3 className="collection-title">Collection</h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionHighlight;