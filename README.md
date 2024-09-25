# Flat management app in Typescript + Tauri

This is a desktop app to manage flat details and fees. Made for school, class HUST/IT3180.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Project structure

- `migration`: Handles database migrations.
- `src`: Contains front-end source.
- `src-tauri`: Contains back-end source.

## Development instructions

### Prerequisites

- A Node.js installation
- Rustup

### Steps

- Clone the repo to local machine.
```bash
git clone https://github.com/veryloooong/flat-management-app && cd flat-management-app
```
- Install dependencies.
```bash
npm install
```
- Run in dev mode: `npm run tauri dev`
- Build for prod: `npm run tauri build`

## Credits

This app was created from the [create-tauri-app template](https://tauri.app).