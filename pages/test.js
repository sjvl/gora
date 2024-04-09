import { useState, useEffect } from 'react';
import Map from '../components/Map';

function Test() {
  const [windowDimensions, setWindowDimensions] = useState({ width: undefined, height: undefined });

    //window size
    useEffect(() => {
        // Vérifier si window est défini avant d'ajouter l'écouteur d'événement
        if (typeof window !== 'undefined') {
            setWindowDimensions({
              width: window.innerWidth,
              height: window.innerHeight
            });
            window.addEventListener('resize', handleResize);
      
            return () => {
              window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    //gestion du zoom
    const [scale, setScale] = useState(2);
    const min = .5;
    const max = 2;

    const handleWheel = (e) => {
        // e.preventDefault();
        const newScale = Math.min(Math.max(min, scale + e.deltaY * -0.01), max);
        setScale(newScale);
    };
    const handlePinch = (e) => {
        // e.preventDefault();
        const newScale = Math.min(Math.max(min, scale + (e.touches[0].clientY - e.touches[1].clientY) * -0.01), max);
        setScale(newScale);
    };
    const handleResize = () => {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
    };

    return (
        <div 
            onWheel={handleWheel}
            onTouchMove={handlePinch}
            style={{width: '100%', height: '100%', overflow: 'hidden', touchAction: 'none', position: 'relative'}}>
            <div style={{position :'fixed', transform: `scale(${scale})`, transformOrigin: '50vw 50vh'}}>
                <img
                style={{ position: 'fixed', top: '-400px', left: '-600px', }}
                    src='/floor.png' 
                />
            </div>
        </div>
    );
}

export default Test;
