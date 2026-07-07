import { useState } from 'react';
import ProductForm from './ProductForm';
import ProductDashboard from './ProductDashboard';

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div style={{ maxWidth: 1000, margin: '40px auto', fontFamily: 'system-ui, sans-serif', padding: '0 16px' }}>
      <h1>Product Pricing & Catalog Intake Platform</h1>
      <p style={{ color: '#666' }}>Submit products and view the catalog. Data persists to a cloud Postgres database.</p>
      <ProductForm onCreated={() => setRefreshKey((k) => k + 1)} />
      <ProductDashboard refreshKey={refreshKey} />
    </div>
  );
}