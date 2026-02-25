// DropdownButton.tsx
"use client";

import { ChevronDown, Check } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

type Option = {
  value: string;
  label: string;
};

type DropdownButtonProps = {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  required?: boolean;
};

const DropdownButton: React.FC<DropdownButtonProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  disabled = false,
  label = false,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label
          // htmlFor={props.id}
          className={`block text-base font-medium text-foreground} mb-2`}
        >
          {label}
          {required && <span className="text-red-500 ml-1 ">*</span>}
        </label>
      )}
      <button
        type="button"
        className={`flex items-center justify-between w-full px-4 py-3 rounded-xl bg-[#F9FAFB] border border-border shadow-md focus:outline-none focus:ring focus:ring-orange-500 ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className={`${!value ? "text-gray-400" : "text-foreground"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`ml-2 h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
          <ul>
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  className={`flex items-center cursor-pointer w-full px-4 py-2 text-left hover:bg-gray-100 ${
                    value === option.value ? "bg-orange-50 text-orange-600" : ""
                  }`}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className="flex-1">{option.label}</span>
                  {value === option.value && (
                    <Check className="h-4 w-4 text-orange-600" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
