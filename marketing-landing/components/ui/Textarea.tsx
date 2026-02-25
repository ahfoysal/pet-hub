"use client";

import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  labelClass?: string;
  required?: boolean;
  icon?: React.ReactNode;
  containerClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      labelClass,
      required = true,
      icon,
      containerClassName = "",
      className = "",
      rows = 4,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={`space-y-2 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={props.id}
            className={`block text-base font-medium ${
              labelClass ? labelClass : "text-foreground"
            }`}
          >
            {label}
            {required && <span className="text-gray-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute top-3 left-3 pointer-events-none">
              {icon}
            </div>
          )}

          <textarea
            {...props}
            ref={ref}
            rows={rows}
            className={`block w-full px-4 py-3 bg-background rounded-md border border-border shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm resize-none ${
              icon ? "pl-10" : ""
            } ${error ? "border-red-500" : ""} ${className}`}
          />
        </div>

        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
