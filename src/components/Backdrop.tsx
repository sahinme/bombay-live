import { useAppContext } from "../contexts/AppContext";
import AnimatedTextContent from "./AnimatedTextContent";
import Button from "./Button";

const Backdrop = () => {
  const { gameOver } = useAppContext();
  return (
    <div className={`backdrop ${gameOver ? "active" : ""}`}>
      {gameOver && (
        <div className="content">
          <AnimatedTextContent
            customKey="game-over"
            className="game-over"
            style={{
              color: "#e74c3c",
              marginBottom: "3rem",
            }}
          >
            GAME OVER
          </AnimatedTextContent>
          <Button onClick={() => window.location.reload()}>PLAY AGAIN</Button>
        </div>
      )}
    </div>
  );
};

export default Backdrop;
