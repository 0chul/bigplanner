import React, { useEffect, useRef } from 'react';

interface KakaoMapProps {
  mapId: string;
  timestamp: string;
  mapKey: string;
  width?: string;
  height?: string;
}

export default function KakaoMap({ mapId, timestamp, mapKey, width = "640", height = "360" }: KakaoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. 로더 스크립트 추가
    const loaderScript = document.createElement('script');
    loaderScript.src = "https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js";
    loaderScript.charset = "UTF-8";
    loaderScript.className = "daum_roughmap_loader_script";
    document.body.appendChild(loaderScript);

    // 2. 실행 스크립트 추가
    loaderScript.onload = () => {
      new window.daum.roughmap.Lander({
        "timestamp": timestamp,
        "key": mapKey,
        "mapWidth": width,
        "mapHeight": height
      }).render();
    };

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거 (선택 사항)
      document.body.removeChild(loaderScript);
    };
  }, [timestamp, mapKey, width, height]);

  return (
    <div 
      id={`daumRoughmapContainer${timestamp}`} 
      className="root_daum_roughmap root_daum_roughmap_landing"
      ref={containerRef}
    />
  );
}

// window 객체 타입 정의
declare global {
  interface Window {
    daum: any;
  }
}
