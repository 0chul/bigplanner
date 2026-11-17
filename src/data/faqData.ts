export type FAQCategory = 'all' | 'consulting' | 'management' | 'credit' | 'general';

export interface FAQItem {
  id: string;
  category: Exclude<FAQCategory, 'all'>;
  categoryLabelKo: string;
  categoryLabelEn: string;
  questionKo: string;
  questionEn: string;
  answerKo: string;
  answerEn: string;
  keyTakeawayKo: string;
  keyTakeawayEn: string;
  relatedPath?: string;
  relatedLabelKo?: string;
  relatedLabelEn?: string;
  displayOrder: number;
}

export const faqCategories: { id: FAQCategory; labelKo: string; labelEn: string }[] = [
  { id: 'all', labelKo: '전체', labelEn: 'All' },
  { id: 'consulting', labelKo: 'BIG Consulting', labelEn: 'BIG Consulting' },
  { id: 'management', labelKo: 'BIG Management', labelEn: 'BIG Management' },
  { id: 'credit', labelKo: 'BIG Credit', labelEn: 'BIG Credit' },
  { id: 'general', labelKo: '계약 · 비용', labelEn: 'Contracts & Fees' },
];

export const propTechFaqs: FAQItem[] = [
  {
    id: 'faq-01',
    category: 'consulting',
    categoryLabelKo: 'BIG Consulting',
    categoryLabelEn: 'BIG Consulting',
    questionKo: '빅플래너파트너스의 프롭테크 컨설팅(BIG Consulting)은 일반 부동산 컨설팅과 무엇이 다른가요?',
    questionEn: 'How does BIG Consulting differ from traditional real estate consulting?',
    answerKo:
      '단순 중개나 감에 의존한 개발 제안이 아니라, 입지·상권 빅데이터, 법규·인허가 리스크, 공사비 원가 데이터, 그리고 공간 사용자 경험(CEM)까지 8대 전문 매트릭스로 교차 검증합니다. 특히 시공사나 설계사의 이해관계에서 독립된 제3자 자문 구조를 유지하여 건축주 관점에서 가장 높은 사업 수익성과 자산 가치를 도출합니다.',
    answerEn:
      'Rather than relying on intuition or brokerage-driven pitches, we cross-verify site and commercial data, zoning and permitting regulations, construction cost benchmarks, and customer experience design (CEM) across 8 analytical matrices. Remaining independent of builders and designers, we deliver objective feasibility focused solely on client ROI and asset value.',
    keyTakeawayKo: '8대 전문 매트릭스 기반 제3자 독립 타당성 분석 및 공간기획',
    keyTakeawayEn: 'Independent 8-matrix feasibility analysis & spatial planning',
    relatedPath: '/service',
    relatedLabelKo: 'BIG Consulting 자세히 보기',
    relatedLabelEn: 'Explore BIG Consulting',
    displayOrder: 1,
  },
  {
    id: 'faq-02',
    category: 'consulting',
    categoryLabelKo: 'BIG Consulting',
    categoryLabelEn: 'BIG Consulting',
    questionKo: '토지 매입 전에도 사업성 검토와 타당성 보고서를 받아볼 수 있나요?',
    questionEn: 'Can I request a feasibility study before purchasing land or a building?',
    answerKo:
      '네, 가능합니다. 오히려 토지·노후 건물 매입 계약 체결 전에 검토하시는 것이 가장 효과적입니다. 지번 정보와 투자 목적을 공유해 주시면 건축 규모 검토(용적률·건폐율·일조권), 예상 총사업비 및 공사비 산출, 임대·매각 시나리오별 수익률(IRR·Cap Rate) 분석을 담은 정밀 검토 보고서를 통상 7~10영업일 이내에 제공합니다.',
    answerEn:
      'Yes. Conducting feasibility prior to signing a purchase contract is strongly recommended. Based on parcel details and investment objectives, we deliver a comprehensive report within 7–10 business days covering massing and zoning envelopes, total project cost estimates, and projected IRR / Cap Rate scenarios.',
    keyTakeawayKo: '매입 전 지번 기반 규모 검토 · 예상 사업비 · 수익률 보고서 7~10영업일 내 제공',
    keyTakeawayEn: 'Pre-acquisition zoning, cost, and ROI report delivered in 7–10 business days',
    relatedPath: '/contact',
    relatedLabelKo: '사전 타당성 검토 문의',
    relatedLabelEn: 'Request Feasibility Review',
    displayOrder: 2,
  },
  {
    id: 'faq-03',
    category: 'management',
    categoryLabelKo: 'BIG Management',
    categoryLabelEn: 'BIG Management',
    questionKo: 'BIGPLANNER APP을 통해 실제로 어떤 현장 정보를 실시간으로 확인할 수 있나요?',
    questionEn: 'What real-time site information is visible in the BIGPLANNER APP?',
    answerKo:
      '건축주는 별도 현장 방문 없이도 앱에서 일일 현장 감리 사진(공종·위치별 타임스탬프 포함), 계획 대비 실제 공정률(%), 당일 투입 인력 현황, 자재 검수 및 품질 시험 통과 여부, 안전 특이사항을 매일 확인할 수 있습니다. 기성 대금 청구 시에도 증빙 사진과 PM 검수 의견을 확인한 뒤 전자서명으로 즉시 승인할 수 있습니다.',
    answerEn:
      'Clients can track daily time-stamped inspection photos by trade and floor, planned vs. actual progress percentages, daily labor headcount, material inspection results, and safety logs directly from the app. Progress payment approvals are also handled via electronic signature backed by verified PM inspection reports.',
    keyTakeawayKo: '일일 현장 사진 · 공정률(%) · 투입 인력 · 전자서명 기성 승인 통합 제공',
    keyTakeawayEn: 'Daily site photos, progress %, labor logs, and e-signature payment approvals',
    relatedPath: '/service',
    relatedLabelKo: '앱 시뮬레이터 확인하기',
    relatedLabelEn: 'View App Capabilities',
    displayOrder: 3,
  },
  {
    id: 'faq-04',
    category: 'management',
    categoryLabelKo: 'BIG Management',
    categoryLabelEn: 'BIG Management',
    questionKo: '건축 PM(프로젝트 관리)을 맡기면 시공사 선정이나 설계사 조율도 대신해 주나요?',
    questionEn: 'Does your PM team handle architect coordination and contractor selection?',
    answerKo:
      '네. BIG Management의 7단계 통합 PM 프로세스에는 기획·설계사 선정 및 VE(가치공학) 설계 검토, 경쟁입찰을 통한 검증된 우수 시공사 선정, 공사 도급계약 특약 협의, 착공 후 주간 공정·품질 관리, 준공 및 하자보수 관리까지 전 과정이 포함됩니다. 건축주를 대행하여 전문가 그룹을 총괄 조율하므로 불필요한 설계 변경과 추가 공사비 발생을 예방합니다.',
    answerEn:
      'Yes. Our 7-stage PM scope covers architect selection and Value Engineering (VE) design reviews, competitive contractor bidding and vetting, contract negotiation, weekly on-site quality and schedule management, and handover with defect-liability oversight—protecting you from avoidable change orders and cost overruns.',
    keyTakeawayKo: '설계 VE · 경쟁입찰 시공사 선정 · 공정/품질 · 준공까지 7단계 전담 대행',
    keyTakeawayEn: 'End-to-end 7-stage management from design VE and bidding to handover',
    relatedPath: '/service',
    relatedLabelKo: '7단계 PM 프로세스 보기',
    relatedLabelEn: 'See 7-Stage PM Process',
    displayOrder: 4,
  },
  {
    id: 'faq-05',
    category: 'credit',
    categoryLabelKo: 'BIG Credit',
    categoryLabelEn: 'BIG Credit',
    questionKo: '노무비닷컴 에스크로 직불 대금관리란 무엇이며, 어떤 사고를 막아주나요?',
    questionEn: 'How does the Nomubi.com escrow payment system protect construction funds?',
    answerKo:
      '빅플래너파트너스는 NICE D&R 노무비닷컴과의 제휴를 통해 건축주의 공사대금을 시공사 일반 계좌가 아닌 전용 에스크로 계좌에 안전하게 예치합니다. 기성 검수가 완료되면 시공사 이윤을 제외한 자재비·장비비·노무비·하도급 대금이 실제 공사를 수행한 각 하도급 업체와 근로자에게 직접 지급됩니다. 이를 통해 시공사의 대금 유용, 임금 체불, 현장 유치권 행사 및 공사 중단 리스크를 원천 차단합니다.',
    answerEn:
      'In partnership with NICE D&R Nomubi.com, construction funds are held in a dedicated escrow account rather than the general contractor’s operating account. Upon PM inspection approval, labor, material, equipment, and subcontractor portions are disbursed directly to verified recipients—preventing fund diversion, unpaid wages, liens, and work stoppages.',
    keyTakeawayKo: '시공사 임의 인출 차단 · 하도급 및 노무비 100% 지정 직불 보장',
    keyTakeawayEn: 'Zero arbitrary withdrawals · 100% direct disbursement to subcontractors & labor',
    relatedPath: '/service',
    relatedLabelKo: '에스크로 흐름도 보기',
    relatedLabelEn: 'View Escrow Flow',
    displayOrder: 5,
  },
  {
    id: 'faq-06',
    category: 'credit',
    categoryLabelKo: 'BIG Credit',
    categoryLabelEn: 'BIG Credit',
    questionKo: '표준 안전계약의 8대 안전장치에는 어떤 법적 보호가 포함되나요?',
    questionEn: 'What legal protections are included in the 8-part safety contract framework?',
    answerKo:
      '단순 표준도급계약서의 허점을 보완하여 ① 직불 합의 및 에스크로 지정 ② 이행·선금·하자보증증권 의무화 ③ 유치권 포기 확약 ④ 공사 타절 및 대체시공 권한 ⑤ 지체상금 및 손해배상 조항 ⑥ 설계변경 사전 서면 승인제 ⑦ 하도급 사전 승인 및 재하도급 금지 ⑧ 전자서명 기반 증빙 일원화 등 8가지 핵심 특약을 착공 전 전자계약으로 구속력 있게 체결합니다.',
    answerEn:
      'Our electronic safety contract closes common loopholes through 8 binding clauses: direct-pay escrow designation, performance/advance/defect surety bonds, lien waivers, step-in & replacement rights, liquidated damages, written change-order controls, subcontracting restrictions, and unified e-signature audit trails.',
    keyTakeawayKo: '유치권 포기 · 보증증권 의무화 · 대체시공 권한 등 8대 특약 전자계약 체결',
    keyTakeawayEn: '8 binding protections including lien waivers, surety bonds, and step-in rights',
    displayOrder: 6,
  },
  {
    id: 'faq-07',
    category: 'general',
    categoryLabelKo: '계약 · 비용',
    categoryLabelEn: 'Contracts & Fees',
    questionKo: '신축 건물뿐만 아니라 중소규모 리모델링이나 상업공간 인테리어에도 서비스를 이용할 수 있나요?',
    questionEn: 'Are your services available for remodeling and commercial interior projects as well as new builds?',
    answerKo:
      '네, 가능합니다. 빅플래너파트너스는 대형 개발사업뿐만 아니라 중소형 빌딩 신축, 노후 건축물 대수선·리모델링(밸류애드), 오피스·의료·F&B 등 하이엔드 상업공간 인테리어 프로젝트까지 다수의 실적을 보유하고 있습니다. 프로젝트 규모와 목표에 맞춰 BIG Consulting 단독 또는 PM·에스크로 통합 패키지로 유연하게 구성하실 수 있습니다.',
    answerEn:
      'Yes. In addition to ground-up developments, we actively manage mid-sized building renovations (value-add), structural retrofits, and commercial interior projects (offices, clinics, F&B, retail). Packages can be tailored to your scale—ranging from standalone Consulting to full PM and Escrow integration.',
    keyTakeawayKo: '신축 · 빌딩 리모델링 · 상업 인테리어 등 규모별 맞춤형 패키지 제공',
    keyTakeawayEn: 'Tailored packages for ground-up builds, value-add remodels, and commercial interiors',
    relatedPath: '/projects',
    relatedLabelKo: '수행 프로젝트 사례 보기',
    relatedLabelEn: 'Browse Project Portfolio',
    displayOrder: 7,
  },
  {
    id: 'faq-08',
    category: 'general',
    categoryLabelKo: '계약 · 비용',
    categoryLabelEn: 'Contracts & Fees',
    questionKo: 'PM 및 컨설팅 비용은 어떻게 산정되며, 결과적으로 추가 비용 부담이 커지는 것은 아닌가요?',
    questionEn: 'How are consulting and PM fees structured, and do they add to total project cost?',
    answerKo:
      '수수료는 프로젝트 유형, 연면적, 총공사비 규모 및 투입 기간에 따라 사전 정액 또는 요율제로 투명하게 산정되며, 계약서에 명시되지 않은 숨은 비용이나 시공사 리베이트는 일절 받지 않습니다. 실제 수행 프로젝트 기준 VE(가치공학)를 통한 불필요 공사비 절감, 공정 단축에 따른 금융이자 절약, 부실시공 예방 효과를 고려하면 오히려 총사업비는 평균 8~15% 이상 절감되는 경우가 많습니다.',
    answerEn:
      'Fees are transparently agreed upfront as a fixed or percentage schedule based on scope, floor area, and duration—with zero hidden markups or contractor kickbacks. In practice, Value Engineering savings, shortened financing periods, and prevented rework typically reduce total project expenditure compared to unmanaged builds.',
    keyTakeawayKo: '사전 투명 정산 · 리베이트 전면 금지 · VE 및 공기 단축으로 총사업비 절감',
    keyTakeawayEn: 'Transparent upfront pricing, zero contractor kickbacks, and net savings via VE',
    displayOrder: 8,
  },
  {
    id: 'faq-09',
    category: 'management',
    categoryLabelKo: 'BIG Management',
    categoryLabelEn: 'BIG Management',
    questionKo: '공사가 이미 진행 중이거나 시공사 선정이 끝난 상태에서도 PM 및 대금관리 도입이 가능한가요?',
    questionEn: 'Can we onboard PM or escrow oversight if construction or contractor selection has already started?',
    answerKo:
      '네, 가능합니다. 착공 전 단계가 가장 이상적이지만, 이미 시공사가 내정되었거나 공사가 진행 중인 현장이라도 현재 공정률 실사, 계약서 독소조항 보완 합의, 잔여 기성 대금의 에스크로 전환, BIGPLANNER APP 감리 시스템 도입을 통해 잔여 공정의 품질과 자금 안전성을 즉시 확보할 수 있습니다.',
    answerEn:
      'Yes. While pre-construction onboarding is ideal, mid-project onboarding is supported through an immediate site audit, supplemental contract addenda, transitioning remaining progress payments into escrow, and deploying BIGPLANNER APP inspection tracking for all remaining milestones.',
    keyTakeawayKo: '진행 중인 현장도 공정 실사 및 잔여 기성 에스크로 전환으로 즉시 합류 가능',
    keyTakeawayEn: 'Mid-project onboarding available via site audit and remaining-balance escrow',
    displayOrder: 9,
  },
  {
    id: 'faq-10',
    category: 'general',
    categoryLabelKo: '계약 · 비용',
    categoryLabelEn: 'Contracts & Fees',
    questionKo: '초기 상담을 신청하면 어떤 순서로 진행되며 준비해야 할 자료가 있나요?',
    questionEn: 'What happens after I submit an inquiry, and what documents should I prepare?',
    answerKo:
      '문의 접수 후 1영업일 이내에 전담 PM이 연락드려 대면 또는 화상 미팅 일정을 조율합니다. 대상지 주소(지번), 대략적인 예산 범위, 희망 용도(임대수익·사옥·매각 등)만 알려주셔도 1차 법규 및 입지 브리핑이 가능하며, 기존에 보유하신 설계도면이나 견적서가 있다면 함께 검토해 드립니다.',
    answerEn:
      'Within 1 business day of submitting your inquiry, a dedicated PM schedules a consultation. You only need the site address (or parcel number), approximate budget, and intended use (yield, headquarters, exit); if you already have drawings or contractor quotes, we will review those during the briefing as well.',
    keyTakeawayKo: '접수 후 1영업일 내 전담 PM 배정 · 지번과 희망 용도만으로 1차 브리핑 가능',
    keyTakeawayEn: 'PM assigned within 1 business day; only parcel address and goal needed to start',
    relatedPath: '/contact',
    relatedLabelKo: '무료 초기 상담 신청하기',
    relatedLabelEn: 'Book Initial Consultation',
    displayOrder: 10,
  },
];
