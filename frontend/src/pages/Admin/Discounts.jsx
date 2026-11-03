import React, { useState, useEffect } from 'react';
import { getAdminDiscounts } from '../../api/admin';
import Table from '../../components/ui/Table';

export function AdminDiscounts() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getAdminDiscounts()
      .then((data) => {
        if (isMounted) {
          setDiscounts(data || []);
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
    { key: 'regionCode', title: 'Регион' },
    { key: 'thresholdAmount', title: 'Порог суммы' },
    { key: 'discountRate', title: 'Скидка', render: (val) => `${Math.round((val || 0) * 100)}%` }
  ];

  return (
    <div>
      <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
        Пороги скидок
      </h2>
      <Table columns={columns} rows={discounts} loading={loading} />
    </div>
  );
}

export default AdminDiscounts;
