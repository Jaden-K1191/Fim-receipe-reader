Fuji JPEG Recipe Reader v1.3

용도
----
후지 카메라 원본 JPEG의 EXIF 및 Fujifilm MakerNote 정보를 브라우저 안에서 로컬로 분석합니다.
사진 파일은 서버로 업로드되지 않습니다.

v1.1 수정
---------
- Dynamic Range 표시를 'DR 설정 방식'과 '적용 DR 값'으로 분리
- DevelopmentDynamicRange / AutoDynamicRange 태그를 추가로 확인
- 디버깅용 DR Raw 값을 추가 메타데이터에 표시
- 톤 곡선을 카메라 표시값 기준으로 환산 표시
  예: raw 24 -> -2, raw -24 -> +2

v1.3 수정
---------
- 필름 시뮬레이션 표시명을 현재 Fujifilm 카메라 메뉴에서 보는 이름 기준으로 정리
- FilmMode 0x200 표시를 Velvia / VIVID로 변경
- MONOCHROME / ACROS / SEPIA 계열은 Color 태그를 우선 판별하도록 수정
- 앱 상단 배지에 v1.3 표시 추가
- Service Worker 캐시 이름을 fuji-jpeg-recipe-reader-v1-3으로 변경

주의
----
- 원본 Fujifilm JPEG 기준으로 가장 정확합니다.
- Lightroom, Photoshop, 메신저, SNS를 거친 JPEG는 MakerNote가 제거되어 레시피 값이 누락될 수 있습니다.
- 기종과 펌웨어에 따라 일부 태그의 raw 값 표현이 다를 수 있습니다.
