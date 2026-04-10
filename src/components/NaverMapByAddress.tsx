import React, { useEffect, useRef, useState } from 'react';

interface NaverMapByAddressProps {
  address: string;
  clientId: string;
}

export default function NaverMapByAddress({ address, clientId }: NaverMapByAddressProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setErrorMsg("주소가 제공되지 않았습니다.");
      return;
    }
    if (!clientId) {
      setErrorMsg("네이버맵 Client ID가 설정되지 않았습니다.");
      return;
    }

    // 이미 스크립트가 로드되어 있는지 확인
    const existingScript = document.getElementById('naver-map-script');
    
    const initMap = () => {
      if (!window.naver || !window.naver.maps) {
        setErrorMsg("네이버맵 API를 불러오는데 실패했습니다.");
        return;
      }

      window.naver.maps.Service.geocode({ query: address }, (status: any, response: any) => {
        if (status !== window.naver.maps.Service.Status.OK) {
          setErrorMsg("주소를 지도에서 찾을 수 없습니다.");
          return;
        }

        const result = response.v2.addresses[0];
        const point = new window.naver.maps.Point(result.x, result.y);
        
        if (mapRef.current) {
          const map = new window.naver.maps.Map(mapRef.current, {
            center: new window.naver.maps.LatLng(result.y, result.x),
            zoom: 15
          });
          
          new window.naver.maps.Marker({
            map: map,
            position: new window.naver.maps.LatLng(result.y, result.x)
          });
          setErrorMsg(null);
        }
      });
    };

    if (existingScript) {
      if (window.naver && window.naver.maps) {
        initMap();
      } else {
        existingScript.addEventListener('load', initMap);
      }
    } else {
      const script = document.createElement('script');
      script.id = 'naver-map-script';
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
      script.async = true;
      document.head.appendChild(script);
      script.onload = initMap;
      
      script.onerror = () => {
        setErrorMsg("네이버맵 스크립트를 불러오는데 실패했습니다.");
      };
    }

  }, [address, clientId]);

  if (errorMsg) {
    return (
      <div className="w-full h-96 rounded-lg overflow-hidden shadow-sm border border-gray-200 flex items-center justify-center bg-gray-50 p-4 text-center">
        <p className="text-sm text-red-500 font-medium">{errorMsg}</p>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-96 rounded-lg overflow-hidden shadow-sm border border-gray-200" />;
}

declare global {
  interface Window {
    naver: any;
  }
}
