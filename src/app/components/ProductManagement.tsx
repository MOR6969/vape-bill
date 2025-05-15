'use client';

import { useState } from 'react';
import { Brand, Flavor, FlavorVariant } from '../types';
import Image from 'next/image';

interface ProductManagementProps {
  brands: Brand[];
  onUpdateBrands: (brands: Brand[]) => void;
}

export default function ProductManagement({ brands, onUpdateBrands }: ProductManagementProps) {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<Flavor | null>(null);
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [isAddingFlavor, setIsAddingFlavor] = useState(false);
  const [isAddingVariant, setIsAddingVariant] = useState(false);

  // New item states
  const [newBrand, setNewBrand] = useState({
    name: '',
    image: ''
  });
  const [newFlavor, setNewFlavor] = useState({
    name: '',
    image: ''
  });
  const [newVariant, setNewVariant] = useState({
    name: '',
    price: 0,
    quantity: 0
  });

  const handleAddBrand = () => {
    if (!newBrand.name || !newBrand.image) return;

    const brand: Brand = {
      id: newBrand.name.toLowerCase().replace(/\s+/g, '-'),
      name: newBrand.name,
      image: newBrand.image,
      flavors: []
    };

    onUpdateBrands([...brands, brand]);
    setNewBrand({ name: '', image: '' });
    setIsAddingBrand(false);
  };

  const handleAddFlavor = () => {
    if (!selectedBrand || !newFlavor.name || !newFlavor.image) return;

    const flavor: Flavor = {
      id: newFlavor.name.toLowerCase().replace(/\s+/g, '-'),
      name: newFlavor.name,
      image: newFlavor.image,
      variants: []
    };

    const updatedBrands = brands.map(brand => {
      if (brand.id === selectedBrand.id) {
        return {
          ...brand,
          flavors: [...brand.flavors, flavor]
        };
      }
      return brand;
    });

    onUpdateBrands(updatedBrands);
    setNewFlavor({ name: '', image: '' });
    setIsAddingFlavor(false);
  };

  const handleAddVariant = () => {
    if (!selectedBrand || !selectedFlavor || !newVariant.name) return;

    const variant: FlavorVariant = {
      id: newVariant.name.toLowerCase().replace(/\s+/g, '-'),
      name: newVariant.name,
      price: newVariant.price,
      quantity: newVariant.quantity
    };

    const updatedBrands = brands.map(brand => {
      if (brand.id === selectedBrand.id) {
        return {
          ...brand,
          flavors: brand.flavors.map(flavor => {
            if (flavor.id === selectedFlavor.id) {
              return {
                ...flavor,
                variants: [...flavor.variants, variant]
              };
            }
            return flavor;
          })
        };
      }
      return brand;
    });

    onUpdateBrands(updatedBrands);
    setNewVariant({ name: '', price: 0, quantity: 0 });
    setIsAddingVariant(false);
  };

  return (
    <div className="space-y-8">
      {/* Brands Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Brands</h2>
          <button
            onClick={() => setIsAddingBrand(true)}
            className="btn btn-primary"
          >
            Add Brand
          </button>
        </div>

        {isAddingBrand && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <h3 className="text-md font-medium mb-4">Add New Brand</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={newBrand.name}
                  onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter brand name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={newBrand.image}
                  onChange={(e) => setNewBrand({ ...newBrand, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter image URL"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsAddingBrand(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBrand}
                  className="btn btn-primary"
                >
                  Add Brand
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                selectedBrand?.id === brand.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setSelectedBrand(brand)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 relative">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{brand.name}</h3>
                  <p className="text-sm text-gray-500">
                    {brand.flavors.length} flavors
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flavors Section */}
      {selectedBrand && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Flavors - {selectedBrand.name}
            </h2>
            <button
              onClick={() => setIsAddingFlavor(true)}
              className="btn btn-primary"
            >
              Add Flavor
            </button>
          </div>

          {isAddingFlavor && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h3 className="text-md font-medium mb-4">Add New Flavor</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Flavor Name
                  </label>
                  <input
                    type="text"
                    value={newFlavor.name}
                    onChange={(e) => setNewFlavor({ ...newFlavor, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter flavor name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={newFlavor.image}
                    onChange={(e) => setNewFlavor({ ...newFlavor, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter image URL"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsAddingFlavor(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddFlavor}
                    className="btn btn-primary"
                  >
                    Add Flavor
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedBrand.flavors.map((flavor) => (
              <div
                key={flavor.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedFlavor?.id === flavor.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setSelectedFlavor(flavor)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 relative">
                    <Image
                      src={flavor.image}
                      alt={flavor.name}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{flavor.name}</h3>
                    <p className="text-sm text-gray-500">
                      {flavor.variants.length} variants
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Variants Section */}
      {selectedBrand && selectedFlavor && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Variants - {selectedFlavor.name}
            </h2>
            <button
              onClick={() => setIsAddingVariant(true)}
              className="btn btn-primary"
            >
              Add Variant
            </button>
          </div>

          {isAddingVariant && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h3 className="text-md font-medium mb-4">Add New Variant</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Variant Name
                  </label>
                  <input
                    type="text"
                    value={newVariant.name}
                    onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter variant name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    value={newVariant.price}
                    onChange={(e) => setNewVariant({ ...newVariant, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={newVariant.quantity}
                    onChange={(e) => setNewVariant({ ...newVariant, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter quantity"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsAddingVariant(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddVariant}
                    className="btn btn-primary"
                  >
                    Add Variant
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variant Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedFlavor.variants.map((variant) => (
                  <tr key={variant.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {variant.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ${variant.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {variant.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 