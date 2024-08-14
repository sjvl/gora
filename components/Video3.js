import React, { useEffect, useRef, useState } from 'react';

const VideoChat3 = (props) => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [localStreamReady, setLocalStreamReady] = useState(false);
    const [offerQueue, setOfferQueue] = useState([]);
    const [isNegotiating, setIsNegotiating] = useState(false); // Pour empêcher les négociations simultanées

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerRef = useRef(null);
    const candidatesQueue = useRef([]);

    useEffect(() => {
        if (!props.cam) {
            setRemoteStream(null);
            setOfferQueue([]);
        }
    }, [props.cam]);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                setLocalStream(stream);
                setLocalStreamReady(true);
                console.log('Local stream initialized');

                // Handle any offers that came in before the stream was ready
                offerQueue.forEach(handleOffer);
                setOfferQueue([]);
            }).catch(error => {
                console.error('Error accessing media devices.', error);
            });

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
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
            if (peerRef.current) {
                peerRef.current.close();
                peerRef.current = null;
            }
        };
    }, [props.roomId, localStreamReady, props.cam]);

    const createPeerConnection = () => {
        if (peerRef.current) {
            peerRef.current.close();
            peerRef.current = null;
        }

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
            console.log('Remote stream received');
            setRemoteStream(event.streams[0]);
        };

        peer.onnegotiationneeded = async () => {
            if (isNegotiating) {
                console.log('Already negotiating, skip this event');
                return;
            }

            setIsNegotiating(true);

            try {
                const offer = await peer.createOffer();
                await peer.setLocalDescription(offer);
                props.socket.emit('signal', {
                    type: 'offer',
                    offer: offer,
                    room: props.roomId
                });
                console.log('Offer sent');
            } catch (error) {
                console.error('Error during negotiation:', error);
            } finally {
                setIsNegotiating(false);
            }
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

        props.socket.on('remove', (id) => {
            console.log(id, 'leave RTC');
            if (remoteStream) {
                remoteStream.getTracks().forEach(track => track.stop());
            }
            if (peerRef.current) {
                peerRef.current.close();
                peerRef.current = null;
            }
            setRemoteStream(null);
        });
    }, [localStream, remoteStream]);

    const handleOffer = async (data) => {
        if (!localStreamReady) {
            console.error('Local stream not initialized, cannot handle offer');
            return;
        }

        if (!peerRef.current || peerRef.current.signalingState === 'closed') {
            peerRef.current = createPeerConnection();
        }

        console.log('Current signaling state:', peerRef.current.signalingState);

        if (peerRef.current.signalingState !== 'stable') {
            console.warn('Peer connection is not in a stable state to handle offer');
            return;
        }

        try {
            await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
            console.log('Remote description set');
            const answer = await peerRef.current.createAnswer();
            await peerRef.current.setLocalDescription(answer);
            props.socket.emit('signal', {
                type: 'answer',
                answer: answer,
                room: props.roomId
            });
            console.log('Answer sent');
        } catch (error) {
            console.error('Error handling offer:', error);
        }

        while (candidatesQueue.current.length) {
            const candidate = candidatesQueue.current.shift();
            await peerRef.current.addIceCandidate(candidate);
        }
    };

    const handleAnswer = async (data) => {
        if (!peerRef.current || peerRef.current.signalingState === 'closed') {
            console.warn('Peer connection not established yet or is closed');
            return;
        }

        console.log('Current signaling state (answer):', peerRef.current.signalingState);

        if (peerRef.current.signalingState === 'have-local-offer') {
            try {
                await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
                console.log('Remote description set with answer');
            } catch (error) {
                console.error('Error setting remote description with answer:', error);
            }
        } else {
            console.warn('Peer connection is not in a state to handle answer');
        }
    };

    const handleIceCandidate = async (data) => {
        const candidate = new RTCIceCandidate(data.candidate);
        if (peerRef.current && peerRef.current.remoteDescription) {
            try {
                await peerRef.current.addIceCandidate(candidate);
                console.log('ICE candidate added');
            } catch (error) {
                console.error('Error adding received ice candidate', error);
            }
        } else {
            candidatesQueue.current.push(candidate);
            console.log('ICE candidate queued');
        }
    };

    const startCall = async () => {
        if (!localStream) {
            console.error('Local stream not initialized');
            return;
        }

        if (!peerRef.current || peerRef.current.signalingState === 'closed') {
            peerRef.current = createPeerConnection();
        }

        try {
            const offer = await peerRef.current.createOffer();
            await peerRef.current.setLocalDescription(offer);
            props.socket.emit('signal', {
                type: 'offer',
                offer: offer,
                room: props.roomId
            });
            console.log('Offer sent');
        } catch (error) {
            console.error('Error during offer creation:', error);
        }
    };

    useEffect(() => {
        if (props.cam && localStream && !remoteStream) {
            startCall();
        }
    }, [props.cam, localStream, remoteStream]);

    return (
        <div style={{position:'absolute', top:'90px', zIndex:5, width:'100vw', display:'flex', alignItems:'center', justifyContent:'center'}}>
            {props.cam && remoteStream && <video style={{width:'200px', height:'140px', objectFit:'cover', borderRadius:'10px'}} ref={localVideoRef} autoPlay muted />}
            {props.cam && remoteStream && <video style={{width:'200px', height:'140px', objectFit:'cover', borderRadius:'10px'}} ref={remoteVideoRef} autoPlay />}
        </div>
    );
};

export default VideoChat3;
