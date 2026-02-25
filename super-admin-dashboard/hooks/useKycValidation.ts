import { useState, useCallback } from "react";
import {
  KycFormDataType,
  getFieldErrors,
} from "@/lib/validators/kycValidation";

interface FieldValidationResult {
  isValid: boolean;
  errors: string[];
}

export const useKycValidation = (formData: KycFormDataType) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const validateField = useCallback(
    (fieldName: keyof KycFormDataType) => {
      const errors = getFieldErrors(formData, fieldName);
      setFieldErrors((prev) => ({
        ...prev,
        [fieldName]: errors,
      }));
      return errors.length === 0;
    },
    [formData],
  );

  const validateAllFields = useCallback(() => {
    const allErrors: Record<string, string[]> = {};
    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof KycFormDataType;
      const errors = getFieldErrors(formData, fieldName);
      if (errors.length > 0) {
        allErrors[key] = errors;
        isValid = false;
      }
    });

    setFieldErrors(allErrors);
    return { isValid, errors: allErrors };
  }, [formData]);

  const clearFieldError = useCallback((fieldName: string) => {
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const hasFieldError = (fieldName: string): boolean => {
    return !!fieldErrors[fieldName] && fieldErrors[fieldName].length > 0;
  };

  const getFieldErrorMessage = (fieldName: string): string => {
    return fieldErrors[fieldName]?.[0] || "";
  };

  return {
    fieldErrors,
    validateField,
    validateAllFields,
    clearFieldError,
    hasFieldError,
    getFieldErrorMessage,
  };
};
