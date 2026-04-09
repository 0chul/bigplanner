import React, { useEffect, useRef, useState } from 'react';

interface KakaoMapByAddressProps {
  address: string;
  apiKey: string;
}

export default function KakaoMapByAddress({ address, apiKey }: KakaoMapByAddressProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setErrorMsg("주소가 제공되지 않았습니다.");
      return;
    }
    if (!apiKey) {
      setErrorMsg("카카오맵 API 키가 설정되지 않았습니다. (환경 변수 누락)");
      return;
    }

    // 이미 스크립트가 로드되어 있는지 확인
    const existingScript = document.getElementById('kakao-map-script');
    
    const initMap = () => {
      window.kakao.maps.load(() => {
        const geocoder = new window.kakao.maps.services.Geocoder();
        
        console.log("Searching address:", address);
        geocoder.addressSearch(address, (result: any, status: any) => {
          console.log("Search status:", status, "Result:", result);
          if (status === window.kakao.maps.services.Status.OK && mapRef.current) {
            const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
            
            const map = new window.kakao.maps.Map(mapRef.current, {
              center: coords,
              level: 3
            });
            
            new window.kakao.maps.Marker({
              map: map,
              position: coords
            });
            setErrorMsg(null);
          } else {
            console.error("Kakao Map search failed or mapRef is null");
            setErrorMsg("주소를 지도에서 찾을 수 없습니다.");
          }
        });
      });
    };

    if (existingScript) {
      // 이미 스크립트가 있다면 바로 초기화
      if (window.kakao && window.kakao.maps) {
        initMap();
      } else {
        existingScript.addEventListener('load', initMap);
      }
    } else {
      // 스크립트 새로 로드
      const script = document.createElement('script');
      script.id = 'kakao-map-script';
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;
      script.async = true;
      document.head.appendChild(script);
      script.onload = initMap;
      
      script.onerror = () => {
        setErrorMsg("카카오맵 스크립트를 불러오는데 실패했습니다. (도메인 또는 키 오류)");
      };
    }

  }, [address, apiKey]);

  if (errorMsg) {
    return (
      <div className="w-full h-64 rounded-lg overflow-hidden shadow-sm border border-gray-200 flex items-center justify-center bg-gray-50 p-4 text-center">
        <p className="text-sm text-red-500 font-medium">{errorMsg}</p>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-64 rounded-lg overflow-hidden shadow-sm border border-gray-200" />;
}

declare global {
  interface Window {
    kakao: any;
  }
}
