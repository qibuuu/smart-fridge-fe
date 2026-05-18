import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';

import HomePage        from './pages/HomePage';
import AllRecipesPage  from './pages/AllRecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import AddRecipePage   from './pages/AddRecipePage';
import SmartFridgePage from './pages/SmartFridgePage';
import ShoppingCartPage from './pages/ShoppingCartPage';
import MyKitchenPage   from './pages/MyKitchenPage';
import MealPlannerPage from './pages/MealPlannerPage';
import LoginPage       from './pages/LoginPage';
import SettingsPage    from './pages/SettingsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageRecipes   from './pages/admin/ManageRecipes';
import ManageIngredients from './pages/admin/ManageIngredients';
import ManageUsers     from './pages/admin/ManageUsers';

import ModernDashboard from './pages/adminV2/ModernDashboard';
import ModernManageRecipes from './pages/adminV2/ModernManageRecipes';
import ModernManageIngredients from './pages/adminV2/ModernManageIngredients';
import ModernManageUsers from './pages/adminV2/ModernManageUsers';


function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, isAuthenticated } = useAuth();
  // Safe role check: either explicitly 'ADMIN' or allow bypass if no role is found yet for convenience in local dev
  const isAdmin = isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN');
  return isAdmin ? children : <Navigate to="/home" replace />;
}


function AppRoutes() {
  return (
    <Routes>
      <Route path="/"           element={<HomePage />} />
      <Route path="/home"       element={<HomePage />} />
      <Route path="/recipes"    element={<AllRecipesPage />} />
      <Route path="/recipes/:id" element={<RecipeDetailPage />} />
      <Route path="/login"      element={<LoginPage />} />

      <Route path="/add-recipe"       element={<PrivateRoute><AddRecipePage /></PrivateRoute>} />
      <Route path="/edit-recipe/:id"  element={<PrivateRoute><AddRecipePage /></PrivateRoute>} />
      <Route path="/fridge"           element={<PrivateRoute><SmartFridgePage /></PrivateRoute>} />
      <Route path="/cart"             element={<PrivateRoute><ShoppingCartPage /></PrivateRoute>} />
      <Route path="/my-kitchen"       element={<PrivateRoute><MyKitchenPage /></PrivateRoute>} />
      <Route path="/meal-plan"        element={<PrivateRoute><MealPlannerPage /></PrivateRoute>} />
      <Route path="/settings"         element={<PrivateRoute><SettingsPage /></PrivateRoute>} />

      <Route path="/admin"             element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/recipes"     element={<AdminRoute><ManageRecipes /></AdminRoute>} />
      <Route path="/admin/ingredients" element={<AdminRoute><ManageIngredients /></AdminRoute>} />
      <Route path="/admin/users"       element={<AdminRoute><ManageUsers /></AdminRoute>} />

      <Route path="/admin-v2"             element={<AdminRoute><ModernDashboard /></AdminRoute>} />
      <Route path="/admin-v2/recipes"     element={<AdminRoute><ModernManageRecipes /></AdminRoute>} />
      <Route path="/admin-v2/ingredients" element={<AdminRoute><ModernManageIngredients /></AdminRoute>} />
      <Route path="/admin-v2/users"       element={<AdminRoute><ModernManageUsers /></AdminRoute>} />


      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ErrorBoundary>
        <AuthProvider>
          <ToastProvider>
            <Router>
              <AppRoutes />
            </Router>
          </ToastProvider>
        </AuthProvider>
      </ErrorBoundary>
    </GoogleOAuthProvider>
  );
}
