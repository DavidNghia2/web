/**
 * ==============================================================================
 * LOGIC ĐIỀU KHIỂN CHÍNH (SCRIPT.JS)
 * - Màn hình khóa xác thực bằng ngày sinh (DDMMYY) cho 8 người nhận
 * - Chuỗi hiệu ứng điện ảnh khi mở khóa thành công (Hoa nở, pháo hoa, vệt sáng)
 * - Cá nhân hóa toàn bộ 5 màn hình cho người nhận hiện tại
 * - Tích hợp YouTube IFrame Player API chính thức (bắt đầu tại giây 45)
 * - Nút "Khóa lại" để xóa trạng thái và bảo vệ trải nghiệm của người sau
 * - Điều hướng Fullscreen 100dvh (Bánh xe chuột, Chạm vuốt, Phím, Nút bấm)
 * - Không sử dụng innerHTML với dữ liệu người dùng, không dùng localStorage
 * ==============================================================================
 */

// Trạng thái ứng dụng trong bộ nhớ (In-memory State)
let activeRecipient = null;
let ytPlayer = null;
let isYtReady = false;
let isMusicPlaying = false;
let hasFirstPlayed = false;
let pendingPlayStartTime = null;
let cinematicTimeoutIds = [];
let currentScreen = 1;
let isNavigating = false;
let wishesAlreadyTyped = false;

function getActiveRecipient() {
  return activeRecipient;
}

document.addEventListener('DOMContentLoaded', () => {
  const config = window.APP_CONFIG;
  const recipients = window.RECIPIENTS_DATA || [];

  // 1. Khởi tạo màn hình khóa & xác thực ngày sinh
  initLockScreenSystem(recipients);

  // 2. Nạp dữ liệu cấu hình ban đầu
  if (config) {
    renderConfigData(config);
  }

  // 3. Khởi tạo canvas sao đêm & cánh hoa rơi nền
  initStarrySkyCanvas();
  initPetalsCanvas();

  // 4. Khởi tạo hệ thống điều hướng màn hình (1 -> 5)
  initScreenNavigation();

  // 5. Khởi tạo khu vườn hoa kỳ diệu tương tác
  initFlowerGarden();

  // 6. Khởi tạo album ảnh Polaroid & Lightbox
  if (config && config.memories) {
    initPolaroidAlbum(config.memories.photos);
  }

  // 7. Khởi tạo trái tim cánh hoa cho Màn hình 5
  initHeartPetalsCanvas();

  // 8. Khởi tạo modal rút lời chúc ngẫu nhiên
  if (config && config.randomWishes) {
    initRandomWishModal(config.randomWishes);
  }

  // 9. Khởi tạo nút "Khóa lại" trên Header
  initRelockButton();

  // 10. Khởi tạo hệ thống phát nhạc cá nhân hóa & dự phòng
  initAudioPlayerSystem();
});

/* ==============================================================================
 * 1. HỆ THỐNG MÀN HÌNH KHÓA & MẬT MÃ NGÀY SINH (LOCK SCREEN)
 * ============================================================================== */
function initLockScreenSystem(recipients) {
  const lockScreen = document.getElementById('lock-screen');
  const passInput = document.getElementById('pass-input');
  const btnUnlock = document.getElementById('btn-unlock');
  const errorMsg = document.getElementById('lock-error-msg');
  const btnToggleEye = document.getElementById('btn-toggle-pass-visibility');
  const btnSkipCinematic = document.getElementById('btn-skip-cinematic');

  if (!lockScreen || !passInput || !btnUnlock) return;

  // Giới hạn chỉ cho phép nhập số
  passInput.addEventListener('input', (e) => {
    passInput.value = passInput.value.replace(/\D/g, '').slice(0, 6);
    if (errorMsg) {
      errorMsg.textContent = '';
      errorMsg.classList.remove('success');
    }
    passInput.classList.remove('shake', 'correct');
  });

  // Nút ẩn / hiện mật khẩu
  if (btnToggleEye) {
    btnToggleEye.addEventListener('click', () => {
      const isPass = passInput.type === 'password';
      passInput.type = isPass ? 'text' : 'password';
      btnToggleEye.textContent = isPass ? '🔒' : '👁️';
    });
  }

  // Hàm xử lý xác nhận mật mã
  function handleUnlock() {
    const entered = passInput.value.trim();

    if (entered.length < 6) {
      showLockError("Vui lòng nhập đủ 6 chữ số ngày sinh (DDMMYY)! 🌸");
      return;
    }

    // Tìm kiếm người nhận trong danh sách 8 người
    const matchedRecipient = recipients.find(r => r.password === entered || (r.altPassword && r.altPassword === entered));

    if (matchedRecipient) {
      // Mật mã chính xác!
      activeRecipient = matchedRecipient;
      passInput.classList.remove('shake');
      passInput.classList.add('correct');

      if (errorMsg) {
        errorMsg.textContent = "Mật mã chính xác! 🌷";
        errorMsg.classList.add('success');
      }

      // Bắt đầu phát bài hát cá nhân hóa dành riêng cho người nhận
      loadAndPlayRecipientMusic(matchedRecipient);

      // Kích hoạt chuỗi hiệu ứng chuyển cảnh điện ảnh (Cinematic Sequence)
      startCinematicUnlockSequence(matchedRecipient);
    } else {
      // Mật mã sai
      showLockError("Ơ kìa, hình như bạn nhập nhầm mật mã rồi! 🌸");
    }
  }

  function showLockError(msg) {
    if (errorMsg) {
      errorMsg.textContent = msg;
      errorMsg.classList.remove('success');
    }
    passInput.classList.remove('correct');
    passInput.classList.remove('shake');
    void passInput.offsetWidth; // Force reflow
    passInput.classList.add('shake');
    playSoftChimeSound();
  }

  btnUnlock.addEventListener('click', handleUnlock);

  // Nhấn Enter để xác nhận
  passInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleUnlock();
    }
  });

  // Nút bỏ qua chuỗi hiệu ứng điện ảnh nếu người dùng muốn vào trang ngay
  if (btnSkipCinematic) {
    btnSkipCinematic.addEventListener('click', () => {
      skipCinematicToMainWebsite();
    });
  }
}

/* ==============================================================================
 * 2. CHUỖI HIỆU ỨNG CHUYỂN CẢNH ĐIỆN ẢNH (CINEMATIC UNLOCK SEQUENCE)
 * 0-0.5s: Ô mật khẩu phát sáng mint + Mật mã chính xác
 * 0.5-1.5s: Màn hình khóa tan biến, hoa bắt đầu nở
 * 1.5-3s: Hoa bung nở, hàng trăm cánh hoa bay ra, pháo hoa nổ
 * 3-5s: Hiện tên người nhận phát sáng + lời chúc cá nhân hóa
 * Sau 5s: Chuyển mượt vào trang chính
 * ============================================================================== */
