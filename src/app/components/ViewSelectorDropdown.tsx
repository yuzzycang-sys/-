import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Search, Pin, Check, Share2 } from 'lucide-react';

const F = "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif";

export type ViewItem = {
  id: string;
  name: string;
  type: 'mine' | 'shared' | 'public';
  owner?: string;
  pinned: boolean;
  shareMode?: 'private' | 'specific' | 'public';
  sharedWith?: string[];
};

type Tab = 'all' | 'mine' | 'pinned' | 'shared';

interface Props {
  views: ViewItem[];
  selectedView: string | null;
  onSelect: (name: string) => void;
  onTogglePin: (id: string) => void;
  onShareView: (id: string) => void;
  onClose: () => void;
  fixedLeft: number;
  fixedTop: number;
}

const MAX_PINS = 10;

export function ViewSelectorDropdown({ views, selectedView, onSelect, onTogglePin, onShareView, onClose, fixedLeft, fixedTop }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [searchText, setSearchText] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const pinnedCount = views.filter(v => v.pinned).length;

  const filtered = views.filter(v => {
    const matchSearch = v.name.includes(searchText);
    if (!matchSearch) return false;
    if (activeTab === 'mine') return v.type === 'mine';
    if (activeTab === 'pinned') return v.pinned;
    if (activeTab === 'shared') return v.type === 'shared';
    return true;
  });

  const tabs: { key: Tab; label: string }[] = [
    { key: 'all', label: '所有' },
    { key: 'mine', label: '我的' },
    { key: 'pinned', label: '置顶' },
    { key: 'shared', label: '共享' },
  ];

  const content = (
    <div
      ref={ref}
      style={{
        position: 'fixed', top: fixedTop, left: fixedLeft, zIndex: 99999,
        width: 350, background: '#fff', borderRadius: 8,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        fontFamily: F,
      }}
    >
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e8e8e8' }}>
        {tabs.map(t => (
          <div
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              flex: 1, textAlign: 'center', padding: '9px 0',
              fontSize: 13, cursor: 'pointer',
              color: activeTab === t.key ? '#1890ff' : '#666',
              borderBottom: activeTab === t.key ? '2px solid #1890ff' : '2px solid transparent',
              fontWeight: activeTab === t.key ? 500 : 400,
            }}
          >
            {t.label}
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ padding: '8px 12px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: '#f5f5f5', borderRadius: 4, padding: '5px 8px',
        }}>
          <Search size={13} color="#aaa" />
          <input
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="搜索视图名称"
            style={{
              border: 'none', background: 'transparent', outline: 'none',
              fontSize: 12, color: '#333', flex: 1,
            }}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ maxHeight: 260, overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 13, color: '#aaa' }}>
            暂无视图
          </div>
        ) : (
          filtered.map(v => {
            const isSelected = v.name === selectedView;
            const pinLimitReached = pinnedCount >= MAX_PINS && !v.pinned;
            return (
              <ViewRow
                key={v.id}
                view={v}
                isSelected={isSelected}
                pinLimitReached={pinLimitReached}
                onSelect={() => { onSelect(v.name); onClose(); }}
                onTogglePin={() => onTogglePin(v.id)}
                onShareView={() => onShareView(v.id)}
              />
            );
          })
        )}
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid #e8e8e8', padding: '6px 12px',
        textAlign: 'right', fontSize: 12, color: '#aaa',
      }}>
        已置顶 {pinnedCount}/{MAX_PINS}
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}

function ViewRow({ view, isSelected, pinLimitReached, onSelect, onTogglePin, onShareView }: {
  view: ViewItem;
  isSelected: boolean;
  pinLimitReached: boolean;
  onSelect: () => void;
  onTogglePin: () => void;
  onShareView: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [showPinTooltip, setShowPinTooltip] = useState(false);

  const ownerLabel = view.type === 'shared' ? view.owner : view.type === 'public' ? '公共' : null;

  // Share indicator: show badge if already shared
  const isShared = view.type === 'mine' && (view.shareMode === 'specific' || view.shareMode === 'public');

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', padding: '8px 12px',
        cursor: 'pointer', fontSize: 13,
        background: isSelected ? '#e6f7ff' : hovered ? '#f8f8f8' : 'transparent',
        color: isSelected ? '#1890ff' : '#333',
      }}
    >
      {/* Check icon */}
      <div style={{ width: 20, marginRight: 4 }}>
        {isSelected && <Check size={14} color="#1890ff" />}
      </div>

      {/* Name */}
      <div style={{ flex: 1 }} onClick={onSelect}>{view.name}</div>

      {/* Owner label */}
      {ownerLabel && (
        <span style={{ fontSize: 11, color: '#aaa', marginRight: 6 }}>{ownerLabel}</span>
      )}

      {/* Share icon — only for 'mine' views, visible on hover or already shared */}
      {view.type === 'mine' && (hovered || isShared) && (
        <div
          onClick={e => { e.stopPropagation(); onShareView(); }}
          title="共享设置"
          style={{
            lineHeight: 0, marginRight: 6, cursor: 'pointer',
            color: isShared ? '#1890ff' : '#bbb',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.color = '#1890ff'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.color = isShared ? '#1890ff' : '#bbb'; }}
        >
          <Share2 size={13} />
        </div>
      )}

      {/* Pin button */}
      <div
        style={{ position: 'relative', lineHeight: 0 }}
        onMouseEnter={() => pinLimitReached && setShowPinTooltip(true)}
        onMouseLeave={() => setShowPinTooltip(false)}
        onClick={e => {
          e.stopPropagation();
          if (!pinLimitReached) onTogglePin();
        }}
      >
        <Pin
          size={13}
          color={view.pinned ? '#1890ff' : pinLimitReached ? '#ccc' : '#aaa'}
          fill={view.pinned ? '#1890ff' : 'none'}
          style={{ cursor: pinLimitReached ? 'not-allowed' : 'pointer' }}
        />
        {showPinTooltip && (
          <div style={{
            position: 'absolute', right: 0, bottom: '120%',
            background: 'rgba(0,0,0,0.75)', color: '#fff',
            fontSize: 11, padding: '4px 8px', borderRadius: 4,
            whiteSpace: 'nowrap', zIndex: 10,
          }}>
            置顶数量已达上限 10
          </div>
        )}
      </div>
    </div>
  );
}