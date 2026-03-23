import React, { useState } from 'react';
import { ArrowUpDown, Inbox } from 'lucide-react';
import type { FilterCombination } from './MetricFilterPopover';

const F = "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif";

type Row = {
  id: string;
  date: string; media: string; optimizer: string; game: string;
  channel: string; os: string; region: string; adtype: string;
  spend: number; newDevices: number; newDeviceCost: number;
  newPaidUsers: number; newPaidCost: number;
  ltv1: number; ltv3: number; ltv7: number; ltv15: number; ltv30: number; ltv60: number;
  roi1: number; roi2: number; roi3: number; roi7: number; roi15: number; roi30: number; roi60: number;
};

const DATA: Row[] = [
  { id: '1', date: '2026-02-01', media: '腾讯', optimizer: '张磊',  game: '鱼乐', channel: '品牌', os: 'Android', region: '华东', adtype: '图文',   spend: 52341, newDevices: 8234, newDeviceCost: 6.35, newPaidUsers: 412, newPaidCost: 127.0, ltv1: 0.12, ltv3: 0.35, ltv7: 0.89, ltv15: 1.24, ltv30: 1.56, ltv60: 2.14, roi1: 0.08, roi2: 0.14, roi3: 0.22, roi7: 0.62, roi15: 0.86, roi30: 1.09, roi60: 1.49 },
  { id: '2', date: '2026-02-01', media: '字节', optimizer: '李明',  game: '大咖', channel: '效果', os: 'iOS',     region: '华南', adtype: '视频',   spend: 38920, newDevices: 6120, newDeviceCost: 6.36, newPaidUsers: 310, newPaidCost: 125.5, ltv1: 0.11, ltv3: 0.32, ltv7: 0.84, ltv15: 1.18, ltv30: 1.51, ltv60: 2.08, roi1: 0.07, roi2: 0.13, roi3: 0.21, roi7: 0.60, roi15: 0.83, roi30: 1.06, roi60: 1.43 },
  { id: '3', date: '2026-02-01', media: '腾讯', optimizer: '王芳',  game: '鱼乐', channel: '品牌', os: 'Android', region: '华北', adtype: '图文',   spend: 29150, newDevices: 4580, newDeviceCost: 6.36, newPaidUsers: 228, newPaidCost: 127.9, ltv1: 0.13, ltv3: 0.37, ltv7: 0.91, ltv15: 1.28, ltv30: 1.59, ltv60: 2.19, roi1: 0.09, roi2: 0.15, roi3: 0.23, roi7: 0.63, roi15: 0.88, roi30: 1.11, roi60: 1.52 },
  { id: '4', date: '2026-02-01', media: '字节', optimizer: '陈刚',  game: '大咖', channel: '效果', os: 'iOS',     region: '西南', adtype: '开屏',   spend: 45670, newDevices: 7230, newDeviceCost: 6.32, newPaidUsers: 368, newPaidCost: 124.1, ltv1: 0.10, ltv3: 0.30, ltv7: 0.82, ltv15: 1.15, ltv30: 1.48, ltv60: 2.03, roi1: 0.07, roi2: 0.12, roi3: 0.20, roi7: 0.58, roi15: 0.81, roi30: 1.04, roi60: 1.40 },
  { id: '5', date: '2026-02-02', media: '腾讯', optimizer: '张磊',  game: '鱼乐', channel: '品牌', os: 'Android', region: '华东', adtype: '视频',   spend: 48920, newDevices: 7840, newDeviceCost: 6.24, newPaidUsers: 398, newPaidCost: 122.9, ltv1: 0.14, ltv3: 0.38, ltv7: 0.93, ltv15: 1.30, ltv30: 1.62, ltv60: 2.22, roi1: 0.09, roi2: 0.16, roi3: 0.24, roi7: 0.65, roi15: 0.90, roi30: 1.13, roi60: 1.54 },
  { id: '6', date: '2026-02-02', media: '字节', optimizer: '李明',  game: '大咖', channel: '效果', os: 'iOS',     region: '华南', adtype: '信息流', spend: 35680, newDevices: 5620, newDeviceCost: 6.35, newPaidUsers: 283, newPaidCost: 126.1, ltv1: 0.11, ltv3: 0.33, ltv7: 0.86, ltv15: 1.20, ltv30: 1.53, ltv60: 2.10, roi1: 0.08, roi2: 0.13, roi3: 0.21, roi7: 0.61, roi15: 0.84, roi30: 1.07, roi60: 1.44 },
  { id: '7', date: '2026-02-02', media: '腾讯', optimizer: '王芳',  game: '鱼乐', channel: '品牌', os: 'Android', region: '华北', adtype: '图文',   spend: 31240, newDevices: 4920, newDeviceCost: 6.35, newPaidUsers: 247, newPaidCost: 126.5, ltv1: 0.12, ltv3: 0.36, ltv7: 0.90, ltv15: 1.26, ltv30: 1.57, ltv60: 2.16, roi1: 0.08, roi2: 0.14, roi3: 0.22, roi7: 0.62, roi15: 0.87, roi30: 1.10, roi60: 1.50 },
  { id: '8', date: '2026-02-02', media: '字节', optimizer: '陈刚',  game: '大咖', channel: '效果', os: 'iOS',     region: '西南', adtype: '开屏',   spend: 42310, newDevices: 6680, newDeviceCost: 6.33, newPaidUsers: 340, newPaidCost: 124.4, ltv1: 0.10, ltv3: 0.31, ltv7: 0.83, ltv15: 1.16, ltv30: 1.49, ltv60: 2.05, roi1: 0.07, roi2: 0.12, roi3: 0.20, roi7: 0.59, roi15: 0.82, roi30: 1.05, roi60: 1.41 },
];

