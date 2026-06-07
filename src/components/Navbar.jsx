import { Link } from 'react-router-dom';
import { Bike } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-orange-500 rounded-xl p-1.5">
              <Bike className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">FindMyChopper</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
