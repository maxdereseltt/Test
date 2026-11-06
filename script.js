const CORRECT_PASSWORD = "FREEVBUCKS";
const TOTAL_DURATION_MS = 48 * 60 * 60 * 1000; // 48 Stunden in Millisekunden

// ===============================================================
// ELEMENTE ABFRAGEN
// ===============================================================
const headline = document.getElementById('headline');
const statusMessage = document.getElementById('status-message');
const inputArea = document.getElementById('input-area');
const passwordInput = document.getElementById('passwordInput');
const unlockButton = document.getElementById('unlockButton');
const timerDisplay = document.getElementById('timer-display');
const timeRemainingSpan = document.getElementById('timeRemaining');
const contentArea = document.getElementById('content-area');
const lockButtonSecondary = document.getElementById('lockButtonSecondary');

// ===============================================================
// ZUSTANDSVERWALTUNG
// ===============================================================
let isLocked = true;
let unlockAt = Number(localStorage.getItem('unlockAt'));
let timerInterval = null;

if (!Number.isFinite(unlockAt) || unlockAt <= 0) {
    unlockAt = Date.now() + TOTAL_DURATION_MS;
    localStorage.setItem('unlockAt', String(unlockAt));
}

// Funktion zum Aktualisieren der Anzeige
function updateUI() {
    if (isLocked) {
        // Sperr-Zustand
        headline.style.color = '#ffffff';
        statusMessage.textContent = "SYSTEM GESPERRT – Bitte um Zugangscode eingeben.";
        inputArea.style.display = 'block';
        contentArea.style.display = 'none';

        // Timer-Anzeige aktualisieren
        const timeLeft = calculateTimeLeft();
        timeRemainingSpan.textContent = formatTime(timeLeft);

    } else {
        // Entsperrter Zustand
        headline.style.color = '#4CAF50';
        statusMessage.textContent = "System voll funktionsfähig.";
        inputArea.style.display = 'none';
        contentArea.style.display = 'block';
    }
}

// Funktion zur Berechnung der verbleibenden Zeit
function calculateTimeLeft() {
    return Math.max(0, unlockAt - Date.now());
}

// Funktion zur Formatierung der Zeit
function formatTime(milliseconds) {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    if (hours > 0) return `${hours} Stunden, ${minutes} Minuten, ${seconds} Sekunden`;
    return `${minutes} Minuten und ${seconds} Sekunden`;
}

// ===============================================================
// EVENT HANDLER
// ===============================================================

// Funktion zum manuellen Entsperren durch Passwort
function handleUnlock() {
    const input = passwordInput.value.trim();
    if (input === CORRECT_PASSWORD) {
        isLocked = false;
        alert('Zugriff gewährt!');
    } else {
        alert('❌ Falsches Passwort. Bitte versuchen Sie erneut.');
        // Bei falschem Passwort bleibt der Zustand gesperrt
    }
    updateUI();
}

// Funktion zum manuellen Sperren
function handleLock() {
    isLocked = true;
    updateUI();
}

// Timer-Funktion zur automatischen Entsperrung
function startTimer() {
    const tick = () => {
        const timeLeft = calculateTimeLeft();
        timeRemainingSpan.textContent = formatTime(timeLeft);

        if (timeLeft <= 0) {
            if (timerInterval !== null) {
                clearInterval(timerInterval);
            }
            timerInterval = null;
            if (isLocked) {
                isLocked = false;
                alert('⏰ Zeit abgelaufen! System automatisch entsperrt.');
            }
            updateUI();
        }
    };

    tick();
    if (calculateTimeLeft() > 0) {
        timerInterval = setInterval(tick, 1000);
    }
}

// ===============================================================
// INITIALISIERUNG
// ===============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Event Listener einrichten
    unlockButton.addEventListener('click', handleUnlock);
    lockButtonSecondary.addEventListener('click', handleLock);

    // Tastendruck-Listener für schnelles Eingeben
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUnlock();
        }
    });

    // Initialen Zustand laden und Timer starten
    updateUI();
    startTimer();
});