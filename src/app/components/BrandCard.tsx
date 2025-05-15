'use client';

import { Brand } from '../types';

interface BrandCardProps {
  brand: Brand;
  onSelect: () => void;
}

export default function BrandCard({ brand, onSelect }: BrandCardProps) {
  return (
    <div 
      className="glass-card overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer group"
      onClick={onSelect}
    >
      <div className="flex flex-col items-center p-6">
        <div className="w-40 h-40 mb-6 rounded-lg overflow-hidden bg-white/80 shadow-sm">
          <img 
            src={brand.image} 
            alt={brand.name}
            className="w-full h-full object-contain p-2"
          />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold group-hover:text-blue-600 transition-colors duration-300">{brand.name}</h2>
          <p className="mt-1 text-gray-600">
            {brand.flavors.length} flavors available
          </p>
          <div className="mt-4 inline-flex items-center text-blue-600 font-medium">
            <span>View Flavors</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-300" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
} 