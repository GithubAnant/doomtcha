<div align="center">
  <img src="public/doom.png" alt="Doomtcha Logo" width="300" />
</div>

<div align="center">
  <h3>Kill Ops to prove you're a human</h3>
  <br />
</div>

> <img src="doomtcha.gif" alt="Doomtcha Gameplay" width="100%" />

**Doomtcha** is a "CAPTCHA" that requires users to prove they are human by slaying demons in the classic 1993 game **DOOM**.

---

## Build & Run

### 1. Install Dependencies & Compile

This script installs Emscripten (WASM compiler) and builds the project.

```bash
./installers/install_emscriptem.sh && cd src && make
```

### 2. Run

Serve the `public` directory.

```bash
cd public
python3 -m http.server 8000
```

Visit **[http://localhost:8000](http://localhost:8000)**.

---

## Credits

- **Thomas Van Iseghem**: Creator of [wasmDOOM](https://github.com/VanIseghemThomas/wasmDOOM) (Base WASM Port)
- **Alex Oberhofer**: Creator of [sdl2-doom](https://github.com/AlexOberhofer/sdl2-doom)
- **Id Software**: Creators of DOOM

**Created by Anant Singhal**

---

## License

GPLv2 (Derived from Doom Source)
