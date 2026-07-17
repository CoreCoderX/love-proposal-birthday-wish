// ========================================
// HAND-DRAWN BIRTHDAY LOVE LETTER
// ========================================

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// ========================================
// GLOBAL STATE MANAGEMENT
// ========================================

const AppState = {
  soundEnabled: true,
  cakeBlown: false,
  currentCarouselIndex: 0,
  totalCarouselSlides: 7,
  dialogStep: 0,
  hasSeenBirthday: false,
  hasOpenedLetter: false,
  hasStartedDialog: false,
};

// ========================================
// SOUND EFFECTS (Web Audio API)
// ========================================

const SoundEffects = {
    context: null,
    
    init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    },
    
    playBlow() {
        if (!AppState.soundEnabled || !this.context) return;
        
        // Gentle whoosh sound
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.frequency.setValueAtTime(300, this.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.context.currentTime + 0.3);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.15, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.3);
    },
    
    playPop() {
        if (!AppState.soundEnabled || !this.context) return;
        
        // Soft pop sound
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.frequency.setValueAtTime(600, this.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.context.currentTime + 0.1);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.1);
    },
    
    playSuccess() {
        if (!AppState.soundEnabled || !this.context) return;
        
        // Pleasant success chime
        const times = [0, 0.15, 0.3];
        const frequencies = [523.25, 659.25, 783.99]; // C, E, G
        
        times.forEach((time, index) => {
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            oscillator.frequency.value = frequencies[index];
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.15, this.context.currentTime + time);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + time + 0.4);
            
            oscillator.start(this.context.currentTime + time);
            oscillator.stop(this.context.currentTime + time + 0.4);
        });
    },
    
    playClick() {
        if (!AppState.soundEnabled || !this.context) return;
        
        // Soft click sound
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.08, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.05);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.05);
    }
};
// ========================================
// LOCAL STORAGE MANAGEMENT
// ========================================

const Storage = {
  save(key, value) {
    try {
      localStorage.setItem(`birthday_${key}`, JSON.stringify(value));
    } catch (e) {
      console.log("LocalStorage not available");
    }
  },

  load(key) {
    try {
      const item = localStorage.getItem(`birthday_${key}`);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      return null;
    }
  },

  clear(key) {
    try {
      localStorage.removeItem(`birthday_${key}`);
    } catch (e) {
      console.log("LocalStorage not available");
    }
  },
};

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  // Initialize sound
  SoundEffects.init();

  // Load saved state
  loadSavedState();

  // Initialize all modules
  initSoundToggle();
  initBalloonFloating();
  initBirthdayCake();
  initConfetti();
  initCarousel();
  initBirthdayLetter();
  initTransitionSystem();
  initScrollAnimations();
  initMemoryCards();
  initStats();
  initLetterReveal();
  initCakeIcons();
  initReplySystem();

  // Console Easter Egg
  console.log(
    "%c💝 20 Years Old, 13 Years of Feelings... 💝",
    "font-size: 24px; color: #ff4d4d; font-weight: bold;",
  );
  console.log(
    "%cFinally found the courage to say it.",
    "font-size: 16px; color: #2d2d2d;",
  );
  console.log(
    "%c— Made with ❤️ and trembling hands",
    "font-size: 12px; color: #2d5da1; font-style: italic;",
  );
});

// ========================================
// LOAD SAVED STATE
// ========================================

function loadSavedState() {
  const savedDialog = Storage.load("dialogStep");
  if (savedDialog !== null) {
    AppState.dialogStep = savedDialog;
    AppState.hasStartedDialog = savedDialog > 0;
  }

  const savedSound = Storage.load("soundEnabled");
  if (savedSound !== null) {
    AppState.soundEnabled = savedSound;
    updateSoundIcon();
  }
}

// ========================================
// SOUND TOGGLE
// ========================================

function initSoundToggle() {
  const soundToggle = document.getElementById("soundToggle");
  const soundIcon = document.getElementById("soundIcon");

  if (!soundToggle) return;

  soundToggle.addEventListener("click", () => {
    AppState.soundEnabled = !AppState.soundEnabled;
    Storage.save("soundEnabled", AppState.soundEnabled);
    updateSoundIcon();
    SoundEffects.playClick();
  });

  updateSoundIcon();
}

function updateSoundIcon() {
  const soundIcon = document.getElementById("soundIcon");

  if (!soundIcon) return;

  if (AppState.soundEnabled) {
    soundIcon.textContent = "🔊";
  } else {
    soundIcon.textContent = "🔇";
  }
}

