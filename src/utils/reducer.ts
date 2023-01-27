import type { Dayjs } from 'dayjs';

type MaybeNull<T> = T | null;

type States = {
  startDate: MaybeNull<Dayjs>;
  startHour: MaybeNull<number>;
  endDate: MaybeNull<Dayjs>;
  endHour: MaybeNull<number>;
  name: string;
};

export const initialStates: States = {
  startDate: null,
  startHour: null,
  endDate: null,
  endHour: null,
  name: '',
};

type Action =
  | {
      type: `set-${'startDate' | 'endDate'}`;
      payload: MaybeNull<Dayjs>;
    }
  | {
      type: `set-${'startHour' | 'endHour'}`;
      payload: number;
    }
  | {
      type: 'set-name';
      payload: string;
    }
  | {
      type: 'reset-states';
    };

export const reducer = (state: States, action: Action): States => {
  switch (action.type) {
    case 'set-startDate':
      return {
        ...state,
        startDate: action.payload,
        startHour: null,
        endDate: null,
      };
    case 'set-startHour':
      return {
        ...state,
        startHour: action.payload,
        endHour: null,
      };
    case 'set-endDate':
      return {
        ...state,
        endDate: action.payload,
        endHour: null,
      };
    case 'set-endHour':
      return {
        ...state,
        endHour: action.payload,
      };
    case 'set-name':
      return {
        ...state,
        name: action.payload,
      };
    case 'reset-states':
      return {
        ...initialStates,
      };
    default:
      return state;
  }
};
