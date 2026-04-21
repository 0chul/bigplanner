import React, { useEffect, useRef, useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

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
      setErrorMsg("카카오 지도 API 키가 설정되지 않았습니다.");
      return;
    }

    const cleanAddress = address.trim();
    if (!cleanAddress) {
      setErrorMsg("유효하지 않은 주소입니다.");
      return;
    }

    const initMap = () => {
      if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
        setErrorMsg("카카오지도 API를 불러오는데 실패했습니다.");
        return;
      }

      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(cleanAddress, (result: any[], status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          
          if (mapRef.current) {
            const mapOption = {
              center: coords,
              level: 3 // 확대 레벨 (작을수록 확대)
            };
            const map = new window.kakao.maps.Map(mapRef.current, mapOption);
            
            new window.kakao.maps.Marker({
              map: map,
              position: coords
            });
            
            setErrorMsg(null);
          }
        } else {
          setErrorMsg("주소를 카카오 지도에서 찾을 수 없습니다.");
        }
      });
    };

    const scriptId = 'kakao-map-script';
    const existingScript = document.getElementById(scriptId);

    if (window.kakao && window.kakao.maps && window.kakao.maps.services && window.kakao.maps.services.Geocoder) {
      window.kakao.maps.load(() => initMap());
    } else if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.kakao && window.kakao.maps) {
           window.kakao.maps.load(() => initMap());
        }
      });
      existingScript.addEventListener('error', () => setErrorMsg("스크립트 오류"));
    } else {
      const script = document.createElement('script');
      script.id = scriptId;
      // libraries=services 필수 (Geocoder 사용)
      // autoload=false 필수 (React 환경에서 확실한 초기화를 위해)
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;
      script.async = true;
      document.head.appendChild(script);
      
      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => initMap());
        }
      };
      script.onerror = () => setErrorMsg("카카오맵 스크립트를 불러오는데 실패했습니다.");
    }
  }, [address, apiKey]);

  if (errorMsg) {
    return (
      <div className="w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white flex flex-col">
        <div className="w-full h-[240px] md:h-[320px] relative bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-4">
              <MapPin size={24} className="text-gray-400" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">{address}</h3>
            <p className="text-xs text-gray-500 mb-6 max-w-xs">{errorMsg}</p>
            <a 
              href={`https://map.kakao.com/link/search/${encodeURIComponent(address.trim())}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center items-center gap-2 px-5 py-2.5 bg-[#FEE500] hover:bg-[#FADA0A] text-[#000000] text-sm font-bold rounded-lg transition-colors shadow-sm whitespace-nowrap"
            >
              카카오맵으로 보기
              <ExternalLink size={16} />
            </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white flex flex-col">
      <div ref={mapRef} className="w-full h-[300px] md:h-96" />
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-left">
          <div className="p-2 bg-yellow-50 rounded-full">
            <MapPin size={16} className="text-[#E5C500]" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{address}</p>
            <p className="text-xs text-gray-500 mt-0.5">카카오맵에서 경로와 상세 정보를 확인하세요.</p>
          </div>
        </div>
        <a 
          href={`https://map.kakao.com/link/search/${encodeURIComponent(address.trim())}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-5 py-2.5 bg-[#FEE500] hover:bg-[#FADA0A] text-[#000000] text-sm font-bold rounded-lg transition-colors shadow-sm whitespace-nowrap"
        >
          카카오맵으로 보기
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    kakao: any;
  }
}
