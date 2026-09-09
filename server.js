// app.js

const API_URL = 'https://focus-project-production.up.railway.app';

// ---------------------------------------------------------------------
// 1. Translations
// ---------------------------------------------------------------------
const TRANSLATIONS = {
  en: {
    navTrack: 'Tracker', navHistory: 'History', navSettings: 'Settings',
    statTimeLabel: 'time', statDistanceLabel: 'km', statPaceLabel: 'pace /km',
    countdownLabel: 'Get ready', cancelBtn: 'Cancel', skipBtn: 'Start now',
    startBtn: 'Start run', pauseBtn: 'Pause', resumeBtn: 'Resume', stopBtn: 'Finish',
    totalRunsLabel: 'runs', totalDistanceLabel: 'km total',
    languageLabel: 'Language', themeLabel: 'Theme', themeDark: 'Dark', themeLight: 'Light',
    guestLabel: 'guest',
    locatingMsg: 'Locating you…',
    locationDenied: 'Allow location access in settings to see yourself on the map',
    geoNotSupported: "Geolocation isn't supported on this device",
    geoSignalFailed: "Couldn't get a GPS signal",
    statusTracking: 'Tracking your route…',
    statusPaused: 'Paused',
    statusTooShort: 'Run too short — not saved',
    statusSaving: 'Saving…',
    statusSaved: (km) => `Saved: ${km} km`,
    statusSaveFailed: "Couldn't save the run. Check your connection.",
    historyLoading: 'Loading…',
    historyLoadFailed: "Couldn't load history",
    historyEmptyLine1: 'No runs yet.',
    historyEmptyLine2: 'Start your first one on the Tracker tab.',
    rowDistance: 'distance', rowTime: 'time', rowPace: 'pace /km',
    activityType: 'RUNNING',
    cardDistance: 'DISTANCE', cardDuration: 'DURATION', cardPace: 'AVG PACE',
    shareBtn: 'Share',
    shareText: (km, time, pace) => `Ran ${km} km in ${time} (${pace}/km) — tracked with RunFocus`,
    shareCopied: 'Copied to clipboard',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  ru: {
    navTrack: 'Трекер', navHistory: 'История', navSettings: 'Настройки',
    statTimeLabel: 'время', statDistanceLabel: 'км', statPaceLabel: 'темп /км',
    countdownLabel: 'Приготовьтесь', cancelBtn: 'Отмена', skipBtn: 'Начать сейчас',
    startBtn: 'Начать пробежку', pauseBtn: 'Пауза', resumeBtn: 'Продолжить', stopBtn: 'Завершить',
    totalRunsLabel: 'пробежек', totalDistanceLabel: 'км всего',
    languageLabel: 'Язык', themeLabel: 'Тема', themeDark: 'Тёмная', themeLight: 'Светлая',
    guestLabel: 'гость',
    locatingMsg: 'Определяем ваше местоположение…',
    locationDenied: 'Разрешите доступ к геолокации в настройках, чтобы видеть себя на карте',
    geoNotSupported: 'Геолокация не поддерживается этим устройством',
    geoSignalFailed: 'Не удалось получить GPS-сигнал',
    statusTracking: 'Отслеживаем маршрут…',
    statusPaused: 'На паузе',
    statusTooShort: 'Слишком короткая пробежка — не сохранено',
    statusSaving: 'Сохраняем…',
    statusSaved: (km) => `Сохранено: ${km} км`,
    statusSaveFailed: 'Не удалось сохранить пробежку. Проверьте соединение.',
    historyLoading: 'Загружаем…',
    historyLoadFailed: 'Не удалось загрузить историю',
    historyEmptyLine1: 'Пока нет пробежек.',
    historyEmptyLine2: 'Начните первую на вкладке «Трекер».',
    rowDistance: 'дистанция', rowTime: 'время', rowPace: 'темп /км',
    activityType: 'БЕГ',
    cardDistance: 'ДИСТАНЦИЯ', cardDuration: 'ДЛИТЕЛЬНОСТЬ', cardPace: 'СР. ТЕМП',
    shareBtn: 'Поделиться',
    shareText: (km, time, pace) => `Пробежал ${km} км за ${time} (${pace}/км) — трек в RunFocus`,
    shareCopied: 'Скопировано в буфер обмена',
    months: ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
  },
  uk: {
    navTrack: 'Трекер', navHistory: 'Історія', navSettings: 'Налаштування',
    statTimeLabel: 'час', statDistanceLabel: 'км', statPaceLabel: 'темп /км',
    countdownLabel: 'Приготуйтесь', cancelBtn: 'Скасувати', skipBtn: 'Почати зараз',
    startBtn: 'Почати пробіжку', pauseBtn: 'Пауза', resumeBtn: 'Продовжити', stopBtn: 'Завершити',
    totalRunsLabel: 'пробіжок', totalDistanceLabel: 'км всього',
    languageLabel: 'Мова', themeLabel: 'Тема', themeDark: 'Темна', themeLight: 'Світла',
    guestLabel: 'гість',
    locatingMsg: 'Визначаємо ваше місцезнаходження…',
    locationDenied: 'Дозвольте доступ до геолокації в налаштуваннях, щоб бачити себе на карті',
    geoNotSupported: 'Геолокація не підтримується цим пристроєм',
    geoSignalFailed: 'Не вдалося отримати GPS-сигнал',
    statusTracking: 'Відстежуємо маршрут…',
    statusPaused: 'На паузі',
    statusTooShort: 'Занадто коротка пробіжка — не збережено',
    statusSaving: 'Зберігаємо…',
    statusSaved: (km) => `Збережено: ${km} км`,
    statusSaveFailed: "Не вдалося зберегти пробіжку. Перевірте з'єднання.",
    historyLoading: 'Завантажуємо…',
    historyLoadFailed: 'Не вдалося завантажити історію',
    historyEmptyLine1: 'Поки немає пробіжок.',
    historyEmptyLine2: 'Почніть першу на вкладці «Трекер».',
    rowDistance: 'дистанція', rowTime: 'час', rowPace: 'темп /км',
    activityType: 'БІГ',
    cardDistance: 'ДИСТАНЦІЯ', cardDuration: 'ТРИВАЛІСТЬ', cardPace: 'СЕР. ТЕМП',
    shareBtn: 'Поділитися',
    shareText: (km, time, pace) => `Пробіг ${km} км за ${time} (${pace}/км) — трек у RunFocus`,
    shareCopied: 'Скопійовано в буфер обміну',
    months: ['січ', 'лют', 'бер', 'кві', 'тра', 'чер', 'лип', 'сер', 'вер', 'жов', 'лис', 'гру'],
  },
};

let currentLang = localStorage.getItem('runfocus_lang') || 'en';
let currentTheme = localStorage.getItem('runfocus_theme') || 'dark';

function t(key) {
  return TRANSLATIONS[currentLang][key];
}

// ---------------------------------------------------------------------
// 2. Telegram init
// ---------------------------------------------------------------------
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

const initData = tg?.initData || '';
const tgUser = tg?.initDataUnsafe?.user;

function applyUsername() {
  document.getElementById('username').textContent = tgUser
    ? (tgUser.username ? '@' + tgUser.username : tgUser.first_name)
    : t('guestLabel');
}

// ---------------------------------------------------------------------
// 3. Language + theme application
// ---------------------------------------------------------------------
function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('runfocus_lang', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });

  document.querySelectorAll('#langOptions .option-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  applyUsername();
  document.getElementById('locatingMsg').textContent = t('locatingMsg');

  // Re-label the pause/resume button if it's currently visible
  if (els.pauseBtn.style.display !== 'none') {
    els.pauseBtn.textContent = appState === 'paused' ? t('resumeBtn') : t('pauseBtn');
  }

  // Re-render history if that screen has data loaded
  if (lastLoadedRuns) renderHistory(lastLoadedRuns);
}

