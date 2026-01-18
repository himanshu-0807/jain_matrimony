import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
    Search,
    User,
    LogOut,
    Menu,
    X,
    Sparkles,
    Heart
} from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        // Clear any local state if needed
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/home" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-saffron rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform shadow-saffron/30">
                            <Heart className="w-6 h-6 fill-current" />
                        </div>
                        <div className="text-2xl font-black tracking-tighter">
                            <span className="text-gray-900">Jain</span>
                            <span className="text-saffron">Matri</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
                        <NavLink to="/home" icon={<Search className="w-4 h-4" />} active={isActive('/home')}>
                            Browse
                        </NavLink>
                        <NavLink to="/my-profile" icon={<User className="w-4 h-4" />} active={isActive('/my-profile')}>
                            My Profile
                        </NavLink>

                        <div className="w-px h-6 bg-gray-200 mx-4"></div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl font-black text-sm hover:bg-saffron transition-all shadow-xl hover:shadow-saffron/30 active:scale-95 group"
                        >
                            Logout
                            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2.5 rounded-xl bg-gray-50 text-gray-900 border border-gray-100 shadow-sm"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in-down">
                    <div className="px-4 py-6 space-y-4">
                        <MobileNavLink to="/home" icon={<Search className="w-5 h-5" />} onClick={() => setIsMobileMenuOpen(false)}>
                            Browse Profiles
                        </MobileNavLink>
                        <MobileNavLink to="/my-profile" icon={<User className="w-5 h-5" />} onClick={() => setIsMobileMenuOpen(false)}>
                            My Dashboard
                        </MobileNavLink>

                        <div className="pt-4">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 text-white rounded-2xl font-black text-lg shadow-xl"
                            >
                                <LogOut className="w-6 h-6" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

// Helper components for clean code
const NavLink = ({ to, children, icon, active }) => (
    <Link
        to={to}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${active
                ? 'bg-saffron/10 text-saffron'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
    >
        {icon}
        {children}
    </Link>
);

const MobileNavLink = ({ to, children, icon, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 text-gray-900 font-bold text-lg"
    >
        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-saffron">
            {icon}
        </div>
        {children}
    </Link>
);

export default Navbar;
