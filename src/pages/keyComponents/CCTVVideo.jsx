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

      // 자동 재생 시도
      videoRef.current.muted = true; // 음소거 설정
      videoRef.current.autoplay = true; // 자동 재생 활성화
      videoRef.current.playsInline = true; // 모바일 환경에서 인라인 재생 허용
      videoRef.current.play().catch((err) => {
        console.error('자동 재생 실패:', err);
      });

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

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8053/ws');

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
    <div>
      <div style={{ position: 'relative', width: '640px', height: '480px' }}>
        {/* 비디오 영역 */}
        <video ref={videoRef} width="640" height="480" controls>
          <source src={url} type="video/mp4" />
        </video>

        {/* 탐지된 객체 경계 상자 */}
        {detections.map((det, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: det.x1,
              top: det.y1,
              width: det.x2 - det.x1,
              height: det.y2 - det.y1,
              border: '2px solid red',
              color: 'red',
              pointerEvents: 'none'
            }}
          >
            {`${det.class} (${Math.round(det.confidence * 100)}%)`}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CCTVVideo;
