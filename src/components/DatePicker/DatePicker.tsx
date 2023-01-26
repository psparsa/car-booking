import React from 'react';
import { DatePicker as AntDatePicker, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { range } from '@/utils/range';
import { isNil } from '@/utils/isNil';

export const DatePicker: React.FC = () => {
  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [startHour, setStartHour] = React.useState<number | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);
  const [endHour, setEndHour] = React.useState<number | null>(null);

  const getDisabledDays = (current: Dayjs, end = true) => {
    const isPast = current && current < dayjs().startOf('day');
    const isSaturday = current.day() === 6;
    const isSunday = current.day() === 0;

    const isUnvalidEndDate = () => {
      if (!end || current === null || startDate === null) return false;
      const isBeforeStartPoint = current.isBefore(startDate);
      const isTheNextDayOfStartPoint = current.diff(startDate, 'days') > 1;
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

  const TITLES_CLASSNAMES = 'mb-2 mt-4';
  const FIELDS_CLASSNAMES = 'w-3/4';
  return (
    <div className="flex flex-col items-center w-80 bg-gray-100 p-4 rounded-lg">
      <p className={TITLES_CLASSNAMES}>When you wanna take out the car?</p>
      <AntDatePicker
        value={startDate}
        disabledDate={(current) => getDisabledDays(current)}
        onChange={(x) => setStartDate(x)}
        className={FIELDS_CLASSNAMES}
      />
      <p className={TITLES_CLASSNAMES}>At what time?</p>
      <Select
        value={startHour}
        disabled={isNil(startDate)}
        onChange={(v) => setStartHour(v)}
        options={formatAvilableHours(getAvailableHours())}
        className={FIELDS_CLASSNAMES}
      />

      <p className={TITLES_CLASSNAMES}>When will you return the car?</p>
      <AntDatePicker
        disabled={isNil(startDate) || isNil(startHour)}
        value={endDate}
        disabledDate={(current) => getDisabledDays(current, true)}
        onChange={(x) => setEndDate(x)}
        className={FIELDS_CLASSNAMES}
      />

      <p className={TITLES_CLASSNAMES}>At what time?</p>
      <Select
        value={endHour}
        disabled={isNil(startDate) || isNil(startHour) || isNil(endDate)}
        onChange={(v) => setEndHour(v)}
        options={formatAvilableHours(getAvailableHours(true))}
        className={FIELDS_CLASSNAMES}
      />
    </div>
  );
};
