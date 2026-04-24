import { Handle, Position } from '@xyflow/react'
import { memo, useState } from 'react'
import type { NodeProps } from '@xyflow/react'
import { useWorkflowStore } from '../../store'
import type { TaskNodeData } from '../../types'

const TaskNode = memo(({ id, data, selected }: NodeProps) => {
  const nodeData = data as TaskNodeData
  const { setSelectedNodeId, deleteNode } = useWorkflowStore()
  const [showDelete, setShowDelete] = useState(false)

  return (
    <div
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      onClick={() => setSelectedNodeId(id)}
      style={{
        background: '#2A2A3E',
        border: selected ? '2px solid #F97316' : '1px solid #3F3F5A',
        borderLeft: '4px solid #3B82F6',
        borderRadius: 8,
        minWidth: 180,
        maxWidth: 220,
        padding: '12px 14px',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: selected ? '0 0 0 3px rgba(249,115,22,0.2)' : '0 2px 8px rgba(0,0,0,0.3)',
        transition: 'box-shadow 0.15s',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#F97316' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#F97316' }} />
      <button
        style={{
          display: showDelete ? 'block' : 'none',
          position: 'absolute',
          top: 6,
          right: 6,
          background: 'rgba(239,68,68,0.15)',
          border: 'none',
          color: '#EF4444',
          borderRadius: 4,
          padding: '2px 6px',
          fontSize: 11,
          cursor: 'pointer',
        }}
        onClick={(e) => { e.stopPropagation(); deleteNode(id) }}
      >
        ×
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: 16 }}>📋</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0' }}>{nodeData.label}</div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
            {nodeData.assignee ? `👤 ${nodeData.assignee}` : nodeData.title || 'New Task'}
          </div>
        </div>
      </div>
    </div>
  )
})

TaskNode.displayName = 'TaskNode'
export default TaskNode
