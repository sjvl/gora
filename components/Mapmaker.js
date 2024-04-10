import styles from '../styles/Space.module.css';
import React, { useEffect, useState, useRef } from 'react';
import Tilemaker from './Tilemaker'
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faEye, faFileExport, faFileImport, faMapMarker, faSave, faThLarge, faUsers } from '@fortawesome/free-solid-svg-icons';


function Mapmaker() {
    const router = useRouter();
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const gridSize = 32;
    const [specs, setSpecs] = useState([]);

    const [editWalls, setEditWalls] = useState(false);
    const [editStarts, setEditStarts] = useState(false);
    const [editAreas, setEditAreas] = useState(false);

    const [showGround, setShowGround] = useState(true);
    const [showForeground, setShowForeground] = useState(false);

    const fileInputRef = useRef(null);


    //edti tools
    const selectTile = (id) => {
        let coords = id.split(';');
        let x = parseInt(coords[0]);
        let y = parseInt(coords[1]);
        if(editWalls){
            let tmp = [...specs];
            if(tmp[y][x] === 0 || tmp[y][x] === 'S' || tmp[y][x] === 'A') {tmp[y][x] = 1} else tmp[y][x] = 0;
            setSpecs([...tmp]);
        }else if(editStarts){
            let tmp = [...specs];
            if(tmp[y][x] === 0) {tmp[y][x] = 'S'} else if(tmp[y][x] === 1) {tmp[y][x] = 1} else if(tmp[y][x] === 'A') {tmp[y][x] = 'A'} else tmp[y][x] = 0;
            setSpecs([...tmp]);
        }else if(editAreas){
            let tmp = [...specs];
            if(tmp[y][x] === 0) {tmp[y][x] = 'A'} else if(tmp[y][x] === 'S') {tmp[y][x] = 'S'} else if(tmp[y][x] === 1) {tmp[y][x] = 1} else tmp[y][x] = 0;
            setSpecs([...tmp]);
        }
    };

    //edit walls tool
    let editWallsStyle = '';
    if(editWalls) editWallsStyle = 'blueviolet';
    const handleEditWalls = () => {
        setEditWalls(!editWalls);
        if(editStarts) setEditStarts(!editStarts);
        if(editAreas) setEditAreas(!editAreas);
    }
    
    //edit starts tool
    let editStartsStyle = '';
    if(editStarts) editStartsStyle = 'blueviolet';
    const handleEditStarts = () => {
        setEditStarts(!editStarts);
        if(editWalls) setEditWalls(!editWalls);
        if(editAreas) setEditAreas(!editAreas);

    }

    //edit areas tool
    let editAreasStyle = '';
    if(editAreas) editAreasStyle = 'blueviolet';
    const handleEditAreas = () => {
        setEditAreas(!editAreas);
        if(editWalls) setEditWalls(!editWalls);
        if(editStarts) setEditStarts(!editStarts);
    }

    //show foreground button
    let showForegroundStyle = '';
    if(showForeground) showForegroundStyle = 'blueviolet';
    const handleShowForeground = () => {
        setShowForeground(!showForeground);
    }

    //show ground button
    let showGroundStyle = '';
    if(showGround) showGroundStyle = 'blueviolet';
    const handleShowGround = () => {
        setShowGround(!showGround);
    }

    //export json
    const exportJson = () => {
        //renverser data et structurer le futur json
        const flipped = specs[0].map((col, index) => specs.map(lin => lin[index]));
        const jsonData = { lin: flipped, col: specs };

        // Convertir le tableau en JSON
        const json = JSON.stringify(jsonData);

        // Créer un blob et un lien invisible
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'walls.json');

        // Simuler un clic sur le lien pour déclencher le téléchargement
        document.body.appendChild(link);
        link.click();

        // Nettoyer
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
    };

    //import json
    const importJson = () => {
        fileInputRef.current.click();
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const parsedJson = JSON.parse(text);
            if(parsedJson.col){
                if(parsedJson.col.length === imageSize.height/gridSize){
                    setSpecs(parsedJson.col);
                }else {alert("Oups.. This JSON doesn't match this map!");}
            }else {alert("Oups.. This JSON doesn't match this map!");}
        };
        if(file)reader.readAsText(file);
    };
  
    //load img & generate grid
    useEffect(() => {
        const loadImage = () => {
            const img = new Image();
            img.onload = () => {
                setImageSize({ width: img.width, height: img.height });

                let rows = img.height/gridSize;
                let cols = img.width/gridSize
                let array = new Array(rows).fill(0).map(function() {
                    return new Array(cols).fill(0);
                });
                setSpecs(array);

            };
            img.src = "floor.png"; 
        };
    
        loadImage();
    
        return () => {
            // Clean up
        };
    }, []);
    const gridSquares = specs.map((row,y) => row.map((col,x) => <Tilemaker selectTile={selectTile} key={`tile_${x}_${y}`} x={x} y={y} isClicked={col}/>));
    
    return (
        <div>
            <div style={{position: 'fixed', zIndex: 10, backgroundColor: 'white', width: '100%', height: '64px', display: 'flex', padding: '12px', alignItems: 'center', justifyContent: 'space-around'}}>
                <h2>map maker</h2>
                <div style={{display: 'flex'}}>
                    <button className={styles.button} style={{backgroundColor: `${editWallsStyle}`}} onClick={handleEditWalls}>
                        <FontAwesomeIcon style={{fontSize: '20px'}} icon={faThLarge}/>
                        <div className={styles.tooltip}>Edit&nbsp;walls</div>
                    </button>
                    <button className={styles.button} style={{backgroundColor: `${editStartsStyle}`}} onClick={handleEditStarts}>
                        <FontAwesomeIcon style={{fontSize: '20px'}} icon={faMapMarker}/>
                        <div className={styles.tooltip}>Edit&nbsp;starts</div>
                    </button>
                    <button className={styles.button} style={{backgroundColor: `${editAreasStyle}`}} onClick={handleEditAreas}>
                        <FontAwesomeIcon style={{fontSize: '20px'}} icon={faUsers}/>
                        <div className={styles.tooltip}>Edit&nbsp;areas</div>
                    </button>
                </div>
                <div style={{display: 'flex'}}>
                    <button className={styles.button} style={{backgroundColor: `${showGroundStyle}`}} onClick={handleShowGround}> 
                        <FontAwesomeIcon style={{fontSize: '20px'}} icon={faEye}/> 
                        <div className={styles.tooltip}>Ground&nbsp;visibility</div>
                    </button>
                    <button className={styles.button} style={{backgroundColor: `${showForegroundStyle}`}} onClick={handleShowForeground}> 
                        <FontAwesomeIcon style={{fontSize: '20px'}} icon={faEye}/> 
                        <div className={styles.tooltip}>Foreground&nbsp;visibility</div>
                    </button>
                </div>
                <div style={{display: 'flex'}}>
                    {/* <button>Import image</button> */}
                    <button className={styles.button} onClick={importJson}> 
                        <FontAwesomeIcon style={{fontSize: '20px'}} icon={faFileImport}/> 
                        <div className={styles.tooltip}>Import&nbsp;json</div>
                        <input type="file" accept="application/json" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange}/>
                    </button>
                    <button className={styles.button} onClick={() => exportJson()}> 
                        <FontAwesomeIcon style={{fontSize: '20px'}} icon={faFileExport}/> 
                        <div className={styles.tooltip}>Export&nbsp;json</div>
                    </button>
                </div>
                <div style={{display: 'flex'}}>
                    <button className={styles.button}> 
                        <FontAwesomeIcon style={{fontSize: '20px'}} icon={faSave}/>
                        <div className={styles.tooltip}>Contactez&nbsp;le backend&nbsp;dev</div>
                    </button>
                    <button className={styles.button} onClick={()=>{router.push("/")}}> 
                        <FontAwesomeIcon style={{fontSize: '20px'}} icon={faClose}/>
                        <div className={styles.tooltip}>Close&nbsp;map&nbsp;maker</div>
                    </button>
                </div>
            </div>

            <div style={{position: 'absolute', top: '64px', width: `${imageSize.width}`, height: `${imageSize.height}`}}>
                {showGround && <img src="floor.png" />}
                {showForeground && <img src="foreground.png" style={{position: 'absolute', top: '0px', zIndex: 2, opacity: '.4', filter: 'invert(50%) sepia(13%) saturate(3333%) hue-rotate(180deg) contrast(80%)'}}/>}
                {gridSquares}
            </div>
        </div>
    );
}

export default Mapmaker;