function startCinematicUnlockSequence(recipient) {
  const lockScreen = document.getElementById('lock-screen');
  const cinematicOverlay = document.getElementById('cinematic-overlay');
  const nameTitle = document.getElementById('cinematic-name-title');
  const wishSub = document.getElementById('cinematic-wish-sub');

  // Xóa các timeout cũ nếu có
  cinematicTimeoutIds.forEach(id => clearTimeout(id));
  cinematicTimeoutIds = [];

  // Điền lời chào cá nhân hóa (dùng textContent an toàn)
  if (nameTitle) {
    nameTitle.textContent = `Happy Women's Day, ${recipient.pronoun} ${recipient.displayName}! 🌷`;
  }
  if (wishSub) {
    wishSub.textContent = recipient.wish || recipient.cinematicGreeting || recipient.personalWish;
  }

  // 0.5 giây: Ẩn màn hình khóa, hiển thị overlay điện ảnh, bắt đầu nở hoa
  cinematicTimeoutIds.push(setTimeout(() => {
    if (lockScreen) lockScreen.classList.add('hidden');
    if (cinematicOverlay) {
      cinematicOverlay.classList.add('active', 'blooming');
      initCinematicCanvasEffects();
    }
  }, 500));

  // 1.5 giây: Bùng nổ cánh hoa & pháo hoa rực rỡ
  cinematicTimeoutIds.push(setTimeout(() => {
    triggerCinematicPetalBurst();
    triggerCinematicFireworks();
    playFanfareCelebration();
  }, 1500));

  // 3.0 giây: Hiện tên người nhận và lời chúc cá nhân hóa
  cinematicTimeoutIds.push(setTimeout(() => {
    if (cinematicOverlay) {
      cinematicOverlay.classList.add('show-greeting');
    }
  }, 3000));

  // 5.5 giây: Chuyển mượt vào website chính
  cinematicTimeoutIds.push(setTimeout(() => {
    skipCinematicToMainWebsite();
  }, 5500));
}

function skipCinematicToMainWebsite() {
  cinematicTimeoutIds.forEach(id => clearTimeout(id));
  cinematicTimeoutIds = [];

  const cinematicOverlay = document.getElementById('cinematic-overlay');
  const lockScreen = document.getElementById('lock-screen');

  if (lockScreen) lockScreen.classList.add('hidden');
  if (cinematicOverlay) {
    cinematicOverlay.style.opacity = '0';
    setTimeout(() => {
      cinematicOverlay.classList.remove('active', 'blooming', 'show-greeting');
      cinematicOverlay.style.opacity = '';
    }, 450);
  }

  // Áp dụng cá nhân hóa toàn bộ website cho người nhận hiện tại
  if (activeRecipient) {
    applyRecipientPersonalization(activeRecipient);
  }

  // Chuyển về màn hình 1
  isNavigating = false;
  if (typeof goToScreen === 'function') {
    goToScreen(1);
  }
}

/* ==============================================================================
 * 3. CÁ NHÂN HÓA TOÀN BỘ WEBSITE CHO NGƯỜI NHẬN HIỆN TẠI
 * ============================================================================== */
function applyRecipientPersonalization(recipient) {
  if (!recipient) return;

  const pronoun = recipient.pronoun;
  const pronounCap = pronoun.charAt(0).toUpperCase() + pronoun.slice(1);
  const displayName = recipient.displayName;

  // Header
  setText('nav-group-name', `Dành tặng ${pronoun} ${displayName}`);

  // Màn hình 1: Welcome
  setText('welcome-badge', `🌷 Dành riêng cho ${pronoun} ${displayName} 🌷`);
  setText('welcome-subtext', `Có một món quà nhỏ dành riêng cho ${pronoun} ${displayName} - những điều tuyệt vời nhất đang chờ đón ${pronoun} khám phá...`);

  // Màn hình 2: Garden
  setText('garden-quote-2', `Và hôm nay, khu vườn này dành riêng cho ${pronoun} ${displayName}!`);

  // Màn hình 3: Special Wishes
  setText('wishes-heading', `Lời Chúc 20/10 Dành Cho ${pronounCap} ${displayName}`);
  wishesAlreadyTyped = false;
  renderWishesStructure(recipient);
  setText('cheerer-bubble', `Gửi trọn yêu thương tới ${pronoun} ${displayName}! 🌱✨`);

  // Đồng bộ thông tin bài hát cá nhân hóa vào trình phát Cute Pastel
  if (recipient.music) {
    setText('player-song-title', recipient.music.title);
    setText('player-song-artist', recipient.music.artist);
    setText('player-dedicated-tag', `🎧 Giai điệu dành cho ${pronoun} ${displayName}`);
    setText('player-disc-icon', recipient.music.coverEmoji || recipient.icon || '🌸');
  }

  // Màn hình 4: Memories
  setText('memories-description', `Nhấp vào từng bức ảnh Polaroid để xem phóng to nhé ${pronoun} ${displayName}!`);
  const recipientPhotos = (recipient.photos && recipient.photos.length > 0)
    ? recipient.photos
    : (window.APP_CONFIG && window.APP_CONFIG.memories ? window.APP_CONFIG.memories.photos : []);
  if (recipientPhotos && recipientPhotos.length > 0) {
    initPolaroidAlbum(recipientPhotos);
  }

  // Màn hình 5: Ending
  setText('ending-title', `Happy Women's Day 20/10, ${pronoun} ${displayName}! 🌷`);
  if (recipient.endingNote) {
    setText('ending-thankyou', recipient.endingNote);
  }
  if (recipient.wish || recipient.personalWish) {
    setText('ending-wishes', recipient.wish || recipient.personalWish);
  }
}

/* ==============================================================================
 * 4. NÚT "KHÓA LẠI" (RELOCK BUTTON)
 * Xóa trạng thái người dùng hiện tại, bảo mật thông tin, đưa về màn hình khóa
 * ============================================================================== */
