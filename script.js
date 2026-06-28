/* ══════════════════════════════════
   FLOATING HEARTS
══════════════════════════════════ */
const heartsContainer = document.getElementById('heartsContainer');
const heartSymbols = ['💕','💖','💗','🌸','✨','🌷','💓','🎀'];
for (let i = 0; i < 18; i++) {
  const h = document.createElement('div');
  h.className = 'heart-float';
  h.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
  h.style.left = Math.random() * 100 + 'vw';
  h.style.fontSize = (0.9 + Math.random() * 1.4) + 'rem';
  h.style.animationDuration = (12 + Math.random() * 20) + 's';
  h.style.animationDelay = (Math.random() * 20) + 's';
  heartsContainer.appendChild(h);
}

/* ══════════════════════════════════
   CONFETTI
══════════════════════════════════ */
const confettiColors = ['#f472b6','#e91e8c','#fce7f3','#be185d','#fbcfe8','#fff'];
function launchConfetti(count = 60, topOffset = null) {
  for (let i = 0; i < count; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    c.style.left = Math.random() * 100 + 'vw';
    if (topOffset) c.style.top = topOffset;
    c.style.width = c.style.height = (6 + Math.random() * 8) + 'px';
    c.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    c.style.animationDuration = (2.5 + Math.random() * 3) + 's';
    c.style.animationDelay = (Math.random() * 1.2) + 's';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 6000);
  }
}
launchConfetti(50);

/* ══════════════════════════════════
   CHIME SOUND (Web Audio API — no file needed)
══════════════════════════════════ */
function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const start = ctx.currentTime + i * 0.13;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.18, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.9);
      osc.start(start);
      osc.stop(start + 0.9);
    });
  } catch (e) { /* silently skip if audio context blocked */ }
}

/* ══════════════════════════════════
   PETAL BURST
══════════════════════════════════ */
const petalEmoji = ['🌸','🌷','✨','💕','🌼','💗','🪷'];
function burstPetals() {
  const count = 14;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'petal-float';
    p.textContent = petalEmoji[Math.floor(Math.random() * petalEmoji.length)];
    p.style.left  = (20 + Math.random() * 60) + 'vw';
    p.style.bottom = '30vh';
    p.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
    p.style.animationDuration = (1.4 + Math.random() * 1.4) + 's';
    p.style.animationDelay   = (Math.random() * 0.4) + 's';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 3000);
  }
}

/* ══════════════════════════════════
   STORY REVEAL SYSTEM
══════════════════════════════════ */
const blocks     = Array.from(document.querySelectorAll('.story-block'));
const revealArea = document.getElementById('revealArea');
const revealBtn  = document.getElementById('revealBtn');

// Button label shown AFTER each reveal (i.e. the prompt to click for the next one)
const btnLabels = [
  'There is more love waiting below. 🌸',
  'Keep going, Amma. 💕',
  'One more little surprise...',
  'You deserve every word of this. 🤍',
  'A little more, just for you.',
  'Almost there, Amma. Keep going. 💖',
  'One last piece of my heart...',
  'One last surprise ✨',
];

let currentIndex = -1;

function revealNext() {
  currentIndex++;
  const block = blocks[currentIndex];
  if (!block) return;

  playChime();
  burstPetals();

  block.classList.add('visible');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { block.classList.add('revealed'); });
  });

  setTimeout(() => {
    block.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 120);

  if (block.dataset.index === '1' && !mapInitialized) initMap();

  const isLast = currentIndex === blocks.length - 1;

  if (isLast) {
    revealBtn.classList.add('hidden');
    setTimeout(() => {
      document.getElementById('surpriseBtnWrap').style.display = 'block';
      document.getElementById('siteFooter').style.display = 'block';
      revealArea.style.display = 'none';
    }, 1000);
  } else {
    // update the button label for the NEXT click
    setTimeout(() => {
      revealBtn.textContent = btnLabels[Math.min(currentIndex, btnLabels.length - 1)];
    }, 500);
  }
}

revealBtn.addEventListener('click', revealNext);

// Reveal the first block automatically after a short delay
setTimeout(() => revealNext(), 600);

/* ══════════════════════════════════
   MAP OF LOVE
══════════════════════════════════ */
const tempe = [33.4255, -111.9400];
const vizag  = [18.1067,  83.3956];
let mapInitialized = false;
let leafletMap;

function initMap() {
  if (mapInitialized) return;
  mapInitialized = true;

  leafletMap = L.map('map', { zoomControl: true, scrollWheelZoom: false })
                .fitBounds([tempe, vizag], { padding: [40, 40] });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap', maxZoom: 8
  }).addTo(leafletMap);

  const pinkIcon = (label) => L.divIcon({
    className: '',
    html: `<div style="background:linear-gradient(135deg,#e91e8c,#be185d);color:#fff;font-family:'Nunito',sans-serif;font-weight:700;font-size:12px;padding:6px 10px;border-radius:20px;box-shadow:0 4px 14px rgba(233,30,140,0.45);white-space:nowrap;border:2px solid #fff;">${label}</div>`,
    iconAnchor: [0, 0]
  });

  L.marker(tempe, { icon: pinkIcon('📍 Yoshita · Tempe, AZ') }).addTo(leafletMap);
  L.marker(vizag,  { icon: pinkIcon('📍 Amma · Vizianagaram, India') }).addTo(leafletMap);
  L.polyline([tempe, vizag], { color: '#e91e8c', weight: 2.5, opacity: 0.7, dashArray: '8, 10' }).addTo(leafletMap);
}

