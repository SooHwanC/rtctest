import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';

const ScreenShare = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [myStream, setMyStream] = useState(null);
  const [captureStream, setCaptureStream] = useState(null);
  const videoRef = useRef(null);

  const socket = io(); // 서버에 연결

  useEffect(() => {
    // 미디어 스트림 가져오기
    const getMedia = async () => {
      try {
        const initialConstraints = { audio: true, video: { facingMode: 'user' } };
        const stream = await navigator.mediaDevices.getUserMedia(initialConstraints);
        setMyStream(stream);
      } catch (error) {
        console.error(error);
      }
    };

    getMedia(); // 컴포넌트 마운트 시 미디어 스트림 가져오기

    return () => {
      // 컴포넌트 언마운트 시 미디어 스트림 해제
      myStream && myStream.getTracks().forEach(track => track.stop());
    };
  }, []);

  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      setCaptureStream(stream);
      videoRef.current.srcObject = stream;
      setIsSharing(true);
      socket.emit('screen-sharing', true); // 서버에 화면 공유 시작 이벤트 전송
    } catch (error) {
      console.error(error);
    }
  };

  const stopCapture = () => {
    captureStream.getTracks().forEach(track => track.stop());
    setCaptureStream(null);
    videoRef.current.srcObject = myStream;
    setIsSharing(false);
    socket.emit('screen-sharing', false); // 서버에 화면 공유 종료 이벤트 전송
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline muted={!isSharing} width="400" height="400" />
      <button onClick={isSharing ? stopCapture : startCapture}>
        {isSharing ? 'Stop Sharing' : 'Start Sharing'}
      </button>
    </div>
  );
};

export default ScreenShare;
