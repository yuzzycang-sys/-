import React, { useState, useRef, useEffect } from 'react';
import { Info, Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { FILTER_GROUPS, FILTER_CHIP_DATA } from './filterConfig';

const F = "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif";

export type LocalFilters = Record<string, string[]>;

interface Props {
  localFilters: LocalFilters;
  onChangeFilters: (next: LocalFilters) => void;
  anchorRect: DOMRect;
  onClose: () => void;
}

export function LocalFilterPopover({ localFilters, onChangeFilters, anchorRect, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [searchTexts, setSearchTexts] = useState<Record<string, string>>({});

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // Position: below the anchor button, left-aligned
  const top = anchorRect.bottom + 6;
  const left = anchorRect.left;

  const isActive = (key: string) => (localFilters[key]?.length ?? 0) > 0;

  const handleCheckboxClick = (key: string) => {
    if (isActive(key)) {
      // Clear the dimension
      const next = { ...localFilters };
      delete next[key];
      onChangeFilters(next);
      if (expandedKey === key) setExpandedKey(null);
    } else {
      // Expand for selection
      setExpandedKey(prev => (prev === key ? null : key));
    }
  };

  const handleToggleValue = (key: string, value: string) => {
    const current = localFilters[key] || [];
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    if (next.length === 0) {
      const nextFilters = { ...localFilters };
      delete nextFilters[key];
      onChangeFilters(nextFilters);
    } else {
      onChangeFilters({ ...localFilters, [key]: next });
    }
  };

  const handleRemoveValue = (key: string, value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    handleToggleValue(key, value);
  };

  const handleClearAll = () => {
    onChangeFilters({});
    setExpandedKey(null);
  };

  const totalActive = Object.values(localFilters).filter(v => v.length > 0).length;

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top,
        left,
        zIndex: 9999,
        width: 460,
        maxHeight: 520,
        overflowY: 'auto',
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
        border: '1px solid #e8e8e8',
        fontFamily: F,
      }}
    >
      {/* Info banner */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 8,
        padding: '10px 16px', background: '#e6f4ff',
        borderBottom: '1px solid #bae0ff', borderRadius: '8px 8px 0 0',
      }}>
        <Info size={14} color="#1890ff" style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 12, color: '#1677ff', lineHeight: 1.6 }}>
          局部筛选仅对当前 Sheet 生效；与全局筛选相同维度冲突时，以局部筛选为准
        </span>
      </div>

      {/* Filter groups */}
      <div style={{ padding: '12px 16px 16px' }}>
        {FILTER_GROUPS.map((group, gi) => (
          <div key={group.group} style={{ marginBottom: gi < FILTER_GROUPS.length - 1 ? 16 : 0 }}>
            <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>{group.group}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {group.items.map(item => {
                const active = isActive(item.key);
                const expanded = expandedKey === item.key;
                const selectedValues = localFilters[item.key] || [];
                const chipData = FILTER_CHIP_DATA[item.key];
                const search = searchTexts[item.key] || '';
                const filteredOptions = chipData
                  ? chipData.options.filter(o => o.toLowerCase().includes(search.toLowerCase()))
                  : [];

                return (
                  <div key={item.key}>
                    {/* Row */}
                    <div
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '5px 6px', borderRadius: 4, cursor: 'pointer',
                        background: active ? '#f0f7ff' : 'transparent',
                        border: `1px solid ${active ? '#bae0ff' : 'transparent'}`,
                        transition: 'all 0.15s',
                      }}
                      onClick={() => handleCheckboxClick(item.key)}
                    >
                      {/* Checkbox */}
                      <div style={{
                        width: 16, height: 16, borderRadius: 3, flexShrink: 0,
                        border: `1.5px solid ${active ? '#1890ff' : '#d9d9d9'}`,
                        background: active ? '#1890ff' : '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}>
                        {active && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>

                      {/* Label */}
                      <span style={{ fontSize: 13, color: active ? '#1890ff' : '#333', flex: 1 }}>
                        {item.label}
                      </span>

                      {/* Selected value chips */}
                      {active && selectedValues.length > 0 && (
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', flex: 2 }} onClick={e => e.stopPropagation()}>
                          {selectedValues.map(v => (
                            <span
                              key={v}
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: 3,
                                padding: '1px 6px', background: '#e6f7ff',
                                border: '1px solid #bae0ff', borderRadius: 3,
                                fontSize: 12, color: '#1890ff', whiteSpace: 'nowrap',
                              }}
                            >
                              {v}
                              <X size={10} style={{ cursor: 'pointer', flexShrink: 0 }}
                                onClick={e => handleRemoveValue(item.key, v, e)} />
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Expand toggle */}
                      {chipData && (
                        <div
                          onClick={e => { e.stopPropagation(); setExpandedKey(prev => prev === item.key ? null : item.key); }}
                          style={{ color: '#bbb', flexShrink: 0, lineHeight: 0 }}
                        >
                          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </div>
                      )}
                    </div>

                    {/* Expanded value picker */}
                    {expanded && chipData && (
                      <div style={{
                        margin: '4px 0 4px 24px',
                        border: '1px solid #e8e8e8', borderRadius: 6,
                        background: '#fafafa', overflow: 'hidden',
                      }}
                        onClick={e => e.stopPropagation()}
                      >
                        {/* Search */}
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '6px 10px', borderBottom: '1px solid #f0f0f0',
                          background: '#fff',
                        }}>
                          <Search size={12} color="#bbb" />
                          <input
                            autoFocus
                            placeholder={`搜索${item.label}…`}
                            value={search}
                            onChange={e => setSearchTexts(prev => ({ ...prev, [item.key]: e.target.value }))}
                            style={{
                              flex: 1, border: 'none', outline: 'none', fontSize: 12,
                              background: 'transparent', color: '#333',
                            }}
                          />
                          {search && (
                            <X size={11} color="#bbb" style={{ cursor: 'pointer' }}
                              onClick={() => setSearchTexts(prev => ({ ...prev, [item.key]: '' }))} />
                          )}
                        </div>

                        {/* Options */}
                        <div style={{ maxHeight: 160, overflowY: 'auto' }}>
                          {filteredOptions.length === 0 ? (
                            <div style={{ padding: '10px 12px', fontSize: 12, color: '#bbb', textAlign: 'center' }}>
                              无匹配结果
                            </div>
                          ) : (
                            filteredOptions.map(opt => {
                              const checked = selectedValues.includes(opt);
                              return (
                                <div
                                  key={opt}
                                  onClick={() => handleToggleValue(item.key, opt)}
                                  style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '7px 12px', cursor: 'pointer', fontSize: 13,
                                    background: checked ? '#f0f7ff' : 'transparent',
                                    transition: 'background 0.1s',
                                  }}
                                  onMouseEnter={e => { if (!checked) (e.currentTarget as HTMLDivElement).style.background = '#f5f5f5'; }}
                                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = checked ? '#f0f7ff' : 'transparent'; }}
                                >
                                  <div style={{
                                    width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                                    border: `1.5px solid ${checked ? '#1890ff' : '#d9d9d9'}`,
                                    background: checked ? '#1890ff' : '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  }}>
                                    {checked && (
                                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                        <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    )}
                                  </div>
                                  <span style={{ color: checked ? '#1890ff' : '#333' }}>{opt}</span>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {totalActive > 0 && (
        <div style={{
          padding: '10px 16px', borderTop: '1px solid #f0f0f0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 12, color: '#999' }}>已设置 {totalActive} 个维度条件</span>
          <span
            onClick={handleClearAll}
            style={{ fontSize: 12, color: '#ff4d4f', cursor: 'pointer' }}
          >
            清空全部
          </span>
        </div>
      )}
    </div>
  );
}
