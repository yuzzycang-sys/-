import React, { useRef, useEffect, useState } from 'react';
import { Check } from 'lucide-react';

const F = "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif";

interface Props {
  selectedView: string | null;
  cacheLastOp: boolean;
  onToggleCache: () => void;
  onUpdateView: () => void;
  onSaveAsNew: () => void;
  onClose: () => void;
}

export function SaveMenu({ selectedView, cacheLastOp, onToggleCache, onUpdateView, onSaveAsNew, onClose }: Props) {
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
        position: 'absolute', top: '100%', left: 0, zIndex: 1000,
        width: 180, background: '#fff', borderRadius: 6,
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        fontFamily: F, marginTop: 4,
        border: '1px solid #e8e8e8',
      }}
    >
      {/* Cache last operation */}
      <MenuItem onClick={onToggleCache}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <div style={{
            width: 14, height: 14, borderRadius: 2, border: '1px solid',
            borderColor: cacheLastOp ? '#1890ff' : '#d9d9d9',
            background: cacheLastOp ? '#1890ff' : '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {cacheLastOp && <Check size={10} color="#fff" strokeWidth={3} />}
          </div>
          <span style={{ color: '#333' }}>缓存最后操作</span>
        </div>
      </MenuItem>

      <div style={{ height: 1, background: '#e8e8e8', margin: '0 0' }} />

      {/* Update current view */}
      <MenuItem
        onClick={() => {
          if (selectedView) { onUpdateView(); onClose(); }
        }}
        disabled={!selectedView}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: selectedView ? '#333' : '#bbb' }}>更新当前视图</span>
          {!selectedView && (
            <span style={{ fontSize: 11, color: '#bbb' }}>未选视图</span>
          )}
        </div>
      </MenuItem>

      {/* Save as new view */}
      <MenuItem onClick={() => { onSaveAsNew(); onClose(); }}>
        <span style={{ fontSize: 13, color: '#333' }}>另存为新视图</span>
      </MenuItem>
    </div>
  );
}

function MenuItem({ children, onClick, disabled = false }: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '8px 12px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: hovered && !disabled ? '#f8f8f8' : 'transparent',
      }}
    >
      {children}
    </div>
  );
}
