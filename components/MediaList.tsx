'use client'

import { useEffect, useState } from 'react'
import { MediaCategory, MediaItem } from '@/types/media'
import { getMediaItems } from '@/lib/mediaService'
import MediaCard from './MediaCard'

interface Props {
  category: MediaCategory
  refreshKey: number
}

export default function MediaList({ category, refreshKey }: Props) {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const data = await getMediaItems(category)
    setItems(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [category, refreshKey])

  if (loading) return <p className="text-sm text-zinc-500">Loading...</p>
  if (items.length === 0) return <p className="text-sm text-zinc-500">Nothing saved yet.</p>

  const groups = {
    in_progress: items.filter((i) => i.status === 'in_progress'),
    backlog: items.filter((i) => i.status === 'backlog'),
    completed: items.filter((i) => i.status === 'completed'),
  }

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([status, groupItems]) =>
        groupItems.length === 0 ? null : (
          <div key={status}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
              {status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {groupItems.map((item) => (
                <MediaCard key={item.id} item={item} onUpdate={load} />
              ))}
            </div>
          </div>
        )
      )}
    </div>
  )
}
