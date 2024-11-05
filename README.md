# Flat management app in Typescript + Tauri

This is a desktop app to manage flat details and fees. Made for school, class HUST/IT3180.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Project structure

- `migration`: Handles database migrations.
- `src`: Contains front-end source.
- `src-tauri`: Contains back-end source.
- `webserver`: Contains source for server.

## Development instructions

### Prerequisites

- A Node.js installation. Install Node.js via the [Node Version Manager](https://github.com/nvm-sh/nvm).
- Rustup. Install via [`rustup.rs`](https://rustup.rs/).
- A PostgreSQL instance running. Install via the [official site](https://www.postgresql.org/download/).

### Steps

- Clone the repo to local machine.
```bash
git clone https://github.com/veryloooong/flat-management-app && cd flat-management-app
```
- Install dependencies for the application and the database.
```bash
npm install
cargo install sea-orm-cli # for db migration
cargo install --locked bacon # for watching
```
- Make an `.env` file, with keys following the `.env.example` file.
- Initiate database migration.
```bash
sea-orm-cli migrate refresh
```
- Run in dev mode: `npm run tauri dev`
- Build for prod: `npm run tauri build`
- Run the webserver:
  - Go to webserver directory: `cd webserver`
  - Run the server: `bacon run`

## Credits

- This app was created from the [create-tauri-app template](https://tauri.app).
- Makes use of the [shadcn/ui library](https://ui.shadcn.com/) and the [TanStack router](https://tanstack.com/).