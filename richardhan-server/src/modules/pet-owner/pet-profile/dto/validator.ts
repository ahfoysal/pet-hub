import { registerDecorator, ValidationOptions } from 'class-validator';

const isValidPetAge = (value: unknown): boolean => {
  if (typeof value !== 'string') return false;

  const trimmedValue = value.trim();

  const ageRegex =
    /^([1-9]\d*)\s(day|days|week|weeks|month|months|year|years)$/;

  const match = trimmedValue.match(ageRegex);
  if (!match) return false;

  const amount = Number(match[1]);
  const unit = match[2];

  const MAX_LIMIT_BY_UNIT: Record<string, number> = {
    day: 90,
    days: 90,
    week: 52,
    weeks: 52,
    month: 240,
    months: 240,
    year: 30,
    years: 30,
  };

  return amount <= MAX_LIMIT_BY_UNIT[unit];
};

export const IsPetAgeWithLimit =
  (validationOptions?: ValidationOptions) =>
  (object: object, propertyName: string) => {
    registerDecorator({
      name: 'IsPetAgeWithLimit',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: unknown) => isValidPetAge(value),
      },
    });
  };

const isValidPetWeight = (value: unknown): boolean => {
  if (typeof value !== 'string') return false;

  const trimmedValue = value.trim();

  // Accepts integers or decimals, followed by a space and unit
  const weightRegex = /^(\d+(\.\d+)?)\s(g|kg|lb|lbs)$/i;

  const match = trimmedValue.match(weightRegex);
  if (!match) return false;

  const amount = Number(match[1]);
  return amount > 0; // weight must be positive
};

export const IsPetWeight =
  (validationOptions?: ValidationOptions) =>
  (object: object, propertyName: string) => {
    registerDecorator({
      name: 'IsPetWeight',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: unknown) => isValidPetWeight(value),
      },
    });
  };
