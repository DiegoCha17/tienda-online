'use client';

import { useState } from 'react';
import DeleteProductButton from './DeleteProductButton';
import EditProductButton from './EditProductButton';
import { formatCRC } from '@/lib/currency';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  images: string[] | null;
  specifications: Record<string, string[]> | null;
  features: Record<string, string> | null;
  stock: number;
  category: string;
  active: boolean;
};

type Props = {
  products: Product[];
  categories: string[];
};

export default function AdminProductTable({ products, categories }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = selectedCategory
    ? products.filter(p => (p.category || 'General') === selectedCategory)
    : products;

  return (
    <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-gray-100 mt-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Inventario de Productos ({filteredProducts.length})
        </h2>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
            !selectedCategory 
              ? 'bg-gray-900 text-white shadow-md' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Todos
        </button>
        {categories.map((category: string) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
              selectedCategory === category 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 font-medium">No se encontraron productos para este filtro.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-4 px-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="py-4 px-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Categoría</th>
                <th className="py-4 px-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Precio / Stock</th>
                <th className="py-4 px-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="py-4 px-4 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={product.image_url || 'https://via.placeholder.com/120'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-400 capitalize">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {product.category || 'General'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-gray-900">{formatCRC(Number(product.price))}</p>
                    <p className={`text-sm font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {product.stock} disponibles
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${product.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${product.active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {product.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <EditProductButton
                        product={{
                          id: product.id,
                          name: product.name,
                          description: product.description || '',
                          price: Number(product.price),
                          image_url: product.image_url || '',
                          images: product.images || [],
                          specifications: product.specifications || {},
                          features: product.features || {},
                          stock: product.stock,
                          category: product.category || 'General',
                          active: product.active,
                        }}
                      />
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
