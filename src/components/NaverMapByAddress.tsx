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

    // 네이버 지도 API 로드
    const loadScript = () => {
      const script = document.createElement('script');
      script.id = 'naver-map-script';
      // submodules=geocoder를 명시적으로 추가
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}&submodules=geocoder`;
      script.async = true;
      script.onload = initMap;
      script.onerror = () => setErrorMsg("네이버맵 스크립트를 불러오는데 실패했습니다.");
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!window.naver || !window.naver.maps) {
        setErrorMsg("네이버맵 API를 불러오는데 실패했습니다.");
        return;
      }

      // Geocoding 호출
      console.log("Geocoding address:", address);
      window.naver.maps.Service.geocode({ query: address }, (status: any, response: any) => {
        console.log("Geocoding status:", status, "Response:", response);
        if (status !== window.naver.maps.Service.Status.OK) {
          setErrorMsg("주소를 지도에서 찾을 수 없습니다.");
          return;
        }

        const result = response.v2.addresses[0];
        console.log("Geocoding result:", result);
        const lat = parseFloat(result.y);
        const lng = parseFloat(result.x);
        
        if (mapRef.current) {
          const map = new window.naver.maps.Map(mapRef.current, {
            center: new window.naver.maps.LatLng(lat, lng),
            zoom: 17
          });
          
          new window.naver.maps.Marker({
            map: map,
            position: new window.naver.maps.LatLng(lat, lng)
          });
          setErrorMsg(null);
        }
      });
    };

    if (window.naver && window.naver.maps) {
      initMap();
    } else {
      loadScript();
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
