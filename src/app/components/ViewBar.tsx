import React, { useState, useRef } from 'react';
import { ChevronDown, Pin, Search } from 'lucide-react';
import { ViewSelectorDropdown, ViewItem } from './ViewSelectorDropdown';
import { SaveMenu } from './SaveMenu';
import { UpdateViewModal } from './UpdateViewModal';
import { SaveAsNewViewModal } from './SaveAsNewViewModal';
import { ShareViewModal } from './ShareViewModal';
import type { ShareMode } from './ShareViewModal';

const F = "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif";

interface Props {
  views: ViewItem[];
  selectedView: string | null;
  onSelectView: (name: string) => void;
  onTogglePin: (id: string) => void;
  onSaveNew: (name: string) => void;
  pinnedViews: string[];
  activePinnedTag: string | null;
  onClickPinnedTag: (name: string) => void;
  onShareView: (id: string, shareMode: ShareMode, sharedWith: string[]) => void;
}

export function ViewBar({
  views, selectedView, onSelectView, onTogglePin, onSaveNew,
  pinnedViews, activePinnedTag, onClickPinnedTag, onShareView,
}: Props) {
  const [showSelector, setShowSelector] = useState(false);
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showSaveAsModal, setShowSaveAsModal] = useState(false);
  const [cacheLastOp, setCacheLastOp] = useState(false);
  const [selectorPos, setSelectorPos] = useState<{ left: number; top: number } | null>(null);

  const [sharingViewId, setSharingViewId] = useState<string | null>(null);

  const selectorRef = useRef<HTMLDivElement>(null);
  const saveMenuRef = useRef<HTMLDivElement>(null);

  const existingNames = views.map(v => v.name);
  const sharingView = sharingViewId ? views.find(v => v.id === sharingViewId) ?? null : null;

  return (
    <>
      <div style={{
        height: 40, display: 'flex', alignItems: 'center',
        borderBottom: 'none', padding: '0 16px',
        background: 'transparent', gap: 10, flexShrink: 0, fontFamily: F,
      }}>
        {/* Select view button */}
        <div ref={selectorRef} style={{ position: 'relative' }}>
          <button
            onClick={() => {
              if (showSelector) { setShowSelector(false); return; }
              if (selectorRef.current) {
                const r = selectorRef.current.getBoundingClientRect();
                setSelectorPos({ left: r.left, top: r.bottom + 4 });
              }
              setShowSelector(true);
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              border: '1px solid #dee0e3', borderRadius: 4, padding: '0 10px', height: 28,
              background: '#fff', cursor: 'pointer', fontSize: 13,
              color: selectedView ? '#1f2329' : '#8f959e',
              width: 160,
            }}
          >
            <Search size={12} color="#aaa" style={{ flexShrink: 0 }} />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>
              {selectedView || '选择视图'}
            </span>
            <ChevronDown size={12} color="#aaa" style={{ flexShrink: 0 }} />
          </button>

          {showSelector && selectorPos && (
            <ViewSelectorDropdown
              views={views}
              selectedView={selectedView}
              onSelect={name => { onSelectView(name); setShowSelector(false); }}
              onTogglePin={onTogglePin}
              onShareView={id => { setSharingViewId(id); setShowSelector(false); }}
              onClose={() => setShowSelector(false)}
              fixedLeft={selectorPos.left}
              fixedTop={selectorPos.top}
            />
          )}
        </div>

        {/* Save button */}
        <div ref={saveMenuRef} style={{ position: 'relative' }}>
          <span
            onClick={() => setShowSaveMenu(v => !v)}
            style={{ fontSize: 13, color: '#3370ff', cursor: 'pointer', userSelect: 'none' }}
          >
            保存
          </span>
          {showSaveMenu && (
            <SaveMenu
              selectedView={selectedView}
              cacheLastOp={cacheLastOp}
              onToggleCache={() => setCacheLastOp(v => !v)}
              onUpdateView={() => setShowUpdateModal(true)}
              onSaveAsNew={() => setShowSaveAsModal(true)}
              onClose={() => setShowSaveMenu(false)}
            />
          )}
        </div>

        {/* Divider — LEFT of pin icon */}
        <div style={{ width: 1, height: 18, background: '#dee0e3', margin: '0 6px' }} />

        {/* Pin icon */}
        <Pin size={14} color="#3370ff" fill="#3370ff" style={{ cursor: 'default', flexShrink: 0 }} />

        {/* Pinned view tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, overflow: 'hidden' }}>
          {pinnedViews.map(name => {
            const active = activePinnedTag === name;
            return (
              <PinnedTag
                key={name}
                name={name}
                active={active}
                onClick={() => onClickPinnedTag(name)}
              />
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {showUpdateModal && (
        <UpdateViewModal
          viewName={selectedView || ''}
          onConfirm={(name, time) => {
            setShowUpdateModal(false);
          }}
          onClose={() => setShowUpdateModal(false)}
        />
      )}

      {showSaveAsModal && (
        <SaveAsNewViewModal
          existingNames={existingNames}
          onConfirm={(name, time) => {
            onSaveNew(name);
            setShowSaveAsModal(false);
          }}
          onClose={() => setShowSaveAsModal(false)}
        />
      )}

      {/* Share modal */}
      {sharingView && (
        <ShareViewModal
          view={sharingView}
          onSave={(shareMode, sharedWith) => {
            onShareView(sharingView.id, shareMode, sharedWith);
            setSharingViewId(null);
          }}
          onClose={() => setSharingViewId(null)}
        />
      )}
    </>
  );
}

function PinnedTag({ name, active, onClick }: { name: string; active: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '0 10px', height: 28, display: 'flex', alignItems: 'center',
        borderRadius: 4, fontSize: 13, cursor: 'pointer',
        border: `1px solid ${active ? '#3370ff' : '#dee0e3'}`,
        background: active ? '#e8f0ff' : hovered ? '#f5f6f7' : '#fff',
        color: active ? '#3370ff' : '#646a73',
        whiteSpace: 'nowrap',
      }}
    >
      {name}
    </div>
  );
}