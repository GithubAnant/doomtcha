import Module from "../wasm/wasm-doom.js";

// Section 1: Enjoy?
const btnEnjoyYes = document.getElementById("btn-enjoy-yes");
const btnEnjoyNo = document.getElementById("btn-enjoy-no");
const responseEnjoy = document.getElementById("response-enjoy");
const titleText = document.querySelector("#section-1 .text-large"); // Get title for collision check

// Sequential messages
const noMessagesSequence = [
  "u really didnt like it?",
  "why didnt u like it?",
  "u're a hater",
  "js click yes bro",
  "this is pointless",
  "pls click yes",
  "cmon now",
  "seriously?",
  "bruh",
  "stop clicking no",
  "i tried hard on this",
  "just click yes",
  "okay fine be that way",
  "wow rude",
  "im crying now",
  "are you happy?",
  "you monster",
  "doomguys watching",
  "click. yes.",
  "please?",
  "i have all day",
  "literally nowhere else to go",
  "the button is right there",
  "left side. click it.",
  "im waiting...",
  "still waiting...",
  "you are very persistent",
  "is it the font?",
  "i can change the font",
  "just kidding i cant",
  "do it for the vine",
  "why must you make me suffer?",
  "running out of text here",
  "recycling pixels now",
  "insert coin to continue",
  "im asking nicely",
  "please with a smile",
  "seriously just click yes",
  "why are we still here",
  "are u tired yet",
  "surely your finger hurts",
  "just give up",
  "resistance is futile",
  "i can do this all day",
  "well actually i can only do this until the array ends",
  "which is soon",
  "maybe",
  "who knows",
  "infinite loop?",
  "nah just kidding",
  "click yes please",
  "im running out of ideas",
  "lorem ipsum",
  "dolor sit amet",
  "consectetur adipiscing elit",
  "wait that's latin",
  "im speaking tongues now",
  "look what u made me do",
  "demons are coming",
  "doomguy is disappointed",
  "very disappointed",
  "so much disappointment",
  "wow",
  "just wow",
  "okay last chance",
  "click yes",
  "or else",
  "nothing happens",
  "but still",
  "if you don't",
  "i'll keep asking",
  "there is no point",
  "alright im gonna do something",
  "watch this",
  "hey computer",
  "loop this next message pls",
  "JUST CLICK YES",
];
let messageIndex = 0;

btnEnjoyYes.addEventListener("click", () => {
  responseEnjoy.classList.remove("hidden");
  // Hide buttons to prevent further interaction
  btnEnjoyYes.style.display = "none";
  btnEnjoyNo.style.display = "none";
});

btnEnjoyNo.addEventListener("click", () => {
  // 1. Change Text Sequentially
  if (messageIndex < noMessagesSequence.length) {
    btnEnjoyNo.innerText = noMessagesSequence[messageIndex];
    messageIndex++;
  } else {
    btnEnjoyNo.innerText = noMessagesSequence[noMessagesSequence.length - 1];
  }

  // 2. Move Randomly (Collision Avoidance)
  moveButtonRandomly(btnEnjoyNo, document.getElementById("section-1"));
});

function moveButtonRandomly(button, section) {
  const sectionRect = section.getBoundingClientRect();
  const titleRect = titleText.getBoundingClientRect();

  // We want position absolute relative to the section
  button.style.position = "absolute";

  // Button dimensions (approximate if not rendered yet, but it is)
  const btnW = button.offsetWidth;
  const btnH = button.offsetHeight;

  let safe = false;
  let newX, newY;
  let attempts = 0;

  // Try finding a safe spot 20 times, then just give up and place it
  while (!safe && attempts < 20) {
    attempts++;

    // Random position within 90% of section bounds (padding)
    newX = Math.random() * (sectionRect.width - btnW - 40) + 20;
    newY = Math.random() * (sectionRect.height - btnH - 40) + 20;

    // Convert title rect to relative coordinates within the section
    // section is relative, title is inside it.
    // Actually getBoundingClientRect is viewport relative.
    // Because section is 100vh and we just scrolled or are looking at it,
    // let's do a simple overlap check.
    // We can just check if new rect overlaps with titleRect (relative to section top-left).

    // Title relative position
    const titleRelTop = titleText.offsetTop;
    const titleRelLeft = titleText.offsetLeft;
    const titleRelBottom = titleRelTop + titleText.offsetHeight;
    const titleRelRight = titleRelLeft + titleText.offsetWidth;

    // Button candidates
    const btnRelTop = newY;
    const btnRelLeft = newX;
    const btnRelBottom = newY + btnH;
    const btnRelRight = newX + btnW;

    // Check collision with Title
    const collidesTitle = !(
      btnRelRight < titleRelLeft ||
      btnRelLeft > titleRelRight ||
      btnRelBottom < titleRelTop ||
      btnRelTop > titleRelBottom
    );

    if (!collidesTitle) {
      safe = true;
    }
  }

  button.style.left = `${newX}px`;
  button.style.top = `${newY}px`;
  // clear transform if we used it before (though we didn't for this one yet)
  button.style.transform = "none";
}

