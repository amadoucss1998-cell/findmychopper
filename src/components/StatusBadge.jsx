const MAP = {
  approved:  'bg-green-100 text-green-700',
  active:    'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  pending:   'bg-yellow-100 text-yellow-700',
  suspended: 'bg-red-100 text-red-700',
  cancelled: 'bg-red-100 text-red-700',
  rejected:  'bg-red-100 text-red-700',
  inactive:  'bg-gray-100 text-gray-500',
  requested: 'bg-purple-100 text-purple-700',
  accepted:  'bg-orange-100 text-orange-700',
  arrived:   'bg-yellow-100 text-yellow-700',
  started:   'bg-blue-100 text-blue-700',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${MAP[status] || 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  );
}
