import { Link } from 'react-router-dom'

export default function TagBadge({ name }: { name: string }) {
  return (
    <Link
      to={`/tags/${encodeURIComponent(name)}`}
      className="inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
    >
      {name}
    </Link>
  )
}
