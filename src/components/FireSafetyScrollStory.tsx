import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown, ArrowRight, Bell, BookOpen, Building2, Check, CheckCheck,
  ClipboardList, MessageSquare, UserRound,
} from 'lucide-react';
import { FIRE_SAFETY_INCIDENT as incident, FIRE_SAFETY_STORY_STEPS as steps } from '../data/fireSafetyStory';
import FireSafetyHandoffArt from './FireSafetyHandoffArt';
import FireSafetyRecordArt from './FireSafetyRecordArt';
import './fire-safety-scroll-story.css';
import './fire-safety-manual-art.css';

const stageIcons = [MessageSquare, BookOpen, UserRound, ClipboardList];

function StoryArt({ stage }: { stage: number }) {
  if (stage === 0) return (
    <div className="fa-story-art">
      <img src={incident.image} alt="냉방 문의가 접수된 가상 빌딩" loading="lazy" decoding="async" />
      <div className="fa-story-floor"><span>{incident.floor}</span><div><strong>공용 회의실</strong><small>같은 위치의 민원 한 건</small></div></div>
    </div>
  );
  if (stage === 1) return (
    <div className="fa-story-art fa-story-manual-art" role="img"
      aria-label="건물 운영 매뉴얼의 냉방 불편 항목. AI가 안내에 사용할 ‘시설 담당자에게 현장 확인 요청’ 부분이 강조됩니다.">
      <div className="fa-manual-sheet" aria-hidden="true">
        <div className="fa-manual-imprint"><BookOpen size={17} strokeWidth={1.6} />건물 운영 매뉴얼</div>
        <strong className="fa-manual-heading">냉방 불편</strong>
        <div className="fa-manual-clause"><span>시설 담당자에게 현장 확인 요청</span></div>
        <div className="fa-manual-ruling"><i /><i /></div>
      </div>
    </div>
  );
  if (stage === 2) return <FireSafetyHandoffArt />;
  return <FireSafetyRecordArt />;
}

function IncidentPanel({ stage, mobile = false }: { stage: number; mobile?: boolean }) {
  const StageIcon = stageIcons[stage];
  return (
    <figure className={`fa-story-panel${mobile ? ' fa-story-panel-mobile' : ''}`} data-stage={stage}
      aria-label={`${incident.id} · ${incident.location} · ${incident.message} · ${steps[stage].label} 예시`}>
      <div className="fa-story-casebar">
        <span><Building2 size={17} aria-hidden="true" />{incident.building}</span>
        <strong>{incident.id}</strong>
      </div>
      <StoryArt stage={stage} />
      <div className="fa-story-panel-body" key={stage}>
        <div className="fa-story-panel-label" data-role={steps[stage].role}><StageIcon size={17} aria-hidden="true" /><span>{steps[stage].role}</span></div>
        {stage === 0 && (
          <div className="fa-story-reception">
            <div className="fa-story-message"><MessageSquare size={18} aria-hidden="true" /><p>{incident.message}</p></div>
            <dl className="fa-story-fields">
              <div><dt>민원 유형</dt><dd>시설 · 냉난방</dd></div>
              <div><dt>접수 위치</dt><dd>{incident.location}</dd></div>
              <div><dt>회신 연락처</dt><dd>{incident.contact}</dd></div>
            </dl>
            <div className="fa-story-summary"><small>다음 담당 업무</small><p>접수 확인 후 시설 담당자 지정</p></div>
            <div className="fa-story-status"><CheckCheck size={17} aria-hidden="true" /><span>필요한 접수 정보를 한 카드로 정리</span></div>
          </div>
        )}
        {stage === 1 && (
          <div className="fa-story-manual">
            <div className="fa-story-ai-answer" data-testid="fa-story-ai-answer">
              <p>5층 회의실 냉방 문의를 접수했어요. 시설 담당자가 현장에서 확인할 수 있도록 전달하겠습니다.</p>
              <span className="fa-story-source"><BookOpen size={14} aria-hidden="true" />건물 매뉴얼 · 냉난방 문의</span>
            </div>
            <dl className="fa-story-context">
              <div><dt>확인 위치</dt><dd>5층 공용 회의실</dd></div>
              <div><dt>불편 내용</dt><dd>냉방이 약함</dd></div>
            </dl>
            <div className="fa-story-human-check"><UserRound size={18} aria-hidden="true" /><div className="fa-story-human-roles"><p><strong>관리자</strong><span>접수 확인·담당자 지정</span></p><p><strong>시설 담당자</strong><span>냉방 상태 확인·조치</span></p></div></div>
          </div>
        )}
        {stage === 2 && (
          <div className="fa-story-assignment">
            <p className="fa-story-same-card"><span>{incident.id} · 같은 접수 카드</span>{incident.message}</p>
            <dl className="fa-story-context">
              <div><dt>전달 위치</dt><dd>5층 공용 회의실</dd></div>
              <div><dt>민원 유형</dt><dd>시설 · 냉난방</dd></div>
              <div><dt>회신 연락처</dt><dd>{incident.contact}</dd></div>
            </dl>
            <div className="fa-story-assignee"><span className="fa-story-assignee-icon"><UserRound size={23} aria-hidden="true" /></span><div><small>관리자가 확인 후 지정</small><strong>시설 담당자</strong></div><Check size={18} aria-hidden="true" /></div>
            <div className="fa-story-status"><Bell size={16} aria-hidden="true" /><span>같은 접수 카드로 담당자에게 전달</span></div>
          </div>
        )}
        {stage === 3 && (
          <div className="fa-story-history">
            <strong className="fa-story-issue-title">{incident.id} · 접수 이력</strong>
            <ol>
              {[
                ['AI가 문의 접수 정리', '5층 공용 회의실 · 냉방 불편'],
                ['AI가 매뉴얼 기반 안내', '냉난방 문의 안내 기준'],
                ['관리자가 담당자 지정', '시설 담당자'],
                ['같은 접수 카드 전달 기록', '접수 내용과 지정 내역 연결'],
              ].map(([title, detail], index) => (
                <li key={title}><span><Check size={13} aria-hidden="true" /></span><div><strong>{title}</strong><small>{detail}</small></div><em>0{index + 1}</em></li>
              ))}
            </ol>
            <div className="fa-story-summary"><small>이어갈 담당 업무</small><p>시설 담당자의 현장 확인·조치</p></div>
          </div>
        )}
      </div>
      {!mobile && <div className="fa-story-panel-footer">
        <span className="fa-story-step-count">0{stage + 1} / 04</span>
        <div className="fa-story-progress" aria-hidden="true">{steps.map((step, index) => <i key={step.id} data-complete={index <= stage} />)}</div>
        <div className="fa-story-scroll-cue" aria-hidden="true"><ArrowDown size={24} /></div>
      </div>}
    </figure>
  );
}

