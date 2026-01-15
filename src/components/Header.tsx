import React from 'react';

interface HeaderProps {
    showNav?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showNav = false }) => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <img
                            src="/orange-corners-logo.png"
                            alt="Orange Corners"
                            className="h-12 w-auto"
                        />
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-bold text-oc-dark">Orange Corners</h1>
                            <p className="text-sm text-oc-gray">Programme de Mentorat</p>
                        </div>
                    </div>

                    {showNav && (
                        <nav className="flex space-x-4">
                            <a
                                href="/"
                                className="text-oc-gray hover:text-oc-orange transition-colors duration-200"
                            >
                                Accueil
                            </a>
                        </nav>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
