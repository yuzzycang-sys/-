import React, { useRef, useEffect } from 'react';
import { Checkbox, Button } from 'antd';
import { FILTER_GROUPS } from './filterConfig';

const F = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

interface Props {
  activeFilters: string[];
  onToggleFilter: (key: string) => void;
  onClearAll: () => void;
  onClose: () => void;
  fixedLeft: number;
  fixedTop: number;
}

export function AllFiltersPopover({ activeFilters, onToggleFilter, onClearAll, onClose, fixedLeft, fixedTop }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        left: fixedLeft,
        top: fixedTop,
        zIndex: 9999,
        width: 480,
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
        border: '1px solid #e8e8e8',
        fontFamily: F,
        maxHeight: 'calc(100vh - 120px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ overflowY: 'auto', padding: '14px 20px 10px', flex: 1 }}>
        {FILTER_GROUPS.map((group, gi) => (
          <div key={group.group} style={{ marginBottom: gi < FILTER_GROUPS.length - 1 ? 16 : 0 }}>
            <div style={{
              fontSize: 12, fontWeight: 500, color: '#8c8c8c',
              marginBottom: 8, paddingBottom: 5,
              borderBottom: '1px solid #f0f0f0',
            }}>
              {group.group}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px 0' }}>
              {group.items.map(item => {
                const checked = activeFilters.includes(item.key);
                return (
                  <div
                    key={item.key}
                    onClick={() => onToggleFilter(item.key)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '4px 0' }}
                  >
                    <Checkbox checked={checked} style={{ pointerEvents: 'none' }} />
                    <span style={{ fontSize: 13, color: '#333', whiteSpace: 'nowrap' }}>{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {activeFilters.length > 0 && (
        <div style={{
          padding: '8px 20px',
          borderTop: '1px solid #f0f0f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 12, color: '#8c8c8c' }}>已选 {activeFilters.length} 个筛选维度</span>
          <Button type="link" size="small" onClick={onClearAll} style={{ fontSize: 12, padding: 0 }}>
            清空
          </Button>
        </div>
      )}
    </div>
  );
}
