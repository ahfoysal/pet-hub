import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export const TransformToBoolean = () => {
  return function (target: object, key: string) {
    Transform(({ value }) => {
      if (value === undefined || value === null) return undefined;
      return value === 'true';
    })(target, key);

    IsOptional()(target, key);
    IsBoolean()(target, key);
  };
};
