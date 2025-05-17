'use client';

import { useState, useRef } from 'react';
import { BillingItem, BillingState, Brand } from '../types';
import { ALL_BRANDS } from '../data/vapeData';
import { translations } from '../translations';
import BrandSelector from './BrandSelector';
import FlavorCard from './FlavorCard';
import BillingTable from './BillingTable';
import { ExportIcon } from './Icons';
import generatePDF from 'react-to-pdf';

type Language = 'en' | 'ar';

// Add LanguageToggle component
const LanguageToggle = ({ language, onToggle }: { language: Language; onToggle: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    onToggle();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {isOpen && (
        <div 
          className="absolute right-0 bottom-full mb-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 transform transition-all duration-200 ease-out opacity-100 scale-100"
        >
          <div className="px-2">
            <button
              onClick={handleClick}
              className={`w-full rounded-lg px-3 py-2 text-left transition-colors duration-150 flex items-center gap-3 hover:bg-blue-50 ${
                language === 'en' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <div className="w-6 h-4 relative shadow-sm rounded-sm overflow-hidden">
                <img
                  src="/images/ae-flag.svg"
                  alt="Arabic"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium">Arabic</span>
            </button>
            <button
              onClick={handleClick}
              className={`w-full mt-1 rounded-lg px-3 py-2 text-left transition-colors duration-150 flex items-center gap-3 hover:bg-blue-50 ${
                language === 'ar' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <div className="w-6 h-4 relative shadow-sm rounded-sm overflow-hidden">
                <img
                  src="/images/us-flag.svg"
                  alt="English"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium">English</span>
            </button>
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-3 px-3 py-2 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 ${
          isOpen ? 'border-blue-300 bg-blue-50' : ''
        }`}
      >
        <div className="w-6 h-4 relative shadow-sm rounded-sm overflow-hidden">
          <img
            src={language === 'en' ? '/images/us-flag.svg' : '/images/ae-flag.svg'}
            alt={language === 'en' ? 'English' : 'Arabic'}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-sm font-medium text-gray-700">
          {language === 'en' ? 'English' : 'Arabic'}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-500' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 15l-7-7-7 7" />
        </svg>
      </button>
    </div>
  );
};

interface CustomerInfo {
  name: string;
  address: string;
  phone: string;
}

export default function BillingSystem() {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [billing, setBilling] = useState<BillingState>({
    items: [],
    totalAmount: 0
  });
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    address: '',
    phone: ''
  });
  
  const pdfRef = useRef<HTMLDivElement>(null);
  const quantityPdfRef = useRef<HTMLDivElement>(null);

  const t = translations[language];

  const handleSelectBrand = (brand: Brand) => {
    setSelectedBrand(brand);
  };

  const handleBackToBrands = () => {
    setSelectedBrand(null);
  };

  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateVariant = (flavorId: string, variantId: string, quantity: number, price: number) => {
    if (!selectedBrand) return;
    
    // Find the flavor and variant
    const flavor = selectedBrand.flavors.find(f => f.id === flavorId);
    if (!flavor) return;
    
    const variant = flavor.variants.find(v => v.id === variantId);
    if (!variant) return;

    // Calculate total for this item
    const total = quantity * price;

    // Update billing items
    const existingItemIndex = billing.items.findIndex(
      item => item.flavorId === flavorId && item.variantId === variantId
    );
    
    let newItems = [...billing.items];

    if (existingItemIndex >= 0) {
      if (quantity > 0 && price > 0) {
        // Update existing item
        newItems[existingItemIndex] = {
          flavorId,
          flavorName: flavor.name,
          variantId,
          variantName: variant.name,
          quantity,
          price,
          total,
          brandId: selectedBrand.id,
          brandName: selectedBrand.name,
          brandImage: selectedBrand.image
        };
      } else {
        // Remove item if quantity or price is 0
        newItems = newItems.filter(
          item => !(item.flavorId === flavorId && item.variantId === variantId)
        );
      }
    } else if (quantity > 0 && price > 0) {
      // Add new item
      newItems.push({
        flavorId,
        flavorName: flavor.name,
        variantId,
        variantName: variant.name,
        quantity,
        price,
        total,
        brandId: selectedBrand.id,
        brandName: selectedBrand.name,
        brandImage: selectedBrand.image
      });
    }

    // Calculate new total amount
    const newTotalAmount = newItems.reduce((sum, item) => sum + item.total, 0);

    // Update billing state
    setBilling({
      items: newItems,
      totalAmount: newTotalAmount
    });
  };

  const handleDeleteItem = (flavorId: string, variantId: string) => {
    // Remove the item from billing items
    const newItems = billing.items.filter(
      item => !(item.flavorId === flavorId && item.variantId === variantId)
    );

    // Calculate new total amount
    const newTotalAmount = newItems.reduce((sum, item) => sum + item.total, 0);

    // Update billing state
    setBilling({
      items: newItems,
      totalAmount: newTotalAmount
    });
  };

  const handleLanguageToggle = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const handleExportPDF = () => {
    if (billing.items.length === 0) {
      alert('Add items to the bill before exporting');
      return;
    }
    
    const options = {
      filename: `Vape_Invoice_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`,
      page: { margin: 20 }
    };
    
    generatePDF(pdfRef, options);
  };

  const handleExportQuantityPDF = () => {
    if (billing.items.length === 0) {
      alert('Add items to the bill before exporting');
      return;
    }
    
    const options = {
      filename: `Vape_Quantity_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`,
      page: { margin: 20 }
    };
    
    generatePDF(quantityPdfRef, options);
  };

  // Group items by brand for the PDF
  const getGroupedBrands = () => {
    const brandsMap = new Map<string, {
      id: string;
      name: string;
      image: string;
      items: BillingItem[];
      subtotal: number;
    }>();
    
    billing.items.forEach(item => {
      if (!brandsMap.has(item.brandId)) {
        brandsMap.set(item.brandId, {
          id: item.brandId,
          name: item.brandName,
          image: item.brandImage,
          items: [],
          subtotal: 0
        });
      }
      
      const brandData = brandsMap.get(item.brandId);
      if (brandData) {
        brandData.items.push(item);
        brandData.subtotal += item.total;
      }
    });
    
    return Array.from(brandsMap.values());
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-10">
        <div className="flex items-center justify-center mb-6">
          <div className="w-48 h-48 relative">
            <img 
              src="/images/logo.png" 
              alt="Vape Store Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Vape Store Billing System</span>
        </h1>
        <p className="text-center text-gray-500 mt-2">Select flavors, add quantities and prices, and generate invoices</p>
      </header>
      
      {!selectedBrand ? (
        <BrandSelector brands={ALL_BRANDS} onSelectBrand={handleSelectBrand} />
      ) : (
        <>
          <div className="glass-card p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
              <button 
                onClick={handleBackToBrands} 
                className="btn btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center text-base py-3"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Brands
              </button>
              <div className="hidden sm:block h-8 w-px bg-gray-200 mx-2"></div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                <img 
                  src={selectedBrand.image} 
                  alt={selectedBrand.name} 
                  className="h-10 w-10 object-contain"
                />
                <span className="text-xl font-bold text-gray-700">{selectedBrand.name}</span>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {selectedBrand.flavors.length} Flavors
                </span>
              </div>
            </div>
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3 mt-4 sm:mt-0">
              <LanguageToggle
                language={language}
                onToggle={handleLanguageToggle}
              />
              <button 
                onClick={handleExportQuantityPDF} 
                className="btn btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center text-base py-3"
                title="Export quantity-only PDF"
              >
                <ExportIcon />
                Export Quantity
              </button>
              <button 
                onClick={handleExportPDF} 
                className="btn btn-primary flex items-center gap-2 w-full sm:w-auto justify-center text-base py-3"
              >
                <ExportIcon />
                Export Full Invoice
              </button>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {selectedBrand.flavors.map((flavor) => (
              <FlavorCard 
                key={flavor.id} 
                flavor={flavor} 
                onUpdateVariant={handleUpdateVariant} 
              />
            ))}
          </div>

          {/* Customer Information */}
          {billing.items.length > 0 && (
            <div className="glass-card p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 mr-2 text-blue-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Customer Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="customer-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <label htmlFor="customer-address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    id="customer-address"
                    type="text"
                    value={customerInfo.address}
                    onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter address"
                  />
                </div>
                <div>
                  <label htmlFor="customer-phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="customer-phone"
                    type="text"
                    value={customerInfo.phone}
                    onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Visible billing table with delete buttons */}
          <div>
            <BillingTable 
              items={billing.items} 
              totalAmount={billing.totalAmount}
              onDeleteItem={handleDeleteItem}
            />
          </div>
          
          {/* Quantity-only PDF content */}
          <div 
            ref={quantityPdfRef} 
            className="relative w-full bg-white p-0" 
            style={{ 
              display: 'block', 
              height: 'auto', 
              position: 'absolute', 
              left: '-9999px', 
              top: '0', 
              width: '794px',
              direction: language === 'ar' ? 'rtl' : 'ltr'
            }}
          >
            <div className="pdf-content">
              <div className="relative">
                <div style={{ position: 'relative', zIndex: 10, padding: '40px' }}>
                  {/* Header */}
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h1 className="text-3xl font-bold text-blue-800">{t.quantitySummary}</h1>
                      <p className="text-gray-600 mt-2">
                        <span className="font-medium">{t.date}:</span> {new Date().toLocaleDateString(language === 'ar' ? 'ar-AE' : undefined)}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">{t.referenceNo}:</span> QTY-{Math.floor(100000 + Math.random() * 900000)}
                      </p>
                    </div>
                    <div className="w-32 h-32 flex items-center justify-center">
                      <img 
                        src="/images/logo.png" 
                        alt="Vape Store Logo" 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                  
                  {/* Company Information */}
                  <div className="grid grid-cols-2 gap-8 mb-10 pb-6 border-b border-gray-200">
                    <div>
                      <h3 className="text-lg font-bold text-gray-700 mb-2">Vape Store</h3>
                      <p className="text-sm text-gray-600">Office No. 2002-0117, Owned by Sheikha Maryam bint Rashid bin Saeed Al Maktoum – Al Rigga, Dubai, UAE</p>
                      <p className="text-sm text-gray-600">Tel: (971) 54 473 3331</p>
                      <p className="text-sm text-gray-600">Email: info@myverna.com</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-700 mb-2">{t.billTo}:</h3>
                      <p className="text-sm text-gray-600">{customerInfo.name || t.customer}</p>
                      <p className="text-sm text-gray-600">{t.address}: {customerInfo.address || 'N/A'}</p>
                      <p className="text-sm text-gray-600">{t.phone}: {customerInfo.phone || 'N/A'}</p>
                    </div>
                  </div>
                  
                  {/* Brands and Items */}
                  {getGroupedBrands().map((brand) => {
                    const brandTotalQuantity = brand.items.reduce((sum, item) => sum + item.quantity, 0);
                    
                    return (
                      <div key={brand.id} className="mb-10">
                        <div className="flex items-center gap-3 mb-4 p-2 bg-gray-50 rounded-lg">
                          <div className="w-12 h-12 bg-white rounded-md p-1 flex items-center justify-center shadow-sm">
                            <img 
                              src={brand.image} 
                              alt={brand.name} 
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-blue-700">{brand.name}</h3>
                            <p className="text-sm text-gray-600">{t.totalQuantity}: {brandTotalQuantity}</p>
                          </div>
                        </div>
                        
                        <table className="w-full mb-4 border-collapse">
                          <thead>
                            <tr className="bg-blue-50 text-left text-gray-600 text-sm">
                              <th className="px-4 py-2 border border-gray-200 rounded-tl-lg">{t.flavor}</th>
                              <th className="px-4 py-2 border border-gray-200">{t.variant}</th>
                              <th className="px-4 py-2 text-right border border-gray-200 rounded-tr-lg">{t.quantity}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {brand.items.map((item) => (
                              <tr key={`${item.flavorId}-${item.variantId}`} className="text-gray-700">
                                <td className="px-4 py-2 border border-gray-200">{item.flavorName}</td>
                                <td className="px-4 py-2 border border-gray-200">{item.variantName}</td>
                                <td className="px-4 py-2 text-right border border-gray-200">{item.quantity}</td>
                              </tr>
                            ))}
                            <tr className="bg-gray-50 font-medium">
                              <td className="px-4 py-2 text-right border border-gray-200" colSpan={2}>
                                {t.brandTotalQuantity}
                              </td>
                              <td className="px-4 py-2 text-right border border-gray-200">
                                {brandTotalQuantity}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                  
                  {/* Total Section */}
                  <div className="mt-6 border-t-2 border-blue-500 pt-4">
                    <div className="flex justify-end">
                      <div className="w-64">
                        <div className="flex justify-between py-2">
                          <span className="font-medium">{t.totalItems}:</span>
                          <span className="font-medium">{billing.items.length}</span>
                        </div>
                        <div className="flex justify-between py-3 text-lg font-bold text-blue-800">
                          <span>{t.totalQuantity}:</span>
                          <span>
                            {getGroupedBrands().reduce((total, brand) => 
                              total + brand.items.reduce((sum, item) => sum + item.quantity, 0), 0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="mt-12 pt-6 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">{t.quantityGeneratedOn} {new Date().toLocaleString(language === 'ar' ? 'ar-AE' : undefined)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PDF export content */}
          <div 
            ref={pdfRef} 
            className="relative w-full bg-white p-0" 
            style={{ display: 'block', height: 'auto', position: 'absolute', left: '-9999px', top: '0', width: '794px', direction: language === 'ar' ? 'rtl' : 'ltr' }}
          >
            <div className="pdf-content">
              <div className="relative">
                <div style={{ position: 'relative', zIndex: 10, padding: '40px' }}>
                  {/* Header */}
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h1 className="text-3xl font-bold text-blue-800">{t.invoice}</h1>
                      <p className="text-gray-600 mt-2">
                        <span className="font-medium">{t.date}:</span> {new Date().toLocaleDateString(language === 'ar' ? 'ar-AE' : undefined)}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">{t.invoiceNo}:</span> INV-{Math.floor(100000 + Math.random() * 900000)}
                      </p>
                    </div>
                    <div className="w-32 h-32 flex items-center justify-center">
                      <img 
                        src="/images/logo.png" 
                        alt="Vape Store Logo" 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                  
                  {/* Company Information */}
                  <div className="grid grid-cols-2 gap-8 mb-10 pb-6 border-b border-gray-200">
                    <div>
                      <h3 className="text-lg font-bold text-gray-700 mb-2">Sierra Vape</h3>
                      <p className="text-sm text-gray-600">Office No. 2002-0117, Owned by Sheikha Maryam bint Rashid bin Saeed Al Maktoum – Al Rigga, Dubai, UAE</p>
                      <p className="text-sm text-gray-600">Tel: (971) 54 473 3331</p>
                      <p className="text-sm text-gray-600">Email: info@myverna.com</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-700 mb-2">{t.billTo}:</h3>
                      <p className="text-sm text-gray-600">{customerInfo.name || t.customer}</p>
                      <p className="text-sm text-gray-600">{t.address}: {customerInfo.address || 'N/A'}</p>
                      <p className="text-sm text-gray-600">{t.phone}: {customerInfo.phone || 'N/A'}</p>
                    </div>
                  </div>
                  
                  {/* Brands and Items */}
                  {getGroupedBrands().map((brand) => (
                    <div key={brand.id} className="mb-10">
                      <div className="flex items-center gap-3 mb-4 p-2 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-white rounded-md p-1 flex items-center justify-center shadow-sm">
                          <img 
                            src={brand.image} 
                            alt={brand.name} 
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <h3 className="text-xl font-bold text-blue-700">{brand.name}</h3>
                      </div>
                      
                      <table className="w-full mb-4 border-collapse">
                        <thead>
                          <tr className="bg-blue-50 text-left text-gray-600 text-sm">
                            <th className="px-4 py-2 border border-gray-200 rounded-tl-lg">{t.flavor}</th>
                            <th className="px-4 py-2 border border-gray-200">{t.variant}</th>
                            <th className="px-4 py-2 text-right border border-gray-200">{t.quantity}</th>
                            <th className="px-4 py-2 text-right border border-gray-200">{t.price}</th>
                            <th className="px-4 py-2 text-right border border-gray-200 rounded-tr-lg">{t.total}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {brand.items.map((item) => (
                            <tr key={`${item.flavorId}-${item.variantId}`} className="text-gray-700">
                              <td className="px-4 py-2 border border-gray-200">{item.flavorName}</td>
                              <td className="px-4 py-2 border border-gray-200">{item.variantName}</td>
                              <td className="px-4 py-2 text-right border border-gray-200">{item.quantity}</td>
                              <td className="px-4 py-2 text-right border border-gray-200">${item.price.toFixed(2)}</td>
                              <td className="px-4 py-2 text-right border border-gray-200">${item.total.toFixed(2)}</td>
                            </tr>
                          ))}
                          <tr className="bg-gray-50">
                            <td className="px-4 py-2 text-right border border-gray-200" colSpan={4}>
                              <span className="font-medium">{t.subtotal} ({brand.name})</span>
                            </td>
                            <td className="px-4 py-2 text-right border border-gray-200 font-medium">
                              ${brand.subtotal.toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ))}
                  
                  {/* Total Section */}
                  <div className="mt-6 border-t-2 border-blue-500 pt-4">
                    <div className="flex justify-end">
                      <div className="w-64">
                        <div className="flex justify-between py-2">
                          <span className="font-medium">{t.subtotal}:</span>
                          <span className="font-medium">${billing.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="font-medium">{t.tax}:</span>
                          <span className="font-medium">$0.00</span>
                        </div>
                        <div className="flex justify-between py-3 text-lg font-bold text-blue-800">
                          <span>{t.totalAmount}:</span>
                          <span>${billing.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="mt-12 pt-6 border-t border-gray-200 text-center">
                    <p className="text-xs text-gray-400">{t.generatedOn} {new Date().toLocaleString(language === 'ar' ? 'ar-AE' : undefined)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 
