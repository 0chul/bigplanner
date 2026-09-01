import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  name?: string;
  type?: string;
  image?: string;
  url?: string;
  keywords?: string;
  noindex?: boolean;
}

export default function SEO({ 
  title, 
  description, 
  name = "빅플래너파트너스", 
  type = "website", 
  image = "https://injrbniytgtubemniaps.supabase.co/storage/v1/object/public/projects/main/1773793805092.webp",
  url = "https://bigplanner.co.kr",
  keywords = "빅플래너파트너스, 부동산개발, 건축기획, 프롭테크, PM, 프로젝트관리, 부동산컨설팅, BIGPLANNER PARTNERS",
  noindex = false
}: SEOProps) {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph tags (Facebook, KakaoTalk, LinkedIn, etc.) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={name} />
      <meta property="og:locale" content="ko_KR" />

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}

