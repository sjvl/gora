import { useEffect, useState } from 'react';

function Sam(props) {
    
    const [xCoords, setXCoords] = useState(props.xCoords)
    const [yCoords, setYCoords] = useState(props.yCoords)

    const [xSteps, setXSteps] = useState(0)
    const [walking, setWalking] = useState(0)

    useEffect(() => {
        console.log('from Sam', xCoords, yCoords)
    }, [xCoords, yCoords])

    useEffect(() => {
        function animate(pos) {
            if(walking === 0){
                setWalking(1);
                
                setTimeout(() => {
                    setXSteps(pos + 32)
                }, 40);
                setTimeout(() => {
                    setXSteps(pos)
                }, 80);
                setTimeout(() => {
                    setXSteps(pos + 64)
                }, 120);
                setTimeout(() => {
                    setXSteps(pos)
                    setWalking(0);
                }, 160);
            }
            
        }
        function handleKeyDown(e) {
            if(walking === 0){
                if(e.key === 'ArrowDown') {
                        setXSteps(0);
                        animate(0);
                        setYCoords(yCoords + 1);
                }
                if(e.key === 'ArrowUp') {
                        setXSteps(192);
                        animate(192);
                        setYCoords(yCoords - 1);
                }
                if(e.key === 'ArrowLeft') {
                        setXSteps(96);
                        animate(96);
                        setXCoords(xCoords - 1);
                }
                if(e.key === 'ArrowRight') {
                        setXSteps(288);
                        animate(288);
                        setXCoords(xCoords + 1);
                }
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
                    zIndex: '1',
                    position: 'absolute',

                    top: '50vh',
                    left: '50vw',

                    width:'32px',
                    height:'64px',
                    objectFit: 'none',
                    objectPosition: `-${xSteps}px`,
                }}
                src='/sam.png'
            />
        </div>
    );
}

export default Sam;
