"use client";

import PhoneInput from "react-phone-number-input";
import { E164Number } from "libphonenumber-js";
import "react-phone-number-input/style.css";

interface PhoneInputProps {
  label?: string;
  value?: string;
  onChange: (value?: E164Number) => void;
  error?: string;
  required?: boolean;
  containerClassName?: string;
}

export default function PhoneNumberInput({
  label,
  value,
  onChange,
  error,
  required = true,
  containerClassName = "",
}: PhoneInputProps) {
  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="block text-base font-medium text-foreground">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={`rounded-md border bg-background px-3 py-2
        
        ${error ? "border-red-500" : "border-[#e9e9e9]"}`}
      >
        <PhoneInput
          international
          defaultCountry="KR"
          value={value}
          onChange={onChange}
          className="flex items-center gap-2"
          numberInputProps={{
            className: `
              w-full bg-transparent text-sm
              outline-none border-none ring-0
              focus:outline-none focus:ring-0
            `,
          }}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
