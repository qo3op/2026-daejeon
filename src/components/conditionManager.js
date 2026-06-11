import { appState, resetConditions } from '../state.js';

function syncFormFromState(form) {
  form.groupByDepartment.checked = appState.conditions.groupByDepartment;
  form.considerRank.checked = appState.conditions.considerRank;
  form.considerAddress.checked = appState.conditions.considerAddress;
  form.priority1.value = appState.conditions.priority[0];
  form.priority2.value = appState.conditions.priority[1];
  form.priority3.value = appState.conditions.priority[2];
}

export function createConditionManager() {
  const section = document.createElement('section');
  section.className = 'card';
  section.innerHTML = `
    <div class="section-heading">
      <div>
        <h2>조건 설정</h2>
        <p>배정 우선순위와 추가 조건을 설정합니다.</p>
      </div>
    </div>
    <form class="settings-grid" id="condition-form">
      <label>1순위
        <select name="priority1">
          <option value="distance">주소 기준 가까운 투표소 우선</option>
          <option value="preferredDistrict">선호구 반영</option>
          <option value="preferredDong">선호동 반영</option>
        </select>
      </label>
      <label>2순위
        <select name="priority2">
          <option value="distance">주소 기준 가까운 투표소 우선</option>
          <option value="preferredDistrict">선호구 반영</option>
          <option value="preferredDong">선호동 반영</option>
        </select>
      </label>
      <label>3순위
        <select name="priority3">
          <option value="distance">주소 기준 가까운 투표소 우선</option>
          <option value="preferredDistrict">선호구 반영</option>
          <option value="preferredDong">선호동 반영</option>
        </select>
      </label>
      <label class="check-line"><input type="checkbox" name="groupByDepartment" /> 부서끼리 붙여주기</label>
      <label class="check-line"><input type="checkbox" name="considerRank" /> 직급 반영</label>
      <label class="check-line"><input type="checkbox" name="considerAddress" /> 주소 반영</label>
      <div class="button-row span-3">
        <button type="submit">조건 저장</button>
        <button class="ghost" type="button" id="reset-conditions">조건 초기화</button>
      </div>
    </form>
  `;

  const form = section.querySelector('#condition-form');
  syncFormFromState(form);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    appState.conditions = {
      priority: [form.priority1.value, form.priority2.value, form.priority3.value],
      groupByDepartment: form.groupByDepartment.checked,
      considerRank: form.considerRank.checked,
      considerAddress: form.considerAddress.checked,
    };
    alert('조건이 저장되었습니다.');
  });

  section.querySelector('#reset-conditions').addEventListener('click', () => {
    resetConditions();
    syncFormFromState(form);
  });

  return section;
}
