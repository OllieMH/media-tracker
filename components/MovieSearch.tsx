'use client'

import MediaSearch from './MediaSearch'
import { searchMovies } from '@/lib/apiClients/tmdb'

interface Props {
  onAdded?: () => void
}

export default function MovieSearch({ onAdded }: Props) {
  return (
    <MediaSearch
      category="movie"
      searchFn={searchMovies}
      placeholder="Search for a movie..."
      onAdded={onAdded}
    />
  )
}
