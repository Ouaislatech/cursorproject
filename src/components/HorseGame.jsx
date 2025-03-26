import React, { useState, useEffect, useCallback } from "react";
import "./HorseGame.css";

const HorseGame = () => {
  const [horsePosition, setHorsePosition] = useState(0);
  const [obstaclePosition, setObstaclePosition] = useState(600);
  const [isJumping, setIsJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [hasJumped, setHasJumped] = useState(false);
  const [level, setLevel] = useState(1);
  const [obstaclesPassed, setObstaclesPassed] = useState(0);
  const [backgroundOffset, setBackgroundOffset] = useState(0);
  const [isHayBale, setIsHayBale] = useState(false);

  const jump = useCallback(() => {
    if (!isJumping && !gameOver) {
      setIsJumping(true);
      setHasJumped(true);
      setHorsePosition((prev) => prev + 100);
      setTimeout(() => {
        setIsJumping(false);
        setHorsePosition((prev) => prev - 100);
      }, 500);
    }
  }, [isJumping, gameOver]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === "Space") {
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [jump]);

  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      setObstaclePosition((prev) => {
        if (prev <= -50) {
          if (!hasJumped) {
            setGameOver(true);
            return prev;
          }
          setScore((s) => s + 1);
          setObstaclesPassed((prev) => {
            const newCount = prev + 1;
            // Augmenter le niveau tous les 10 obstacles
            if (newCount % 10 === 0) {
              setLevel((l) => l + 1);
            }
            return newCount;
          });
          setHasJumped(false);
          setIsHayBale((prev) => !prev);

          if (obstaclesPassed + 1 >= 10) {
            setGameOver(true);
            return prev;
          }

          return 600;
        }
        return prev - (10 + level); // Augmenter la vitesse avec le niveau
      });

      // Mise à jour du parallaxe avec une vitesse plus lente
      setBackgroundOffset((prev) => (prev + 0.5) % 100);

      // Zone de collision plus précise
      const horseLeft = 100;
      const horseRight = horseLeft + 50;
      const horseTop = horsePosition;
      const horseBottom = horsePosition + 50;

      const obstacleLeft = obstaclePosition;
      const obstacleRight = obstaclePosition + 30;
      const obstacleTop = 0;
      const obstacleBottom = 50;

      const collisionHorizontal =
        horseLeft < obstacleRight && horseRight > obstacleLeft;
      const collisionVertical =
        horseTop < obstacleBottom && horseBottom > obstacleTop;

      if (collisionHorizontal && collisionVertical) {
        setGameOver(true);
      }
    }, 50);

    return () => clearInterval(gameLoop);
  }, [
    obstaclePosition,
    isJumping,
    gameOver,
    horsePosition,
    hasJumped,
    obstaclesPassed,
    level,
  ]);

  const resetGame = () => {
    setHorsePosition(0);
    setObstaclePosition(600);
    setIsJumping(false);
    setGameOver(false);
    setScore(0);
    setHasJumped(false);
    setObstaclesPassed(0);
    setBackgroundOffset(0);
    setIsHayBale(false);
  };

  return (
    <div className="game-container">
      <h1 className="game-title">Le jeu de dada trop cool</h1>
      <div className="game-info">
        <div className="score">Score: {score}</div>
        <div className="level">Niveau: {level}</div>
        <div className="obstacles">Obstacles passés: {obstaclesPassed}/10</div>
      </div>
      <div className="game-area">
        <div
          className={`horse ${isJumping ? "jumping" : ""}`}
          style={{ bottom: `${horsePosition}px` }}
        >
          🐎
        </div>
        <div
          className={`obstacle ${isHayBale ? "hay-bale" : ""}`}
          style={{ left: `${obstaclePosition}px` }}
        >
          {isHayBale ? "🌾" : "🪵"}
        </div>
        <div
          className="background-layer"
          style={{
            transform: `translateX(-${backgroundOffset}px)`,
            backgroundColor: "#90EE90",
          }}
        />
      </div>
      {gameOver && (
        <div className="game-over">
          <h2>{obstaclesPassed >= 10 ? "Félicitations !" : "Game Over!"}</h2>
          <p>Score final: {score}</p>
          <p>
            {obstaclesPassed >= 10
              ? "Vous avez terminé le niveau 1 de dada trop cool !"
              : "Dada est tombé !"}
          </p>
          <button onClick={resetGame}>Rejouer</button>
        </div>
      )}
      <div className="instructions">
        Appuyez sur la barre d'espace pour faire sauter le cheval
      </div>
    </div>
  );
};

export default HorseGame;
