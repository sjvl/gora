import Space from '../../components/Space';
import io from 'socket.io-client';


function SpaceId() {
    // const socket = io('http://localhost:3000/');
    // const socket = io('https://gora-back.vercel.app/');
    const socket = io('https://gora-gora-97ecbe0c.koyeb.app/');


    

    return <Space socket={socket}/>;
}

export default SpaceId;
