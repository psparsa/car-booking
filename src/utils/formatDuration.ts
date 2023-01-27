import dayjs, { Dayjs } from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
dayjs.extend(isToday);

const convert24HourTo12 = (n: number) =>
  n < 12 ? `${n} AM` : `${n - 12 === 0 ? 12 : n - 12} PM`;

export const formatDuration = (from: Dayjs, to: Dayjs) => {
  const fromDateInfo = {
    hour: convert24HourTo12(from.get('hour')),
    nameOfDay: from.format('dddd'),
    isToday: dayjs(from).isToday(),
  };

  const parsedFrom = fromDateInfo.isToday
    ? fromDateInfo.hour
    : `${fromDateInfo.nameOfDay} ${fromDateInfo.hour}`;

  const toDateInfo = {
    hour: convert24HourTo12(to.get('hour')),
    nameOfDay: to.format('dddd'),
    isToday: dayjs(to).isToday(),
  };

  const parsedTo = toDateInfo.isToday
    ? toDateInfo.hour
    : `${toDateInfo.nameOfDay} ${toDateInfo.hour}`;

  return {
    parsedFrom,
    parsedTo,
  };
};
