const StatCard = ({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  accent,
  loading,
}) => {
  return (
    <div
      className={`relative overflow-hidden bg-white rounded-2xl
                  border border-gray-100 shadow-sm
                  p-5 hover:shadow-lg hover:-translate-y-1
                  transition-all duration-300`}
    >
      {/* Accent line */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accent}`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          {loading ? (
            <div className="mt-2 w-16 h-9 bg-gray-200 rounded-lg animate-pulse" />
          ) : (
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
          )}
        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          <Icon size={23} className={iconColor} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
