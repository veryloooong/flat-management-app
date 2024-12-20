# Flat management app in Typescript + Tauri

This is a desktop app to manage flat details and fees. Made for school, class HUST/IT3180.

## Installation

Go to the [releases](https://github.com/veryloooong/flat-management-app/releases/latest) tab to download the latest version.

- For Windows, download the `x64-setup.exe` or `x64_en-US.msi` file.
- For MacOS, download the `universal.dmg` file.
- For Linux, download the `.AppImage` file.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Project structure

- `migration`: Handles database migrations.
- `src`: Contains source for application interface.
- `src-tauri`: Contains source for application logic.
- `it3180-app-webserver`: Contains source for webserver.

## Development instructions

### Prerequisites

- Install [Node JS](https://nodejs.org/en)
- Install [PostgreSQL](https://www.postgresql.org/download/)
- Install [Rustup](https://rustup.rs/)

### Steps

- Clone the repo to local machine.

```bash
git clone https://github.com/veryloooong/flat-management-app && cd flat-management-app
```

- Install dependencies for the application and the database.

```bash
npm install
cargo install sea-orm-cli # for db migration
cargo install cargo-shuttle # for backend

# for ubuntu only:
sudo apt-get update && sudo apt-get install libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
```

- Make an `.env` file, with keys following the `.env.example` file.
- Go to `it3180-app-webserver` folder.
  - Copy the `Secrets.toml.example` files to `Secrets.dev.toml` file. Add the secrets as appropriate.
- Initiate database migration.

```bash
sea-orm-cli migrate refresh
```

- Run the client:

```bash
npm run tauri dev # For development
```

- Run the server:

```bash
cd it3180-app-webserver && shuttle run
```

## Building and deploying to your own server

### Prerequisites

- The same as the development instructions.
- Register an account on [Shuttle](https://shuttle.dev/).

### Steps

- Build the client.

```bash
npm run tauri build
```

- Make a `Secrets.toml` file, following the `Secrets.toml.example` file.
- Install the `shuttle` CLI and log in.

```bash
cargo install cargo-shuttle
shuttle login
```

- Deploy the webserver, enter details if needed.

```bash
cd it3180-app-webserver && shuttle deploy
```

- Go to the [console](https://console.shuttle.dev/), select your running project. Go to `Resources > Database`, copy the connection URL. Initiate database migration:

```bash
cd ..
sea-orm-cli migrate refresh --database-url <CONNECTION_STRING>
```

## Credits

- This app was created from the [create-tauri-app template](https://tauri.app).
- Makes use of the [shadcn/ui library](https://ui.shadcn.com/) and the [TanStack router](https://tanstack.com/).
- Deployed on the [Shuttle platform](https://shuttle.dev/).