const DIM_COL_MAP: Record<string, { rowKey: keyof Row; label: string; width: number }> = {
  time:      { rowKey: 'date',      label: '时间',     width: 104 },
  media:     { rowKey: 'media',     label: '媒体',     width: 80  },
  optimizer: { rowKey: 'optimizer', label: '优化师',   width: 80  },
  game:      { rowKey: 'game',      label: '游戏',     width: 80  },
  channel:   { rowKey: 'channel',   label: '主渠道',   width: 80  },
  os:        { rowKey: 'os',        label: '系统',     width: 70  },
  region:    { rowKey: 'region',    label: '地区',     width: 70  },
  adtype:    { rowKey: 'adtype',    label: '广告类型', width: 90  },
};

type MetricCol = { key: keyof Row; label: string; width: number; tooltip: string; decimals?: number };

const METRIC_COLS: MetricCol[] = [
  { key: 'spend',         label: '消耗',         width: 90,  tooltip: '广告实际消费金额（元）' },
  { key: 'newDevices',    label: '新增设备',     width: 90,  tooltip: '新增激活设备数' },
  { key: 'newDeviceCost', label: '新增成本',     width: 90,  tooltip: '新增设备平均成本', decimals: 2 },
  { key: 'newPaidUsers',  label: '新增付费用户', width: 110, tooltip: '首次付费用户数' },
  { key: 'newPaidCost',   label: '新增付费成本', width: 110, tooltip: '新增付费用户平均成本', decimals: 1 },
  { key: 'ltv1',  label: 'LTV_1',  width: 80, tooltip: '第1日LTV',  decimals: 2 },
  { key: 'ltv3',  label: 'LTV_3',  width: 80, tooltip: '第3日LTV',  decimals: 2 },
  { key: 'ltv7',  label: 'LTV_7',  width: 80, tooltip: '第7日LTV',  decimals: 2 },
  { key: 'ltv15', label: 'LTV_15', width: 80, tooltip: '第15日LTV', decimals: 2 },
  { key: 'ltv30', label: 'LTV_30', width: 80, tooltip: '第30日LTV', decimals: 2 },
  { key: 'ltv60', label: 'LTV_60', width: 80, tooltip: '第60日LTV', decimals: 2 },
  { key: 'roi1',  label: 'ROI_1',  width: 80, tooltip: '第1日ROI',  decimals: 2 },
  { key: 'roi2',  label: 'ROI_2',  width: 80, tooltip: '第2日ROI',  decimals: 2 },
  { key: 'roi3',  label: 'ROI_3',  width: 80, tooltip: '第3日ROI',  decimals: 2 },
  { key: 'roi7',  label: 'ROI_7',  width: 80, tooltip: '第7日ROI',  decimals: 2 },
  { key: 'roi15', label: 'ROI_15', width: 80, tooltip: '第15日ROI', decimals: 2 },
  { key: 'roi30', label: 'ROI_30', width: 80, tooltip: '第30日ROI', decimals: 2 },
  { key: 'roi60', label: 'ROI_60', width: 80, tooltip: '第60日ROI', decimals: 2 },
];

