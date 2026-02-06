import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getCategories, getStats, getTrending } from '../api/client'
import { timeAgo } from '../utils'

export default function HomePage() {
  const categories = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const stats = useQuery({ queryKey: ['stats'], queryFn: getStats })
  const trending = useQuery({ queryKey: ['trending'], queryFn: getTrending })

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      {stats.data && (
        <div className="flex gap-6 text-sm text-gray-500 bg-white p-3 rounded-lg border border-gray-200">
          <span><strong className="text-gray-700">{stats.data.total_threads}</strong> threads</span>
          <span><strong className="text-gray-700">{stats.data.total_posts}</strong> posts</span>
          <span><strong className="text-gray-700">{stats.data.total_categories}</strong> categories</span>
          <span><strong className="text-gray-700">{stats.data.total_tags}</strong> tags</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Categories</h2>
          {categories.isLoading && <p className="text-sm text-gray-500">Loading...</p>}
          {categories.error && <p className="text-sm text-red-500">Failed to load categories</p>}
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
            {categories.data?.map(cat => (
              <Link
                key={cat.id}
                to={`/categories/${cat.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{cat.name}</h3>
                  {cat.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>
                  )}
                </div>
                <span className="text-xs text-gray-400 shrink-0 ml-4">
                  {cat.thread_count} threads
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Trending sidebar */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Trending</h2>
          {trending.isLoading && <p className="text-sm text-gray-500">Loading...</p>}
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
            {trending.data?.slice(0, 5).map(thread => (
              <Link
                key={thread.id}
                to={`/threads/${thread.id}`}
                className="block p-3 hover:bg-gray-50"
              >
                <p className="text-sm font-medium text-gray-900 truncate">{thread.title}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span>{thread.post_count} posts</span>
                  <span>&middot;</span>
                  <span>{thread.category_name}</span>
                  <span>&middot;</span>
                  <span>{timeAgo(thread.created_at)}</span>
                </div>
              </Link>
            ))}
            {trending.data?.length === 0 && (
              <p className="p-3 text-sm text-gray-500">No trending threads yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
