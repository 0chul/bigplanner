import { ChevronRight, ClipboardList, HardHat, UserRoundCheck } from 'lucide-react';
import { FIRE_SAFETY_INCIDENT as incident } from '../data/fireSafetyStory';
import './fire-safety-handoff-art.css';

export default function FireSafetyHandoffArt() {
  return (
    <div
      className="fa-story-art fa-story-handoff-art"
      role="img"
      aria-label={`관리자가 시설 담당자를 지정해 5층 공용 회의실의 냉방 접수 카드 ${incident.id}를 그대로 전달합니다.`}
    >
      <div className="fa-handoff-route" aria-hidden="true">
        <div className="fa-handoff-person">
          <span className="fa-handoff-avatar"><UserRoundCheck /></span>
          <strong>관리자</strong>
          <span>담당자 지정</span>
        </div>
        <span className="fa-handoff-link" />
        <div className="fa-handoff-ticket">
          <div className="fa-handoff-id"><ClipboardList />{incident.id}</div>
          <div className="fa-handoff-issue">
            <strong>냉방 불편</strong>
            <span>5층 공용 회의실</span>
          </div>
        </div>
        <span className="fa-handoff-link"><ChevronRight /></span>
        <div className="fa-handoff-person fa-handoff-recipient">
          <span className="fa-handoff-avatar"><HardHat /></span>
          <strong>시설 담당자</strong>
          <span>현장 확인</span>
        </div>
      </div>
    </div>
  );
}
