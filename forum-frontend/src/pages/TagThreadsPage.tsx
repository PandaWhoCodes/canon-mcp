import { useQuery } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'react-router-dom'
import { getThreadsByTag } from '../api/client'
import ThreadRow from '../components/ThreadRow'
import Pagination from '../components/Pagination'

export default function TagThreadsPage() {
  const { name } = useParams<{ name: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const tagName = decodeURIComponent(name || '')

  const threads = useQuery({
    queryKey: ['tagThreads', tagName, page],
    queryFn: () => getThreadsByTag(tagName, { page }),
    enabled: !!tagName,
  })

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-4">
        Threads tagged <span className="text-blue-600">#{tagName}</span>
      </h1>

      {threads.isLoading && <p className="text-sm text-gray-500">Loading...</p>}
      {threads.error && <p className="text-sm text-red-500">Failed to load threads</p>}

      {threads.data && (
        <>
          <div className="bg-white rounded-lg border border-gray-200">
            {threads.data.items.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">No threads with this tag</p>
            ) : (
              threads.data.items.map(thread => (
                <ThreadRow key={thread.id} thread={thread} />
              ))
            )}
          </div>
          <Pagination
            page={threads.data.page}
            totalPages={threads.data.total_pages}
            onPageChange={p => setSearchParams({ page: String(p) })}
          />
        </>
      )}
    </div>
  )
}
