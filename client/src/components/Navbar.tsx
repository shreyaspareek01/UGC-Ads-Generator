import { DollarSignIcon, FolderEditIcon, GalleryHorizontalEnd, LogOutIcon, MenuIcon, SparkleIcon, UserIcon, XIcon } from 'lucide-react';
import { PrimaryButton } from './Buttons';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuthContext();
    const [isOpen, setIsOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Create', href: '/generate' },
        { name: 'Community', href: '/community' },
        { name: 'Plans', href: '/plans' },
    ];

    const handleLogout = () => {
        logout();
        toast.success('Logged out');
        navigate('/');
    };

    return (
        <motion.nav className='fixed top-5 left-0 right-0 z-50 px-4'
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
        >
            <div className='max-w-6xl mx-auto flex items-center justify-between bg-black/50 backdrop-blur-md border border-white/4 rounded-2xl p-3'>
                <Link to='/' onClick={() => scrollTo(0, 0)}>
                    <img src={assets.logo} alt="logo" className="h-8" />
                </Link>

                <div className='hidden md:flex items-center gap-8 text-sm font-medium text-gray-300'>
                    {navLinks.map((link) => (
                        <Link onClick={() => scrollTo(0, 0)} to={link.href} key={link.name} className="hover:text-white transition">
                            {link.name}
                        </Link>
                    ))}
                </div>

                {!user ? (
                    <div className='hidden md:flex items-center gap-3'>
                        <Link to='/login' className='text-sm font-medium text-gray-300 hover:text-white transition'>Sign in</Link>
                        <Link to='/register'>
                            <PrimaryButton>Get Started</PrimaryButton>
                        </Link>
                    </div>
                ) : (
                    <div className='relative hidden md:flex items-center gap-2'>
                        <span className='text-xs px-2 py-1 rounded-full bg-violet-500/20 text-violet-300'>{user.credits} credits</span>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
                            className='flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 transition text-sm'
                        >
                            <UserIcon size={15} />
                            {user.name}
                        </button>
                        {menuOpen && (
                            <div className='absolute top-10 right-0 w-52 bg-black/80 backdrop-blur border border-white/10 rounded-xl shadow-xl py-1 z-50'>
                                <button onClick={() => { navigate('/generate'); setMenuOpen(false); }} className='w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/10 transition'>
                                    <SparkleIcon size={14} /> Generate
                                </button>
                                <button onClick={() => { navigate('/my-generations'); setMenuOpen(false); }} className='w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/10 transition'>
                                    <FolderEditIcon size={14} /> My Generations
                                </button>
                                <button onClick={() => { navigate('/community'); setMenuOpen(false); }} className='w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/10 transition'>
                                    <GalleryHorizontalEnd size={14} /> Community
                                </button>
                                <button onClick={() => { navigate('/plans'); setMenuOpen(false); }} className='w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/10 transition'>
                                    <DollarSignIcon size={14} /> Plans
                                </button>
                                <hr className='border-white/10 my-1' />
                                <button onClick={handleLogout} className='w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition'>
                                    <LogOutIcon size={14} /> Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {!user && (
                    <button onClick={() => setIsOpen(!isOpen)} className='md:hidden'>
                        <MenuIcon className='size-6' />
                    </button>
                )}
            </div>

            {/* Mobile menu */}
            <div className={`flex flex-col items-center justify-center gap-6 text-lg font-medium fixed inset-0 bg-black/40 backdrop-blur-md z-50 transition-all duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                {navLinks.map((link) => (
                    <Link key={link.name} to={link.href} onClick={() => setIsOpen(false)}>
                        {link.name}
                    </Link>
                ))}
                <Link to='/login' onClick={() => setIsOpen(false)} className='font-medium text-gray-300 hover:text-white transition'>Sign in</Link>
                <Link to='/register' onClick={() => setIsOpen(false)}>
                    <PrimaryButton>Get Started</PrimaryButton>
                </Link>
                <button onClick={() => setIsOpen(false)} className="rounded-md bg-white p-2 text-gray-800 ring-white active:ring-2">
                    <XIcon />
                </button>
            </div>
        </motion.nav>
    );
}