const quizData = [
  {
    questionText: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language",
    ],
    correctAnswer: 0,
  },
  {
    questionText: "Which data structure uses LIFO (Last In First Out)?",
    options: ["Queue", "Strings", "Array", "Linked List"],
    correctAnswer: 1,
  },
  {
    questionText: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
    correctAnswer: 1,
  },
  {
    questionText: "Which HTTP method is used to update a resource?",
    options: ["GET", "POST", "PUT", "DELETE"],
    correctAnswer: 2,
  },
  {
    questionText: "What does CSS stand for?",
    options: [
      "Computer Style Sheets",
      "Cascading Style Sheets",
      "Creative Style Sheets",
      "Colorful Style Sheets",
    ],
    correctAnswer: 1,
  },
  {
    questionText: "Which of the following is NOT a JavaScript framework?",
    options: ["React", "Angular", "Vue", "Django"],
    correctAnswer: 3,
  },
  {
    questionText: "What is the default port for HTTP?",
    options: ["21", "22", "80", "443"],
    correctAnswer: 2,
  },
  {
    questionText: "Which SQL command is used to retrieve data from a database?",
    options: ["GET", "SELECT", "FETCH", "RETRIEVE"],
    correctAnswer: 1,
  },
  {
    questionText: "What does API stand for?",
    options: [
      "Application Programming Interface",
      "Advanced Programming Interface",
      "Application Process Integration",
      "Automated Programming Interface",
    ],
    correctAnswer: 0,
  },
  {
    questionText: "Which of these is a NoSQL database?",
    options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
    correctAnswer: 2,
  },
];

let currentQuestionIndex = 0;
let score = 0;
let timeRemaining = 600; 
let timerInterval;
let quizStartTime;
let shuffledQuestions = [];
let userAnswers = [];

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const restartBtn = document.getElementById("restart-btn");
const timerDisplay = document.getElementById("timer-display");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");

function init() {
  loadQuizProgress();
  setupEventListeners();
  updateTotalQuestions();
}

function setupEventListeners() {
  startBtn.addEventListener("click", startQuiz);
  nextBtn.addEventListener("click", nextQuestion);
  submitBtn.addEventListener("click", submitQuiz);
  restartBtn.addEventListener("click", restartQuiz);
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function startQuiz() {
  shuffledQuestions = shuffleArray(quizData);
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];
  timeRemaining = 600;
  quizStartTime = Date.now();

  showScreen("quiz");
  startTimer();
  displayQuestion();
  saveQuizProgress();
}

// Show specific screen
function showScreen(screenName) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  switch (screenName) {
    case "start":
      startScreen.classList.add("active");
      break;
    case "quiz":
      quizScreen.classList.add("active");
      break;
    case "results":
      resultsScreen.classList.add("active");
      break;
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();
    saveQuizProgress();

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      submitQuiz();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  timerDisplay.textContent = `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;

  if (timeRemaining <= 60) {
    timerDisplay.style.color = "#e74c3c";
  } else if (timeRemaining <= 300) {
    timerDisplay.style.color = "#f39c12";
  }
}

function displayQuestion() {
  const question = shuffledQuestions[currentQuestionIndex];

  questionText.textContent = question.questionText;
  currentQuestionSpan.textContent = currentQuestionIndex + 1;

  optionsContainer.innerHTML = "";

  question.options.forEach((option, index) => {
    const optionElement = document.createElement("div");
    optionElement.className = "option";
    optionElement.textContent = option;
    optionElement.addEventListener("click", () => selectOption(index));
    optionsContainer.appendChild(optionElement);
  });

  nextBtn.disabled = true;
  submitBtn.style.display = "none";

  if (currentQuestionIndex === shuffledQuestions.length - 1) {
    nextBtn.style.display = "none";
    submitBtn.style.display = "inline-block";
  } else {
    nextBtn.style.display = "inline-block";
    submitBtn.style.display = "none";
  }
}

function selectOption(selectedIndex) {
  document.querySelectorAll(".option").forEach((option) => {
    option.classList.remove("selected");
  });

  document.querySelectorAll(".option")[selectedIndex].classList.add("selected");

  userAnswers[currentQuestionIndex] = selectedIndex;

  nextBtn.disabled = false;
  submitBtn.disabled = false;

  saveQuizProgress();
}

function nextQuestion() {
  currentQuestionIndex++;
  displayQuestion();
}

function submitQuiz() {
  clearInterval(timerInterval);
  calculateScore();
  showResults();
  clearQuizProgress();
}

function calculateScore() {
  score = 0;
  shuffledQuestions.forEach((question, index) => {
    if (userAnswers[index] === question.correctAnswer) {
      score++;
    }
  });
}

function showResults() {
  const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;
  const percentage = Math.round((score / shuffledQuestions.length) * 100);

  document.getElementById("final-score").textContent = score;
  document.getElementById("total-score").textContent = shuffledQuestions.length;
  document.getElementById(
    "score-percentage"
  ).textContent = `${percentage}% Correct`;
  document.getElementById(
    "time-taken"
  ).textContent = `Time taken: ${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;

  // Display question review
  displayQuestionReview();

  showScreen("results");
}

function displayQuestionReview() {
  const reviewContainer = document.getElementById("question-review");
  reviewContainer.innerHTML = "";

  shuffledQuestions.forEach((question, index) => {
    const isCorrect = userAnswers[index] === question.correctAnswer;
    const reviewElement = document.createElement("div");
    reviewElement.className = `question-result ${
      isCorrect ? "correct" : "incorrect"
    }`;

    const userAnswerText =
      userAnswers[index] !== undefined
        ? question.options[userAnswers[index]]
        : "No answer";

    reviewElement.innerHTML = `
            <h4>Question ${index + 1}: ${question.questionText}</h4>
            <p><strong>Your answer:</strong> <span class="user-answer">${userAnswerText}</span></p>
            <p><strong>Correct answer:</strong> <span class="correct-answer">${
              question.options[question.correctAnswer]
            }</span></p>
        `;

    reviewContainer.appendChild(reviewElement);
  });
}

function restartQuiz() {
  clearInterval(timerInterval);
  showScreen("start");
}

function updateTotalQuestions() {
  totalQuestionsSpan.textContent = quizData.length;
}

function saveQuizProgress() {
  const progress = {
    currentQuestionIndex,
    score,
    timeRemaining,
    quizStartTime,
    shuffledQuestions,
    userAnswers,
    isActive: true,
  };
  localStorage.setItem("quizProgress", JSON.stringify(progress));
}

function loadQuizProgress() {
  const saved = localStorage.getItem("quizProgress");
  if (saved) {
    const progress = JSON.parse(saved);
    if (progress.isActive && progress.timeRemaining > 0) {
      currentQuestionIndex = progress.currentQuestionIndex;
      score = progress.score;
      timeRemaining = progress.timeRemaining;
      quizStartTime = progress.quizStartTime;
      shuffledQuestions = progress.shuffledQuestions;
      userAnswers = progress.userAnswers;

      showScreen("quiz");
      startTimer();
      displayQuestion();
    }
  }
}

function clearQuizProgress() {
  localStorage.removeItem("quizProgress");
}

document.addEventListener("DOMContentLoaded", init);
