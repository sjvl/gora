import { useEffect, useState } from 'react';

function Sam(props) {

    const [xSteps, setXSteps] = useState(0)
    const [walking, setWalking] = useState(0)
    const [coords, setCoords] = useState({x: 10, y: 10})

    useEffect(() => {
        // find coords from map
        console.log((props.x)*-1 /32 + coords.x, (props.y)*-1 /32 + coords.y)
    }, [walking])

    useEffect(() => {
        function animate(pos) {
            if(walking === 0){
                setWalking(1);
                setXSteps(pos + 32)

                setTimeout(() => {
                    setXSteps(pos)
                }, 100);
                setTimeout(() => {
                    setXSteps(pos + 64)
                }, 200);
                setTimeout(() => {
                    setXSteps(pos)
                    setWalking(0);
                }, 300);
            }
            
        }
        function handleKeyDown(e) {
            if(e.key === 'ArrowDown') {
                if(walking === 0){
                    setXSteps(0)
                    animate(0)
                    setCoords()
                }
            }
            if(e.key === 'ArrowUp') {
                if(walking === 0){
                    setXSteps(192)
                    animate(192)
                }
            }
            if(e.key === 'ArrowLeft') {
                if(walking === 0){
                    setXSteps(96)
                    animate(96)
                }
            }
            if(e.key === 'ArrowRight') {
                if(walking === 0){
                    setXSteps(288)
                    animate(288)
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
                    zIndex: '2',
                    position: 'absolute',

                    // top: 'calc(50vh - 16px)',
                    // left: 'calc(50vw - 16px)',

                    top: `${props.y + (props.y * -1) -16 + (coords.y * 32)}px`,
                    left: `${props.x + (props.x * -1) -2 + (coords.x * 32)}px`,

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
