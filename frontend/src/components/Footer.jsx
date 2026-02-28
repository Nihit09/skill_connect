import { Link } from 'react-router';
import { Mail, Github, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#050505] border-t border-[#1a1a1a] pt-12 pb-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand & Creator details */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black font-bold text-sm">
                                S
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">Skill<span className="text-gray-400">Connect</span></span>
                        </Link>
                        <p className="text-gray-400 text-sm max-w-sm mb-6 leading-relaxed">
                            A community-driven marketplace changing the way we learn. Exchange your expertise, find mentors, and grow completely for free.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
                            <li><Link to="/my-skills" className="hover:text-white transition-colors">My Skills</Link></li>
                            <li><Link to="/exchanges" className="hover:text-white transition-colors">Exchanges</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Credit */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact Creator</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li className="flex items-center gap-2">
                                <span className="font-semibold text-gray-300">Nihit Pathak</span>
                            </li>
                            <li>
                                <a href="mailto:pathaknihit09@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors group">
                                    <Mail className="w-4 h-4 group-hover:text-white" />
                                    pathaknihit09@gmail.com
                                </a>
                            </li>
                            {/* Note: You can uncomment these if you want to add GitHub/LinkedIn later 
                            <li>
                                <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors group">
                                    <Github className="w-4 h-4 group-hover:text-white" /> GitHub
                                </a>
                            </li>
                            */}
                        </ul>
                    </div>
                </div>

                {/* Bottom line */}
                <div className="border-t border-[#1a1a1a] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-600 text-xs">
                        &copy; {new Date().getFullYear()} SkillConnect. All rights reserved.
                    </p>
                    <p className="text-gray-600 text-xs flex items-center gap-1 block">
                        Designed & Built by
                        <span className="text-gray-300 font-semibold ml-1">Nihit Pathak</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
