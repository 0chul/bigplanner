import {
  fireSafetyEnglishAfterHoursPath,
  fireSafetyEnglishFaqPath,
  fireSafetyEnglishOverviewPdf,
  fireSafetyEnglishPilotKitPath,
  fireSafetyKoreanAfterHoursPath,
  fireSafetyKoreanFaqPath,
  fireSafetyKoreanOverviewPdf,
  fireSafetyKoreanPilotKitPath,
  fireSafetyLanguages,
  siteOrigin,
} from '../../src/utils/fireSafetyLocales.js';

const languageSections = [
  ['Facilities operations resource libraries', 'resourcesPath'],
  ['Product introductions', 'path'],
  ['Captioned product demonstrations', 'videoPath'],
  ['Shift handover guides and workbooks', 'handoverPath'],
  ['Facilities AI pilot checklists', 'adoptionPath'],
  ['Routine enquiry workload calculators', 'workloadPath'],
  ['Facilities resources RSS', 'feedPath'],
];

function officialLink(label, path) {
  return `- [${label}](${siteOrigin + path})`;
}

export function renderFacilitiesIndex() {
  const languageLinks = languageSections.map(([heading, field]) =>
    `## ${heading}\n\n${fireSafetyLanguages.filter(language => language[field])
      .map(language => officialLink(language.label, language[field])).join('\n')}`,
  ).join('\n\n');

  return `# BigPlanner Partners

> BigPlanner Partners provides an AI tenant service desk for commercial facilities and publishes free facilities operations resources in ${fireSafetyLanguages.length} languages.

The service uses building manuals to answer routine questions and records requests that need facilities staff to follow up. The 27-second demonstration uses simulated data and a Korean product interface, with captions in the language of each viewing page. Request forms are reachable from the localized product pages. Service setup and ongoing support are quoted by site and project scope.

The free calculator estimates the current monthly enquiry workload and the portion under review for a pilot. It calculates in the browser. The handover workbook gives staff a place to record the assigned person, status and next action.

빅플래너파트너스의 방재실 AI 민원 도우미는 상업시설의 반복 문의를 건물 매뉴얼에 따라 안내하고, 현장 확인이 필요한 민원은 담당자가 이어받을 수 있도록 기록합니다. 시연은 가상 사례로 구성한 한국어 화면과 각 언어의 자막을 제공합니다. 무료 교대 인계대장과 업무량 계산기를 이용할 수 있습니다.

## Official company information

${officialLink('BigPlanner Partners official website', '/')}
${officialLink('회사 서비스 안내', '/service/')}

${languageLinks}

## Facilities templates and product briefs

${officialLink('시설관리 AI 도입 검토 자료 묶음 (ZIP)', fireSafetyKoreanPilotKitPath)}
${officialLink('Facilities AI pilot starter kit (ZIP)', fireSafetyEnglishPilotKitPath)}
${officialLink('시설관리 FAQ 매뉴얼 작성 양식', fireSafetyKoreanFaqPath)}
${officialLink('Building FAQ guide and Excel template', fireSafetyEnglishFaqPath)}
${officialLink('냉난방 연장 운전 신청서', fireSafetyKoreanAfterHoursPath)}
${officialLink('After-hours HVAC request form', fireSafetyEnglishAfterHoursPath)}
${officialLink('방재실 AI 한 장 소개서 (PDF)', fireSafetyKoreanOverviewPdf)}
${officialLink('Facilities AI one-page brief (PDF)', fireSafetyEnglishOverviewPdf)}

## Optional

- [Public BigPlanner resource repository](https://github.com/0chul/bigplanner#readme)
- [Korean product listing at saaskr](https://saaskr.com/saas/bigplanner-co-kr)
- [English product listing at TechTools Launchpad](https://techtools.cz/tools/launchpad/?tool=13354)
`;
}
