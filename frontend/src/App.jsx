import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { store } from '@/store/store';
import AppLayout from '@/components/AppLayout';
import PrivateRoute from '@/components/PrivateRoute';
import Dashboard from '@/pages/Dashboard';
import Pay from '@/pages/Pay';
import Groups from '@/pages/Groups';
import GroupDetail from '@/pages/GroupDetail';
import Expenses from '@/pages/Expenses';
import Settle from '@/pages/Settle';
import Profile from '@/pages/Profile';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Landing from '@/pages/Landing';
import AdminBank from '@/pages/AdminBank';
import { useAuth } from '@/hooks/useAuth';

function AppInitializer({ children }) {
  const { loadUser } = useAuth();
  useEffect(() => {
    loadUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return children;
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppInitializer>
          <Routes>
            {/* Public route */}
            <Route path="/" element={<Landing />} />

            {/* Auth routes — no sidebar */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* App routes — with sidebar layout, protected */}
            <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pay" element={<Pay />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/groups/:id" element={<GroupDetail />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/settle" element={<Settle />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminBank />} />
            </Route>
          </Routes>
        </AppInitializer>
      </BrowserRouter>
    </Provider>
  );
}
