import { useState } from "react"; 

function Tile(props) {

    let color = 'transparent';
    if(props.isClicked === 1) color = 'purple'

    const handleClick = (id) => {
        props.selectWalls(id);
    };

    return (
        <div
            onClick={(e) => {
                handleClick(e.target.id);
                // console.log(e.target.id);
            }}
            id={`${props.x};${props.y}`}
            style={{
                width: 32,
                height: 32,
                position: 'absolute',
                top: props.y * 32,
                left: props.x * 32,
                zIndex: 3,
                border: '1px solid gray',
                boxSizing: 'border-box',
                opacity: '.5',
                backgroundColor: `${color}`
            }}
        >
        </div>
    )
}

export default Tile;