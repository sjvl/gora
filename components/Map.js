import styles from '../styles/Map.module.css';
import { useEffect, useState } from 'react';
import Player from './Player';
import Character from './Character';
import TileArea from './TileArea';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';


function Map(props) {

    const [windowDimensions, setWindowDimensions] = useState({ width: undefined, height: undefined });
    const router = useRouter();
    const id = router.query.id
    let spaceId
    let spaceName
    if(id){
      spaceId = id[0];
      spaceName = id[1]
    }
    const user = useSelector((state) => state.user.value);
    const spaces = user.createdSpaces
    const space = spaces.find(e => e._id === spaceId)

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
    const [meetingsTiles, setMeetingTiles] = useState(undefined)
    const [ground, setGround] = useState('/floor.png')
    const [foreground, setForeground] = useState('/foreground.png')

    const [data, setData] = useState([])
    // const [data, setData] = useState([{name: 'Mathieu', X: 11, Y: 12, dir: 'left', cam: false}, {name: 'Lionel', X: 14, Y: 14, dir: 'down' , cam: false}])

    
    const [areas, setAreas] = useState(false)
    const [cam, setCam] = useState(false)

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

    useEffect(() => {
        // owner user
        if(space){
            // standard space
            if (space.walls.startsWith("/")){
              fetch('/walls.json',
                {headers : { 'Content-Type': 'application/json', 'Accept': 'application/json'}}
              )
              .then((data) => data.json())
              .then((json) => {
                setWalls(json);
                const gridSquares = json.col.map((row,y) => row.map((col,x) => <TileArea key={`tile_${x}_${y}`} x={x} y={y} isClicked={col}/>));
                setMeetingTiles(gridSquares);
              })
            }
            // customized space
            else {
              let json = JSON.parse(space.walls)
              setWalls(json);
              const gridSquares = json.col.map((row,y) => row.map((col,x) => <TileArea key={`tile_${x}_${y}`} x={x} y={y} isClicked={col}/>));
              setMeetingTiles(gridSquares);
              setGround(space.ground);
              setForeground(space.foreground);
            }
        }
        // visiting user
        else {
          if(spaceId){
            fetch(`https://gora-back.vercel.app/spaces/${spaceId}`)
            .then((data) => data.json())
            .then((data) => {
                let json = data.space[0].walls
                // standard space
                if(json.startsWith("/")) {
                    fetch('/walls.json', 
                        {headers : { 'Content-Type': 'application/json', 'Accept': 'application/json'}}
                    )
                    .then((data) => data.json())
                    .then((json) => {
                        setWalls(json);
                        const gridSquares = json.col.map((row,y) => row.map((col,x) => <TileArea key={`tile_${x}_${y}`} x={x} y={y} isClicked={col}/>));
                        setMeetingTiles(gridSquares);
                    })
                }
                // customized space
                else {
                    json = JSON.parse(json);
                    setWalls(json);
                    const gridSquares = json.col.map((row,y) => row.map((col,x) => <TileArea key={`tile_${x}_${y}`} x={x} y={y} isClicked={col}/>));
                    setMeetingTiles(gridSquares);
                    setGround(data.space[0].ground);
                    setForeground(data.space[0].foreground);
                }
            })
          }
        };
      },[space, spaceId])

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
    // const getData = () => {
    //     fetch('https://gora-back.vercel.app/walls.json'
    //     ,{
    //       headers : { 
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //        }
    //     }
    //     )
    //     .then((data) => data.json())
    //     .then((json) => {
    //         setWalls(json);
    //         const gridSquares = json.col.map((row,y) => row.map((col,x) => <TileArea key={`tile_${x}_${y}`} x={x} y={y} isClicked={col}/>));
    //         setMeetingTiles(gridSquares);
    //     })
    // };

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
            meetX = data.map(e => e.X === futureCoord);
            meetY = data.map(e => e.Y === yCoords);
            stepsSetter = setXSteps;
            coordSetter = setXCoords;
            axisCoords = xCoords;
        } else if (dir === 'up' || dir === 'down') {
            futureTile = walls.lin[xCoords];
            futureCoord = yCoords - (dir === 'up' ? 1 : -1);
            meetX = data.map(e => e.X === xCoords);
            meetY = data.map(e => e.Y === futureCoord);
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
        data.forEach((otherPlayer) => {
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

                    //SOCKET EMIT
                    let tmpX = xCoords
                    let tmpY = yCoords
                    if(dir === 'left'){tmpX = xCoords -1}
                    if(dir === 'right'){tmpX = xCoords +1}
                    if(dir === 'up'){tmpY = yCoords -1}
                    if(dir === 'down'){tmpY = yCoords +1}
                    const game = {room: spaceId, id: props.socket.id, name: props.pseudo, avatar: props.avatar, dir, X: tmpX, Y: tmpY};
                    props.socket.emit('data', game);
                    //SOCKET EMIT
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
                //SOCKET EMIT
                const game = {room: spaceId, id: props.socket.id, name: props.pseudo, avatar: props.avatar, dir, X: xCoords, Y: yCoords};
                props.socket.emit('data', game);
                //SOCKET EMIT
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


    useEffect(()=>{

        // props.socket.on('join', playerid =>{
        //     console.log(playerid, 'join the room')
        //     const game = {room: spaceId, id: props.socket.id, name: props.pseudo, avatar: props.avatar, dir, X: xCoords, Y: yCoords};
        //     setTimeout(() => {
        //         props.socket.emit('data', game);
        //         console.log('emit data', game)
        //     }, 2000);
        // })

        props.socket.on('data', (update) => {
            // console.log('update', update)
            let tmpData = [...data]
            let tmp = tmpData.findIndex(e => e.id === update.id)
            if(tmp < 0){
                tmpData.push(update)
            }else {
                tmpData[tmp] = update
            }
            // console.log(tmpData)
            setData(tmpData)
        })

    },[data])

    const people = data.map((e,i) => <Character key={i} name={e.name} dir={e.dir} avatar={e.avatar} left={windowDimensions.width /2 + xSteps + (e.X * 32)} top={windowDimensions.height /2 + ySteps + (e.Y * 32)} cam={false} antiScale={antiScale} />);

    return (
        <div 
            onWheel={handleWheel}
            onTouchMove={handlePinch}
            style={{width: '100%', height: '100%', overflow: 'hidden', touchAction: 'none', position: 'relative'}}>
            <div style={{position :'fixed', transform: `scale(${scale})`, transformOrigin: '50vw 50vh'}}>
                <img style={{ position: 'fixed', top: `${windowDimensions.height / 2 + 32 + ySteps}px`, left: `${windowDimensions.width /2 + xSteps}px`, backgroundColor: 'whitesmoke'}}
                    src={ground}
                />

                <img style={{ position: 'fixed', top: `${windowDimensions.height / 2 + 32 + ySteps}px`, left: `${windowDimensions.width /2 + xSteps}px`, zIndex: 2 }}
                    src={foreground}
                />

                <div className={areas ? styles.fadeIn : styles.fadeOut} style={{ position: 'fixed', top: `${windowDimensions.height / 2 + 32 + ySteps}px`, left: `${windowDimensions.width /2 + xSteps}px`, zIndex: 2 }}>
                    {meetingsTiles}
                </div>
                
                {people}

                <Player dir={dir} moovable={moovable} cam={cam} antiScale={antiScale} pseudo={props.pseudo} avatar={props.avatar} />


                
                
            </div>
        </div>
    );
}

export default Map;