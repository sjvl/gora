import { useState } from "react";

function Tilemaker(props) {
    const [on, setOn] = useState(.2)

    let color = 'transparent';
    if(props.isClicked === 1) color = 'purple'
    if(props.isClicked === 'S') color = 'green'
    if(props.isClicked === 'A') color = 'orange'

    const handleClick = (id) => {
        props.selectTile(id);
    };

    return (
        <div
            onClick={(e) => {
                handleClick(e.target.id);
                // console.log(e.target.id);
            }}
            onMouseEnter={(e) => {
                    // handleClick(e.target.id);
                    setOn(1)
            }}
            onMouseLeave={(e) => {
                    // handleClick(e.target.id);
                    setOn(.2)
            }}
            id={`${props.x};${props.y}`}
            style={{
                width: 32,
                height: 32,
                position: 'absolute',
                top: props.y * 32,
                left: props.x * 32,
                zIndex: 3,
                border: `1px solid rgba(255, 255, 255, ${on})`,
                boxSizing: 'border-box',
                opacity: `.5`,
                backgroundColor: `${color}`
            }}
        >
        </div>
    )
}

export default Tilemaker;