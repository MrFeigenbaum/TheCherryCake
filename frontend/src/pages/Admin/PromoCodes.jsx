import React, { useState, useEffect } from 'react';
import { getAdminPromoCodes } from '../../api/admin';
import Table from '../../components/ui/Table';

export function AdminPromoCodes() {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getAdminPromoCodes()
      .then((data) => {
        if (isMounted) {
          setPromoCodes(data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const columns = [
    { key: 'code', title: 'Промокод' },
    { key: 'discountRate', title: 'Скидка', render: (val) => `${Math.round((val || 0) * 100)}%` },
    { key: 'validUntil', title: 'Действует до' },
    { key: 'isActive', title: 'Активен', render: (val) => (val !== false ? '✅' : '❌') }
  ];

  return (
    <div>
      <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
        Промокоды
      </h2>
      <Table columns={columns} rows={promoCodes} loading={loading} />
    </div>
  );
}

export default AdminPromoCodes;