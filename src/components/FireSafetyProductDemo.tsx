import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowDown, ArrowUpRight, Bell, BookOpen, Check, CheckCheck, ChevronDown, ClipboardList, MessageSquare, Send, ShieldCheck, UserRound } from 'lucide-react';
import { trackFireSafetyEvent } from '../utils/fireSafetyAnalytics';
import './fire-safety-product-scroll.css';

const scenarios = [
  {
    id: 'guide', label: '반복 문의', number: '01', type: '이용 안내', title: '방문객 주차는 어떻게 하나요?',
    question: '방문객 주차 등록은 어디서 하나요?',
    answer: '이 건물에서는 방문한 입주사를 통해 주차 등록을 안내하고 있어요. 방문하실 입주사를 확인해 주세요.',
    followup: '매뉴얼로 답할 수 있는 문의는 AI가 먼저 안내해, 같은 설명을 반복하는 수고를 덜어줍니다.',
    recordId: 'DEMO-011', aiRole: '건물 매뉴얼에 따라 안내', humanRole: '안내 기준 확인·갱신',
    status: '매뉴얼 안내', location: '가상 빌딩 · 공용 주차장', category: '주차 · 이용 문의',
    summary: '방문객 주차 등록 방법 문의', note: '주차 이용 매뉴얼로 안내한 기록입니다.',
  },
  {
    id: 'request', label: '현장 확인 민원', number: '02', type: '시설 민원', title: '사무실 냉방이 약해요',
    question: '5층 공용 회의실 냉방이 약해요.',
    answer: '가상 빌딩 5층 공용 회의실의 냉방 불편을 접수했어요. 담당자가 확인할 수 있도록 내용을 남기겠습니다.',
    followup: '위치와 내용을 다시 옮기지 않고, 관리자가 같은 접수 내역에서 담당자를 지정합니다.',
    recordId: 'DEMO-012', aiRole: '위치·문의 내용을 접수 정보로 정리', humanRole: '접수 확인·담당자 지정·현장 조치',
    status: '접수 완료', location: '가상 빌딩 · 5층 공용 회의실', category: '시설 · 냉난방',
    summary: '5층 공용 회의실 냉방 불편', note: '접수 내용을 확인한 뒤 담당자를 지정합니다.',
  },
  {
    id: 'handoff', label: '담당자 확인', number: '03', type: '확인 요청', title: '추가 확인이 필요한 문의',
    question: '다음 주말에 별도 작업을 진행해도 되나요?',
    answer: '작업 일정과 승인 여부는 담당자의 확인이 필요해요. 문의 내용을 접수해 담당자 확인으로 이어드리겠습니다.',
    followup: 'AI가 확인할 내용을 정리하고, 일정 승인과 최종 판단은 담당자가 맡습니다.',
    recordId: 'DEMO-013', aiRole: '담당자가 확인할 문의 내용 정리', humanRole: '일정·승인 여부 직접 확인',
    status: '담당자 확인', location: '가상 빌딩 · 입주사 사무실', category: '기타 · 일정 확인',
    summary: '주말 작업 가능 여부와 일정 확인', note: '일정과 승인 사항은 담당자가 직접 확인합니다.',
  },
] as const;

