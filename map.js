// ================================================
// Mapa de estaciones — Página Paraguas
// ================================================

import { db } from './firebase.js';
import {
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const DEFAULT_CENTER = [19.4332, -99.1905];
const DEFAULT_ZOOM = 14;

// Init mapa
const map = L.map('map', {
  zoomControl: true,
  attributionControl: true
}).setView(DEFAULT_CENTER, DEFAULT_ZOOM);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

// Icon factory
function makeUmbrellaIcon(stock) {
  let stateClass = '';
  if (stock === 0) stateClass = 'empty';
  else if (stock <= 2) stateClass = 'low';

  return L.divIcon({
    className: '',
    html: `
      <div class="umbrella-marker ${stateClass}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v2M4.2 10.3C6 6.2 8.9 4 12 4s6 2.2 7.8 6.3c.2.5-.2 1-.7 1H4.9c-.5 0-.9-.5-.7-1z" fill="currentColor" fill-opacity="0.25"/>
          <path d="M12 11v8a2 2 0 0 1-4 0"/>
        </svg>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 38],
    popupAnchor: [0, -34]
  });
}

function makeUserIcon() {
  return L.divIcon({
    className: '',
    html: '<div class="user-location-marker"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
}

// State
const markers = new Map();
let stationsCache = [];
let userLatLng = null;
let userHasLocated = false;

// Popup HTML
function renderStationPopup(station) {
  const stock = station.umbrellas ?? 0;
  let stockText, stockClass = '';
  if (stock === 0) { stockText = 'Sin paraguas'; stockClass = 'empty'; }
  else if (stock === 1) { stockText = '1 paraguas'; stockClass = 'low'; }
  else if (stock <= 2) { stockText = `${stock} paraguas`; stockClass = 'low'; }
  else { stockText = `${stock} paraguas`; }

  return `
    <div class="station-popup">
      <div class="station-popup-title">${escapeHtml(station.name || 'Estación')}</div>
      ${station.address ? `<div class="station-popup-address">${escapeHtml(station.address)}</div>` : ''}
      <div class="station-popup-stock">
        <span class="station-popup-stock-dot ${stockClass}"></span>
        ${stockText}
      </div>
      <div class="station-popup-actions">
        <button class="primary" data-action="walk" data-lat="${station.lat}" data-lng="${station.lng}">🚶 Caminando</button>
        <button data-action="drive" data-lat="${station.lat}" data-lng="${station.lng}">🚗 Coche</button>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Update stations
function updateStations(stations) {
  stationsCache = stations;

  const currentIds = new Set(stations.map(s => s.id));
  for (const [id, marker] of markers.entries()) {
    if (!currentIds.has(id)) { map.removeLayer(marker); markers.delete(id); }
  }

  for (const s of stations) {
    if (typeof s.lat !== 'number' || typeof s.lng !== 'number') continue;

    const existing = markers.get(s.id);
    if (existing) {
      existing.setLatLng([s.lat, s.lng]);
      existing.setIcon(makeUmbrellaIcon(s.umbrellas ?? 0));
      existing.setPopupContent(renderStationPopup(s));
    } else {
      const m = L.marker([s.lat, s.lng], { icon: makeUmbrellaIcon(s.umbrellas ?? 0) })
        .bindPopup(renderStationPopup(s))
        .addTo(map);
      markers.set(s.id, m);
    }
  }

  if (stations.length > 0 && !userHasLocated) {
    const bounds = L.latLngBounds(stations.map(s => [s.lat, s.lng]));
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
  }

  if (userLatLng) updateNearestInfo();
}

// Firestore listener
const stationsQuery = query(collection(db, 'stations'), where('active', '==', true));

onSnapshot(stationsQuery, (snap) => {
  const list = [];
  snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
  updateStations(list);
});

// Geolocation
let userMarker = null;

function locateUser() {
  if (!navigator.geolocation) return;

  const btn = document.getElementById('locate-btn');
  btn?.classList.add('active');

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      userLatLng = { lat: latitude, lng: longitude };
      userHasLocated = true;

      if (userMarker) userMarker.setLatLng([latitude, longitude]);
      else userMarker = L.marker([latitude, longitude], { icon: makeUserIcon(), interactive: false }).addTo(map);

      const nearest = findNearestStation(latitude, longitude);
      if (nearest) {
        const bounds = L.latLngBounds([[latitude, longitude], [nearest.lat, nearest.lng]]);
        map.fitBounds(bounds, { padding: [80, 80], maxZoom: 16 });
      }

      updateNearestInfo();
      btn?.classList.remove('active');
    },
    () => { btn?.classList.remove('active'); },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  );
}

function findNearestStation(lat, lng) {
  const avail = stationsCache.filter(s => (s.umbrellas ?? 0) > 0);
  const pool = avail.length > 0 ? avail : stationsCache;
  let nearest = null, minDist = Infinity;
  for (const s of pool) {
    if (typeof s.lat !== 'number') continue;
    const d = haversine(lat, lng, s.lat, s.lng);
    if (d < minDist) { minDist = d; nearest = { ...s, _dist: d }; }
  }
  return nearest;
}

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = deg => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function formatDistance(m) {
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(1)} km`;
}

function updateNearestInfo() {
  const info = document.getElementById('map-info');
  if (!info || !userLatLng) return;
  const nearest = findNearestStation(userLatLng.lat, userLatLng.lng);
  if (nearest) {
    info.innerHTML = `<strong>${nearest.name}</strong> · ${formatDistance(nearest._dist)} · ${nearest.umbrellas ?? 0} paraguas`;
    info.classList.add('visible');
  }
}

// Event handlers
document.getElementById('locate-btn')?.addEventListener('click', locateUser);

// Route buttons in popups
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  const lat = btn.dataset.lat;
  const lng = btn.dataset.lng;
  let url;
  if (action === 'walk') url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
  else if (action === 'drive') url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
  if (url) window.open(url, '_blank');
});

// Auto-locate si ya hay permiso
window.addEventListener('load', () => {
  if (navigator.permissions) {
    navigator.permissions.query({ name: 'geolocation' }).then(result => {
      if (result.state === 'granted') setTimeout(locateUser, 500);
    }).catch(() => {});
  }
});
