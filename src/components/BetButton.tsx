import React from "react";
import { Position } from "../enums/Position";
import { IButton } from "./Button";

interface IBetButton extends IButton {
  type: Position;
  balance: string | number;
  active?: boolean;
}

const classNames = {
  [Position.ROCK]: "rock",
  [Position.PAPER]: "paper",
  [Position.SCISSORS]: "scissors",
};

const BetButton: React.FC<IBetButton> = ({
  type,
  disabled,
  balance,
  active,
  onClick,
}) => {
  return (
    <button
      className={`betButton ${active ? "won" : ""} ${classNames[type]}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="indicator">{balance}</span>
      {type}
    </button>
  );
};

export default BetButton;