export default function FireSafetyScrollStory() {
  const [activeStep, setActiveStep] = useState(0);
  const [systemReduced, setSystemReduced] = useState(false);
  const [userReduced, setUserReduced] = useState(false);
  const section = useRef<HTMLElement>(null);
  const chapters = useRef<(HTMLElement | null)[]>([]);
  const reduced = systemReduced || userReduced;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setSystemReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    let scheduledFrame = 0;
    const updateStep = () => {
      scheduledFrame = 0;
      const sectionBounds = section.current?.getBoundingClientRect();
      if (!sectionBounds || sectionBounds.bottom <= 0 || sectionBounds.top >= window.innerHeight) return;
      const viewportCenter = window.innerHeight * 0.48;
      let closest = 0;
      let smallestDistance = Infinity;
      chapters.current.forEach((chapter, index) => {
        if (!chapter) return;
        const bounds = chapter.getBoundingClientRect();
        const distance = Math.abs(bounds.top + bounds.height / 2 - viewportCenter);
        if (distance < smallestDistance) { smallestDistance = distance; closest = index; }
      });
      setActiveStep(current => current === closest ? current : closest);
    };
    const scheduleUpdate = () => {
      if (!scheduledFrame) scheduledFrame = window.requestAnimationFrame(updateStep);
    };
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    scheduleUpdate();
    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (scheduledFrame) window.cancelAnimationFrame(scheduledFrame);
    };
  }, []);

  const jumpTo = (index: number) => {
    chapters.current[index]?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
  };

  return (
    <section ref={section} className="fa-scroll-story" id="workflow" data-step={activeStep} data-reduced={reduced}
      aria-labelledby="fa-story-title">
      <div className="fa-container">
        <header className="fa-story-heading">
          <p className="fa-eyebrow">ONE BUILDING. ONE CONNECTED FLOW.</p>
          <h2 id="fa-story-title">민원 한 건으로 보는,<br /><span>줄어드는 네 가지 수고.</span></h2>
          <p>5층 공용 회의실의 냉방 문의.<br />AI의 접수 정리부터 관리자의 전달과 기록까지 따라가 보세요.</p>
          <small className="fa-story-disclosure">가상 데이터 · 실제 알림 미발송</small>
        </header>
        <div className="fa-story-toolbar">
          <nav className="fa-story-nav" aria-label="민원 흐름 단계">
            {steps.map((step, index) => (
              <button type="button" key={step.id} aria-current={activeStep === index ? 'step' : undefined}
                aria-pressed={activeStep === index} aria-controls={step.id} onClick={() => jumpTo(index)}>
                <span>0{index + 1}</span>{step.label}
              </button>
            ))}
          </nav>
          <button className="fa-story-reduce" type="button" aria-pressed={reduced} disabled={systemReduced}
            onClick={() => setUserReduced(current => !current)}>{systemReduced ? '모션 줄이기 설정 적용 중' : reduced ? '모션 줄이기 적용 중' : '모션 줄이기'}</button>
        </div>
        <div className="fa-story-layout">
          <div className="fa-story-chapters">
            {steps.map((step, index) => (
              <article id={step.id} key={step.id} className="fa-story-chapter" data-step={index}
                ref={element => { chapters.current[index] = element; }}>
                <div className="fa-story-chapter-copy">
                  <p className="fa-story-chapter-eyebrow"><span>0{index + 1}</span>{step.eyebrow}</p>
                  <h3>{step.title[0]}<br />{step.title[1]}</h3>
                  <p className="fa-story-chapter-description">{step.description}</p>
                  <div className="fa-story-takeaway"><ArrowRight size={18} aria-hidden="true" /><p><span>덜 하는 일</span>{step.takeaway}</p></div>
                </div>
                <IncidentPanel stage={index} mobile />
              </article>
            ))}
          </div>
          <aside className="fa-story-sticky" aria-label="스크롤에 따라 연결되는 같은 민원 예시">
            <IncidentPanel stage={activeStep} />
          </aside>
        </div>
        <div className="fa-story-finish"><span>{incident.id}</span><p>접수부터 전달과 기록까지.<br className="fa-story-mobile-break" /> 업무가 한 흐름으로 이어집니다.</p><ArrowDown size={22} aria-hidden="true" /></div>
      </div>
    </section>
  );
}