function applyTheme(theme) {
  currentTheme = theme;
  localStorage.setItem('runfocus_theme', theme);
  document.documentElement.classList.toggle('theme-light', theme === 'light');

  document.querySelectorAll('#themeOptions .option-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });

  if (tileContainer) {
    tileContainer.style.filter = theme === 'light'
      ? 'none'
      : 'invert(94%) hue-rotate(210deg) brightness(0.9) contrast(0.85) saturate(0.45)';
  }
}

document.getElementById('langOptions').addEventListener('click', (e) => {
  const btn = e.target.closest('.option-btn');
  if (btn) applyLanguage(btn.dataset.lang);
});

document.getElementById('themeOptions').addEventListener('click', (e) => {
  const btn = e.target.closest('.option-btn');
  if (btn) applyTheme(btn.dataset.theme);
});

// ---------------------------------------------------------------------
// 4. Tab switching (Track / History / Settings)
// ---------------------------------------------------------------------
const screens = document.querySelectorAll('.screen');
const navBtns = document.querySelectorAll('.navBtn');

navBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.screen;

    screens.forEach((s) => s.classList.toggle('active', s.id === targetId));
    navBtns.forEach((b) => b.classList.toggle('active', b === btn));

    if (targetId === 'trackScreen') {
      setTimeout(() => map.invalidateSize(), 50);
    }
    if (targetId === 'historyScreen') {
      loadHistory();
    }
  });
});

