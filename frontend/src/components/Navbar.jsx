import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../authSlice";
import { LogOut, User, Menu, X, MessageSquare } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav className="bg-transparent border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-white font-bold text-sm">
                S
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                SkillConnect
              </span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link to="/marketplace" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                Marketplace
              </Link>
              <Link to="/my-skills" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                My Skills
              </Link>
              <Link to="/exchanges" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                My Exchanges
              </Link>
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <Link
              to="/chat"
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-[#111111] transition-colors relative group"
              title="Messages"
            >
              <MessageSquare className="h-6 w-6" />
            </Link>

            <Link to="/dashboard" className="flex items-center space-x-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
              <div className="bg-[#111111] p-2 rounded-full hover:bg-slate-200 transition-colors">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <span>{user?.firstName}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-400 hover:bg-[#111111] focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden bg-transparent border-t border-gray-800 ">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/dashboard" className="bg-[#111111] text-gray-700 block pl-3 pr-4 py-2 border-l-4 border-gray-600 text-base font-medium">
              Dashboard
            </Link>
            <Link to="/marketplace" className="text-gray-300 hover:bg-[#0a0a0a] hover:text-white block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium">
              Marketplace
            </Link>
            <Link to="/my-skills" className="text-gray-300 hover:bg-[#0a0a0a] hover:text-white block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium">
              My Skills
            </Link>
            <Link to="/exchanges" className="text-gray-300 hover:bg-[#0a0a0a] hover:text-white block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium">
              My Exchanges
            </Link>
          </div>
          <div className="pt-4 pb-4 border-t border-gray-800">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="bg-[#111111] p-2 rounded-full">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">{user?.firstName} {user?.lastName}</div>
                <div className="text-sm font-medium text-gray-400">{user?.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto flex-shrink-0 p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
