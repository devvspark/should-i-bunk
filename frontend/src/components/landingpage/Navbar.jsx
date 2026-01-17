import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-teal-600 text-white font-bold">
            S
          </div>
          <span className="text-lg font-semibold text-gray-900">
            Should I Bunk?
          </span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <li className="cursor-pointer hover:text-gray-900">Features</li>
          <li className="cursor-pointer hover:text-gray-900">Risk Analysis</li>
          <li className="cursor-pointer hover:text-gray-900">Pricing</li>
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Login
          </button>

          <button className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 transition">
            Get Started
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-gray-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-gray-100 bg-white px-6 py-4 space-y-4 animate-in slide-in-from-top duration-300">
          <ul className="space-y-4 text-sm font-medium text-gray-600">
            <li className="cursor-pointer hover:text-gray-900">Features</li>
            <li className="cursor-pointer hover:text-gray-900">Risk Analysis</li>
            <li className="cursor-pointer hover:text-gray-900">Pricing</li>
          </ul>
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
            <button className="w-full text-center text-sm font-medium text-gray-600 hover:text-gray-900">
              Login
            </button>
            <button className="w-full rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 transition">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav> 
  );
};

export default Navbar;