// ========================================
// BALLOON FLOATING ANIMATION
// ========================================

function initBalloonFloating() {
  const balloons = document.querySelectorAll(".balloon");

  balloons.forEach((balloon, index) => {
    const duration = 8 + Math.random() * 7;
    const yMovement = -100 - Math.random() * 100;

    gsap.to(balloon, {
      y: yMovement,
      duration: duration,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
      delay: index * 0.5,
    });

    gsap.to(balloon, {
      rotation: index % 2 === 0 ? 5 : -5,
      duration: duration / 2,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    });
  });
}

// ========================================
// BIRTHDAY CAKE (SINGLE CLICK)
// ========================================

function initBirthdayCake() {
    const birthdayCake = document.getElementById('birthdayCake');
    const wishMessage = document.getElementById('wishMessage');
    
    if (!birthdayCake) return;
    
    birthdayCake.addEventListener('click', () => {
        if (AppState.cakeBlown) return;
        
        blowCake();
    });
    
    function blowCake() {
        AppState.cakeBlown = true;
        
        // Get all candle flames
        const flames = birthdayCake.querySelectorAll('.candle-flame-top');
        
        // Blow out candles with stagger effect
        flames.forEach((flame, index) => {
            setTimeout(() => {
                flame.classList.add('blown');
                SoundEffects.playBlow();
                
                // Create smoke effect
                createSmokeEffect(flame);
            }, index * 400);
        });
        
        // Show wish message after all candles blown
        setTimeout(() => {
            wishMessage.classList.remove('hidden');
            SoundEffects.playSuccess();
            triggerConfetti();
            
            // Animate message
            gsap.from(wishMessage, {
                scale: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.5)'
            });
        }, flames.length * 400 + 500);
    }
    
    function createSmokeEffect(candle) {
        const rect = candle.getBoundingClientRect();
        const smoke = document.createElement('div');
        smoke.style.position = 'fixed';
        smoke.style.left = rect.left + rect.width / 2 + 'px';
        smoke.style.top = rect.top + 'px';
        smoke.style.width = '6px';
        smoke.style.height = '6px';
        smoke.style.background = '#999';
        smoke.style.borderRadius = '50%';
        smoke.style.pointerEvents = 'none';
        smoke.style.zIndex = '1000';
        
        document.body.appendChild(smoke);
        
        gsap.to(smoke, {
            y: -60,
            x: (Math.random() - 0.5) * 20,
            opacity: 0,
            scale: 4,
            duration: 1.2,
            ease: 'power2.out',
            onComplete: () => smoke.remove()
        });
    }
}

// ========================================
// CONFETTI SYSTEM
// ========================================

function initConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

function triggerConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const colors = ["#ff4d4d", "#fff9c4", "#2d5da1", "#2d2d2d"];
  const particleCount = window.innerWidth < 768 ? 30 : 50;
  const particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = -10;
      this.size = Math.random() * 8 + 4;
      this.speedY = Math.random() * 3 + 2;
      this.speedX = (Math.random() - 0.5) * 4;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 10;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;

      if (this.y > canvas.height) {
        return false;
      }
      return true;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;

      if (Math.random() > 0.5) {
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    setTimeout(() => {
      particles.push(new Particle());
    }, i * 50);
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      if (!particles[i].update()) {
        particles.splice(i, 1);
      } else {
        particles[i].draw();
      }
    }

    if (particles.length > 0) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}

// ========================================
// CAROUSEL SYSTEM
// ========================================

