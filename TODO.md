xf# React + Electron Jarvis Desktop App - TODO

## Approved Plan Steps (Progress: 0/16)

### 1. Setup Project Structure ✅ [COMPLETE]
- [x] Create TODO.md
- [x] Create `desktop/react-electron-app/package.json`
- [x] Create `desktop/react-electron-app/vite.config.js`
- [x] Create `desktop/react-electron-app/electron/main.js`
- [x] Create `desktop/react-electron-app/electron/preload.js`

### 2. Core React Structure (Components & Hooks) ✅ [IN PROGRESS]
- [x] `src/index.html`
- [x] `src/main.jsx` (React root)
- [x] `src/App.jsx`
- [x] `src/index.css` (copy style.css)
- [ ] `src/hooks/useChat.js`
- [ ] `src/hooks/useSpeech.js`
- [ ] `src/hooks/useCamera.js`
- [ ] `src/utils/api.js` (port script.js utils)
- [ ] `src/hooks/useChat.js`
- [ ] `src/hooks/useSpeech.js`
- [ ] `src/hooks/useCamera.js`
- [ ] `src/utils/api.js` (port script.js utils)

### 3. Components (Port Frontend UI)
- [x] `src/components/Header.jsx`

- [x] `src/components/ChatArea.jsx`

- [x] `src/components/InputBar.jsx`

- [ ] `src/components/ActivityPanel.jsx`
- [ ] `src/components/CameraPanel.jsx`
- [x] `src/components/Orb.jsx` (WebGL)

### 4. Assets & Copy
- [x] Copy `Frontend/audio/` to `public/audio/` 
- [x] Copy `Frontend/orb.js` to `src/utils/orb.js`
- [ ] Update paths in components

### 5. Electron Integration
- [x] `electron-builder.yml`

- [ ] Scripts in package.json (dev/build/dist)

### 6. Testing & Packaging
- [ ] `npm install`
- [ ] Test Vite dev server
- [ ] Test Electron dev
- [ ] Build & package .exe

**Next: Create package.json**

**Status**: Planning complete. Awaiting file creations.


# Terminal 1: Backend (root dir)
python run.py

# Terminal 2: Install & Dev
cd desktop/react-electron-app
npm i --legacy-peer-deps
npm run dev

# Terminal 3: Electron (same dir)
npm run electron:dev

# Package .exe
npm run dist
