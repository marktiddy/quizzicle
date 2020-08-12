const choices = ["General Knowledge", "Music", "Film", "Television"];
const numbers = [10, 20, 30];
let selectedChoice = "";
let selectedNumber = 0;
const choiceArea = document.querySelector(".choice-area");
let questions = [];
let questionNumber = 0;

//Set up our quiz choices
function loadChoices() {
  //Create our choice boxes and append them
  choices.map((c) => {
    const newChoice = document.createElement("div");
    newChoice.classList.add("choice-item");
    newChoice.innerHTML = `
    <p>${c}</p>
    `;
    choiceArea.append(newChoice);
    newChoice.addEventListener("click", () => {
      handleTopicChoice(newChoice);
    });
  });

  const numberArea = document.querySelector(".number-area");
  numbers.map((c) => {
    const newNumber = document.createElement("div");
    newNumber.classList.add("number-item");
    newNumber.innerHTML = `
    <p>${c}</p>
    `;
    numberArea.append(newNumber);
    newNumber.addEventListener("click", () => {
      handleNumberChoice(newNumber);
    });
  });
}

function handleTopicChoice(item) {
  //Remove the select class from all items
  const allChoices = document.querySelectorAll(".choice-item");

  allChoices.forEach((choice) => {
    if (choice.innerHTML === item.innerHTML) {
      selectedChoice = choice.innerText;
      choice.classList.add("selected");
    } else {
      choice.classList.remove("selected");
    }
  });
}

function handleNumberChoice(item) {
  //Remove the select class from all items
  const allNumbers = document.querySelectorAll(".number-item");

  allNumbers.forEach((choice) => {
    if (choice.innerHTML === item.innerHTML) {
      selectedNumber = choice.textContent;
      choice.classList.add("selected");
    } else {
      choice.classList.remove("selected");
    }
  });
}

//Listen for start
document.querySelector(".start-area").addEventListener("click", () => {
  startQuiz();
});

//Quiz Functions
function startQuiz() {
  if (selectedNumber && selectedChoice) {
    document
      .querySelectorAll(".error")
      .forEach((c) => c.classList.add("hidden"));
    loadQuiz();
  } else {
    if (!selectedNumber) {
      document.getElementById("number-error").classList.remove("hidden");
    } else {
      document.getElementById("number-error").classList.add("hidden");
    }
    if (!selectedChoice) {
      document.getElementById("choice-error").classList.remove("hidden");
    } else {
      document.getElementById("choice-error").classList.add("hidden");
    }
  }
}

function loadQuiz() {
  const baseurl = "https://opentdb.com/api.php?";
  const choice = calculateCategory();
  const url = `${baseurl}amount=${parseInt(selectedNumber)}&category=${choice}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      questions = data.results;
    })
    .then(() => loadQuestion());
}

function loadQuestion() {
  const container = document.querySelector(".main-area");
  container.innerHTML = `<div class="title">Quizzicle</div>
  `;
  const question = document.createElement("p");
  question.classList.add("choice-title");
  question.innerHTML = `${questionNumber + 1} - ${
    questions[questionNumber].question
  }`;
  container.append(question);
  //Load our answers

  let answers = questions[questionNumber].incorrect_answers;
  answers.push(questions[questionNumber].correct_answer);
  let shuffledAnswers = shuffle(answers);
  const choiceArea = document.createElement("div");
  choiceArea.classList.add("answer-area");
  shuffledAnswers.forEach((a) => {
    const newItem = document.createElement("div");
    newItem.classList.add("answer-item");
    newItem.innerHTML = a;
    choiceArea.append(newItem);
    newItem.addEventListener("click", () => {
      handleAnswer(newItem);
    });
  });
  container.append(choiceArea);
}

//Check answer
function handleAnswer(answer) {
  const useranswer = answer.textContent;
  if (questions[questionNumber].correct_answer == useranswer) {
    //correct
    const answerArea = document.querySelector(".answer-area");
    answerArea.innerHTML = '<p class="choice-title">You Answered</p>';
    const userAnswerDiv = document.createElement("div");
    userAnswerDiv.classList.add("answer-feedback-item");
    userAnswerDiv.innerText = useranswer;
    answerArea.append(userAnswerDiv);
    const theAnswerTitle = document.createElement("p");
    theAnswerTitle.classList.add("answer-feedback-item");
    theAnswerTitle.innerText = `The Answer is: ${questions[questionNumber].correct_answer}`;
    answerArea.append(theAnswerTitle);
    const feedback = document.createElement("div");
    feedback.classList.add("answer-feedback-item");
    feedback.classList.add("correct");
    feedback.innerText = "Correct! Well Done";
    answerArea.append(feedback);
    //Update the score
    const score = document.getElementById("score-int");
    score.innerText = parseInt(score.innerText) + 1;
  } else {
    //Incorrect
    //correct
    const answerArea = document.querySelector(".answer-area");
    answerArea.innerHTML = "";
    const userAnswerDiv = document.createElement("div");
    userAnswerDiv.classList.add("answer-feedback-item");
    userAnswerDiv.innerText = `You Answered: ${useranswer}`;
    answerArea.append(userAnswerDiv);
    const theAnswerTitle = document.createElement("p");
    theAnswerTitle.classList.add("answer-feedback-item");
    theAnswerTitle.innerText = `The Answer is: ${questions[questionNumber].correct_answer}`;
    answerArea.append(theAnswerTitle);
    const feedback = document.createElement("div");
    feedback.classList.add("answer-feedback-item");
    feedback.classList.add("incorrect");
    feedback.innerText = "Sorry, you didn't get that right";
    answerArea.append(feedback);
  }

  if (questionNumber !== questions.length - 1) {
    //Next question
    questionNumber++;
    setTimeout(() => {
      loadQuestion();
    }, 3000);
  } else {
    const mainArea = document.querySelector(".answer-area");
    const score = document.getElementById("score-int");

    mainArea.innerHTML = `
    <p class="feedback">You've reached the end of the quiz</p>
    <p class="feedback">You scored ${score.textContent} out of ${
      questions.length
    }</p>
    <p class="feedback">${
      parseInt(score.textContent) / questions.length > 0.7
        ? "Pretty Good"
        : "Better Luck Next Time"
    }</p>
    `;
    const startOver = document.createElement("div");
    startOver.classList.add("answer-item");
    startOver.innerText = "Start Over";
    startOver.addEventListener("click", () => {
      location.reload();
    });
    mainArea.append(startOver);
  }
}

function calculateCategory() {
  let choice;

  switch (selectedChoice) {
    case "General Knowledge":
      choice = 9;
      break;
    case "Film":
      choice = 11;
      break;
    case "Music":
      choice = 12;
      break;
    case "Television":
      choice = 14;
      break;
    default:
      choice = 9;
  }
  return choice;
}

//Function to shuffle answers
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

//Function to run at start
loadChoices();
