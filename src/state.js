// 앱 전체에서 공유하는 단순 상태 저장소입니다.
// 백엔드가 붙기 전까지는 메모리 기반으로 동작하며, 추후 localStorage/API 연동 지점으로 확장할 수 있습니다.
export const appState = {
  pollingPlaces: [],
  applicants: [],
  conditions: {
    priority: ['distance', 'preferredDistrict', 'preferredDong'],
    groupByDepartment: false,
    considerRank: false,
    considerAddress: true,
  },
  assignmentResult: [],
};

export function resetConditions() {
  appState.conditions = {
    priority: ['distance', 'preferredDistrict', 'preferredDong'],
    groupByDepartment: false,
    considerRank: false,
    considerAddress: true,
  };
}
