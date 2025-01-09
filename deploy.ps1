# Ścieżka do katalogu projektu
$ProjectDir = "C:\Users\admin\Documents\vsc_projects\tasker"

# Nazwa logu i źródła w dzienniku zdarzeń
$LogName = "Application"
$SourceName = "DockerDeploy"

# Rejestracja źródła w logu systemowym (jeśli jeszcze nie istnieje)
if (-not (Get-EventLog -LogName $LogName -Source $SourceName -ErrorAction SilentlyContinue)) {
    New-EventLog -LogName $LogName -Source $SourceName
}

# Funkcja do logowania zdarzeń
function Log-Event {
    param (
        [string]$Message,
        [string]$EntryType = "Information" # Możliwe: Information, Warning, Error
    )
    Write-EventLog -LogName $LogName -Source $SourceName -EntryType $EntryType -EventId 1000 -Message $Message
}

# Rozpoczęcie procesu
Log-Event "Rozpoczecie procesu deploymentu."

try {
    # Przejdź do katalogu projektu
    Set-Location -Path $ProjectDir

    # Pobierz najnowszy kod z master
    Log-Event "Pobieranie najnowszego kodu z mastera..."
    git fetch origin
    git reset --hard origin/master

    # Zainstaluj zależności
    Log-Event "Instalowanie zaleznosci npm..."
    npm install

    # Zbuduj aplikację Next.js
    Log-Event "Budowanie aplikacji Next.js..."
    npx next build

    # Zbuduj nowy obraz Dockera
    Log-Event "Budowanie obrazu Dockera..."
    docker build -t my-app:latest .

    # Sprawdź, czy istnieje kontener i zatrzymaj go, jeśli działa
    Log-Event "Sprawdzanie istniejacego kontenera..."
    $container = docker ps -q --filter "name=charming_chebyshev"
    if ($container) {
        Log-Event "Zatrzymywanie i usuwanie istniejącego kontenera..."
        docker stop $container
        docker rm $container
    }

    # Uruchom nowy kontener
    Log-Event "Uruchamianie nowego kontenera..."
    docker run -d --name charming_chebyshev -p 3000:3000 my-app:latest

    Log-Event "Deployment zakonczony pomyslnie."
} catch {
    # Loguj błędy jako zdarzenia typu Error
    Log-Event "Blad podczas procesu deploymentu: $_" -EntryType "Error"
    throw
}
