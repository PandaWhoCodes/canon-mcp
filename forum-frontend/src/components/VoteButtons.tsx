import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addReaction } from '../api/client'

interface Props {
  postId: number
  threadId: number
  upvotes: number
  downvotes: number
}

const USERNAME = 'anonymous'

export default function VoteButtons({ postId, threadId, upvotes, downvotes }: Props) {
  const qc = useQueryClient()

  const voteMutation = useMutation({
    mutationFn: (type: 'upvote' | 'downvote') =>
      addReaction(postId, { reaction_type: type, reactor_name: USERNAME }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['posts', threadId] })
    },
  })

  const score = upvotes - downvotes

  return (
    <div className="flex flex-col items-center gap-0.5 text-gray-400">
      <button
        onClick={() => voteMutation.mutate('upvote')}
        className="hover:text-orange-500 p-0.5"
        title="Upvote"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
      <span className={`text-xs font-semibold ${score > 0 ? 'text-orange-500' : score < 0 ? 'text-blue-500' : 'text-gray-500'}`}>
        {score}
      </span>
      <button
        onClick={() => voteMutation.mutate('downvote')}
        className="hover:text-blue-500 p-0.5"
        title="Downvote"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  )
}
