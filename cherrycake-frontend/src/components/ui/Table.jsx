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
        border: '1px solid var(--cherry-border, var(--color-border))',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--cherry-card, var(--color-surface))'
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
          <tr
            style={{
              backgroundColor: 'var(--cherry-panel, rgba(35, 11, 28, 0.95))',
              borderBottom: '2px solid var(--cherry-border, var(--color-border))'
            }}
          >
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                scope="col"
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  fontWeight: 700,
                  color: 'var(--sakura-pink, #ffb7c5)',
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                  fontSize: '0.8rem'
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
                style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-dim, var(--color-text-muted))' }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, rIdx) => (
              <tr
                key={row.id || rIdx}
                style={{
                  borderBottom: '1px solid var(--cherry-border, var(--color-border))',
                  backgroundColor: rIdx % 2 === 0 ? 'transparent' : 'rgba(255, 183, 197, 0.05)'
                }}
              >
                {columns.map((col, cIdx) => (
                  <td
                    key={col.key || cIdx}
                    style={{
                      padding: 'var(--space-3) var(--space-4)',
                      color: 'var(--text-main, #fdf2f5)',
                      fontWeight: 500
                    }}
                  >
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