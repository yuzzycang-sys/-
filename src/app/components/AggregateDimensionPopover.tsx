import React, { useRef, useEffect, useState } from 'react';
import { Check, GripVertical, X } from 'lucide-react';

const F = "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif";

export type DimOption = { key: string; label: string };

export const ALL_DIM_OPTIONS: DimOption[] = [
  { key: 'time',      label: '时间' },
  { key: 'media',     label: '媒体' },
  { key: 'optimizer', label: '优化师' },
  { key: 'game',      label: '游戏' },
  { key: 'channel',   label: '主渠道' },
  { key: 'os',        label: '系统' },
  { key: 'region',    label: '地区' },
  { key: 'adtype',    label: '广告类型' },
];

interface Props {
  activeDims: string[];          // ordered selected dim keys
  onChangeDims: (dims: string[]) => void;
  onClose: () => void;
}

export function AggregateDimensionPopover({ activeDims, onChangeDims, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // Local copy so changes are immediate
  const [localDims, setLocalDims] = useState<string[]>(activeDims);
  const [draggedKey, setDraggedKey] = useState<string | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);

  // Keep in sync if parent changes
  useEffect(() => { setLocalDims(activeDims); }, [activeDims.join(',')]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const toggleDim = (key: string) => {
    const next = localDims.includes(key)
      ? localDims.filter(k => k !== key)
      : [...localDims, key];
    setLocalDims(next);
    onChangeDims(next);
  };

  // Drag-to-reorder in right panel
  const handleDragStart = (key: string) => setDraggedKey(key);

  const handleDragOver = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    if (draggedKey && draggedKey !== key) setDragOverKey(key);
  };

  const handleDrop = (e: React.DragEvent, targetKey: string) => {
    e.preventDefault();
    if (!draggedKey || draggedKey === targetKey) {
      setDraggedKey(null); setDragOverKey(null); return;
    }
    const next = [...localDims];
    const fromIdx = next.indexOf(draggedKey);
    const toIdx = next.indexOf(targetKey);
    next.splice(fromIdx, 1);
    next.splice(toIdx, 0, draggedKey);
    setLocalDims(next);
    onChangeDims(next);
    setDraggedKey(null);
    setDragOverKey(null);
  };

  const handleDragEnd = () => { setDraggedKey(null); setDragOverKey(null); };

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute', top: '100%', left: 0, zIndex: 1000,
        background: '#fff', borderRadius: 8,
        boxShadow: '0 6px 24px rgba(0,0,0,0.14)',
        fontFamily: F, marginTop: 4,
        border: '1px solid #e8e8e8',
        width: 420,
      }}
    >
      {/* Header */}
      <div style={{
        padding: '12px 16px', borderBottom: '1px solid #e8e8e8',
        fontSize: 13, fontWeight: 600, color: '#333',
      }}>
        聚合维度
      </div>

      {/* Body */}
      <div style={{ display: 'flex', minHeight: 200 }}>

        {/* ── Left: option list ── */}
        <div style={{
          width: 190, borderRight: '1px solid #e8e8e8',
          padding: '8px 0', overflowY: 'auto',
          flexShrink: 0,
        }}>
          <div style={{ padding: '4px 14px 8px', fontSize: 11, color: '#aaa' }}>可选项</div>
          {ALL_DIM_OPTIONS.map(opt => {
            const checked = localDims.includes(opt.key);
            return (
              <div
                key={opt.key}
                onClick={() => toggleDim(opt.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 14px', cursor: 'pointer', fontSize: 13, color: '#333',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#f8f8f8'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
              >
                <div style={{
                  width: 15, height: 15, borderRadius: 3, flexShrink: 0,
                  border: `1.5px solid ${checked ? '#1890ff' : '#d9d9d9'}`,
                  background: checked ? '#1890ff' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}>
                  {checked && <Check size={10} color="#fff" strokeWidth={2.5} />}
                </div>
                <span>{opt.label}</span>
              </div>
            );
          })}
        </div>

        {/* ── Right: selected + draggable ── */}
        <div style={{ flex: 1, padding: '8px 0', minWidth: 0 }}>
          <div style={{ padding: '4px 14px 8px', fontSize: 11, color: '#aaa' }}>
            已选 ({localDims.length}) · 拖拽可调整顺序
          </div>

          {localDims.length === 0 ? (
            <div style={{
              textAlign: 'center', color: '#bbb', fontSize: 12,
              padding: '24px 16px',
            }}>
              请从左侧勾选维度
            </div>
          ) : (
            localDims.map((key, idx) => {
              const opt = ALL_DIM_OPTIONS.find(o => o.key === key);
              if (!opt) return null;
              const isDragging = draggedKey === key;
              const isOver = dragOverKey === key;
              return (
                <div
                  key={key}
                  draggable
                  onDragStart={() => handleDragStart(key)}
                  onDragOver={e => handleDragOver(e, key)}
                  onDrop={e => handleDrop(e, key)}
                  onDragEnd={handleDragEnd}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '7px 14px',
                    cursor: 'grab',
                    background: isDragging
                      ? '#e6f7ff'
                      : isOver
                        ? '#f0f9ff'
                        : 'transparent',
                    borderTop: isOver ? '2px solid #1890ff' : '2px solid transparent',
                    opacity: isDragging ? 0.6 : 1,
                    transition: 'background 0.1s',
                  }}
                >
                  <GripVertical size={13} color="#ccc" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#333', flex: 1 }}>
                    <span style={{
                      display: 'inline-block', width: 18, textAlign: 'right',
                      color: '#1890ff', marginRight: 6, fontSize: 11,
                    }}>{idx + 1}</span>
                    {opt.label}
                  </span>
                  <div
                    onClick={e => { e.stopPropagation(); toggleDim(key); }}
                    style={{ cursor: 'pointer', lineHeight: 0, flexShrink: 0 }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.color = '#ff4d4f'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.color = '#ccc'}
                  >
                    <X size={13} color="#ccc" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
