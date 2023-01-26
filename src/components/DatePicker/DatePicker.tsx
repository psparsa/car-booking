import React from 'react';
import { DatePicker as AntDatePicker, Select, Tooltip } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { range } from '@/utils/range';
import { isNil } from '@/utils/isNil';
import { Reservation } from '@/reservation/get';

type SetDate = (date: Dayjs | null) => void;
type SetHour = (hour: number) => void;
interface DatePickerProps {
  values: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
    startHour: number | null;
    endHour: number | null;
  };
  onChange: {
    startDate: SetDate;
    endDate: SetDate;
    startHour: SetHour;
    endHour: SetHour;
  };
  reservations: Reservation[];
  error?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  values,
  onChange,
  reservations,
  error,
}) => {
  const { startDate, endDate, startHour, endHour } = values;
  const [reservationsOfSelectedDay, setReservationsOfSelectedDay] =
    React.useState<string[]>([]);

  const handleDateRender = (current: Dayjs) => {
    dayjs.extend(isBetween);
    const countOfReservations = reservations.filter((val) => {
      const from = dayjs(val.from);
      const isSame = current.isSame(from, 'day');
      return isSame;
    }).length;

    const style: React.CSSProperties = {
      boxShadow: `0 0 0.5rem rgba(0, 128, 0, ${countOfReservations / 10})`,
      background: `rgba(0, 128, 0, ${countOfReservations / 10})`,
    };

    const tmp = (
      <div className="ant-picker-cell-inner" style={style}>
        {current.date()}
      </div>
    );

    return countOfReservations > 0 ? (
      <Tooltip placement="top" title={`Reservations: ${countOfReservations}`}>
        {tmp}
      </Tooltip>
    ) : (
      tmp
    );
  };

  const handleDisabledDays = (current: Dayjs, end = true) => {
    const isPast = current && current < dayjs().startOf('day');
    const isSaturday = current.day() === 6;
    const isSunday = current.day() === 0;

    const isUnvalidEndDate = () => {
      if (!end || current === null || startDate === null) return false;

      const isMonday = current.day() === 1;
      const isStartDayFriday = startDate.day() === 5;

      const isBeforeStartPoint = current.isBefore(startDate);
      const isTheNextDayOfStartPoint =
        current.diff(startDate, 'days') >
        (isMonday && isStartDayFriday ? 3 : 1);
      return isTheNextDayOfStartPoint || isBeforeStartPoint;
    };

    return isPast || isSaturday || isSunday || isUnvalidEndDate();
  };

  const getAvailableHours = (end = false) => {
    if (end && startDate && startHour) {
      if (startDate.isSame(endDate, 'day')) return range(startHour + 2, 17);
      return range(9, 11);
    }
    return range(9, 17);
  };

  const formatAvilableHours = (list: number[]) =>
    list.map((x) => ({ value: x, label: x }));

  const getListOfReservations = (date: Dayjs | null) => {
    if (isNil(date)) return [];

    const formatHour = (n: number) => n + (n < 12 ? ' AM' : ' PM');

    const tmp = reservations
      .filter((x) => {
        return date?.isSame(dayjs(x.from), 'day');
      })
      .map((x) => {
        const name = x.name;
        const _from = dayjs(x.from);
        const from = _from.get('hour');
        const _to = dayjs(x.to);
        const to = _to.isSame(_from)
          ? _to.get('hour')
          : `${_to.format('dddd')} at ${formatHour(_to.get('hour'))}`;

        return `${name} - ${formatHour(from)} → ${to}`;
      });
    return tmp;
  };

  const TITLES_CLASSNAMES = 'mb-2 mt-4';
  const FIELDS_CLASSNAMES = 'w-3/4';
  return (
    <div className="flex flex-col items-center w-80 bg-gray-100 p-4 rounded-lg">
      <p className={TITLES_CLASSNAMES}>When you wanna take out the car?</p>
      <AntDatePicker
        value={startDate}
        disabledDate={(current) => handleDisabledDays(current)}
        onChange={(x) => {
          setReservationsOfSelectedDay(getListOfReservations(x));
          onChange.startDate(x);
        }}
        className={FIELDS_CLASSNAMES}
        dateRender={handleDateRender}
      />
      {!isNil(startDate) && reservationsOfSelectedDay.length > 0 && (
        <ul>
          {reservationsOfSelectedDay.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}

      <p className={TITLES_CLASSNAMES}>At what time?</p>
      <Select
        value={startHour}
        disabled={isNil(startDate)}
        onChange={(v) => onChange.startHour(v)}
        options={formatAvilableHours(getAvailableHours())}
        className={FIELDS_CLASSNAMES}
      />

      <p className={TITLES_CLASSNAMES}>When will you return the car?</p>
      <AntDatePicker
        disabled={isNil(startDate) || isNil(startHour)}
        value={endDate}
        disabledDate={(current) => handleDisabledDays(current, true)}
        onChange={(x) => onChange.endDate(x)}
        className={FIELDS_CLASSNAMES}
      />

      <p className={TITLES_CLASSNAMES}>At what time?</p>
      <Select
        value={endHour}
        disabled={isNil(startDate) || isNil(startHour) || isNil(endDate)}
        onChange={(v) => onChange.endHour(v)}
        options={formatAvilableHours(getAvailableHours(true))}
        className={FIELDS_CLASSNAMES}
      />

      {!isNil(error) && (
        <p className="mt-2 text-center text-red-700">{error}</p>
      )}
    </div>
  );
};
