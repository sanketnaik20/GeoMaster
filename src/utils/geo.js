// src/utils/geo.js
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Math.round(d);
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

export const calculateBearing = (lat1, lon1, lat2, lon2) => {
  const startLat = deg2rad(lat1);
  const startLon = deg2rad(lon1);
  const destLat = deg2rad(lat2);
  const destLon = deg2rad(lon2);

  const y = Math.sin(destLon - startLon) * Math.cos(destLat);
  const x = Math.cos(startLat) * Math.sin(destLat) -
    Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLon - startLon);
  const brng = Math.atan2(y, x);
  return (rad2deg(brng) + 360) % 360;
};

const rad2deg = (rad) => {
  return rad * (180 / Math.PI);
};

export const getCompassDirection = (bearing) => {
  const directions = ['⬆️', '↗️', '➡️', '↘️', '⬇️', '↙️', '⬅️', '↖️'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
};

export const getProximityColor = (distance) => {
  if (distance === 0) return '#a8c69f'; // Success Sage
  if (distance < 1000) return '#f1c40f'; // Yellow
  if (distance < 5000) return '#e67e22'; // Orange
  return '#94a3b8'; // Muted Slate
};
