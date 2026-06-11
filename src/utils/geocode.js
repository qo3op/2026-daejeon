let kakaoLoadPromise;

// Vite 환경변수의 카카오 JavaScript 키로 SDK를 동적 로드합니다.
// 실제 키는 .env에 VITE_KAKAO_JS_KEY=... 형태로 보관하고 GitHub에는 올리지 않습니다.
export function loadKakaoSdk() {
  if (window.kakao?.maps?.services) {
    return Promise.resolve(window.kakao);
  }

  if (kakaoLoadPromise) {
    return kakaoLoadPromise;
  }

  const kakaoKey = import.meta.env.VITE_KAKAO_JS_KEY;

  if (!kakaoKey) {
    return Promise.reject(
      new Error('.env에 VITE_KAKAO_JS_KEY를 설정한 뒤 다시 실행해주세요.'),
    );
  }

  kakaoLoadPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[data-kakao-sdk]');

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.kakao));
      existingScript.addEventListener('error', reject);
      return;
    }

    const script = document.createElement('script');
    script.dataset.kakaoSdk = 'true';
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => resolve(window.kakao));
    };
    script.onerror = () => reject(new Error('카카오 지도 SDK를 불러오지 못했습니다.'));
    document.head.appendChild(script);
  });

  return kakaoLoadPromise;
}

// 주소 문자열을 위도/경도로 변환합니다.
export async function geocodeAddress(address) {
  if (!address?.trim()) {
    throw new Error('주소를 입력해주세요.');
  }

  const kakao = await loadKakaoSdk();
  const geocoder = new kakao.maps.services.Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.addressSearch(address, (results, status) => {
      if (status !== kakao.maps.services.Status.OK || results.length === 0) {
        reject(new Error('주소 좌표 변환 결과가 없습니다.'));
        return;
      }

      resolve({
        lat: Number(results[0].y),
        lng: Number(results[0].x),
        raw: results[0],
      });
    });
  });
}