function initCarousel() {
  const track = document.getElementById("carouselTrack");
  const prevBtn = document.getElementById("carouselPrev");
  const nextBtn = document.getElementById("carouselNext");
  const dotsContainer = document.getElementById("carouselDots");

  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  const slides = track.querySelectorAll(".carousel-slide");
  AppState.totalCarouselSlides = slides.length;

  // Create dots
  for (let i = 0; i < AppState.totalCarouselSlides; i++) {
    const dot = document.createElement("div");
    dot.className = "carousel-dot";
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }

  const dots = dotsContainer.querySelectorAll(".carousel-dot");

  // Navigation
  prevBtn.addEventListener("click", () => {
    if (AppState.currentCarouselIndex > 0) {
      goToSlide(AppState.currentCarouselIndex - 1);
      SoundEffects.playClick();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (AppState.currentCarouselIndex < AppState.totalCarouselSlides - 1) {
      goToSlide(AppState.currentCarouselIndex + 1);
      SoundEffects.playClick();
    }
  });

  // Touch/Swipe support
  let startX = 0;
  let isDragging = false;

  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  track.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      e.preventDefault();
    },
    { passive: false },
  );

  track.addEventListener("touchend", (e) => {
    if (!isDragging) return;

    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (
        diff > 0 &&
        AppState.currentCarouselIndex < AppState.totalCarouselSlides - 1
      ) {
        goToSlide(AppState.currentCarouselIndex + 1);
      } else if (diff < 0 && AppState.currentCarouselIndex > 0) {
        goToSlide(AppState.currentCarouselIndex - 1);
      }
    }

    isDragging = false;
  });

  function goToSlide(index) {
    AppState.currentCarouselIndex = index;

    // Calculate slide width
    const slideWidth = slides[0].offsetWidth;
    const gap = 20;
    const offset = -(slideWidth + gap) * index;

    track.style.transform = `translateX(${offset}px)`;

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    // Update buttons
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === AppState.totalCarouselSlides - 1;
  }

  // Auto-update on resize
  window.addEventListener("resize", () => {
    goToSlide(AppState.currentCarouselIndex);
  });

  // Initial button state
  goToSlide(0);
}

// ========================================
// BIRTHDAY LETTER SYSTEM
// ========================================

function initBirthdayLetter() {
  const sealedEnvelope = document.getElementById("sealedEnvelope");
  const openedLetter = document.getElementById("openedLetter");
  const transitionTrigger = document.getElementById("transitionTrigger");

  if (!sealedEnvelope || !openedLetter) return;

  sealedEnvelope.addEventListener("click", () => {
    openLetter();
  });

  function openLetter() {
    AppState.hasOpenedLetter = true;

    SoundEffects.playPop();

    // Hide envelope
    gsap.to(sealedEnvelope, {
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        sealedEnvelope.style.display = "none";

        // Show letter
        openedLetter.classList.remove("hidden");

        // Scroll to letter
        openedLetter.scrollIntoView({ behavior: "smooth", block: "start" });
      },
    });
  }

  // Transition trigger
  if (transitionTrigger) {
    transitionTrigger.addEventListener("click", () => {
      startTransitionDialog();
    });
  }
}

// ========================================
// TRANSITION DIALOG SYSTEM
// ========================================

const DialogQuestions = [
  {
    step: 1,
    text: "I've been carrying something for 13 years...\nWant to know what it is?",
    buttons: [
      { text: "Yes, Tell Me", action: "continue", primary: true },
      { text: "Maybe Later...", action: "exit", primary: false },
    ],
    exitMessage: {
      title: "That's Okay! 💛",
      message:
        "The birthday wish was the important part anyway.<br><br>But if you change your mind... I'll be waiting right here.",
      showReturn: true,
    },
  },
  {
    step: 2,
    text: "Okay, but... this might be awkward.\nIt's something I should've said years ago.\n\nStill curious?",
    buttons: [
      { text: "Yes, Go On", action: "continue", primary: true },
      { text: "I'm Not Sure...", action: "exit", primary: false },
    ],
    exitMessage: {
      title: "No Pressure! 😊",
      message:
        "Take all the time you need to think about it.<br><br>This confession has waited 13 years... it can wait a bit more.",
      showReturn: true,
    },
  },
  {
    step: 3,
    text: "Just so you know... it's okay if you don't feel the same way.\n\nI just need to get this off my chest.\n\nReady?",
    buttons: [
      { text: "I'm Ready", action: "continue", primary: true },
      { text: "Wait, What?", action: "hint", primary: false },
    ],
    hintMessage:
      "Let's just say... those 13 years weren't just about friendship for me. 💭",
    hintButtons: [
      { text: "Continue", action: "continue", primary: true },
      { text: "Stop Here", action: "exit", primary: false },
    ],
    exitMessage: {
      title: "I Understand 🫂",
      message:
        "This is a lot to process. No worries at all.<br><br>The birthday wishes were genuine either way.",
      showReturn: false,
    },
  },
  {
    step: 4,
    text: "This is where I stop being 'that quiet guy from school'...\n\nAnd start being honest about how I feel.\n\nCan I continue?",
    buttons: [
      { text: "Yes, Show Me", action: "continue", primary: true },
      { text: "I Need a Moment...", action: "pause", primary: false },
    ],
    pauseMessage: {
      title: "Take Your Time ⏰",
      message: "I'll be right here when you're ready.<br><br>No rush. Really.",
      showReturn: true,
    },
  },
  {
    step: 5,
    text: "Okay... here goes nothing.\n\nIt all started 13 years ago...\n\nWhen I first saw you in that white dress...",
    buttons: [
      { text: "Continue to the Story", action: "reveal", primary: true },
    ],
  },
];