function initRelockButton() {
  const btnRelock = document.getElementById('btn-relock');
  const lockScreen = document.getElementById('lock-screen');
  const passInput = document.getElementById('pass-input');
  const errorMsg = document.getElementById('lock-error-msg');
  const cinematicOverlay = document.getElementById('cinematic-overlay');

  if (!btnRelock) return;

  btnRelock.addEventListener('click', () => {
    // 1. Xóa trạng thái người dùng trong bộ nhớ
    activeRecipient = null;

    // 2. Tạm dừng và dọn dẹp nhạc cục bộ & YouTube
    if (localAudioPlayer) {
      localAudioPlayer.pause();
      localAudioPlayer.currentTime = 0;
      localAudioPlayer.removeAttribute('src');
      localAudioPlayer.load();
    }
    pauseYouTubeMusic();
    updateAllMusicUI(false);
    setText('player-song-title', 'Đang tải giai điệu...');
    setText('player-song-artist', 'Nghệ sĩ');
    setText('player-dedicated-tag', '🎧 Giai điệu dành riêng');
    setText('player-disc-icon', '🌸');

    // 3. Reset form mật mã
    if (passInput) {
      passInput.value = '';
      passInput.classList.remove('correct', 'shake');
    }
    if (errorMsg) {
      errorMsg.textContent = '';
      errorMsg.classList.remove('success');
    }

    // 4. Xóa tên và lời chúc cá nhân hóa, khôi phục mặc định APP_CONFIG
    if (window.APP_CONFIG) {
      setText('nav-group-name', window.APP_CONFIG.groupName || 'Hội Chị Em');
      if (window.APP_CONFIG.welcome) {
        setText('welcome-badge', window.APP_CONFIG.welcome.badge || '🌷 Ngày Phụ Nữ Việt Nam 🌷');
        setText('welcome-subtext', window.APP_CONFIG.welcome.subtext || '');
      }
      if (window.APP_CONFIG.garden) {
        setText('garden-quote-2', window.APP_CONFIG.garden.quote2 || '');
      }
      if (window.APP_CONFIG.specialWishes || window.APP_CONFIG.wishes) {
        const sw = window.APP_CONFIG.specialWishes || window.APP_CONFIG.wishes;
        setText('wishes-heading', sw.title || 'Special Wishes');
        wishesAlreadyTyped = false;
        renderWishesStructure(sw.wishesList || sw.list || []);
        setText('cheerer-bubble', 'Yêu thương gửi trọn tới các chị em! 🌷');
      }
      if (window.APP_CONFIG.memories) {
        setText('memories-description', window.APP_CONFIG.memories.description || '');
        initPolaroidAlbum(window.APP_CONFIG.memories.photos);
      }
      if (window.APP_CONFIG.ending) {
        setText('ending-title', window.APP_CONFIG.ending.title || "Happy Women's Day 20/10 🌷");
        setText('ending-thankyou', window.APP_CONFIG.ending.thankYou || '');
        setText('ending-wishes', window.APP_CONFIG.ending.wishes || '');
      }
    }

    // 5. Reset lại màn hình về 1
    if (typeof goToScreen === 'function') {
      goToScreen(1);
    }
    wishesAlreadyTyped = false;

    // 6. Hiển thị lại màn hình khóa
    if (cinematicOverlay) {
      cinematicOverlay.classList.remove('active', 'blooming', 'show-greeting');
    }
    if (lockScreen) {
      lockScreen.classList.remove('hidden');
    }

    playSoftChimeSound();
  });
}

/* ==============================================================================
 * 5. HỆ THỐNG PHÁT NHẠC CÁ NHÂN HÓA (HTML5 AUDIO & CUTE PASTEL PLAYER)
 * Tự động phát bài hát được chỉ định riêng cho từng người sau khi mở khóa
 * Đồng bộ với nút Header và Trình phát Cute tại Màn hình 3 (Special Wishes)
 * ============================================================================== */
let localAudioPlayer = null;

function initAudioPlayerSystem() {
  localAudioPlayer = document.getElementById('local-audio-player');
  const musicBtn = document.getElementById('music-toggle-btn');
  const cutePlayerBtn = document.getElementById('btn-player-play');
  const toastBtn = document.getElementById('btn-toast-action');

  if (localAudioPlayer) {
    localAudioPlayer.addEventListener('play', () => {
      isMusicPlaying = true;
      updateAllMusicUI(true);
    });

    localAudioPlayer.addEventListener('pause', () => {
      isMusicPlaying = false;
      updateAllMusicUI(false);
    });

    localAudioPlayer.addEventListener('ended', () => {
      isMusicPlaying = false;
      updateAllMusicUI(false);
    });

    localAudioPlayer.addEventListener('error', (e) => {
      console.warn("Local audio playback notice:", e);
    });
  }

  // Nút bật/tắt trên Header
  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      toggleMusicPlayback();
    });
  }

  // Nút bật/tắt trên Trình phát Cute Pastel Màn hình 3
  if (cutePlayerBtn) {
    cutePlayerBtn.addEventListener('click', () => {
      toggleMusicPlayback();
    });
  }

  // Nút trên Toast kích hoạt chủ động
  if (toastBtn) {
    toastBtn.addEventListener('click', () => {
      toggleMusicPlayback();
      hideMusicToast();
    });
  }

  // Khởi tạo YouTube fallback nếu cần
  initYouTubeMusicIntegration();
}

function updateAllMusicUI(isPlaying) {
  // 1. Header Button
  const musicBtn = document.getElementById('music-toggle-btn');
  const musicLabel = document.getElementById('music-btn-label');
  if (musicBtn) musicBtn.classList.toggle('playing', isPlaying);
  if (musicLabel) musicLabel.textContent = isPlaying ? 'Đang phát' : 'Giai điệu';

  // 2. Cute Pastel Player Card on Screen 3
  const cutePlayer = document.getElementById('screen3-music-player');
  const cutePlayIcon = document.getElementById('player-play-icon');
  if (cutePlayer) cutePlayer.classList.toggle('playing', isPlaying);
  if (cutePlayIcon) cutePlayIcon.textContent = isPlaying ? '❚❚' : '▶';

  // 3. Ẩn toast nếu nhạc đang phát
  if (isPlaying) hideMusicToast();
}

function loadAndPlayRecipientMusic(recipient) {
  if (!recipient || !recipient.music) return;

  const music = recipient.music;
  const startTime = Number(music.startTime) || 0;

  setText('player-song-title', music.title);
  setText('player-song-artist', music.artist);
  setText('player-dedicated-tag', `🎧 Giai điệu dành cho ${recipient.pronoun} ${recipient.displayName}`);
  setText('player-disc-icon', music.coverEmoji || recipient.icon || '🌸');

  if (localAudioPlayer) {
    localAudioPlayer.pause();
    localAudioPlayer.src = music.src;
    localAudioPlayer.load();

    let sought = false;
    const seekToChorus = () => {
      if (!sought && startTime > 0) {
        try {
          localAudioPlayer.currentTime = startTime;
          sought = true;
        } catch (e) {
          console.warn("Could not seek currentTime:", e);
        }
      }
    };

    localAudioPlayer.addEventListener('loadedmetadata', seekToChorus, { once: true });
    localAudioPlayer.addEventListener('canplay', () => {
      seekToChorus();
    }, { once: true });

    const playPromise = localAudioPlayer.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        seekToChorus();
        isMusicPlaying = true;
        updateAllMusicUI(true);
      }).catch((err) => {
        // Trình duyệt chặn autoplay mà không có tương tác âm thanh trực tiếp
        console.log("Autoplay blocked by browser policy:", err);
        isMusicPlaying = false;
        updateAllMusicUI(false);
        showMusicToast(`Chạm để bật bài hát "${music.title}" 🎵`, true);
      });
    }
  }
}

function toggleMusicPlayback() {
  if (localAudioPlayer && localAudioPlayer.src) {
    if (localAudioPlayer.paused) {
      // Nếu bài hát đang ở giây 0 (hoặc chưa từng chạy), tua ngay đến đoạn hay nhất
      if (activeRecipient && activeRecipient.music && activeRecipient.music.startTime > 0) {
        if (localAudioPlayer.currentTime < 1) {
          try {
            localAudioPlayer.currentTime = activeRecipient.music.startTime;
          } catch (e) {}
        }
      }
      localAudioPlayer.play().then(() => {
        isMusicPlaying = true;
        updateAllMusicUI(true);
      }).catch(() => {
        showMusicToast("Vui lòng chạm để phát nhạc 🎵", true);
      });
    } else {
      localAudioPlayer.pause();
      isMusicPlaying = false;
      updateAllMusicUI(false);
    }
    return;
  }

  // Fallback YouTube
  if (isYtReady && ytPlayer && ytPlayer.playVideo) {
    if (isMusicPlaying) {
      ytPlayer.pauseVideo();
    } else {
      ytPlayer.playVideo();
    }
    return;
  }

  // Fallback Web Audio synth
  if (isMusicPlaying) stopSynthMelody();
  else startSynthMelody();
}

