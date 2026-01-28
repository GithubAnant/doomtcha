import Module from "../wasm/wasm-doom.js";

const WAD_URL = "./doom1.wad";

let canvas = document.getElementById("canvas");
canvas.width = 320;
canvas.height = 200;
canvas.style.cursor = "none";
canvas.style.display = "none";

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

  // Now show the checkmark (verification complete)
  checkboxWrapper.classList.remove("loading");
  checkboxWrapper.classList.add("checked");

  // Brief delay to show checkmark, then launch Doom
  setTimeout(() => {
    captchaBox.style.display = "none";
    canvas.style.display = "block";

    // Write WAD file to virtual filesystem and start the game
    doom.FS.writeFile("/doom-data.wad", buffer);
    doom.callMain(["-iwad", "doom-data.wad"]);
  }, 600);
}

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
    canvas.style.display = "none";
    captchaBox.style.display = "flex";
    resetCheckbox();
  }
});
