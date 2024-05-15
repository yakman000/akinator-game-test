const questions = [
    { attribute: "wizard", question: "Is your character a wizard?" },
    { attribute: "student", question: "Is your character a student?" },
    { attribute: "male", question: "Is your character male?" }
];

let possibleCharacters = {};
let currentQuestionIndex = 0;

async function fetchCharacters() {
    const response = await fetch('/api/fetchCharacters');
    const characters = await response.json();
    return characters;
}

async function initializeGame() {
    possibleCharacters = await fetchCharacters();
    askQuestion();
}

function askQuestion() {
    if (currentQuestionIndex < questions.length) {
        document.getElementById("question").innerText = questions[currentQuestionIndex].question;
    } else {
        determineCharacter();
    }
}

function answerQuestion(response) {
    const attribute = questions[currentQuestionIndex].attribute;
    possibleCharacters = Object.fromEntries(Object.entries(possibleCharacters).filter(([name, attrs]) => attrs[attribute] === response));
    currentQuestionIndex++;
    askQuestion();
}

function determineCharacter() {
    const characterNames = Object.keys(possibleCharacters);
    if (characterNames.length === 1) {
        document.getElementById("result").innerText = `Your character is ${characterNames[0]}!`;
    } else {
        document.getElementById("result").innerText = "I couldn't guess your character.";
    }
    document.getElementById("game").style.display = "none";
}

initializeGame();

