// "Add to cart" effect: a small copy of the item shrinks and flies to the cart in the menu, with a sound.
// The sound is made in the browser with the Web Audio API, so there are no sound files.
const SOUND_KEY = "amirstroy_sound";
const FLY_TIME = 750;
let audioContext = null;

function isSoundOn() {
  return readJSON(SOUND_KEY, "on") !== "off";
}

function getAudioContext() {
  if (audioContext === null) {
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioClass) {
      return null;
    }
    audioContext = new AudioClass();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

// One short tone that slides from one pitch to another and fades out
function playTone(fromHz, toHz, delay, duration, type, volume) {
  const context = getAudioContext();
  if (context === null) {
    return;
  }
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const start = context.currentTime + delay;
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(fromHz, start);
  oscillator.frequency.exponentialRampToValueAtTime(toHz, start + duration);
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

// A falling "whoosh" while the item flies, then a bright "ding" when it lands in the cart
function playAddSound() {
  if (!isSoundOn()) {
    return;
  }
  playTone(900, 260, 0, FLY_TIME / 1000, "triangle", 0.1);
  playTone(1175, 1175, FLY_TIME / 1000, 0.3, "sine", 0.12);
  playTone(1760, 1760, FLY_TIME / 1000, 0.2, "sine", 0.04);
}

// The cart link in the menu; on a phone the menu is closed, so the menu button is the target
function findCartTarget() {
  const cartLink = document.querySelector('.site-nav a[href="contacts.html"]');
  if (cartLink && cartLink.getBoundingClientRect().width > 0) {
    return cartLink;
  }
  return document.querySelector(".navbar-toggler");
}

function flyToCart(source, imageUrl) {
  playAddSound();
  const target = findCartTarget();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (target === null || reduced) {
    bumpCartBadge();
    return;
  }

  const from = source.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const size = 64;
  const chip = $('<div class="fly-chip" aria-hidden="true"></div>');
  if (imageUrl) {
    chip.css("background-image", 'url("' + imageUrl + '")');
  }
  chip.css({
    left: from.left + from.width / 2 - size / 2,
    top: from.top + from.height / 2 - size / 2,
    width: size,
    height: size
  });
  $("body").append(chip);

  chip.animate({
    left: to.left + to.width / 2 - 7,
    top: to.top + to.height / 2 - 7,
    width: 14,
    height: 14,
    opacity: 0.3
  }, FLY_TIME, "swing", function () {
    chip.remove();
    bumpCartBadge();
    $(target).addClass("cart-pulse");
    setTimeout(function () { $(target).removeClass("cart-pulse"); }, 450);
  });
}

// Sound on/off button in the footer; the choice is remembered
const soundButton = document.getElementById("sound-toggle");

function showSoundState() {
  soundButton.textContent = isSoundOn() ? "Sound: on" : "Sound: off";
  soundButton.setAttribute("aria-pressed", isSoundOn());
}

if (soundButton) {
  showSoundState();
  soundButton.addEventListener("click", function () {
    writeJSON(SOUND_KEY, isSoundOn() ? "off" : "on");
    showSoundState();
    if (isSoundOn()) {
      playTone(880, 1320, 0, 0.15, "sine", 0.1);
    }
  });
}
