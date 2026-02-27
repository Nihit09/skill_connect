import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import CreateSkill from "./pages/CreateSkill";
import Exchanges from "./pages/Exchanges";
import ChatPage from "./pages/ChatPage";
import Home from "./pages/Home";
import MySkills from "./pages/MySkills";
import EditSkill from "./pages/EditSkill";
import UserProfile from "./pages/UserProfile";
import Workspace from "./pages/Workspace";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
// import AdminPanel from "./components/AdminPanel"; // Repurpose or Create new Admin Dashboard later

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/marketplace" element={isAuthenticated ? <Marketplace /> : <Navigate to="/login" />} />
        <Route path="/my-skills" element={isAuthenticated ? <MySkills /> : <Navigate to="/login" />} />
        <Route path="/create-skill" element={isAuthenticated ? <CreateSkill /> : <Navigate to="/login" />} />
        <Route path="/edit-skill/:id" element={isAuthenticated ? <EditSkill /> : <Navigate to="/login" />} />
        <Route path="/user/:id" element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />} />
        <Route path="/exchanges" element={isAuthenticated ? <Exchanges /> : <Navigate to="/login" />} />
        <Route path="/chat" element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/workspace/:exchangeId" element={isAuthenticated ? <Workspace /> : <Navigate to="/login" />} />

        {/* Admin Route Placeholder */}
        {/* <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} /> */}

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;