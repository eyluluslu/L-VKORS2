import { getCurrentUser, getProducts, getCategories, getAllUsers, getAdminStats } from '@/lib/actions'
import { getHeroBanners, getSiteSettings } from '@/lib/site-actions'
import { getAboutPageData } from '@/lib/about-actions'
import { getAllTeamMembers } from '@/lib/team-actions'
import { redirect } from 'next/navigation'
import AdminDashboard from '@/components/AdminDashboard'

export const metadata = {
  title: 'Admin Panel - Livkors',
  description: 'Yönetim paneli'
}

export default async function AdminPage() {
  // Admin yetkisi kontrolü
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  if (user.role !== 'ADMIN') {
    redirect('/')
  }

  // Admin verileri
  const [products, categories, users, stats, banners, siteSettings, aboutData, teamMembers] = await Promise.all([
    getProducts(),
    getCategories(),
    getAllUsers(),
    getAdminStats(),
    getHeroBanners().then(result => result.success ? result.data : []),
    getSiteSettings().then(result => result.success ? result.data : null),
    getAboutPageData().then(result => result.success ? result.data : null),
    getAllTeamMembers().then(result => result.success ? result.data : [])
  ])

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminDashboard 
        initialProducts={products || []} 
        initialCategories={categories || []} 
        users={users || []}
        stats={stats || {}}
        user={user}
        banners={banners || []}
        siteSettings={siteSettings}
        aboutData={aboutData}
        teamMembers={teamMembers || []}
      />
    </div>
  )
} 