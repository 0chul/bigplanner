# 방재실 AI 민원 도우미 운영

회사 홈페이지의 BIG Management에서 방재실 페이지로 이동한다. 고객 페이지는 `/fire-safety-ai/`이며, `npm run build`가 페이지 본문과 신청 폼을 포함한 정적 HTML을 생성한다. 메인 브랜치의 GitHub Pages 배포에 함께 반영된다.

별도 서브도메인을 운영할 때는 그 호스트의 HTTPS와 정적 호스팅을 설정하고, `/` 요청을 홈페이지 빌드의 `/fire-safety-ai/index.html`에 연결한다. `/assets/`와 `/images/`는 같은 빌드의 파일을 제공한다. GitHub Actions 저장소 변수 `VITE_FIRE_SAFETY_SUBDOMAIN`에 서브도메인 이름만 설정해 다시 빌드하면 해당 호스트의 루트에서도 제품 화면이 유지되고 서비스 버튼과 대표 주소가 함께 바뀐다. 변수가 비어 있으면 홈페이지 서비스 버튼, 관리자 링크, 검색엔진 대표 주소는 모두 회사 도메인의 `/fire-safety-ai/`를 사용한다.

신청 폼은 기존 `fire_safety_demo_requests` 테이블을 사용한다. `/admin/fire-safety-leads`에서 신청을 확인하고, `/admin/fire-safety-demos`에서 일정 상태와 메모를 관리한다. 데모 신청 데이터에 대한 접근은 `fire_safety_demo_admins` 허용 목록으로 제어한다. 기존 데이터베이스의 테이블 정의와 보관 기간 정책은 [SQL 원본](../supabase/sql/fire_safety_demo_requests.sql)에서 확인할 수 있다.

`npm run test:fire-safety`는 입력 검증과 신청 데이터 형식을 검사한다. 로컬 미리보기를 띄우고 `FIRE_SAFETY_TEST_URL`을 해당 서버 주소로 설정한 뒤 `npm run test:fire-safety:ui`를 실행하면 화면·신청·재시도 동작을 확인할 수 있다. 브라우저 테스트의 신청 요청은 모의 응답을 사용한다.
