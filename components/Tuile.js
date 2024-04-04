import { useState } from "react";

function Tile(props) {
    const [isclicked, setIsClicked] = useState(false)

    let color = 'transparent';
    if(isclicked) color = 'purple'

    const handleClick = (id) => {
        props.selectWalls(id);
    };

    return (
        <div
            onClick={(e) => {
                setIsClicked(!isclicked);
                handleClick(e.target.id);
            }}
            id={`${props.x};${props.y}`}
            style={{
                width: 32,
                height: 32,
                position: 'absolute',
                top: props.y * 32,
                left: props.x * 32,
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