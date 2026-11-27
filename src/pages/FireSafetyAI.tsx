import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ArrowUpRight, Building2, CheckCheck, ChevronDown, FileText, Headphones, Layers3, Mail, Menu, Phone, X } from 'lucide-react';
import SEO from '../components/SEO';
import FireSafetyProductDemo from '../components/FireSafetyProductDemo';
import FireSafetyHero from '../components/FireSafetyHero';
import FireSafetyScrollStory from '../components/FireSafetyScrollStory';
import FireSafetyDemoRequestForm from '../components/FireSafetyDemoRequestForm';
import { trackFireSafetyEvent } from '../utils/fireSafetyAnalytics';
import { fireSafetyCanonicalUrl } from '../utils/fireSafetyLanding';
import { fireSafetyAlternates, fireSafetyKoreanAfterHoursPath, fireSafetyKoreanFaqPath, fireSafetyKoreanFeedPath, fireSafetyKoreanOverviewPdf, fireSafetyTranslations, siteOrigin } from '../utils/fireSafetyLocales.js';
import './fire-safety-ai.css';

const organicShareImage = 'https://bigplanner.co.kr/images/fire-safety-organic-og.jpg';
const shareByEmail = `mailto:?subject=${encodeURIComponent('방재실 AI 민원 도우미')}&body=${encodeURIComponent(fireSafetyCanonicalUrl)}`;

const navItems = [
  { label: '업무 흐름', href: '#workflow' },
  { label: '도입 효과', href: '#benefits' },
  { label: '구축 사례', href: '#case-study' },
  { label: '도입 절차', href: '#process' },
];

const process = [
  { title: '업무·매뉴얼 확인', text: '자주 받는 문의와 접수 경로, 보유 매뉴얼을 함께 살펴봅니다.', tag: '현장 이해' },
  { title: '현장별 구성', text: '접수 항목·전달 방식과 입주사의 접속 경로·안내 방법을 함께 정합니다.', tag: '맞춤 구축' },
  { title: '시범 적용·검토', text: '실제 업무 상황을 바탕으로 안내와 접수 흐름을 점검합니다.', tag: '현장 검증' },
  { title: '사용자 교육', text: '현장 담당자가 직접 접수 내역과 운영 방법을 익힙니다.', tag: '운영 준비' },
  { title: '운영지원·개선', text: '협의한 범위에 따라 유지관리와 매뉴얼 갱신을 지원합니다.', tag: '지속 지원' },
];

const faqs = [
  { q: '전화도 받는데 챗봇까지 관리하면 일이 늘지 않나요?', a: '챗봇으로 접수한 내용은 관리자 화면에서 확인하고, 기존 전화는 현장 여건에 맞춰 병행합니다. 먼저 적용할 반복 문의와 접수 업무를 정한 뒤, 시범 적용에서 관리자의 확인 동선과 운영 부담까지 함께 점검합니다.' },
  { q: '입주사는 어떻게 챗봇을 사용하나요?', a: '입주사가 웹·모바일로 문의할 수 있는 접속 경로와 안내 방법을 현장에 맞춰 정합니다. 기존 채널 이용 방식과 입주사 특성을 확인해 구성하며, 전화·메신저 등 기존 시스템과의 연동은 별도로 검토합니다.' },
  { q: '어려운 문의나 긴급한 민원은 어떻게 하나요?', a: '매뉴얼로 답하기 어렵거나 일정 승인이 필요한 문의는 내용을 정리해 담당자가 확인합니다. 긴급·안전 사안은 전화와 담당자 확인을 병행하며, 현장 판단과 조치는 담당자가 수행합니다.' },
  { q: '매뉴얼은 누가 정리하고 갱신하나요?', a: '보유한 안내문과 업무 문서, 반복 문의를 함께 살펴보고 초기 정리를 지원합니다. 현장 담당자가 안내 기준을 확인하며, 이후 갱신의 주체와 지원 범위·주기는 견적과 운영 조건에 구체적으로 정합니다.' },
  { q: '기존 관리 시스템과 연동할 수 있나요?', a: '시스템의 제공 기능과 접근 방식, 현장 요구사항을 확인한 뒤 개별 검토합니다. 연동 범위와 추가 개발 여부는 제안 단계에서 안내합니다.' },
  { q: '구축비와 운영비는 어떻게 정해지나요?', a: '건물 수, 매뉴얼과 접수 업무, 시스템 연동, 교육·운영지원 범위를 확인한 뒤 개별 견적으로 안내합니다. 유지관리, 매뉴얼 갱신, 모델·알림 사용량 비용의 포함 범위도 견적에서 구체적으로 정합니다.' },
];

