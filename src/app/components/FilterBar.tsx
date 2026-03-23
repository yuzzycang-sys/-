import React, { useState, useRef } from 'react';
import { Filter, Calendar } from 'lucide-react';
import { AllFiltersPopover } from './AllFiltersPopover';
import { DateRangePicker } from './DateRangePicker';
import { MultiSelectChip } from './MultiSelectChip';
import { AccountInputChip } from './AccountInputChip';
import { FILTER_CHIP_DATA } from './filterConfig';

const F = "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif";

interface Props {
  activeFilters: string[];
  onToggleFilter: (key: string) => void;
  dateStart: string;
  dateEnd: string;
  onDateChange: (start: string, end: string) => void;
  filterSelections: Record<string, string[]>;
  onFilterSelect: (key: string, selected: string[]) => void;
  channelLocked?: boolean;
  onChannelLockedClick?: () => void;
}

export function FilterBar({
  activeFilters, onToggleFilter,
  dateStart, dateEnd, onDateChange,
  filterSelections, onFilterSelect,
  channelLocked, onChannelLockedClick,
}: Props) {
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [allFilterPos, setAllFilterPos] = useState<{ left: number; top: number } | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerPos, setDatePickerPos] = useState<{ left: number; top: number } | null>(null);
  const [filterExcludes, setFilterExcludes] = useState<Record<string, boolean>>({});
  // 账号ID/名称 组件的 exclude 状态单独维护
  const [accountExclude, setAccountExclude] = useState(false);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const dateBtnRef = useRef<HTMLButtonElement>(null);

  const handleOpenAllFilters = () => {
    if (!showAllFilters && filterBtnRef.current) {
      const r = filterBtnRef.current.getBoundingClientRect();
      setAllFilterPos({ left: r.left, top: r.bottom + 6 });
    }
    setShowAllFilters(v => !v);
  };

  const handleOpenDatePicker = () => {
    if (!showDatePicker && dateBtnRef.current) {
      const r = dateBtnRef.current.getBoundingClientRect();
      setDatePickerPos({ left: r.left, top: r.bottom + 6 });
    }
    setShowDatePicker(v => !v);
  };

  return (
    <div style={{
      height: 44, display: 'flex', alignItems: 'center',
      borderBottom: 'none', padding: '0 16px',
      background: 'transparent', gap: 0, flexShrink: 0, fontFamily: F,
      overflowX: 'auto', overflowY: 'hidden',
    }}>
      {/* ── 所有筛选 ── */}
      <button
        ref={filterBtnRef}
        onClick={handleOpenAllFilters}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          border: `1px solid ${showAllFilters ? '#3370ff' : '#dee0e3'}`,
          borderRadius: 4, padding: '0 12px', height: 28,
          background: showAllFilters ? '#e8f0ff' : '#fff',
          cursor: 'pointer', fontSize: 13,
          color: showAllFilters ? '#3370ff' : '#1f2329',
          outline: 'none', flexShrink: 0, marginRight: 10,
        }}
      >
        <Filter size={13} color={showAllFilters ? '#3370ff' : '#8f959e'} />
        <span>所有筛选</span>
      </button>

      {/* ── 消耗时间（permanent，无竖线） ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginRight: 10 }}>
        <span style={{ fontSize: 13, color: '#646a73', whiteSpace: 'nowrap' }}>消耗时间</span>
        <button
          ref={dateBtnRef}
          onClick={handleOpenDatePicker}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            border: `1px solid ${showDatePicker ? '#3370ff' : '#dee0e3'}`,
            borderRadius: 4, padding: '0 10px', height: 28,
            background: '#fff', cursor: 'pointer', fontSize: 13,
            color: '#1f2329', outline: 'none', whiteSpace: 'nowrap',
          }}
        >
          <span>{dateStart}</span>
          <span style={{ color: '#bbb' }}>→</span>
          <span>{dateEnd}</span>
          <Calendar size={12} color="#aaa" />
        </button>
      </div>

      {/* ── Active filter chips（有竖分割线） ── */}
      {activeFilters.length > 0 && (
        <>
          <div style={{ width: 1, height: 20, background: '#dee0e3', flexShrink: 0, marginRight: 10 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {activeFilters.map(key => {
              const cfg = FILTER_CHIP_DATA[key];
              if (!cfg) return null;

              const isLocked = !!channelLocked && (key === 'mainChannel' || key === 'subChannel');

              // 账号ID/名称：走专用文本输入组件
              if (key === 'accountId') {
                return (
                  <div key={key} style={{ position: 'relative', opacity: isLocked ? 0.45 : 1 }}>
                    <AccountInputChip
                      selected={filterSelections[key] || []}
                      onChange={sel => onFilterSelect(key, sel)}
                      exclude={accountExclude}
                      onExcludeChange={setAccountExclude}
                    />
                    {isLocked && (
                      <div onClick={e => { e.stopPropagation(); onChannelLockedClick?.(); }}
                        style={{ position: 'absolute', inset: 0, cursor: 'not-allowed', pointerEvents: 'auto' }} />
                    )}
                  </div>
                );
              }

              return (
                <div key={key} style={{ position: 'relative', opacity: isLocked ? 0.45 : 1 }}>
                  <MultiSelectChip
                    label={cfg.label}
                    options={cfg.options}
                    selected={filterSelections[key] || []}
                    onChange={sel => onFilterSelect(key, sel)}
                    exclude={!!filterExcludes[key]}
                    onExcludeChange={ex =>
                      setFilterExcludes(prev => ({ ...prev, [key]: ex }))
                    }
                  />
                  {isLocked && (
                    <div onClick={e => { e.stopPropagation(); onChannelLockedClick?.(); }}
                      style={{ position: 'absolute', inset: 0, cursor: 'not-allowed', pointerEvents: 'auto' }} />
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── Portaled popovers (position: fixed, no clipping) ── */}
      {showAllFilters && allFilterPos && (
        <AllFiltersPopover
          activeFilters={activeFilters}
          onToggleFilter={onToggleFilter}
          onClose={() => setShowAllFilters(false)}
          fixedLeft={allFilterPos.left}
          fixedTop={allFilterPos.top}
        />
      )}

      {showDatePicker && datePickerPos && (
        <DateRangePicker
          startDate={dateStart}
          endDate={dateEnd}
          onChange={onDateChange}
          onClose={() => setShowDatePicker(false)}
          fixedLeft={datePickerPos.left}
          fixedTop={datePickerPos.top}
        />
      )}
    </div>
  );
}