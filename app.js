// app.js

const API_URL = 'https://focus-project-production.up.railway.app';

// ---------------------------------------------------------------------
// 1. Telegram init
// ---------------------------------------------------------------------
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

const initData = tg?.initData || '';
const tgUser = tg?.initDataUnsafe?.user;

document.getElementById('username').textContent = tgUser
  ? (tgUser.username ? '@' + tgUser.username : tgUser.first_name)
  : 'гость';

// ---------------------------------------------------------------------
// 2. Tab switching (Track / History)
// ---------------------------------------------------------------------
const screens = document.querySelectorAll('.screen');
const navBtns = document.querySelectorAll('.navBtn');

navBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.screen;

    screens.forEach((s) => s.classList.toggle('active', s.id === targetId));
    navBtns.forEach((b) => b.classList.toggle('active', b === btn));

    // Leaflet needs a nudge to redraw correctly if it was hidden when resized
    if (targetId === 'trackScreen') {
      setTimeout(() => map.invalidateSize(), 50);
    }

    if (targetId === 'historyScreen') {
      loadHistory();
    }
  });
});

// ---------------------------------------------------------------------
// 3. Map (dark tiles to match the theme)
// ---------------------------------------------------------------------
const map = L.map('map', { zoomControl: false }).setView([55.751244, 37.618423], 15);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CARTO',
  maxZoom: 19,
}).addTo(map);

let routeLine = L.polyline([], { color: '#9b81ff', weight: 5, opacity: 0.9 }).addTo(map);
let userMarker = null;

// ---------------------------------------------------------------------
// 4. Tracking state
// ---------------------------------------------------------------------
let isTracking = false;
let watchId = null;
let track = [];
let startedAt = null;
let timerInterval = null;

const els = {
  startBtn: document.getElementById('startBtn'),
  stopBtn: document.getElementById('stopBtn'),
  time: document.getElementById('statTime'),
  distance: document.getElementById('statDistance'),
  pace: document.getElementById('statPace'),
  status: document.getElementById('status'),
  trackScreen: document.getElementById('trackScreen'),
};

els.startBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    setStatus('Геолокация не поддерживается этим устройством');
    return;
  }

  track = [];
  startedAt = Date.now();
  isTracking = true;

  els.startBtn.style.display = 'none';
  els.stopBtn.style.display = 'block';
  els.trackScreen.classList.add('running');
  setStatus('Отслеживаем маршрут…');

  watchId = navigator.geolocation.watchPosition(onNewPosition, onGeoError, {
    enableHighAccuracy: true,
    maximumAge: 1000,
    timeout: 10000,
  });

  timerInterval = setInterval(updateTimerDisplay, 1000);
});

els.stopBtn.addEventListener('click', async () => {
  stopTracking();

  if (track.length < 2) {
    setStatus('Слишком короткая пробежка — не сохранено');
    resetUI();
    return;
  }

  setStatus('Сохраняем…');

  try {
    const res = await fetch(`${API_URL}/api/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Telegram-Init-Data': initData,
      },
      body: JSON.stringify({
        track,
        startedAt: new Date(startedAt).toISOString(),
      }),
    });

    if (!res.ok) throw new Error('Server error');

    const data = await res.json();
    setStatus(`Сохранено: ${data.run.distance_km.toFixed(2)} км`);
  } catch (err) {
    console.error(err);
    setStatus('Не удалось сохранить пробежку. Проверьте соединение.');
  }

  resetUI();
});

function onNewPosition(position) {
  const point = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    timestamp: Date.now(),
  };

  track.push(point);
  routeLine.addLatLng([point.lat, point.lon]);
  map.setView([point.lat, point.lon]);

  if (!userMarker) {
    userMarker = L.circleMarker([point.lat, point.lon], {
      radius: 7,
      color: '#9b81ff',
      fillColor: '#9b81ff',
      fillOpacity: 1,
    }).addTo(map);
  } else {
    userMarker.setLatLng([point.lat, point.lon]);
  }

  updateStatsDisplay();
}

function onGeoError(err) {
  console.error(err);
  setStatus('Не удалось получить GPS-сигнал');
}

function stopTracking() {
  isTracking = false;
  if (watchId !== null) navigator.geolocation.clearWatch(watchId);
  if (timerInterval) clearInterval(timerInterval);
}

function resetUI() {
  els.startBtn.style.display = 'block';
  els.stopBtn.style.display = 'none';
  els.trackScreen.classList.remove('running');
}

function updateTimerDisplay() {
  const elapsedSec = Math.floor((Date.now() - startedAt) / 1000);
  els.time.textContent = formatTime(elapsedSec);
}

function updateStatsDisplay() {
  const distanceKm = calculateTrackDistanceClientSide(track);
  els.distance.textContent = distanceKm.toFixed(2);

  const elapsedSec = (Date.now() - startedAt) / 1000;
  if (distanceKm > 0.05) {
    const paceSecPerKm = elapsedSec / distanceKm;
    els.pace.textContent = formatPace(paceSecPerKm);
  }
}

function calculateTrackDistanceClientSide(points) {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += haversine(points[i - 1], points[i]);
  }
  return total;
}

function haversine(a, b) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function toRad(deg) { return (deg * Math.PI) / 180; }

function formatTime(totalSec) {
  const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const s = String(totalSec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function formatPace(secPerKm) {
  const m = Math.floor(secPerKm / 60);
  const s = String(Math.round(secPerKm % 60)).padStart(2, '0');
  return `${m}:${s}`;
}

function setStatus(text) { els.status.textContent = text; }

// ---------------------------------------------------------------------
// 5. History screen
// ---------------------------------------------------------------------
const historyList = document.getElementById('historyList');
const totalRunsEl = document.getElementById('totalRuns');
const totalDistanceEl = document.getElementById('totalDistance');

const MONTHS_RU = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

async function loadHistory() {
  historyList.innerHTML = '<div id="emptyHistory">Загружаем…</div>';

  try {
    const res = await fetch(`${API_URL}/api/runs`, {
      headers: { 'X-Telegram-Init-Data': initData },
    });

    if (!res.ok) throw new Error('Server error');

    const data = await res.json();
    renderHistory(data.runs);
  } catch (err) {
    console.error(err);
    historyList.innerHTML = '<div id="emptyHistory">Не удалось загрузить историю</div>';
  }
}

function renderHistory(runs) {
  totalRunsEl.textContent = runs.length;
  totalDistanceEl.textContent = runs.reduce((sum, r) => sum + r.distance_km, 0).toFixed(1);

  if (runs.length === 0) {
    historyList.innerHTML = '<div id="emptyHistory">Пока нет пробежек.<br>Начните первую на вкладке «Трекер».</div>';
    return;
  }

  historyList.innerHTML = runs.map(runRowHtml).join('');
}

function runRowHtml(run) {
  const date = new Date(run.started_at);
  const dateStr = `${date.getDate()} ${MONTHS_RU[date.getMonth()]}`;
  const paceStr = run.avg_pace_sec_per_km ? formatPace(run.avg_pace_sec_per_km) : '—:—';

  return `
    <div class="run-row">
      <div class="bar"></div>
      <div class="content">
        <div class="date">${dateStr}</div>
        <div class="row-stats">
          <div>
            <div class="value">${run.distance_km.toFixed(2)}<span class="unit">км</span></div>
            <div class="label">дистанция</div>
          </div>
          <div>
            <div class="value">${formatTime(run.duration_sec)}</div>
            <div class="label">время</div>
          </div>
          <div>
            <div class="value">${paceStr}</div>
            <div class="label">темп /км</div>
          </div>
        </div>
      </div>
    </div>
  `;
}