function initYouTubeMusicIntegration() {
  window.onYouTubeIframeAPIReady = function() {
    try {
      ytPlayer = new YT.Player('yt-player', {
        height: '1',
        width: '1',
        videoId: 'GczyPW3vbrc',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          start: 45,
          enablejsapi: 1,
          playsinline: 1,
          origin: window.location.origin || '*'
        },
        events: {
          onReady: onYtPlayerReady,
          onStateChange: onYtPlayerStateChange,
          onError: onYtPlayerError
        }
      });
    } catch (err) {
      console.warn("YouTube Player initialization error:", err);
    }
  };

  function onYtPlayerReady(event) {
    isYtReady = true;
    if (pendingPlayStartTime !== null) {
      startMusicPlaybackAt(pendingPlayStartTime);
      pendingPlayStartTime = null;
    }
  }

  function onYtPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
      isMusicPlaying = true;
      updateAllMusicUI(true);
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
      isMusicPlaying = false;
      updateAllMusicUI(false);
    }
  }

  function onYtPlayerError(event) {
    console.warn("YouTube Player Error code:", event.data);
    showMusicToast("Kích hoạt giai điệu êm dịu 🎵", false);
    startSynthMelody();
  }
}

function startMusicPlaybackAt(startTime) {
  if (isYtReady && ytPlayer && ytPlayer.playVideo) {
    try {
      if (startTime !== undefined && !hasFirstPlayed) {
        ytPlayer.seekTo(startTime, true);
        hasFirstPlayed = true;
      }
      ytPlayer.playVideo();
      isMusicPlaying = true;
      updateAllMusicUI(true);
    } catch (e) {
      startSynthMelody();
    }
  } else {
    pendingPlayStartTime = startTime;
  }
}

function pauseYouTubeMusic() {
  if (isYtReady && ytPlayer && ytPlayer.pauseVideo) {
    try {
      ytPlayer.pauseVideo();
    } catch (e) {}
  }
  isMusicPlaying = false;
  hasFirstPlayed = false;
  updateAllMusicUI(false);
}

function showMusicToast(msg, showAction = true) {
  const toast = document.getElementById('music-toast');
  const msgEl = document.getElementById('toast-msg');
  const actionBtn = document.getElementById('btn-toast-action');
  if (!toast) return;

  if (msgEl) msgEl.textContent = msg;
  if (actionBtn) actionBtn.style.display = showAction ? 'inline-block' : 'none';
  toast.classList.add('active');

  setTimeout(() => {
    hideMusicToast();
  }, 6000);
}

function hideMusicToast() {
  const toast = document.getElementById('music-toast');
  if (toast) toast.classList.remove('active');
}

/* ==============================================================================
 * 6. HIỆU ỨNG CANVAS CHUYỂN CẢNH (CINEMATIC BURST & FIREWORKS)
 * ============================================================================== */
let cinematicAnimId = null;
let burstPetals = [];
let burstFireworks = [];

function initCinematicCanvasEffects() {
  const canvas = document.getElementById('cinematic-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  burstPetals = [];
  burstFireworks = [];

  function renderCinematicLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ cánh hoa bùng nổ từ trung tâm
    for (let i = burstPetals.length - 1; i >= 0; i--) {
      const p = burstPetals[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotSpeed;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        burstPetals.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 1.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Vẽ pháo hoa
    for (let i = burstFireworks.length - 1; i >= 0; i--) {
      const f = burstFireworks[i];
      f.x += f.vx;
      f.y += f.vy;
      f.vx *= 0.98;
      f.vy = f.vy * 0.98 + 0.06; // Trọng lực
      f.alpha -= f.decay;

      if (f.alpha <= 0) {
        burstFireworks.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = f.alpha;
      ctx.fillStyle = f.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = f.color;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    cinematicAnimId = requestAnimationFrame(renderCinematicLoop);
  }

  if (cinematicAnimId) cancelAnimationFrame(cinematicAnimId);
  renderCinematicLoop();
}

function triggerCinematicPetalBurst() {
  const canvas = document.getElementById('cinematic-canvas');
  if (!canvas) return;
  const cx = canvas.width / 2;
  const cy = canvas.height * 0.45;
  const colors = ['#f472b6', '#ff0844', '#fde047', '#c084fc', '#ffffff', '#6ee7b7'];

  for (let i = 0; i < 90; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 3;
    burstPetals.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gravity: 0.05,
      size: Math.random() * 7 + 4,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.015 + 0.008
    });
  }
}

function triggerCinematicFireworks() {
  const canvas = document.getElementById('cinematic-canvas');
  if (!canvas) return;
  const colors = ['#f472b6', '#fde047', '#c084fc', '#6ee7b7', '#ffffff'];

  function createFirework(originX, originY) {
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      burstFireworks.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: chosenColor,
        size: Math.random() * 2.5 + 1.5,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.012
      });
    }
  }

  createFirework(canvas.width * 0.25, canvas.height * 0.3);
  createFirework(canvas.width * 0.75, canvas.height * 0.3);
  setTimeout(() => {
    createFirework(canvas.width * 0.5, canvas.height * 0.2);
  }, 350);
}

/* ==============================================================================
 * 7. NẠP DỮ LIỆU CẤU HÌNH BAN ĐẦU TỪ CONFIG.JS
 * ============================================================================== */
function renderConfigData(cfg) {
  document.title = cfg.title || "Happy Vietnamese Women's Day 20/10";
  setText('nav-group-name', cfg.groupName || "Hội Chị Em");

  setText('welcome-badge', cfg.welcome.badge);
  setText('welcome-headline', cfg.welcome.headline);
  setText('welcome-date', cfg.welcome.dateHighlight);
  setText('welcome-subtext', cfg.welcome.subtext);
  setText('welcome-btn-text', cfg.welcome.exploreButtonText);
  setText('welcome-scroll-hint', cfg.welcome.scrollHint);

  setText('garden-badge', cfg.garden.badge);
  setText('garden-heading', cfg.garden.heading);
  setText('garden-quote-1', cfg.garden.quoteLine1);
  setText('garden-quote-2', cfg.garden.quoteLine2);
  setText('garden-hint', cfg.garden.interactionHint);
  setText('garden-btn-text', cfg.garden.nextButtonText);

  setText('wishes-badge', cfg.specialWishes.badge);
  setText('wishes-heading', cfg.specialWishes.heading);
  setText('wishes-btn-text', cfg.specialWishes.nextButtonText);
  renderWishesStructure(cfg.specialWishes.wishesList);

  setText('memories-badge', cfg.memories.badge);
  setText('memories-heading', cfg.memories.heading);
  setText('memories-description', cfg.memories.description);
  setText('memories-btn-text', cfg.memories.nextButtonText);

  setText('ending-badge', cfg.ending.badge);
  setText('ending-title', cfg.ending.title);
  setText('ending-thankyou', cfg.ending.thankYou);
  setText('ending-wishes', cfg.ending.wishes);
  setText('ending-random-btn-text', cfg.ending.randomWishButtonText);
  setText('ending-replay-btn-text', cfg.ending.replayButtonText);
}

