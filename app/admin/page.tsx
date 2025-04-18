import AdminProtectedRoute from "@/components/admin-protected-route"
import AdminLayout from "@/components/admin-layout"

const AdminDashboardPage = () => {
  return (
    <AdminLayout>
      <div>
        <h1>Admin Dashboard</h1>
        <p>Welcome to the admin dashboard!</p>
      </div>
    </AdminLayout>
  )
}

export default function AdminDashboard() {
  return (
    <AdminProtectedRoute>
      <AdminDashboardPage />
    </AdminProtectedRoute>
  )
}
