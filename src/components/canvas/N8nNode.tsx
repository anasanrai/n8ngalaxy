import { Handle, Position, type NodeProps } from '@xyflow/react';
import { RobotIcon } from './NodeIcons';

export type N8nNodeData = {
  label: string;
  sublabel: string;
  icon: string | React.ReactNode;
  color: string;
  type: 'trigger' | 'regular' | 'ai-agent' | 'output';
  isRunning?: boolean;
  hasError?: boolean;
  outputs?: string[];
};

const ACCENT_COLORS: Record<string, string> = {
  trigger: '#FF6B35',
  regular: '#7C3AED',
  'ai-agent': '#9B59B6',
  output: '#00E5C7',
};

// Inject keyframes once
const STYLE_ID = 'n8n-node-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes n8n-pulse-ring {
      0% { box-shadow: 0 0 0 0 rgba(0,229,199,0.4), 0 4px 24px rgba(0,0,0,0.4); }
      70% { box-shadow: 0 0 0 6px rgba(0,229,199,0), 0 4px 24px rgba(0,229,199,0.15); }
      100% { box-shadow: 0 0 0 0 rgba(0,229,199,0), 0 4px 24px rgba(0,0,0,0.4); }
    }
  `;
  document.head.appendChild(style);
}

export default function N8nNode({ data }: NodeProps) {
  const nodeData = data as unknown as N8nNodeData;
  const { label, sublabel, icon, color, type, isRunning, hasError, outputs } = nodeData;

  const accentColor = color || ACCENT_COLORS[type] || '#7C3AED';

  let boxShadow = '0 4px 24px rgba(0,0,0,0.4)';
  if (isRunning) boxShadow = '0 0 0 2px #00E5C7, 0 4px 24px rgba(0,229,199,0.2)';
  if (hasError)  boxShadow = '0 0 0 2px #EF4444, 0 4px 24px rgba(239,68,68,0.2)';

  const hasOutputHandles = outputs && outputs.length > 1;
  const handleSpacing = 24;

  return (
    <div
      className="n8n-node"
      style={{
        position: 'relative',
        background: '#2D2D3A',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        minWidth: 160,
        display: 'flex',
        alignItems: 'stretch',
        boxShadow: isRunning ? undefined : boxShadow,
        animation: isRunning ? 'n8n-pulse-ring 1.5s ease-in-out infinite' : undefined,
        transition: 'border-color 150ms, box-shadow 150ms',
        overflow: 'visible',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
    >
      {/* Left accent bar */}
      <div style={{
        width: 3,
        borderRadius: '12px 0 0 12px',
        background: accentColor,
        flexShrink: 0,
      }} />

      {/* Type badge (trigger / ai-agent) */}
      {(type === 'trigger' || type === 'ai-agent') && (
        <div style={{
          position: 'absolute',
          top: -8,
          left: 12,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#1A1A28',
          border: `1px solid ${accentColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 9,
          zIndex: 10,
        }}>
          {type === 'trigger' ? (
            <span style={{ color: accentColor }}>⚡</span>
          ) : (
            <RobotIcon width={11} height={11} />
          )}
        </div>
      )}

      {/* Content */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px 10px 10px', flex: 1 }}>
        {/* Icon area */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: `${accentColor}26`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: 18,
        }}>
          {typeof icon === 'string' ? icon : icon}
        </div>

        {/* Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: 13,
            color: '#F4F4F8',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {label}
          </span>
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: 11,
            color: '#6B7280',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {sublabel}
          </span>
        </div>
      </div>

      {/* Input handle */}
      {type !== 'trigger' && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            width: 10,
            height: 10,
            background: '#4A4A5A',
            border: '2px solid #6B6B7B',
            borderRadius: '50%',
            left: -5,
            top: '50%',
          }}
        />
      )}

      {/* Output handle(s) */}
      {!hasOutputHandles ? (
        <Handle
          type="source"
          position={Position.Right}
          style={{
            width: 10,
            height: 10,
            background: '#4A4A5A',
            border: '2px solid #6B6B7B',
            borderRadius: '50%',
            right: -5,
            top: '50%',
          }}
        />
      ) : (
        outputs!.map((outputLabel, i) => {
          const totalHeight = (outputs!.length - 1) * handleSpacing;
          const topOffset = 50 - (totalHeight / 2) + i * handleSpacing;
          return (
            <div key={outputLabel} style={{ position: 'absolute', right: -36, top: `${topOffset}%`, transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#6B7280' }}>{outputLabel}</span>
              <Handle
                type="source"
                position={Position.Right}
                id={outputLabel}
                style={{
                  position: 'relative',
                  width: 10,
                  height: 10,
                  background: '#4A4A5A',
                  border: '2px solid #6B6B7B',
                  borderRadius: '50%',
                  transform: 'none',
                  top: 'unset',
                  right: 'unset',
                }}
              />
            </div>
          );
        })
      )}

      {/* Bottom sub-node handle (for AI agent, tools connect here) */}
      {type === 'ai-agent' && (
        <Handle
          type="target"
          id="tools"
          position={Position.Bottom}
          style={{
            width: 10,
            height: 10,
            background: '#4A4A5A',
            border: '2px solid #6B6B7B',
            borderRadius: '50%',
            bottom: -5,
            top: 'unset',
          }}
        />
      )}
    </div>
  );
}
