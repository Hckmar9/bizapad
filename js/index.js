document.addEventListener("DOMContentLoaded", function () {
  const soundButtons = document.querySelectorAll("#sound-pad button");
  let recording = false;
  let recordStartTime;
  let recordedSounds = [];

  const recordButton = document.getElementById("record");
  const playButton = document.getElementById("play");
  const resetButton = document.getElementById("reset");

  soundButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const audio = document.querySelector(
        `audio[data-key="${button.getAttribute("data-key")}"]`
      );
      playAndRecord(audio, button.getAttribute("data-key"));
    });
  });

  window.addEventListener("keydown", function (e) {
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    const button = document.querySelector(`button[data-key="${e.keyCode}"]`);
    if (button) {
      button.classList.add("playing");
      playAndRecord(audio, e.keyCode);
    }
  });

  function playAndRecord(audio, key) {
    if (audio) {
      audio.currentTime = 0;
      audio.play();
      if (recording) {
        recordedSounds.push({
          key: key,
          timestamp: Date.now() - recordStartTime,
        });
        updateTimeline(); // Update timeline whenever a sound is recorded
      }
    }
  }

  recordButton.addEventListener("click", function () {
    recording = !recording;
    if (recording) {
      recordStartTime = Date.now();
      recordedSounds = [];
      this.textContent = "Stop (R)";
      playButton.disabled = true;
    } else {
      this.textContent = "Record (R)";
      playButton.disabled = false;
      updateTimeline(); // Update timeline when recording stops
    }
  });

  playButton.addEventListener("click", function () {
    recordedSounds.forEach((sound) => {
      setTimeout(() => {
        const audio = document.querySelector(`audio[data-key="${sound.key}"]`);
        if (audio) {
          audio.currentTime = 0;
          audio.play();
        }
      }, sound.timestamp);
    });
  });

  resetButton.addEventListener("click", function () {
    recordedSounds = [];
    recording = false;
    recordButton.textContent = "Record (R)";
    playButton.disabled = false;
    updateTimeline(); // Clear timeline visually when reset
  });

  soundButtons.forEach((button) => {
    button.addEventListener("transitionend", function (e) {
      if (e.propertyName === "transform") {
        this.classList.remove("playing");
      }
    });
  });

  function updateTimeline() {
    const timeline = document.getElementById("timeline");
    timeline.innerHTML = "";
    let lastOffset = 0;

    recordedSounds.forEach((sound) => {
      const soundClip = document.createElement("div");
      soundClip.className = "sound-clip";
      soundClip.style.width = "20px";
      soundClip.style.left = `${lastOffset}px`;
      soundClip.style.backgroundColor = getColorForSound(sound.key);
      timeline.appendChild(soundClip);
      lastOffset += 25;
    });
  }
  // WiP - Ech time a button is tapped, a different color should be displayed
  function getColorForSound(key) {
    const colorMap = {
      83: "#ff4757", // Clap
      68: "#ffa502", // Hi-Hat
      70: "#ff7f50", // Kick
      65: "#70a1ff", // Open-Hat
      71: "#7bed9f", // Boom
      72: "#5352ed", // Ride
      74: "#1e90ff", // Snare
      75: "#2ed573", // Tom
      76: "#3742fa", // Tink
    };
    return colorMap[key] || "#000";
  }
});
