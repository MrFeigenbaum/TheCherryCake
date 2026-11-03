import React from 'react';
import Loader from './Loader';

export function Table({
  columns = [],
  rows = [],
  loading = false,
  emptyMessage = 'Нет данных',
  className = ''
}) {
  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-sm)'
      }}
      className={className}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: 'var(--font-size-sm)',
          minWidth: '500px'
        }}
      >
        <thead>
          <tr style={{ backgroundColor: 'var(--color-accent)', borderBottom: '2px solid var(--color-border)' }}>
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                scope="col"
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  fontWeight: 700,
                  color: 'var(--color-primary)'
                }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
                <Loader size="md" />
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, rIdx) => (
              <tr
                key={row.id || rIdx}
                style={{
                  borderBottom: '1px solid var(--color-border)',
                  backgroundColor: rIdx % 2 === 0 ? '#FFFFFF' : '#FDFBF7'
                }}
              >
                {columns.map((col, cIdx) => (
                  <td key={col.key || cIdx} style={{ padding: 'var(--space-3) var(--space-4)' }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
