// Configuration
// Configuration
const BACKEND_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:' || window.location.hostname === '')
    ? 'http://localhost:3010'
    : 'https://protocol-backend-idxa.onrender.com'; // TODO: REPLACE WITH YOUR ACTUAL BACKEND URL FOR PRODUCTION

// State
let currentUser = null;
let dayIndex = null;
let questions = [];
let answers = []; // { question_id, selected_option }

// DOM Elements
const usernameSection = document.getElementById('username-section');
const quizSection = document.getElementById('quiz-section');
const leaderboardSection = document.getElementById('leaderboard-section');
const loadingSpinner = document.getElementById('loading-spinner');

const usernameInput = document.getElementById('username-input');
const startBtn = document.getElementById('start-btn');
const usernameError = document.getElementById('username-error');

const questionsContainer = document.getElementById('questions-container');
const submitQuizBtn = document.getElementById('submit-quiz-btn');

const leaderboardBody = document.getElementById('leaderboard-body');
const userScoreDisplay = document.getElementById('user-score-display');
const finalScoreSpan = document.getElementById('final-score');
const dayDisplay = document.getElementById('day-display');

// Socket.io
const socket = io(BACKEND_URL);

// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', async () => {
    // Set Year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // 1. NON-BLOCKING BACKGROUND WARM-UP
    console.log("Firing background warm-up...");
    fetch(`${BACKEND_URL}/api/health`).catch(err => console.error("Warm-up failed", err));

    // 2. IMMEDIATE UI RENDER
    const storedUser = localStorage.getItem('daily_quiz_username');
    if (storedUser) {
        usernameInput.value = storedUser;
    }
    showUsernameInput();

    // Listen for leaderboard updates
    socket.on('leaderboard_update', (leaderboard) => {
        updateLeaderboardTable(leaderboard);
    });
});

// --- NAVIGATION / VIEWS ---

function hideAll() {
    usernameSection.classList.add('d-none');
    quizSection.classList.add('d-none');
    leaderboardSection.classList.add('d-none');
    loadingSpinner.classList.add('d-none');
}

function showLoading() {
    hideAll();
    loadingSpinner.classList.remove('d-none');
}

function showUsernameInput() {
    hideAll();
    usernameSection.classList.remove('d-none');
}

function showQuiz() {
    hideAll();
    quizSection.classList.remove('d-none');
}

async function showLeaderboard() {
    hideAll();
    leaderboardSection.classList.remove('d-none');
    try {
        const res = await fetch(`${BACKEND_URL}/api/leaderboard?dayIndex=${dayIndex || ''}`); // API uses dayIndex from logic but passing it is fine or just backend logic default
        // Actually backend logic.getDayIndex() is truth.
        const data = await res.json();
        updateLeaderboardTable(data.leaderboard);
    } catch (e) {
        console.error("Failed to load leaderboard", e);
    }
}

// --- ACTIONS ---

async function checkStatus(username) {
    const res = await fetch(`${BACKEND_URL}/api/daily-status?username=${encodeURIComponent(username)}`);
    if (!res.ok) throw new Error("Status check failed");
    return await res.json();
}

startBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    if (!username) {
        usernameError.textContent = "Please enter a username";
        usernameError.classList.remove('d-none');
        return;
    }

    // Show better feedback for cold start
    const loadingText = document.querySelector('#loading-spinner p') || document.createElement('p');
    loadingText.className = 'text-info small mt-2';
    loadingText.textContent = "Waking up server (first load may take ~20 seconds)...";
    if (!loadingText.parentElement) loadingSpinner.appendChild(loadingText);

    showLoading();
    currentUser = username;

    try {
        // 1. Fetch Status First (Essential for dayIndex and played status)
        const statusRes = await fetch(`${BACKEND_URL}/api/daily-status?username=${encodeURIComponent(currentUser)}`);
        if (!statusRes.ok) {
            const errData = await statusRes.json().catch(() => ({}));
            throw new Error(errData.error || "Server connection failed (Status)");
        }
        const status = await statusRes.json();

        dayIndex = status.dayIndex;
        dayDisplay.textContent = dayIndex;

        if (status.played) {
            // User already played today
            localStorage.setItem('daily_quiz_username', currentUser);
            localStorage.setItem('daily_quiz_day', dayIndex);
            showLeaderboard();
        } else {
            // 2. Fetch Questions (Only if they haven't played)
            const questionsRes = await fetch(`${BACKEND_URL}/api/questions?username=${encodeURIComponent(currentUser)}`);
            const qData = await questionsRes.json();

            if (!questionsRes.ok) {
                throw new Error(qData.error || "Failed to load questions");
            }

            questions = qData.questions;
            localStorage.setItem('daily_quiz_username', currentUser);
            localStorage.setItem('daily_quiz_day', dayIndex);
            renderQuestions();
            showQuiz();
        }
    } catch (e) {
        console.error("Quiz Start Error:", e);
        usernameError.textContent = e.message || "Error connecting to server. Please try again.";
        usernameError.classList.remove('d-none');
        showUsernameInput();
    }
    hideLoading();
});

