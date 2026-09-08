// app.js
// Вся логика фронтенда: подключение к Telegram, отслеживание GPS,
// рисование маршрута на карте, отправка пробежки на backend.

// ⚠️ Поменяй на адрес своего backend, когда он будет доступен по HTTPS
// (например, через ngrok на этапе тестов или на реальный домен после деплоя).
const API_URL = 'https://focus-project-production.up.railway.app';

// ---------------------------------------------------------------------
// 1. Инициализация Telegram Mini App
// tg.initData — это та самая подписанная строка с данными пользователя,
// которую backend проверяет в telegramAuth.js
// ---------------------------------------------------------------------
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand(); // разворачивает Mini App на весь экран
}

const initData = tg?.initData || '';
const tgUser = tg?.initDataUnsafe?.user;

document.getElementById('username').textContent = tgUser
  ? (tgUser.username ? '@' + tgUser.username : tgUser.first_name)
  : 'гость';

// ---------------------------------------------------------------------
// 2. Карта (Leaflet)
// ---------------------------------------------------------------------
const map = L.map('map', { zoomControl: false }).setView([55.751244, 37.618423], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  maxZoom: 19,
}).addTo(map);

let routeLine = L.polyline([], { color: '#3c6e47', weight: 5 }).addTo(map);
let userMarker = null;

// ---------------------------------------------------------------------
// 3. Состояние трекинга (state)
// ---------------------------------------------------------------------
let isTracking = false;
let watchId = null;
let track = [];        // массив точек { lat, lon, timestamp }
let startedAt = null;
let timerInterval = null;

const els = {
  startBtn: document.getElementById('startBtn'),
  stopBtn: document.getElementById('stopBtn'),
  time: document.getElementById('statTime'),
  distance: document.getElementById('statDistance'),
  pace: document.getElementById('statPace'),
  status: document.getElementById('status'),
  app: document.getElementById('app'),
};

// ---------------------------------------------------------------------
// 4. Кнопка "Начать пробежку"
// ---------------------------------------------------------------------
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
  els.app.classList.add('running');
  setStatus('Отслеживаем маршрут…');

  // watchPosition — браузерный API, который вызывает наш callback
  // каждый раз, когда телефон получает новые координаты GPS.
  watchId = navigator.geolocation.watchPosition(onNewPosition, onGeoError, {
    enableHighAccuracy: true,
    maximumAge: 1000,
    timeout: 10000,
  });

  timerInterval = setInterval(updateTimerDisplay, 1000);
});

// ---------------------------------------------------------------------
// 5. Кнопка "Завершить"
// ---------------------------------------------------------------------
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

// ---------------------------------------------------------------------
// Вспомогательные функции
// ---------------------------------------------------------------------

function onNewPosition(position) {
  const point = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    timestamp: Date.now(),
  };

  track.push(point);

  // Обновляем линию маршрута на карте
  routeLine.addLatLng([point.lat, point.lon]);
  map.setView([point.lat, point.lon]);

  if (!userMarker) {
    userMarker = L.circleMarker([point.lat, point.lon], {
      radius: 7,
      color: '#e2572b',
      fillColor: '#e2572b',
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
  els.app.classList.remove('running');
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

// Простой расчёт дистанции на клиенте — только для того, чтобы
// показывать live-статистику во время бега. Финальный, "официальный"
// расчёт всегда делает backend — клиенту в этом вопросе не доверяем.
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

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

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

function setStatus(text) {
  els.status.textContent = text;
}
