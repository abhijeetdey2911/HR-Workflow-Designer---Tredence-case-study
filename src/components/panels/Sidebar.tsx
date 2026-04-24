import { useState } from 'react'
import { useWorkflowStore } from '../../store'

const nodeCategories = [
  { type: 'startNode', label: 'Start Node', description: 'Workflow entry point', icon: '🚀', color: '#22C55E' },
  { type: 'taskNode', label: 'Task Node', description: 'Human task or action', icon: '📋', color: '#3B82F6' },
  { type: 'approvalNode', label: 'Approval Node', description: 'Approval step', icon: '✅', color: '#EAB308' },
  { type: 'automatedNode', label: 'Automated Step', description: 'System automation', icon: '⚡', color: '#A855F7' },
  { type: 'endNode', label: 'End Node', description: 'Workflow completion', icon: '🏁', color: '#EF4444' },
] as const

type SidebarProps = { onOpenSimulation: () => void }

export const Sidebar = ({ onOpenSimulation }: SidebarProps) => {
  const nodes = useWorkflowStore((state) => state.nodes)
  const edges = useWorkflowStore((state) => state.edges)
  const validationErrors = useWorkflowStore((state) => state.validationErrors)
  const setNodes = useWorkflowStore((state) => state.setNodes)
  const setEdges = useWorkflowStore((state) => state.setEdges)
  const setSelectedNodeId = useWorkflowStore((state) => state.setSelectedNodeId)
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <aside
      style={{
        height: '100%',
        width: '220px',
        background: '#2A2A3E',
        borderRight: '1px solid #3F3F5A',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '999px', background: '#F97316' }} />
        <span style={{ fontSize: '16px', fontWeight: 700, color: '#E2E8F0' }}>HR Workflow</span>
      </div>

      <div style={{ fontSize: '10px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.1em', marginBottom: '8px' }}>
        ADD NODES
      </div>
      {nodeCategories.map((node) => (
        <div
          key={node.type}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('nodeType', node.type)
            e.dataTransfer.effectAllowed = 'move'
          }}
          onMouseEnter={() => setHovered(node.type)}
          onMouseLeave={() => setHovered(null)}
          style={{
            background: hovered === node.type ? '#3a3a55' : '#313145',
            border: '1px solid #3F3F5A',
            borderLeft: `4px solid ${node.color}`,
            borderRadius: '8px',
            padding: '10px 12px',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'background 0.15s',
            cursor: 'grab',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `${node.color}33`,
            }}
          >
            {node.icon}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#E2E8F0' }}>{node.label}</div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>{node.description}</div>
          </div>
        </div>
      ))}

      <div style={{ borderTop: '1px solid #3F3F5A', margin: '16px 0' }} />

      <div style={{ fontSize: '10px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.1em', marginBottom: '8px' }}>
        WORKFLOW
      </div>
      <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '12px' }}>
        Nodes: {nodes.length} &nbsp; Edges: {edges.length}
      </div>

      <button
        onClick={onOpenSimulation}
        style={{
          width: '100%',
          background: '#F97316',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          padding: '10px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: '8px',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#EA6C0A')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#F97316')}
      >
        Test Workflow
      </button>

      <button
        onClick={() => {
          setNodes([
            {
              id: 'start-1',
              type: 'startNode',
              position: { x: 250, y: 80 },
              data: { label: 'Start', title: 'Workflow Start', metadata: [] },
            },
            {
              id: 'end-1',
              type: 'endNode',
              position: { x: 250, y: 400 },
              data: { label: 'End', endMessage: 'Workflow completed successfully.', showSummary: true },
            },
          ])
          setEdges([])
          setSelectedNodeId(null)
        }}
        style={{
          width: '100%',
          background: 'transparent',
          color: '#E2E8F0',
          border: '1px solid #3F3F5A',
          borderRadius: '6px',
          padding: '10px',
          fontSize: '13px',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#313145')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        Clear Canvas
      </button>

      {validationErrors.length > 0 && (
        <div
          style={{
            marginTop: '12px',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '6px',
            padding: '8px 12px',
          }}
        >
          <span style={{ color: '#EF4444', fontSize: '12px' }}>⚠ {validationErrors.length} validation error(s)</span>
        </div>
      )}
    </aside>
  )
}
