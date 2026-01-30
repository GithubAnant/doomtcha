<div align="center">
  <img src="public/doom.png" alt="Doomtcha Logo" width="300" />
</div>

<div align="center">
  <h3>Kill Ops to prove you're a human</h3>
  <br />
</div>

> <img src="doomtcha.gif" alt="Doomtcha Gameplay" width="100%" />

**Doomtcha** is a "CAPTCHA" (Completely Automated Public Turing test to tell Computers and Humans Apart) that requires users to prove they are human by slaying demons in the classic 1993 game **DOOM**, running directly in the browser via WebAssembly.

---

## 🚀 How to Try It (Super Easy)

If you have a Mac, you can get this running in 2 minutes:

### 1. Install & Build

We have a script that installs **Emscripten** (the WASM compiler) and builds the game for you:

```bash
# 1. Install Dependencies (Emscripten) & Build
./installers/install_emscriptem.sh && cd src && make
```

### 2. Run

Just serve the `public` folder:

```bash
cd public
python3 -m http.server 8000
```

Go to **[http://localhost:8000](http://localhost:8000)** and start slaying!

---

## Credits

This project wouldn't be possible without the incredible work of:

- **Thomas Van Iseghem**: Creator of **[wasmDOOM](https://github.com/VanIseghemThomas/wasmDOOM)**. His foundational port of Doom to WebAssembly is the core of this project.
- **Alex Oberhofer**: Creator of **[sdl2-doom](https://github.com/AlexOberhofer/sdl2-doom)**.
- **Id Software**: For creating DOOM, the game that runs on everything.

**Created by Anant Singhal**

---

## License

GPLv2 (Derived from Doom Source)
