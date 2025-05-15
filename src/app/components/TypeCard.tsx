'use client';

import { useState } from 'react';
import { Brand, Flavor } from '../types';
import { ChevronDownIcon, ChevronUpIcon } from './Icons';

interface TypeCardProps {
  brand: Brand;
  onUpdateFlavor: (brandId: string, flavorId: string, quantity: number, price: number) => void;
}

export default function TypeCard({ brand, onUpdateFlavor }: TypeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFlavors, setActiveFlavors] = useState<Record<string, { quantity: number; price: number }>>({});
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSelectFlavor = (flavorId: string) => {
    setSelectedFlavor(flavorId === selectedFlavor ? null : flavorId);
  };

  const handleQuantityChange = (flavor: Flavor, newQuantity: number) => {
    const updatedFlavors = {
      ...activeFlavors,
      [flavor.id]: {
        ...activeFlavors[flavor.id],
        quantity: newQuantity,
        price: activeFlavors[flavor.id]?.price || 0
      }
    };
    setActiveFlavors(updatedFlavors);
    onUpdateFlavor(
      brand.id,
      flavor.id,
      newQuantity,
      updatedFlavors[flavor.id].price
    );
  };

  const handlePriceChange = (flavor: Flavor, newPrice: number) => {
    const updatedFlavors = {
      ...activeFlavors,
      [flavor.id]: {
        ...activeFlavors[flavor.id],
        price: newPrice,
        quantity: activeFlavors[flavor.id]?.quantity || 0
      }
    };
    setActiveFlavors(updatedFlavors);
    onUpdateFlavor(
      brand.id,
      flavor.id,
      updatedFlavors[flavor.id].quantity,
      newPrice
    );
  };

  // Count active flavors (those with quantity > 0)
  const activeFlavorCount = Object.values(activeFlavors).filter(v => v.quantity > 0).length;

  return (
    <div className="glass-card overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div 
        className="flex items-center cursor-pointer p-4 bg-gradient-to-r from-white/50 to-white/70"
        onClick={toggleExpand}
      >
        <div className="flex-shrink-0 w-20 h-20 mr-4 rounded-lg overflow-hidden bg-white/80 shadow-sm">
          <img 
            src={brand.image} 
            alt={brand.name}
            className="w-full h-full object-contain p-1"
          />
        </div>
        <div className="flex-grow">
          <h3 className="text-xl font-bold">{brand.name}</h3>
          <div className="flex items-center mt-1">
            <p className="text-sm text-gray-600">{brand.flavors.length} flavors available</p>
            {activeFlavorCount > 0 && (
              <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {activeFlavorCount} in cart
              </span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 text-gray-400">
          {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </div>
      </div>
      
      {isExpanded && (
        <div className="bg-gradient-to-b from-white/70 to-white/50 px-4 pt-2 pb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {brand.flavors.map((flavor) => {
              const isActive = flavor.id === selectedFlavor;
              const hasQuantity = (activeFlavors[flavor.id]?.quantity || 0) > 0;
              
              return (
                <button
                  key={flavor.id}
                  onClick={() => handleSelectFlavor(flavor.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : hasQuantity
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {flavor.name}
                </button>
              );
            })}
          </div>
          
          {selectedFlavor && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
              {(() => {
                const flavor = brand.flavors.find(v => v.id === selectedFlavor);
                if (!flavor) return null;
                
                const flavorData = activeFlavors[flavor.id] || { quantity: 0, price: 0 };
                
                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{flavor.name}</h4>
                      <button 
                        onClick={() => setSelectedFlavor(null)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    <div>
                      <label htmlFor={`quantity-${brand.id}-${flavor.id}`} className="block text-xs font-medium text-gray-500 mb-1">
                        Quantity
                      </label>
                      <div className="flex">
                        <button 
                          onClick={() => handleQuantityChange(flavor, Math.max(0, (flavorData.quantity || 0) - 1))}
                          className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 rounded-l-md border border-gray-300"
                        >
                          -
                        </button>
                        <input
                          id={`quantity-${brand.id}-${flavor.id}`}
                          type="number"
                          min="0"
                          value={flavorData.quantity || ''}
                          onChange={(e) => handleQuantityChange(flavor, parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-center"
                        />
                        <button 
                          onClick={() => handleQuantityChange(flavor, (flavorData.quantity || 0) + 1)}
                          className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 rounded-r-md border border-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor={`price-${brand.id}-${flavor.id}`} className="block text-xs font-medium text-gray-500 mb-1">
                        Price ($)
                      </label>
                      <input
                        id={`price-${brand.id}-${flavor.id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={flavorData.price || ''}
                        onChange={(e) => handlePriceChange(flavor, parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    
                    {flavorData.quantity > 0 && flavorData.price > 0 && (
                      <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-sm text-gray-500">Subtotal:</span>
                        <span className="font-medium">${(flavorData.quantity * flavorData.price).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 