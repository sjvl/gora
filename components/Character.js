import { useEffect, useState } from 'react';

function Character() {

    const [xSteps, setXSteps] = useState(0)
    const [ySteps, setYSteps] = useState(0)

    useEffect(() => {
        function handleKeyDown(e) {
            if(e.key === 'ArrowDown') {
                setYSteps(0)
                if(xSteps <160) setXSteps(xSteps + 32)
                else setXSteps(0)
            }
            if(e.key === 'ArrowUp') {
                setYSteps(135)
                if(xSteps <160) setXSteps(xSteps + 32)
                else setXSteps(0)
            }
            if(e.key === 'ArrowLeft') {
                setYSteps(45)
                if(xSteps <160) setXSteps(xSteps + 32)
                else setXSteps(0)
            }
            if(e.key === 'ArrowRight') {
                setYSteps(90)
                if(xSteps <160) setXSteps(xSteps + 32)
                else setXSteps(0)
            }
        }
    
        document.addEventListener('keydown', handleKeyDown);
    
        // Don't forget to clean up
        return function cleanup() {
          document.removeEventListener('keydown', handleKeyDown);
        }
      }, [xSteps]);

    return (
        <div >
            <img
                style={{
                    width:'32px',
                    height:'45px',
                    objectFit: 'none',
                    objectPosition: `-${xSteps}px -${ySteps}px`,
                }}
                src='/Amelia.png' 
            />
        </div>
    );
}

export default Character;
