import React, {
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
} from "react";
import classnames from "classnames";

import DotLoader from "./DotsLoader";

export type ButtonVariant = "primary" | "secondary" | "text";
interface ButtonProps {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  icon?: ReactElement;
  type?: "button" | "submit";
  iconPosition?: "left" | "right" | "center";
  disabled?: boolean;
  capitalize?: boolean;
  className?: string;
  dataCy?: string;
  fullWidth?: boolean;
  loading?: boolean;
  shadow?: "shadow-lg" | "shadow-glow" | "shadow-glow-lg" | "shadow-none";
}

const Button = ({
  children,
  size = "md",
  variant = "primary",
  icon,
  iconPosition = "left",
  onClick,
  type = "button",
  disabled = false,
  capitalize = false,
  className,
  loading,
  dataCy = "button",
  fullWidth,
  shadow = "shadow-lg",
}: ButtonProps): ReactElement => {
  const resolveIconClassName = classnames(
    { "w-4 h-4": size === "sm" },
    { "w-4 h-4": size === "md" },
    { "w-5 h-5": size === "lg" },
    { "w-6 h-6": size === "xl" },
    { "mr-2": iconPosition === "left" },
    { "ml-2": iconPosition === "right" },
  );

  return (
    <button
      className={classnames(
        "btn flex flex-row items-center",
        { "px-3 py-1 text-sm": size === "sm" },
        { "px-6 py-2 text-base": size === "md" },
        { "px-7 py-3 text-base": size === "lg" },
        { "px-9 py-4 text-lg": size === "xl" },
        {
          "bg-gray-900 text-white": variant === "primary",
        },
        {
          "border border-gray-900 text-gray-900":
            variant === "secondary" && !disabled,
        },
        {
          "border border-gray-900/50 text-gray-900/50":
            variant === "secondary" && disabled,
        },
        {
          "!w-full justify-center rounded text-center": fullWidth,
        },
        {
          "w-fit": !fullWidth,
        },

        {
          "text-gray-900 shadow-none hover:text-gray-400": variant === "text",
        },
        {
          "cursor-not-allowed bg-opacity-50 shadow-none hover:shadow-none":
            disabled,
        },
        shadow,
        className,
      )}
      data-cy={dataCy}
      disabled={disabled || loading}
      type={type}
      onClick={onClick}
    >
      {icon &&
        iconPosition === "left" &&
        React.cloneElement(icon, { className: resolveIconClassName })}

      {loading && !icon && (
        <span className="mx-8 flex items-center">
          <DotLoader />
        </span>
      )}

      {children && !loading && (
        <span className={capitalize ? "capitalize" : ""}>{children}</span>
      )}
      {!children &&
        icon &&
        iconPosition === "center" &&
        React.cloneElement(icon, { className: resolveIconClassName })}
      {icon &&
        iconPosition === "right" &&
        React.cloneElement(icon, { className: resolveIconClassName })}
    </button>
  );
};

export default Button;
