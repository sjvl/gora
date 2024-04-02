import { useEffect, useState } from 'react';

function Character() {

    const [xSteps, setXSteps] = useState(0)
    const [ySteps, setYSteps] = useState(0)

    useEffect(() => {
        function animate() {
            if(xSteps === 0){
                setTimeout(() => {
                    setXSteps(xSteps + 32)
                }, 50);
                setTimeout(() => {
                    setXSteps(xSteps + 64)
                }, 100);
                setTimeout(() => {
                    setXSteps(xSteps + 96)
                }, 150);
                setTimeout(() => {
                    setXSteps(xSteps + 128)
                }, 200);
                setTimeout(() => {
                    setXSteps(xSteps + 160)
                }, 250);
                setTimeout(() => {
                    setXSteps(0)
                }, 300);
            }
            
        }
        function handleKeyDown(e) {
            if(e.key === 'ArrowDown') {
                if(xSteps === 0) setYSteps(0)
                animate()
            }
            if(e.key === 'ArrowUp') {
                if(xSteps === 0) setYSteps(135)
                animate()
            }
            if(e.key === 'ArrowLeft') {
                if(xSteps === 0) setYSteps(45)
                animate()
            }
            if(e.key === 'ArrowRight') {
                if(xSteps === 0) setYSteps(90)
                animate()
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
                    zIndex: '2',
                    position: 'absolute',
                    top: 'calc(50vh - 22px)',
                    left: 'calc(50vw - 16px)',
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
