'use client';

import { useState, useEffect } from 'react';
import { BillingHistory, DashboardStats, BillingItem, Brand } from '../types';
import { ALL_BRANDS } from '../data/vapeData';
import ProductManagement from './ProductManagement';

// Generate mock billing history from actual products
const generateMockBillingHistory = (): BillingHistory[] => {
  const history: BillingHistory[] = [];
  const statuses: ('completed' | 'pending' | 'cancelled')[] = ['completed', 'pending', 'cancelled'];
  const customers = [
    { name: 'John Doe', phone: '+1234567890', address: 'Dubai, UAE' },
    { name: 'Jane Smith', phone: '+1987654321', address: 'Abu Dhabi, UAE' },
    { name: 'Ahmed Ali', phone: '+971501234567', address: 'Sharjah, UAE' },
    { name: 'Sarah Khan', phone: '+971502345678', address: 'Dubai, UAE' },
    { name: 'Mohammed Hassan', phone: '+971503456789', address: 'Ajman, UAE' }
  ];

  // Generate 20 random bills
  for (let i = 1; i <= 20; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const items: BillingItem[] = [];
    let totalAmount = 0;

    // Generate 1-5 random items per bill
    const numItems = Math.floor(Math.random() * 5) + 1;
    for (let j = 0; j < numItems; j++) {
      const brand = ALL_BRANDS[Math.floor(Math.random() * ALL_BRANDS.length)];
      const flavor = brand.flavors[Math.floor(Math.random() * brand.flavors.length)];
      const variant = flavor.variants[Math.floor(Math.random() * flavor.variants.length)];
      
      const quantity = Math.floor(Math.random() * 5) + 1;
      const price = variant.price;
      const total = quantity * price;
      totalAmount += total;

      items.push({
        flavorId: flavor.id,
        flavorName: flavor.name,
        variantId: variant.id,
        variantName: variant.name,
        quantity,
        price,
        total,
        brandId: brand.id,
        brandName: brand.name,
        brandImage: brand.image
      });
    }

    history.push({
      id: i.toString(),
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: customer.address,
      items,
      totalAmount,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    });
  }

  return history;
};

// Calculate dashboard stats from billing history
const calculateStats = (history: BillingHistory[]): DashboardStats => {
  const totalSales = history.reduce((sum, bill) => sum + bill.totalAmount, 0);
  const totalOrders = history.length;
  const averageOrderValue = totalSales / totalOrders;

  // Calculate top products
  const productMap = new Map<string, { quantity: number; revenue: number }>();
  
  history.forEach(bill => {
    bill.items.forEach(item => {
      const key = `${item.brandName} - ${item.flavorName}`;
      const existing = productMap.get(key) || { quantity: 0, revenue: 0 };
      productMap.set(key, {
        quantity: existing.quantity + item.quantity,
        revenue: existing.revenue + item.total
      });
    });
  });

  const topProducts = Array.from(productMap.entries())
    .map(([name, data]) => ({
      name,
      quantity: data.quantity,
      revenue: data.revenue
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return {
    totalSales,
    totalOrders,
    averageOrderValue,
    topProducts
  };
};

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<BillingHistory[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topProducts: []
  });
  const [brands, setBrands] = useState<Brand[]>(ALL_BRANDS);
  const [activeTab, setActiveTab] = useState<'overview' | 'products'>('overview');

  useEffect(() => {
    // Generate mock data
    const history = generateMockBillingHistory();
    setBillingHistory(history);
    setFilteredHistory(history);
    setStats(calculateStats(history));
  }, []);

  useEffect(() => {
    const filtered = billingHistory.filter(bill => 
      bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.id.includes(searchTerm)
    );
    setFilteredHistory(filtered);
  }, [searchTerm, billingHistory]);

  const handleUpdateBrands = (updatedBrands: Brand[]) => {
    setBrands(updatedBrands);
    // Here you would typically save the updated brands to your backend
    console.log('Updated brands:', updatedBrands);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Product Management
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Sales</p>
                  <p className="text-xl font-semibold text-gray-900">{formatCurrency(stats.totalSales)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Orders</p>
                  <p className="text-xl font-semibold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Average Order</p>
                  <p className="text-xl font-semibold text-gray-900">{formatCurrency(stats.averageOrderValue)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Top Product</p>
                  <p className="text-xl font-semibold text-gray-900">{stats.topProducts[0]?.quantity || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.topProducts.map((product, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{product.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{formatCurrency(product.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Billing History</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by customer or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredHistory.map((bill) => (
                    <tr key={bill.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{bill.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(bill.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{bill.customerName}</div>
                        <div className="text-sm text-gray-500">{bill.customerPhone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bill.items.length} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {formatCurrency(bill.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                          {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                        <button className="text-blue-600 hover:text-blue-900">Print</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <ProductManagement
          brands={brands}
          onUpdateBrands={handleUpdateBrands}
        />
      )}
    </div>
  );
} 