function setText(elementId, text) {
  const el = document.getElementById(elementId);
  if (el && text !== undefined) {
    el.textContent = text;
  }
}

/* ==============================================================================
 * 8. CANVAS SAO ĐÊM & SAO BĂNG LƯỚT QUA (STARRY SKY & METEORS)
 * ============================================================================== */
function initStarrySkyCanvas() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const stars = [];
  const starCount = Math.floor((width * height) / 5000);

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
      color: Math.random() > 0.3 ? '#ffffff' : Math.random() > 0.5 ? '#6ee7b7' : '#f472b6'
    });
  }

  const meteors = [];
  function createMeteor() {
    meteors.push({
      x: Math.random() * width * 0.8,
      y: Math.random() * height * 0.4,
      length: Math.random() * 80 + 50,
      speed: Math.random() * 6 + 6,
      angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.2,
      alpha: 1,
      decay: 0.02
    });
  }

  setInterval(() => {
    if (Math.random() < 0.6) createMeteor();
  }, 4500);

  function renderStars() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach((s) => {
      s.alpha += s.speed;
      if (s.alpha > 1 || s.alpha < 0.1) s.speed = -s.speed;

      ctx.save();
      ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
      ctx.fillStyle = s.color;
      ctx.shadowBlur = s.size * 2;
      ctx.shadowColor = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      ctx.save();
      ctx.globalAlpha = m.alpha;
      const endX = m.x - Math.cos(m.angle) * m.length;
      const endY = m.y - Math.sin(m.angle) * m.length;
      const grad = ctx.createLinearGradient(m.x, m.y, endX, endY);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, 'rgba(110, 231, 183, 0.6)');
      grad.addColorStop(1, 'transparent');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.restore();

      m.x += Math.cos(m.angle) * m.speed;
      m.y += Math.sin(m.angle) * m.speed;
      m.alpha -= m.decay;

      if (m.alpha <= 0 || m.x > width || m.y > height) {
        meteors.splice(i, 1);
      }
    }

    requestAnimationFrame(renderStars);
  }
  renderStars();
}

/* ==============================================================================
 * 9. CANVAS CÁNH HOA BAY NHẸ TRÊN MÀN HÌNH (FLOATING PETALS)
 * ============================================================================== */
function initPetalsCanvas() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  const petalCount = 25;
  const colors = [
    'rgba(244, 114, 182, ',
    'rgba(251, 207, 232, ',
    'rgba(110, 231, 183, ',
    'rgba(192, 132, 252, '
  ];

  class Petal {
    constructor(initRandomY = false) {
      this.reset(initRandomY);
    }

    reset(initRandomY = false) {
      this.x = Math.random() * width;
      this.y = initRandomY ? Math.random() * height : -20;
      this.size = Math.random() * 9 + 7;
      this.speedY = Math.random() * 1.1 + 0.5;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 1.5;
      this.flip = Math.random() * 360;
      this.flipSpeed = (Math.random() - 0.5) * 2;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.015) + this.speedX;
      this.rotation += this.rotSpeed;
      this.flip += this.flipSpeed;

      if (this.y > height + 20 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.scale(1, Math.sin((this.flip * Math.PI) / 180));

      ctx.beginPath();
      ctx.moveTo(0, -this.size / 2);
      ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size / 2, this.size / 2, 0, this.size);
      ctx.bezierCurveTo(-this.size / 2, this.size / 2, -this.size / 2, -this.size / 2, 0, -this.size / 2);
      ctx.fillStyle = `${this.colorBase}${this.opacity})`;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal(true));
  }

  function renderPetals() {
    ctx.clearRect(0, 0, width, height);
    petals.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(renderPetals);
  }
  renderPetals();
}

/* ==============================================================================
 * 10. HỆ THỐNG ĐIỀU HƯỚNG FULLSCREEN MƯỢT MÀ (SCREEN 1 -> 5)
 * ============================================================================== */
function goToScreen(screenNumber) {
  if (screenNumber < 1 || screenNumber > 5 || screenNumber === currentScreen) return;
  if (isNavigating) return;
  isNavigating = true;

  currentScreen = screenNumber;

  const screens = [
    document.getElementById('screen-1'),
    document.getElementById('screen-2'),
    document.getElementById('screen-3'),
    document.getElementById('screen-4'),
    document.getElementById('screen-5')
  ];

  screens.forEach((sc, idx) => {
    if (sc) {
      sc.classList.toggle('active', idx + 1 === screenNumber);
    }
  });

  const stepDots = document.querySelectorAll('.step-dot');
  stepDots.forEach((dot) => {
    const dotNum = parseInt(dot.getAttribute('data-screen'), 10);
    dot.classList.toggle('active', dotNum === screenNumber);
  });

  const gallery = document.getElementById('polaroid-gallery');
  if (gallery) gallery.scrollTop = 0;
  const wishesList = document.getElementById('wishes-list');
  if (wishesList) wishesList.scrollTop = 0;

  onScreenActivated(screenNumber);

  setTimeout(() => {
    isNavigating = false;
  }, 450);
}