export default function FireSafetyAI() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [demoVisible, setDemoVisible] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const viewTracked = useRef(false);

  useEffect(() => {
    if (!viewTracked.current) {
      trackFireSafetyEvent('landing_view');
      viewTracked.current = true;
    }
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  useEffect(() => {
    const demo = document.getElementById('demo-request');
    if (!demo) return;
    const observer = new IntersectionObserver(([entry]) => setDemoVisible(entry.isIntersecting));
    observer.observe(demo);
    return () => observer.disconnect();
  }, []);

  const trackCTA = (source: string) => {
    setMenuOpen(false);
    trackFireSafetyEvent('demo_cta_click', { source });
  };

  return (
    <div className="fire-ai">
      <SEO
        title="방재실 AI 민원 도우미 | 민원 접수·응대 챗봇 구축"
        description="건물 매뉴얼로 주차·시설 이용 문의를 안내하고, 냉난방 등 현장 확인이 필요한 민원은 접수 카드로 정리하는 방재실 AI 챗봇입니다. 업무 흐름을 데모로 확인하세요."
        url={fireSafetyCanonicalUrl}
        image={organicShareImage}
      />
      <Helmet>
        <html lang="ko" />
        {fireSafetyAlternates.map(({ code, path }) => <link key={code} rel="alternate" hrefLang={code} href={siteOrigin + path} />)}
        <link rel="alternate" type="application/rss+xml" title="시설관리 실무 자료 RSS" href={siteOrigin + fireSafetyKoreanFeedPath} />
        <link rel="stylesheet" href="/fire-safety-ai/share.css" />
        <script async src="/fire-safety-ai/share.js" />
        <meta property="og:image:alt" content="빅플래너파트너스 방재실 AI 민원 도우미와 냉방 불편 접수 예시" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image:alt" content="빅플래너파트너스 방재실 AI 민원 도우미와 냉방 불편 접수 예시" />
      </Helmet>
      <a className="fa-skip-link" href="#fa-main">본문으로 바로가기</a>
      <header className="fa-header">
        <div className="fa-container fa-header-inner">
          <a href="#fa-main" className="fa-brand" aria-label="방재실 AI 민원 도우미 첫 화면"><span className="fa-brand-logo"><img src="/images/bigplanner-logo.png" width="280" height="33" alt="BIGPLANNER PARTNERS" /></span><span className="fa-brand-service">방재실 <b>AI</b><br />민원 도우미</span></a>
          <nav className="fa-desktop-nav" aria-label="서비스 메뉴">{navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>
          <a className="fa-button fa-button-small fa-header-cta" href="#demo-request" onClick={() => trackCTA('header')}>데모 시연 신청 <ArrowUpRight size={15} /></a>
          <button ref={menuButton} type="button" className="fa-menu-toggle" aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={menuOpen} aria-controls="fa-mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={23} /> : <Menu size={23} />}</button>
        </div>
        {menuOpen && <nav id="fa-mobile-menu" className="fa-mobile-menu" aria-label="모바일 서비스 메뉴">{navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}<ArrowUpRight size={15} /></a>)}<a href="#demo-request" onClick={() => trackCTA('mobile_menu')}>데모 시연 신청<ArrowRight size={15} /></a><a href="https://bigplanner.co.kr/">BIGPLANNER 홈페이지</a></nav>}
      </header>

      <main id="fa-main" tabIndex={-1}>
        <FireSafetyHero />
        <nav className="fa-container fa-language-nav" aria-label="서비스 소개 언어">
          {fireSafetyTranslations.map(({ code, label, path }) => <a key={code} href={path} lang={code} hrefLang={code} dir="auto">{label}</a>)}
        </nav>
        <div className="fa-container">
          <details className="fs-share share" data-fs-share>
            <summary>링크 공유</summary>
            <div className="fs-share-panel">
              <label className="fs-share-address">페이지 주소
                <input data-fs-share-url type="url" dir="ltr" readOnly value={fireSafetyCanonicalUrl} />
              </label>
              <div className="fs-share-actions">
                <button data-fs-share-native type="button" hidden>앱으로 공유</button>
                <button data-fs-share-copy type="button" hidden>링크 복사</button>
                <a href={shareByEmail}>이메일로 공유</a>
              </div>
              <p className="fs-share-status" data-fs-share-status role="status" data-copied="링크를 복사했습니다." data-manual="주소를 선택했습니다. 직접 복사해 주세요." />
            </div>
          </details>
        </div>
        <FireSafetyScrollStory />

        <section className="fa-section fa-product-section" id="product-demo" aria-labelledby="fa-product-demo-title">
          <div className="fa-container">
            <div className="fa-section-heading fa-heading-center">
              <p className="fa-eyebrow">문의에 맞춰 나누는 AI와 담당자의 역할</p>
              <h2 id="fa-product-demo-title">반복 문의는 AI가 안내하고,<br />현장 민원은 담당자가 확인합니다.</h2>
              <p>반복 설명과 접수 정보 정리에 드는 수고를 덜어줍니다.</p>
              <a className="fa-text-link mt-3" href="/fire-safety-ai/demo-video/">27초 데모 영상 보기 <ArrowRight size={16} aria-hidden="true" /></a>
            </div>
            <div className="fa-workflow-demo"><FireSafetyProductDemo /></div>
            <div className="fa-workflow-note"><Phone size={18} aria-hidden="true" /><p>기존 전화는 현장 여건에 맞춰 병행합니다. 챗봇으로 접수한 내용은 관리자 화면에서 확인합니다.</p></div>
          </div>
        </section>

        <section className="fa-section fa-benefits" id="benefits" aria-labelledby="fa-benefits-title">
          <div className="fa-container"><div className="fa-section-heading"><p className="fa-eyebrow">각자의 업무에 맞는 도입 가치</p><h2 id="fa-benefits-title">본사와 현장이<br />함께 활용합니다.</h2></div>
            <div className="fa-benefit-columns">
              <article className="fa-benefit-panel">
                <div className="fa-benefit-identity"><span><Building2 size={22} /></span><p>건물관리 기업 본사<small>운영 기준을 정리하는 책임자에게</small></p></div>
                <h3>건물별 응대 기준과<br />접수 기록을 정리합니다.</h3>
                <ul>
                  <li><CheckCheck size={18} /><div><strong>매뉴얼에 근거한 안내 기준</strong><p>현장에서 자주 쓰는 안내를 건물별 매뉴얼에 맞춰 구성합니다.</p></div></li>
                  <li><CheckCheck size={18} /><div><strong>접수·전달 기록 체계</strong><p>위치와 문의 내용, 담당자 전달 내역을 같은 접수 기록으로 확인합니다.</p></div></li>
                  <li><CheckCheck size={18} /><div><strong>현장 적용 후 확산 검토</strong><p>한 현장의 이용 방식과 운영 부담을 확인한 뒤 추가 사업장 도입을 검토합니다.</p></div></li>
                </ul>
              </article>
              <article className="fa-benefit-panel">
                <div className="fa-benefit-identity"><span><Headphones size={22} /></span><p>관리소·방재실<small>오늘의 민원을 처리하는 담당자에게</small></p></div>
                <h3>반복 설명과 접수 정리의<br />수고를 덜어드립니다.</h3>
                <ul>
                  <li><CheckCheck size={18} /><div><strong>같은 설명을 반복하는 수고</strong><p>주차·시설 이용처럼 매뉴얼로 답할 수 있는 문의는 AI가 먼저 안내합니다.</p></div></li>
                  <li><CheckCheck size={18} /><div><strong>재확인하고 옮겨 적는 수고</strong><p>위치와 문의 내용을 정리해 담당자에게 전달할 정보를 한 건에 모읍니다.</p></div></li>
                  <li><CheckCheck size={18} /><div><strong>교대 때 이력을 찾는 수고</strong><p>어떤 안내를 했고 누구에게 전달했는지 같은 기록에서 확인합니다.</p></div></li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="fa-section fa-case" id="case-study" aria-labelledby="fa-case-title">
          <div className="fa-container fa-case-grid"><div className="fa-case-copy"><p className="fa-eyebrow">현장 문제에서 출발한 레퍼런스</p><span className="fa-case-label">PoC 구축 사례 · 익명</span><h2 id="fa-case-title">건물관리 기업의<br />방재실 VOC 챗봇 PoC</h2>
            <dl className="fa-case-story">
              <div><dt>기존 업무</dt><dd>전화·메신저로 받은 민원을 수기로 기록하고 다른 부서에 전달했습니다.</dd></div>
              <div><dt>구축 흐름</dt><dd>매뉴얼 안내와 민원 접수를 웹·모바일 챗봇, 관리자 화면으로 연결했습니다.</dd></div>
              <div><dt>확인 결과</dt><dd>내부 운영 접수 59건의 기록과 담당자 전달 흐름을 점검했습니다.</dd></div>
            </dl>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <a className="fa-text-link" href="#demo-request" onClick={() => trackCTA('case_study')}>우리 현장의 적용 범위 확인하기<ArrowUpRight size={16} aria-hidden="true" /></a>
              <a className="fa-text-link" href={fireSafetyKoreanOverviewPdf} download="bigplanner-facilities-ai-ko.pdf">제품 소개서 PDF 받기<FileText size={16} aria-hidden="true" /></a>
            </div>
          </div>
            <div className="fa-case-evidence"><div className="fa-evidence-numbers"><div><span>내부 운영 접수</span><strong>59<small>건</small></strong></div><div><span>해당 표본의 담당자 전달 누락</span><strong>0<small>건</small></strong></div></div><div className="fa-evidence-notes"><p><b>집계 기간</b>2026. 9. 23. ~ 10. 22.</p><p><b>검증 범위</b>기능 점검용 접수를 포함한 내부 운영 표본</p><p><b>수행 단계</b>웹·모바일 챗봇 및 관리자 화면 PoC</p></div><p className="fa-evidence-disclaimer">위 수치는 제공된 완료보고서의 기록이며, 전체 상용 운영 성과나 향후 성능을 보장하는 수치가 아닙니다.</p></div>
          </div>
        </section>

        <section className="fa-section fa-process" id="process" aria-labelledby="fa-process-title">
          <div className="fa-container"><div className="fa-section-heading fa-heading-split"><div><p className="fa-eyebrow">도입과 정착을 함께</p><h2 id="fa-process-title">구축부터 현장 정착까지<br />함께합니다.</h2></div><p>우리 건물의 업무를 이해하는 것부터<br />담당자가 직접 활용하는 순간까지.</p></div><ol className="fa-process-list">{process.map((step, index) => <li key={step.title}><span className="fa-process-index">0{index + 1}</span><div><span className="fa-process-tag">{step.tag}</span><h3>{step.title}</h3></div><p>{step.text}</p></li>)}</ol><div className="fa-price-note"><Layers3 size={22} /><div><strong>건물과 업무에 맞춰 구축비·운영지원비를 제안합니다.</strong><p>건물 수, 매뉴얼, 연동과 운영지원 범위를 확인한 뒤 개별 견적으로 안내합니다.</p></div></div></div>
        </section>

        <section className="fa-section fa-faq" aria-labelledby="fa-faq-title"><div className="fa-container fa-faq-grid"><div className="fa-section-heading"><p className="fa-eyebrow">자주 묻는 질문</p><h2 id="fa-faq-title">도입 전<br />궁금한 점</h2><p>우리 현장에 어떻게 적용할지,<br />데모에서 함께 확인하세요.</p>
              <div className="mt-3 grid justify-items-start">
                <a className="fa-text-link" href="/fire-safety-ai/handoff-checklist/">민원 접수·교대 인수인계 체크리스트 <ArrowRight size={16} aria-hidden="true" /></a>
                <a className="fa-text-link" href="/fire-safety-ai/adoption-guide/">시설관리 민원 접수 시스템 도입 체크리스트 <ArrowRight size={16} aria-hidden="true" /></a>
                <a className="fa-text-link" href={fireSafetyKoreanAfterHoursPath}>야간·휴일 냉난방 연장 운전 신청서 <ArrowRight size={16} aria-hidden="true" /></a>
                <a className="fa-text-link" href={fireSafetyKoreanFaqPath}>시설관리 FAQ 작성 가이드와 엑셀 <ArrowRight size={16} aria-hidden="true" /></a>
                <a className="fa-text-link" href="https://blog.naver.com/bigplannerpartners" hrefLang="ko">네이버 블로그의 시설관리 실무 글 <ArrowUpRight size={16} aria-hidden="true" /></a>
              </div>
            </div><div className="fa-faq-list">{faqs.map((faq, index) => <details key={faq.q} open={index === 0 ? true : undefined}><summary><span>{faq.q}</span><ChevronDown size={19} /></summary><p>{faq.a}</p></details>)}</div></div></section>

        <section className="fa-section fa-demo-section" id="demo-request" aria-labelledby="fa-demo-title"><div className="fa-container fa-demo-grid"><div className="fa-demo-intro"><p className="fa-eyebrow">우리 건물의 업무로 확인하세요</p><h2 id="fa-demo-title">우리 현장에서<br />줄일 수 있는 업무부터<br /><span>확인하세요.</span></h2><p>실제 화면을 보며 AI에 맡길 업무와<br />현장에 필요한 구축 범위를 함께 확인합니다.</p><ul className="fa-demo-agenda"><li><span>01</span><div><strong>맡길 수 있는 반복 업무</strong><p>우리 건물의 반복 문의 중 AI로 안내할 내용</p></div></li><li><span>02</span><div><strong>접수 항목과 전달 방식</strong><p>AI가 정리할 정보와 관리자가 확인할 업무</p></div></li><li><span>03</span><div><strong>구축·교육·운영지원 범위</strong><p>매뉴얼 정리부터 현장 사용과 갱신 지원까지</p></div></li></ul><div className="fa-demo-footnote"><FileText size={17} /><span>첫 신청에는 매뉴얼이나 실제 민원 자료가 필요하지 않습니다.<br />신청 후 이메일로 온라인 시연 일정을 조율합니다.</span></div></div><div className="fa-form-panel"><FireSafetyDemoRequestForm /></div></div></section>
      </main>

      <footer className="fa-footer"><div className="fa-container"><div className="fa-footer-top"><div><strong>방재실 AI 민원 도우미</strong><span>접수에서 전달, 그리고 기록까지.</span></div><a href="https://bigplanner.co.kr/" className="fa-footer-company"><span className="fa-footer-logo"><img src="/images/bigplanner-logo.png" width="280" height="33" alt="BIGPLANNER PARTNERS" /></span><ArrowUpRight size={15} /></a></div><div className="fa-footer-bottom"><div><p>빅플래너파트너스 · 사업자등록번호 265-87-02571</p><p>서울특별시 용산구 회나무로 13가길 16 어반메시남산 C동 102호</p><p><a href="tel:027900799"><Phone size={12} />02-790-0799</a><a href="mailto:bigplanner0799@gmail.com"><Mail size={12} />bigplanner0799@gmail.com</a></p></div><div><a href={fireSafetyKoreanFeedPath}>시설관리 자료 RSS</a><a href="#demo-privacy">개인정보 수집·이용 안내</a><span>© {new Date().getFullYear()} BIGPLANNER PARTNERS</span></div></div></div></footer>
      {!demoVisible && <div className="fa-mobile-cta"><a className="fa-button" href="#demo-request" onClick={() => trackCTA('mobile_sticky')}>데모 시연 신청<ArrowUpRight size={17} /></a></div>}
    </div>
  );
}
