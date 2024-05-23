import React, { useEffect, useRef, useState } from 'react';
// import socket from './socket';

const VideoChat = (props) => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [localStreamReady, setLocalStreamReady] = useState(false);
    const [offerQueue, setOfferQueue] = useState([]);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerRef = useRef(null);
    const candidatesQueue = useRef([]);

    useEffect(() => {
        // Join room
        // props.socket.emit('joinRoom', props.roomId);

        // Get user media
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                setLocalStream(stream);
                // localVideoRef.current.srcObject = stream;
                setLocalStreamReady(true);
                console.log('Local stream initialized');

                // Handle any offers that came in before the stream was ready
                offerQueue.forEach(handleOffer);
                setOfferQueue([]);
            }).catch(error => {
                console.error('Error accessing media devices.', error);
            });

        // Handle incoming signals
        props.socket.on('signal', async (data) => {
            if (data.type === 'offer') {
                if (localStreamReady) {
                    await handleOffer(data);
                } else {
                    console.log('Offer received before local stream was ready, queuing offer');
                    setOfferQueue(prevQueue => [...prevQueue, data]);
                }
            } else if (data.type === 'answer') {
                await handleAnswer(data);
            } else if (data.type === 'ice-candidate') {
                await handleIceCandidate(data);
            }
        });

        return () => {
            props.socket.off('signal');
        };
    }, [props.roomId, localStreamReady]);

    const createPeerConnection = () => {
        const peer = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        });

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                props.socket.emit('signal', {
                    type: 'ice-candidate',
                    candidate: event.candidate,
                    room: props.roomId
                });
            }
        };

        peer.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        };

        if (localStream) {
            localStream.getTracks().forEach(track => {
                peer.addTrack(track, localStream);
            });
        } else {
            console.error('Local stream is not available');
        }

        return peer;
    };

    useEffect(() => {
        if (remoteStream && remoteVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [peerRef, remoteStream, remoteVideoRef]);

    const handleOffer = async (data) => {
        if (!localStreamReady) {
            console.error('Local stream not initialized, cannot handle offer');
            return;
        }

        if (!peerRef.current) {
            peerRef.current = createPeerConnection();
        }

        if (peerRef.current.signalingState !== 'stable') {
            console.warn('Peer connection is not in stable state to handle offer');
            return;
        }

        await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerRef.current.createAnswer();
        await peerRef.current.setLocalDescription(answer);
        props.socket.emit('signal', {
            type: 'answer',
            answer: answer,
            room: props.roomId
        });

        // Process any candidates received before remote description was set
        while (candidatesQueue.current.length) {
            const candidate = candidatesQueue.current.shift();
            await peerRef.current.addIceCandidate(candidate);
        }
    };

    const handleAnswer = async (data) => {
        if (!peerRef.current) {
            console.warn('Peer connection not established yet');
            return;
        }

        if (peerRef.current.signalingState === 'have-local-offer') {
            await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        } else {
            console.warn('Peer connection is not in a state to handle answer');
        }
    };

    const handleIceCandidate = async (data) => {
        const candidate = new RTCIceCandidate(data.candidate);
        if (peerRef.current && peerRef.current.remoteDescription) {
            try {
                await peerRef.current.addIceCandidate(candidate);
            } catch (error) {
                console.error('Error adding received ice candidate', error);
            }
        } else {
            // Queue the candidates if the remote description is not set yet
            candidatesQueue.current.push(candidate);
        }
    };

    const startCall = async () => {
        if (!localStream) {
            console.error('Local stream not initialized');
            return;
        }

        if (!peerRef.current) {
            peerRef.current = createPeerConnection();
        }

        const offer = await peerRef.current.createOffer();
        await peerRef.current.setLocalDescription(offer);
        props.socket.emit('signal', {
            type: 'offer',
            offer: offer,
            room: props.roomId
        });
    };
    
    return (
        <div style={{position:'absolute', top:'90px', zIndex:1, width:'100vw', display:'flex', alignItems:'center', justifyContent:'center'}}>
            {remoteStream && <video style={{width:'200px', height:'140px', objectFit:'cover', borderRadius:'10px'}} ref={localVideoRef} autoPlay muted />}
            {remoteStream && <video style={{width:'200px', height:'140px', objectFit:'cover', borderRadius:'10px'}} ref={remoteVideoRef} autoPlay />}
            {!remoteStream && <button onClick={startCall}>Start Call</button>}
        </div>
    );
};

export default VideoChat;