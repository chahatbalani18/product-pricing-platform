import { useEffect, useState } from 'react';
import { getProducts } from './api';

export default function ProductDashboard({ refreshKey }) {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      setError('Could not load products');
    }
  };

  useEffect(() => { load(); }, [refreshKey]);

  const visible = filter === 'all'
    ? products
    : products.filter((p) => p.status === filter);

  return (
    <div style={{ marginTop: 32 }}>
      <h2>Product Catalog</h2>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 13, marginRight: 8 }}>Filter by status:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            {['SKU','Name','Category','Price','Currency','Submitted By','Region','Status'].map((h) => (
              <th key={h} style={{ borderBottom: '2px solid #ccc', textAlign: 'left', padding: 6 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visible.map((p) => (
            <tr key={p.id}>
              <td style={{ padding: 6, borderBottom: '1px solid #eee' }}>{p.sku}</td>
              <td style={{ padding: 6, borderBottom: '1px solid #eee' }}>{p.product_name}</td>
              <td style={{ padding: 6, borderBottom: '1px solid #eee' }}>{p.category}</td>
              <td style={{ padding: 6, borderBottom: '1px solid #eee' }}>{p.unit_price}</td>
              <td style={{ padding: 6, borderBottom: '1px solid #eee' }}>{p.currency}</td>
              <td style={{ padding: 6, borderBottom: '1px solid #eee' }}>{p.submitted_by}</td>
              <td style={{ padding: 6, borderBottom: '1px solid #eee' }}>{p.region}</td>
              <td style={{ padding: 6, borderBottom: '1px solid #eee' }}>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {visible.length === 0 && <p style={{ color: '#888' }}>No products to show.</p>}
    </div>
  );
}