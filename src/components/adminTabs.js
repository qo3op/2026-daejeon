import { appState } from '../state.js';
import { runNearestAssignment } from '../services/assignment.js';
import { createApplicantManager } from './applicantManager.js';
import { createConditionManager } from './conditionManager.js';
import { createPollingPlaceManager } from './pollingPlaceManager.js';
import { createTable } from './resultTable.js';

const adminTabs = [
  { id: 'places', label: '투표소 관리' },
  { id: 'applicants', label: '신청명단 관리' },
  { id: 'conditions', label: '조건 설정' },
  { id: 'assignment', label: '자동 배정' },
  { id: 'results', label: '결과 확인' },
];

function getAssignmentStats() {
  const requiredTotal = appState.pollingPlaces.reduce(
    (total, place) => total + Number(place.requiredCount || 0),
    0,
  );

  return {
    placeCount: appState.pollingPlaces.length,
    applicantCount: appState.applicants.length,
    requiredTotal,
    assignedCount: appState.assignmentResult.length,
  };
}

function createStatsView() {
  const stats = getAssignmentStats();
  const wrapper = document.createElement('section');
  wrapper.className = 'card';
  wrapper.innerHTML = `
    <div class="section-heading">
      <div>
        <h2>자동 배정</h2>
        <p>등록된 투표소와 신청자 좌표를 기준으로 가까운 신청자를 우선 배정합니다.</p>
      </div>
    </div>
    <div class="stats-grid">
      <div><strong>${stats.placeCount}</strong><span>등록 투표소 수</span></div>
      <div><strong>${stats.applicantCount}</strong><span>신청 인원 수</span></div>
      <div><strong>${stats.requiredTotal}</strong><span>필요 인원 수</span></div>
      <div><strong>${stats.assignedCount}</strong><span>배정 완료 수</span></div>
    </div>
    <div class="button-row">
      <button id="run-assignment">자동 배정 실행</button>
      <button class="secondary" id="check-data">배정 전 데이터 확인</button>
    </div>
  `;

  wrapper.querySelector('#run-assignment').addEventListener('click', () => {
    appState.assignmentResult = runNearestAssignment(
      appState.pollingPlaces,
      appState.applicants,
      appState.conditions,
    );
    alert(`자동 배정 완료: ${appState.assignmentResult.length}명 배정`);
  });

  wrapper.querySelector('#check-data').addEventListener('click', () => {
    const message = [
      `투표소: ${stats.placeCount}개`,
      `신청자: ${stats.applicantCount}명`,
      `필요인원: ${stats.requiredTotal}명`,
      '위도/경도가 없는 데이터는 배정 후보에서 제외됩니다.',
    ].join('\n');
    alert(message);
  });

  return wrapper;
}

function createResultView() {
  const section = document.createElement('section');
  section.className = 'card';
  section.innerHTML = `
    <div class="section-heading">
      <div>
        <h2>결과 확인</h2>
        <p>배정 결과를 확인하고 추후 엑셀 다운로드 기능을 연결합니다.</p>
      </div>
      <div class="button-row compact">
        <button class="secondary" id="download-result">결과 엑셀 다운로드</button>
        <button class="ghost" id="clear-result">결과 초기화</button>
      </div>
    </div>
    <div id="result-table"></div>
  `;

  const tableContainer = section.querySelector('#result-table');
  const render = () => {
    tableContainer.replaceChildren(
      createTable(
        [
          { key: 'type', label: '구분' },
          { key: 'district', label: '자치구' },
          { key: 'dong', label: '행정동' },
          { key: 'pollingPlaceName', label: '투표소명' },
          { key: 'applicantName', label: '배정자' },
          { key: 'department', label: '부서' },
          { key: 'distanceKm', label: '거리', render: (row) => `${row.distanceKm.toFixed(2)}km` },
          { key: 'reason', label: '배정사유' },
        ],
        appState.assignmentResult,
        '아직 배정 결과가 없습니다.',
      ),
    );
  };

  section.querySelector('#download-result').addEventListener('click', () => {
    alert('SheetJS XLSX.writeFile로 결과 다운로드를 연결할 자리입니다.');
  });

  section.querySelector('#clear-result').addEventListener('click', () => {
    appState.assignmentResult = [];
    render();
  });

  render();
  return section;
}

export function createAdminTabs() {
  const wrapper = document.createElement('section');
  wrapper.className = 'admin-shell';
  wrapper.innerHTML = `
    <div class="admin-tabs">
      ${adminTabs.map((tab) => `<button data-tab="${tab.id}">${tab.label}</button>`).join('')}
    </div>
    <div id="admin-panel"></div>
  `;

  const panel = wrapper.querySelector('#admin-panel');
  const buttons = [...wrapper.querySelectorAll('.admin-tabs button')];

  const renderTab = (tabId) => {
    buttons.forEach((button) => {
      button.classList.toggle('active', button.dataset.tab === tabId);
    });

    const views = {
      places: createPollingPlaceManager,
      applicants: createApplicantManager,
      conditions: createConditionManager,
      assignment: createStatsView,
      results: createResultView,
    };

    panel.replaceChildren(views[tabId]());
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => renderTab(button.dataset.tab));
  });

  renderTab('places');
  return wrapper;
}
