import React, { useEffect, useRef } from 'react';
import Peer from 'simple-peer';

const App = () => {
  const videoRef = useRef();

  useEffect(() => {
    const peer = new Peer({ initiator: true, wsVersion: 13 });

    // 화면 공유 버튼 클릭 이벤트 핸들러
    const startScreenShare = async () => {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        videoRef.current.srcObject = stream;
        peer.addStream(stream);

        peer.on('signal', data => {
          console.log('Signal data:', data);
          // A가 B에게 시그널을 전송
          // 이 시그널은 B가 C에게 전달해야 함
          // (예: 채팅, 서버 등을 통해 전달)
        });
      } catch (error) {
        console.error('Error starting screen share:', error);
      }
    };

    // 화면 공유 시작 버튼
    const shareButton = document.getElementById('shareButton');
    shareButton.addEventListener('click', startScreenShare);

  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay muted />
      <button id="shareButton">화면 공유 시작</button>
    </div>
  );
};

export default App;