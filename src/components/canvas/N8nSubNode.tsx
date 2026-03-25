import { Handle, Position, type NodeProps } from '@xyflow/react';

export type N8nSubNodeData = {
  label: string;
  sublabel: string;
  icon: string | React.ReactNode;
};

export default function N8nSubNode({ data }: NodeProps) {
  const nodeData = data as unknown as N8nSubNodeData;
  const { label, sublabel, icon } = nodeData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Circle */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#2D2D3A',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
          transition: 'border-color 150ms',
          cursor: 'default',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
      >
        {typeof icon === 'string' ? icon : icon}
      </div>

      {/* Labels */}
      <div style={{ marginTop: 6, textAlign: 'center', maxWidth: 80 }}>
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: 11,
          color: '#9CA3AF',
          wordBreak: 'break-word',
          lineHeight: 1.3,
        }}>
          {label}
        </div>
        {sublabel && (
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: 10,
            color: '#6B7280',
            marginTop: 2,
          }}>
            {sublabel}
          </div>
        )}
      </div>

      {/* Single top handle — connects to AI Agent bottom */}
      <Handle
        type="source"
        position={Position.Top}
        style={{
          width: 8,
          height: 8,
          background: '#4A4A5A',
          border: '1.5px solid #6B6B7B',
          borderRadius: '50%',
          top: -4,
          opacity: 0,   // invisible dot, connection line still works
        }}
      />
    </div>
  );
}
