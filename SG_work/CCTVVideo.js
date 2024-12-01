import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

function CCTVVideo({ url }) {
  const videoRef = useRef(null);
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
          height: videoRef.current.videoHeight,
        });
      };

      return () => {
        hls.destroy();
      };
    }
  }, [url]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws');

    ws.onopen = () => {
      console.log('WebSocket connected');
      ws.send(JSON.stringify({ url }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setDetections(data.detections || []);
    };

    ws.onclose = () => console.log('WebSocket disconnected');
    ws.onerror = (error) => console.error('WebSocket error:', error);

    return () => {
      ws.close();
    };
  }, [url]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <video
        ref={videoRef}
        controls
        style={{ width: '100%', maxWidth: '800px' }}
      />
    </div>
  );
}

export default CCTVVideo;