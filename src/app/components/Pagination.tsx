import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const F = "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif";

interface Props {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
}

export function Pagination({ total, page, pageSize, onPageChange, onPageSizeChange }: Props) {
  const totalPages = Math.ceil(total / pageSize);
  const PAGE_SIZES = [10, 20, 30, 50, 100];

  // Generate page numbers to display
  const getPages = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 4) pages.push('ellipsis');
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 3) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div style={{
      height: 40, display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
      borderTop: '1px solid #dee0e3', padding: '0 16px', gap: 8,
      background: 'transparent', flexShrink: 0, fontFamily: F,
    }}>
      {/* Total count */}
      <span style={{ fontSize: 12, color: '#999', marginRight: 4 }}>
        共 {total.toLocaleString('zh-CN')} 条
      </span>

      {/* Prev */}
      <PageBtn
        onClick={() => page > 1 && onPageChange(page - 1)}
        disabled={page === 1}
      >
        <ChevronLeft size={13} />
      </PageBtn>

      {/* Page numbers */}
      {getPages().map((p, idx) =>
        p === 'ellipsis' ? (
          <div key={`e-${idx}`} style={{ width: 28, textAlign: 'center', fontSize: 12, color: '#999' }}>
            <MoreHorizontal size={13} />
          </div>
        ) : (
          <PageBtn
            key={p}
            active={p === page}
            onClick={() => onPageChange(p as number)}
          >
            {p}
          </PageBtn>
        )
      )}

      {/* Next */}
      <PageBtn
        onClick={() => page < totalPages && onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        <ChevronRight size={13} />
      </PageBtn>

      {/* Page size selector */}
      <select
        value={pageSize}
        onChange={e => onPageSizeChange(Number(e.target.value))}
        style={{
          border: '1px solid #d9d9d9', borderRadius: 4, padding: '3px 6px',
          fontSize: 12, color: '#333', background: '#fff', cursor: 'pointer',
          outline: 'none', marginLeft: 4,
        }}
      >
        {PAGE_SIZES.map(s => (
          <option key={s} value={s}>{s} 条/页</option>
        ))}
      </select>
    </div>
  );
}

function PageBtn({ children, onClick, active, disabled }: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        minWidth: 28, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 4, border: `1px solid ${active ? '#3370ff' : '#dee0e3'}`,
        fontSize: 12, cursor: disabled ? 'not-allowed' : 'pointer',
        color: active ? '#3370ff' : disabled ? '#c9cdd4' : hovered ? '#3370ff' : '#1f2329',
        background: active ? '#e8f0ff' : hovered && !disabled ? '#f5f6f7' : '#fff',
        padding: '0 4px',
      }}
    >
      {children}
    </div>
  );
}