function initTransitionSystem() {
  const transitionSection = document.getElementById("transitionSection");
  const dialogContainer = document.getElementById("dialogContainer");
  const emergencyExit = document.getElementById("emergencyExit");

  if (!transitionSection || !dialogContainer) return;

  // Emergency exit
  if (emergencyExit) {
    emergencyExit.addEventListener("click", () => {
      handleDialogExit(AppState.dialogStep);
    });
  }

  // Check if should resume
  if (AppState.hasStartedDialog && AppState.dialogStep < 5) {
    showResumeOption();
  }
}

function startTransitionDialog() {
  AppState.hasStartedDialog = true;
  AppState.dialogStep = 0;
  Storage.save("dialogStep", 0);

  const transitionSection = document.getElementById("transitionSection");
  const birthdaySection = document.getElementById("birthdaySection");

  // Hide birthday section
  gsap.to(birthdaySection, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      birthdaySection.style.display = "none";

      // Show transition section
      transitionSection.classList.remove("hidden");
      transitionSection.style.opacity = 0;
      transitionSection.style.display = "flex";

      gsap.to(transitionSection, {
        opacity: 1,
        duration: 0.5,
        onComplete: () => {
          showDialogQuestion(0);
        },
      });
    },
  });

  SoundEffects.playClick();
}

function showDialogQuestion(index) {
  const dialogContainer = document.getElementById("dialogContainer");
  if (!dialogContainer || index >= DialogQuestions.length) return;

  const question = DialogQuestions[index];
  AppState.dialogStep = index;
  Storage.save("dialogStep", index);

  // Update progress dots
  updateProgressDots(index);

  // Clear container
  dialogContainer.innerHTML = "";

  // Create question element
  const questionDiv = document.createElement("div");
  questionDiv.className = "dialog-question";

  const bubble = document.createElement("div");
  bubble.className = "dialog-bubble wobbly-card";

  const text = document.createElement("div");
  text.className = "dialog-text";
  text.innerHTML = "";

  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "dialog-buttons";

  question.buttons.forEach((btn) => {
    const button = document.createElement("button");
    button.className = `dialog-btn ${btn.primary ? "dialog-btn-primary" : "dialog-btn-secondary"}`;
    button.textContent = btn.text;
    button.addEventListener("click", () => {
      handleDialogAction(btn.action, index, question);
      SoundEffects.playClick();
    });
    buttonsDiv.appendChild(button);
  });

  bubble.appendChild(text);
  bubble.appendChild(buttonsDiv);
  questionDiv.appendChild(bubble);
  dialogContainer.appendChild(questionDiv);

  // Smooth typewriter effect
  smoothTypewriter(text, question.text);
}

function smoothTypewriter(element, text) {
  // Replace newlines with <br> tags
  const htmlText = text.replace(/\n/g, "<br>");

  // Create a temporary div to parse HTML
  const temp = document.createElement("div");
  temp.innerHTML = htmlText;

  // Get the text content preserving structure
  const lines = htmlText.split("<br>");
  element.innerHTML = "";

  let currentLine = 0;
  let currentChar = 0;

  function typeNextChar() {
    if (currentLine >= lines.length) return;

    const line = lines[currentLine];

    if (currentChar < line.length) {
      // Get current content
      const currentContent = element.innerHTML;

      // Add next character
      if (currentLine > 0 && currentChar === 0) {
        element.innerHTML = currentContent + "<br>" + line[currentChar];
      } else {
        element.innerHTML = currentContent + line[currentChar];
      }

      currentChar++;
      setTimeout(typeNextChar, 30);
    } else {
      currentLine++;
      currentChar = 0;
      if (currentLine < lines.length) {
        setTimeout(typeNextChar, 30);
      }
    }
  }

  typeNextChar();
}

