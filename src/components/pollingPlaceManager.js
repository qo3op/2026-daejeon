import { appState } from '../state.js';
import { createTable } from './resultTable.js';

const samplePollingPlaces = [
  {
    id: crypto.randomUUID(),
    type: '사전투표소',
    district: '서구',
    dong: '둔산동',
    name: '둔산1동 사전투표소',
    address: '대전광역시 서구 둔산동',
    requiredCount: 2,
    lat: 36.3504,
    lng: 127.3845,
  },
  {
    id: crypto.randomUUID(),
    type: '본투표소',
    district: '유성구',
    dong: '온천동',
    name: '온천1동 제1투표소',
    address: '대전광역시 유성구 온천동',
    requiredCount: 2,
    lat: 36.3531,
    lng: 127.341,
  },
];

function normalizePollingPlace(row) {
  return {
    id: crypto.randomUUID(),
    type: row.구분 || row.type || '',
    district: row.자치구 || row.district || '',
    dong: row.행정동 || row.dong || '',
    name: row.투표소명 || row.name || '',
    address: row.주소 || row.address || '',
    requiredCount: Number(row.필요인원 || row.requiredCount || 0),
    lat: row.위도 || row.lat || '',
    lng: row.경도 || row.lng || '',
  };
}

async function parsePollingPlaceExcel(file) {
  // 보안 점검에서 npm xlsx 패키지의 high severity 취약점이 확인되어,
  // 실제 파싱은 후속 단계에서 안전한 파서 선택 후 연결합니다.
  // 연결 시에는 normalizePollingPlace(row)를 재사용하면 됩니다.
  console.info('투표소 업로드 파일:', file.name);
  throw new Error('엑셀 파서는 보안 검토 후 연결 예정입니다.');
}

function renderTable(container) {
  const columns = [
    { key: 'type', label: '구분' },
    { key: 'district', label: '자치구' },
    { key: 'dong', label: '행정동' },
    { key: 'name', label: '투표소명' },
    { key: 'address', label: '주소' },
    { key: 'requiredCount', label: '필요인원' },
    { key: 'lat', label: '위도' },
    { key: 'lng', label: '경도' },
  ];

  container.replaceChildren(createTable(columns, appState.pollingPlaces, '등록된 투표소가 없습니다.'));
}

export function createPollingPlaceManager() {
  const section = document.createElement('section');
  section.className = 'card';
  section.innerHTML = `
    <div class="section-heading">
      <div>
        <h2>투표소 관리</h2>
        <p>구분, 자치구, 행정동, 투표소명, 주소, 필요인원, 위도, 경도 컬럼을 기준으로 업로드합니다.</p>
      </div>
      <button class="secondary" id="load-sample-places">샘플 투표소 불러오기</button>
    </div>
    <div class="upload-box">
      <input type="file" id="polling-place-upload" accept=".xlsx,.xls,.csv" />
      <button class="secondary" type="button" id="bulk-geocode-places">투표소 주소 좌표 일괄 변환</button>
      <span>SheetJS 파싱 구조만 우선 연결되어 있습니다.</span>
    </div>
    <div id="polling-place-table"></div>
  `;

  const tableContainer = section.querySelector('#polling-place-table');

  section.querySelector('#load-sample-places').addEventListener('click', () => {
    appState.pollingPlaces = [...samplePollingPlaces];
    renderTable(tableContainer);
  });

  section.querySelector('#polling-place-upload').addEventListener('change', async (event) => {
    const [file] = event.target.files;
    if (!file) return;

    try {
      appState.pollingPlaces = await parsePollingPlaceExcel(file);
      renderTable(tableContainer);
    } catch (error) {
      alert(error.message);
      event.target.value = '';
    }
  });

  section.querySelector('#bulk-geocode-places').addEventListener('click', () => {
    alert('다음 단계에서 geocodeAddress를 반복 호출하도록 연결할 자리입니다.');
  });

  renderTable(tableContainer);
  return section;
}
