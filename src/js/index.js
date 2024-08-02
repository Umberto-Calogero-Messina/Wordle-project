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

const showPopUp = message => {
  popUpElement.textContent = message;
  popUpElement.classList.add('pop-up--show');
  setTimeout(() => {
    popUpElement.classList.remove('pop-up--show');
  }, 3000);
};

const disableInput = () => (inputElement.disabled = true);

const cleanInput = () => (inputElement.value = '');

const toggleButtonVisibility = showButton => {
  inputElement.classList.toggle('d-none', showButton);
  restartButton.classList.toggle('d-block', showButton);
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
  const markedLetters = Array(rightGuessString.length).fill(false);

  inputWord.split('').forEach((letter, i) => {
    const box = letterBoxes[i];
    if (letter === rightGuessString[i]) {
      animateLetterBox(box, letter, 'letter--correct', i * delayIncrement);
      rightGuessStringArray[i] = null;
      markedLetters[i] = true;
    }
  });

  inputWord.split('').forEach((letter, i) => {
    if (markedLetters[i]) return;
    const box = letterBoxes[i];
    const letterIndex = rightGuessStringArray.indexOf(letter);
    const className = letterIndex !== -1 ? 'letter--present' : 'letter--incorrect';
    animateLetterBox(box, letter, className, i * delayIncrement);
    if (letterIndex !== -1) rightGuessStringArray[letterIndex] = null;
  });
};

const updateLetterBoxes = () => {
  const currentRow = gameBoard.querySelectorAll('.letter-row')[currentGuesses];
  const letterBoxes = currentRow.querySelectorAll('.letter-box');
  let inputWord = inputElement.value;

  const regex = /^[a-zñáéíóúü]*$/i;
  if (!regex.test(inputWord[inputWord.length - 1])) {
    inputElement.value = inputWord.slice(0, -1);
    inputWord = inputElement.value;
  }

  if (inputWord.length > rightGuessString.length) {
    inputElement.value = inputWord.slice(0, rightGuessString.length);
    inputWord = inputElement.value;
  }

  letterBoxes.forEach((box, i) => {
    box.textContent = inputWord[i] || '';
  });
};

const handleSubmit = ev => {
  ev.preventDefault();
  const inputWord = ev.target.word.value;

  if (!WORDS.includes(inputWord)) {
    showPopUp(`La palabra ${inputWord} no es valida.`);
    return;
  }

  if (inputWord.length !== rightGuessString.length) {
    showPopUp(`La palabra debe tener ${rightGuessString.length} letras.`);
    return;
  }

  const currentRow = gameBoard.querySelectorAll('.letter-row')[currentGuesses];
  const letterBoxes = currentRow.querySelectorAll('.letter-box');
  checkWordle(inputWord, letterBoxes);

  currentGuesses++;

  if (inputWord === rightGuessString || currentGuesses === NUMBER_OF_GUESSES) {
    const message =
      inputWord === rightGuessString
        ? `¡Has adivinado la palabra!`
        : `No tienes más intentos. La palabra era ${rightGuessString}.`;
    showPopUp(message);
    disableInput();
    toggleButtonVisibility(true);
    return;
  }
  cleanInput();
};

const restartGame = () => {
  gameBoard.textContent = '';
  inputElement.disabled = false;
  currentGuesses = 0;
  toggleButtonVisibility(false);
  cleanInput();
  initBoard();
};

const initBoard = () => {
  const fragment = document.createDocumentFragment();
  rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];

  Array.from({ length: NUMBER_OF_GUESSES }).forEach(() => {
    const row = document.createElement('div');
    row.classList.add('letter-row');
    Array.from({ length: rightGuessString.length }).forEach(() => {
      const boxWordle = document.createElement('div');
      boxWordle.classList.add('letter-box');
      row.append(boxWordle);
    });
    fragment.append(row);
  });

  gameBoard.append(fragment);
};

initBoard();
wordleFormElement.addEventListener('submit', handleSubmit);
inputElement.addEventListener('input', updateLetterBoxes);
restartButton.addEventListener('click', restartGame);
