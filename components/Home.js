import styles from '../styles/Home.module.css';
import Intile from './Intile';
import Loader from './Loader';
import Map from './Map';
import { useEffect, useState } from 'react';

function Home() {
    const [loading, setLoading] = useState(true)
    const [start, setStart] = useState({})
    const [meetingsTiles, setMeetingsTiles] = useState(undefined)

    useEffect(() => {
        // Ajouter la classe au body lorsque le composant est monté
        document.body.classList.add('bodyModified');

        return () => {
          // Supprimer la classe du body lorsque le composant est démonté
          document.body.classList.remove('bodyModified');
        };
    }, []);

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
                }, 2000);
                const gridSquares = json.col.map((row,y) => row.map((col,x) => <Intile key={`tile_${x}_${y}`} x={x} y={y} isClicked={col}/>));
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
                <h2 className={styles.title}>gorà</h2>
                <div className={styles.profile}>
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
                </div>
            </div>
            {loading && <Loader/>}
            {!loading && <Map meetingsTiles={meetingsTiles} start={start}/>}
        </main>
    );
}

export default Home;
