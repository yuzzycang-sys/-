import React, { useState, useRef, useEffect } from 'react';
import { Plus, LayoutGrid } from 'lucide-react';

const F = "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif";

interface Props {
  sheets: string[];
  activeSheet: string;
  onSelectSheet: (name: string) => void;
  onRenameSheet: (oldName: string, newName: string) => void;
  onDeleteSheet: (name: string) => void;
  onCopySheet: (name: string) => void;
  onAddSheet: () => void;
  onReorderSheets: (sheets: string[]) => void;
}

export function SheetTabBar({
  sheets, activeSheet, onSelectSheet,
  onRenameSheet, onDeleteSheet, onCopySheet, onAddSheet, onReorderSheets,
}: Props) {
  const [menuOpenSheet, setMenuOpenSheet] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [draggedSheet, setDraggedSheet] = useState<string | null>(null);
  const [dragOverSheet, setDragOverSheet] = useState<string | null>(null);

  const handleOpenMenu = (sheet: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (menuOpenSheet === sheet) {
      setMenuOpenSheet(null);
      setMenuPos(null);
    } else {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setMenuPos({ x: rect.left, y: rect.bottom + 4 });
      setMenuOpenSheet(sheet);
    }
  };

  const handleCloseMenu = () => {
    setMenuOpenSheet(null);
    setMenuPos(null);
  };

  const handleDragStart = (e: React.DragEvent, name: string) => {
    setDraggedSheet(name);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragEnd = () => { setDraggedSheet(null); setDragOverSheet(null); };
  const handleDragOver = (e: React.DragEvent, name: string) => {
    e.preventDefault();
    if (draggedSheet && draggedSheet !== name) setDragOverSheet(name);
  };
  const handleDrop = (e: React.DragEvent, targetName: string) => {
    e.preventDefault();
    if (!draggedSheet || draggedSheet === targetName) { handleDragEnd(); return; }
    const next = [...sheets];
    const fi = next.indexOf(draggedSheet);
    const ti = next.indexOf(targetName);
    next.splice(fi, 1);
    next.splice(ti, 0, draggedSheet);
    onReorderSheets(next);
    handleDragEnd();
  };

  return (
    <>
      <div style={{
        height: 36, display: 'flex', alignItems: 'stretch',
        borderBottom: '1px solid #dee0e3', background: 'transparent',
        fontFamily: F, flexShrink: 0, paddingLeft: 8,
        overflowX: 'auto', overflowY: 'visible',
      }}>
        {sheets.map(sheet => {
          const active = sheet === activeSheet;
          const isOver = dragOverSheet === sheet;
          const isDragging = draggedSheet === sheet;

          return (
            <SheetTab
              key={sheet}
              sheet={sheet}
              active={active}
              isOver={isOver}
              isDragging={isDragging}
              renaming={renaming === sheet}
              renameValue={renameValue}
              onRenameChange={setRenameValue}
              onRenameBlur={() => {
                if (renameValue.trim()) onRenameSheet(sheet, renameValue.trim());
                setRenaming(null);
              }}
              onRenameKey={e => {
                if (e.key === 'Enter') {
                  if (renameValue.trim()) onRenameSheet(sheet, renameValue.trim());
                  setRenaming(null);
                }
                if (e.key === 'Escape') setRenaming(null);
              }}
              onClick={() => { if (!renaming) onSelectSheet(sheet); }}
              onDragStart={e => handleDragStart(e, sheet)}
              onDragEnd={handleDragEnd}
              onDragOver={e => handleDragOver(e, sheet)}
              onDrop={e => handleDrop(e, sheet)}
              onOpenMenu={e => handleOpenMenu(sheet, e)}
            />
          );
        })}

        {/* Add sheet */}
        <AddTabBtn onClick={onAddSheet} />
      </div>

      {menuOpenSheet && menuPos && (
        <ContextMenu
          pos={menuPos}
          canDelete={sheets.length > 1}
          onClose={handleCloseMenu}
          onRename={() => {
            setRenaming(menuOpenSheet);
            setRenameValue(menuOpenSheet);
            handleCloseMenu();
          }}
          onCopy={() => { onCopySheet(menuOpenSheet); handleCloseMenu(); }}
          onDelete={() => { onDeleteSheet(menuOpenSheet); handleCloseMenu(); }}
        />
      )}
    </>
  );
}

// ── Single sheet tab ──────────────────────────────────────────
function SheetTab({
  sheet, active, isOver, isDragging,
  renaming, renameValue, onRenameChange, onRenameBlur, onRenameKey,
  onClick, onDragStart, onDragEnd, onDragOver, onDrop, onOpenMenu,
}: {
  sheet: string; active: boolean; isOver: boolean; isDragging: boolean;
  renaming: boolean; renameValue: string;
  onRenameChange: (v: string) => void;
  onRenameBlur: () => void;
  onRenameKey: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onOpenMenu: (e: React.MouseEvent) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', display: 'flex', alignItems: 'center', gap: 5,
        padding: '0 12px', cursor: 'pointer', fontSize: 13,
        color: active ? '#1f2329' : hovered ? '#1f2329' : '#646a73',
        fontWeight: active ? 500 : 400,
        background: active ? '#fff' : hovered ? '#f5f6f7' : 'transparent',
        borderLeft: isOver ? '2px solid #3370ff' : '2px solid transparent',
        opacity: isDragging ? 0.5 : 1,
        flexShrink: 0,
        userSelect: 'none',
        transition: 'background 0.1s, color 0.1s',
        // Active bottom indicator
        borderBottom: active ? 'none' : 'none',
      }}
    >
      {/* Bottom active indicator — positioned absolutely */}
      {active && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 2, background: '#3370ff', borderRadius: '2px 2px 0 0',
        }} />
      )}

      {/* Grid icon — like Feishu 田 */}
      <LayoutGrid
        size={12}
        color={active ? '#3370ff' : hovered ? '#8f959e' : '#c9cdd4'}
        style={{ flexShrink: 0 }}
      />

      {renaming ? (
        <input
          autoFocus
          value={renameValue}
          onChange={e => onRenameChange(e.target.value)}
          onBlur={onRenameBlur}
          onKeyDown={onRenameKey}
          onClick={e => e.stopPropagation()}
          style={{
            border: '1px solid #3370ff', outline: 'none', fontSize: 13,
            padding: '1px 4px', borderRadius: 2, width: 80,
          }}
        />
      ) : (
        <span style={{ whiteSpace: 'nowrap' }}>{sheet}</span>
      )}

      {/* Three-dot — only show on active tab, or on hover */}
      {(active || hovered) && !renaming && (
        <div
          draggable={false}
          onDragStart={e => { e.stopPropagation(); e.preventDefault(); }}
          onClick={onOpenMenu}
          style={{
            lineHeight: 0, padding: '2px 2px',
            borderRadius: 3, cursor: 'pointer', flexShrink: 0,
            marginLeft: 2,
            color: '#8f959e',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.background = '#ebebeb';
            (e.currentTarget as HTMLDivElement).style.color = '#1f2329';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.background = 'transparent';
            (e.currentTarget as HTMLDivElement).style.color = '#8f959e';
          }}
        >
          {/* ··· icon drawn manually for cleaner look */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="3"  cy="7" r="1.2" fill="currentColor" />
            <circle cx="7"  cy="7" r="1.2" fill="currentColor" />
            <circle cx="11" cy="7" r="1.2" fill="currentColor" />
          </svg>
        </div>
      )}
    </div>
  );
}

