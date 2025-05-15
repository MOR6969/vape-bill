'use client';

import { useState } from 'react';
import { Flavor, FlavorVariant } from '../types';
import { ChevronDownIcon, ChevronUpIcon } from './Icons';

interface FlavorCardProps {
  flavor: Flavor;
  onUpdateVariant: (flavorId: string, variantId: string, quantity: number, price: number) => void;
}

export default function FlavorCard({ flavor, onUpdateVariant }: FlavorCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeVariants, setActiveVariants] = useState<Record<string, { quantity: number; price: number }>>({});
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSelectVariant = (variantId: string) => {
    setSelectedVariant(variantId === selectedVariant ? null : variantId);
  };

  const handleQuantityChange = (variant: FlavorVariant, newQuantity: number) => {
    const updatedVariants = {
      ...activeVariants,
      [variant.id]: {
        ...activeVariants[variant.id],
        quantity: newQuantity,
        price: activeVariants[variant.id]?.price || variant.price
      }
    };
    setActiveVariants(updatedVariants);
    onUpdateVariant(
      flavor.id,
      variant.id,
      newQuantity,
      updatedVariants[variant.id].price
    );
  };

  const handlePriceChange = (variant: FlavorVariant, newPrice: number) => {
    const updatedVariants = {
      ...activeVariants,
      [variant.id]: {
        ...activeVariants[variant.id],
        price: newPrice,
        quantity: activeVariants[variant.id]?.quantity || variant.quantity
      }
    };
    setActiveVariants(updatedVariants);
    onUpdateVariant(
      flavor.id,
      variant.id,
      updatedVariants[variant.id].quantity,
      newPrice
    );
  };

  // Count active variants (those with quantity > 0)
  const activeVariantCount = Object.values(activeVariants).filter(v => v.quantity > 0).length;

  return (
    <div className="glass-card overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div 
        className="flex items-center cursor-pointer p-4 bg-gradient-to-r from-white/50 to-white/70"
        onClick={toggleExpand}
      >
        <div className="flex-shrink-0 w-20 h-20 mr-4 rounded-lg overflow-hidden bg-white/80 shadow-sm">
          <img 
            src={flavor.image} 
            alt={flavor.name}
            className="w-full h-full object-contain p-1"
          />
        </div>
        <div className="flex-grow">
          <h3 className="text-xl font-bold">{flavor.name}</h3>
          <div className="flex items-center mt-1">
            <p className="text-sm text-gray-600">{flavor.variants.length} variants available</p>
            {activeVariantCount > 0 && (
              <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {activeVariantCount} in cart
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
            {flavor.variants.map((variant) => {
              const isActive = variant.id === selectedVariant;
              const hasQuantity = (activeVariants[variant.id]?.quantity || 0) > 0;
              
              return (
                <button
                  key={variant.id}
                  onClick={() => handleSelectVariant(variant.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : hasQuantity
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {variant.name}
                </button>
              );
            })}
          </div>
          
          {selectedVariant && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
              {(() => {
                const variant = flavor.variants.find(v => v.id === selectedVariant);
                if (!variant) return null;
                
                const variantData = activeVariants[variant.id] || { quantity: variant.quantity, price: variant.price };
                
                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{variant.name}</h4>
                      <button 
                        onClick={() => setSelectedVariant(null)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`quantity-${flavor.id}-${variant.id}`} className="block text-xs font-medium text-gray-500 mb-1">
                          Quantity
                        </label>
                        <div className="flex">
                          <button 
                            onClick={() => handleQuantityChange(variant, Math.max(0, (variantData.quantity || 0) - 1))}
                            className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 rounded-l-md border border-gray-300"
                          >
                            -
                          </button>
                          <input
                            id={`quantity-${flavor.id}-${variant.id}`}
                            type="number"
                            min="0"
                            value={variantData.quantity || ''}
                            onChange={(e) => handleQuantityChange(variant, parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-center"
                          />
                          <button 
                            onClick={() => handleQuantityChange(variant, (variantData.quantity || 0) + 1)}
                            className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 rounded-r-md border border-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor={`price-${flavor.id}-${variant.id}`} className="block text-xs font-medium text-gray-500 mb-1">
                          Price ($)
                        </label>
                        <input
                          id={`price-${flavor.id}-${variant.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={variantData.price || ''}
                          onChange={(e) => handlePriceChange(variant, parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                    </div>
                    
                    {variantData.quantity > 0 && variantData.price > 0 && (
                      <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-sm text-gray-500">Subtotal:</span>
                        <span className="font-medium">${(variantData.quantity * variantData.price).toFixed(2)}</span>
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