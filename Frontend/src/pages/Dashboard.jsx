import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTopCustomers, getTopProducts } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const tenantId = localStorage.getItem('tenant_id');
  const token = localStorage.getItem('token');
  const slug = localStorage.getItem('company_slug');

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !slug) {
      console.warn('[Dashboard] Missing authentication data, redirecting to login.');
      navigate('/');
    }
  }, [token, slug, navigate]);

  const fetchCustomers = async () => {
    if (!slug) return setError('Company context missing. Please login again.');
    setLoading(true);
    setError('');
    try {
      const data = await getTopCustomers(slug, token);
      if (data.error) throw new Error(data.error);
      setCustomers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    if (!slug) return setError('Company context missing. Please login again.');
    setLoading(true);
    setError('');
    try {
      const data = await getTopProducts(slug, token);
      if (data.error) throw new Error(data.error);
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token || !slug) return null;

  const renderTable = (data, title, emptyMessage) => (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      {data.length > 0 ? (
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th key={key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {key.replace('_', ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, idx) => (
                <tr key={item.customer_id || item.product_id || idx} className="hover:bg-gray-50 transition-colors">
                  {Object.values(item).map((val, i) => (
                    <td key={i} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {val?.toString() || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 italic p-4 bg-gray-50 rounded-md border border-dashed border-gray-300">
          {emptyMessage}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-8">
      <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Company Dashboard</h2>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all shadow-md"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm">
            <p className="text-xs uppercase text-blue-600 font-bold mb-1">Tenant ID</p>
            <p className="text-lg font-mono font-semibold text-blue-900">{tenantId}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
            <p className="text-xs uppercase text-emerald-600 font-bold mb-1">Company Slug</p>
            <p className="text-lg font-mono font-semibold text-emerald-900">{slug}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 shadow-sm overflow-hidden">
            <p className="text-xs uppercase text-purple-600 font-bold mb-1">Auth Token</p>
            <p className="text-sm font-mono truncate text-purple-900" title={token}>{token?.substring(0, 30)}...</p>
          </div>
        </div>

        <div className="flex gap-4 mb-10">
          <button 
            onClick={fetchCustomers}
            className="flex-1 p-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all transform hover:scale-[1.02] shadow-lg active:scale-95"
          >
            Fetch Full Customer Details
          </button>
          <button 
            onClick={fetchProducts}
            className="flex-1 p-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all transform hover:scale-[1.02] shadow-lg active:scale-95"
          >
            Fetch Full Product Details
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-12">
          {renderTable(customers, "Top 5 Customers (Full Details)", "No customers loaded yet. Click the button above to fetch data.")}
          {renderTable(products, "Top 5 Products (Full Details)", "No products loaded yet. Click the button above to fetch data.")}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