function initScreenNavigation() {
  const stepDots = document.querySelectorAll('.step-dot');

  // Tương tác bấm vào ảnh meme trên màn hình 1
  bindClick('welcome-meme-wrapper', () => {
    playSparkleSound();
    const memeImg = document.getElementById('welcome-meme-img');
    if (memeImg) {
      memeImg.classList.remove('meme-click-bounce');
      void memeImg.offsetWidth;
      memeImg.classList.add('meme-click-bounce');
    }
  });

  bindClick('btn-explore-gift', () => goToScreen(2));
  bindClick('btn-goto-wishes', () => goToScreen(3));
  bindClick('btn-goto-memories', () => goToScreen(4));
  bindClick('btn-goto-ending', () => goToScreen(5));
  bindClick('btn-replay', () => goToScreen(1));

  stepDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetScreen = parseInt(dot.getAttribute('data-screen'), 10);
      goToScreen(targetScreen);
    });
  });

  let wheelThrottleTimer = null;
  window.addEventListener('wheel', (e) => {
    // Không chuyển màn hình nếu modal hoặc lock screen đang mở
    const lockScreen = document.getElementById('lock-screen');
    if (lockScreen && !lockScreen.classList.contains('hidden')) return;
    if (document.querySelector('.polaroid-lightbox.active, .random-wish-modal.active, .cinematic-overlay.active')) return;

    // Khi con trỏ chuột đang ở trong vùng album ảnh: chỉ cuộn nội bộ album, không chuyển màn hình
    if (e.target.closest('.polaroid-gallery')) {
      return;
    }

    const scrollContainer = e.target.closest('.wishes-list');
    if (scrollContainer && scrollContainer.scrollHeight > scrollContainer.clientHeight) {
      const isAtBottom = scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 5;
      const isAtTop = scrollContainer.scrollTop <= 5;
      if (e.deltaY > 0 && !isAtBottom) return;
      if (e.deltaY < 0 && !isAtTop) return;
    }

    if (wheelThrottleTimer) return;
    wheelThrottleTimer = setTimeout(() => {
      wheelThrottleTimer = null;
    }, 550);

    if (e.deltaY > 25 && currentScreen < 5) {
      goToScreen(currentScreen + 1);
    } else if (e.deltaY < -25 && currentScreen > 1) {
      goToScreen(currentScreen - 1);
    }
  }, { passive: true });

  let touchStartY = 0;
  let touchStartX = 0;
  let isTouchInGallery = false;

  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      isTouchInGallery = !!e.target.closest('.polaroid-gallery');
    }
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    const lockScreen = document.getElementById('lock-screen');
    if (lockScreen && !lockScreen.classList.contains('hidden')) return;
    if (document.querySelector('.polaroid-lightbox.active, .random-wish-modal.active, .cinematic-overlay.active')) return;
    if (!e.changedTouches || e.changedTouches.length === 0) return;

    // Khi thao tác chạm/vuốt bắt đầu hoặc kết thúc trong vùng album ảnh:
    // Chỉ cuộn nội bộ album, không bao giờ chuyển màn hình khi đang thao tác trong album
    if (isTouchInGallery || e.target.closest('.polaroid-gallery')) {
      isTouchInGallery = false;
      return;
    }

    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const diffY = touchStartY - touchEndY;
    const diffX = touchStartX - touchEndX;

    if (Math.abs(diffY) > 45 && Math.abs(diffY) > Math.abs(diffX) * 1.3) {
      const scrollContainer = e.target.closest('.wishes-list');
      if (scrollContainer && scrollContainer.scrollHeight > scrollContainer.clientHeight) {
        const isAtBottom = scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 8;
        const isAtTop = scrollContainer.scrollTop <= 8;
        if (diffY > 0 && !isAtBottom) return;
        if (diffY < 0 && !isAtTop) return;
      }

      if (diffY > 0 && currentScreen < 5) {
        goToScreen(currentScreen + 1);
      } else if (diffY < 0 && currentScreen > 1) {
        goToScreen(currentScreen - 1);
      }
    }
  }, { passive: true });

  window.addEventListener('keydown', (e) => {
    const lockScreen = document.getElementById('lock-screen');
    if (lockScreen && !lockScreen.classList.contains('hidden')) return;
    if (document.querySelector('.polaroid-lightbox.active, .random-wish-modal.active, .cinematic-overlay.active')) return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      if (currentScreen < 5) goToScreen(currentScreen + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      if (currentScreen > 1) goToScreen(currentScreen - 1);
    } else if (e.key === 'Home') {
      goToScreen(1);
    } else if (e.key === 'End') {
      goToScreen(5);
    }
  });
}

function bindClick(id, handler) {
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', handler);
}

function onScreenActivated(screenNum) {
  playSoftChimeSound();

  if (screenNum === 2) {
    autoBloomFlowers();
  } else if (screenNum === 3) {
    triggerSequentialWishes();
  } else if (screenNum === 4) {
    triggerPolaroidCascade();
  } else if (screenNum === 5) {
    triggerHeartFormation();
  }
}

/* ==============================================================================
 * 11. KHU VƯỜN HOA KỲ DIỆU (MAGICAL FLOWER GARDEN NỞ HOA TƯƠNG TÁC)
 * ============================================================================== */
function initFlowerGarden() {
  const gardenStage = document.getElementById('garden-stage');
  const sproutGardener = document.getElementById('sprout-gardener');
  const speechBubble = document.getElementById('sprout-speech');
  if (!gardenStage) return;

  gardenStage.addEventListener('click', (e) => {
    const rect = gardenStage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    spawnFlowerAt(x, y);
    playFlowerChime();

    if (speechBubble) {
      const name = activeRecipient ? activeRecipient.displayName : "chị em";
      const cuteReplies = [
        `Hoa nở tặng ${name} nè! 🌸`,
        "Khu vườn lung linh quá! ✨",
        `Dành tặng ${name} đó! 🌷`,
        "Xinh đẹp tuyệt vời luôn ạ! 💖"
      ];
      speechBubble.textContent = cuteReplies[Math.floor(Math.random() * cuteReplies.length)];
    }
  });

  if (sproutGardener) {
    sproutGardener.addEventListener('click', (e) => {
      e.stopPropagation();
      playSparkleSound();
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const offsetX = (Math.random() - 0.5) * 140;
          const offsetY = (Math.random() - 0.5) * 50;
          spawnFlowerAt(gardenStage.clientWidth / 2 + offsetX, 190 + offsetY);
        }, i * 150);
      }
    });
  }
}

function spawnFlowerAt(x, y) {
  const container = document.getElementById('blooming-flowers-container');
  if (!container) return;

  const flowerTypes = [
    { color: '#f472b6', center: '#fde047', petals: 8, size: 34 },
    { color: '#ff5e7e', center: '#fff', petals: 6, size: 30 },
    { color: '#6ee7b7', center: '#fde047', petals: 10, size: 32 },
    { color: '#c084fc', center: '#fef08a', petals: 7, size: 34 }
  ];

  const type = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
  const flowerDiv = document.createElement('div');
  flowerDiv.className = 'blooming-flower-item';
  flowerDiv.style.left = `${x - type.size / 2}px`;
  flowerDiv.style.top = `${y - type.size}px`;
  flowerDiv.style.width = `${type.size}px`;
  flowerDiv.style.height = `${type.size + 24}px`;

  flowerDiv.innerHTML = `
    <svg viewBox="0 0 100 130" width="100%" height="100%">
      <path d="M 50,70 Q ${45 + Math.random() * 10},100 50,130" stroke="#34d399" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M 50,95 Q 30,90 35,80 Q 45,85 50,95" fill="#10b981"/>
      <path d="M 50,105 Q 70,100 65,90 Q 55,95 50,105" fill="#10b981"/>
      <g transform="translate(50, 60)">
        ${Array.from({ length: type.petals }).map((_, idx) => {
          const angle = (idx * 360) / type.petals;
          return `<ellipse cx="0" cy="-20" rx="8" ry="14" transform="rotate(${angle})" fill="${type.color}" opacity="0.9" stroke="#fff" stroke-width="1"/>`;
        }).join('')}
        <circle cx="0" cy="0" r="9" fill="${type.center}" filter="drop-shadow(0 0 6px ${type.center})"/>
      </g>
    </svg>
  `;

  container.appendChild(flowerDiv);

  if (container.children.length > 22) {
    container.removeChild(container.firstChild);
  }
}

