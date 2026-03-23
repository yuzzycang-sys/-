import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Overlay } from './UpdateViewModal';

const F = "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif";
const TIME_OPTS = ['今天', '昨天', '近7天', '近30天'];

interface Props {
  existingNames: string[];
  onConfirm: (name: string, timeOpt: string) => void;
  onClose: () => void;
}

export function SaveAsNewViewModal({ existingNames, onConfirm, onClose }: Props) {
  const [name, setName] = useState('');
  const [timeTab, setTimeTab] = useState<'relative' | 'absolute'>('relative');
  const [selectedTime, setSelectedTime] = useState('今天');
  const [absStart, setAbsStart] = useState('2026-02-01');
  const [absEnd, setAbsEnd] = useState('2026-02-28');

  const MAX_CHARS = 30;
  const charCount = name.split('').reduce((acc, c) => acc + (c.charCodeAt(0) > 127 ? 2 : 1), 0);
  const overLimit = charCount > MAX_CHARS;
  const duplicateName = existingNames.includes(name.trim());
  const canConfirm = name.trim().length > 0 && !overLimit && !duplicateName;

  const getError = () => {
    if (overLimit) return `视图名称上限 30 个字符，当前 ${charCount} 个`;
    if (duplicateName) return '视图名称已存在';
    return null;
  };

  return (
    <Overlay onClose={onClose}>
      <div
        style={{
          width: 440, background: '#fff', borderRadius: 8,
          fontFamily: F, boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderBottom: '1px solid #e8e8e8',
        }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: '#333' }}>另存为新视图</span>
          <X size={16} color="#999" style={{ cursor: 'pointer' }} onClick={onClose} />
        </div>

        {/* Body */}
        <div style={{ padding: '20px 20px' }}>
          {/* View name */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#333', marginBottom: 6 }}>
              视图名称
            </label>
            <div style={{ position: 'relative' }}>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="请输入视图名称"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  border: `1px solid ${getError() ? '#ff4d4f' : '#d9d9d9'}`,
                  borderRadius: 4, padding: '7px 10px',
                  fontSize: 13, color: '#333', outline: 'none',
                  paddingRight: 60,
                }}
              />
              <span style={{
                position: 'absolute', right: 8, bottom: 8,
                fontSize: 11, color: overLimit ? '#ff4d4f' : '#aaa',
              }}>
                {charCount}/{MAX_CHARS}
              </span>
            </div>
            {getError() && (
              <div style={{ fontSize: 11, color: '#ff4d4f', marginTop: 4 }}>
                {getError()}
              </div>
            )}
          </div>

          {/* Time selection */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#333', marginBottom: 6 }}>
              时间选择
            </label>
            <div style={{ display: 'flex', marginBottom: 10, borderBottom: '1px solid #e8e8e8' }}>
              {(['relative', 'absolute'] as const).map(tab => (
                <div
                  key={tab}
                  onClick={() => setTimeTab(tab)}
                  style={{
                    padding: '6px 14px', fontSize: 13, cursor: 'pointer',
                    color: timeTab === tab ? '#1890ff' : '#666',
                    borderBottom: timeTab === tab ? '2px solid #1890ff' : '2px solid transparent',
                  }}
                >
                  {tab === 'relative' ? '相对时间' : '绝对时间'}
                </div>
              ))}
            </div>

            {timeTab === 'relative' ? (
              <div style={{ display: 'flex', gap: 8 }}>
                {TIME_OPTS.map(opt => (
                  <div
                    key={opt}
                    onClick={() => setSelectedTime(opt)}
                    style={{
                      padding: '4px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer',
                      border: `1px solid ${selectedTime === opt ? '#1890ff' : '#d9d9d9'}`,
                      background: selectedTime === opt ? '#e6f7ff' : '#fff',
                      color: selectedTime === opt ? '#1890ff' : '#666',
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="date" value={absStart} onChange={e => setAbsStart(e.target.value)}
                  style={{ border: '1px solid #d9d9d9', borderRadius: 4, padding: '5px 8px', fontSize: 12, color: '#333', outline: 'none' }}
                />
                <span style={{ color: '#999', fontSize: 12 }}>~</span>
                <input
                  type="date" value={absEnd} onChange={e => setAbsEnd(e.target.value)}
                  style={{ border: '1px solid #d9d9d9', borderRadius: 4, padding: '5px 8px', fontSize: 12, color: '#333', outline: 'none' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: 8,
          padding: '12px 20px', borderTop: '1px solid #e8e8e8',
        }}>
          <button onClick={onClose} style={{
            padding: '5px 16px', border: '1px solid #d9d9d9', borderRadius: 4,
            fontSize: 13, color: '#666', background: '#fff', cursor: 'pointer',
          }}>
            取消
          </button>
          <button
            onClick={() => canConfirm && onConfirm(name.trim(), timeTab === 'relative' ? selectedTime : `${absStart}~${absEnd}`)}
            style={{
              padding: '5px 16px', border: 'none', borderRadius: 4,
              fontSize: 13, color: '#fff',
              background: canConfirm ? '#1890ff' : '#b8d9f5',
              cursor: canConfirm ? 'pointer' : 'not-allowed',
            }}
          >
            确定
          </button>
        </div>
      </div>
    </Overlay>
  );
}
