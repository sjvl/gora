import Space from '../../components/Space';
import io from 'socket.io-client';
import { useEffect } from 'react';




function SpaceId() {

    const socket = io('http://localhost:3000/');
    // const socket = io('https://gora-back.vercel.app/');
    // const socket = io('https://gora-gora-97ecbe0c.koyeb.app/');

    useEffect(() => {        
        socket.on("connection", (socket) => {
          console.log("socket connected", socket);
        });
        return () => { socket.disconnect() }
    })

    


    

    return <Space socket={socket}/>;
}

export default SpaceId;
