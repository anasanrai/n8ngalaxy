import { ReactFlow, Background, BackgroundVariant, ReactFlowProvider, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import N8nNode from './N8nNode';
import N8nSubNode from './N8nSubNode';
import { SlackIcon, GmailIcon, AnthropicIcon, PostgresIcon, WebhookIcon, ApolloIcon } from './NodeIcons';

const nodeTypes = {
  n8nNode: N8nNode,
  n8nSubNode: N8nSubNode,
};

const demoNodes = [
  {
    id: 'node-1',
    type: 'n8nNode',
    position: { x: 80, y: 260 },
    data: {
      label: 'Webhook Trigger',
      sublabel: 'POST /webhook/leads',
      icon: <WebhookIcon width={20} height={20} />,
      color: '#FF6B35',
      type: 'trigger',
    },
  },
  {
    id: 'node-2',
    type: 'n8nNode',
    position: { x: 340, y: 200 },
    data: {
      label: 'AI Agent',
      sublabel: 'Tools Agent',
      icon: '🤖',
      color: '#9B59B6',
      type: 'ai-agent',
      isRunning: false,
    },
  },
  {
    id: 'node-3',
    type: 'n8nNode',
    position: { x: 620, y: 160 },
    data: {
      label: 'If',
      sublabel: 'Route by score',
      icon: '⚔️',
      color: '#7C3AED',
      type: 'regular',
      outputs: ['true', 'false'],
    },
  },
  {
    id: 'node-4',
    type: 'n8nNode',
    position: { x: 880, y: 80 },
    data: {
      label: 'Slack',
      sublabel: 'Add to channel',
      icon: <SlackIcon width={20} height={20} />,
      color: '#00E5C7',
      type: 'output',
    },
  },
  {
    id: 'node-5',
    type: 'n8nNode',
    position: { x: 880, y: 280 },
    data: {
      label: 'Gmail',
      sublabel: 'Send follow-up',
      icon: <GmailIcon width={20} height={20} />,
      color: '#00E5C7',
      type: 'output',
    },
  },
  // Sub-nodes
  {
    id: 'subnode-1',
    type: 'n8nSubNode',
    position: { x: 298, y: 420 },
    data: {
      label: 'Anthropic',
      sublabel: 'Chat Model',
      icon: <AnthropicIcon width={26} height={26} />,
    },
  },
  {
    id: 'subnode-2',
    type: 'n8nSubNode',
    position: { x: 390, y: 420 },
    data: {
      label: 'Postgres',
      sublabel: 'Memory',
      icon: <PostgresIcon width={26} height={26} />,
    },
  },
  {
    id: 'subnode-3',
    type: 'n8nSubNode',
    position: { x: 482, y: 420 },
    data: {
      label: 'Apollo',
      sublabel: 'Tool',
      icon: <ApolloIcon width={26} height={26} />,
    },
  },
];

const mainEdgeStyle = {
  stroke: '#7C3AED',
  strokeWidth: 1.5,
};

const demoEdges = [
  {
    id: 'e1-2',
    source: 'node-1',
    target: 'node-2',
    type: 'smoothstep',
    animated: true,
    style: mainEdgeStyle,
    markerEnd: { type: MarkerType.ArrowClosed, color: '#7C3AED' },
  },
  {
    id: 'e2-3',
    source: 'node-2',
    target: 'node-3',
    type: 'smoothstep',
    animated: true,
    style: mainEdgeStyle,
    markerEnd: { type: MarkerType.ArrowClosed, color: '#7C3AED' },
  },
  {
    id: 'e3-4',
    source: 'node-3',
    sourceHandle: 'true',
    target: 'node-4',
    type: 'smoothstep',
    animated: true,
    style: mainEdgeStyle,
    markerEnd: { type: MarkerType.ArrowClosed, color: '#7C3AED' },
  },
  {
    id: 'e3-5',
    source: 'node-3',
    sourceHandle: 'false',
    target: 'node-5',
    type: 'smoothstep',
    animated: true,
    style: mainEdgeStyle,
    markerEnd: { type: MarkerType.ArrowClosed, color: '#7C3AED' },
  },
  // Sub-node dashed connections
  {
    id: 'es1-2',
    source: 'subnode-1',
    target: 'node-2',
    targetHandle: 'tools',
    type: 'straight',
    animated: false,
    style: { stroke: '#4A4A5A', strokeWidth: 1, strokeDasharray: '4 4' },
  },
  {
    id: 'es2-2',
    source: 'subnode-2',
    target: 'node-2',
    targetHandle: 'tools',
    type: 'straight',
    animated: false,
    style: { stroke: '#4A4A5A', strokeWidth: 1, strokeDasharray: '4 4' },
  },
  {
    id: 'es3-2',
    source: 'subnode-3',
    target: 'node-2',
    targetHandle: 'tools',
    type: 'straight',
    animated: false,
    style: { stroke: '#4A4A5A', strokeWidth: 1, strokeDasharray: '4 4' },
  },
];

function Canvas() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#0A0A0F' }}>
      <ReactFlow
        nodes={demoNodes}
        edges={demoEdges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        panOnDrag={true}
        zoomOnScroll={true}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.4}
        maxZoom={1.2}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#1E1E30"
        />
      </ReactFlow>
    </div>
  );
}

export default function DemoWorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <Canvas />
    </ReactFlowProvider>
  );
}
