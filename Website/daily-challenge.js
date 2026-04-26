// Configuration
const BACKEND_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:' || window.location.hostname === '')
    ? 'http://localhost:3010'
    : 'https://protocol-backend-idxa.onrender.com';

// Helper for seamless server wake-up (Retries if Render is sleeping/502s)
async function fetchWithRetry(url, options = {}, retries = 3, backoff = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            // If it's a 500 Internal Server Error, the backend is awake but crashed. Return immediately to trigger offline fallback instantly.
            if (response.ok || response.status === 500 || (response.status < 500 && response.status >= 400)) {
                return response;
            }
            // For 502/503 (server waking up), retry
            if (i === retries - 1) return response; 
        } catch (err) {
            // Network errors (Failed to fetch)
            if (i === retries - 1) throw err;
        }
        await new Promise(res => setTimeout(res, backoff));
    }
}
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
    fetchWithRetry(`${BACKEND_URL}/api/health`).catch(err => console.error("Warm-up failed", err));

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
        const res = await fetchWithRetry(`${BACKEND_URL}/api/leaderboard?dayIndex=${dayIndex || ''}`); // API uses dayIndex from logic but passing it is fine or just backend logic default
        // Actually backend logic.getDayIndex() is truth.
        const data = await res.json();
        updateLeaderboardTable(data.leaderboard);
    } catch (e) {
        console.error("Failed to load leaderboard", e);
    }
}

// --- ACTIONS ---

async function checkStatus(username) {
    const res = await fetchWithRetry(`${BACKEND_URL}/api/daily-status?username=${encodeURIComponent(username)}`);
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
    loadingText.textContent = "Waking up server (this may take up to 2 minutes if it's the first visit of the day)...";
    if (!loadingText.parentElement) loadingSpinner.appendChild(loadingText);

    showLoading();
    currentUser = username;

    try {
        // Fetch status first to see if played
        const statusRes = await fetchWithRetry(`${BACKEND_URL}/api/daily-status?username=${encodeURIComponent(currentUser)}`);

        if (!statusRes.ok) {
            const errData = await statusRes.json().catch(() => ({}));
            throw new Error(errData.error || `Server error: ${statusRes.status}`);
        }

        const status = await statusRes.json();
        dayIndex = status.dayIndex;
        dayDisplay.textContent = dayIndex;

        if (status.played) {
            localStorage.setItem('daily_quiz_username', currentUser);
            localStorage.setItem('daily_quiz_day', dayIndex);
            showLeaderboard();
        } else {
            // Fetch questions
            const questionsRes = await fetchWithRetry(`${BACKEND_URL}/api/questions?username=${encodeURIComponent(currentUser)}`);
            if (!questionsRes.ok) {
                const errData = await questionsRes.json().catch(() => ({}));
                throw new Error(errData.error || "Failed to load questions");
            }
            const qData = await questionsRes.json();
            questions = qData.questions;

            localStorage.setItem('daily_quiz_username', currentUser);
            localStorage.setItem('daily_quiz_day', dayIndex);
            renderQuestions();
            showQuiz();
        }
    } catch (e) {
        console.warn("Backend unavailable, starting offline fallback mode...", e);
        // OFFLINE FALLBACK MODE
        dayIndex = "Offline";
        dayDisplay.textContent = dayIndex;
        questions = [
            { id: 1, question_text: "What does HTML stand for?", option_a: "Hyper Text Markup Language", option_b: "High Tech Modern Language", option_c: "Hyper Transfer Markup Language", option_d: "None of the above" },
            { id: 2, question_text: "Which programming language is known as the backbone of web development?", option_a: "Python", option_b: "C++", option_c: "JavaScript", option_d: "Java" },
            { id: 3, question_text: "What does CSS stand for?", option_a: "Computer Style Sheets", option_b: "Cascading Style Sheets", option_c: "Creative Style Sheets", option_d: "Colorful Style Sheets" },
            { id: 4, question_text: "Which protocol is used to secure data transfer on the web?", option_a: "HTTP", option_b: "FTP", option_c: "HTTPS", option_d: "SMTP" },
            { id: 5, question_text: "What does API stand for?", option_a: "Application Programming Interface", option_b: "Advanced Programming Interface", option_c: "Application Process Integration", option_d: "Automated Programming Interface" },
            { id: 6, question_text: "What is the main function of a DNS?", option_a: "Storing web pages", option_b: "Translating domain names to IP addresses", option_c: "Securing web connections", option_d: "Routing physical data" },
            { id: 7, question_text: "Which language is used for structuring web pages?", option_a: "CSS", option_b: "Python", option_c: "HTML", option_d: "JavaScript" },
            { id: 8, question_text: "What does SQL stand for?", option_a: "Standard Query Language", option_b: "Structured Query Language", option_c: "Simple Query Language", option_d: "System Query Language" },
            { id: 9, question_text: "Which HTML tag is used to define an internal style sheet?", option_a: "<script>", option_b: "<css>", option_c: "<style>", option_d: "<link>" },
            { id: 10, question_text: "Which of the following is NOT a JavaScript framework/library?", option_a: "React", option_b: "Angular", option_c: "Vue", option_d: "Django" }
        ];
        renderQuestions();
        showQuiz();
    }
});

