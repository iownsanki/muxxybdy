// =========================================================
// MUXXY JI'S BIRTHDAY ODYSSEY - CUSTOM EXPERIENCE FROM SANKI
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const chapters = document.querySelectorAll('.chapter');
  const stepIndicators = document.querySelectorAll('.step-indicator');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const tapCue = document.getElementById('tapCue');
  const fireworksCanvas = document.getElementById('fireworksCanvas');
  const ctx = fireworksCanvas.getContext('2d');

  let currentChapter = 0;
  const totalChapters = chapters.length;
  let isCandlesBlown = false;
  let blownCount = 0;

  // ---------------------------------------------------------
  // Resize Canvas
  // ---------------------------------------------------------
  function resizeCanvas() {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // ---------------------------------------------------------
  // Web Audio Synthesizer (Zero External Dependencies)
  // ---------------------------------------------------------
  let audioCtx = null;
  let isAudioMuted = true;
  let melodyTimer = null;
  let melodyStep = 0;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Melodic Happy Birthday Theme (Chime / Kalimba style)
  const bdayMelody = [
    { freq: 261.63, dur: 0.38, pause: 0.12 }, // C4
    { freq: 261.63, dur: 0.28, pause: 0.08 }, // C4
    { freq: 293.66, dur: 0.65, pause: 0.12 }, // D4
    { freq: 261.63, dur: 0.65, pause: 0.12 }, // C4
    { freq: 349.23, dur: 0.65, pause: 0.12 }, // F4
    { freq: 329.63, dur: 1.10, pause: 0.35 }, // E4

    { freq: 261.63, dur: 0.38, pause: 0.12 }, // C4
    { freq: 261.63, dur: 0.28, pause: 0.08 }, // C4
    { freq: 293.66, dur: 0.65, pause: 0.12 }, // D4
    { freq: 261.63, dur: 0.65, pause: 0.12 }, // C4
    { freq: 392.00, dur: 0.65, pause: 0.12 }, // G4
    { freq: 349.23, dur: 1.10, pause: 0.35 }, // F4

    { freq: 261.63, dur: 0.38, pause: 0.12 }, // C4
    { freq: 261.63, dur: 0.28, pause: 0.08 }, // C4
    { freq: 523.25, dur: 0.65, pause: 0.12 }, // C5
    { freq: 440.00, dur: 0.65, pause: 0.12 }, // A4
    { freq: 349.23, dur: 0.65, pause: 0.12 }, // F4
    { freq: 329.63, dur: 0.65, pause: 0.12 }, // E4
    { freq: 293.66, dur: 0.85, pause: 0.35 }, // D4

    { freq: 466.16, dur: 0.38, pause: 0.12 }, // Bb4
    { freq: 466.16, dur: 0.28, pause: 0.08 }, // Bb4
    { freq: 440.00, dur: 0.65, pause: 0.12 }, // A4
    { freq: 349.23, dur: 0.65, pause: 0.12 }, // F4
    { freq: 392.00, dur: 0.65, pause: 0.12 }, // G4
    { freq: 349.23, dur: 1.40, pause: 0.60 }  // F4
  ];

  function playTone(freq, duration, type = 'sine', gainVal = 0.14) {
    if (!audioCtx || isAudioMuted) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(gainVal, audioCtx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration + 0.08);
    } catch(e) {}
  }

  function playKalimbaNote() {
    if (isAudioMuted) return;
    const note = bdayMelody[melodyStep];
    playTone(note.freq, note.dur, 'sine', 0.14);
    playTone(note.freq * 2, note.dur * 0.7, 'triangle', 0.05); // Bell chime overtone
    melodyStep = (melodyStep + 1) % bdayMelody.length;

    const waitMs = (note.dur + note.pause) * 1000;
    melodyTimer = setTimeout(playKalimbaNote, waitMs);
  }

  function toggleMusic() {
    initAudio();
    isAudioMuted = !isAudioMuted;
    if (isAudioMuted) {
      clearTimeout(melodyTimer);
      musicToggleBtn.textContent = '🔇';
      musicToggleBtn.style.opacity = '0.65';
    } else {
      musicToggleBtn.textContent = '🎵';
      musicToggleBtn.style.opacity = '1';
      playKalimbaNote();
    }
  }

  musicToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMusic();
  });

  // Sound Effect: Sparkle / Pop
  function playPopSfx() {
    if (!audioCtx || isAudioMuted) return;
    playTone(784, 0.15, 'sine', 0.08);
    setTimeout(() => playTone(1046, 0.25, 'triangle', 0.08), 80);
  }

  // Sound Effect: Candle Whoosh
  function playCandleBlowSfx() {
    if (!audioCtx || isAudioMuted) return;
    try {
      const bufferSize = audioCtx.sampleRate * 0.28;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.28);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.28);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();
    } catch(e) {}
  }

  // Sound Effect: Grand Firework Whistle & Boom
  function playFireworkSfx() {
    if (!audioCtx || isAudioMuted) return;
    playTone(440, 0.1, 'sine', 0.05);
    setTimeout(() => {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.4, 'triangle', 0.08), i * 70);
      });
    }, 120);
  }

  // ---------------------------------------------------------
  // Chapter Navigation & Progress
  // ---------------------------------------------------------
  function setChapter(index) {
    if (index < 0 || index >= totalChapters) return;

    chapters[currentChapter].classList.remove('active');
    currentChapter = index;
    chapters[currentChapter].classList.add('active');

    // Update Progress Indicators
    stepIndicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === currentChapter);
      ind.classList.toggle('completed', i < currentChapter);
    });

    // Update Cue
    if (currentChapter === totalChapters - 1) {
      tapCue.style.display = 'none';
      launchGrandCelebration();
    } else {
      tapCue.style.display = 'inline-flex';
    }
  }

  function advanceChapter() {
    initAudio();
    if (isAudioMuted && currentChapter === 0) {
      toggleMusic(); // Auto start gentle background music on first tap
    }

    if (currentChapter === 3 && !isCandlesBlown) {
      // In cake chapter, blow all candles first
      blowAllCandles();
      return;
    }

    if (currentChapter < totalChapters - 1) {
      playPopSfx();
      setChapter(currentChapter + 1);
    }
  }

  // ---------------------------------------------------------
  // Chapter 0: Unwrap Button
  // ---------------------------------------------------------
  const unwrapBtn = document.getElementById('unwrapBtn');
  const giftCardBox = document.getElementById('giftCardBox');
  if (unwrapBtn) {
    unwrapBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      createSparkleBurst(window.innerWidth / 2, window.innerHeight / 2, 25);
      advanceChapter();
    });
  }
  if (giftCardBox) {
    giftCardBox.addEventListener('click', (e) => {
      e.stopPropagation();
      createSparkleBurst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 20);
      advanceChapter();
    });
  }

  // ---------------------------------------------------------
  // Chapter 2: Interactive Compliment Cards
  // ---------------------------------------------------------
  const complimentCards = document.querySelectorAll('.compliment-card');
  complimentCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      card.classList.add('revealed');
      const badge = card.querySelector('.tap-badge');
      if (badge) {
        badge.textContent = 'Unlocked ✨';
        badge.style.background = 'rgba(16, 185, 129, 0.18)';
        badge.style.color = '#10b981';
      }
      playPopSfx();
      createSparkleBurst(e.clientX, e.clientY, 10);
    });
  });

  // ---------------------------------------------------------
  // Chapter 3: Cake & Candles Mechanics
  // ---------------------------------------------------------
  const candleUnits = document.querySelectorAll('.candle-unit');
  const wishesBanner = document.getElementById('wishesBanner');
  const blowCandlesBtn = document.getElementById('blowCandlesBtn');

  const wishMessages = [
    "Wish 1 Unlocked: Unlimited joy & radiant happiness! 🕊️",
    "Wish 2 Unlocked: Boundless success, health & victory! 🚀",
    "Wish 3 Unlocked: Every dream coming true this year! 💖"
  ];

  function blowSingleCandle(candle, idx) {
    const flame = candle.querySelector('.candle-flame');
    const puff = candle.querySelector('.smoke-puff');
    if (!flame || flame.classList.contains('blown-out')) return;

    flame.classList.add('blown-out');
    puff.classList.add('drifting');
    playCandleBlowSfx();
    blownCount++;

    if (wishesBanner && wishMessages[blownCount - 1]) {
      wishesBanner.innerHTML = wishMessages[blownCount - 1];
    }

    if (blownCount >= candleUnits.length) {
      isCandlesBlown = true;
      if (wishesBanner) {
        wishesBanner.innerHTML = "✨ All Wishes Released to the Universe! ✨";
        wishesBanner.style.background = 'rgba(16, 185, 129, 0.2)';
        wishesBanner.style.borderColor = '#10b981';
        wishesBanner.style.color = '#10b981';
      }
      setTimeout(() => {
        advanceChapter();
      }, 1200);
    }
  }

  candleUnits.forEach((candle, idx) => {
    candle.addEventListener('click', (e) => {
      e.stopPropagation();
      blowSingleCandle(candle, idx);
      createSparkleBurst(e.clientX, e.clientY, 12);
    });
  });

  function blowAllCandles() {
    candleUnits.forEach((candle, idx) => {
      setTimeout(() => {
        blowSingleCandle(candle, idx);
      }, idx * 180);
    });
  }

  if (blowCandlesBtn) {
    blowCandlesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      blowAllCandles();
    });
  }

  // ---------------------------------------------------------
  // Chapter 4: Finale Actions (Fireworks, Replay, Share)
  // ---------------------------------------------------------
  const launchFireworksBtn = document.getElementById('launchFireworksBtn');
  const replayBtn = document.getElementById('replayBtn');
  const shareWishesBtn = document.getElementById('shareWishesBtn');

  if (launchFireworksBtn) {
    launchFireworksBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          triggerFirework(
            window.innerWidth * (0.2 + Math.random() * 0.6),
            window.innerHeight * (0.2 + Math.random() * 0.4)
          );
        }, i * 250);
      }
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      // Reset candles
      isCandlesBlown = false;
      blownCount = 0;
      candleUnits.forEach(c => {
        const flame = c.querySelector('.candle-flame');
        const puff = c.querySelector('.smoke-puff');
        if (flame) flame.classList.remove('blown-out');
        if (puff) puff.classList.remove('drifting');
      });
      if (wishesBanner) {
        wishesBanner.innerHTML = "✨ Blow out the candles to release your wishes";
        wishesBanner.style.background = '';
        wishesBanner.style.borderColor = '';
        wishesBanner.style.color = '';
      }
      setChapter(0);
    });
  }

  if (shareWishesBtn) {
    shareWishesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const text = encodeURIComponent("Thank you Sanki for the most amazing birthday surprise! 🎂🌸✨");
      const url = encodeURIComponent(window.location.href);
      // Try WhatsApp or Web Share API
      if (navigator.share) {
        navigator.share({
          title: "Happy Birthday Muxxy Ji! 🎂",
          text: "Thank you Sanki for the beautiful birthday surprise!",
          url: window.location.href
        }).catch(() => {});
      } else {
        window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, '_blank');
      }
    });
  }

  // ---------------------------------------------------------
  // Stage Advance on Screen Tap
  // ---------------------------------------------------------
  document.addEventListener('click', (e) => {
    // Check if click was inside interactive elements
    if (e.target.closest('button, .compliment-card, .candle-unit, .gift-card-box, a')) {
      return;
    }
    createSparkleBurst(e.clientX, e.clientY, 8);
    advanceChapter();
  });

  // Touch Support
  document.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      const touch = e.touches[0];
      if (!e.target.closest('button, .compliment-card, .candle-unit, .gift-card-box, a')) {
        createSparkleBurst(touch.clientX, touch.clientY, 6);
      }
    }
  }, { passive: true });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      advanceChapter();
    } else if (e.key === 'ArrowLeft') {
      if (currentChapter > 0) setChapter(currentChapter - 1);
    }
  });

  // ---------------------------------------------------------
  // Theme Toggle (Light / Dark Mode)
  // ---------------------------------------------------------
  themeToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    themeToggleBtn.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    playPopSfx();
  });

  // ---------------------------------------------------------
  // Sparkle Burst Particles (Follow Taps)
  // ---------------------------------------------------------
  const sparkleIcons = ['✨', '🌸', '💖', '⭐', '🎀', '💫', '🧁'];
  function createSparkleBurst(x, y, count = 8) {
    if (!x || !y) return;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'tap-sparkle';
      el.textContent = sparkleIcons[Math.floor(Math.random() * sparkleIcons.length)];
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;

      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4);
      const distance = 45 + Math.random() * 45;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      el.style.setProperty('--dist', `translate(${tx}px, ${ty}px)`);
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 750);
    }
  }

  // ---------------------------------------------------------
  // Physics-based Fireworks Canvas Engine
  // ---------------------------------------------------------
  let particles = [];
  const palette = ['#ff4d88', '#ff7aa8', '#8b5cf6', '#a78bfa', '#f59e0b', '#fbbf24', '#10b981', '#ffffff'];

  class FireworkParticle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6.5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.decay = 0.015 + Math.random() * 0.02;
      this.gravity = 0.07;
      this.size = 2 + Math.random() * 3;
    }

    update() {
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function triggerFirework(x, y) {
    playFireworkSfx();
    const count = 45 + Math.floor(Math.random() * 30);
    const color = palette[Math.floor(Math.random() * palette.length)];
    for (let i = 0; i < count; i++) {
      particles.push(new FireworkParticle(x, y, color));
    }
  }

  function renderFireworksLoop() {
    ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.alpha <= 0) {
        particles.splice(i, 1);
      }
    }
    requestAnimationFrame(renderFireworksLoop);
  }
  requestAnimationFrame(renderFireworksLoop);

  function launchGrandCelebration() {
    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        triggerFirework(
          window.innerWidth * (0.15 + Math.random() * 0.7),
          window.innerHeight * (0.2 + Math.random() * 0.45)
        );
      }, i * 300);
    }
  }
});
