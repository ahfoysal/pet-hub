export enum TakenActionEnum {
  IGNORE = 'IGNORE',
  BAN = 'BAN',
  DELETE = 'DELETE',
  HIDE = 'HIDE',
  SUSPEND = 'SUSPEND',
  REACTIVATE = 'REACTIVATE',
}

export enum SuspendDurationEnum {
  ONE_DAY = 'ONE_DAY',
  THREE_DAYS = 'THREE_DAYS',
  ONE_WEEK = 'ONE_WEEK',
  TWO_WEEKS = 'TWO_WEEKS',
  ONE_MONTH = 'ONE_MONTH',
  THREE_MONTHS = 'THREE_MONTHS',
  SIX_MONTHS = 'SIX_MONTHS',
  ONE_YEAR = 'ONE_YEAR',
}

export const suspendDurationMap: Record<SuspendDurationEnum, number> = {
  ONE_DAY: 1,
  THREE_DAYS: 3,
  ONE_WEEK: 7,
  TWO_WEEKS: 14,
  ONE_MONTH: 30,
  THREE_MONTHS: 90,
  SIX_MONTHS: 180,
  ONE_YEAR: 365,
};

export const getSuspendDuration = (duration: SuspendDurationEnum) =>
  suspendDurationMap[duration];
