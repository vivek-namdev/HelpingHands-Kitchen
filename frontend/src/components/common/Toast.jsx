import { CheckCircle2, XCircle, X } from "lucide-react";

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div className="fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-md animate-[slideIn_0.3s_ease-out] sm:right-6 sm:top-6">
      <div
        className={`
          flex items-start gap-3 rounded-2xl border
          bg-white/95 p-4 shadow-2xl backdrop-blur-xl
          ${
            isSuccess
              ? "border-green-100 shadow-green-900/10"
              : "border-red-100 shadow-red-900/10"
          }
        `}
      >
        <div
          className={`
            flex h-10 w-10 shrink-0 items-center justify-center
            rounded-xl
            ${
              isSuccess
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }
          `}
        >
          {isSuccess ? <CheckCircle2 size={21} /> : <XCircle size={21} />}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900">
            {isSuccess ? "Success" : "Registration Failed"}
          </p>

          <p className="mt-1 text-sm leading-5 text-slate-500">
            {toast.message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close notification"
        >
          <X size={17} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
