import React, { useEffect, useState, useRef } from 'react';
import Tuile from './Tuile'

function Mapmaker() {
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [gridSize, setGridSize] = useState(32); // Taille d'une cellule de la grille
    const [jsonImport, setJsonImport] = useState(null);
    const fileInputRef = useRef(null);


    const selectWalls = (id) => {
        let coords = id.split(';'); // Divise la chaîne en fonction du point-virgule
        let x = parseInt(coords[0]); // Convertit la première partie en nombre
        let y = parseInt(coords[1]); // Convertit la deuxième partie en nombre
        if(data[y][x] === 0) {data[y][x] = 1} else {data[y][x] = 0} 
    };

    const exportJson = () => {
        //renverser data et structurer le futur json
        const flipped = data[0].map((col, index) => data.map(lin => lin[index]));
        const jsonData = { lin: flipped, col: data };

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

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target.result;
            try {
                const parsedJson = JSON.parse(text);
                setJsonImport(parsedJson);
            } catch (error) {
                console.error('Erreur lors de l\'analyse JSON :', error);
            }
        };
        reader.readAsText(file);
    };

    useEffect(()=>{
        console.log(jsonImport)
    },[jsonImport])
  
    useEffect(() => {
        const loadImage = () => {
            const img = new Image();
            img.onload = () => {
            setImageSize({ width: img.width, height: img.height });
            };
            img.src = "floor.png";
        };
    
        loadImage();
    
        return () => {
            // Clean up
        };
    }, []);
  
    const data = []
    const gridSquares = [];
    for (let y = 0; y < imageSize.height / gridSize; y++) {
        data.push([])
        for (let x = 0; x < imageSize.width / gridSize; x++) {
            data[y].push(0)
            gridSquares.push(<Tuile selectWalls={selectWalls} key={`tile_${x}_${y}`} x={x} y={y} />);
        }
    };
  
    return (
        <div>
            <div style={{position: 'fixed', zIndex: 2, backgroundColor: 'white', width: '100%', height: '64px', display: 'flex', padding: '12px', alignItems: 'center', justifyContent: 'space-around'}}>
                <h2>map maker</h2>
                <div>
                    <button>Import image</button>
                    <button onClick={importJson}>Import walls</button>
                    <input type="file" accept="application/json" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange}/>
                    <button onClick={() => exportJson()} >Export walls</button>
                </div>
            </div>

            <div style={{position: 'absolute', top: '64px', width: `${imageSize.width}`, height: `${imageSize.height}`}}>
                <img src="floor.png" />
                {/* <img src="front.png" /> */}
                {gridSquares}
            </div>
        </div>
    );
}

export default Mapmaker;
