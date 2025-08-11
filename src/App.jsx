import "./App.css";
import { useState } from "react";
import { languages } from "./languages";
import { clsx } from "clsx";
import { getFarewellText, getWord } from "./utils.js";
import Confetti from 'react-confetti'

export default function App() {
  //State values
  const [currentWord, setCurrentWord] = useState(() => getWord().toUpperCase());
  const [guessedLetters, setGuessedLetters] = useState([]);

  //Derived values
  const wrongGuessCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;
  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isGameLost = wrongGuessCount >= languages.length - 1;
  const isGameOver = isGameWon || isGameLost;
  const lastGuessLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessIncorrect =
    lastGuessLetter && !currentWord.includes(lastGuessLetter);
  //Static values
  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  //startNewGame function
  function startNewGame() {
    setCurrentWord(() => getWord().toUpperCase());
    setGuessedLetters([]);
    console.log("works");
  }
  
  //addGuessedLetters
  function addGuessedLetters(letter) {
    setGuessedLetters((prev) =>
      prev.includes(letter) ? prev : [...prev, letter]
    );
  }

  //letters on the display
  const word = currentWord
    .split("")
    .map((elm, idx) => {
      const shouldRevealLetter = isGameLost || guessedLetters.includes(elm)
      const letterClassName = isGameLost && !guessedLetters.includes(elm) && "missed-letter"
        return <span key={idx} className={letterClassName}>{shouldRevealLetter ? elm : null}</span>
    });

  //letters on the keyboard
  const letters = alphabets.split("").map((letter) => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);
    const ClassName = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });
    return (
      <button
        disabled={isGameOver}
        key={letter}
        className={ClassName}
        onClick={() => addGuessedLetters(letter)}
      >
        {letter}
      </button>
    );
  });
  //Dead or alive shit
  const languagesArr = languages.map((obj, idx) => {
    const styles = {
      backgroundColor: obj.backgroundColor,
      color: obj.color,
    };
    const className = idx < wrongGuessCount ? "lost" : "";
    return (
      <span key={obj.name} style={styles} className={`chip ${className}`}>
        {obj.name}
      </span>
    );
  });
  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect,
  });

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return (
        <p className="farewell-message">
          {getFarewellText(languages[wrongGuessCount - 1].name)}
        </p>
      );
    }
    if (isGameWon) {
      return (
        <>
          <Confetti/>
          <h3>YOU WIN</h3>
          <p>Well Done</p>
        </>
      );
    }
    if (isGameLost) {
      return (
        <>
          <h3>YOU LOSE</h3>
          <p>SUCKER</p>
        </>
      );
    } else {
      return null;
    }
  }

  return (
    <main>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <section className={gameStatusClass}>{renderGameStatus()}</section>
      <section className="language-chips">{languagesArr}</section>
      <section className="word">{word}</section>
      <section className="keyboard">{letters}</section>
      {isGameOver ? (
        <button onClick={() => startNewGame()} className="new-game">
          New Game
        </button>
      ) : null}
    </main>
  );
}
