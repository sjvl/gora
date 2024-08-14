import React, { useEffect, useRef, useState } from 'react';

const VideoChat2 = (props) => {

    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [localStreamReady, setLocalStreamReady] = useState(false);
    const [offerQueue, setOfferQueue] = useState([]);

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
                // console.log('Local stream initialized');

                // Handle any offers that came in before the stream was ready
                offerQueue.forEach(handleOffer);
                setOfferQueue([]);
            }).catch(error => {
                // console.error('Error accessing media devices.', error);
            });

        props.socket.on('signal', async (data) => {
            if (data.type === 'offer') {
                if (localStreamReady) {
                    await handleOffer(data);
                } else {
                    // console.log('Offer received before local stream was ready, queuing offer');
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
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' }
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
            // console.log('Remote stream received');
            setRemoteStream(event.streams[0]);
        };

        if (localStream) {
            localStream.getTracks().forEach(track => {
                peer.addTrack(track, localStream);
            });
        } else {
            // console.error('Local stream is not available');
        }

        return peer;
    };

    useEffect(() => {
        let videoCheckTimeout = null;
    
        if (remoteStream && remoteVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
            remoteVideoRef.current.srcObject = remoteStream;
    
            const videoTracks = remoteStream.getVideoTracks();
            const hasActiveVideo = videoTracks.some(track => track.enabled && track.readyState === 'live');
    
            if (!hasActiveVideo) {
                // console.warn('Remote stream has no active video tracks');
            } else {
                // Vérifier si la vidéo est en cours de lecture ou non
                remoteVideoRef.current.onplaying = () => {
                    // console.log('Remote video is playing');

                    if (videoCheckTimeout) {
                        clearTimeout(videoCheckTimeout);
                        videoCheckTimeout = null;
                    }
                };
    
                remoteVideoRef.current.onpause = () => {
                    // console.warn('Remote video is paused or not receiving data');
                    startVideoRecoveryCheck();
                };
    
                remoteVideoRef.current.onerror = (error) => {
                    // console.error('Error in remote video playback:', error);
                    startVideoRecoveryCheck();
                };
    
                const startVideoRecoveryCheck = () => {
                    // Attendre un court laps de temps avant de vérifier les dimensions pour éviter les faux positifs
                    if (videoCheckTimeout) clearTimeout(videoCheckTimeout);
                    videoCheckTimeout = setTimeout(() => {
                        checkVideoContent();
                    }, 210); 
                };
    
                const checkVideoContent = () => {
                    if (
                        remoteVideoRef.current &&
                        (remoteVideoRef.current.videoWidth === 0 || remoteVideoRef.current.videoHeight === 0)
                    ) {
                        // console.warn('Remote video is active but not displaying content (dimensions are 0)');
                        attemptRecovery();
                    }
                };
    
                // Vérification initiale après un léger délai pour laisser le temps aux métadonnées de se charger
                startVideoRecoveryCheck();
    
                // Vérification lors des événements de chargement des métadonnées et de redimensionnement
                remoteVideoRef.current.onloadedmetadata = startVideoRecoveryCheck;
                remoteVideoRef.current.onresize = checkVideoContent;
            }
        }
    
        return () => {
            if (videoCheckTimeout) clearTimeout(videoCheckTimeout);
        };
    }, [localStream, remoteStream]);
    
    const attemptRecovery = () => {
        // console.warn('Attempting to recover from a video stream issue...');
        
        // Arrêter le flux actuel et tenter de recréer la connexion
        if (peerRef.current) {
            peerRef.current.close();
            peerRef.current = null;
        }
        
        // Réinitialiser la connexion WebRTC et renvoyer l'offre
        resetConnection();
    };
    
    const handleOffer = async (data) => {
        if (!localStreamReady) {
            // console.error('Local stream not initialized, cannot handle offer');
            return;
        }
    
        if (!peerRef.current || peerRef.current.signalingState === 'closed') {
            peerRef.current = createPeerConnection();
        }
    
        // console.log('Current signaling state:', peerRef.current.signalingState);
        
        if (peerRef.current.signalingState !== 'stable') {
            // console.warn('Peer connection is not in a stable state to handle offer');
            return;
        }
    
        try {
            await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
            // console.log('Remote description set');
    
            const answer = await peerRef.current.createAnswer();
            await peerRef.current.setLocalDescription(answer);
            props.socket.emit('signal', {
                type: 'answer',
                answer: answer,
                room: props.roomId
            });
            // console.log('Answer sent');
    
            // Une fois la remoteDescription définie, traiter les candidats en file d'attente
            if (candidatesQueue.current.length > 0) {
                // console.log(`Adding ${candidatesQueue.current.length} queued candidates`);
            }
            while (candidatesQueue.current.length) {
                const candidate = candidatesQueue.current.shift();
                await peerRef.current.addIceCandidate(candidate);
            }
    
        } catch (error) {
            // console.error('Error handling offer:', error);
        }
    };
    
    const handleAnswer = async (data) => {
        if (!peerRef.current || peerRef.current.signalingState === 'closed') {
            // console.warn('Peer connection not established yet or is closed');
            return;
        }

        // console.log('Current signaling state (answer):', peerRef.current.signalingState);

        if (peerRef.current.signalingState === 'have-local-offer') {
            try {
                await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
                // console.log('Remote description set with answer');
            } catch (error) {
                // console.error('Error setting remote description with answer:', error);
            }
        } else {
            // console.warn('Peer connection is not in a state to handle answer');
        }
    };

    const handleIceCandidate = async (data) => {
        const candidate = new RTCIceCandidate(data.candidate);
        if (peerRef.current) {
            if (peerRef.current.remoteDescription && peerRef.current.remoteDescription.type) {
                try {
                    await peerRef.current.addIceCandidate(candidate);
                    // console.log('ICE candidate added');
                } catch (error) {
                    // console.error('Error adding received ice candidate', error);
                }
            } else {
                // console.log('Remote description not set yet, queuing candidate');
                candidatesQueue.current.push(candidate);
    
                // Check after a delay if the remote description is still not set
                setTimeout(async () => {
                    if (peerRef.current && (!peerRef.current.remoteDescription || !peerRef.current.remoteDescription.type)) {
                        // console.warn('Remote description still not set, attempting to reconnect');
                        await resetConnection();
                    }
                }, 200);
            }
        } else {
            // console.warn('Peer connection is not initialized when ICE candidate is received');
        }
    };

    const resetConnection = async () => {
        if (peerRef.current) {
            peerRef.current.close();
            peerRef.current = null;
        }
        // Re-initialize the peer connection
        peerRef.current = createPeerConnection();
    
        // Resend the offer
        await startCall();
    };

    const startCall = async () => {
        if (!localStream) {
            // console.error('Local stream not initialized');
            return;
        }

        if (!peerRef.current || peerRef.current.signalingState === 'closed') {
            peerRef.current = createPeerConnection();
        }

        // console.log('Starting call with signaling state:', peerRef.current.signalingState);

        try {
            const offer = await peerRef.current.createOffer();
            await peerRef.current.setLocalDescription(offer);
            props.socket.emit('signal', {
                type: 'offer',
                offer: offer,
                room: props.roomId
            });
            // console.log('Offer sent');
        } catch (error) {
            // console.error('Error starting call:', error);
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

export default VideoChat2;