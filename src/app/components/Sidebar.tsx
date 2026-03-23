import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const F = "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif";

// Feishu design tokens
const PRIMARY    = '#3370ff';
const SIDEBAR_BG = '#ffffff';
const TEXT_PRI   = '#1f2329';
const TEXT_SEC   = '#646a73';
const TEXT_TER   = '#8f959e';
const ACTIVE_BG  = '#e8f0ff';
const HOVER_BG   = '#ebebeb';

export function Sidebar() {
  const [expandedPlatform, setExpandedPlatform] = useState<string>('快手');
  const [expandedSubmenu,  setExpandedSubmenu]  = useState<string>('广告分析');
  const [activeSideItem,   setActiveSideItem]   = useState<string>('头条');

  return (
    <div style={{
      width: 128, background: SIDEBAR_BG, fontFamily: F,
      flexShrink: 0, overflowY: 'auto',
      borderRight: '1px solid #dee0e3',
    }}>

      {/* 快手 */}
      <PlatformRow
        name="快手"
        expanded={expandedPlatform === '快手'}
        onToggle={() => setExpandedPlatform(p => p === '快手' ? '' : '快手')}
      />
      {expandedPlatform === '快手' && (
        <div>
          <SubmenuRow
            name="广告分析"
            expanded={expandedSubmenu === '广告分析'}
            onToggle={() => setExpandedSubmenu(s => s === '广告分析' ? '' : '广告分析')}
          />
          {expandedSubmenu === '广告分析' && (
            <div>
              {['腾讯', '头条', '快手'].map(item => (
                <LeafItem
                  key={item}
                  name={item}
                  active={activeSideItem === item}
                  onClick={() => setActiveSideItem(item)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <PlatformRow
        name="腾讯"
        expanded={expandedPlatform === '腾讯'}
        onToggle={() => setExpandedPlatform(p => p === '腾讯' ? '' : '腾讯')}
      />

      <PlatformRow
        name="头条"
        expanded={expandedPlatform === '头条'}
        onToggle={() => setExpandedPlatform(p => p === '头条' ? '' : '头条')}
      />
    </div>
  );
}

function PlatformRow({ name, expanded, onToggle }: {
  name: string; expanded: boolean; onToggle: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        margin: '2px 6px', padding: '6px 8px', borderRadius: 6,
        cursor: 'pointer', fontSize: 13,
        color: expanded ? TEXT_PRI : TEXT_SEC,
        background: hovered ? HOVER_BG : 'transparent',
        fontWeight: expanded ? 500 : 400,
        transition: 'background 0.1s',
      }}
    >
      <span>{name}</span>
      {expanded
        ? <ChevronDown  size={12} color={TEXT_TER} />
        : <ChevronRight size={12} color={TEXT_TER} />}
    </div>
  );
}

function SubmenuRow({ name, expanded, onToggle }: {
  name: string; expanded: boolean; onToggle: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        margin: '1px 6px', padding: '5px 8px 5px 18px', borderRadius: 6,
        cursor: 'pointer', fontSize: 12,
        color: expanded ? TEXT_SEC : TEXT_TER,
        background: hovered ? HOVER_BG : 'transparent',
        transition: 'background 0.1s',
      }}
    >
      <span>{name}</span>
      {expanded
        ? <ChevronDown  size={11} color={TEXT_TER} />
        : <ChevronRight size={11} color={TEXT_TER} />}
    </div>
  );
}

function LeafItem({ name, active, onClick }: {
  name: string; active: boolean; onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        margin: '1px 6px', padding: '5px 8px 5px 28px', borderRadius: 6,
        fontSize: 12,
        color: active ? PRIMARY : hovered ? TEXT_PRI : TEXT_SEC,
        background: active ? ACTIVE_BG : hovered ? HOVER_BG : 'transparent',
        cursor: 'pointer',
        fontWeight: active ? 500 : 400,
        transition: 'background 0.1s, color 0.1s',
      }}
    >
      {name}
    </div>
  );
}