function ProductScene({ index, assigned, onAssign, sceneId, measure = false }: {
  index: number;
  assigned: boolean;
  onAssign: () => void;
  sceneId: string;
  measure?: boolean;
}) {
  const scenario = scenarios[index];
  const chat = useRef<HTMLDivElement>(null);
  const [chatStarted, setChatStarted] = useState(measure);

  useEffect(() => {
    if (measure || !chat.current) return;
    // Begin when this conversation is in view, including each natural-flow
    // mobile scene. The hidden height measurer must never start a conversation.
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || entry.intersectionRatio < .2) return;
      setChatStarted(true);
      observer.disconnect();
    }, { threshold: .2 });
    observer.observe(chat.current);
    return () => observer.disconnect();
  }, [measure]);

  return (
    <article className={measure ? 'fa-product-measure-scene' : 'fa-product-scene'} data-scenario={index} id={sceneId} aria-labelledby={`fa-scenario-${index}`}>
      <div className="fa-product-scene-heading">
        <span>{scenario.number}</span><h3>{scenario.label}</h3>
      </div>
      <div className="fa-product-screens">
        <div className="fa-chat-screen">
          <div className="fa-screen-label"><MessageSquare size={13} /> 입주사 화면</div>
          <div className="fa-chat-header">
            <div className="fa-chat-avatar"><ShieldCheck size={20} /></div>
            <div><strong>가상 빌딩 AI 안내</strong><span>문의와 민원을 남겨주세요</span></div>
          </div>
          <div ref={chat} className="fa-chat-content" data-chat-started={chatStarted ? 'true' : 'false'} key={scenario.id}>
            <p className="fa-chat-date"><strong>AI</strong>{scenario.aiRole}</p>
            <div className="fa-chat-user"><p>{scenario.question}</p><span>입주사</span></div>
            <div className="fa-chat-answer-slot">
              <div className="fa-chat-typing" aria-hidden="true"><i /><i /><i /></div>
              <div className="fa-chat-bot"><div className="fa-bot-icon"><ShieldCheck size={13} /></div><p>{scenario.answer}</p></div>
            </div>
            <div className="fa-chat-receipt">
              <CheckCheck size={15} />
              <div><strong>{scenario.status}</strong><span>접수번호 {scenario.recordId}</span></div>
            </div>
          </div>
          <div className="fa-chat-compose" aria-hidden="true"><span>문의 내용을 입력하세요</span><Send size={14} /></div>
        </div>
        <div className="fa-screen-connector" aria-hidden="true"><ArrowUpRight size={18} /><ArrowDown size={18} /></div>
        <div className="fa-admin-screen">
          <div className="fa-screen-label"><ClipboardList size={13} /> 관리자 화면</div>
          <div className="fa-admin-heading"><strong>민원 접수 관리</strong><span className="fa-admin-mode">DEMO</span></div>
          <div className="fa-admin-nav"><span className="fa-admin-active">접수 내역</span><span>담당자</span><span>매뉴얼</span></div>
          <div className="fa-admin-record" key={scenario.id}>
            <div className="fa-record-top"><span className="fa-record-id">{scenario.recordId}</span><span className={`fa-record-status${assigned ? ' is-assigned' : ''}`}>{assigned ? '담당자 지정' : scenario.status}</span></div>
            <h3>{scenario.summary}</h3>
            <dl>
              <div><dt>민원 유형</dt><dd>{scenario.category}</dd></div>
              <div><dt>위치</dt><dd>{scenario.location}</dd></div>
              <div><dt>회신 연락처</dt><dd>010-****-0000 <small>가상</small></dd></div>
            </dl>
            {index === 0 ? (
              <div className="fa-record-guide"><BookOpen size={15} /><span>건물 매뉴얼 기반 안내</span></div>
            ) : (
              <div className="fa-record-assignment">
                <span><UserRound size={13} /> 담당자</span>
                <button type="button" onClick={onAssign} aria-pressed={assigned}>
                  {assigned ? <><Check size={13} /> 담당자 지정됨</> : <>담당자 지정 <ChevronDown size={13} /></>}
                </button>
              </div>
            )}
            {assigned && <div className="fa-example-notice" role="status"><Bell size={13} /><span>담당자 전달</span></div>}
          </div>
          <p className="fa-admin-note"><UserRound size={15} /><span><strong>담당자</strong>{scenario.humanRole}</span></p>
        </div>
      </div>
      <p className="fa-product-explanation">{scenario.followup}</p>
    </article>
  );
}

const stickyQuery = '(min-width: 1100px) and (min-height: 750px)';

function getStickyTop(element: HTMLElement | null) {
  const inset = element ? Number.parseFloat(getComputedStyle(element).getPropertyValue('--fa-sticky-top')) : NaN;
  return Number.isFinite(inset) ? inset : 12;
}