// ---------------------------------------------------------------------
// 5. Map
// ---------------------------------------------------------------------
const map = L.map('map', { zoomControl: false });

const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  maxZoom: 19,
}).addTo(map);

const tileContainer = tileLayer.getContainer();

let routeLine = L.polyline([], { color: '#9b81ff', weight: 5, opacity: 0.9 }).addTo(map);
let userMarker = null;

// ---------------------------------------------------------------------
// 5b. Live location on load
// ---------------------------------------------------------------------
let hasCenteredOnUser = false;
const locatingMsgEl = document.getElementById('locatingMsg');

function showLiveLocationMarker(lat, lon) {
  if (!userMarker) {
    userMarker = L.circleMarker([lat, lon], {
      radius: 7,
      color: '#9b81ff',
      fillColor: '#9b81ff',
      fillOpacity: 1,
      weight: 2,
    }).addTo(map);
  } else {
    userMarker.setLatLng([lat, lon]);
  }

  if (!hasCenteredOnUser) {
    map.setView([lat, lon], 16);
    hasCenteredOnUser = true;
    locatingMsgEl.classList.add('hidden');
  }
}

function requestInitialLocation() {
  if (!navigator.geolocation) {
    locatingMsgEl.textContent = t('geoNotSupported');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => showLiveLocationMarker(position.coords.latitude, position.coords.longitude),
    (err) => {
      console.error(err);
      locatingMsgEl.textContent = t('locationDenied');
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );

  navigator.geolocation.watchPosition(
    (position) => {
      if (appState === 'idle') {
        showLiveLocationMarker(position.coords.latitude, position.coords.longitude);
      }
    },
    () => {},
    { enableHighAccuracy: true, maximumAge: 2000 }
  );
}

requestInitialLocation();

// ---------------------------------------------------------------------
// 6. Tracking state machine: idle -> countdown -> running <-> paused
// ---------------------------------------------------------------------
let appState = 'idle';
let watchId = null;
let track = [];

let accumulatedMs = 0;
let segmentStart = null;
let pauseOffsetMs = 0;
let pauseStartedAt = null;

let timerInterval = null;
let countdownInterval = null;
const COUNTDOWN_SECONDS = 15;

const els = {
  startBtn: document.getElementById('startBtn'),
  pauseBtn: document.getElementById('pauseBtn'),
  stopBtn: document.getElementById('stopBtn'),
  time: document.getElementById('statTime'),
  distance: document.getElementById('statDistance'),
  pace: document.getElementById('statPace'),
  status: document.getElementById('status'),
  trackScreen: document.getElementById('trackScreen'),
  countdownOverlay: document.getElementById('countdownOverlay'),
  countdownNumber: document.getElementById('countdownNumber'),
  cancelCountdownBtn: document.getElementById('cancelCountdownBtn'),
  skipCountdownBtn: document.getElementById('skipCountdownBtn'),
};

els.startBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    setStatus(t('geoNotSupported'));
    return;
  }
  startCountdown();
});

function startCountdown() {
  appState = 'countdown';
  let remaining = COUNTDOWN_SECONDS;

  els.countdownNumber.textContent = remaining;
  els.countdownOverlay.classList.add('active');

  countdownInterval = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(countdownInterval);
      els.countdownOverlay.classList.remove('active');
      beginRun();
    } else {
      els.countdownNumber.textContent = remaining;
    }
  }, 1000);
}

els.cancelCountdownBtn.addEventListener('click', () => {
  clearInterval(countdownInterval);
  els.countdownOverlay.classList.remove('active');
  appState = 'idle';
});

