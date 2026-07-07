import { useState } from 'react';
import { createProduct } from './api';

const EMPTY = {
  sku: '', product_name: '', category: '',
  unit_price: '', currency: 'USD', submitted_by: '', region: '',
};

export default function ProductForm({ onCreated }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError(''); setSuccess('');
    try {
      const payload = { ...form, unit_price: parseFloat(form.unit_price) };
      await createProduct(payload);
      setSuccess('Product ' + form.sku + ' created.');
      setForm(EMPTY);
      if (onCreated) onCreated();
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong');
    }
  };

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Submit a Product</h2>
      {['sku','product_name','category','unit_price','currency','submitted_by','region'].map((field) => (
        <div key={field} style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 13 }}>{field}</label>
          <input
            name={field}
            value={form[field]}
            onChange={handleChange}
            style={{ width: '100%', padding: 6 }}
          />
        </div>
      ))}
      <button onClick={handleSubmit} style={{ padding: '8px 16px', marginTop: 8 }}>
        Submit
      </button>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}