function handleDialogAction(action, currentIndex, question) {
  switch (action) {
    case "continue":
      if (currentIndex < DialogQuestions.length - 1) {
        showDialogQuestion(currentIndex + 1);
      }
      break;

    case "exit":
      handleDialogExit(currentIndex, question.exitMessage);
      break;

    case "pause":
      handleDialogPause(currentIndex, question.pauseMessage);
      break;

    case "hint":
      showHintMessage(currentIndex, question);
      break;

    case "reveal":
      revealJourneySection();
      break;
  }
}

function handleDialogExit(step, exitMessage) {
  const dialogContainer = document.getElementById("dialogContainer");
  if (!dialogContainer) return;

  const message = exitMessage || {
    title: "That's Okay! 💛",
    message:
      "The birthday wish was the important part anyway.<br><br>You can come back anytime.",
    showReturn: true,
  };

  dialogContainer.innerHTML = "";

  const exitDiv = document.createElement("div");
  exitDiv.className = "exit-message";

  const exitCard = document.createElement("div");
  exitCard.className = "exit-card wobbly-card";

  exitCard.innerHTML = `
        <h3>${message.title}</h3>
        <p>${message.message}</p>
    `;

  if (message.showReturn) {
    const returnBtn = document.createElement("button");
    returnBtn.className = "dialog-btn dialog-btn-primary";
    returnBtn.textContent = "Actually... I Want to Know";
    returnBtn.style.marginTop = "20px";
    returnBtn.addEventListener("click", () => {
      showDialogQuestion(step);
      SoundEffects.playClick();
    });
    exitCard.appendChild(returnBtn);
  }

  const backBtn = document.createElement("button");
  backBtn.className = "dialog-btn dialog-btn-secondary";
  backBtn.textContent = "Back to Birthday Wishes";
  backBtn.style.marginTop = "10px";
  backBtn.addEventListener("click", () => {
    returnToBirthday();
    SoundEffects.playClick();
  });
  exitCard.appendChild(backBtn);

  exitDiv.appendChild(exitCard);
  dialogContainer.appendChild(exitDiv);
}

function handleDialogPause(step, pauseMessage) {
  const dialogContainer = document.getElementById("dialogContainer");
  if (!dialogContainer) return;

  dialogContainer.innerHTML = "";

  const pauseDiv = document.createElement("div");
  pauseDiv.className = "exit-message";

  const pauseCard = document.createElement("div");
  pauseCard.className = "exit-card wobbly-card";

  pauseCard.innerHTML = `
        <h3>${pauseMessage.title}</h3>
        <p>${pauseMessage.message}</p>
    `;

  const resumeBtn = document.createElement("button");
  resumeBtn.className = "dialog-btn dialog-btn-primary";
  resumeBtn.textContent = "I'm Ready Now";
  resumeBtn.style.marginTop = "20px";
  resumeBtn.addEventListener("click", () => {
    showDialogQuestion(step);
    SoundEffects.playClick();
  });
  pauseCard.appendChild(resumeBtn);

  pauseDiv.appendChild(pauseCard);
  dialogContainer.appendChild(pauseDiv);
}

function showHintMessage(step, question) {
  const dialogContainer = document.getElementById("dialogContainer");
  if (!dialogContainer) return;

  dialogContainer.innerHTML = "";

  const hintDiv = document.createElement("div");
  hintDiv.className = "dialog-question";

  const bubble = document.createElement("div");
  bubble.className = "dialog-bubble wobbly-card";
  bubble.style.background = "var(--postit)";

  const text = document.createElement("div");
  text.className = "dialog-text";
  text.innerHTML = question.hintMessage;

  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "dialog-buttons";

  question.hintButtons.forEach((btn) => {
    const button = document.createElement("button");
    button.className = `dialog-btn ${btn.primary ? "dialog-btn-primary" : "dialog-btn-secondary"}`;
    button.textContent = btn.text;
    button.addEventListener("click", () => {
      handleDialogAction(btn.action, step, question);
      SoundEffects.playClick();
    });
    buttonsDiv.appendChild(button);
  });

  bubble.appendChild(text);
  bubble.appendChild(buttonsDiv);
  hintDiv.appendChild(bubble);
  dialogContainer.appendChild(hintDiv);
}

function updateProgressDots(activeIndex) {
  const dots = document.querySelectorAll(".progress-dot");
  dots.forEach((dot, index) => {
    dot.classList.remove("active", "completed");
    if (index === activeIndex) {
      dot.classList.add("active");
    } else if (index < activeIndex) {
      dot.classList.add("completed");
    }
  });
}

