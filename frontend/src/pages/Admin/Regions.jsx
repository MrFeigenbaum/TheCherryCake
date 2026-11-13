import React, { useState, useEffect } from 'react';
import { getAdminRegions } from '../../api/admin';
import Table from '../../components/ui/Table';

export function AdminRegions() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getAdminRegions()
      .then((data) => {
        if (isMounted) {
          setRegions(data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const columns = [
    { key: 'code', title: 'Код' },
    { key: 'name', title: 'Страна' },
    { key: 'currencyCode', title: 'Валюта' },
    { key: 'vatRate', title: 'Ставка НДС', render: (val) => `${Math.round((val || 0) * 100)}%` },
    { key: 'isActive', title: 'Активен', render: (val) => (val !== false ? '✅' : '❌') }
  ];

  return (
    <div>
      <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
        Регионы, валюты и ставки НДС
      </h2>
      <Table columns={columns} rows={regions} loading={loading} />
    </div>
  );
}

export default AdminRegions;