import { ArrowRight, Sparkles } from "lucide-react";

const PagePlaceholder = ({
  icon: Icon,
  eyebrow,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-150px)] max-w-6xl items-center justify-center">
      <div className="relative w-full overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-12">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-green-100/70 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-orange-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50 text-green-600 shadow-inner">
            <Icon size={34} strokeWidth={1.8} />
          </div>

          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-green-100 bg-green-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-green-700">
            <Sparkles size={13} />
            {eyebrow}
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            {description}
          </p>

          {actionText && (
            <button
              onClick={onAction}
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:-translate-y-0.5 hover:bg-green-600"
            >
              {actionText}

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PagePlaceholder;
