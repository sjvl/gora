import React, { useEffect, useRef, useState } from 'react';
// import socket from './socket';

const VideoChat = (props) => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerRef = useRef(null);

    useEffect(() => {
        // Join room
        // props.socket.emit('joinRoom', props.roomId);

        // Get user media
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                setLocalStream(stream);
                localVideoRef.current.srcObject = stream;
            }).catch(error => {
                console.error('Error accessing media devices.', error);
            });

        // Handle incoming signals
        props.socket.on('signal', async (data) => {
            if (data.type === 'offer') {
                await handleOffer(data);
            } else if (data.type === 'answer') {
                await handleAnswer(data);
            } else if (data.type === 'ice-candidate') {
                await handleIceCandidate(data);
            }
        });

        return () => {
            props.socket.off('signal');
        };
    }, [props.roomId]);

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
            remoteVideoRef.current.srcObject = event.streams[0];
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

    const handleOffer = async (data) => {
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
    };

    const handleAnswer = async (data) => {
        if (peerRef.current && peerRef.current.signalingState === 'have-local-offer') {
            await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        } else {
            console.warn('Peer connection is not in a state to handle answer');
        }
    };

    const handleIceCandidate = async (data) => {
        try {
            await peerRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (error) {
            console.error('Error adding received ice candidate', error);
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
        <div style={{zIndex:1, width:'100vw', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
            <video width={'150px'} ref={localVideoRef} autoPlay muted />
            <video width={'200px'} ref={remoteVideoRef} autoPlay />
            <button onClick={startCall}>Start Call</button>
        </div>
    );
};

export default VideoChat;