function autoBloomFlowers() {
  const stage = document.getElementById('garden-stage');
  const container = document.getElementById('blooming-flowers-container');
  if (!stage || !container || container.children.length > 4) return;

  const positions = [
    { x: 100, y: stage.clientHeight - 70 },
    { x: 180, y: stage.clientHeight - 85 },
    { x: stage.clientWidth - 180, y: stage.clientHeight - 85 },
    { x: stage.clientWidth - 100, y: stage.clientHeight - 70 }
  ];

  positions.forEach((pos, idx) => {
    setTimeout(() => {
      spawnFlowerAt(pos.x, pos.y);
    }, idx * 220);
  });
}

/* ==============================================================================
 * 12. LỜI CHÚC XUẤT HIỆN LẦN LƯỢT VỚI HIỆU ỨNG GÕ CHỮ (SCREEN 3)
 * ============================================================================== */
function renderWishesStructure(data) {
  const container = document.getElementById('wishes-list');
  if (!container) return;

  container.innerHTML = '';

  // Trường hợp 1: Có đối tượng recipient với trường wish riêng biệt (học sinh / sinh viên)
  if (data && data.wish) {
    const card = document.createElement('div');
    card.className = 'personal-student-wish-card';
    card.id = 'student-wish-card';

    card.innerHTML = `
      <div class="student-wish-badge">
        <span class="student-wish-icon">${data.icon || '🌸'}</span>
        <div class="student-wish-header-info">
          <span class="student-wish-recipient">Gửi ${data.pronoun} ${data.displayName} thân mến</span>
          <span class="student-wish-subtitle">✨ Lời chúc 20/10 & Đồng hành mùa thi cử ✨</span>
        </div>
      </div>
      <div class="student-wish-content">
        <div class="quote-mark left">“</div>
        <div class="student-wish-text" id="student-wish-text"></div>
        <div class="quote-mark right">”</div>
      </div>
      <div class="student-wish-footer">
        <span class="student-wish-tag">🎓 Học tập thuận lợi • Điểm số như ý • Thanh xuân rực rỡ</span>
        <span class="student-wish-sig">🌱 Always by your side</span>
      </div>
    `;

    container.appendChild(card);
    return;
  }

  // Trường hợp 2: Fallback cho mảng danh sách (khi chưa đăng nhập hoặc relock)
  const list = Array.isArray(data) ? data : (window.APP_CONFIG && window.APP_CONFIG.specialWishes ? window.APP_CONFIG.specialWishes.wishesList : []);
  if (list && list.length > 0) {
    list.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'wish-card-item';
      card.id = `wish-card-${idx}`;
      card.innerHTML = `
        <div class="wish-icon-badge">${item.icon || '🌸'}</div>
        <div class="wish-text-content" id="wish-text-${idx}"></div>
      `;
      container.appendChild(card);
    });
  }
}

function triggerSequentialWishes(instant = false) {
  const container = document.getElementById('wishes-list');
  if (!container) return;

  // Nếu người dùng hiện tại có lời chúc riêng
  if (activeRecipient && activeRecipient.wish) {
    const textTarget = document.getElementById('student-wish-text');
    const card = document.getElementById('student-wish-card');
    if (!textTarget) return;

    const fullWish = activeRecipient.wish;

    if (instant || wishesAlreadyTyped) {
      textTarget.textContent = fullWish;
      wishesAlreadyTyped = true;
      return;
    }

    wishesAlreadyTyped = true;
    let charIdx = 0;
    textTarget.innerHTML = `<span class="typed-chars"></span><span class="typewriter-cursor"></span>`;
    const charSpan = textTarget.querySelector('.typed-chars');
    const cursorSpan = textTarget.querySelector('.typewriter-cursor');

    // Thử kích hoạt nhạc nếu trước đó bị hoãn bởi chính sách trình duyệt
    if (localAudioPlayer && localAudioPlayer.paused && activeRecipient && activeRecipient.music) {
      const startTime = Number(activeRecipient.music.startTime) || 0;
      if (startTime > 0 && localAudioPlayer.currentTime < 1) {
        try { localAudioPlayer.currentTime = startTime; } catch (e) {}
      }
      localAudioPlayer.play().then(() => {
        isMusicPlaying = true;
        updateAllMusicUI(true);
      }).catch(() => {});
    }

    playSoftChimeSound();

    let isTypingDone = false;
    const typeInterval = setInterval(() => {
      if (charIdx < fullWish.length) {
        charSpan.textContent += fullWish.charAt(charIdx);
        charIdx++;
      } else {
        clearInterval(typeInterval);
        isTypingDone = true;
        if (cursorSpan) cursorSpan.remove();
      }
    }, 18);

    // Chạm/nhấp vào thẻ để hiện ngay lập tức toàn bộ lời chúc và phát nhạc nếu đang dừng
    if (card) {
      card.onclick = () => {
        if (!isTypingDone) {
          clearInterval(typeInterval);
          isTypingDone = true;
          textTarget.textContent = fullWish;
        }
        if (localAudioPlayer && localAudioPlayer.paused && activeRecipient && activeRecipient.music) {
          toggleMusicPlayback();
        }
      };
    }

    return;
  }

  // Fallback: Mảng danh sách
  const wishes = window.APP_CONFIG && window.APP_CONFIG.specialWishes ? window.APP_CONFIG.specialWishes.wishesList : [];
  if (!wishes || wishes.length === 0) return;

  if (wishesAlreadyTyped) {
    wishes.forEach((w, idx) => {
      const card = document.getElementById(`wish-card-${idx}`);
      const textTarget = document.getElementById(`wish-text-${idx}`);
      if (card) card.classList.add('revealed');
      if (textTarget) textTarget.textContent = w.text;
    });
    return;
  }

  wishesAlreadyTyped = true;
  let currentIdx = 0;

  function typeNextWish() {
    if (currentIdx >= wishes.length) return;

    const card = document.getElementById(`wish-card-${currentIdx}`);
    const textTarget = document.getElementById(`wish-text-${currentIdx}`);
    const fullText = wishes[currentIdx].text;

    if (card) card.classList.add('revealed');

    let charIdx = 0;
    textTarget.innerHTML = `<span class="typed-chars"></span><span class="typewriter-cursor"></span>`;
    const charSpan = textTarget.querySelector('.typed-chars');
    const cursorSpan = textTarget.querySelector('.typewriter-cursor');

    playSoftChimeSound();

    const typeInterval = setInterval(() => {
      if (charIdx < fullText.length) {
        charSpan.textContent += fullText.charAt(charIdx);
        charIdx++;
      } else {
        clearInterval(typeInterval);
        if (cursorSpan) cursorSpan.remove();
        currentIdx++;
        setTimeout(typeNextWish, 300);
      }
    }, 25);
  }

  typeNextWish();
}

/* ==============================================================================
 * 13. ALBUM ẢNH POLAROID & LIGHTBOX PHÓNG TO (SCREEN 4)
 * ============================================================================== */
