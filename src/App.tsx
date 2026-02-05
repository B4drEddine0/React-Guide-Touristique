import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/auth/PrivateRoute';
import ScrollToTop from './components/common/ScrollToTop';
import AdminLayout from './components/layout/AdminLayout';
import PublicLayout from './components/layout/PublicLayout';
import AdminPlacesPage from './pages/admin/AdminPlacesPage';
import DashboardPage from './pages/admin/DashboardPage';
import LoginPage from './pages/admin/LoginPage';
import PlaceEditorPage from './pages/admin/PlaceEditorPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import PlaceDetailsPage from './pages/PlaceDetailsPage';
import PlacesPage from './pages/PlacesPage';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/lieux" element={<PlacesPage />} />
        <Route path="/lieux/:id" element={<PlaceDetailsPage />} />
      </Route>

      <Route path="/admin/login" element={<LoginPage />} />

      <Route element={<PrivateRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="lieux" element={<AdminPlacesPage />} />
          <Route path="lieux/nouveau" element={<PlaceEditorPage />} />
          <Route path="lieux/:id/modifier" element={<PlaceEditorPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </>
  );
}

export default App;
