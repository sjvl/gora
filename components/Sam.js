import { useEffect, useState } from 'react';

function Sam(props) {
    
    const [xCoords, setXCoords] = useState(props.xCoords)
    const [yCoords, setYCoords] = useState(props.yCoords)

    const [frames, setFrames] = useState(0)
    const [walking, setWalking] = useState(0)

    useEffect(() => {
        // console.log('from Sam', xCoords, yCoords)
    }, [xCoords, yCoords])

    useEffect(() => {
        function animate(pos) {
            if(walking === 0){
                setWalking(1);

                setTimeout(() => {
                    setFrames(pos + 64)
                }, 53);
                setTimeout(() => {
                    setFrames(pos + 32)
                }, 106);
                setTimeout(() => {
                    setFrames(pos)
                    setWalking(0);
                }, 160);

                // setTimeout(() => {
                //     setFrames(pos + 32)
                // }, 40);
                // setTimeout(() => {
                //     setFrames(pos)
                // }, 80);
                // setTimeout(() => {
                //     setFrames(pos + 64)
                // }, 120);
                // setTimeout(() => {
                //     setFrames(pos)
                //     setWalking(0);
                // }, 160);
                
            }
            
        }
        function handleKeyDown(e) {
            if(walking === 0){
                if(e.key === 'ArrowDown') {
                    setFrames(0);
                    if (e.repeat && props.moovable) {
                        animate(0);
                        setYCoords(yCoords + 1);
                    }
                }
                if(e.key === 'ArrowUp') {
                    setFrames(192);
                    if (e.repeat && props.moovable) {
                        animate(192);
                        setYCoords(yCoords - 1);
                    }
                }
                if(e.key === 'ArrowLeft') {
                    setFrames(96);
                    if (e.repeat && props.moovable) {
                        animate(96);
                        setXCoords(xCoords - 1);
                    }
                }
                if(e.key === 'ArrowRight') {
                    setFrames(288);
                    if (e.repeat && props.moovable) {
                        animate(288);
                        setXCoords(xCoords + 1);
                    }
                }
            }

        }
        
        document.addEventListener('keydown', handleKeyDown);
            
        // Don't forget to clean up
        return function cleanup() {
          document.removeEventListener('keydown', handleKeyDown);
        }
      }, [frames, props]);

    return (
        <div>
            <img
                style={{
                    zIndex: '1',
                    position: 'absolute',

                    top: '50vh',
                    left: '50vw',

                    width:'32px',
                    height:'64px',
                    objectFit: 'none',
                    objectPosition: `-${frames}px`,
                }}
                src='/sam.png'
            />
        </div>
    );
}

export default Sam;
