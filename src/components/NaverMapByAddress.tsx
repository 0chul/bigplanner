import React, { useEffect, useRef, useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

interface NaverMapByAddressProps {
  address: string;
  clientId: string;
}

export default function NaverMapByAddress({ address, clientId }: NaverMapByAddressProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    if (!address) {
      setErrorMsg("주소가 제공되지 않았습니다.");
      return;
    }
    if (!clientId) {
      setIsFallback(true);
      return;
    }

    const cleanAddress = address.trim();
    if (!cleanAddress) {
      setErrorMsg("유효하지 않은 주소입니다.");
      return;
    }

    const initMap = () => {
      if (!window.naver || !window.naver.maps) {
        setIsFallback(true);
        return;
      }

      if (!window.naver.maps.Service) {
        setIsFallback(true);
        return;
      }

      // Geocoding 호출 (query 속성 사용)
      window.naver.maps.Service.geocode({ query: cleanAddress }, (status: any, response: any) => {
        if (status !== window.naver.maps.Service.Status.OK) {
          console.error("Naver Geocoding failed with status:", status);
          setIsFallback(true);
          return;
        }

        if (!response.v2.addresses || response.v2.addresses.length === 0) {
          setErrorMsg("검색된 주소의 좌표가 없습니다.");
          return;
        }

        const result = response.v2.addresses[0];
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
          setIsFallback(false);
        }
      });
    };

    const scriptId = 'naver-map-script';
    const existingScript = document.getElementById(scriptId);

    if (window.naver && window.naver.maps && window.naver.maps.Service) {
      initMap();
    } else if (existingScript) {
      existingScript.addEventListener('load', initMap);
      existingScript.addEventListener('error', () => setIsFallback(true));
    } else {
      const script = document.createElement('script');
      script.id = scriptId;
      // 최신 API 호출 규격에 맞춰 &submodules=geocoder 파라미터 유지
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}&submodules=geocoder`;
      script.async = true;
      script.onload = initMap;
      script.onerror = () => setIsFallback(true);
      document.head.appendChild(script);
    }

    return () => {
      if (existingScript) {
        existingScript.removeEventListener('load', initMap);
      }
    };

  }, [address, clientId]);

  if (errorMsg && !isFallback) {
    return (
      <div className="w-full h-[300px] md:h-96 rounded-xl overflow-hidden shadow-sm border border-gray-200 flex items-center justify-center bg-gray-50 p-4 text-center">
        <p className="text-sm text-red-500 font-medium">{errorMsg}</p>
      </div>
    );
  }

  // API의 CORS(401) 또는 500 에러 발생 시 부드러운 우회(Fallback) UI 표출
  if (isFallback) {
    return (
      <div className="w-full h-[300px] md:h-96 rounded-xl overflow-hidden shadow-sm border border-gray-200 flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-4">
          <MapPin size={24} className="text-indigo-500" />
        </div>
        <h3 className="text-sm font-bold text-gray-900 mb-2">{address}</h3>
        <p className="text-xs text-gray-500 mb-6 max-w-xs">
          현재 지도 API 환경 설정에 의해 미리보기가 일시적으로 제한되었습니다.
        </p>
        <a 
          href={`https://map.naver.com/v5/search/${encodeURIComponent(address.trim())}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
        >
          네이버 지도로 보기
          <ExternalLink size={16} />
        </a>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-[300px] md:h-96 rounded-xl overflow-hidden shadow-sm border border-gray-200" />;
}

declare global {
  interface Window {
    naver: any;
  }
}