function initPolaroidAlbum(photos) {
  const gallery = document.getElementById('polaroid-gallery');
  if (!gallery || !photos) return;

  gallery.innerHTML = '';

  photos.forEach((photo, idx) => {
    const card = document.createElement('div');
    card.className = 'polaroid-card';
    card.id = `polaroid-${idx}`;

    card.innerHTML = `
      <div class="polaroid-tape"></div>
      <div class="polaroid-image-wrapper">
        <img src="${photo.url}" alt="${photo.caption}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80'">
      </div>
      <div class="polaroid-caption-box">
        <p class="polaroid-caption-text">${photo.caption}</p>
        <span class="polaroid-date-tag">★ ${photo.date || 'Kỷ niệm'} ★</span>
      </div>
    `;

    card.addEventListener('click', () => {
      openPolaroidLightbox(photo);
      playSparkleSound();
    });

    gallery.appendChild(card);
  });

  const lightbox = document.getElementById('polaroid-lightbox');
  const closeBtn = document.getElementById('close-lightbox-btn');
  const overlay = lightbox ? lightbox.querySelector('.lightbox-overlay') : null;

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (overlay) overlay.addEventListener('click', closeLightbox);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

function triggerPolaroidCascade() {
  const cards = document.querySelectorAll('.polaroid-card');
  cards.forEach((card, idx) => {
    setTimeout(() => {
      card.classList.add('visible');
    }, idx * 100);
  });
}

function openPolaroidLightbox(photo) {
  const lightbox = document.getElementById('polaroid-lightbox');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  const date = document.getElementById('lightbox-date');

  if (!lightbox || !img || !caption || !date) return;

  img.src = photo.url;
  caption.textContent = photo.caption;
  date.textContent = `★ ${photo.date || 'Kỷ niệm đẹp'} ★`;

  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
}

/* ==============================================================================
 * 14. CÁNH HOA BAY LÊN TỤ THÀNH TRÁI TIM LỚN (SCREEN 5: ENDING)
 * ============================================================================== */
let heartAnimInitialized = false;

function initHeartPetalsCanvas() {
  // Chuẩn bị canvas
}

function triggerHeartFormation() {
  if (heartAnimInitialized) return;
  heartAnimInitialized = true;

  const canvas = document.getElementById('heart-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const heartParticles = [];
  const totalParticles = 120;

  for (let i = 0; i < totalParticles; i++) {
    const t = (i / totalParticles) * Math.PI * 2;
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

    const startX = Math.random() * width;
    const startY = height + Math.random() * 180;

    const colors = ['#f472b6', '#ff5e7e', '#fde047', '#6ee7b7', '#c084fc', '#ffffff'];

    heartParticles.push({
      x: startX,
      y: startY,
      hx: hx,
      hy: hy,
      size: Math.random() * 5 + 3.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * Math.PI * 2,
      progress: 0,
      speed: Math.random() * 0.009 + 0.007,
      alpha: 1
    });
  }

  let beatTime = 0;

  function renderHeartLoop() {
    ctx.clearRect(0, 0, width, height);
    beatTime += 0.035;
    const pulseScale = 1 + Math.sin(beatTime) * 0.04;

    const currentCenterX = width / 2;
    const currentCenterY = height * 0.44;
    const heartScale = Math.min(width * 0.026, height * 0.02, 10.5);

    heartParticles.forEach((p) => {
      const targetX = currentCenterX + p.hx * heartScale * pulseScale;
      const targetY = currentCenterY + p.hy * heartScale * pulseScale;

      if (p.progress < 1) {
        p.progress += p.speed;
        p.x = p.x + (targetX - p.x) * 0.05;
        p.y = p.y + (targetY - p.y) * 0.05;
      } else {
        p.x = targetX + Math.sin(beatTime * 2 + p.angle) * 2.5;
        p.y = targetY + Math.cos(beatTime * 2 + p.angle) * 2.5;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(renderHeartLoop);
  }

  renderHeartLoop();
}

/* ==============================================================================
 * 15. MODAL LỜI CHÚC BẤT NGỜ NGẪU NHIÊN (RANDOM WISH MODAL)
 * ============================================================================== */
function initRandomWishModal(randomWishes) {
  const btnOpen = document.getElementById('btn-random-wish');
  const modal = document.getElementById('random-wish-modal');
  const closeBtn = document.getElementById('close-random-wish-btn');
  const backdrop = modal ? modal.querySelector('.modal-backdrop') : null;
  const wishTextEl = document.getElementById('random-wish-text');
  const btnDrawAnother = document.getElementById('btn-draw-another-wish');

  if (!btnOpen || !modal || !randomWishes || randomWishes.length === 0) return;

  function showRandomWish() {
    const randomIndex = Math.floor(Math.random() * randomWishes.length);
    let wish = randomWishes[randomIndex];
    if (activeRecipient) {
      const p = activeRecipient.pronoun;
      wish = wish.replace(/\bbạn\b/gi, p);
    }
    if (wishTextEl) {
      wishTextEl.textContent = wish;
    }
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    playFlowerChime();
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  btnOpen.addEventListener('click', showRandomWish);
  if (btnDrawAnother) btnDrawAnother.addEventListener('click', showRandomWish);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==============================================================================
 * 16. HỆ THỐNG ÂM THANH NỘI TẠI (WEB AUDIO API FALLBACK & HIỆU ỨNG TƯƠNG TÁC)
 * ============================================================================== */
let audioCtx = null;
let synthMusicInterval = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playFlowerChime() {
  try {
    const ctx = getAudioContext();
    const notes = [587.33, 739.99, 880.0, 1174.66];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }, idx * 60);
    });
  } catch (err) {}
}

function playSparkleSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(659.25, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch (err) {}
}

function playSoftChimeSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  } catch (err) {}
}

function playFanfareCelebration() {
  try {
    const ctx = getAudioContext();
    const notes = [
      { freq: 523.25, time: 0, dur: 0.2 },
      { freq: 659.25, time: 0.15, dur: 0.2 },
      { freq: 783.99, time: 0.3, dur: 0.25 },
      { freq: 1046.5, time: 0.45, dur: 0.5 },
      { freq: 1318.51, time: 0.7, dur: 0.8 }
    ];
    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.freq, ctx.currentTime + n.time);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + n.time);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.time + n.dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + n.time);
      osc.stop(ctx.currentTime + n.time + n.dur);
    });
  } catch (err) {}
}

function startSynthMelody() {
  const ctx = getAudioContext();
  const melodyNotes = [
    { freq: 523.25, dur: 0.35 },
    { freq: 659.25, dur: 0.35 },
    { freq: 783.99, dur: 0.5 },
    { freq: 659.25, dur: 0.35 },
    { freq: 880.0, dur: 0.6 },
    { freq: 783.99, dur: 0.4 },
    { freq: 659.25, dur: 0.5 },
    { freq: 587.33, dur: 0.7 }
  ];

  let noteIdx = 0;
  synthMusicInterval = setInterval(() => {
    if (!isMusicPlaying) return;
    const note = melodyNotes[noteIdx];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = note.freq;

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + note.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + note.dur);

    noteIdx = (noteIdx + 1) % melodyNotes.length;
  }, 500);
}

function stopSynthMelody() {
  if (synthMusicInterval) {
    clearInterval(synthMusicInterval);
    synthMusicInterval = null;
  }
}
