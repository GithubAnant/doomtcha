import Module from "../wasm/wasm-doom.js";

const WAD_URL = "./doom1.wad";

let canvasWrapper = document.getElementById("canvas-wrapper");
let canvas = document.getElementById("canvas");
canvas.width = 320;
canvas.height = 200;
canvas.style.cursor = "none";
canvasWrapper.style.display = "none";

// WebGL context lost handler
canvas.addEventListener(
  "webglcontextlost",
  (e) => {
    alert("WebGL context lost. You will need to reload the page.");
    e.preventDefault();
  },
  false,
);

// Module configuration
let module_args = {
  canvas: canvas,
  locateFile: (remote_package_base, _) => {
    return "wasm/" + remote_package_base;
  },
};

// Validate WAD file
function validateWadFile(buffer) {
  if (buffer.length === 0 || buffer.length < 4) {
    console.error("Empty buffer");
    return false;
  }
  if (
    String.fromCharCode(buffer[0], buffer[1], buffer[2], buffer[3]) !== "IWAD"
  ) {
    console.error("Invalid WAD file");
    return false;
  }
  return true;
}

// Initialize the Doom module
const doom = await Module(module_args);

// UI Elements
const captchaBox = document.getElementById("captcha-box");
const checkboxWrapper = document.getElementById("checkbox-wrapper");
const spinner = document.getElementById("spinner");
const checkmark = document.getElementById("checkmark");

let isVerifying = false;

// Load and start Doom - called AFTER spinner animation
function LoadDoom(buffer) {
  if (!validateWadFile(buffer)) {
    console.error("Invalid WAD file");
    resetCheckbox();
    return;
  }

  // Hide captcha, show canvas
  checkboxWrapper.classList.remove("loading");
  captchaBox.style.display = "none";
  canvasWrapper.style.display = "flex";
  canvas.style.display = "block"; // Ensure canvas itself is visible
  canvas.focus();

  setTimeout(() => {
    // Write WAD file to virtual filesystem and start the game
    doom.FS.writeFile("/doom-data.wad", buffer);
    doom.callMain(["-iwad", "doom-data.wad", "-skill", "3", "-warp", "1", "1"]);
  }, 100);
}

// Global handler for Doom events
window.onDoomKill = function () {
  if (!isVerifying) return; // Prevent triggering if not in verification mode
  console.log("DOOMTCHA: Enemy Killed! User Verified.");

  // 1. Show "wow you actually did it" overlay
  const overlay = document.createElement("div");
  overlay.innerText = "WOW YOU ACTUALLY DID IT"; // All caps
  overlay.style.position = "absolute";
  overlay.style.top = "20px";
  overlay.style.left = "20px";
  overlay.style.color = "#ff0000"; // Red
  overlay.style.fontFamily = "'Courier New', Courier, monospace";
  overlay.style.fontSize = "32px"; // Larger
  overlay.style.lineHeight = "1";
  overlay.style.fontWeight = "bold";
  overlay.style.textShadow = "3px 3px 0px #000"; // Hard shadow
  overlay.style.zIndex = "9999"; // Very high z-index
  overlay.style.pointerEvents = "none";
  overlay.style.whiteSpace = "nowrap"; // Prevent wrapping

  const canvasWrapper = document.getElementById("canvas-wrapper");
  canvasWrapper.appendChild(overlay);

  // 2. Wait 3-4 seconds before switching UI
  setTimeout(() => {
    // Switch UI back to verified state
    canvasWrapper.style.display = "none";
    captchaBox.style.display = "flex";

    // Add checked class to trigger animation
    checkboxWrapper.classList.add("checked");
    isVerifying = false;

    // Attempt to pause the game loop to save resources
    try {
      if (doom && doom.pauseMainLoop) {
        doom.pauseMainLoop();
      }
    } catch (e) {
      console.log("Could not pause loop", e);
    }

    // Redirect to success page after a short delay (for the tick animation to play)
    setTimeout(() => {
      window.location.href = "./success.html";
    }, 1500);
  }, 4000); // 4 seconds delay
};

// Reset checkbox to initial state
function resetCheckbox() {
  isVerifying = false;
  checkboxWrapper.classList.remove("loading", "checked");
}

// Start verification process
function startVerification() {
  if (isVerifying) return;
  isVerifying = true;

  // Step 1: Show loading spinner (like real reCAPTCHA)
  checkboxWrapper.classList.add("loading");

  // Step 2: Fetch the WAD file while showing spinner
  fetch(WAD_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load WAD file");
      }
      return response.arrayBuffer();
    })
    .then((arrBuffer) => {
      // Minimum spinner time for visual feedback (like real reCAPTCHA)
      // WAD might load fast, but we want to show the spinner for at least 1.5s
      setTimeout(() => {
        let buffer = new Uint8Array(arrBuffer);
        LoadDoom(buffer);
      }, 1500);
    })
    .catch((err) => {
      console.error("Error loading WAD:", err);
      alert("Failed to load game. Please refresh and try again.");
      resetCheckbox();
    });
}

// Captcha checkbox click handler
checkboxWrapper.addEventListener("click", startVerification);

// Fullscreen change handler
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    console.log("Application exited fullscreen mode");
    canvasWrapper.style.display = "none";
    captchaBox.style.display = "flex";
    resetCheckbox();
  }
});
