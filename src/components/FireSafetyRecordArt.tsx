import { FIRE_SAFETY_INCIDENT as incident } from '../data/fireSafetyStory';
import './fire-safety-record-art.css';

export default function FireSafetyRecordArt() {
  return (
    <div className="fa-story-art fa-story-record-art" role="img"
      aria-label={`5층 공용 회의실 냉방 민원의 접수번호 ${incident.id}가 붙은 교대 일지`}>
      <div className="fa-record-stack" aria-hidden="true">
        <span className="fa-record-tab">{incident.id}</span>
        <div className="fa-record-cover">
          <span className="fa-record-spine" />
          <div className="fa-record-inscription">
            <strong>교대 일지</strong>
            <span>5층 공용 회의실 · 냉방</span>
          </div>
        </div>
      </div>
    </div>
  );
}
