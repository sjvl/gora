import React, { useEffect, useState, useRef } from 'react';
import Tuile from './Tuile'

function Mapmaker() {
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const gridSize = 32;
    const [walls, setWalls] = useState([]);
    
    const fileInputRef = useRef(null);


    const selectWalls = (id) => {
        let coords = id.split(';');
        let x = parseInt(coords[0]);
        let y = parseInt(coords[1]);
        let tmp = [...walls];
        if(tmp[y][x] === 0) {tmp[y][x] = 1} else {tmp[y][x] = 0};
        setWalls([...tmp]);
    };

    const exportJson = () => {
        //renverser data et structurer le futur json
        const flipped = walls[0].map((col, index) => walls.map(lin => lin[index]));
        const jsonData = { lin: flipped, col: walls };

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

    const importJson = () => {
        fileInputRef.current.click();
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const parsedJson = JSON.parse(text);
            if(parsedJson.col){
                if(parsedJson.col.length === imageSize.height/gridSize){
                    setWalls(parsedJson.col);
                }else {alert("Oups.. This JSON doesn't match this map!");}
            }else {alert("Oups.. This JSON doesn't match this map!");}
        };
        if(file)reader.readAsText(file);
    };
  
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
                setWalls(array);

            };
            img.src = "floor.png"; 
        };
    
        loadImage();
    
        return () => {
            // Clean up
        };
    }, []);
    
    const gridSquares = walls.map((row,y) => row.map((col,x) => <Tuile selectWalls={selectWalls} key={`tile_${x}_${y}`} x={x} y={y} isClicked={col}/>))
    
    return (
        <div>
            <div style={{position: 'fixed', zIndex: 10, backgroundColor: 'white', width: '100%', height: '64px', display: 'flex', padding: '12px', alignItems: 'center', justifyContent: 'space-around'}}>
                <h2>map maker</h2>
                <div>
                    {/* <button>Import image</button> */}
                    <button onClick={importJson}>Import walls</button>
                    <input type="file" accept="application/json" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange}/>
                    <button onClick={() => exportJson()} >Export walls</button>
                </div>
            </div>

            <div style={{position: 'absolute', top: '64px', width: `${imageSize.width}`, height: `${imageSize.height}`}}>
                <img src="floor.png" />
                <img src="front.png" style={{position: 'absolute', top: '0px', zIndex: 2, opacity: '.4', filter: 'invert(48%) sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%)'}}/>
                {gridSquares}
            </div>
        </div>
    );
}

export default Mapmaker;
