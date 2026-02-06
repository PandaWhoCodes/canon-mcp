import { useQuery } from '@tanstack/react-query'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { getCategory, getThreads } from '../api/client'
import ThreadRow from '../components/ThreadRow'
import Pagination from '../components/Pagination'
import { useState } from 'react'

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const [sort, setSort] = useState('updated_at')
  const [order, setOrder] = useState('desc')

  const categoryId = Number(id)

  const category = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => getCategory(categoryId),
  })

  const threads = useQuery({
    queryKey: ['threads', categoryId, page, sort, order],
    queryFn: () => getThreads(categoryId, { page, sort, order }),
  })

  function handlePageChange(p: number) {
    setSearchParams({ page: String(p) })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {category.data?.name ?? 'Category'}
          </h1>
          {category.data?.description && (
            <p className="text-sm text-gray-500 mt-0.5">{category.data.description}</p>
          )}
        </div>
        <Link
          to={`/categories/${categoryId}/new`}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          New Thread
        </Link>
      </div>

      {/* Sort controls */}
      <div className="flex items-center gap-2 mb-3 text-xs">
        <span className="text-gray-500">Sort by:</span>
        {(['updated_at', 'created_at', 'post_count'] as const).map(s => (
          <button
            key={s}
            onClick={() => { setSort(s); setOrder('desc') }}
            className={`px-2 py-1 rounded ${sort === s ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            {s === 'updated_at' ? 'Recent Activity' : s === 'created_at' ? 'Newest' : 'Most Posts'}
          </button>
        ))}
        <button
          onClick={() => setOrder(o => o === 'asc' ? 'desc' : 'asc')}
          className="px-2 py-1 rounded text-gray-500 hover:bg-gray-100"
        >
          {order === 'desc' ? 'Desc' : 'Asc'}
        </button>
      </div>

      {threads.isLoading && <p className="text-sm text-gray-500">Loading threads...</p>}
      {threads.error && <p className="text-sm text-red-500">Failed to load threads</p>}

      {threads.data && (
        <>
          <div className="bg-white rounded-lg border border-gray-200">
            {threads.data.items.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">No threads yet. Be the first to start one!</p>
            ) : (
              threads.data.items.map(thread => (
                <ThreadRow key={thread.id} thread={thread} />
              ))
            )}
          </div>
          <Pagination
            page={threads.data.page}
            totalPages={threads.data.total_pages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
}
