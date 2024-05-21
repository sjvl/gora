import { useEffect, useState } from 'react';
import styles from '../styles/Player.module.css';
import VideoChat from './Video';


function Player(props) {
    const [frames, setFrames] = useState(2)
    const [animating, setAnimating] = useState(0)


    function handleMoove() {
        if(animating === 0){
            if(props.dir.startsWith("d")) {
                setFrames(2);
                if (props.dir === 'down' && props.moovable) {
                    animate(2);
                }
            }
            if(props.dir.startsWith("u")) {
                setFrames(194);
                if (props.dir === 'up' && props.moovable) {
                    animate(194);
                }
            }
            if(props.dir.startsWith("l")) {
                setFrames(98);
                if (props.dir === 'left' && props.moovable) {
                    animate(98);
                }
            }
            if(props.dir.startsWith("r")) {
                setFrames(290);
                if (props.dir === 'right' && props.moovable) {
                    animate(290);
                }
            }
        }

    }
    function animate(pos) {
        if(animating === 0){
            setAnimating(1);

            setTimeout(() => {
                setFrames(pos + 64)
            }, 53);
            setTimeout(() => {
                setFrames(pos + 32)
            }, 106);
            setTimeout(() => {
                setFrames(pos)
                setAnimating(0);
            }, 160);

            // setTimeout(() => {
            //     setFrames(pos + 32)
            // }, 40);
            // setTimeout(() => {
            //     setFrames(pos)
            // }, 80);
            // setTimeout(() => {
            //     setFrames(pos + 64)
            // }, 120);
            // setTimeout(() => {
            //     setFrames(pos)
            //     setAnimating(0);
            // }, 160);
            
        }
        
    }

    useEffect(() => {
        handleMoove()
    }, [props.dir]);

    return (
        <div className={styles.avatar}>
            <img  style={{ zIndex: 1, width:'32px', height:'64px', objectPosition: `-${frames}px`,  objectFit: 'none' }} 
                src={props.avatar} 
            />
            {props.cam && 
            <span style={{ position: 'absolute', zIndex: 4, bottom: `${95 + props.antiScale * props.antiScale}%`, left: '50%', transform: 'translateX(-50%)' }}>
                {/* <VideoChat roomId={props.roomId} socket={props.socket}/> */}
                
                <img
                    style={{ objectFit: 'cover', backgroundColor: 'white', width: `${48 * props.antiScale}px`, borderRadius: `${3 * props.antiScale}px` }}
                    src='/cam.png'
                />
            </span>}
            <span style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 5, color: 'white', fontSize: `${6 * props.antiScale}px`, textAlign: 'center', borderRadius: `${6 * props.antiScale}px`, padding: `${3 * props.antiScale}px ${6 * props.antiScale}px`, position: 'absolute', bottom: '75%', left: '50%', transform: 'translateX(-50%)' }}>
                {props.pseudo}
            </span>
        </div>
    );
}

export default Player;
