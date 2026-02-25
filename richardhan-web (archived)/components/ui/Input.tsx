"use client";

import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  labelClass?: string;
  required?: boolean;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      labelClass,
      required = true,
      icon,
      showPasswordToggle = false,
      type,
      containerClassName = "",
      className = "",
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordWithToggle = type === "password" && showPasswordToggle;

    const getInputType = () => {
      if (!isPasswordWithToggle) return type;
      return showPassword ? "text" : "password";
    };

    return (
      <div className={`space-y-2 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={props.id}
            className={`block text-base font-medium  ${labelClass ? labelClass : "text-foreground"}`}
          >
            {label}
            {required && <span className="text-gray-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            {...props}
            ref={ref}
            type={getInputType()}
            className={`block w-full px-4 py-3 bg-background rounded-md border border-border  shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
              icon ? "pl-10" : ""
            } ${error ? "border-red-500" : ""} ${className}`}
          />
          {isPasswordWithToggle && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          )}
        </div>
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
