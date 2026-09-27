import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Events from './pages/Events.jsx';
import EventDetails from './pages/EventDetails.jsx';
import Register from './pages/Register.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminLogin from './pages/admin/Login.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import EventsAdmin from './pages/admin/EventsAdmin.jsx';
import EventForm from './pages/admin/EventForm.jsx';
import Registrations from './pages/admin/Registrations.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetails />} />
        <Route path="events/:id/register" element={<Register />} />
        <Route path="admin/login" element={<AdminLogin />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="events" element={<EventsAdmin />} />
        <Route path="events/add" element={<EventForm mode="create" />} />
        <Route path="events/:id/edit" element={<EventForm mode="edit" />} />
        <Route path="registrations" element={<Registrations />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
