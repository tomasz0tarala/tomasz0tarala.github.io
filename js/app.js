/**
 * Aplikacja Quiz - główny skrypt.
 * Rejestruje obsługę zdarzeń dla elementów UI i zarządza logiką quizu.
 */

/**
 * Inicjuje grę: ukrywa elementy startowe, wyświetla kontener z pytaniami i ładuje pierwsze pytanie.
 * Restartuje wynik i indeks bieżącego pytania.
 * @function
 * @public
 * @example
 * startButton.addEventListener('click', startGame);
 * restartButton.addEventListener('click', startGame);
 */
async function startGame() {
  score = 0;
  currentQuestionIndex = 0;
  startButton.classList.add('hidden');
  introductionElement.classList.add('hidden');
  resultContainer.classList.add('hidden');
  questionContainerElement.classList.remove('hidden');
  await loadAndDisplayQuestions();
}

/**
 * Ładuje pytania z pliku JSON i wyświetla je losowo.
 * Obsługuje wyjątki w przypadku błędów ładowania pytań.
 * @function
 * @public
 * @example
 * await loadAndDisplayQuestions();
 */
async function loadAndDisplayQuestions() {
  try {
    const response = await fetch('json/questions.json');
    const questions = await response.json();
    currentQuestions = selectRandomQuestions(questions, 10);
    displayQuestion(currentQuestions[currentQuestionIndex]);
  } catch (error) {
    console.error("Failed to load questions:", error);
  }
}

/**
 * Wybiera losowe pytania z dostępnych, aby zapewnić różnorodność quizu.
 * @function
 * @public
 * @param {Array} questions - Lista wszystkich dostępnych pytań.
 * @param {number} numQuestions - Ilość pytań do wyświetlenia w quizie.
 * @returns {Array} Lista wybranych pytań do wykorzystania w quizie.
 */
function selectRandomQuestions(questions, numQuestions) {
  let questionsCopy = questions.slice();
  let selectedQuestions = [];

  for (let i = questionsCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Losowy indeks od 0 do i
    [questionsCopy[i], questionsCopy[j]] = [questionsCopy[j], questionsCopy[i]]; // Zamiana miejscami
  }

  selectedQuestions = questionsCopy.slice(0, numQuestions);
  return selectedQuestions;
}

/**
 * Wyświetla pytanie i odpowiedzi na ekranie, umożliwiając użytkownikowi wybór.
 * Resetuje stan przed wyświetleniem nowego pytania.
 * @function
 * @public
 * @param {Object} question - Obiekt pytania zawierający treść pytania i odpowiedzi.
 */
function displayQuestion(question) {
  resetState();
  questionElement.innerText = question.question;
  question.answers.forEach((answer, index) => {
    const answerElement = document.createElement('div');
    const radioInput = document.createElement('input');
    radioInput.type = 'radio';
    radioInput.id = 'answer' + index;
    radioInput.name = 'answer';
    radioInput.value = index;
    radioInput.classList.add('answer-radio');

    const label = document.createElement('label');
    label.htmlFor = 'answer' + index;
    label.innerText = answer;
    label.classList.add('answer-label');

    answerElement.appendChild(radioInput);
    answerElement.appendChild(label);
    answerButtonsElement.appendChild(answerElement);
  });

  confirmAnswerBtn.classList.remove('hidden');
}

/**
 * Resetuje stan UI odpowiedzi, ukrywając przycisk potwierdzenia i usuwając istniejące opcje odpowiedzi.
 * @function
 * @public
 */
function resetState() {
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
  confirmAnswerBtn.classList.add('hidden');
}

/**
 * Sprawdza, która odpowiedź została wybrana i czy jest poprawna, a następnie przechodzi do następnego pytania lub wyświetla wynik.
 * @function
 * @public
 */
function selectAnswer() {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (!selectedAnswer) {
    alert("Proszę wybrać odpowiedź!");
    return;
  }
  const answerIndex = Number(selectedAnswer.value);
  const correctAnswerIndex = currentQuestions[currentQuestionIndex].correctAnswer;
  if (answerIndex === correctAnswerIndex) {
    score++;
  }
  if (currentQuestionIndex < currentQuestions.length - 1) {
    currentQuestionIndex++;
    displayQuestion(currentQuestions[currentQuestionIndex]);
  } else {
    showResult();
  }
}

/**
 * Wyświetla wynik quizu i oferuje możliwość restartu gry.
 * @function
 * @public
 */
function showResult() {
  questionContainerElement.classList.add('hidden');
  resultContainer.classList.remove('hidden');

  const resultText = `Twój wynik: ${score}/${currentQuestions.length}`;
  document.getElementById('result').innerText = resultText;

}

/**
 * Przywraca stan początkowy aplikacji, umożliwiając rozpoczęcie nowej gry.
 * @function
 * @public
 */
function backToStart() {
  questionContainerElement.classList.add('hidden');
  resultContainer.classList.add('hidden');

  resetQuizState();

  introductionElement.classList.remove('hidden');
  startButton.classList.remove('hidden');
}

/**
 * Resetuje stan quizu do wartości początkowych.
 * Funkcja ta jest wywoływana podczas restartowania quizu lub kiedy użytkownik chce zacząć od nowa po ukończeniu quizu.
 * Resetuje wynik i indeks bieżącego pytania do zera.
 * @function
 * @public
 */
function resetQuizState() {
  score = 0;
  currentQuestionIndex = 0;
}

/**
 * Inicjalizuje aplikację quizową, dodając nasłuchiwanie zdarzeń do elementów interfejsu użytkownika.
 * Funkcja ta ustawia potrzebne nasłuchiwanie zdarzeń dla przycisków start, restart, potwierdź odpowiedź i powrót do startu.
 * Jest wywoływana raz, gdy zawartość DOM jest w pełni załadowana, co zapewnia dostępność wszystkich elementów.
 * @function
 * @public
 */
function initQuiz() {
  startButton.addEventListener('click', startGame);
  restartButton.addEventListener('click', startGame);
  confirmAnswerBtn.addEventListener('click', selectAnswer);
  document.getElementById('back-to-start-btn').addEventListener('click', backToStart);
}

// Inicjalizacja globalnych zmiennych dla elementów UI oraz stanu quizu.
let startButton, questionContainerElement, questionElement, answerButtonsElement, introductionElement, resultContainer,
  restartButton, confirmAnswerBtn, currentQuestions, currentQuestionIndex, score;

/**
 * Przygotowuje aplikację quizową do działania po pełnym załadowaniu DOM.
 * Funkcja ta przypisuje elementy DOM do globalnych zmiennych i wywołuje `initQuiz` w celu ustawienia nasłuchiwania zdarzeń.
 * Zapewnia, że wszystkie manipulacje i rejestracje zdarzeń są wykonane po gotowości DOM.
 * @listens document#DOMContentLoaded - Zdarzenie, które jest wyzwalane, gdy dokument HTML został całkowicie załadowany i przetworzony.
 */
document.addEventListener('DOMContentLoaded', () => {
  startButton = document.getElementById('start-quiz-btn');
  questionContainerElement = document.getElementById('question-container');
  questionElement = document.getElementById('question');
  answerButtonsElement = document.getElementById('answer-buttons');
  introductionElement = document.getElementById('introduction');
  resultContainer = document.getElementById('result-container');
  restartButton = document.getElementById('restart-quiz-btn');
  confirmAnswerBtn = document.getElementById('confirm-answer-btn');

  initQuiz();
});

