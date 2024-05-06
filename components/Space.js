import styles from '../styles/Space.module.css';
import Loader from './Loader';
import Map from './Map';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideoCamera, faMicrophone, faMap } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { trashVisitSpace, visitSpace } from '../reducers/user';


function Space(props) {
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
    const [localSpace, setLocalSpace] = useState({})

    const [loading, setLoading] = useState(true)
    const [start, setStart] = useState({})
    const [goodId, setGoodId] = useState(false)
    const [isOwner, setIsOwner] = useState(false)

    const [avatars, setAvatars] = useState(['/sam.png', '/caro.png', '/nour.png', '/greg.png'])
    const [pseudo, setPseudo] = useState('')
    const [avatar, setAvatar] = useState('')
    const [hasJoined, setHasJoined] = useState(false)

    useEffect(()=>{
      if(props.socket){
        props.socket.on('connect', () => {
          console.log('Connected with socket ID:', props.socket.id);
          props.socket.emit('join', spaceId);
        });
      }
  
  
        // Il est important de fermer la connexion lorsque le composant est démonté
        return () => {
            props.socket.disconnect();
        };
    },[props.socket])


    useEffect(()=>{
      const visitedSpaces = user.visitedSpaces
      const visitedSpace = visitedSpaces.find(e => e._id === spaceId)
      let visitedAvatar = ''
      let visitedPseudo = ''
      if(visitedSpace){
        visitedAvatar = visitedSpace.localUser.avatar;
        visitedPseudo = visitedSpace.localUser.pseudo;
      }
      setPseudo(visitedPseudo);
      setAvatar(visitedAvatar)
      if(user.createdSpaces.find(e => e._id === spaceId)){
        setIsOwner(true)
      }else {setIsOwner(false)}
    },[spaceId])

    //disable scroll on body
    useEffect(() => {
        // Ajouter la classe au body lorsque le composant est monté
        document.body.classList.add('bodyModified');

        return () => {
          // Supprimer la classe du body lorsque le composant est démonté
          document.body.classList.remove('bodyModified');
        };
    }, []);

    //initialization
    const getStart = (json) => {
      setTimeout(() => {
        setLoading(false)
      }, 3000);
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
    }

    const invalidSpace = 
    <div style={{width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{fontSize: '48px'}}>404</div>
      <div>Oups.. you seem to be nowhere.</div>
    </div>

    useEffect(() => {
      // owner user
      if(space){
        // console.log(space)
          setLocalSpace({...space})
          setGoodId(true)
          // standard space
          if (space.walls.startsWith("/")){
            fetch('/walls.json',
              {headers : { 'Content-Type': 'application/json', 'Accept': 'application/json'}}
            )
            .then((data) => data.json())
            .then((json) => getStart(json))
          }
          // customized space
          else {
            let json = JSON.parse(space.walls)
            getStart(json);
          }
      }
      // visiting user
      else {
        if(spaceId){
          fetch(`https://gora-back.vercel.app/spaces/${spaceId}`)
          .then((data) => data.json())
          .then((data) => {
            //valid space
            if(data.result && data.space.length){
              setLocalSpace({...data.space[0]})
              setGoodId(true)
              let json = data.space[0].walls
              // standard space
              if(json.startsWith("/")) {
                fetch('/walls.json', 
                  {headers : { 'Content-Type': 'application/json', 'Accept': 'application/json'}}
                )
                .then((data) => data.json())
                .then((json) => getStart(json))
              }
              // customized space
              else {
                getStart(JSON.parse(json))
              }
            }
            //invalid space
            else {
              setGoodId(false)
              dispatch(trashVisitSpace(spaceId))
              setTimeout(() => {
                setLoading(false)
              }, 3000);
            }
          })
        }
      };
    },[space, spaceId])

    //modal avatar
    let choice = avatars.map((e,i) => 
    {if(e === avatar){
      return(
        <div key={i} className={styles.avatar} style={{opacity: '1', width: '80px', height: '80px', border: 'solid 3px mediumpurple'}}>
          <img
            onClick={(e) => setAvatar(e.target.id)}
            id={e}
            style={{transform: 'scale(2.5)', backgroundColor: 'white', objectPosition: `-233px -5px`}}
            src={e}
          />
        </div>
      )
    }else {
      return(
        <div key={i} className={styles.avatar}>
          <img
            onClick={(e) => setAvatar(e.target.id)}
            id={e}
            style={{transform: 'scale(2)', backgroundColor: 'white', objectPosition: `-257px -8px`}}
            src={e}
          />
        </div>
      )
    }
    })

    let avatarModal = 
    <div style={{position: 'absolute', color: 'white', zIndex: 2, width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgb(0,0,0)'}}>
      <h1>Welcome to {spaceName}</h1>
      <div style={{display: 'flex', alignItems: 'center'}}>
        {choice}
      </div>
      
      <input className={styles.modalinput} type="text" placeholder="your pseudo" onChange={(e) => setPseudo(e.target.value)} value={pseudo} />
      
      <button className={styles.button} style={{margin: '10px'}} onClick={() => {
        if(avatar && pseudo){
          dispatch( visitSpace({...localSpace, localUser: {avatar, pseudo}}) ); 
          setHasJoined(true)}
          const game = {room: spaceId, id: props.socket.id, name: pseudo, avatar: avatar, dir: 'd', X: start.x, Y: start.y};
          props.socket.emit('data', game);
        }}>JOIN</button>
    </div>;

    return (
        <main className={styles.main}>
          
            <div className={styles.menu}>
                <h1 className={styles.title} onClick={() => { user.id ? router.push(`/user/${user.id}`) : router.push(`/`) }}>g◍rá</h1>
                <div style={{display: 'flex'}}>
                  {!loading && goodId && hasJoined && <>
                    <div className={styles.button}>
                      <div style={{display: 'flex'}}>
                        <div className={styles.avatar} style={{height: '48px', width:'48px', opacity: 1, margin: '0 10px 0 0'}}>
                          <img
                              style={{transform: 'scale(1.4)', backgroundColor: 'white', objectPosition: `-311px -12px`}}
                              src={avatar}
                          />
                        </div>
                          <div style={{display:'flex', flexDirection: 'column', justifyContent: 'center'}}>
                            <span>{pseudo}</span>
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
                  </>}
                </div>
                <div style={{display: 'flex'}}>
                  {!loading && goodId && hasJoined && isOwner && <button onClick={()=>{router.push(`/map/${spaceId}/${spaceName}`)}} className={styles.button}>
                    <FontAwesomeIcon style={{fontSize: '20px'}} icon={faMap}/>
                    <div className={styles.tooltip}>Open&nbsp;map&nbsp;maker</div>
                  </button>}
                </div>
            </div>

            {!hasJoined  && goodId && avatarModal}

            {loading && <Loader/>}
            {!loading && !goodId && invalidSpace}
            {!loading && goodId && <Map socket={props.socket} start={start} pseudo={pseudo} avatar={avatar} />}
        </main>
    );
}

export default Space;