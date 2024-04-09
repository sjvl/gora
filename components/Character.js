function Character(props) {

    return (
        <div style={{position: 'fixed', top: `${props.top}px`, left: `${props.left}px`}}>
            <img style={{width: '32px', height:'64px', objectFit: 'none', objectPosition: '0px'}}
                src='/sam.png'
            />
        </div>
    );
}

export default Character;
