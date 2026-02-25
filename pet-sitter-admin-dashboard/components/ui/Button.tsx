"use client";

import React from "react";
import Link from "next/link";

// Define the possible variants
const variantStyles = {
  primary: "bg-primary hover:bg-primary/50 text-primary-foreground",
  secondary: "bg-secondary hover:bg-secondary/90 text-secondary-foreground",
  outline:
    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  common: "bg-gray-200 hover:bg-gray-300 text-gray-800",
};

// Define the possible sizes
const sizeStyles = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 p-6",
  lg: "h-11 px-10 text-lg",
  icon: "h-10 w-10",
};

// Define the possible icon positions
type IconPosition = "left" | "right";

interface BaseButtonProps {
  text?: string;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  className?: string;
  isOpen?: boolean;
  animationIndex?: number;
  children?: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

interface LinkButtonProps extends BaseButtonProps {
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

interface ClickableButtonProps extends BaseButtonProps {
  href?: never;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
}

// Union the two interfaces to ensure either href or onClick is provided, but not both
type ButtonProps = LinkButtonProps | ClickableButtonProps;

function Button({
  text,
  icon,
  iconPosition = "right",
  variant = "primary",
  size = "md",
  className = "",
  isOpen = false,
  animationIndex = 0,
  href,
  onClick,
  children,
  disabled = false,
  type = "button",
}: ButtonProps) {
  // Determine the base styles
  const baseStyles = ` rounded-sm flex items-center transition-all duration-300  
    ${
      disabled
        ? "cursor-not-allowed opacity-50"
        : "cursor-pointer group transform font-medium justify-center hover:scale-105 active:scale-90 duration-300"
    }
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${isOpen ? "animate-mobile-menu-item" : ""}
    ${className}`;

  // Determine icon spacing based on position
  const iconSpacing =
    size === "icon" ? "" : iconPosition === "left" ? "mr-2" : "ml-2";

  const content = (
    <>
      {icon && iconPosition === "left" && (
        <span
          className={`${iconSpacing} transition-transform duration-300 group-hover:translate-x-1`}
        >
          {icon}
        </span>
      )}
      {text && <span>{text}</span>}
      {children}
      {icon && iconPosition === "right" && (
        <span
          className={`${iconSpacing} transition-transform duration-300 group-hover:-translate-x-1`}
        >
          {icon}
        </span>
      )}
    </>
  );

  // If href is provided, render as Link, otherwise as button
  if (href) {
    return (
      <Link
        href={disabled ? "#" : href}
        onClick={
          disabled
            ? (e) => e.preventDefault()
            : (onClick as React.MouseEventHandler<HTMLAnchorElement>) ||
              undefined
        }
        className={baseStyles}
        style={{
          animationDelay: isOpen ? `${animationIndex * 80 + 150}ms` : "0ms",
        }}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={
        disabled
          ? undefined
          : (onClick as React.MouseEventHandler<HTMLButtonElement>)
      }
      className={baseStyles}
      disabled={disabled}
      style={{
        animationDelay: isOpen ? `${animationIndex * 80 + 150}ms` : "0ms",
      }}
    >
      {content}
    </button>
  );
}

export default Button;
export { Button };
