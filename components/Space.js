import styles from '../styles/Home.module.css';
import TileArea from './TileArea';
import Loader from './Loader';
import Map from './Map';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideoCamera, faMicrophone, faMap } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

   


function Space() {
    const router = useRouter();
    const [loading, setLoading] = useState(true)
    const [start, setStart] = useState({})
    const [meetingsTiles, setMeetingsTiles] = useState(undefined)

    //disable scroll on body
    useEffect(() => {
        // Ajouter la classe au body lorsque le composant est monté
        document.body.classList.add('bodyModified');

        return () => {
          // Supprimer la classe du body lorsque le composant est démonté
          document.body.classList.remove('bodyModified');
        };
    }, []);

    //initialiszation
    //need connection to db and to webSocket
    useEffect(() => {
        const init = () => {
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
                setTimeout(() => {
                    setLoading(false)
                }, 3000);
                const gridSquares = json.col.map((row,y) => row.map((col,x) => <TileArea key={`tile_${x}_${y}`} x={x} y={y} isClicked={col}/>));
                console.log(gridSquares)
                setMeetingsTiles(gridSquares);
                let starts = [];
                for (let y = 0; y < json.col.length; y++) {
                  for (let x = 0; x < json.col[y].length; x++) {
                    if (json.col[y][x] === "S") {
                      starts.push([x, y]);
                    }
                  }
                };
                if(starts.length){
                  let max = starts.length -1;
                  let randCoords = Math.floor(Math.random() * (max + 1))
                  let randStart = starts[randCoords]
                  setStart({x: randStart[0], y: randStart[1]})
                }else setStart({x: 1, y: 1})
            })
        };
        init();
    }, [])

    return (
        <main className={styles.main}>
          <div className={styles.menu}>
                <h1 className={styles.title}>g◍rá</h1>
                <div style={{display: 'flex'}}>
                  <div className={styles.button}>
                    <div style={{display: 'flex'}}>
                        <img
                            height={'48px'}
                            width={'48px'}
                            style={{ objectFit: 'cover', backgroundColor: 'white', marginRight: '10px'}}
                            src='/cam.png'
                        />
                        <div style={{display:'flex', flexDirection: 'column', justifyContent: 'center'}}>
                          <span>Samuel</span>
                          <span style={{fontSize: '11px'}}>available</span>
                        </div>
                    </div>
                    <div className={styles.tooltip}>Update&nbsp;your&nbsp;status</div>
                  </div>
                  <button className={styles.button}>
                    <FontAwesomeIcon style={{fontSize: '20px'}} icon={faVideoCamera}/>
                    <div className={styles.tooltip}>Webcam&nbsp;activation</div>
                  </button>
                  <button className={styles.button}>
                    <FontAwesomeIcon style={{fontSize: '20px'}} icon={faMicrophone}/>
                    <div className={styles.tooltip}>Microphone&nbsp;activation</div>
                  </button>
                </div>
                <div style={{display: 'flex'}}>
                  <button onClick={()=>{router.push("/config")}} className={styles.button}>
                    <FontAwesomeIcon style={{fontSize: '20px'}} icon={faMap}/>
                    <div className={styles.tooltip}>Open&nbsp;map&nbsp;maker</div>
                  </button>
                </div>

            </div>
            {loading && <Loader/>}
            {!loading && <Map meetingsTiles={meetingsTiles} start={start}/>}
        </main>
    );
}

export default Space;
