export const now = (): Date => {
  return new Date();
};

export const today = (): Date => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

export const formatISO = (date: Date): string => {
  return date.toISOString();
};
