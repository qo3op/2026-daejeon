import { appState } from '../state.js';
import { createTable } from './resultTable.js';

function normalizeApplicant(row) {
  return {
    id: crypto.randomUUID(),
    department: row.부서명 || row.department || '',
    name: row.성명 || row.name || '',
    rank: row.직급 || row.rank || '',
    birthDate: row.생년월일 || row.birthDate || '',
    phone: row.연락처 || row.phone || '',
    address: row.주소 || row.address || '',
    lat: row.위도 || row.lat || '',
    lng: row.경도 || row.lng || '',
    availableType: row.가능투표유형 || row.availableType || 'both',
    preferenceEnabled: row.선호신청여부 || row.preferenceEnabled || 'none',
    preferredDistrict1: row['선호구 1순위'] || row.preferredDistrict1 || '',
    preferredDistrict2: row['선호구 2순위'] || row.preferredDistrict2 || '',
    preferredDong1: row['선호동 1순위'] || row.preferredDong1 || '',
    preferredDong2: row['선호동 2순위'] || row.preferredDong2 || '',
    bankName: row.은행명 || row.bankName || '',
    accountNumber: row.계좌번호 || row.accountNumber || '',
    memo: row.비고 || row.memo || '',
  };
}

async function parseApplicantExcel(file) {
  // 보안 점검에서 npm xlsx 패키지의 high severity 취약점이 확인되어,
  // 실제 파싱은 후속 단계에서 안전한 파서 선택 후 연결합니다.
  // 연결 시에는 normalizeApplicant(row)를 재사용하면 됩니다.
  console.info('신청명단 업로드 파일:', file.name);
  throw new Error('엑셀 파서는 보안 검토 후 연결 예정입니다.');
}

function renderTable(container) {
  const columns = [
    { key: 'department', label: '부서명' },
    { key: 'name', label: '성명' },
    { key: 'rank', label: '직급' },
    { key: 'phone', label: '연락처' },
    { key: 'address', label: '주소' },
    { key: 'lat', label: '위도' },
    { key: 'lng', label: '경도' },
  ];

  container.replaceChildren(createTable(columns, appState.applicants, '등록된 신청자가 없습니다.'));
}

export function createApplicantManager() {
  const section = document.createElement('section');
  section.className = 'card';
  section.innerHTML = `
    <div class="section-heading">
      <div>
        <h2>신청명단 관리</h2>
        <p>신청자 화면에서 접수된 명단 또는 엑셀 업로드 명단을 확인합니다.</p>
      </div>
    </div>
    <div class="upload-box">
      <input type="file" id="applicant-upload" accept=".xlsx,.xls,.csv" />
      <span>엑셀 업로드 시 현재 신청명단에 추가됩니다.</span>
    </div>
    <div id="applicant-manager-table"></div>
  `;

  const tableContainer = section.querySelector('#applicant-manager-table');

  section.querySelector('#applicant-upload').addEventListener('change', async (event) => {
    const [file] = event.target.files;
    if (!file) return;

    try {
      const importedApplicants = await parseApplicantExcel(file);
      appState.applicants = [...appState.applicants, ...importedApplicants];
      renderTable(tableContainer);
    } catch (error) {
      alert(error.message);
      event.target.value = '';
    }
  });

  renderTable(tableContainer);
  return section;
}