/* ══════════════════════════════════
   23 THINGS I LOVE ABOUT YOU
══════════════════════════════════ */
const loveThings = [
  "You speak your heart.",
  "You are strong and bold. Even when life wasn't kind to you, you never stopped being brave.",
  "You always believed in me before I believed in myself.",
  "You gave me wings, even though it meant I would fly far away.",
  "You are my favourite person ever.",
  "You made every sacrifice look effortless, even though I now know it wasn't.",
  "You never let me feel alone. No matter what happened, I always knew I had you.",
  "You packed love into every lunch box. Back then it was food; now I know it was your way of showing love.",
  "You protected me fiercely. I still smile remembering how you believed only you can hit me and you fighting with my teachers.",
  "You taught me to stand on my own feet, not because you wanted me to leave, but because you wanted me to soar.",
  "You gave me opportunities you never had. Every dream I'm living today is because of your sacrifices.",
  "You always found a way. Even when things were difficult, you somehow made everything work.",
  "You are the safest place I've ever known. Home has always been you.",
  "You laugh with your whole heart.",
  "You showed me what unconditional love looks like. I've never had to earn your love — it was always there.",
  "You had the courage to let your only daughter cross an ocean. That is one of the bravest things anyone has ever done for me.",
  "You never stopped cheering for me, even when you had every reason to be scared.",
  "You taught me to be independent while reminding me I'd always have a home to come back to.",
  "You care so much for me even before yourself. I admire that deeply, but I really hope you'll start caring for yourself, too.",
  "You are my biggest inspiration. Every time life feels difficult, I think of you and keep going.",
  "You make ordinary moments unforgettable. Some of my happiest memories are simply being with you.",
  "You are the reason I am the person I am today. Every good part of me has a little piece of you in it.",
  "Most of all, I love that you're my Amma.",
];

const loveList = document.getElementById('loveList');
loveThings.forEach((text) => {
  const li = document.createElement('li');
  li.textContent = text;
  loveList.appendChild(li);
});

/* ══════════════════════════════════
   GARDEN OF THANKS
══════════════════════════════════ */
const flowers = [
  { emoji: '🌼', msg: 'You taught me courage.' },
  { emoji: '🌹', msg: 'You taught me independence.' },
  { emoji: '🪷', msg: 'You taught me what unconditional love looks like.' },
  { emoji: '🌺', msg: 'You taught me how to dream.' },
  { emoji: '🌸', msg: 'You taught me what home feels like.' },
  { emoji: '🌷', msg: "Thank you for every sacrifice I didn't even notice at the time." },
  { emoji: '🌻', msg: "Thank you for your laughter — it's the best sound in the world." },
  { emoji: '💐', msg: 'Thank you for praying for me every single day.' },
];

const gardenGrid    = document.getElementById('gardenGrid');
const gardenComplete = document.getElementById('gardenComplete');
let bloomedCount = 0;

flowers.forEach((f) => {
  const btn = document.createElement('button');
  btn.className = 'flower-btn';

  const tip = document.createElement('div');
  tip.className = 'flower-tooltip';
  tip.textContent = f.msg;

  const petal = document.createElement('span');
  petal.className = 'petal';
  petal.textContent = f.emoji;

  btn.appendChild(tip);
  btn.appendChild(petal);

  btn.addEventListener('click', () => {
    if (!btn.classList.contains('bloomed')) {
      btn.classList.add('bloomed');
      bloomedCount++;
      if (bloomedCount === flowers.length) {
        gardenComplete.style.display = 'block';
        launchConfetti(30, '60vh');
      }
    }
  });

  gardenGrid.appendChild(btn);
});

/* ══════════════════════════════════
   THINGS I PROMISE
══════════════════════════════════ */
const promises = [
  "I'll take you on vacations instead of you sacrificing yours.",
  "that your happiest years are still ahead.",
  "We'll never fight like other families do.",
  "I'll always love you.",
  "I'll always take care of you until my last breath.",
];

const promisesList = document.getElementById('promisesList');
promises.forEach((text) => {
  const item = document.createElement('div');
  item.className = 'promise-item';

  const word = document.createElement('div');
  word.className = 'promise-word';
  word.textContent = 'I promise...';

  const p = document.createElement('div');
  p.className = 'promise-text';
  p.textContent = text;

  item.appendChild(word);
  item.appendChild(p);
  promisesList.appendChild(item);
});

/* ══════════════════════════════════
   ONE LAST SURPRISE
══════════════════════════════════ */
const surpriseBtn  = document.getElementById('surpriseBtn');
const overlay      = document.getElementById('surpriseOverlay');
const line1        = document.getElementById('surpriseLine1');
const line2        = document.getElementById('surpriseLine2');
const closeBtn     = document.getElementById('surpriseClose');

const pianoAudio = new Audio('https://upload.wikimedia.org/wikipedia/commons/6/6b/Fur_Elise_Beethoven.ogg');
pianoAudio.volume = 0.4;
pianoAudio.loop   = true;

surpriseBtn.addEventListener('click', () => {
  overlay.classList.add('active');
  pianoAudio.play().catch(() => {});

  setTimeout(() => { line1.classList.add('show'); }, 800);
  setTimeout(() => { line2.classList.add('show'); }, 3200);
  setTimeout(() => { closeBtn.classList.add('show'); }, 5200);
});

closeBtn.addEventListener('click', () => {
  overlay.classList.remove('active');
  pianoAudio.pause();
  pianoAudio.currentTime = 0;
  setTimeout(() => {
    line1.classList.remove('show');
    line2.classList.remove('show');
    closeBtn.classList.remove('show');
  }, 1400);
});
