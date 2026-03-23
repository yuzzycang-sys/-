import React from 'react';
import { Bell, HelpCircle, ChevronDown } from 'lucide-react';

const F = "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif";

const NAV_ITEMS = [
  '首页', '数据报表', '素材管理', '资产管理', '工具',
  '智能实验室', '直播运营', '管理中心', '新项目',
];

// Feishu design tokens
const PRIMARY   = '#3370ff';
const TEXT_PRI  = '#1f2329';
const TEXT_SEC  = '#646a73';
const BORDER    = '#dee0e3';

export function TopNav() {
  return (
    <div
      style={{
        height: 48, fontFamily: F, flexShrink: 0,
        background: '#fff', borderBottom: `1px solid ${BORDER}`,
        display: 'flex', alignItems: 'center', padding: '0 16px',
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginRight: 24, flexShrink: 0 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 6,
          background: PRIMARY,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, color: '#fff', fontWeight: 700,
        }}>
          鲸
        </div>
        <span style={{ color: TEXT_PRI, fontWeight: 600, fontSize: 14 }}>鲸鱼座</span>
      </div>

      {/* Nav Items */}
      <div style={{ display: 'flex', alignItems: 'stretch', flex: 1, height: 48, overflow: 'hidden' }}>
        {NAV_ITEMS.map(item => {
          const active = item === '数据报表';
          return (
            <NavItem key={item} label={item} active={active} />
          );
        })}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <IconBtn><HelpCircle size={16} color={TEXT_SEC} /></IconBtn>
        <IconBtn><Bell      size={16} color={TEXT_SEC} /></IconBtn>

        <div style={{ width: 1, height: 16, background: BORDER, margin: '0 4px' }} />

        <span style={{
          border: `1px solid ${PRIMARY}`, color: PRIMARY, fontSize: 12,
          padding: '1px 7px', borderRadius: 4,
        }}>
          正式环境
        </span>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 8px', borderRadius: 6, cursor: 'pointer',
        }}
          onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#f5f6f7'}
          onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
        >
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            background: '#e8e2f5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, color: '#7c5cbf', fontWeight: 700, flexShrink: 0,
          }}>
            童
          </div>
          <span style={{ fontSize: 13, color: TEXT_PRI }}>童惠娟</span>
          <ChevronDown size={12} color={TEXT_SEC} />
        </div>
      </div>
    </div>
  );
}

function NavItem({ label, active }: { label: string; active: boolean }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', display: 'flex', alignItems: 'center',
        padding: '0 12px', cursor: 'pointer', fontSize: 13,
        color: active ? PRIMARY : hovered ? TEXT_PRI : TEXT_SEC,
        fontWeight: active ? 500 : 400,
        whiteSpace: 'nowrap', userSelect: 'none',
        transition: 'color 0.15s',
      }}
    >
      {label}
      {active && (
        <div style={{
          position: 'absolute', bottom: 0, left: 12, right: 12,
          height: 2, background: PRIMARY, borderRadius: '2px 2px 0 0',
        }} />
      )}
    </div>
  );
}

function IconBtn({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 30, height: 30, borderRadius: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        background: hovered ? '#f5f6f7' : 'transparent',
        transition: 'background 0.12s',
      }}
    >
      {children}
    </div>
  );
}