// ── Add tab button ───────────────────────────────────────────
function AddTabBtn({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 36, cursor: 'pointer', flexShrink: 0,
        color: hovered ? '#3370ff' : '#8f959e',
        background: hovered ? '#f0f4ff' : 'transparent',
        borderRadius: 4, margin: '4px 0',
        transition: 'background 0.1s, color 0.1s',
      }}
    >
      <Plus size={16} />
    </div>
  );
}

// ── Context menu ─────────────────────────────────────────────
function ContextMenu({ pos, canDelete, onClose, onRename, onCopy, onDelete }: {
  pos: { x: number; y: number };
  canDelete: boolean;
  onClose: () => void;
  onRename: () => void;
  onCopy: () => void;
  onDelete: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => { clearTimeout(id); document.removeEventListener('mousedown', handler); };
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed', left: pos.x, top: pos.y, zIndex: 9999,
        width: 130, background: '#fff', borderRadius: 6,
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)', border: '1px solid #dee0e3',
        fontFamily: F, overflow: 'hidden',
      }}
      onMouseDown={e => e.stopPropagation()}
    >
      <MenuItem label="重命名" onClick={onRename} />
      <MenuItem label="复制"   onClick={onCopy} />
      <MenuItem label="删除" onClick={canDelete ? onDelete : undefined} danger disabled={!canDelete} />
    </div>
  );
}

function MenuItem({ label, onClick, danger, disabled }: {
  label: string; onClick?: () => void; danger?: boolean; disabled?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '8px 14px', fontSize: 13,
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? '#c9cdd4' : danger ? '#f54a45' : '#1f2329',
        background: hovered ? '#f5f6f7' : 'transparent',
      }}
    >
      {label}
      {disabled && <span style={{ fontSize: 11, color: '#c9cdd4', marginLeft: 4 }}>（仅剩1个）</span>}
    </div>
  );
}
