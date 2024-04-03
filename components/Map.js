import { useEffect, useState } from 'react';
// import Character from './Character';
import Sam from './Sam';

function Map() {

    //starting coords for player
    const [xCoords, setXCoords] = useState(28)
    const [yCoords, setYCoords] = useState(18)

    const [xSteps, setXSteps] = useState(xCoords * -32)
    const [ySteps, setYSteps] = useState(yCoords * -32)
    const [mooving, setMooving] = useState(0)

    const [windowDimensions, setWindowDimensions] = useState({
        width: undefined,
        height: undefined
    });



    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions({
              width: window.innerWidth,
              height: window.innerHeight
            });
        };
      
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

    useEffect(() => {
        function moveX(dir) {
            console.log('from map', xSteps / -32, yCoords / -32)
            // need to check if a move in X is possible depending of dir
            if(((xSteps / -32) > 7 && dir > 0) || ((xSteps / -32) < 90 && dir < 0)){
                if( xSteps % 32 === 0 && ySteps % 32 === 0 && mooving === 0 ){
                    setMooving(1);
                    setTimeout(() => {
                        setXSteps(xSteps + (4 * dir))
                    }, 20);
                    setTimeout(() => {
                        setXSteps(xSteps + (8) * dir)
                    }, 40);
                    setTimeout(() => {
                        setXSteps(xSteps + (12 * dir))
                    }, 60);
                    setTimeout(() => {
                        setXSteps(xSteps + (16 * dir))
                    }, 80);
                    setTimeout(() => {
                        setXSteps(xSteps + (20 * dir))
                    }, 100);
                    setTimeout(() => {
                        setXSteps(xSteps + (24 * dir))
                    }, 120);
                    setTimeout(() => {
                        setXSteps(xSteps + (28 * dir))
                    }, 140);
                    setTimeout(() => {
                        setXSteps(xSteps + (32 * dir))
                        setMooving(0);
                    }, 160); 
                }
            }
        }
        function moveY(dir) {
            // need to check if a move in Y is possible depending of dir
            if(((ySteps / -32) > 12 && dir > 0) || ((ySteps / -32) < 65 && dir < 0)){
                if( xSteps % 32 === 0 && ySteps % 32 === 0 && mooving === 0 ){
                    setMooving(1);
                    setTimeout(() => {
                        setYSteps(ySteps + (4 * dir))
                    }, 20);
                    setTimeout(() => {
                        setYSteps(ySteps + (8) * dir)
                    }, 40);
                    setTimeout(() => {
                        setYSteps(ySteps + (12 * dir))
                    }, 60);
                    setTimeout(() => {
                        setYSteps(ySteps + (16 * dir))
                    }, 80);
                    setTimeout(() => {
                        setYSteps(ySteps + (20 * dir))
                    }, 100);
                    setTimeout(() => {
                        setYSteps(ySteps + (24 * dir))
                    }, 120);
                    setTimeout(() => {
                        setYSteps(ySteps + (28 * dir))
                    }, 140);
                    setTimeout(() => {
                        setYSteps(ySteps + (32 * dir))
                        setMooving(0);
                    }, 160);
                }
            }
        }

        function handleKeyDown(e) {
            if (mooving === 0){
                if(e.key === 'ArrowDown') moveY(-1)
                if(e.key === 'ArrowUp') moveY(+1)
                if(e.key === 'ArrowLeft') moveX(+1)
                if(e.key === 'ArrowRight') moveX(-1)
            }
        }
        
        document.addEventListener('keydown', handleKeyDown);
            
        // Don't forget to clean up
        return function cleanup() {
          document.removeEventListener('keydown', handleKeyDown);
        }
      }, [xSteps, ySteps, mooving]);

    return (
        <div>
            <img
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width:'100%',
                    height:'100%',
                    objectFit: 'none',
                    objectPosition: `${windowDimensions.width /2 + xSteps}px ${windowDimensions.height / 2 + 32 + ySteps}px`,
                }}
                src='/floor.png' 
            />
            {/* <Character /> */}
            <Sam xCoords={xCoords} yCoords={yCoords}/>
            <img
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 2,
                    objectFit: 'none',
                    objectPosition: `${windowDimensions.width /2 + xSteps}px ${windowDimensions.height / 2 +32 + ySteps}px`,
                }}
                src='/front.png' 
            />
            
        </div>
    );
}

export default Map;
