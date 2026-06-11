import { appState } from '../state.js';
import { geocodeAddress } from '../utils/geocode.js';
import { createTable } from './resultTable.js';

const initialForm = {
  department: '',
  name: '',
  rank: '',
  birthDate: '',
  phone: '',
  address: '',
  lat: '',
  lng: '',
  availableType: 'both',
  preferenceEnabled: 'none',
  preferredDistrict1: '',
  preferredDistrict2: '',
  preferredDong1: '',
  preferredDong2: '',
  bankName: '',
  accountNumber: '',
  memo: '',
};

function getFormData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function renderPreview(container) {
  const columns = [
    { key: 'department', label: '부서명' },
    { key: 'name', label: '성명' },
    { key: 'rank', label: '직급' },
    { key: 'phone', label: '연락처' },
    { key: 'address', label: '주소' },
    { key: 'availableTypeLabel', label: '가능 유형' },
  ];

  container.replaceChildren(
    createTable(
      columns,
      appState.applicants.map((applicant) => ({
        ...applicant,
        availableTypeLabel:
          applicant.availableType === 'early'
            ? '사전투표만 가능'
            : applicant.availableType === 'main'
              ? '본투표만 가능'
              : '모두 가능',
      })),
      '아직 신청 내역이 없습니다.',
    ),
  );
}

export function createApplicantForm() {
  const section = document.createElement('section');
  section.className = 'card';
  section.innerHTML = `
    <div class="section-heading">
      <div>
        <h2>투표사무원 신청 입력</h2>
        <p>신청자 정보를 입력하고 주소 좌표를 변환한 뒤 신청하세요.</p>
      </div>
    </div>
    <form class="form-grid" id="applicant-form">
      <label>부서명<input name="department" value="${initialForm.department}" required /></label>
      <label>성명<input name="name" value="${initialForm.name}" required /></label>
      <label>직급<input name="rank" value="${initialForm.rank}" /></label>
      <label>생년월일<input type="date" name="birthDate" value="${initialForm.birthDate}" /></label>
      <label>연락처<input name="phone" value="${initialForm.phone}" placeholder="연락처 입력" /></label>
      <label class="span-2">주소<input name="address" value="${initialForm.address}" placeholder="대전광역시 ..." /></label>
      <button class="secondary align-end" type="button" id="geocode-button">주소 좌표 변환</button>
      <label>위도<input name="lat" value="${initialForm.lat}" readonly /></label>
      <label>경도<input name="lng" value="${initialForm.lng}" readonly /></label>
      <label>가능한 투표 유형
        <select name="availableType">
          <option value="early">사전투표만 가능</option>
          <option value="main">본투표만 가능</option>
          <option value="both" selected>모두 가능</option>
        </select>
      </label>
      <label>선호 신청 여부
        <select name="preferenceEnabled">
          <option value="enabled">선호지역 신청</option>
          <option value="none" selected>선호지역 없음</option>
        </select>
      </label>
      <label>선호구 1순위<input name="preferredDistrict1" placeholder="예: 서구" /></label>
      <label>선호구 2순위<input name="preferredDistrict2" placeholder="예: 유성구" /></label>
      <label>선호동 1순위<input name="preferredDong1" placeholder="예: 둔산동" /></label>
      <label>선호동 2순위<input name="preferredDong2" placeholder="예: 탄방동" /></label>
      <label>은행명<input name="bankName" /></label>
      <label>계좌번호<input name="accountNumber" /></label>
      <label class="span-3">비고<textarea name="memo" rows="3"></textarea></label>
      <div class="button-row span-3">
        <button type="submit">신청하기</button>
        <button class="ghost" type="reset">초기화</button>
      </div>
    </form>
    <div class="subsection">
      <h3>신청 내역 미리보기</h3>
      <div id="applicant-preview"></div>
    </div>
  `;

  const form = section.querySelector('#applicant-form');
  const preview = section.querySelector('#applicant-preview');
  const geocodeButton = section.querySelector('#geocode-button');

  geocodeButton.addEventListener('click', async () => {
    const address = form.elements.address.value;
    geocodeButton.disabled = true;
    geocodeButton.textContent = '변환 중...';

    try {
      const { lat, lng } = await geocodeAddress(address);
      form.elements.lat.value = lat;
      form.elements.lng.value = lng;
    } catch (error) {
      alert(error.message);
    } finally {
      geocodeButton.disabled = false;
      geocodeButton.textContent = '주소 좌표 변환';
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const applicant = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...getFormData(form),
    };
    appState.applicants.push(applicant);
    renderPreview(preview);
    form.reset();
  });

  form.addEventListener('reset', () => {
    setTimeout(() => {
      form.elements.availableType.value = initialForm.availableType;
      form.elements.preferenceEnabled.value = initialForm.preferenceEnabled;
    });
  });

  renderPreview(preview);
  return section;
}
