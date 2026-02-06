import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { getThread, getPosts, createPost } from '../api/client'
import PostCard from '../components/PostCard'
import TagBadge from '../components/TagBadge'
import Pagination from '../components/Pagination'
import { timeAgo } from '../utils'
import { useState } from 'react'

export default function ThreadPage() {
  const { id } = useParams<{ id: string }>()
  const threadId = Number(id)
  const [page, setPage] = useState(1)
  const [replyContent, setReplyContent] = useState('')
  const [authorName, setAuthorName] = useState('')
  const qc = useQueryClient()

  const thread = useQuery({
    queryKey: ['thread', threadId],
    queryFn: () => getThread(threadId),
  })

  const posts = useQuery({
    queryKey: ['posts', threadId, page],
    queryFn: () => getPosts(threadId, { page }),
  })

  const replyMutation = useMutation({
    mutationFn: () =>
      createPost({
        thread_id: threadId,
        author_name: authorName || 'anonymous',
        content: replyContent,
      }),
    onSuccess: () => {
      setReplyContent('')
      qc.invalidateQueries({ queryKey: ['posts', threadId] })
      qc.invalidateQueries({ queryKey: ['thread', threadId] })
    },
  })

  function handleReply(e: React.FormEvent) {
    e.preventDefault()
    if (!replyContent.trim()) return
    replyMutation.mutate()
  }

  return (
    <div>
      {/* Thread header */}
      {thread.data && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Link to={`/categories/${thread.data.category_id}`} className="hover:text-blue-600">
              Back to category
            </Link>
          </div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {thread.data.is_pinned ? <span className="text-xs text-green-600 font-medium">PINNED</span> : null}
            {thread.data.is_locked ? <span className="text-xs text-red-500 font-medium">LOCKED</span> : null}
            {thread.data.title}
          </h1>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <span>by <strong className="text-gray-700">{thread.data.author_name}</strong></span>
            <span>&middot;</span>
            <span>{timeAgo(thread.data.created_at)}</span>
            <span>&middot;</span>
            <span>{thread.data.post_count} posts</span>
          </div>
          {thread.data.tags && thread.data.tags.length > 0 && (
            <div className="flex gap-1 mt-2">
              {thread.data.tags.map(tag => <TagBadge key={tag} name={tag} />)}
            </div>
          )}
        </div>
      )}

      {/* Posts */}
      {posts.isLoading && <p className="text-sm text-gray-500">Loading posts...</p>}
      {posts.error && <p className="text-sm text-red-500">Failed to load posts</p>}

      {posts.data && (
        <>
          <div className="space-y-0 bg-white rounded-lg border border-gray-200 overflow-hidden">
            {posts.data.items.map((post, i) => (
              <PostCard key={post.id} post={post} isOriginal={i === 0 && page === 1} />
            ))}
          </div>
          <Pagination
            page={posts.data.page}
            totalPages={posts.data.total_pages}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Reply form */}
      {thread.data && !thread.data.is_locked && (
        <form onSubmit={handleReply} className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Reply</h3>
          <input
            type="text"
            placeholder="Your name (optional, defaults to anonymous)"
            value={authorName}
            onChange={e => setAuthorName(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={replyContent}
            onChange={e => setReplyContent(e.target.value)}
            placeholder="Write your reply..."
            rows={4}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
          <div className="flex items-center justify-between mt-2">
            {replyMutation.error && (
              <p className="text-xs text-red-500">{(replyMutation.error as Error).message}</p>
            )}
            <button
              type="submit"
              disabled={!replyContent.trim() || replyMutation.isPending}
              className="ml-auto px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {replyMutation.isPending ? 'Posting...' : 'Post Reply'}
            </button>
          </div>
        </form>
      )}

      {thread.data?.is_locked && (
        <p className="mt-4 text-sm text-gray-500 italic">This thread is locked. No new replies can be posted.</p>
      )}
    </div>
  )
}
