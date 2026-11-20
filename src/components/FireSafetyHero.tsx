import { ArrowDown, ArrowDownRight, ArrowRight, Check, MessageSquareText } from 'lucide-react';
import { trackFireSafetyEvent } from '../utils/fireSafetyAnalytics';
import './fire-safety-hero.css';

export default function FireSafetyHero() {
  return (
    <section className="fa-intro" aria-labelledby="fa-intro-title">
      <div className="fa-intro-visual" aria-hidden="true">
        <img
          src="/images/fire-safety-building.webp"
          alt=""
          width="1672"
          height="941"
          fetchPriority="high"
          decoding="async"
        />
      </div>

      <div className="fa-container fa-intro-inner">
        <div className="fa-intro-copy">
          <p className="fa-intro-kicker"><span />방재실 AI 민원 도우미</p>
          <p className="fa-intro-audience">빌딩 관리 기업 · 관리소 · 방재실을 위한 AI 업무 도우미</p>
          <h1 id="fa-intro-title">
            <span className="fa-intro-title-line">반복 응대는 줄이고,</span>
            <span className="fa-intro-title-benefit">현장 업무에 <br className="fa-intro-title-mobile-break" />집중하세요.</span>
          </h1>
          <p className="fa-intro-description">
            AI가 건물 매뉴얼로 반복 문의를 안내하고, 민원의 위치와 내용을 정리합니다.
            담당자는 정리된 접수를 확인하고 현장 대응을 이어갑니다.
          </p>
          <div className="fa-intro-actions">
            <a
              className="fa-button fa-intro-button"
              href="#demo-request"
              onClick={() => trackFireSafetyEvent('demo_cta_click', { source: 'hero' })}
            >
              데모 시연 신청<ArrowRight size={21} aria-hidden="true" />
            </a>
            <a className="fa-intro-flow-link" href="#workflow">
              줄어드는 업무 살펴보기<ArrowDownRight size={19} aria-hidden="true" />
            </a>
          </div>
          <p className="fa-intro-support"><Check size={17} aria-hidden="true" />우리 건물에서 맡길 수 있는 업무부터 확인하세요.</p>
        </div>

        <article className="fa-intro-incident" aria-label="가상 민원 접수 예시">
          <div className="fa-intro-incident-top">
            <span className="fa-intro-incident-id">DEMO-012</span>
            <span className="fa-intro-example">가상 데이터</span>
          </div>
          <div className="fa-intro-incident-main">
            <span className="fa-intro-incident-icon"><MessageSquareText size={23} aria-hidden="true" /></span>
            <div><p>5층 공용 회의실 · 냉방 불편</p><strong>AI가 정리한 접수</strong></div>
          </div>
          <div className="fa-intro-incident-foot"><span />담당자는 확인 후 현장 대응<ArrowDown size={16} aria-hidden="true" /></div>
        </article>

        <div className="fa-intro-bottom">
          <span>한 건물의 민원을, 하나의 흐름으로.</span>
          <a href="#workflow" aria-label="아래로 이동해 민원 업무 흐름 보기"><span>SCROLL TO EXPLORE</span><ArrowDown size={24} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
