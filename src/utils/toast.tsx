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
      <div className="p-3 flex-1 flex flex-col items-start">
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
