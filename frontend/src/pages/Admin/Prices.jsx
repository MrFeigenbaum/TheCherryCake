import React, { useState, useEffect } from 'react';
import { getAdminPrices } from '../../api/admin';
import Table from '../../components/ui/Table';

export function AdminPrices() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getAdminPrices()
      .then((data) => {
        if (isMounted) {
          setPrices(data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const columns = [
    { key: 'productName', title: 'Товар' },
    { key: 'regionCode', title: 'Регион' },
    { key: 'price', title: 'Цена' },
    { key: 'isAvailable', title: 'В наличии', render: (val) => (val ? '✅ Да' : '❌ Нет') }
  ];

  return (
    <div>
      <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
        Региональные цены и наличие (Матрица)
      </h2>
      <Table columns={columns} rows={prices} loading={loading} />
    </div>
  );
}

export default AdminPrices;
