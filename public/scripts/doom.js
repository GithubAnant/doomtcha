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

// Load and start Doom
function LoadDoom(buffer) {
  if (!validateWadFile(buffer)) {
    console.error("Invalid WAD file");
    return;
  }

  // Hide captcha box, show canvas
  const captchaBox = document.getElementById("captcha-box");
  captchaBox.style.display = "none";
  canvas.style.display = "block";

  // Write WAD file to virtual filesystem and start the game
  doom.FS.writeFile("/doom-data.wad", buffer);
  doom.callMain(["-iwad", "doom-data.wad"]);
}

// Start Doomtcha: load the WAD and run
function startDoomtcha() {
  fetch(WAD_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load WAD file");
      }
      return response.arrayBuffer();
    })
    .then((arrBuffer) => {
      let buffer = new Uint8Array(arrBuffer);
      LoadDoom(buffer);
    })
    .catch((err) => {
      console.error("Error loading WAD:", err);
      alert("Failed to load game. Please refresh and try again.");
    });
}

// Captcha checkbox click handler
const checkboxWrapper = document.getElementById("checkbox-wrapper");
const checkbox = document.getElementById("captcha-checkbox");

checkboxWrapper.addEventListener("click", () => {
  // Add loading state
  checkboxWrapper.classList.add("loading");
  checkbox.textContent = "";

  // Short delay for visual feedback, then start Doom
  setTimeout(() => {
    checkboxWrapper.classList.remove("loading");
    checkbox.classList.add("checked");

    // Start Doom after showing checkmark briefly
    setTimeout(() => {
      startDoomtcha();
    }, 300);
  }, 500);
});

// Fullscreen change handler
document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) {
    console.log("Application is now in fullscreen mode");
  } else {
    console.log("Application exited fullscreen mode");
    canvas.style.display = "none";
    document.getElementById("captcha-box").style.display = "flex";
  }
});
