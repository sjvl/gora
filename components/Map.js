import styles from '../styles/Map.module.css';
import { useEffect, useState } from 'react';
import Player from './Player';
import Character from './Character';

function Map(props) {

    const [windowDimensions, setWindowDimensions] = useState({ width: undefined, height: undefined });

    //starting coords for player
    const [xCoords, setXCoords] = useState(props.start.x)
    const [yCoords, setYCoords] = useState(props.start.y)

    //animation
    const [xSteps, setXSteps] = useState(xCoords * -32)
    const [ySteps, setYSteps] = useState(yCoords * -32)
    const [mapMooving, setMapMooving] = useState(0)
    const [moovable, setMoovable] = useState(false)
    const [dir, setDir] = useState('down')

    const [walls, setWalls] = useState(undefined)
    const [meetingsTiles, setTiles] = useState(props.meetingsTiles)
    const [socket, setSocket] = useState([{name: 'Mathieu', X: 11, Y: 12, dir: 'left', cam: false}, {name: 'Lionel', X: 14, Y: 14, dir: 'down' , cam: false}])
    
    const [areas, setAreas] = useState(false)
    const [cam, setCam] = useState(false)



    useEffect(() => {
        getData();

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
    const [antiScale, setAntiScale] = useState(2);
    const min = .5; const max = 3;
    const remap = (value) => {
        let min2 = 3.5
        let max2 = 1
        //return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
        return min2 + (max2 - min2) * ((value - min) / (max - min))
    };
    const handleWheel = (e) => {
        // e.preventDefault();
        const newScale = Math.min(Math.max(min, scale + e.deltaY * -0.01), max);
        const newAntiScale = remap(newScale);
        setScale(newScale);
        setAntiScale(newAntiScale)
    };
    const handlePinch = (e) => {
        // e.preventDefault();
        const newScale = Math.min(Math.max(min, scale + (e.touches[0].clientY - e.touches[1].clientY) * -0.01), max);
        const newAntiScale = remap(newScale);
        setScale(newScale);
        setAntiScale(newAntiScale)
    };

    //initialization
    const handleResize = () => {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
    };
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
        .then((json) => {
            setWalls(json); 
        })
    };

    function distanceManhattan(tile1, tile2) {
        return Math.abs(tile2.X - tile1.X) + Math.abs(tile2.Y - tile1.Y);
    }

    function move(dir) {
        let actualTile = { X: xCoords, Y: yCoords };
        let actualTileType = null;
        if(walls) actualTileType = walls.lin[xCoords][yCoords];

        let futureTile;
        let futureCoord;
        let stepsSetter;
        let coordSetter;
        let axisCoords;

        let closestPlayer = null;
        let closestDistance = 4;
        let meetX;
        let meetY;
    
        if (dir === 'left' || dir === 'right') {
            futureTile = walls.col[yCoords];
            futureCoord = xCoords - (dir === 'left' ? 1 : -1);
            meetX = socket.map(e => e.X === futureCoord);
            meetY = socket.map(e => e.Y === yCoords);
            stepsSetter = setXSteps;
            coordSetter = setXCoords;
            axisCoords = xCoords;
        } else if (dir === 'up' || dir === 'down') {
            futureTile = walls.lin[xCoords];
            futureCoord = yCoords - (dir === 'up' ? 1 : -1);
            meetX = socket.map(e => e.X === xCoords);
            meetY = socket.map(e => e.Y === futureCoord);
            stepsSetter = setYSteps;
            coordSetter = setYCoords;
            axisCoords = yCoords;
        } else {
            // Nobody move! 
            return;
        }
    
        const indiceCommun = () => {
            for (let i = 0; i < Math.min(meetX.length, meetY.length); i++) {
                if (meetX[i] && meetY[i]) {
                    return true; // meet
                }
            }
            return false; // no meet
        }
        socket.forEach((otherPlayer) => {
            const dist = distanceManhattan(actualTile, otherPlayer);
            if (dist < closestDistance) {
                closestDistance = dist;
                closestPlayer = otherPlayer;
            }
        });
    
        let go = false;
        let area = false;
        let cam = false;

        
        
        if (futureTile[futureCoord] !== 1 && indiceCommun() === false) go = true;
        setMoovable(go);
        
        if(closestPlayer){
            cam = true;
            console.log(closestPlayer && closestPlayer.name, closestDistance)
        }
        if (futureTile[futureCoord] === 'A' || (futureTile[axisCoords] === 'A' && futureTile[futureCoord] === 1)) {
            cam = true; 
            area = true 
        };
        setAreas(area);
        setCam(cam);
    
        if (go) {
            if (!mapMooving) {
                setMapMooving(1);
                setTimeout(() => {
                    stepsSetter(prevSteps => prevSteps + ((dir === 'up' || dir === 'left' ? 1 : -1)*4));
                }, 20);
                setTimeout(() => {
                    stepsSetter(prevSteps => prevSteps + ((dir === 'up' || dir === 'left' ? 1 : -1)*4));
                }, 40);
                setTimeout(() => {
                    stepsSetter(prevSteps => prevSteps + ((dir === 'up' || dir === 'left' ? 1 : -1)*4));
                }, 60);
                setTimeout(() => {
                    stepsSetter(prevSteps => prevSteps + ((dir === 'up' || dir === 'left' ? 1 : -1)*4));
                }, 80);
                setTimeout(() => {
                    stepsSetter(prevSteps => prevSteps + ((dir === 'up' || dir === 'left' ? 1 : -1)*4));
                }, 100);
                setTimeout(() => {
                    stepsSetter(prevSteps => prevSteps + ((dir === 'up' || dir === 'left' ? 1 : -1)*4));
                }, 120);
                setTimeout(() => {
                    stepsSetter(prevSteps => prevSteps + ((dir === 'up' || dir === 'left' ? 1 : -1)*4));
                }, 140);
                setTimeout(() => {
                    stepsSetter(prevSteps => prevSteps + ((dir === 'up' || dir === 'left' ? 1 : -1)*4));
                    coordSetter(prevCoord => prevCoord - (dir === 'up' || dir === 'left' ? 1 : -1));
                    setMapMooving(0);
                }, 160);
            }
        }
    }
    
    function handleKeyDown(e) {
        if (!mapMooving) {
            let dir;
            if (e.repeat) {
                switch (e.key) {
                    case 'ArrowDown':
                        dir = 'down';
                        break;
                    case 'ArrowUp':
                        dir = 'up';
                        break;
                    case 'ArrowLeft':
                        dir = 'left';
                        break;
                    case 'ArrowRight':
                        dir = 'right';
                        break;
                    default:
                        return;
                }
            }else {
                switch (e.key) {
                    case 'ArrowDown':
                        dir = 'd';
                        break;
                    case 'ArrowUp':
                        dir = 'u';
                        break;
                    case 'ArrowLeft':
                        dir = 'l';
                        break;
                    case 'ArrowRight':
                        dir = 'r';
                        break;
                    default:
                        return;
                }
            }
            setDir(dir);
            move(dir);
        }
    }
    
    useEffect(() => {    
        document.addEventListener('keydown', handleKeyDown);
            
        // Don't forget to clean up
        return function cleanup() {
          document.removeEventListener('keydown', handleKeyDown);
          setDir('')
        }

    }, [xCoords, yCoords, xSteps, ySteps, mapMooving, walls]);

    // useEffect(() => {    
    //     console.log(xCoords, yCoords)
    // }, [xCoords, yCoords]);


    const people = socket.map((e,i) => <Character key={i} name={e.name} dir={e.dir} left={windowDimensions.width /2 + xSteps + (e.X * 32)} top={windowDimensions.height /2 + ySteps + (e.Y * 32)} cam={e.cam} antiScale={antiScale} />);


    return (
        <div 
            onWheel={handleWheel}
            onTouchMove={handlePinch}
            style={{width: '100%', height: '100%', overflow: 'hidden', touchAction: 'none', position: 'relative'}}>
            <div style={{position :'fixed', transform: `scale(${scale})`, transformOrigin: '50vw 50vh'}}>
                <img style={{ position: 'fixed', top: `${windowDimensions.height / 2 + 32 + ySteps}px`, left: `${windowDimensions.width /2 + xSteps}px`, backgroundColor: 'whitesmoke'}}
                    src='/floor.png' 
                />

                <img style={{ position: 'fixed', top: `${windowDimensions.height / 2 + 32 + ySteps}px`, left: `${windowDimensions.width /2 + xSteps}px`, zIndex: 2 }}
                    src='/foreground.png' 
                />
                
                {people}

                <Player dir={dir} moovable={moovable} cam={cam} antiScale={antiScale}/>


                <div className={areas ? styles.fadeIn : styles.fadeOut} style={{ position: 'fixed', top: `${windowDimensions.height / 2 + 32 + ySteps}px`, left: `${windowDimensions.width /2 + xSteps}px`,  zIndex: 3 }}>
                    {meetingsTiles}
                </div>
                
            </div>
        </div>
    );
}

export default Map;