import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://injrbniytgtubemniaps.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluanJibml5dGd0dWJlbW5pYXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MzA3NDcsImV4cCI6MjA4OTIwNjc0N30.h3njZ7cRvJblL_MIZJ5qJRD45zjzsdWpPiV-90tDxmg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const newProjects = [
  {
    title: '방배동 장기전세주택건립사업',
    category: '주거',
    subcategory: '장기전세주택',
    year: '2024',
    location: '서초구 방배동 911-11번지 일원',
    client: '공공/민간 개발사업',
    role: 'PM (진행중인 사업)',
    image: '/images/projects/bangbae-housing.jpg',
    gallery: [
      '/images/projects/bangbae-housing.jpg'
    ],
    description: '서초구 방배동 911-11번지 일원에 추진 중인 방배동 장기전세주택 건립사업 프로젝트입니다. 지하 4층~지상 25층(최고높이 75.20m), 연면적 24,312.60㎡ 규모로 공동주택 총 140세대(분양 103세대 / 공공임대 37세대), 부대복리시설 및 공영주차장(195대)을 복합 조성하는 핵심 주거 프로젝트입니다. 빅플래너파트너스가 종합 PM을 맡아 인허가부터 개발 기획 및 사업 관리를 총괄 진행하고 있습니다.',
    challenge: '서초구 도심 주거 밀집 지역 내에서 공공임대와 일반분양 세대의 입체적 조화, 법정 대수를 상회하는 195대 주차 공간 및 공영주차장 복합화, 상한 용적률 476.41%를 효율적으로 적용해야 하는 복합적 인허가 과제가 있었습니다.',
    solution: '도시계획 및 공간 최적화 설계를 통해 지상 25층 랜드마크 스카이라인을 확보하고, 지하 4개 층에 효율적인 주차 동선을 구축했습니다. 공공성과 사업성을 동시에 충족하는 지속 가능한 장기전세주택 개발 모델을 완성했습니다.',
    zoning: '공동주택 및 부대복리시설, 공영주차장',
    land_area: '3184.95',
    building_area: '1790.72',
    total_floor_area: '24312.60',
    scale: '지하 4층 ~ 지상 25층 (최고높이 75.20m)',
    far: '476.41',
    bcr: '56.22',
    notes: 'PM : 진행중인 사업 | 세대수: 총 140세대 (분양 103세대 / 공공임대 37세대) | 주차대수: 195대 (법정 182대) | 지상 15,173.31㎡ / 지하 9,139.29㎡'
  },
  {
    title: '안양 메디컬웰니스개발사업',
    category: '복합개발',
    subcategory: '메디컬 웰니스',
    year: '2024',
    location: '경기도 안양시 만안구 안양동 622-89외 3필지',
    client: '메디컬 웰니스 개발 컨소시엄',
    role: 'PM (진행중인 사업)',
    image: '/images/projects/anyang-wellness.jpg',
    gallery: [
      '/images/projects/anyang-wellness.jpg'
    ],
    description: '경기도 안양시 만안구 안양동 622-89외 3필지 일반상업지역에 건립되는 지하 5층~지상 49층, 전체 연면적 77,656.30㎡(23,491.03평) 규모의 매머드급 메디컬 웰니스 복합개발 프로젝트입니다. 410세대의 주거 시설과 최첨단 메디컬 케어 및 웰니스 라이프케어 인프라가 융합된 안양 도심의 미래형 랜드마크 타워입니다.',
    challenge: '일반상업지역 내 816.73%의 초고밀도 용적률을 실현하면서 주거(410세대)의 정온한 생활 환경과 메디컬 웰니스 상업시설의 개방적 접근성을 분리·공존시키는 입체 동선 체계가 요구되었습니다.',
    solution: '지하 5층~지상 49층의 미래지향적 수직 복합 설계를 적용하여 저층부는 웰니스 및 메디컬 특화 상업 포디움으로, 중상층부는 독립된 프라이빗 주거 타워로 분리 계획하여 사업 가치와 사용자 만족도를 극대화했습니다.',
    zoning: '일반상업지역',
    land_area: '6305.00',
    building_area: '',
    total_floor_area: '77656.30',
    scale: '지하 5층 ~ 지상 49층',
    far: '816.73',
    bcr: '57.97',
    notes: 'PM : 진행중인 사업 | 410세대 | 매입면적 6,555.00㎡ (1,982.89평) / 사업면적 6,305.00㎡ (1,907.26평) | 지상연면적 53,536.87㎡ (16,194.90평)'
  },
  {
    title: '양평 스마트팜 웰니스파크',
    category: '복합개발',
    subcategory: '노유자시설 / 스마트팜',
    year: '2024',
    location: '경기도 양평군',
    client: '웰니스파크 개발단',
    role: 'PM (진행중인 사업)',
    image: '/images/projects/yangpyeong-wellness.jpg',
    gallery: [
      '/images/projects/yangpyeong-wellness.jpg'
    ],
    description: '경기도 양평군의 수려한 청정 자연환경 속에 대지면적 16,668.00㎡(5,042.05평), 연면적 17,283.60㎡(5,228.27평) 규모로 조성되는 친환경 스마트팜 웰니스파크 및 노유자시설 건립 사업입니다. 정보통신기술(ICT) 기반의 첨단 스마트팜과 자연 치유, 힐링 복지 시설이 결합된 수도권 대표 생태 웰니스 복합 거점입니다.',
    challenge: '계획관리지역 및 보전관리지역의 까다로운 환경·건축 규제를 준수하면서 대규모 스마트팜 시설과 노유자시설의 편리하고 안전한 무장애(Barrier-Free) 동선을 조성해야 했습니다.',
    solution: '자연 지형과 경관을 훼손하지 않는 친환경 저층 배치(건폐율 28.26%, 용적률 81.01%)와 지하 1층~지상 4층 규모의 유기적 테라스형 설계를 채택했습니다. 법정 기준(72대)의 약 1.8배인 128대의 넉넉한 주차 인프라를 계획하여 방문객 편의를 대폭 향상시켰습니다.',
    zoning: '계획관리지역, 보전관리지역',
    land_area: '16668.00',
    building_area: '4710.00',
    total_floor_area: '17283.60',
    scale: '지하 1층 ~ 지상 4층',
    far: '81.01',
    bcr: '28.26',
    notes: 'PM : 진행중인 사업 | 주용도: 노유자시설 | 주차대수: 128대 (법정 72대) | 지상 13,503.00㎡ / 지하 3,780.60㎡'
  },
  {
    title: '이수역 래지던스호텔 주상복합 개발사업',
    category: '복합개발',
    subcategory: '래지던스호텔 주상복합',
    year: '2024',
    location: '서울 동작구 사당동 136-1 외 14필지',
    client: '㈜대우건설 (시공 예정)',
    role: '개발기획 및 PM (검토중인 사업)',
    image: '/images/projects/isu-residence.jpg',
    gallery: [
      '/images/projects/isu-residence.jpg'
    ],
    description: '서울 서남권 교통 요지인 이수역 초역세권(이수3 특별계획구역)에 건립되는 42층 하이엔드 복합 건축물 \'LUMIÈRE Hotel & Residences\' 개발 프로젝트입니다. 지하 8층~지상 42층, 총연면적 68,313㎡(20,665평) 규모로 저층부 아트리움 & 로비, 프리미엄 부티크 호텔, 최고급 레지던스, 루프탑 인피니티 풀 & 스카이 가든을 아우르는 랜드마크 주상복합입니다.',
    challenge: '15개 필지에 달하는 대규모 토지 매입 및 통합, 일반상업지역 내 용적률 999.26%(최대 1,094% 검토) 고밀 복합 개발 계획 수립과 지하 8층 대심도 굴착을 위한 종합적 공정 및 안전 대책 마련이 필수적이었습니다.',
    solution: '이수3 특별계획구역 지침에 부합하는 정밀 도시계획 가이드라인을 적용하고, 국내 대표 건설사인 ㈜대우건설과의 시공 협력(예정) 및 약 50개월의 체계적인 마스터 플랜을 수립했습니다. 법정 기준을 훌쩍 넘는 442대의 자주식 주차 공간을 배치하여 명품 복합 단지를 기획했습니다.',
    zoning: '일반상업지역 / 이수3 특별계획구역',
    land_area: '4235.2',
    building_area: '',
    total_floor_area: '68313',
    scale: '지하 8층 ~ 지상 42층',
    far: '999.26',
    bcr: '58.45',
    notes: '계획안 : 검토중인 사업 | 건축 조감도: LUMIÈRE Hotel & Residences | 매입면적 4,789.3㎡(1,449평), 사업면적 4,235.2㎡(1,281평) | 공사기간: 약 50개월 | 주차대수: 442대 (법정 416.5대) | 시공사: ㈜대우건설 (예정)'
  },
  {
    title: '신림 메디컬레지던스 개발사업',
    category: '복합개발',
    subcategory: '메디컬 레지던스',
    year: '2024',
    location: '서울특별시 관악구 신림동 1433-1 외 15필지',
    client: '신림 복합개발 프로젝트',
    role: '개발기획 및 PM (검토중인 사업)',
    image: '/images/projects/sillim-medical.jpg',
    gallery: [
      '/images/projects/sillim-medical.jpg'
    ],
    description: '서울특별시 관악구 신림동 1433-1 외 15필지 일반상업지역 중심에 건립되는 지하 7층~지상 20층 규모의 메디컬 레지던스 개발사업입니다. 대지면적 3,716.15㎡(1,124.14평), 연면적 47,122.61㎡(14,279.58평)에 달하며 총 354세대의 주거 공간과 450대 규모의 여유로운 주차 공간, 전문 클리닉 시설을 통합한 도심형 메디컬 라이프스타일 랜드마크입니다.',
    challenge: '16개 필지 통합에 따른 제척부지(23.55㎡) 분리 및 부지 정형화, 용적률 799.7% 상한 적용과 지하 7층 대심도 굴착에 따른 도심지 시공성 확보가 주요 과제였습니다.',
    solution: '철저한 권리 분석을 통해 제척부지를 원만히 정리하고 3,716.15㎡의 최적화된 사업면적을 확보했습니다. 지하 7개 층을 활용하여 법정 기준을 넉넉히 초과하는 450대의 쾌적한 주차장을 계획하고, 저층부 의료 특화 테넌트와 상층부 354세대 고급 레지던스를 유기적으로 연계했습니다.',
    zoning: '도시지역, 일반상업지역',
    land_area: '3716.15',
    building_area: '2241.88',
    total_floor_area: '47122.61',
    scale: '지하 7층 ~ 지상 20층',
    far: '799.7',
    bcr: '60.33',
    notes: '계획안 : 검토중인 사업 | 세대수: 354세대 | 주차대수: 450대 | 매입면적 3,739.70㎡ (1,131.26평) / 사업면적 3,716.15㎡ (1,124.14평) — 제척부지 23.55㎡ 제외 | 지상 29,717.98㎡ / 지하 17,404.63㎡'
  }
];

async function run() {
  for (const project of newProjects) {
    // Check if already exists
    const { data: existing } = await supabase
      .from('projects')
      .select('id, title')
      .eq('title', project.title)
      .maybeSingle();

    if (existing) {
      console.log(`Updating existing project: ${project.title}`);
      const { error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', existing.id);
      if (error) console.error('Error updating:', error);
      else console.log(`Successfully updated: ${project.title}`);
    } else {
      console.log(`Inserting new project: ${project.title}`);
      const { error } = await supabase
        .from('projects')
        .insert([project]);
      if (error) console.error('Error inserting:', error);
      else console.log(`Successfully inserted: ${project.title}`);
    }
  }
}

run();
