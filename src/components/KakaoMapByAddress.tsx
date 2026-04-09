import React, { useEffect, useRef } from 'react';

interface KakaoMapByAddressProps {
  address: string;
  apiKey: string;
}

export default function KakaoMapByAddress({ address, apiKey }: KakaoMapByAddressProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!address || !apiKey) return;

    // 카카오 지도 스크립트 로드
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
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
          } else {
            console.error("Kakao Map search failed or mapRef is null");
          }
        });
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [address, apiKey]);

  return <div ref={mapRef} className="w-full h-64 rounded-lg overflow-hidden shadow-sm border border-gray-200" />;
}

declare global {
  interface Window {
    kakao: any;
  }
}
