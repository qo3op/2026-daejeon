import './style.css';
import { createAdminTabs } from './components/adminTabs.js';
import { createApplicantForm } from './components/applicantForm.js';
import { loadKakaoSdk } from './utils/geocode.js';

const app = document.querySelector('#app');

function createTopTabs() {
  const tabs = document.createElement('div');
  tabs.className = 'top-tabs';
  tabs.innerHTML = `
    <button class="active" data-screen="applicant">신청자용 화면</button>
    <button data-screen="admin">관리자용 화면</button>
  `;
  return tabs;
}

function renderScreen(screen) {
  const content = document.querySelector('#screen-content');
  content.replaceChildren(screen === 'admin' ? createAdminTabs() : createApplicantForm());

  document.querySelectorAll('.top-tabs button').forEach((button) => {
    button.classList.toggle('active', button.dataset.screen === screen);
  });
}

function renderApp() {
  app.innerHTML = `
    <header class="app-header">
      <div>
        <p class="eyebrow">Daejeon Election Operations</p>
        <h1>대전시 투표사무원 자동배정 시스템</h1>
      </div>
    </header>
    <main class="container">
      <div id="top-tabs-holder"></div>
      <div id="screen-content"></div>
    </main>
  `;

  const tabs = createTopTabs();
  document.querySelector('#top-tabs-holder').appendChild(tabs);
  tabs.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-screen]');
    if (button) renderScreen(button.dataset.screen);
  });

  renderScreen('applicant');
}

renderApp();

// SDK는 필요 시 geocodeAddress에서도 로드되지만, 키 누락을 빠르게 확인할 수 있게 백그라운드 선로드를 시도합니다.
loadKakaoSdk().catch((error) => {
  console.info(error.message);
});