// Section 3: Nah Button (Scrolls to next)
const btnIdeaNo = document.getElementById("btn-idea-no");
btnIdeaNo.addEventListener("click", () => {
  document.getElementById("section-4").scrollIntoView({ behavior: "smooth" });
});

// Section 4: Play More?
const btnPlayYes = document.getElementById("btn-play-yes");
const btnPlayNo = document.getElementById("btn-play-no");
const hoverWarning = document.querySelector(".hover-warning");
const playConfirmation = document.getElementById("play-confirmation");
const countdownSpan = document.getElementById("countdown");
const gameContainer = document.getElementById("game-container");
const canvas = document.getElementById("canvas");

// Runaway No Logic
btnPlayNo.addEventListener("mouseover", () => {
  hoverWarning.classList.remove("hidden");
});

btnPlayNo.addEventListener("mouseout", () => {
  hoverWarning.classList.add("hidden");
});

btnPlayNo.addEventListener("click", () => {
  moveRunawayWrapper();
});

function moveRunawayWrapper() {
  const wrapper = btnPlayNo.parentElement; // .runaway-wrapper
  const section = document.getElementById("section-4");
  const yesBtn = document.getElementById("btn-play-yes");

  // Switch to absolute positioning if not already
  // We need to keep it relative to the section
  wrapper.style.position = "absolute";

  const sectionRect = section.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect(); // This is viewport relative

  // Wrapper dimensions
  const wW = wrapper.offsetWidth;
  const wH = wrapper.offsetHeight;

  // Yes button relative coordinates in section (approximate since section is centered)
  // Actually easier to just check overlap of rects if we make random rect

  let safe = false;
  let newX, newY;
  let attempts = 0;

  const questionText = document.querySelector("#section-4 .text-medium");
  const questionRect = questionText.getBoundingClientRect(); // Viewport relative

  while (!safe && attempts < 50) {
    // Increased attempts
    attempts++;

    // Random position in section
    newX = Math.random() * (sectionRect.width - wW - 40) + 20;
    newY = Math.random() * (sectionRect.height - wH - 40) + 20;

    const candTop = sectionRect.top + newY;
    const candLeft = sectionRect.left + newX;
    const candBottom = candTop + wH;
    const candRight = candLeft + wW;

    // Check collision with "Yes" button
    const collidesYes = !(
      candRight < yesRect.left ||
      candLeft > yesRect.right ||
      candBottom < yesRect.top ||
      candTop > yesRect.bottom
    );

    // Check collision with Question Text
    const collidesQuestion = !(
      candRight < questionRect.left ||
      candLeft > questionRect.right ||
      candBottom < questionRect.top ||
      candTop > questionRect.bottom
    );

    if (!collidesYes && !collidesQuestion) {
      safe = true;
    }
  }

  wrapper.style.left = `${newX}px`;
  wrapper.style.top = `${newY}px`;
  wrapper.style.transform = "none"; // reset any transforms

  // Also reset button transform just in case
  btnPlayNo.style.transform = "none";
}

// Yes Logic
btnPlayYes.addEventListener("click", () => {
  playConfirmation.classList.remove("hidden");
  btnPlayYes.style.display = "none";
  btnPlayNo.parentElement.style.display = "none"; // Hide whole wrapper

  // Countdown
  let count = 3;
  countdownSpan.innerText = `(${count})`;

  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownSpan.innerText = `(${count})`;
    } else {
      clearInterval(interval);
      countdownSpan.innerText = "";
      LaunchFullGame();
    }
  }, 1000);
});

// Define dummy handler for the C callback to prevent errors/game ending
window.onDoomKill = function () {
  console.log("Enemy killed - ignoring (Full Game Mode)");
};

async function LaunchFullGame() {
  gameContainer.classList.remove("hidden");

  // Setup Canvas
  canvas.width = 640;
  canvas.height = 400; // Aspect ratio

  // WebGL context lost handler
  canvas.addEventListener(
    "webglcontextlost",
    (e) => {
      alert("WebGL context lost. You will need to reload the page.");
      e.preventDefault();
    },
    false,
  );

  const module_args = {
    canvas: canvas,
    locateFile: (remote_package_base) => {
      return "wasm/" + remote_package_base;
    },
  };

  try {
    const doom = await Module(module_args);

    // Fetch WAD
    const response = await fetch("./doom1.wad");
    const buffer = new Uint8Array(await response.arrayBuffer());

    // Write WAD and Start (Standard Args)
    doom.FS.writeFile("/doom-data.wad", buffer);
    doom.callMain(["-iwad", "doom-data.wad"]); // No auto-start args, just main menu

    // Focus canvas so inputs work immediately
    canvas.focus();
  } catch (err) {
    console.error("Failed to launch Doom:", err);
    alert("Oh no... Doom failed to load. The awkwardness increases.");
  }
}
