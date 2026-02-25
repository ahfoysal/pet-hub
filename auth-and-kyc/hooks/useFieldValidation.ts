import { useState, useCallback } from "react";
import { KycFormDataType } from "@/lib/validators/kycValidation";
import { getFieldErrors } from "@/lib/validators/kycValidation";

interface FieldError {
  field: keyof KycFormDataType;
  errors: string[];
}

export const useFieldValidation = (formData: KycFormDataType) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const validateField = useCallback(
    (fieldName: keyof KycFormDataType) => {
      const errors = getFieldErrors(formData, fieldName);
      setFieldErrors((prev) => ({
        ...prev,
        [fieldName]: errors,
      }));
      return errors;
    },
    [formData],
  );

  const clearFieldError = useCallback((fieldName: keyof KycFormDataType) => {
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const validateAllFields = useCallback(() => {
    const allErrors: Record<string, string[]> = {};
    const fieldNames = Object.keys(formData) as (keyof KycFormDataType)[];

    fieldNames.forEach((fieldName) => {
      const errors = getFieldErrors(formData, fieldName);
      if (errors.length > 0) {
        allErrors[fieldName] = errors;
      }
    });

    setFieldErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  }, [formData]);

  return {
    fieldErrors,
    validateField,
    clearFieldError,
    validateAllFields,
  };
};
