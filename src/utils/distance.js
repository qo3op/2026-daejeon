// Haversine 공식을 사용해 두 좌표 사이의 직선거리(km)를 계산합니다.
export function calculateDistanceKm(lat1, lng1, lat2, lng2) {
  const parsed = [lat1, lng1, lat2, lng2].map(Number);

  if (parsed.some((value) => Number.isNaN(value))) {
    return null;
  }

  const [fromLat, fromLng, toLat, toLng] = parsed;
  const earthRadiusKm = 6371;
  const toRadians = (degree) => (degree * Math.PI) / 180;

  const dLat = toRadians(toLat - fromLat);
  const dLng = toRadians(toLng - fromLng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(fromLat)) *
      Math.cos(toRadians(toLat)) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}
