import React from 'react';
import { cc } from '@/utils/combineClassNames';
import { debounce } from '@/utils/debounce';

interface NameFormProps {
  name: string;
  onChange: (name: string) => void;
  onSubmit: () => void;
  disable?: boolean;
  className?: string;
}

export const NameForm: React.FC<NameFormProps> = ({
  name,
  onChange,
  onSubmit,
  disable,
  className,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^[a-zA-Z ]*$/.test(value) || value === '') onChange(value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSubmit = React.useCallback(debounce(onSubmit, 500), []);

  return (
    <div
      className={cc([
        className,
        `flex flex-col items-center w-80 bg-gray-100 p-4 rounded-lg shadow-lg`,
        disable && 'opacity-70',
      ])}
    >
      <p>Please Enter your name:</p>
      <input
        value={name}
        onChange={handleChange}
        type="string"
        maxLength={20}
        className="mt-2 border-solid border-2 rounded-sm border-cyan-500 text-center"
        disabled={disable}
      />

      <button
        className={cc([
          `bg-zinc-600 transition ease-in-out delay-50 text-green-50 px-2 py-1 rounded-md mt-2 w-24`,
          !disable && 'hover:bg-zinc-800',
        ])}
        disabled={disable || name.length === 0}
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};
