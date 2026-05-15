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

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
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