function returnToBirthday() {
  const transitionSection = document.getElementById("transitionSection");
  const birthdaySection = document.getElementById("birthdaySection");

  gsap.to(transitionSection, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      transitionSection.classList.add("hidden");
      transitionSection.style.display = "none";

      birthdaySection.style.display = "flex";
      birthdaySection.style.opacity = 0;

      gsap.to(birthdaySection, {
        opacity: 1,
        duration: 0.5,
      });
    },
  });
}

function revealJourneySection() {
  const transitionSection = document.getElementById("transitionSection");
  const journeySection = document.getElementById("journeySection");

  SoundEffects.playSuccess();

  // Fade out transition
  gsap.to(transitionSection, {
    opacity: 0,
    duration: 1,
    onComplete: () => {
      transitionSection.classList.add("hidden");
      transitionSection.style.display = "none";

      // Show journey section
      journeySection.classList.remove("hidden");
      journeySection.style.opacity = 0;

      gsap.to(journeySection, {
        opacity: 1,
        duration: 1,
        onComplete: () => {
          // Show all subsequent sections
          revealAllSections();

          // Scroll to journey
          journeySection.scrollIntoView({ behavior: "smooth", block: "start" });
        },
      });
    },
  });

  // Clear dialog checkpoint
  Storage.save("dialogStep", 5);
}

function revealAllSections() {
  const sections = [
    ".journey-section",
    ".stats-section",
    ".final-year-section",
    ".drafts-section",
    ".letter-section",
    ".question-section",
  ];

  sections.forEach((selector) => {
    const section = document.querySelector(selector);
    if (section) {
      section.classList.remove("hidden");
    }
  });
}

function showResumeOption() {
  const resumePrompt = document.createElement("div");
  resumePrompt.className =
    "fixed top-24 right-6 z-50 wobbly-card bg-postit border-4 border-marker-red p-4 max-w-xs";
  resumePrompt.innerHTML = `
        <p class="font-heading text-lg mb-3">Continue where you left off?</p>
        <div class="flex gap-2">
            <button class="resume-yes dialog-btn dialog-btn-primary text-sm px-4 py-2">Yes</button>
            <button class="resume-no dialog-btn dialog-btn-secondary text-sm px-4 py-2">Start Over</button>
        </div>
    `;

  document.body.appendChild(resumePrompt);

  resumePrompt.querySelector(".resume-yes").addEventListener("click", () => {
    startTransitionDialog();
    showDialogQuestion(AppState.dialogStep);
    resumePrompt.remove();
  });

  resumePrompt.querySelector(".resume-no").addEventListener("click", () => {
    AppState.dialogStep = 0;
    Storage.save("dialogStep", 0);
    resumePrompt.remove();
  });
}

// ========================================
// SCROLL ANIMATIONS (GSAP)
// ========================================

function initScrollAnimations() {
  // Fade in elements
  gsap.utils.toArray(".fade-in-up").forEach((element) => {
    gsap.from(element, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  });

  // Timeline visualization
  ScrollTrigger.create({
    trigger: ".timeline-viz-section",
    start: "top 70%",
    onEnter: () => {
      gsap.from(".timeline-point", {
        scale: 0,
        duration: 0.5,
        stagger: 0.2,
        ease: "back.out(1.7)",
      });
    },
  });

  // Urgency card pulse
  ScrollTrigger.create({
    trigger: ".urgency-card",
    start: "top 70%",
    onEnter: () => {
      gsap.to(".urgency-card", {
        scale: 1.05,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
      });
    },
  });

  // Dashed circle reveal
  gsap.from(".dashed-circle", {
    scale: 0,
    opacity: 0,
    duration: 1.5,
    ease: "elastic.out(1, 0.5)",
    scrollTrigger: {
      trigger: ".dashed-circle",
      start: "top 70%",
    },
  });

  // Draft cards sequential reveal
  gsap.utils.toArray(".draft-card").forEach((card, index) => {
    if (index < 3) {
      gsap.from(card, {
        x: index % 2 === 0 ? -100 : 100,
        opacity: 0,
        rotation: index % 2 === 0 ? -20 : 20,
        duration: 0.6,
        delay: index * 0.2,
        scrollTrigger: {
          trigger: ".drafts-container",
          start: "top 70%",
        },
      });
    }
  });
}

// ========================================
// MEMORY CARDS ANIMATION
// ========================================

function initMemoryCards() {
  const memoryCards = document.querySelectorAll(".memory-card");

  memoryCards.forEach((card, index) => {
    ScrollTrigger.create({
      trigger: card,
      start: "top 85%",
      onEnter: () => {
        card.classList.add("animate");

        gsap.from(card, {
          rotation: index % 2 === 0 ? -5 : 5,
          duration: 0.5,
          ease: "back.out(1.7)",
        });
      },
    });

    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        rotation: index % 2 === 0 ? 1 : -1,
        scale: 1.02,
        duration: 0.3,
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        rotation: 0,
        scale: 1,
        duration: 0.3,
      });
    });
  });
}

