'use client';

import { Brand } from '../types';

interface BrandSelectorProps {
  brands: Brand[];
  onSelectBrand: (brand: Brand) => void;
}

export default function BrandSelector({ brands, onSelectBrand }: BrandSelectorProps) {
  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <div className="inline-block p-1 px-3 bg-blue-100 rounded-full text-blue-800 text-xs font-medium mb-2">
          CHOOSE YOUR BRAND
        </div>
        <h2 className="text-3xl font-bold mb-2">Our Premium Brands</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Select from our collection of premium vape brands to find your favorite flavors and create your order
        </p>
      </div>
      
      <div className="glass-card p-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {brands.map(brand => (
            <div 
              key={brand.id}
              onClick={() => onSelectBrand(brand)}
              className="bg-white/70 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col items-center"
            >
              <div className="w-40 h-40 mb-6 flex items-center justify-center">
                <img 
                  src={brand.image} 
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold text-center group-hover:text-blue-600 transition-colors">{brand.name}</h3>
              <p className="text-sm text-gray-500 text-center mt-1">{brand.flavors.length} variant available</p>
              <div className="mt-4 inline-flex items-center text-blue-600">
                <span className="text-sm font-medium">View Products</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
