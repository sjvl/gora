import styles from '../styles/Space.module.css';
import React, { useEffect, useState, useRef } from 'react';
import Tilemaker from './Tilemaker'
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faEye, faFileExport, faFileImage, faFileImport, faImage, faLayerGroup, faMapMarker, faSave, faThLarge, faUsers } from '@fortawesome/free-solid-svg-icons';
import { updateSpace } from '../reducers/user';


function Mapconfig() {
    const dispatch = useDispatch(); 
    const router = useRouter();
    const user = useSelector((state) => state.user.value);
    const id = router.query.id
    let spaceId
    let spaceName
    if(id){
      spaceId = id[0];
      spaceName = id[1]
    }
    const spaces = user.createdSpaces
    const space = spaces.find(e => e._id === spaceId)

    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const gridSize = 32;
    const [specs, setSpecs] = useState([]);

    const [editWalls, setEditWalls] = useState(false);
    const [editStarts, setEditStarts] = useState(false);
    const [editAreas, setEditAreas] = useState(false);

    const [showGround, setShowGround] = useState(true);
    const [showForeground, setShowForeground] = useState(false);

    const fileInputRef = useRef(null);


    //read existing map
    useEffect(()=>{
        if(space && space.ground){setGround(space.ground)}
        if(space && space.foreground){setForeground(space.foreground)}
        if(space && space.walls){
            //standard space
            if (space.walls.startsWith("/")){
                fetch(space.walls)
                .then(res => res.json())
                .then(data => {
                    setSpecs(data.col)
                })
            }
            //custom space
            else{
                let data = JSON.parse(space.walls)
                setSpecs(data.col)
            }
        }
    },[space])


    //edit tools
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

    //import ground image
    const imputGroundImage = useRef(null);
    const [alert, setAlert] = useState();
    const [ground, setGround] = useState();

    const handleGroundImg = () => {
        imputGroundImage.current.click();
        setAlert();
    };
    const groundToDataUrl = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const file = e.target.files[0];
        if(file.size > 4000000){
            //need to resize if > 4Mo
            setAlert(
                <div style={{position: 'absolute', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '50vw', height: '20vh', top: '20vh', left: '25%', zIndex: 10, borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, .7)'}}>
                    <div>File is too big!</div>
                    <div>4 Mo max size.</div>
                </div>
            );
            imputGroundImage.current.value = "";
            setTimeout(function () {
                setAlert();
            }, 3000);
        }
        else
        {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => { 
                fetch('https://gora-back.vercel.app/upload', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ imageDataUrl: reader.result })
                })
                .then((response) => response.json())
                .then((data) => {
                // console.log(data)
                // console.log(data.imageUrl)
                setGround(data.imageUrl);
                });
            };
        }
    }

    //import foreground image
    const inputForegroundImage = useRef(null);
    const [foreground, setForeground] = useState();

    const handleForgroundImg = () => {
        inputForegroundImage.current.click();
        setAlert();
    };
    const foregroundToDataUrl = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const file = e.target.files[0];
        if(file.size > 4000000){
            //need to resize if > 4Mo
            setAlert(
                <div style={{position: 'absolute', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '50vw', height: '20vh', top: '20vh', left: '25%', zIndex: 10, borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, .7)'}}>
                    <div>File is too big!</div>
                    <div>4 Mo max size.</div>
                </div>
            );
            inputForegroundImage.current.value = "";
            setTimeout(function () {
                setAlert();
            }, 3000);
        }
        else
        {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => { 
                fetch('https://gora-back.vercel.app/upload', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ imageDataUrl: reader.result })
                })
                .then((response) => response.json())
                .then((data) => {
                // console.log(data)
                // console.log(data.imageUrl)
                setForeground(data.imageUrl);
                handleShowForeground();
                });
            };
        }
    }


    //show foreground button
    let showForegroundStyle = '';
    if(showForeground) showForegroundStyle = 'blueviolet';
    const handleShowForeground = () => {
        setShowForeground(!showForeground);
    }

    //save modifications
    const handleSave = () => {
        //generate walls.json
        const flipped = specs[0].map((col, index) => specs.map(lin => lin[index]));
        const jsonData = { lin: flipped, col: specs };
        const json = JSON.stringify(jsonData);

        // console.log('save')
        // console.log('token:', user.token)
        // console.log('_id:', spaceId)
        // console.log('ground:', ground)
        // console.log('foreground:', foreground)
        // console.log('walls:', json)

        fetch('https://gora-back.vercel.app/spaces/update', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token: user.token, _id: spaceId, ground: ground, foreground: foreground, walls: json }),
            // body: JSON.stringify({ token: user.token, _id: spaceId, ground: ground }),
		})
        .then(response => response.json())
        .then(resp => {
            dispatch(updateSpace({_id: spaceId, ground: ground, foreground: foreground, walls: json}))
        })
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
            img.src = ground; 
        };
    
        loadImage();
    
        return () => {
            // Clean up
        };
    }, [ground]);
    const gridSquares = specs.map((row,y) => row.map((col,x) => <Tilemaker selectTile={selectTile} key={`tile_${x}_${y}`} x={x} y={y} isClicked={col}/>));
    
    return (
        <div>
            <div className={styles.menu}>
                <h1 className={styles.title} onClick={() => { user.id ? router.push(`/user/${user.id}`) : router.push(`/`) }}>g◍rá</h1>
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
                    <button className={styles.button} onClick={handleGroundImg}>
                        <FontAwesomeIcon style={{fontSize: '20px'}} icon={faFileImage}/>
                        <input type='file' accept="image/*" ref={imputGroundImage} onChange={(e)=>{ e.target.files[0] && (groundToDataUrl(e)); }}style={{display: 'none'}}/>
                        <div className={styles.tooltip}>upload&nbsp;new&nbsp;ground</div>
                    </button>
                    {alert}

                    <button className={styles.button} onClick={handleForgroundImg}>
                        <FontAwesomeIcon style={{fontSize: '20px'}} icon={faFileImage}/>
                        <input type='file' accept="image/*" ref={inputForegroundImage} onChange={(e)=>{ e.target.files[0] && (foregroundToDataUrl(e)); }}style={{display: 'none'}}/>
                        <div className={styles.tooltip}>upload&nbsp;new&nbsp;foreground</div>
                    </button>

                    <button className={styles.button} style={{backgroundColor: `${showForegroundStyle}`}} onClick={handleShowForeground}> 
                        <FontAwesomeIcon style={{fontSize: '20px'}} icon={faLayerGroup}/> 
                        <div className={styles.tooltip}>Foreground&nbsp;visibility</div>
                    </button>
                </div>

                <div style={{display: 'flex'}}>
                    <button className={styles.button} onClick={()=>handleSave()}> 
                        <FontAwesomeIcon style={{fontSize: '20px'}} icon={faSave}/>
                        <div className={styles.tooltip}>Save&nbsp;changes</div>
                    </button>
                    <button className={styles.button} onClick={()=>{router.push(`/space/${spaceId}/${spaceName}`)}}> 
                        <FontAwesomeIcon style={{fontSize: '20px'}} icon={faClose}/>
                        <div className={styles.tooltip}>Close&nbsp;map&nbsp;maker</div>
                    </button>
                </div>
            </div>
            
            <div style={{position: 'absolute', top: '64px', width: `${imageSize.width}`, height: `${imageSize.height}`}}>
                {showGround && <img src={ground} />}
                {showForeground && <img src={foreground} style={{position: 'absolute', top: '0px', zIndex: 2, opacity: '.4', filter: 'invert(50%) sepia(13%) saturate(3333%) hue-rotate(180deg) contrast(80%)'}}/>}
                {gridSquares}
            </div>
        </div>
    );
}

export default Mapconfig;
