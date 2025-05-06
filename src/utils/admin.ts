import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export async function addAdminUser(embedId: string, userId: string) {
  const supabase = createBrowserSupabaseClient();
  
  // Get current admin users
  const { data: currentData } = await supabase
    .from('embeds')
    .select('admin_users')
    .eq('id', embedId)
    .single();

  const currentAdmins = currentData?.admin_users || [];
  
  // Add new user if not already an admin
  if (!currentAdmins.includes(userId)) {
    const { error } = await supabase
      .from('embeds')
      .update({ admin_users: [...currentAdmins, userId] })
      .eq('id', embedId);

    if (error) throw error;
  }
}

export async function removeAdminUser(embedId: string, userId: string) {
  const supabase = createBrowserSupabaseClient();
  
  // Get current admin users
  const { data: currentData } = await supabase
    .from('embeds')
    .select('admin_users')
    .eq('id', embedId)
    .single();

  const currentAdmins = currentData?.admin_users || [];
  
  // Remove user if they are an admin
  if (currentAdmins.includes(userId)) {
    const { error } = await supabase
      .from('embeds')
      .update({ admin_users: currentAdmins.filter((id: string) => id !== userId) })
      .eq('id', embedId);

    if (error) throw error;
  }
}

export async function isUserAdmin(embedId: string, userId: string): Promise<boolean> {
  const supabase = createBrowserSupabaseClient();
  
  const { data } = await supabase
    .from('embeds')
    .select('admin_users')
    .eq('id', embedId)
    .single();

  return data?.admin_users?.includes(userId) || false;
} 