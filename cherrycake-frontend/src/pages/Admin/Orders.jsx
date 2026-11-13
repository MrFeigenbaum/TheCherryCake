import React, { useState, useEffect } from 'react';
import { getAdminOrders, updateAdminOrderStatus } from '../../api/admin';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { formatDateTime } from '../../utils/format-date';

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    getAdminOrders()
      .then((data) => {
        setOrders(data?.content || data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    updateAdminOrderStatus(orderId, newStatus).then(() => {
      fetchOrders();
    });
  };

  const columns = [
    { key: 'orderNumber', title: 'Номер заказа' },
    { key: 'customerName', title: 'Клиент' },
    { key: 'orderDate', title: 'Дата', render: (val) => formatDateTime(val) },
    {
      key: 'status',
      title: 'Статус',
      render: (val) => {
        const variant = val === 'DONE' ? 'success' : val === 'CANCELLED' ? 'error' : 'primary';
        return <Badge variant={variant}>{val}</Badge>;
      }
    },
    {
      key: 'actions',
      title: 'Действия',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
          {row.status === 'NEW' && (
            <Button size="sm" variant="secondary" onClick={() => handleStatusChange(row.id, 'CONFIRMED')}>
              Подтвердить
            </Button>
          )}
          {row.status === 'CONFIRMED' && (
            <Button size="sm" variant="primary" onClick={() => handleStatusChange(row.id, 'DONE')}>
              Выполнен
            </Button>
          )}
          {row.status !== 'CANCELLED' && row.status !== 'DONE' && (
            <Button size="sm" variant="ghost" onClick={() => handleStatusChange(row.id, 'CANCELLED')}>
              Отменить
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div>
      <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
        Управление заказами
      </h2>
      <Table columns={columns} rows={orders} loading={loading} />
    </div>
  );
}

export default AdminOrders;