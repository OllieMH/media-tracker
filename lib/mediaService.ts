import { supabase } from './supabase'
import { MediaItem, NewMediaItem } from '@/types/media'
import { isGuestMode } from './guestMode'
import {
  guestAddMediaItem,
  guestGetMediaItems,
  guestUpdateMediaItem,
  guestDeleteMediaItem,
} from './guestStorage'

export async function addMediaItem(item: NewMediaItem): Promise<MediaItem> {
  if (isGuestMode()) return guestAddMediaItem(item)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('media_items')
    .insert({ ...item, user_id: user.id })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getMediaItems(category?: string): Promise<MediaItem[]> {
  if (isGuestMode()) return guestGetMediaItems(category)

  let query = supabase.from('media_items').select('*').order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function updateMediaItem(
  id: string,
  updates: Partial<Pick<MediaItem, 'status' | 'rating' | 'notes' | 'metadata' | 'is_favorite'>>
): Promise<void> {
  if (isGuestMode()) return guestUpdateMediaItem(id, updates)

  const { error } = await supabase
    .from('media_items')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function deleteMediaItem(id: string): Promise<void> {
  if (isGuestMode()) return guestDeleteMediaItem(id)

  const { error } = await supabase.from('media_items').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
