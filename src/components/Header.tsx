import { useAppContext } from "../contexts/AppContext";

const Header = () => {
  const { balance, winCount, bet } = useAppContext();

  const totalBet = Object.values(bet).reduce((a, b) => a + b);

  return (
    <div className="header">
      <p>
        BALANCE: <span>{balance}</span>{" "}
      </p>
      <p>
        BET: <span>{totalBet}</span>{" "}
      </p>
      <p>
        WIN: <span>{winCount}</span>{" "}
      </p>
    </div>
  );
};

export default Header;
