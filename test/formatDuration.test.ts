import dayjs from 'dayjs';
import { formatDuration } from '../src/utils/formatDuration';

describe('test formatDuration function', () => {
  const from = dayjs('2020-01-01 12:00');
  const to = dayjs('2020-01-02 13:00');

  it('format date', () => {
    expect(formatDuration(from, to)).toStrictEqual({
      parsedFrom: 'Wednesday 12 PM',
      parsedTo: 'Thursday 1 PM',
    });
  });
});
