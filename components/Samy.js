import { useEffect, useState } from 'react';
import styles from '../styles/Player.module.css';


function Samy(props) {
    const [name, setName] = useState('Samuel')

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
        <div>
            <img className={styles.avatar} style={{ objectPosition: `-${frames}px` }} src='/sam.png' />
            <div className={styles.tooltip} style={{ top: `calc(50vh - ${20 * props.antiScale * props.antiScale }px - 64px)` }}>
                {props.cam ?
                    <div style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.5)', padding: `calc(${props.antiScale} * 4px)`, borderRadius: `calc(${props.antiScale} * 5px)` }}>
                        <img
                            style={{ objectFit: 'cover', backgroundColor: 'white', width:`calc(2* ${props.antiScale} * 64px)`, height:`calc(2* ${props.antiScale} * 48px)` }}
                            src='/cam.png'
                        />
                    </div>
                :
                    <div style={{ display: 'flex', padding: `calc(${props.antiScale} * 4px)`, borderRadius: `calc(${props.antiScale} * 5px)` }}>
                        <div style={{ width:`calc(2* ${props.antiScale} * 64px)`, height:`calc(2* ${props.antiScale} * 48px)` }}></div>
                    </div>
                }
                <p style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', fontSize: `calc(${props.antiScale} * 12px)`, padding: `calc(${props.antiScale} * 4px) calc(${props.antiScale} * 10px)`, borderRadius: `calc(${props.antiScale} * 10px)` }}>
                    {name}
                </p>
            </div>         
        </div>
    );
}

export default Samy;
