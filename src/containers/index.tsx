import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import BetButton from "../components/BetButton";
import Button from "../components/Button";
import { defaultBetState, useAppContext } from "../contexts/AppContext";
import { PlayerType, Position } from "../enums/Position";
import { getRandomKeyFromArray } from "../utils";
import AnimatedTextContent from "../components/AnimatedTextContent";

const Container = () => {
  const [computerBet, setComputerBet] = useState<Position | null>(null);
  const [winnerBet, setWinnerBet] = useState<Position | null>(null);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [winnerType, setWinnerType] = useState<PlayerType | null>(null);
  const [showWinner, setShowWinner] = useState(false);
  const [returnedBalance, setReturnedBalance] = useState(0);
  const [isClearButtonActive, setIsClearButtonActive] = useState(false);

  const timerRefs = useRef<Array<string | number | NodeJS.Timeout | undefined>>(
    []
  );

  useEffect(() => {
    return () =>
      timerRefs.current.forEach((id) => {
        clearTimeout(id);
      });
  }, []);

  const {
    balance,
    bet,
    gameOver,
    setBalance,
    setWinCount,
    setBet,
    setGameOver,
  } = useAppContext();

  const handleRandomBet = () => {
    const randomBet = getRandomKeyFromArray(
      Object.values(Position)
    ) as Position;
    setComputerBet(randomBet);
    return randomBet;
  };

  const isMultipleChoice = useCallback(() => {
    let count = 0;
    Object.values(bet).map((i: number) => {
      if (i > 0) count += 1;
    });
    return count > 1;
  }, [bet]);

  const handleBet = useCallback(
    (position: Position) => {
      if (isMultipleChoice() && bet[position] === 0) {
        return;
      }
      const newBet = { ...bet };
      newBet[position] += 500;
      setBet(newBet);
      setBalance((balance: number) => (balance -= 500));
    },
    [bet, isMultipleChoice, setBalance, setBet]
  );

  const handleUserWin = (position: Position, multiplier: number) => {
    setCurrentPosition(position);
    const timer = setTimeout(() => {
      setBalance((balance: number) => (balance += bet[position] * multiplier));
      setReturnedBalance(bet[position] * multiplier);
      setWinCount((count) => (count += 1));
      setWinnerBet(position);
      setWinnerType(PlayerType.USER);
    }, 3000);
    timerRefs.current.push(timer);
  };

  const handleTie = (position: Position) => {
    setCurrentPosition(position);
  };

  const handleComputerWin = (position: Position, userPosition: Position) => {
    setWinnerBet(position);
    setWinnerType(PlayerType.COMPUTER);
    setCurrentPosition(userPosition);
  };

  const handleGameOver = useCallback(() => {
    const timer = setTimeout(() => {
      if (balance < 500) setGameOver(true);
    }, 500);
    timerRefs.current.push(timer);
  }, [balance, setGameOver]);

  const selectedPosition = () =>
    Object.keys(bet).find((o) => bet[o as keyof typeof Position] > 0);

  const onPlay = () => {
    const randomBet = handleRandomBet();
    const userPosition = selectedPosition();
    if (isMultipleChoice()) {
      switch (randomBet) {
        case Position.PAPER:
          if (bet.SCISSORS > 0) {
            handleUserWin(Position.SCISSORS, 3);
          } else {
            handleComputerWin(Position.PAPER, Position.ROCK);
          }

          break;
        case Position.ROCK:
          if (bet.PAPER > 0) {
            handleUserWin(Position.PAPER, 3);
          } else {
            handleComputerWin(Position.ROCK, Position.SCISSORS);
          }

          break;
        case Position.SCISSORS:
          if (bet.ROCK > 0) {
            handleUserWin(Position.ROCK, 3);
          } else {
            handleComputerWin(Position.SCISSORS, Position.PAPER);
          }

          break;
        default:
          return;
      }
    } else {
      switch (userPosition) {
        case Position.PAPER:
          if (randomBet === Position.ROCK) {
            handleUserWin(Position.PAPER, 14);
          } else if (randomBet === Position.SCISSORS) {
            handleComputerWin(Position.SCISSORS, userPosition);
          } else {
            handleTie(userPosition);
          }
          break;
        case Position.ROCK:
          if (randomBet === Position.SCISSORS) {
            handleUserWin(Position.ROCK, 14);
          } else if (randomBet === Position.PAPER) {
            handleComputerWin(Position.PAPER, userPosition);
          } else {
            handleTie(userPosition);
          }
          break;
        case Position.SCISSORS:
          if (randomBet === Position.PAPER) {
            handleUserWin(Position.SCISSORS, 14);
          } else if (randomBet === Position.ROCK) {
            handleComputerWin(Position.ROCK, userPosition);
          } else {
            handleTie(userPosition);
          }
          break;
        default:
          break;
      }
    }
  };

  const isBetEmpty = Object.values(bet).reduce((a, b) => a + b) <= 0;
  const isUserWon = winnerType === PlayerType.USER;

  return (
    <div className="container">
      <div className="win-section">
        {computerBet && !showWinner && (
          <motion.div
            className="versus-title"
            key="bets"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}
            onAnimationComplete={() => {
              setShowWinner(true);
            }}
          >
            <h1>{computerBet}</h1>
            <span>VS</span>
            <div>
              <h1>{currentPosition}</h1>
            </div>
          </motion.div>
        )}
        {showWinner && !gameOver && (
          <div>
            <AnimatedTextContent
              onAnimationComplete={() => {
                handleGameOver();
              }}
              customKey="result-title"
              style={{
                color: !winnerType
                  ? "white"
                  : winnerType === PlayerType.USER
                  ? "#27ae60"
                  : "#e74c3c",
              }}
            >
              {!winnerType ? "TIE" : `${winnerBet} WON`}
            </AnimatedTextContent>
            <AnimatedTextContent
              onAnimationComplete={() => {
                handleGameOver();
                setIsClearButtonActive(true);
              }}
              customKey="winner-title"
              style={{
                color: !winnerType
                  ? "white"
                  : winnerType === PlayerType.USER
                  ? "#27ae60"
                  : "#e74c3c",
              }}
            >
              {winnerType === PlayerType.USER ? (
                <span className="win-title">
                  YOU WIN <span>{returnedBalance.toFixed(2)}</span>
                </span>
              ) : (
                <span className="lost-title">YOU LOST</span>
              )}
            </AnimatedTextContent>
          </div>
        )}
      </div>

      <div className="container-footer">
        {!computerBet && (
          <h3 className="container-pick-text">Pick your positions</h3>
        )}
        <div className="container-buttons">
          <BetButton
            active={winnerBet === Position.ROCK && isUserWon}
            balance={bet.ROCK}
            disabled={balance === 0 || !!computerBet}
            type={Position.ROCK}
            onClick={() => handleBet(Position.ROCK)}
          />
          <BetButton
            active={winnerBet === Position.PAPER && isUserWon}
            balance={bet.PAPER}
            disabled={balance === 0 || !!computerBet}
            type={Position.PAPER}
            onClick={() => handleBet(Position.PAPER)}
          />
          <BetButton
            active={winnerBet === Position.SCISSORS && isUserWon}
            balance={bet.SCISSORS}
            disabled={balance === 0 || !!computerBet}
            type={Position.SCISSORS}
            onClick={() => handleBet(Position.SCISSORS)}
          />
        </div>

        {computerBet ? (
          <Button
            disabled={!isClearButtonActive}
            onClick={() => {
              setBet(defaultBetState);
              setComputerBet(null);
              setShowWinner(false);
              setWinnerBet(null);
              setWinnerType(null);
              setIsClearButtonActive(false);
            }}
          >
            CLEAR
          </Button>
        ) : (
          <Button disabled={isBetEmpty} onClick={() => onPlay()}>
            PLAY
          </Button>
        )}
      </div>
    </div>
  );
};

export default Container;
