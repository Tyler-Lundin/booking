import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'

type Embed = Database['public']['Tables']['embeds']['Row']

export async function getEmbedById(id: string): Promise<Embed | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('embeds')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching embed:', error)
    return null
  }

  return data
} 