async function loadQuiz() {
    try {
        const res = await fetchWithRetry(`${BACKEND_URL}/api/questions?username=${encodeURIComponent(currentUser)}`);
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
        const res = await fetchWithRetry(`${BACKEND_URL}/api/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: currentUser,
                answers: answers
            })
        });

        const result = await res.json();

        if (res.status === 403) {
            alert(result.error || "You have already played today!");
            showLeaderboard();
        } else if (!res.ok || result.error) {
            throw new Error(result.error || "Server error: " + res.status);
        } else {
            // Success
            revealAnswers(result.correctAnswers, result.explanations);
            finalScoreSpan.textContent = result.score;
            userScoreDisplay.classList.remove('d-none');

            quizSection.classList.remove('d-none');
            leaderboardSection.classList.remove('d-none');
            submitQuizBtn.classList.add('d-none');
            loadingSpinner.classList.add('d-none');

            updateLeaderboardTable(result.leaderboard);

        }

    } catch (e) {
        console.warn("Fallback submit mode", e);
        // Calculate score for offline mode based on the user's answers
        let score = 0;
        const fallbackAnswers = { 1: "A", 2: "C", 3: "B", 4: "C", 5: "A", 6: "B", 7: "C", 8: "B", 9: "C", 10: "D" };
        const fallbackExplanations = {
            1: "HTML stands for Hyper Text Markup Language.",
            2: "JavaScript is the backbone of dynamic web development.",
            3: "CSS stands for Cascading Style Sheets.",
            4: "HTTPS secures data transfer over the web.",
            5: "API stands for Application Programming Interface.",
            6: "DNS translates human-readable domain names to IP addresses.",
            7: "HTML provides the basic structure of sites.",
            8: "SQL stands for Structured Query Language.",
            9: "The <style> tag defines internal CSS.",
            10: "Django is a Python framework, not JavaScript."
        };
        
        answers.forEach(a => {
            if (fallbackAnswers[a.questionId] === a.selected) score++;
        });

        revealAnswers(fallbackAnswers, fallbackExplanations);
        finalScoreSpan.textContent = score;
        userScoreDisplay.classList.remove('d-none');
        
        quizSection.classList.remove('d-none');
        leaderboardSection.classList.remove('d-none');
        submitQuizBtn.classList.add('d-none');
        loadingSpinner.classList.add('d-none');
        
        updateLeaderboardTable([
            { username: "Protocol_Bot", score: 9 },
            { username: currentUser, score: score },
            { username: "Guest_User", score: 5 }
        ]);
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
