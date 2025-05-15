'use client';

import { BillingItem } from '../types';

interface BillingTableProps {
  items: BillingItem[];
  totalAmount: number;
  onDeleteItem?: (flavorId: string, variantId: string) => void;
}

export default function BillingTable({ items, totalAmount, onDeleteItem }: BillingTableProps) {
  if (items.length === 0) {
    return (
      <div className="glass-card p-6 mt-8">
        <div className="flex flex-col items-center justify-center py-8">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16 text-gray-300 mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-center text-gray-500 font-medium">No items added to the bill yet.</p>
          <p className="text-center text-gray-400 text-sm mt-1">Select flavors and add quantities to see your bill.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 mt-8">
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 mr-2 text-blue-600" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Billing Summary
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/70 text-left text-gray-600 text-sm uppercase">
              <th className="px-4 py-3 font-medium rounded-tl-lg">Flavor</th>
              <th className="px-4 py-3 font-medium">Variant</th>
              <th className="px-4 py-3 font-medium text-right">Quantity</th>
              <th className="px-4 py-3 font-medium text-right">Price ($)</th>
              <th className="px-4 py-3 font-medium text-right">Total ($)</th>
              {onDeleteItem && (
                <th className="px-4 py-3 font-medium text-center rounded-tr-lg">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={`${item.flavorId}-${item.variantId}`} className="text-gray-700">
                <td className="px-4 py-3">{item.flavorName}</td>
                <td className="px-4 py-3">{item.variantName}</td>
                <td className="px-4 py-3 text-right font-medium">{item.quantity}</td>
                <td className="px-4 py-3 text-right">${item.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-right font-medium">${item.total.toFixed(2)}</td>
                {onDeleteItem && (
                  <td className="px-4 py-3 text-center">
                    <button 
                      onClick={() => onDeleteItem(item.flavorId, item.variantId)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors duration-200"
                      title="Remove item"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-blue-50/70 font-bold text-blue-900">
              <td className="px-4 py-3 rounded-bl-lg" colSpan={onDeleteItem ? 5 : 4}>Total</td>
              <td className="px-4 py-3 text-right rounded-br-lg">${totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
} 