import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

function CCTVVideo({ url }) {
  const videoRef = useRef(null);
  const wsRef = useRef(null);
  const [detections, setDetections] = useState([]);
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // HLS 비디오 스트림 설정
    if (Hls.isSupported() && videoRef.current) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(videoRef.current);

      videoRef.current.onloadedmetadata = () => {
        setVideoSize({
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight
        });
      };

      return () => {
        hls.destroy();
      };
    }
  }, [url]);

  const handleVideoCapture = async () => {
    if (videoRef.current) {
      // 비디오 캡처
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imgData = canvas.toDataURL('image/jpeg');

      // Flask 서버에 객체 탐지 요청
      try {
        const response = await fetch('http://localhost:5000/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: imgData }), // 이미지 데이터를 서버로 전송
        });
        const data = await response.json();
        setDetections(data);  // 탐지된 객체들 설정
      } catch (error) {
        console.error('Error fetching detection:', error);
      }
    }
  };

  useEffect(() => {
    handleVideoCapture();
  }, [url]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <video
        ref={videoRef}
        controls
        style={{ width: '100%', maxWidth: '800px' }}
      />
      {detections.map((detection, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${detection.x1}px`,
            top: `${detection.y1}px`,
            width: `${detection.x2 - detection.x1}px`,
            height: `${detection.y2 - detection.y1}px`,
            border: '2px solid red',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            color: 'white',
            fontSize: '12px',
            padding: '2px',
            zIndex: 1,
          }}
        >
          {`${detection.class} (${Math.round(detection.confidence * 100)}%)`}
        </div>
      ))}
    </div>
  );
}

export default CCTVVideo;