async function loadQuiz() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/questions?username=${encodeURIComponent(currentUser)}`);
        const data = await res.json();

        if (data.error) {
            alert(data.error);
            showLeaderboard();
            return;
        }

        questions = data.questions;
        renderQuestions();
        showQuiz();
    } catch (e) {
        console.error(e);
        alert("Failed to load questions");
        showUsernameInput();
    }
}

function renderQuestions() {
    questionsContainer.innerHTML = '';

    questions.forEach((q, index) => {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.innerHTML = `
            <div class="mb-3">
                <h5 class="condensed text-white">Q${index + 1}. ${q.question_text}</h5>
            </div>
            <div class="options-group" data-qid="${q.id}">
                <label class="option-label">
                    <input type="radio" name="q${q.id}" value="A" onchange="selectOption(${q.id}, 'A')"> 
                    A. ${q.option_a}
                </label>
                <label class="option-label">
                    <input type="radio" name="q${q.id}" value="B" onchange="selectOption(${q.id}, 'B')"> 
                    B. ${q.option_b}
                </label>
                <label class="option-label">
                    <input type="radio" name="q${q.id}" value="C" onchange="selectOption(${q.id}, 'C')"> 
                    C. ${q.option_c}
                </label>
                <label class="option-label">
                    <input type="radio" name="q${q.id}" value="D" onchange="selectOption(${q.id}, 'D')"> 
                    D. ${q.option_d}
                </label>
            </div>
        `;
        questionsContainer.appendChild(card);
    });
}

window.selectOption = function (qId, option) {
    // Update state
    const existingIndex = answers.findIndex(a => a.questionId === qId);
    if (existingIndex > -1) {
        answers[existingIndex].selected = option;
    } else {
        answers.push({ questionId: qId, selected: option });
    }
};

submitQuizBtn.addEventListener('click', async () => {
    if (answers.length < questions.length) {
        if (!confirm("You haven't answered all questions. Submit anyway?")) return;
    }

    showLoading();
    submitQuizBtn.disabled = true;

    try {
        const res = await fetch(`${BACKEND_URL}/api/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: currentUser,
                answers: answers
            })
        });

        const result = await res.json();

        if (result.error) {
            alert(result.error);
            showLeaderboard(); // Fallback
        } else {
            // Success
            revealAnswers(result.correctAnswers, result.explanations);
            finalScoreSpan.textContent = result.score;
            userScoreDisplay.classList.remove('d-none');

            // Show result for a moment then leaderboard?
            // User requirement: "Step 5: Post-Submission UI... Answers revealed... Inputs disabled"
            // So we stay on quiz page but formatted?
            // "Exists -> show leaderboard".
            // Implementation Plan Verification: "Refresh page -> ... Leaderboard is displayed".
            // So after submit, we probably want to see the result + leaderboard BELOW.
            // Or just switch to Leaderboard with user score highlighted.
            // Let's scroll to top and show leaderboard section and disable input.

            // Actually, showing answers is nice.
            // I'll keep the questions visible, disable buttons, color them, and Append Leaderboard at bottom.
            quizSection.classList.remove('d-none');
            leaderboardSection.classList.remove('d-none');
            submitQuizBtn.classList.add('d-none');
            loadingSpinner.classList.add('d-none');

            updateLeaderboardTable(result.leaderboard);

        }

    } catch (e) {
        console.error(e);
        alert("Submission failed");
        showLeaderboard();
    }
    hideLoading();
    // Scroll to top AFTER everything is visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

function revealAnswers(correctAnswers, explanations) {
    questions.forEach(q => {
        const correct = correctAnswers[q.id];
        const explanation = explanations ? explanations[q.id] : null;
        const container = document.querySelector(`.options-group[data-qid="${q.id}"]`);
        const inputs = container.querySelectorAll('input');

        inputs.forEach(input => {
            input.disabled = true; // Disable inputs
            const label = input.parentElement;

            // Check if this option is correct
            if (input.value === correct) {
                label.classList.add('correct');
                label.style.fontWeight = 'bold';
            }

            // Check if user selected this
            if (input.checked) {
                if (input.value !== correct) {
                    label.classList.add('incorrect');
                }
            }
        });

        // Display Explanation
        if (explanation) {
            const expDiv = document.createElement('div');
            expDiv.className = 'explanation-text mt-2 text-white';
            expDiv.style.fontSize = '0.9rem';
            expDiv.style.opacity = '0.9';
            expDiv.innerHTML = `<strong>Explanation:</strong> ${explanation}`;
            container.appendChild(expDiv);
        }
    });
}

function updateLeaderboardTable(data) {
    leaderboardBody.innerHTML = '';
    data.forEach((entry, idx) => {
        const tr = document.createElement('tr');
        const rank = idx + 1;

        let rankClass = '';
        if (rank === 1) rankClass = 'rank-1';
        if (rank === 2) rankClass = 'rank-2';
        if (rank === 3) rankClass = 'rank-3';

        tr.innerHTML = `
            <td class="${rankClass}">${rank}</td>
            <td>${entry.username} ${entry.username === currentUser ? '(You)' : ''}</td>
            <td>${entry.score}</td>
        `;
        leaderboardBody.appendChild(tr);
    });
}