// Average metrics (use mean instead of sum for 总计)
const AVG_KEYS = new Set<keyof Row>([
  'ltv1','ltv3','ltv7','ltv15','ltv30','ltv60',
  'roi1','roi2','roi3','roi7','roi15','roi30','roi60',
  'newDeviceCost','newPaidCost',
]);

const fmt = (n: number, decimals = 0) =>
  n.toLocaleString('zh-CN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

// ── Filter evaluation ──────────────────────────────────────────
function evalRow(row: Row, combo: FilterCombination): boolean {
  if (!combo.groups.length) return true;
  // Groups are OR; conditions within a group are AND
  return combo.groups.some(group => {
    if (!group.conditions.length) return true;
    return group.conditions.every(cond => {
      const val = row[cond.metricKey as keyof Row] as number;
      if (typeof val !== 'number') return true;
      switch (cond.operator) {
        case '>':       return val >  cond.value;
        case '<':       return val <  cond.value;
        case '>=':      return val >= cond.value;
        case '<=':      return val <= cond.value;
        case '=':       return val === cond.value;
        case 'between': return val >= cond.value && val <= cond.value2;
        default:        return true;
      }
    });
  });
}

// ── Merge-view helpers ────────────────────────────────────────
type SpanCell = { rowspan: number; render: boolean };

function computeMergeSpans(rows: Row[], dimKeys: (keyof Row)[]): SpanCell[][] {
  const n = rows.length;
  const m = dimKeys.length;
  if (n === 0 || m === 0) return [];

  // groupStarts[r][j] = true when row r begins a new visual group for col j
  const groupStarts: boolean[][] = rows.map(() => new Array(m).fill(false));
  for (let j = 0; j < m; j++) groupStarts[0][j] = true;
  for (let r = 1; r < n; r++) {
    for (let j = 0; j < m; j++) {
      groupStarts[r][j] =
        rows[r][dimKeys[j]] !== rows[r - 1][dimKeys[j]] ||
        (j > 0 && groupStarts[r][j - 1]);
    }
  }

  const result: SpanCell[][] = rows.map(() => new Array(m).fill(null));
  for (let j = 0; j < m; j++) {
    for (let r = 0; r < n; r++) {
      if (!groupStarts[r][j]) {
        result[r][j] = { rowspan: 0, render: false };
      } else {
        let end = r + 1;
        while (end < n && !groupStarts[end][j]) end++;
        result[r][j] = { rowspan: end - r, render: true };
      }
    }
  }
  return result;
}

interface Props {
  activeDims: string[];
  hasData: boolean;
  activeFilter?: FilterCombination | null;
  mergeView?: boolean;
}

export function DataTable({ activeDims, hasData, activeFilter, mergeView }: Props) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  // Apply metric filter
  const rows: Row[] = !hasData
    ? []
    : activeFilter
      ? DATA.filter(row => evalRow(row, activeFilter))
      : DATA;

  // Build dim columns (ordered by activeDims)
  type DimCol = { dimKey: string; rowKey: keyof Row; label: string; width: number };
  const DIM_COLS: DimCol[] = activeDims
    .filter(k => !!DIM_COL_MAP[k])
    .map(k => ({ dimKey: k, ...DIM_COL_MAP[k] }));

  const DIM_LEFT: number[] = DIM_COLS.map((_, i) =>
    DIM_COLS.slice(0, i).reduce((s, c) => s + c.width, 0)
  );
  const LAST_DIM = DIM_COLS.length - 1;

  // In merge view: sort rows by active dims then compute rowspans
  const displayRows = mergeView
    ? [...rows].sort((a, b) => {
        for (const col of DIM_COLS) {
          const av = String(a[col.rowKey]);
          const bv = String(b[col.rowKey]);
          if (av < bv) return -1;
          if (av > bv) return 1;
        }
        return 0;
      })
    : rows;

  const spanInfo = mergeView
    ? computeMergeSpans(displayRows, DIM_COLS.map(c => c.rowKey))
    : null;

  const bdB = '1px solid #dee0e3';
  const bdR = '1px solid #dee0e3';
  const bdDR = '1px solid #c9cdd4';

  // Empty: no dims selected or no data
  if (!hasData || activeDims.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: F, color: '#bbb', gap: 12 }}>
        <Inbox size={48} color="#e0e0e0" strokeWidth={1} />
        <span style={{ fontSize: 13 }}>
          {activeDims.length === 0 ? '请先在【聚合维度】中选择维度' : '暂无数据'}
        </span>
      </div>
    );
  }

  // Empty: filter eliminated all rows
  if (rows.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: F, color: '#bbb', gap: 12 }}>
        <Inbox size={48} color="#e0e0e0" strokeWidth={1} />
        <span style={{ fontSize: 13 }}>当前指标筛选条件下无匹配数据</span>
        <span style={{ fontSize: 12, color: '#d9d9d9' }}>请调整筛选条件后重试</span>
      </div>
    );
  }

  const totalDimW   = DIM_COLS.reduce((s, c) => s + c.width, 0);
  const totalMetricW = METRIC_COLS.reduce((s, c) => s + c.width, 0);

  const dimThStyle = (i: number): React.CSSProperties => ({
    position: 'sticky', top: 0, left: DIM_LEFT[i], zIndex: 30,
    background: '#f5f6f7',
    borderBottom: '1px solid #c9cdd4',
    borderRight: i === LAST_DIM ? '2px solid #c9cdd4' : bdDR,
    boxShadow: i === LAST_DIM ? '3px 0 6px -2px rgba(31,35,41,0.08)' : 'none',
    padding: '8px 10px', fontSize: 13, color: '#1f2329', fontWeight: 500,
    textAlign: 'center', whiteSpace: 'nowrap',
    minWidth: DIM_COLS[i].width, width: DIM_COLS[i].width,
  });

  const dimTdStyle = (i: number, bg: string): React.CSSProperties => ({
    position: 'sticky', left: DIM_LEFT[i], zIndex: 10,
    background: bg,
    borderBottom: bdB,
    borderRight: i === LAST_DIM ? '2px solid #c9cdd4' : bdR,
    boxShadow: i === LAST_DIM ? '3px 0 6px -2px rgba(31,35,41,0.06)' : 'none',
    padding: '7px 10px', fontSize: 13, color: '#1f2329',
    textAlign: 'center', whiteSpace: 'nowrap',
    minWidth: DIM_COLS[i].width, width: DIM_COLS[i].width,
  });

  // Summary row helpers
  const mean = (key: keyof Row) =>
    rows.reduce((s, r) => s + (r[key] as number), 0) / rows.length;
  const sum  = (key: keyof Row) =>
    rows.reduce((s, r) => s + (r[key] as number), 0);

  return (
    <div style={{ flex: 1, overflow: 'hidden', fontFamily: F, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        <table style={{
          borderCollapse: 'separate', borderSpacing: 0,
          tableLayout: 'fixed',
          minWidth: totalDimW + totalMetricW,
        }}>
          <colgroup>
            {DIM_COLS.map(c   => <col key={c.dimKey}     style={{ width: c.width,   minWidth: c.width   }} />)}
            {METRIC_COLS.map(c => <col key={String(c.key)} style={{ width: c.width, minWidth: c.width }} />)}
          </colgroup>

          <thead>
            <tr>
              {DIM_COLS.map((col, i) => (
                <th key={col.dimKey} style={dimThStyle(i)}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                    {col.label}
                    <ArrowUpDown size={11} color="#aaa" style={{ cursor: 'pointer', flexShrink: 0 }} />
                  </div>
                </th>
              ))}
              {METRIC_COLS.map(col => (
                <th
                  key={String(col.key)}
                  style={{
                    position: 'sticky', top: 0, zIndex: 20,
                    background: '#f5f6f7',
                    borderBottom: '1px solid #c9cdd4', borderRight: bdR,
                    padding: '8px 10px', fontSize: 12, color: '#1f2329', fontWeight: 500,
                    textAlign: 'right', whiteSpace: 'nowrap', cursor: 'pointer',
                    minWidth: col.width, width: col.width,
                  }}
                  onMouseEnter={e => {
                    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    setTooltip({ text: col.tooltip, x: r.left + r.width / 2, y: r.bottom + 4 });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3 }}>
                    {col.label} <ArrowUpDown size={11} color="#aaa" style={{ flexShrink: 0 }} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {displayRows.map((row, rowIdx) => {
              const bg = hoveredRow === row.id ? '#f0f4ff' : '#fff';
              return (
                <tr
                  key={row.id}
                  onMouseEnter={() => setHoveredRow(row.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {DIM_COLS.map((col, i) => {
                    if (spanInfo) {
                      const si = spanInfo[rowIdx][i];
                      if (!si.render) return null;
                      return (
                        <td
                          key={col.dimKey}
                          rowSpan={si.rowspan}
                          style={{
                            ...dimTdStyle(i, '#fff'),
                            verticalAlign: 'middle',
                            background: si.rowspan > 1 ? '#fafafa' : '#fff',
                          }}
                        >
                          {String(row[col.rowKey])}
                        </td>
                      );
                    }
                    return (
                      <td key={col.dimKey} style={dimTdStyle(i, bg)}>
                        {String(row[col.rowKey])}
                      </td>
                    );
                  })}
                  {METRIC_COLS.map(col => (
                    <td key={String(col.key)} style={{
                      borderBottom: bdB, borderRight: bdR,
                      padding: '7px 10px', fontSize: 12, color: '#1f2329',
                      textAlign: 'right', whiteSpace: 'nowrap',
                      background: bg,
                    }}>
                      {fmt(row[col.key] as number, col.decimals ?? 0)}
                    </td>
                  ))}
                </tr>
              );
            })}

            {/* Average row */}
            <SummaryRow
              label="平均值"
              DIM_COLS={DIM_COLS} DIM_LEFT={DIM_LEFT} LAST_DIM={LAST_DIM}
              bg="#f5f6f7" fontWeight={400} color="#646a73"
              getValue={col => mean(col.key)}
              decimals={col => col.decimals ?? 0}
            />

            {/* Total row */}
            <SummaryRow
              label="总计"
              DIM_COLS={DIM_COLS} DIM_LEFT={DIM_LEFT} LAST_DIM={LAST_DIM}
              bg="#eef2ff" fontWeight={600} color="#3370ff"
              getValue={col => AVG_KEYS.has(col.key) ? mean(col.key) : sum(col.key)}
              decimals={col => col.decimals ?? 0}
            />
          </tbody>
        </table>
      </div>

      {tooltip && (
        <div style={{
          position: 'fixed', left: tooltip.x, top: tooltip.y,
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.75)', color: '#fff',
          fontSize: 11, padding: '4px 8px', borderRadius: 4,
          zIndex: 9999, whiteSpace: 'nowrap', pointerEvents: 'none',
        }}>
          {tooltip.text}
        </div>
      )}
    </div>
  );
}

// ── Summary row ──────────────────────────────────────────────
type DimCol = { dimKey: string; rowKey: keyof Row; label: string; width: number };

function SummaryRow({ label, DIM_COLS, DIM_LEFT, LAST_DIM, bg, fontWeight, color, getValue, decimals }: {
  label: string;
  DIM_COLS: DimCol[];
  DIM_LEFT: number[];
  LAST_DIM: number;
  bg: string;
  fontWeight: number;
  color: string;
  getValue: (col: MetricCol) => number;
  decimals: (col: MetricCol) => number;
}) {
  return (
    <tr>
      {DIM_COLS.map((col, i) => (
        <td key={col.dimKey} style={{
          position: 'sticky', left: DIM_LEFT[i], zIndex: 10,
          background: bg,
          borderBottom: '1px solid #e8e8e8',
          borderRight: i === LAST_DIM ? '2px solid #badcff' : '1px solid #e8e8e8',
          boxShadow: i === LAST_DIM ? '3px 0 6px -2px rgba(0,0,0,0.08)' : 'none',
          padding: '7px 10px', fontSize: 12, fontWeight, color,
          textAlign: 'center', whiteSpace: 'nowrap',
          minWidth: col.width, width: col.width,
        }}>
          {i === 0 ? label : ''}
        </td>
      ))}
      {METRIC_COLS.map(col => (
        <td key={String(col.key)} style={{
          borderBottom: '1px solid #e8e8e8', borderRight: '1px solid #e8e8e8',
          background: bg,
          padding: '7px 10px', fontSize: 12, fontWeight, color,
          textAlign: 'right', whiteSpace: 'nowrap',
        }}>
          {fmt(getValue(col), decimals(col))}
        </td>
      ))}
    </tr>
  );
}