// src/components/main/Footer.tsx

import Link from "next/link";

const Footer = () => {
    return (
        <footer className="w-full border-t border-gray-200 bg-gray-50">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 text-sm text-gray-500">
                <div>
                    © 2025 toolverse. All Rights Reserved.
                </div>
                <div>
                    <span>Crafted by </span>
                    <Link href="https://github.com/lunalism" target="_blank" className="font-medium text-gray-700 hover:text-blue-500">
                        lunalism
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;