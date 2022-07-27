import React, { MouseEventHandler } from "react";

export interface IButton {
  children?: any;
  onClick: MouseEventHandler<HTMLButtonElement> | undefined;
  disabled?: boolean;
}

const Button: React.FC<IButton> = ({ children, onClick, disabled }) => {
  return (
    <button className="pick-button" disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
