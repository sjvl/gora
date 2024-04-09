import { useEffect, useState } from 'react';
import Samy from './Samy';

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
    const [cam, setCam] = useState(false)

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
    const [antiScale, setAntiScale] = useState(.5);
    const min = .5;
    const max = 3;

    const remap = (value) => {
        return max + (min - max) * ((value - min) / (max - min));
        //return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
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
    const handleResize = () => {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
    };


    function moveX(dir) {
        //check if a move in X is possible depending of dir
        let mooveX = walls.col[yCoords];
        let futureX = xCoords - dir;
        let go = false;
        if(mooveX[futureX] !== 1) go = true;
        setMoovable(go);
        let cam = false;
        if(mooveX[futureX] === 'A' || (mooveX[xCoords] === 'A' && mooveX[futureX] === 1) ) cam = true;
        setCam(cam);

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
        setMoovable(go);
        let cam = false;
        if(mooveY[futureY] === 'A' || (mooveY[yCoords] === 'A' && mooveY[futureY] === 1) ) cam = true;
        setCam(cam);

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
                if(e.key === 'ArrowDown') {moveY(-1); setDir('down');}
                if(e.key === 'ArrowUp') {moveY(+1); setDir('up');}
                if(e.key === 'ArrowLeft') {moveX(+1); setDir('left');}
                if(e.key === 'ArrowRight') {moveX(-1); setDir('right');}
            }else {
                if(e.key === 'ArrowDown') setDir('d');
                if(e.key === 'ArrowUp') setDir('u');
                if(e.key === 'ArrowLeft') setDir('l');
                if(e.key === 'ArrowRight') setDir('r');
            }
        }
    }

    useEffect(() => {    
        // console.log(dir, 'from map')
        // console.log(xCoords, yCoords)
        document.addEventListener('keydown', handleKeyDown);
            
        // Don't forget to clean up
        return function cleanup() {
          document.removeEventListener('keydown', handleKeyDown);
          setDir('')
        }
    }, [xCoords, yCoords, xSteps, ySteps, mapMooving, walls]);



    return (
        <div 
            onWheel={handleWheel}
            onTouchMove={handlePinch}
            style={{width: '100%', height: '100%', overflow: 'hidden', touchAction: 'none', position: 'relative'}}>
            <div style={{position :'fixed', transform: `scale(${scale})`, transformOrigin: '50vw 50vh'}}>
                <img style={{ position: 'fixed', top: `${windowDimensions.height / 2 + 32 + ySteps}px`, left: `${windowDimensions.width /2 + xSteps}px`, backgroundColor: 'whitesmoke'}}
                    src='/floor.png' 
                />

                <Samy dir={dir} moovable={moovable} cam={cam} antiScale={antiScale}/>

                <div style={{ position: 'fixed', top: `${windowDimensions.height / 2 + 32 + ySteps}px`, left: `${windowDimensions.width /2 + xSteps}px` }}>
                    {cam && meetingsTiles}
                </div>

                <img style={{ position: 'fixed', top: `${windowDimensions.height / 2 + 32 + ySteps}px`, left: `${windowDimensions.width /2 + xSteps}px`, zIndex: 2 }}
                    src='/foreground.png' 
                />
                
            </div>
        </div>
    );
}

export default Map;
