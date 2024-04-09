function MeetTiles(props) {

    let color = 'transparent';
    if(props.isClicked !== 'A') color = 'black'

    return (
        <div
            id={`${props.x};${props.y}`}
            style={{
                width: 32,
                height: 32,
                position: 'absolute',
                top: props.y * 32,
                left: props.x * 32,
                backgroundColor: `${color}`
            }}
        >
        </div>
    )
}

export default MeetTiles;