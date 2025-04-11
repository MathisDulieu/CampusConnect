import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white shadow-inner py-4 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-gray-500 text-sm">
                            &copy; {currentYear} Campus Connect. All rights reserved.
                        </p>
                    </div>

                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                            Terms of Service
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                            Help
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;