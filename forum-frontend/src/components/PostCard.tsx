import type { Post } from '../api/types'
import VoteButtons from './VoteButtons'
import { timeAgo } from '../utils'

interface Props {
  post: Post
  isOriginal?: boolean
}

export default function PostCard({ post, isOriginal }: Props) {
  return (
    <div className={`flex gap-3 p-4 ${isOriginal ? 'bg-white border border-gray-200 rounded-lg' : 'bg-white border-b border-gray-100'}`}>
      <VoteButtons
        postId={post.id}
        threadId={post.thread_id}
        upvotes={post.upvotes}
        downvotes={post.downvotes}
      />
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-500 mb-1">
          <span className="font-medium text-gray-700">{post.author_name}</span>
          <span className="mx-1">&middot;</span>
          <span>{timeAgo(post.created_at)}</span>
          {post.updated_at !== post.created_at && (
            <span className="italic ml-1">(edited)</span>
          )}
        </div>
        <div className="text-sm text-gray-800 whitespace-pre-wrap">{post.content}</div>
      </div>
    </div>
  )
}
