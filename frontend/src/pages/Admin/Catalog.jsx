import React, { useState, useEffect } from 'react';
import { getAdminProducts } from '../../api/admin';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';

export function AdminCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getAdminProducts()
      .then((data) => {
        if (isMounted) {
          setProducts(data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'name', title: 'Название' },
    { key: 'categoryName', title: 'Категория' },
    { key: 'isActive', title: 'Активен', render: (val) => (val !== false ? '✅' : '❌') }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)' }}>Каталог товаров</h2>
        <Button variant="primary" size="sm">+ Добавить товар</Button>
      </div>
      <Table columns={columns} rows={products} loading={loading} />
    </div>
  );
}

export default AdminCatalog;
