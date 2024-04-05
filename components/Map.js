import { useEffect, useState } from 'react';
// import Character from './Character';
import Sam from './Sam';

function Map(props) {

    //starting coords for player
    const [xCoords, setXCoords] = useState(props.start.x)
    const [yCoords, setYCoords] = useState(props.start.y)

    const [xSteps, setXSteps] = useState(xCoords * -32)
    const [ySteps, setYSteps] = useState(yCoords * -32)
    const [mapMooving, setMapMooving] = useState(0)

    const [walls, setWalls] = useState(undefined)
    const [moovable, setMoovable] = useState(false)

    const [windowDimensions, setWindowDimensions] = useState({
        width: undefined,
        height: undefined
    });

    //gestion du zoom
    const [scale, setScale] = useState(2);
    const min = .5;
    const max = 2;
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

    useEffect(() => {
        const getData = () => {
            fetch('walls.json'
            ,{
              headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
               }
            }
            )
            .then((data) => data.json())
            .then((json) => setWalls(json))
        };
        getData();
    }, [])

    // useEffect(() => {
    //     console.log(walls)
    // }, [walls])

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
                //check if a move in X is possible depending of dir
                let mooveX = walls.col[yCoords];
                let futureX = xCoords - dir;
                let go = false;
                if(mooveX[futureX] !== 1) go = true;
                setMoovable(go);

                if((go)){
                    if( !mapMooving ){
                        setMapMooving(1);
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
                            setXCoords(xCoords - dir)
                            setMapMooving(0);
                        }, 160); 
                    }
                }
            }
            function moveY(dir) {
                //check if a move in Y is possible depending of dir
                let mooveY = walls.lin[xCoords];
                let futureY = yCoords - dir;
                let go = false;
                if(mooveY[futureY] !== 1) go = true;
                console.log(go)
                setMoovable(go);
    
                if((go)){
                    if( !mapMooving ){
                        setMapMooving(1);
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
                            setYCoords(yCoords - dir)
                            setMapMooving(0);
                        }, 160);
                    }
                }
            }
    
            function handleKeyDown(e) {
                if (!mapMooving){
                    if (e.repeat) {
                        if(e.key === 'ArrowDown') moveY(-1)
                        if(e.key === 'ArrowUp') moveY(+1)
                        if(e.key === 'ArrowLeft') moveX(+1)
                        if(e.key === 'ArrowRight') moveX(-1)
                    }
                }
            }
        
        // console.log(xCoords, yCoords)
        document.addEventListener('keydown', handleKeyDown);
            
        // Don't forget to clean up
        return function cleanup() {
          document.removeEventListener('keydown', handleKeyDown);
        }
    }, [xCoords, yCoords, xSteps, ySteps, mapMooving, walls]);


    return (
        <div onWheel={handleWheel}
            onTouchMove={handlePinch}
            style={{width: '100%', height: '100%', overflow: 'hidden', touchAction: 'none', position: 'relative',}}>
            <div style={{transform: `scale(${scale})`, transformOrigin: '50vw 50vh',}}>
                <img
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        // width:'100%',
                        // height:'100%',
                        backgroundColor: 'black',
                        objectFit: 'none',
                        objectPosition: `${windowDimensions.width /2 + xSteps}px ${windowDimensions.height / 2 + 32 + ySteps}px`,
                    }}
                    src='/floor.png' 
                />
                {/* <Character /> */}
                <Sam xCoords={xCoords} yCoords={yCoords} moovable={moovable} />
                <img
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        zIndex: 2,
                        objectFit: 'none',
                        objectPosition: `${windowDimensions.width /2 + xSteps}px ${windowDimensions.height / 2 +32 + ySteps}px`,
                    }}
                    src='/foreground.png' 
                />
                
            </div>
        </div>
    );
}

export default Map;
