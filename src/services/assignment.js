import { calculateDistanceKm } from '../utils/distance.js';

function normalizeVoteType(value = '') {
  if (value.includes('사전') || value === 'early') return 'early';
  if (value.includes('본') || value === 'main') return 'main';
  return 'both';
}

function canServeAtPlace(place, applicant) {
  const placeType = normalizeVoteType(place.type || place.category || place.구분);
  const availableType = normalizeVoteType(applicant.availableType);

  if (placeType === 'early') {
    return availableType === 'early' || availableType === 'both';
  }

  if (placeType === 'main') {
    return availableType === 'main' || availableType === 'both';
  }

  return true;
}

function buildPreferenceScore(place, applicant, conditions) {
  let score = 0;
  const district = place.district || place.자치구;
  const dong = place.dong || place.행정동;

  // 점수는 낮을수록 우선입니다. 선호구/선호동 일치 시 거리 정렬 전에 살짝 앞당겨집니다.
  if (conditions.priority?.includes('preferredDistrict')) {
    if (district && applicant.preferredDistrict1 === district) score -= 0.3;
    if (district && applicant.preferredDistrict2 === district) score -= 0.15;
  }

  if (conditions.priority?.includes('preferredDong')) {
    if (dong && applicant.preferredDong1 === dong) score -= 0.2;
    if (dong && applicant.preferredDong2 === dong) score -= 0.1;
  }

  return score;
}

function getAssignmentReason(distanceKm, preferenceScore) {
  const reasons = [`거리 ${distanceKm.toFixed(2)}km`];

  if (preferenceScore < 0) {
    reasons.push('선호지역 반영');
  }

  return reasons.join(', ');
}

// 가장 가까운 신청자를 우선 배정하는 기본 알고리즘입니다.
// 추후 조건 점수 함수를 확장하면 부서/직급/세부 주소 기반 정렬을 자연스럽게 추가할 수 있습니다.
export function runNearestAssignment(pollingPlaces, applicants, conditions = {}) {
  const assignedApplicantIds = new Set();
  const results = [];

  pollingPlaces.forEach((place) => {
    const requiredCount = Number(place.requiredCount || place.필요인원 || 0);
    const placeLat = Number(place.lat || place.위도);
    const placeLng = Number(place.lng || place.경도);

    if (!requiredCount || Number.isNaN(placeLat) || Number.isNaN(placeLng)) {
      return;
    }

    const candidates = applicants
      .filter((applicant) => !assignedApplicantIds.has(applicant.id))
      .filter((applicant) => canServeAtPlace(place, applicant))
      .map((applicant) => {
        const applicantLat = Number(applicant.lat);
        const applicantLng = Number(applicant.lng);

        if (Number.isNaN(applicantLat) || Number.isNaN(applicantLng)) {
          return null;
        }

        const distanceKm = calculateDistanceKm(placeLat, placeLng, applicantLat, applicantLng);
        const preferenceScore = buildPreferenceScore(place, applicant, conditions);

        return {
          applicant,
          distanceKm,
          preferenceScore,
          sortScore: distanceKm + preferenceScore,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.sortScore - b.sortScore);

    candidates.slice(0, requiredCount).forEach(({ applicant, distanceKm, preferenceScore }) => {
      assignedApplicantIds.add(applicant.id);
      results.push({
        placeId: place.id,
        applicantId: applicant.id,
        type: place.type || place.구분,
        district: place.district || place.자치구,
        dong: place.dong || place.행정동,
        pollingPlaceName: place.name || place.투표소명,
        applicantName: applicant.name,
        department: applicant.department,
        distanceKm,
        reason: getAssignmentReason(distanceKm, preferenceScore),
      });
    });
  });

  return results;
}
