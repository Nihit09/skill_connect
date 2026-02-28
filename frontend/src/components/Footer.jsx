import { Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#050505] border-t border-[#1a1a1a] py-6 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                <p>&copy; {new Date().getFullYear()} SkillConnect. All rights reserved.</p>

                <div className="flex items-center gap-4">
                    <p className="flex items-center gap-1">
                        Designed & Built by <span className="text-gray-300 font-semibold ml-1">Nihit Pathak</span>
                    </p>
                    <span className="w-1 h-1 rounded-full bg-gray-600 hidden md:block"></span>
                    <a href="mailto:pathaknihit09@gmail.com" className="flex items-center gap-1 hover:text-gray-300 transition-colors">
                        <Mail className="w-3 h-3" />
                        pathaknihit09@gmail.com
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
