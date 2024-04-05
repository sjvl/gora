import { useState, useEffect } from 'react';
import Map from '../components/Map';

function Test() {
  const [scale, setScale] = useState(1);
  const min = .5;
  const max = 1.5;

  useEffect(() => {
    // Ajouter la classe au body lorsque le composant est monté
    document.body.classList.add('bodyModified');

    return () => {
      // Supprimer la classe du body lorsque le composant est démonté
      document.body.classList.remove('bodyModified');
    };
}, []);

  const handleWheel = (e) => {
    e.preventDefault();
      const newScale = Math.min(Math.max(min, scale + e.deltaY * -0.01), max);
      setScale(newScale);
  };

  const handlePinch = (e) => {
    e.preventDefault();
      const newScale = Math.min(Math.max(min, scale + (e.touches[0].clientY - e.touches[1].clientY) * -0.01), max);
      setScale(newScale);
  };

  const containerStyle = {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    touchAction: 'none',
    position: 'relative',
  };

  const contentStyle = {
    transform: `scale(${scale})`,
    transformOrigin: '50vw 50vh',
  };


  return (
    <div
      onWheel={handleWheel}
      onTouchMove={handlePinch}
      style={containerStyle}
    >
      {/* <div style={contentStyle}> */}

      <div style={contentStyle}>
        <Map start={{x:12, y:12}} style={contentStyle}/>
      </div>
    </div>
  );
};

export default Test;
