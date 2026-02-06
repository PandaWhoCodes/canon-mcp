import { useMutation } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { createThread } from '../api/client'
import { useState } from 'react'

export default function NewThreadPage() {
  const { id } = useParams<{ id: string }>()
  const categoryId = Number(id)
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [tagsInput, setTagsInput] = useState('')

  const mutation = useMutation({
    mutationFn: () => {
      const tags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
      return createThread({
        category_id: categoryId,
        title,
        author_name: authorName || 'anonymous',
        content,
        tags: tags.length > 0 ? tags : undefined,
      })
    },
    onSuccess: (thread) => {
      navigate(`/threads/${thread.id}`)
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    mutation.mutate()
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-gray-900 mb-4">New Thread</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-gray-200 rounded-lg p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
          <input
            type="text"
            value={authorName}
            onChange={e => setAuthorName(e.target.value)}
            placeholder="anonymous"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            rows={6}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={tagsInput}
            onChange={e => setTagsInput(e.target.value)}
            placeholder="python, tutorial, help"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {mutation.error && (
          <p className="text-sm text-red-500">{(mutation.error as Error).message}</p>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!title.trim() || !content.trim() || mutation.isPending}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {mutation.isPending ? 'Creating...' : 'Create Thread'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/categories/${categoryId}`)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
