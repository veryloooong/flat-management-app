# Flat management app in Typescript + Tauri

This is a desktop app to manage flat details and fees. Made for school, class HUST/IT3180.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Project structure

- `migration`: Handles database migrations.
- `src`: Contains front-end source.
- `src-tauri`: Contains back-end source.
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

npm run tauri build # For deployment
```

- Run the server:

```bash
cd it3180-app-webserver && shuttle run
```

## Credits

- This app was created from the [create-tauri-app template](https://tauri.app).
- Makes use of the [shadcn/ui library](https://ui.shadcn.com/) and the [TanStack router](https://tanstack.com/).