// ========================================
// STATS COUNTER ANIMATION
// ========================================

function initStats() {
  const statCards = document.querySelectorAll(".stat-card");

  const originalValues = [];
  statCards.forEach((card) => {
    const numberElement = card.querySelector(".stat-number");
    const originalText = numberElement.textContent.trim();
    const targetNumber = parseInt(originalText.replace(/,/g, ""));

    originalValues.push({
      element: numberElement,
      target: targetNumber,
      original: originalText,
    });

    numberElement.textContent = "0";
  });

  ScrollTrigger.create({
    trigger: ".stats-section",
    start: "top 70%",
    onEnter: () => {
      statCards.forEach((card, index) => {
        card.classList.add("animate");

        const data = originalValues[index];
        const counterObj = { value: 0 };

        gsap.to(counterObj, {
          value: data.target,
          duration: 2,
          delay: index * 0.1,
          ease: "power2.out",
          onUpdate: function () {
            const current = Math.round(counterObj.value);
            data.element.textContent = current.toLocaleString();
          },
          onComplete: function () {
            data.element.textContent = data.target.toLocaleString();
          },
        });
      });
    },
  });

  statCards.forEach((card, index) => {
    const stat = card.querySelector(".wobbly-stat");

    stat.addEventListener("mouseenter", () => {
      gsap.to(stat, {
        rotation: index % 2 === 0 ? -2 : 2,
        scale: 1.05,
        duration: 0.3,
      });
    });

    stat.addEventListener("mouseleave", () => {
      gsap.to(stat, {
        rotation: 0,
        scale: 1,
        duration: 0.3,
      });
    });
  });
}

// ========================================
// LETTER REVEAL ANIMATION
// ========================================

