Fuji JPEG Recipe Reader v1.1

용도
----
후지 카메라 원본 JPEG의 EXIF 및 Fujifilm MakerNote 정보를 브라우저 안에서 로컬로 분석합니다.
사진 파일은 서버로 업로드되지 않습니다.

v1.1 수정
---------
- Dynamic Range 표시를 'DR 설정 방식'과 '적용 DR 값'으로 분리
- DevelopmentDynamicRange / AutoDynamicRange 태그를 추가로 확인
- 디버깅용 DR Raw 값을 추가 메타데이터에 표시
- 톤 곡선 raw 값이 H 24 / S -24처럼 표시되는 문제 수정
- 톤 곡선을 카메라 표시값 기준으로 환산 표시
  예: raw 24 -> -2, raw -24 -> +2

주의
----
- 원본 Fujifilm JPEG 기준으로 가장 정확합니다.
- Lightroom, Photoshop, 메신저, SNS를 거친 JPEG는 MakerNote가 제거되어 레시피 값이 누락될 수 있습니다.
- 기종과 펌웨어에 따라 일부 태그의 raw 값 표현이 다를 수 있습니다.

v1.2 수정
---------
- 필름 시뮬레이션 표시명을 현재 Fujifilm 카메라 메뉴에서 보는 이름 기준으로 정리
- Fujichrome 표시를 Velvia / VIVID로 변경
- CLASSIC Negative -> CLASSIC Neg. 등 공식 표기 스타일에 가깝게 수정
- MONOCHROME / ACROS / SEPIA 계열은 FilmMode가 아니라 Color 태그에 기록되는 경우를 우선 판별하도록 수정
