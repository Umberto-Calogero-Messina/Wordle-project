import '../scss/styles.scss';
import { WORDS } from './word';

const wordleFormElement = document.getElementById('user-word-form');
const popUpElement = document.getElementById('pop-up');
const inputElement = document.getElementById('input');
const restartButton = document.getElementById('restart');
const gameBoard = document.getElementById('game-board');

const NUMBER_OF_GUESSES = 5;
let currentGuesses = 0;
let rightGuessString = null;

const initBoard = () => {
  const fragment = document.createDocumentFragment();
  const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
  rightGuessString = randomWord;

  gameBoard.classList.add('game-board');

  for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
    const row = document.createElement('div');
    row.classList.add('letter-row');
    for (let j = 0; j < rightGuessString.length; j++) {
      const boxWordle = document.createElement('div');
      boxWordle.classList.add('letter-box');
      row.append(boxWordle);
    }
    fragment.append(row);
  }

  gameBoard.append(fragment);
};

const showPopUp = message => {
  popUpElement.textContent = message;
  popUpElement.classList.add('pop-up--show');
  setTimeout(() => {
    popUpElement.classList.remove('pop-up--show');
  }, 3000);
};

const disableInput = () => {
  inputElement.disabled = true;
};

const animateLetterBox = (box, letter, className, delay) => {
  setTimeout(() => {
    box.textContent = letter;
    box.classList.add(className, 'animated');
  }, delay);
};

const checkWordle = (inputWord, letterBoxes) => {
  const rightGuessStringArray = rightGuessString.split('');
  const delayIncrement = 200;

  for (let i = 0; i < inputWord.length; i++) {
    const letter = inputWord[i];
    const box = letterBoxes[i];
    if (letter === rightGuessString[i]) {
      animateLetterBox(box, letter, 'letter--correct', i * delayIncrement);
      rightGuessStringArray[i] = null;
    }
  }

  for (let i = 0; i < inputWord.length; i++) {
    const letter = inputWord[i];
    const box = letterBoxes[i];
    if (box.textContent) continue;

    const letterIndex = rightGuessStringArray.indexOf(letter);
    if (letterIndex !== -1) {
      animateLetterBox(box, letter, 'letter--present', i * delayIncrement);
      rightGuessStringArray[letterIndex] = null;
    } else {
      animateLetterBox(box, letter, 'letter--incorrect', i * delayIncrement);
    }
  }
};

const cleanInput = () => {
  inputElement.value = '';
};

const hideInputAndShowButton = () => {
  inputElement.classList.add('d-none');
  restartButton.classList.add('d-block');
};

const showInputAndHideButton = () => {
  inputElement.classList.remove('d-none');
  restartButton.classList.remove('d-block');
};

const restartGame = () => {
  gameBoard.textContent = '';
  inputElement.value = '';
  inputElement.disabled = false;
  initBoard();
  showInputAndHideButton();
  currentGuesses = 0;
};

const submitFormFunction = ev => {
  ev.preventDefault();
  const inputWord = ev.target.word.value;
  const formValueLength = inputWord.length;
  const randomWordLength = rightGuessString.length;

  if (!WORDS.includes(inputWord)) {
    showPopUp(`La palabra ${inputWord} no es valida.`);
    return;
  }

  if (currentGuesses === NUMBER_OF_GUESSES) {
    showPopUp(`No tienes más intentos`);
    return;
  }
  if (formValueLength !== randomWordLength) {
    showPopUp(`La palabra debe tener ${randomWordLength} letras.`);
    return;
  }

  const gameBoard = document.getElementById('game-board');
  const currentRow = gameBoard.querySelectorAll('.letter-row')[currentGuesses];
  const letterBoxes = currentRow.querySelectorAll('.letter-box');
  checkWordle(inputWord, letterBoxes);

  currentGuesses++;

  if (inputWord === rightGuessString) {
    showPopUp(`¡Has adivinado la palabra!`);
    disableInput();
    cleanInput();
    hideInputAndShowButton();
    return;
  }

  if (currentGuesses === NUMBER_OF_GUESSES) {
    showPopUp(`No tienes más intentos. La palabra era ${rightGuessString}.`);
    disableInput();
    hideInputAndShowButton();
    return;
  }
  cleanInput();
};

initBoard();
wordleFormElement.addEventListener('submit', submitFormFunction);
restartButton.addEventListener('click', restartGame);