function initLetterReveal() {
  const letterContainer = document.querySelector(".letter-container");
  const letterContent = document.querySelector(".letter-content");

  if (!letterContainer || !letterContent) return;

  ScrollTrigger.create({
    trigger: letterContainer,
    start: "top 60%",
    onEnter: () => {
      gsap.from(letterContainer, {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.from(letterContent.querySelectorAll("p"), {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.15,
        delay: 0.5,
        ease: "power2.out",
      });

      gsap.from(".coffee-stain", {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        delay: 1.5,
      });

      gsap.from(".fingerprint", {
        opacity: 0,
        rotation: -45,
        duration: 0.5,
        delay: 2,
      });
    },
  });

  const heartContainer = document.querySelector(".hand-drawn-heart");
  if (heartContainer) {
    heartContainer.addEventListener("mouseenter", () => {
      gsap.to(".eraser-mark", {
        opacity: 0,
        duration: 0.5,
      });
    });

    heartContainer.addEventListener("mouseleave", () => {
      gsap.to(".eraser-mark", {
        opacity: 1,
        duration: 0.5,
      });
    });
  }
}

// ========================================
// CAKE ICONS ANIMATION
// ========================================

function initCakeIcons() {
  ScrollTrigger.create({
    trigger: ".birthday-cakes",
    start: "top 75%",
    onEnter: () => {
      const cakes = document.querySelectorAll(".cake-icon");

      cakes.forEach((cake, index) => {
        gsap.from(cake, {
          y: 30,
          opacity: 0,
          duration: 0.4,
          delay: index * 0.05,
          ease: "back.out(1.7)",
        });
      });
    },
  });
}

// ========================================
// REPLY SYSTEM
// ========================================

function initReplySystem() {
  const messageInput = document.getElementById("messageInput");
  const charCount = document.getElementById("charCount");
  const replyForm = document.getElementById("replyForm");
  const sendButton = document.getElementById("sendButton");
  const statusMessage = document.getElementById("statusMessage");

  if (!messageInput || !charCount || !replyForm) return;

  // Character counter
  messageInput.addEventListener("input", () => {
    const count = messageInput.value.length;
    charCount.textContent = count;

    gsap.fromTo(
      charCount,
      { scale: 1.3, color: "#ff4d4d" },
      { scale: 1, color: "#2d2d2d", duration: 0.3 },
    );

    // Auto-expand
    messageInput.style.height = "auto";
    messageInput.style.height = messageInput.scrollHeight + "px";
  });

  // Form submission
  replyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = messageInput.value.trim();

    if (!message) {
      showError("Please write something first! 💭");
      return;
    }

    sendButton.disabled = true;
    sendButton.classList.add("loading");

    try {
      const response = await fetch(
        "https://dark-wave-2bc6.sivapr7223.workers.dev/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: message }),
        },
      );

      if (response.ok) {
        showSuccess();
        messageInput.value = "";
        charCount.textContent = "0";
        messageInput.style.height = "auto";
        triggerConfetti();
        SoundEffects.playSuccess();
      } else {
        showError("Message failed to send. Please try again! 🙏");
      }
    } catch (error) {
      console.error("Send error:", error);
      showError("Connection issue. Check your internet and retry! 📡");
    } finally {
      sendButton.disabled = false;
      sendButton.classList.remove("loading");
    }
  });

  function showSuccess() {
    statusMessage.classList.remove("hidden");

    const successDiv = statusMessage.querySelector(".status-success");
    const errorDiv = statusMessage.querySelector(".status-error");

    successDiv.classList.remove("hidden");
    errorDiv.classList.add("hidden");

    statusMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });

    setTimeout(() => {
      gsap.to(statusMessage, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        onComplete: () => {
          statusMessage.classList.add("hidden");
          statusMessage.style.opacity = 1;
          statusMessage.style.transform = "translateY(0)";
          successDiv.classList.add("hidden");
        },
      });
    }, 8000);
  }

  function showError(errorText) {
    statusMessage.classList.remove("hidden");

    const successDiv = statusMessage.querySelector(".status-success");
    const errorDiv = statusMessage.querySelector(".status-error");

    successDiv.classList.add("hidden");
    errorDiv.classList.remove("hidden");

    if (errorText) {
      errorDiv.querySelector("p:last-child").textContent = errorText;
    }

    statusMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });

    setTimeout(() => {
      gsap.to(statusMessage, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        onComplete: () => {
          statusMessage.classList.add("hidden");
          statusMessage.style.opacity = 1;
          statusMessage.style.transform = "translateY(0)";
          errorDiv.classList.add("hidden");
        },
      });
    }, 6000);
  }

  // Question card animation
  ScrollTrigger.create({
    trigger: ".question-card",
    start: "top 70%",
    onEnter: () => {
      gsap.from(".question-card", {
        scale: 0.9,
        rotation: -5,
        opacity: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });

      gsap.from(".open-arrow path", {
        strokeDasharray: 100,
        strokeDashoffset: 100,
        duration: 1.5,
        delay: 0.5,
        ease: "power2.out",
      });
    },
  });

  // Reply section animation
  ScrollTrigger.create({
    trigger: "#replySection",
    start: "top 70%",
    onEnter: () => {
      gsap.from("#replySection", {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.to(".instruction-card", {
        rotation: 1,
        duration: 0.3,
        yoyo: true,
        repeat: 3,
        ease: "power1.inOut",
        delay: 0.3,
      });
    },
  });
}

// ========================================
// SPEECH BUBBLE HOVER EFFECT
// ========================================

document.querySelectorAll(".speech-bubble").forEach((bubble) => {
  bubble.addEventListener("mouseenter", () => {
    if (bubble.classList.contains("empty")) {
      gsap.to(bubble, {
        opacity: 0.8,
        scale: 1.1,
        duration: 0.3,
      });
    }
  });

  bubble.addEventListener("mouseleave", () => {
    if (bubble.classList.contains("empty")) {
      gsap.to(bubble, {
        opacity: 0.4,
        scale: 1,
        duration: 0.3,
      });
    }
  });
});

// ========================================
// SMALL NOTE WOBBLE
// ========================================

ScrollTrigger.create({
  trigger: ".small-note",
  start: "top 80%",
  onEnter: () => {
    gsap.to(".small-note", {
      rotation: 1,
      duration: 0.3,
      yoyo: true,
      repeat: 3,
      ease: "power1.inOut",
    });
  },
});

// ========================================
// PARALLAX EFFECT
// ========================================

gsap.utils.toArray(".tack, .tape").forEach((element) => {
  gsap.to(element, {
    y: -20,
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });
});
