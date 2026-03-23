import React, { useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import { FILTER_GROUPS } from './filterConfig';

const F = "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif";

interface Props {
  activeFilters: string[];
  onToggleFilter: (key: string) => void;
  onClose: () => void;
  /** position: fixed coordinates from parent's getBoundingClientRect */
  fixedLeft: number;
  fixedTop: number;
}

export function AllFiltersPopover({ activeFilters, onToggleFilter, onClose, fixedLeft, fixedTop }: Props) {
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
        width: 420,
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
        fontFamily: F,
        border: '1px solid #e8e8e8',
      }}
    >
      <div style={{ padding: '16px 20px' }}>
        {FILTER_GROUPS.map((group, gi) => (
          <div key={group.group} style={{ marginBottom: gi < FILTER_GROUPS.length - 1 ? 16 : 0 }}>
            <div style={{ fontSize: 12, color: '#999', marginBottom: 10 }}>
              {group.group}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 0' }}>
              {group.items.map(item => {
                const checked = activeFilters.includes(item.key);
                return (
                  <CheckItem
                    key={item.key}
                    label={item.label}
                    checked={checked}
                    onToggle={() => onToggleFilter(item.key)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CheckItem({ label, checked, onToggle }: {
  label: string; checked: boolean; onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '3px 0' }}
    >
      <div style={{
        width: 16, height: 16, borderRadius: 3, flexShrink: 0,
        border: `1.5px solid ${checked ? '#1890ff' : '#d9d9d9'}`,
        background: checked ? '#1890ff' : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      }}>
        {checked && <Check size={11} color="#fff" strokeWidth={2.5} />}
      </div>
      <span style={{ fontSize: 13, color: '#333', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
}
