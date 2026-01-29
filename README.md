# Doomtcha

**Doomtcha** is a "CAPTCHA" (Completely Automated Public Turing test to tell Computers and Humans Apart) that requires users to prove they are human by slaying demons in the classic 1993 game **DOOM**, running directly in the browser via WebAssembly.

<div align="center">
  <img src="public/logo.png" alt="Doomtcha Logo" width="200" />
</div>

## About

This project is an experiment in "proof-of-work" UI. Instead of clicking traffic lights or typing warped text, users must demonstrate their demon-slaying capabilities. It runs a port of the original Doom engine compiled to WebAssembly (WASM), allowing it to run smoothly in modern web browsers.

## Credits

This project stands on the shoulders of giants:

- **Anant Singhal**: Creator of **Doomtcha** (Web UI, CAPTCHA logic, and integration).
- **Thomas Van Iseghem**: Creator of [wasmDOOM](https://github.com/VanIseghemThomas/wasmDOOM), the foundational WASM port this project is built upon.
- **Alex Oberhofer**: Creator of [sdl2-doom](https://github.com/AlexOberhofer/sdl2-doom), which wasmDOOM is based on.
- **Id Software**: The legends who created DOOM.

## License

This project is licensed under the **GNU General Public License v2.0 (GPLv2)**. See the [LICENSE](LICENSE) file for details.
This license is required as this project derives from the original DOOM source code.

---

## Building

### Dependencies (not relevant when using Docker)

- make
- emscripten
- SDL2

The easy way is to go to `installers` and run:

```bash
install_deps_<target-platform>.sh
```

Or you can do the manual way below:

### Emscripten

From the [official docs](https://emscripten.org/docs/getting_started/downloads.html):

```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
```

### SDL 2 (MacOS)

```bash
brew install SDL2
brew install SDL2_image
brew install SDL2_ttf
```

## Compile

### Using Docker

The build script will take care of everything.

```bash
./build.sh
```

### Locally

To build the project simply run:

```bash
cd src && make
```

Then you can host a simple web server to serve the page. I always use a simple python module for this:

## Serving

```bash
cd public
python3 -m http.server 8000
```

Now Doomtcha should be available on `http://localhost:8000`

## Limitations

- No support for audio (yet)
- No controller support (only tested on mobile/desktop keyboard)
- Persistent save between reloads
- Project build only tested and developed on MacOS
