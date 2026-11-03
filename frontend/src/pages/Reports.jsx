import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getSalesReport, exportReport } from '../api/reports';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Select from '../components/ui/Select';
import { formatMoney } from '../utils/format-money';

export function Reports() {
  const regionCode = useSelector((state) => state.region.code);
  const currencyCode = useSelector((state) => state.region.currencyCode);
  const [groupBy, setGroupBy] = useState('MONTH');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getSalesReport({ groupBy, region: regionCode })
      .then((data) => {
        if (isMounted) {
          setReportData(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [groupBy, regionCode]);

  const handleExport = (format) => {
    exportReport({ format, groupBy, region: regionCode }).then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sales-report.${format.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  };

  const columns = [
    { key: 'period', title: groupBy === 'MONTH' ? 'Месяц' : 'Регион' },
    { key: 'ordersCount', title: 'Заказов' },
    { key: 'totalRevenue', title: 'Выручка', render: (val) => formatMoney(val, currencyCode) },
    { key: 'vatTotal', title: 'НДС', render: (val) => formatMoney(val, currencyCode) }
  ];

  return (
    <div className="container" style={{ padding: 'var(--space-6) var(--space-4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontSize: 'var(--font-size-2xl)' }}>
            Отчёты по продажам
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Аналитика выручки и заказов с возможностью экспорта</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button variant="secondary" size="sm" onClick={() => handleExport('CSV')}>
            Экспорт CSV
          </Button>
          <Button variant="secondary" size="sm" onClick={() => handleExport('PDF')}>
            Экспорт PDF
          </Button>
        </div>
      </div>

      <div style={{ maxWidth: '240px', marginBottom: 'var(--space-4)' }}>
        <Select
          label="Группировка"
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
          options={[
            { value: 'MONTH', label: 'По месяцам' },
            { value: 'REGION', label: 'По регионам' }
          ]}
        />
      </div>

      <Card>
        <Table columns={columns} rows={reportData?.rows || []} loading={loading} />
      </Card>
    </div>
  );
}

export default Reports;
