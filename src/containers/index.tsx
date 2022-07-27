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
  const [winnerType, setWinnerType] = useState<PlayerType | null>(null);
  const [showWinner, setShowWinner] = useState(false);
  const [returnedBalance, setReturnedBalance] = useState(0);

  const timerRef = useRef<string | number | NodeJS.Timeout | undefined>(0);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const {
    setBalance,
    balance,
    setWinCount,
    bet,
    setBet,
    setGameOver,
    gameOver,
  } = useAppContext();

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
    [balance, bet]
  );

  const handleRandomBet = () => {
    const randomBet = getRandomKeyFromArray(
      Object.values(Position)
    ) as Position;
    setComputerBet(randomBet);
    return randomBet;
  };

  const isMultipleChoice = () => {
    let count = 0;
    Object.values(bet).map((i: number) => {
      if (i > 0) count += 1;
    });
    return count > 1;
  };

  const handleUserWin = (type: Position, multiplier: number) => {
    setBalance((balance: number) => (balance += bet[type] * multiplier));
    setReturnedBalance(bet[type] * multiplier);
    setWinCount((count) => (count += 1));
    setWinnerBet(type);
    setWinnerType(PlayerType.USER);
  };

  const handleTie = () => {
    //tie logic can be added if needed
  };

  const handleComputerWin = (position: Position) => {
    setWinnerBet(position);
    setWinnerType(PlayerType.COMPUTER);
  };

  const handleGameOver = useCallback(() => {
    timerRef.current = setTimeout(() => {
      if (balance < 500) setGameOver(true);
    }, 500);
  }, [balance]);

  const selectedPosition = () =>
    //@ts-ignore
    Object.keys(bet).find((o: Position) => bet[o] > 0);

  const onPlay = () => {
    const randomBet = handleRandomBet();
    const userPosition = selectedPosition();
    if (isMultipleChoice()) {
      switch (randomBet) {
        case Position.PAPER:
          if (bet.SCISSORS > 0) {
            handleUserWin(Position.SCISSORS, 3);
          } else {
            handleTie();
          }

          break;
        case Position.ROCK:
          if (bet.PAPER > 0) {
            handleUserWin(Position.PAPER, 3);
          } else {
            handleTie();
          }

          break;
        case Position.SCISSORS:
          if (bet.ROCK > 0) {
            handleUserWin(Position.ROCK, 3);
          } else {
            handleTie();
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
            handleComputerWin(Position.SCISSORS);
          } else {
            handleTie();
          }
          break;
        case Position.ROCK:
          if (randomBet === Position.SCISSORS) {
            handleUserWin(Position.ROCK, 14);
          } else if (randomBet === Position.PAPER) {
            handleComputerWin(Position.PAPER);
          } else {
            handleTie();
          }
          break;
        case Position.SCISSORS:
          if (randomBet === Position.PAPER) {
            handleUserWin(Position.SCISSORS, 14);
          } else if (randomBet === Position.ROCK) {
            handleComputerWin(Position.ROCK);
          } else {
            handleTie();
          }
          break;
        default:
          break;
      }
    }
  };

  const isBetEmpty = Object.values(bet).reduce((a, b) => a + b) <= 0;

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
              {Object.keys(bet)
                .filter((i: string) => bet[i as Position] > 0)
                .map((i) => (
                  <h1 key={i}>{i}</h1>
                ))}
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
            {winnerType!! && (
              <AnimatedTextContent
                onAnimationComplete={() => {
                  handleGameOver();
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
            )}
          </div>
        )}
      </div>

      <div className="container-footer">
        {!computerBet && (
          <h3 className="container-pick-text">Pick your positions</h3>
        )}
        <div className="container-buttons">
          <BetButton
            active={winnerBet === Position.ROCK}
            balance={bet.ROCK}
            disabled={balance === 0 || !!computerBet}
            type={Position.ROCK}
            onClick={() => handleBet(Position.ROCK)}
          />
          <BetButton
            active={winnerBet === Position.PAPER}
            balance={bet.PAPER}
            disabled={balance === 0 || !!computerBet}
            type={Position.PAPER}
            onClick={() => handleBet(Position.PAPER)}
          />
          <BetButton
            active={winnerBet === Position.SCISSORS}
            balance={bet.SCISSORS}
            disabled={balance === 0 || !!computerBet}
            type={Position.SCISSORS}
            onClick={() => handleBet(Position.SCISSORS)}
          />
        </div>

        {computerBet ? (
          <Button
            onClick={() => {
              setBet(defaultBetState);
              setComputerBet(null);
              setShowWinner(false);
              setWinnerBet(null);
              setWinnerType(null);
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