els.skipCountdownBtn.addEventListener('click', () => {
  clearInterval(countdownInterval);
  els.countdownOverlay.classList.remove('active');
  beginRun();
});

function beginRun() {
  appState = 'running';
  track = [];
  accumulatedMs = 0;
  pauseOffsetMs = 0;
  segmentStart = Date.now();

  els.startBtn.style.display = 'none';
  els.pauseBtn.style.display = 'block';
  els.pauseBtn.textContent = t('pauseBtn');
  els.stopBtn.style.display = 'block';
  els.trackScreen.classList.add('running');
  setStatus(t('statusTracking'));

  watchId = navigator.geolocation.watchPosition(onNewPosition, onGeoError, {
    enableHighAccuracy: true,
    maximumAge: 1000,
    timeout: 10000,
  });

  timerInterval = setInterval(updateTimerDisplay, 1000);
}

els.pauseBtn.addEventListener('click', () => {
  if (appState === 'running') {
    pauseRun();
  } else if (appState === 'paused') {
    resumeRun();
  }
});

function pauseRun() {
  appState = 'paused';
  accumulatedMs += Date.now() - segmentStart;
  pauseStartedAt = Date.now();

  if (watchId !== null) navigator.geolocation.clearWatch(watchId);
  if (timerInterval) clearInterval(timerInterval);

  els.pauseBtn.textContent = t('resumeBtn');
  setStatus(t('statusPaused'));
}

function resumeRun() {
  appState = 'running';
  pauseOffsetMs += Date.now() - pauseStartedAt;
  segmentStart = Date.now();

  watchId = navigator.geolocation.watchPosition(onNewPosition, onGeoError, {
    enableHighAccuracy: true,
    maximumAge: 1000,
    timeout: 10000,
  });
  timerInterval = setInterval(updateTimerDisplay, 1000);

  els.pauseBtn.textContent = t('pauseBtn');
  setStatus(t('statusTracking'));
}