export default function FireSafetyProductDemo() {
  const [active, setActive] = useState(0);
  const [viewportEligible, setViewportEligible] = useState(() => typeof window !== 'undefined' && window.matchMedia(stickyQuery).matches);
  const [tooTall, setTooTall] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [assigned, setAssigned] = useState([false, false, false]);
  const container = useRef<HTMLDivElement>(null);
  const viewer = useRef<HTMLDivElement>(null);
  const measurement = useRef<HTMLDivElement>(null);
  const chapters = useRef<(HTMLElement | null)[]>([]);
  const viewed = useRef(new Set<number>());
  const sticky = viewportEligible && !tooTall;

  useEffect(() => {
    const layoutMedia = window.matchMedia(stickyQuery);
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateLayout = () => { setViewportEligible(layoutMedia.matches); setTooTall(false); };
    const updateMotion = () => setReducedMotion(motionMedia.matches);
    updateLayout();
    updateMotion();
    layoutMedia.addEventListener('change', updateLayout);
    motionMedia.addEventListener('change', updateMotion);
    window.addEventListener('resize', updateLayout);
    return () => {
      layoutMedia.removeEventListener('change', updateLayout);
      motionMedia.removeEventListener('change', updateMotion);
      window.removeEventListener('resize', updateLayout);
    };
  }, []);

  useEffect(() => {
    if (!sticky || !viewer.current || !measurement.current) return;
    const checkFit = () => {
      // The centered stage fills the viewport; only real product content counts
      // toward the fit check, including the tallest assigned state.
      const frame = viewer.current?.querySelector('.fa-product');
      const currentScene = frame?.querySelector('.fa-product-scene');
      const measuredScenes = measurement.current?.querySelectorAll('.fa-product-measure-scene');
      if (!frame || !currentScene || !measuredScenes?.length) return;
      const maximumSceneHeight = Math.max(...Array.from(measuredScenes as NodeListOf<HTMLElement>, scene => scene.getBoundingClientRect().height));
      const requiredHeight = frame.getBoundingClientRect().height - currentScene.getBoundingClientRect().height + maximumSceneHeight;
      if (requiredHeight > window.innerHeight - getStickyTop(container.current) - 24) {
        setTooTall(true);
      } else if (container.current) {
        // End the scroll track with the tallest real frame, rather than an
        // empty viewport after the final scene. This does not size the cards.
        const finalHeight = `${Math.ceil(requiredHeight)}px`;
        if (container.current.style.getPropertyValue('--fa-product-frame-height') !== finalHeight) {
          container.current.style.setProperty('--fa-product-frame-height', finalHeight);
        }
      }
    };
    const observer = new ResizeObserver(checkFit);
    observer.observe(viewer.current);
    const product = viewer.current.querySelector('.fa-product');
    if (product) observer.observe(product);
    measurement.current.querySelectorAll('.fa-product-measure-scene').forEach(scene => observer.observe(scene));
    checkFit();
    return () => observer.disconnect();
  }, [sticky, active, assigned]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const bounds = container.current?.getBoundingClientRect();
      if (!bounds || bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
      const target = sticky ? getStickyTop(container.current) : window.innerHeight * .5;
      let next = 0;
      let nearest = Infinity;
      chapters.current.forEach((chapter, index) => {
        if (!chapter) return;
        const box = chapter.getBoundingClientRect();
        // Sticky chapters mark scene starts. Their shorter scroll distances
        // are independent of card height; natural-flow scenes keep centering.
        const distance = Math.abs(box.top + (sticky ? 0 : box.height / 2) - target);
        if (distance < nearest) { nearest = distance; next = index; }
      });
      setActive(current => current === next ? current : next);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [sticky]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || entry.intersectionRatio < .2) return;
        const index = Number((entry.target as HTMLElement).dataset.scenario);
        if (!Number.isInteger(index) || viewed.current.has(index)) return;
        viewed.current.add(index);
        trackFireSafetyEvent('demo_scenario_view', { scenario: scenarios[index].id });
      });
    }, { threshold: .2 });
    container.current?.querySelectorAll('.fa-product-scene').forEach(scene => observer.observe(scene));
    return () => observer.disconnect();
  }, [sticky, active]);

  const jumpTo = (index: number) => {
    chapters.current[index]?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  };
  const onStepKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % scenarios.length;
    else if (event.key === 'ArrowLeft') next = (index + scenarios.length - 1) % scenarios.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = scenarios.length - 1;
    else return;
    event.preventDefault();
    document.getElementById(`fa-scenario-${next}`)?.focus({ preventScroll: true });
    jumpTo(next);
  };
  const toggleAssigned = (index: number) => setAssigned(current => current.map((value, position) => position === index ? !value : value));

  const header = <div className="fa-product-topline">
    <span className="fa-product-dots" aria-hidden="true"><i /><i /><i /></span>
    <span>방재실 AI 민원 도우미</span><span className="fa-demo-tag">데모 화면</span>
  </div>;
  const navigation = <nav className="fa-product-tabs" aria-label="민원 처리 상황">
    {scenarios.map((item, index) => <button key={item.id} type="button" id={`fa-scenario-${index}`}
      aria-current={active === index ? 'step' : undefined}
      aria-controls={sticky ? 'fa-scenario-panel' : `fa-product-scene-${index}`}
      onClick={() => jumpTo(index)} onKeyDown={event => onStepKeyDown(event, index)}>
      <span>{item.number}</span>{item.label}
    </button>)}
  </nav>;
  const caption = <div className="fa-product-caption"><span className="fa-caption-dot" />가상 데이터 · 실제 알림 미발송</div>;

  return <div ref={container} className="fa-product-scroll" data-scenario={active} data-layout={sticky ? 'sticky' : 'natural'}
    aria-label="세 가지 문의가 안내와 담당자 확인으로 이어지는 과정">
    {sticky ? <>
      <div className="fa-product-scroll-track" aria-hidden="true">
        {scenarios.map((scenario, index) => <div className="fa-product-chapter" id={`fa-product-chapter-${index}`} key={scenario.id}
          ref={element => { chapters.current[index] = element; }} />)}
      </div>
      <div ref={viewer} className="fa-product-scroll-sticky">
        <div className="fa-product">
          {header}{navigation}
          <div key={scenarios[active].id} className="fa-product-scene-transition"><ProductScene index={active} assigned={assigned[active]} onAssign={() => toggleAssigned(active)} sceneId="fa-scenario-panel" /></div>
          {caption}
        </div>
        <div ref={measurement} className="fa-product-scroll-measure" aria-hidden="true" inert>
          {scenarios.map((scenario, index) => <div key={scenario.id}>
            <ProductScene index={index} assigned={index !== 0} onAssign={() => {}} sceneId={`fa-product-measure-${index}`} measure />
          </div>)}
        </div>
      </div>
    </> : <>
      <div className="fa-product-scroll-overview">{header}{navigation}{caption}</div>
      <div className="fa-product-scroll-natural">
        {scenarios.map((scenario, index) => <div className="fa-product fa-product-chapter" key={scenario.id}
          ref={element => { chapters.current[index] = element; }}>
          <ProductScene index={index} assigned={assigned[index]} onAssign={() => toggleAssigned(index)} sceneId={`fa-product-scene-${index}`} />
        </div>)}
      </div>
    </>}
  </div>;
}
