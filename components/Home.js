import styles from '../styles/Home.module.css';
import Loader from './Loader';
import Map from './Map';
import { useEffect, useState } from 'react';

function Home() {
    const [loading, setLoading] = useState(true)
    const [start, setStart] = useState({})

    useEffect(() => {
        // Ajouter la classe au body lorsque le composant est monté
        document.body.classList.add('bodyModified');

        return () => {
          // Supprimer la classe du body lorsque le composant est démonté
          document.body.classList.remove('bodyModified');
        };
    }, []);

    useEffect(() => {
        const getStart = () => {
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
        getStart();
    }, [])

    return (
        // <main className={styles.main}>
        <main style={{height: '100vh', display: 'flex', backgroundColor: 'black'}}>
            {loading && <Loader/>}
            {!loading && <Map start={start}/>}
        </main>
    );
}

export default Home;
