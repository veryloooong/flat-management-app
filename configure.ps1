# Function to initiate development environment
function Start-Development {
  Write-Output "Installing prerequisites..."

  # Install Rustup
  if (-not (Get-Command rustup.exe -ErrorAction SilentlyContinue)) {
    Write-Output "Rustup not found. Downloading..."
    Invoke-WebRequest -Uri "https://static.rust-lang.org/rustup/dist/x86_64-pc-windows-msvc/rustup-init.exe" -OutFile $env:TEMP\rustup-init.exe
    Start-Process -FilePath $env:TEMP\rustup-init.exe -ArgumentList @("--verbose", "--default-host", "x86_64-pc-windows-gnu", "--default-toolchain", "stable") -Wait -ErrorAction Stop
    Write-Output "Rustup installed"
  }
  else {
    Write-Output "Rustup already installed"
  }

  # Install Node.js
  if (-not (Get-Command node.exe -ErrorAction SilentlyContinue)) {
    Write-Output "Node not found. Downloading..."
    Invoke-WebRequest -Uri "https://nodejs.org/dist/v20.17.0/node-v20.17.0-x64.msi" -OutFile $env:TEMP\node-installer.msi
    msiexec.exe /i $env:TEMP\node-installer.msi /quiet /norestart
    Write-Output "Node installed"
  }
  else {
    Write-Output "Node already installed"
  }

  # Install PostgreSQL
  if (-not (Get-Command psql.exe -ErrorAction SilentlyContinue)) {
    Write-Output "PostgreSQL not found. Downloading..."
    Invoke-WebRequest -Uri "https://sbp.enterprisedb.com/getfile.jsp?fileid=1259129" -OutFile $env:TEMP\postgresql-installer.exe
    Write-Output "Follow the installer instructions to install PostgreSQL"
    Start-Process -FilePath $env:TEMP\postgresql-installer.exe -Wait -ErrorAction Stop
    Write-Output "PostgreSQL installed"
  }
  else {
    Write-Output "PostgreSQL already installed"
  }

  # Done
  Write-Output "Prerequisites installed"
  Write-Output "Configure the database connection: https://www.guru99.com/postgresql-create-alter-add-user.html"
  Write-Output "Edit the .env file to configure the database connection"
  Write-Output "Run 'Start-Migration' to migrate the database and generate the entities"
}

# Function to automatically add function to migrate the DB and generate the entities
function Start-Migration {
  # Check if the sea-orm-cli is installed
  if (-not (Get-Command sea-orm-cli.exe -ErrorAction SilentlyContinue)) {
    Write-Output "sea-orm-cli.exe not found. Downloading..."
    cargo.exe install sea-orm-cli
  }

  # Migrate
  Write-Output "Migrating the database..."
  sea-orm-cli.exe migrate refresh

  # Generate entities
  Write-Output "Generating entities..."
  sea-orm-cli.exe generate entity -o './src-tauri/src/entities' --with-serde=both --enum-extra-attributes 'serde(rename_all = "snake_case")'
  sea-orm-cli.exe generate entity -o './webserver/src/entities' --with-serde=both --enum-extra-attributes 'serde(rename_all = "snake_case")'
  
  Write-Output "Migration and entity generation completed"
}