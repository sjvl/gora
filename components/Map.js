import { useEffect, useState } from 'react';
import Character from './Character';
import Sam from './Sam';

function Map() {

    const [xSteps, setXSteps] = useState(0)
    const [ySteps, setYSteps] = useState(0)

    useEffect(() => {
        // console.log(xSteps, ySteps)
        function moveX(dir) {
            // (dir > 0 || xSteps > -100) && (dir < 0 || xSteps < 1664) &&
            if( xSteps % 32 === 0 && ySteps % 32 === 0){
                setTimeout(() => {
                    setXSteps(xSteps + (4 * dir))
                }, 37);
                setTimeout(() => {
                    setXSteps(xSteps + (8) * dir)
                }, 75);
                setTimeout(() => {
                    setXSteps(xSteps + (12 * dir))
                }, 112);
                setTimeout(() => {
                    setXSteps(xSteps + (16 * dir))
                }, 150);
                setTimeout(() => {
                    setXSteps(xSteps + (20 * dir))
                }, 187);
                setTimeout(() => {
                    setXSteps(xSteps + (24 * dir))
                }, 225);
                setTimeout(() => {
                    setXSteps(xSteps + (28 * dir))
                }, 262);
                setTimeout(() => {
                    setXSteps(xSteps + (32 * dir))
                }, 300);   
            }
        }
        function moveY(dir) {
            //(dir > 0 || ySteps > 0) && (dir < 0 || ySteps < 2112) &&
            if( xSteps % 32 === 0 && ySteps % 32 === 0){
                setTimeout(() => {
                    setYSteps(ySteps + (4 * dir))
                }, 37);
                setTimeout(() => {
                    setYSteps(ySteps + (8) * dir)
                }, 75);
                setTimeout(() => {
                    setYSteps(ySteps + (12 * dir))
                }, 112);
                setTimeout(() => {
                    setYSteps(ySteps + (16 * dir))
                }, 150);
                setTimeout(() => {
                    setYSteps(ySteps + (20 * dir))
                }, 187);
                setTimeout(() => {
                    setYSteps(ySteps + (24 * dir))
                }, 225);
                setTimeout(() => {
                    setYSteps(ySteps + (28 * dir))
                }, 262);
                setTimeout(() => {
                    setYSteps(ySteps + (32 * dir))
                }, 300);    
            }
        }

        function handleKeyDown(e) {
            if(e.key === 'ArrowDown') {
                moveY(-1)
            }
            if(e.key === 'ArrowUp') {
                moveY(+1)
            }
            if(e.key === 'ArrowLeft') {
                moveX(+1)
            }
            if(e.key === 'ArrowRight') {
                moveX(-1)
            }
        }
        
        document.addEventListener('keydown', handleKeyDown);
            
        // Don't forget to clean up
        return function cleanup() {
          document.removeEventListener('keydown', handleKeyDown);
        }
      }, [xSteps, ySteps]);

    return (
        <div>
            <img
                style={{
                    width:'100%',
                    height:'100%',
                    objectFit: 'none',
                    objectPosition: `${xSteps}px ${ySteps}px`,
                }}
                src='/floor.png' 
            />
            {/* <Character /> */}
            <Sam x={xSteps} y={ySteps}/>
            <img
                style={{
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    zIndex: '4',
                    objectFit: 'none',
                    objectPosition: `${xSteps}px ${ySteps}px`,
                }}
                src='/front.png' 
            />
            
        </div>
    );
}

export default Map;