els.stopBtn.addEventListener('click', async () => {
  stopTracking();

  if (track.length < 2) {
    setStatus(t('statusTooShort'));
    resetUI();
    return;
  }

  setStatus(t('statusSaving'));

  try {
    const res = await fetch(`${API_URL}/api/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Telegram-Init-Data': initData,
      },
      body: JSON.stringify({
        track,
        startedAt: new Date(track[0].timestamp).toISOString(),
      }),
    });

    if (!res.ok) throw new Error('Server error');

    const data = await res.json();
    setStatus(t('statusSaved')(data.run.distance_km.toFixed(2)));
  } catch (err) {
    console.error(err);
    setStatus(t('statusSaveFailed'));
  }

  resetUI();
});

function onNewPosition(position) {
  const point = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    timestamp: Date.now() - pauseOffsetMs,
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
  setStatus(t('geoSignalFailed'));
}

function stopTracking() {
  appState = 'idle';
  if (watchId !== null) navigator.geolocation.clearWatch(watchId);
  if (timerInterval) clearInterval(timerInterval);
}

function resetUI() {
  els.startBtn.style.display = 'block';
  els.pauseBtn.style.display = 'none';
  els.stopBtn.style.display = 'none';
  els.trackScreen.classList.remove('running');
}

function getElapsedMs() {
  if (appState === 'running') {
    return accumulatedMs + (Date.now() - segmentStart);
  }
  return accumulatedMs;
}

function updateTimerDisplay() {
  els.time.textContent = formatTime(Math.floor(getElapsedMs() / 1000));
}

function updateStatsDisplay() {
  const distanceKm = calculateTrackDistanceClientSide(track);
  els.distance.textContent = distanceKm.toFixed(2);

  const elapsedSec = getElapsedMs() / 1000;
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
// 7. History screen
// ---------------------------------------------------------------------
const historyList = document.getElementById('historyList');
const totalRunsEl = document.getElementById('totalRuns');
const totalDistanceEl = document.getElementById('totalDistance');
let lastLoadedRuns = null;

async function loadHistory() {
  historyList.innerHTML = `<div id="emptyHistory">${t('historyLoading')}</div>`;

  try {
    const res = await fetch(`${API_URL}/api/runs`, {
      headers: { 'X-Telegram-Init-Data': initData },
    });

    if (!res.ok) throw new Error('Server error');

    const data = await res.json();
    lastLoadedRuns = data.runs;
    renderHistory(data.runs);
  } catch (err) {
    console.error(err);
    historyList.innerHTML = `<div id="emptyHistory">${t('historyLoadFailed')}</div>`;
  }
}

function renderHistory(runs) {
  totalRunsEl.textContent = runs.length;
  totalDistanceEl.textContent = runs.reduce((sum, r) => sum + r.distance_km, 0).toFixed(1);

  if (runs.length === 0) {
    historyList.innerHTML = `<div id="emptyHistory">${t('historyEmptyLine1')}<br>${t('historyEmptyLine2')}</div>`;
    return;
  }

  historyList.innerHTML = runs.map(runRowHtml).join('');
}

function runRowHtml(run) {
  const date = new Date(run.started_at);
  const dateStr = `${date.getDate()} ${t('months')[date.getMonth()]}`;
  const paceStr = run.avg_pace_sec_per_km ? formatPace(run.avg_pace_sec_per_km) : '—:—';
  const durationStr = formatTime(run.duration_sec);
  const distanceStr = run.distance_km.toFixed(2);

  let track = [];
  try {
    track = typeof run.gps_track === 'string' ? JSON.parse(run.gps_track) : (run.gps_track || []);
  } catch (e) { track = []; }

  return `
    <div class="run-card">
      <div class="run-card-header">
        <div class="run-card-type">${t('activityType')}</div>
        <div class="run-card-date">${dateStr}</div>
      </div>
      <div class="run-card-stats">
        <div>
          <div class="value">${distanceStr}</div>
          <div class="label">${t('cardDistance')}</div>
        </div>
        <div>
          <div class="value">${durationStr}</div>
          <div class="label">${t('cardDuration')}</div>
        </div>
        <div>
          <div class="value">${paceStr}</div>
          <div class="label">${t('cardPace')}</div>
        </div>
      </div>
      <div class="run-card-map">${routeThumbnailSvg(track)}</div>
      <div class="run-card-footer">
        <button class="share-btn" data-distance="${distanceStr}" data-duration="${durationStr}" data-pace="${paceStr}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="10.5" x2="15.4" y2="6.5"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/></svg>
          ${t('shareBtn')}
        </button>
      </div>
    </div>
  `;
}

// Draws the run's GPS path as a simple SVG line, roughly correcting for
// longitude/latitude distortion so the shape isn't visually stretched.
function routeThumbnailSvg(track) {
  if (!track || track.length < 2) {
    return '<svg viewBox="0 0 300 130"></svg>';
  }

  // Sample down long tracks so the SVG path string stays small
  const maxPoints = 150;
  const stride = Math.max(1, Math.floor(track.length / maxPoints));
  const points = track.filter((_, i) => i % stride === 0);

  const lats = points.map((p) => p.lat);
  const lons = points.map((p) => p.lon);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLon = Math.min(...lons), maxLon = Math.max(...lons);
  const avgLat = (minLat + maxLat) / 2;
  const lonCorrection = Math.cos((avgLat * Math.PI) / 180);

  const width = 300, height = 130, padding = 18;
  const spanLat = Math.max(maxLat - minLat, 0.0001);
  const spanLon = Math.max((maxLon - minLon) * lonCorrection, 0.0001);
  const scale = Math.min((width - padding * 2) / spanLon, (height - padding * 2) / spanLat);

  const coords = points.map((p) => {
    const x = padding + ((p.lon - minLon) * lonCorrection) * scale;
    const y = height - padding - (p.lat - minLat) * scale;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return `
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
      <polyline points="${coords.join(' ')}" fill="none" stroke="#9b81ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `;
}

historyList.addEventListener('click', (e) => {
  const btn = e.target.closest('.share-btn');
  if (!btn) return;
  shareRun(btn.dataset.distance, btn.dataset.duration, btn.dataset.pace);
});

function shareRun(distance, duration, pace) {
  const text = t('shareText')(distance, duration, pace);

  if (navigator.share) {
    navigator.share({ text }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      setStatus(t('shareCopied'));
    }).catch(() => {});
  }
}

// ---------------------------------------------------------------------
// 8. Initial setup
// ---------------------------------------------------------------------
document.documentElement.classList.toggle('theme-light', currentTheme === 'light');
applyLanguage(currentLang);
applyTheme(currentTheme);
