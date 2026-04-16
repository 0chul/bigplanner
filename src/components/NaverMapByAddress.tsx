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

    const cleanAddress = address.trim();
    if (!cleanAddress) {
      setErrorMsg("유효하지 않은 주소입니다.");
      return;
    }

    const initMap = () => {
      if (!window.naver || !window.naver.maps) {
        setErrorMsg("네이버맵 API를 불러오는데 실패했습니다.");
        return;
      }

      if (!window.naver.maps.Service) {
        console.error("naver.maps.Service is undefined. Geocoder submodule failed to load.");
        setErrorMsg("Geocoding 모듈이 로드되지 않았습니다. API 권한을 확인해주세요.");
        return;
      }

      // Geocoding 호출
      window.naver.maps.Service.geocode({ query: cleanAddress }, (status: any, response: any) => {
        if (status !== window.naver.maps.Service.Status.OK) {
          console.error("Naver Geocoding failed with status:", status);
          if (status === 'UNAUTHORIZED') {
            setErrorMsg("네이버 지도 API 인증에 실패했습니다. (도메인 등록 확인 필요)");
          } else if (status === 'INVALID_REQUEST') {
            setErrorMsg("잘못된 주소 요청입니다.");
          } else {
            setErrorMsg(`주소를 지도에서 찾을 수 없습니다. (상태: ${status})`);
          }
          return;
        }

        if (!response.v2.addresses || response.v2.addresses.length === 0) {
          setErrorMsg("검색 결과가 없습니다.");
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
        }
      });
    };

    const scriptId = 'naver-map-script';
    const existingScript = document.getElementById(scriptId);

    if (window.naver && window.naver.maps && window.naver.maps.Service) {
      // 이미 로드 완료된 상태
      initMap();
    } else if (existingScript) {
      // 다른 컴포넌트에 의해 스크립트가 로드 중인 상태
      existingScript.addEventListener('load', initMap);
      existingScript.addEventListener('error', () => setErrorMsg("네이버맵 스크립트를 불러오는데 실패했습니다."));
    } else {
      // 스크립트 최초 로드
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}&submodules=geocoder`;
      script.async = true;
      script.onload = initMap;
      script.onerror = () => setErrorMsg("네이버맵 스크립트를 불러오는데 실패했습니다.");
      document.head.appendChild(script);
    }

    return () => {
      if (existingScript) {
        existingScript.removeEventListener('load', initMap);
      }
    };

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
