export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
}

export function isUpcoming(dateStr) {
  const today = new Date().toISOString().slice(0, 10);
  return dateStr >= today;
}

export function categoryColor(cat) {
  const map = {
    Technical: 'bg-indigo-100 text-indigo-700',
    Cultural: 'bg-pink-100 text-pink-700',
    Sports: 'bg-green-100 text-green-700',
    Workshop: 'bg-amber-100 text-amber-800',
    Competition: 'bg-violet-100 text-violet-700',
    Seminar: 'bg-sky-100 text-sky-700',
    Social: 'bg-teal-100 text-teal-700',
    Other: 'bg-slate-100 text-slate-600',
  };
  return map[cat] || map.Other;
}
