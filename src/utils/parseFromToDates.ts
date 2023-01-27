import dayjs, { Dayjs } from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
dayjs.extend(isToday);

const convert24HourTo12 = (n: number) => n + (n < 12 ? ' AM' : ' PM');

export const parseFromToDates = (from: Dayjs, to: Dayjs) => {
  const from_hour = convert24HourTo12(from.get('hour'));
  const from_nameOfDay = from.format('dddd');
  const from_isToday = dayjs(from).isToday();

  const parsedFrom = from_isToday
    ? from_hour
    : `${from_nameOfDay} ${from_hour}`;

  const to_hour = convert24HourTo12(to.get('hour'));
  const to_nameOfDay = to.format('dddd');
  const to_isToday = dayjs(to).isToday();

  const parsedTo = to_isToday ? to_hour : `${to_nameOfDay} ${to_hour}`;

  return {
    parsedFrom,
    parsedTo,
  };
};
