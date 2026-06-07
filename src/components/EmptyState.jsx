export default function EmptyState({ icon: Icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      {Icon && (
        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-gray-400" />
        </div>
      )}
      <p className="font-semibold text-gray-700 mb-1">{title}</p>
      {desc && <p className="text-sm text-gray-400 mb-5 max-w-xs">{desc}</p>}
      {action}
    </div>
  );
}
