import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Position } from "../enums/Position";

interface IAppContext {
  balance: number;
  winCount: number;
  gameOver: boolean;
  bet: { [key in Position]: number };
  setBet: Dispatch<SetStateAction<{ [key in Position]: number }>>;
  setGameOver: Dispatch<SetStateAction<boolean>>;
  setBalance: Dispatch<SetStateAction<number>>;
  setWinCount: Dispatch<SetStateAction<number>>;
}

export const AppContext = createContext({} as IAppContext);

export const defaultBetState = {
  [Position.ROCK]: 0,
  [Position.PAPER]: 0,
  [Position.SCISSORS]: 0,
};

const AppProvider = ({ children }: any): JSX.Element => {
  const [bet, setBet] = useState(defaultBetState);
  const [balance, setBalance] = useState(5000);
  const [winCount, setWinCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  return (
    <AppContext.Provider
      value={{
        bet,
        balance,
        winCount,
        gameOver,
        setGameOver,
        setBet,
        setWinCount,
        setBalance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): IAppContext => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppProvider");
  }

  return context;
};

export default AppProvider;
