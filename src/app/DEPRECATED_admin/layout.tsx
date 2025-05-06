import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import { createClient } from '@/lib/supabase/server';

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  if (data?.user?.user_metadata?.role !== 'admin') {
    redirect('/dashboard');
  }
  
  

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <div className="min-h-screen bg-gray-50">
          <div className="flex">
            <div className="flex-1 overflow-x-auto">
              <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-0 sm:px-4 py-6">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 