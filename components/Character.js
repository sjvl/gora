import { useState, useEffect } from "react";

function Character(props) {
    const [frames, setFrames] = useState(-2)
    const [animating, setAnimating] = useState(0)

    const [x, setX] = useState(props.x);
    const [y, setY] = useState(props.y);

    // Fonctions pour animer les frames
    function handleMoove() {
        if(animating === 0){
            if(props.dir.startsWith("d")) {
                setFrames(-2);
                if (props.dir === 'down') {
                    animate(-2);
                }
            }
            if(props.dir.startsWith("u")) {
                setFrames(-194);
                if (props.dir === 'up') {
                    animate(-194);
                }
            }
            if(props.dir.startsWith("l")) {
                setFrames(-98);
                if (props.dir === 'left') {
                    animate(-98);
                }
            }
            if(props.dir.startsWith("r")) {
                setFrames(-290);
                if (props.dir === 'right') {
                    animate(-290);
                }
            }
        }

    }

    function animate(pos) {
        if(animating === 0){
            setAnimating(1);

            setTimeout(() => {
                setFrames(pos - 64)
            }, 53);
            setTimeout(() => {
                setFrames(pos - 32)
            }, 106);
            setTimeout(() => {
                setFrames(pos)
                setAnimating(0);
            }, 160);
        }   
    }

    // Fonction pour lisser les coordonnées
    const smoothMove = (targetX, targetY, duration) => {
        const start = Date.now();
        const startX = x;
        const startY = y;
  
        const updatePosition = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
  
          const currentX = startX + (targetX - startX) * progress;
          const currentY = startY + (targetY - startY) * progress;
  
          setX(currentX);
          setY(currentY);
  
          if (progress < 1) {
            requestAnimationFrame(updatePosition);
          }
        };
  
        updatePosition();
    };

    useEffect(() => {
        // Appel de la fonction d'animation
        handleMoove()
        // Appel de la fonction de lissage
        smoothMove(props.x, props.y, 160);
    }, [props.x, props.y, props.dir]);

    return (
        <div>
            <div style={{ position: 'fixed', top: `${props.top + (y * 32)}px`, left: `${props.left + (x * 32)}px` }}>
                <img style={{ width: '32px', height:'64px', objectFit: 'none', objectPosition: `${frames}px`}}
                    src={props.avatar}
                />
                {props.cam && 
                <span style={{ position: 'absolute', zIndex: 1, bottom: `${95 + props.antiScale * props.antiScale}%`, left: '50%', transform: 'translateX(-50%)' }}>
                    <img
                        style={{ objectFit: 'cover', backgroundColor: 'white', width: `${48 * props.antiScale}px`, borderRadius: `${3 * props.antiScale}px` }}
                        src='/cam.png'
                    />
                </span>}
                <span style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', fontSize: `${6 * props.antiScale}px`, textAlign: 'center', borderRadius: `${6 * props.antiScale}px`, padding: `${3 * props.antiScale}px ${6 * props.antiScale}px`, position: 'absolute', zIndex: 1, bottom: '75%', left: '50%', transform: 'translateX(-50%)' }}>
                    {props.name}
                </span>
            </div>
        </div>
    );
}

export default Character;
