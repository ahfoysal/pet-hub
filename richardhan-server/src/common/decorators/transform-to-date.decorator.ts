import { Transform } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export const TransformToDate = () => {
  return function (target: object, key: string) {
    Transform(({ value }: { value: string | number | Date }) => {
      if (!value) return undefined;
      const date = new Date(value);
      return isNaN(date.getTime()) ? undefined : date;
    })(target, key);

    IsOptional()(target, key);
    IsDate()(target, key);
  };
};
