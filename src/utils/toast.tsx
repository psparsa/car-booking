import toast from 'react-hot-toast';

interface SuccessToastParams {
  text: string;
  hint: string;
}

export const successToast = ({ text, hint }: SuccessToastParams) =>
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="p-4 flex-1 flex flex-col items-start">
        <p className="text-sm font-medium text-gray-900">{text}</p>
        <p className="mt-1 text-sm text-gray-500">{hint}</p>
      </div>

      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className={`w-full border border-transparent rounded-none rounded-r-lg p-4 flex
          items-center justify-center text-sm font-semibold text-emerald-600`}
        >
          Okay
        </button>
      </div>
    </div>
  ));

interface ErrorToastParams {
  text: string;
}

export const errorToast = ({ text }: ErrorToastParams) =>
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto
      flex ring-1 ring-black ring-opacity-5 border-2 border-rose-500`}
    >
      <div className="p-4 flex-1 flex flex-col items-start">
        <p className="text-sm font-bold text-red-500 drop-shadow-md">{text}</p>
      </div>

      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className={`w-full border border-transparent rounded-none rounded-r-lg p-4 flex
        items-center justify-center text-sm font-semibold text-red-400 hover:text-black
        transition ease-in-out duration-20 delay-150`}
        >
          Okay
        </button>
      </div>
    </div>
  ));
