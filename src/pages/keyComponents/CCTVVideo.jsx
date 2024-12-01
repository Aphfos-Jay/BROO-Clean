import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

function CCTVVideo({ url, detections }) {
  const videoRef = useRef(null);

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

      return () => {
        hls.destroy();
      };
    }
  }, [url]);

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: '800px' }}>
      {/* 비디오 플레이어 */}
      <video ref={videoRef} controls style={{ width: '100%' }} muted playsInline />
      {/* 탐지된 객체 표시 */}
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
            pointerEvents: 'none' // 클릭 불가
          }}
        >
          {`${detection.class} (${Math.round(detection.confidence * 100)}%)`}
        </div>
      ))}
    </div>
  );
}

export default CCTVVideo;
