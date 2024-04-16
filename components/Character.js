function Character(props) {
    let pos = -2;
    if(props.dir === 'right') pos = -290;
    if(props.dir === 'left') pos = -98;
    if(props.dir === 'up') pos = -194;

    return (
        <div>
            <div style={{ position: 'fixed', top: `${props.top}px`, left: `${props.left}px` }}>
                <img style={{ width: '32px', height:'64px', objectFit: 'none', objectPosition: `${pos}px` }}
                    src='/sam.png'
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
