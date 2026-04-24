import { useEffect, type CSSProperties, type FocusEvent, type ReactNode, useMemo, useState } from 'react'
import { getAutomations } from '../../api/mockApi'
import { useWorkflowStore } from '../../store'
import type {
  ApprovalNodeData,
  AutomatedNodeData,
  AutomationAction,
  EndNodeData,
  StartNodeData,
  TaskNodeData,
} from '../../types'
import { KeyValueEditor } from '../ui/KeyValueEditor'
import { Toggle } from '../ui/Toggle'

const nodeColors: Record<string, string> = {
  startNode: '#22C55E',
  taskNode: '#3B82F6',
  approvalNode: '#EAB308',
  automatedNode: '#A855F7',
  endNode: '#EF4444',
}

const nodeIcons: Record<string, string> = {
  startNode: '🚀',
  taskNode: '📋',
  approvalNode: '✅',
  automatedNode: '⚡',
  endNode: '🏁',
}

const nodeLabels: Record<string, string> = {
  startNode: 'Start Node',
  taskNode: 'Task Node',
  approvalNode: 'Approval Node',
  automatedNode: 'Automated Step',
  endNode: 'End Node',
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          display: 'block',
          fontSize: 11,
          color: '#94A3B8',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

export const ConfigPanel = () => {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId)
  const nodes = useWorkflowStore((state) => state.nodes)
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData)
  const deleteNode = useWorkflowStore((state) => state.deleteNode)
  const setSelectedNodeId = useWorkflowStore((state) => state.setSelectedNodeId)
  const [automations, setAutomations] = useState<AutomationAction[]>([])

  useEffect(() => {
    getAutomations().then(setAutomations)
  }, [])

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null
  const inputStyle: CSSProperties = {
    width: '100%',
    background: '#1E1E2E',
    border: '1px solid #3F3F5A',
    color: '#E2E8F0',
    borderRadius: 6,
    padding: '8px 12px',
    fontSize: 13,
    outline: 'none',
  }

  const focusedBorder = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (event.currentTarget.style.borderColor = '#F97316')
  const blurBorder = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (event.currentTarget.style.borderColor = '#3F3F5A')

  if (!selectedNode) {
    return (
      <aside
        style={{
          width: 300,
          minWidth: 300,
          height: '100%',
          background: '#2A2A3E',
          borderLeft: '1px solid #3F3F5A',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div>
            <div style={{ fontSize: 32, textAlign: 'center' }}>🎯</div>
            <div style={{ marginTop: 8, color: '#E2E8F0', fontSize: 14, fontWeight: 600, textAlign: 'center' }}>
              Select a node
            </div>
            <div style={{ marginTop: 4, color: '#94A3B8', fontSize: 12, textAlign: 'center' }}>
              Click any node on the canvas to configure it
            </div>
          </div>
        </div>
      </aside>
    )
  }

  const selectedAction = useMemo(
    () => automations.find((a) => a.id === (selectedNode.data as AutomatedNodeData).actionId),
    [automations, selectedNode],
  )

  const renderFormByType = (): ReactNode => {
    switch (selectedNode.type) {
      case 'startNode':
        {
          const data = selectedNode.data as StartNodeData
          return (
            <>
              <FormField label="Workflow Title">
                <input
                  style={inputStyle}
                  value={data.title}
                  onFocus={focusedBorder}
                  onBlur={blurBorder}
                  onChange={(e) => updateNodeData(selectedNode.id, { title: e.target.value })}
                />
              </FormField>
              <FormField label="Metadata">
                <KeyValueEditor pairs={data.metadata} onChange={(pairs) => updateNodeData(selectedNode.id, { metadata: pairs })} />
              </FormField>
            </>
          )
        }
      case 'taskNode':
        {
          const data = selectedNode.data as TaskNodeData
          return (
            <>
              <FormField label="Task Title">
                <input
                  style={inputStyle}
                  value={data.title}
                  onFocus={focusedBorder}
                  onBlur={blurBorder}
                  onChange={(e) => updateNodeData(selectedNode.id, { title: e.target.value })}
                />
              </FormField>
              <FormField label="Description">
                <textarea
                  style={inputStyle}
                  rows={3}
                  value={data.description}
                  onFocus={focusedBorder}
                  onBlur={blurBorder}
                  onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })}
                />
              </FormField>
              <FormField label="Assignee">
                <input
                  style={inputStyle}
                  value={data.assignee}
                  onFocus={focusedBorder}
                  onBlur={blurBorder}
                  onChange={(e) => updateNodeData(selectedNode.id, { assignee: e.target.value })}
                />
              </FormField>
              <FormField label="Due Date">
                <input
                  type="date"
                  style={inputStyle}
                  value={data.dueDate}
                  onFocus={focusedBorder}
                  onBlur={blurBorder}
                  onChange={(e) => updateNodeData(selectedNode.id, { dueDate: e.target.value })}
                />
              </FormField>
              <FormField label="Custom Fields">
                <KeyValueEditor
                  pairs={data.customFields}
                  onChange={(pairs) => updateNodeData(selectedNode.id, { customFields: pairs })}
                />
              </FormField>
            </>
          )
        }
      case 'approvalNode':
        {
          const data = selectedNode.data as ApprovalNodeData
          return (
            <>
              <FormField label="Title">
                <input
                  style={inputStyle}
                  value={data.title}
                  onFocus={focusedBorder}
                  onBlur={blurBorder}
                  onChange={(e) => updateNodeData(selectedNode.id, { title: e.target.value })}
                />
              </FormField>
              <FormField label="Approver Role">
                <select
                  style={inputStyle}
                  value={data.approverRole}
                  onFocus={focusedBorder}
                  onBlur={blurBorder}
                  onChange={(e) => updateNodeData(selectedNode.id, { approverRole: e.target.value })}
                >
                  {['Manager', 'HRBP', 'Director', 'CEO'].map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Auto-approve after (days)">
                <input
                  type="number"
                  min={0}
                  style={inputStyle}
                  value={data.autoApproveThreshold}
                  onFocus={focusedBorder}
                  onBlur={blurBorder}
                  onChange={(e) => updateNodeData(selectedNode.id, { autoApproveThreshold: Number(e.target.value) || 0 })}
                />
              </FormField>
            </>
          )
        }
      case 'automatedNode':
        {
          const data = selectedNode.data as AutomatedNodeData
          return (
            <>
              <FormField label="Title">
                <input
                  style={inputStyle}
                  value={data.title}
                  onFocus={focusedBorder}
                  onBlur={blurBorder}
                  onChange={(e) => updateNodeData(selectedNode.id, { title: e.target.value })}
                />
              </FormField>
              <FormField label="Action">
                <select
                  style={inputStyle}
                  value={data.actionId}
                  onFocus={focusedBorder}
                  onBlur={blurBorder}
                  onChange={(e) => updateNodeData(selectedNode.id, { actionId: e.target.value, actionParams: {} })}
                >
                  <option value="">Select an action</option>
                  {automations.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </FormField>
              {data.actionId &&
                selectedAction?.params.map((param) => (
                  <FormField key={param} label={param}>
                    <input
                      style={inputStyle}
                      value={data.actionParams[param] ?? ''}
                      onFocus={focusedBorder}
                      onBlur={blurBorder}
                      onChange={(e) =>
                        updateNodeData(selectedNode.id, {
                          actionParams: { ...data.actionParams, [param]: e.target.value },
                        })
                      }
                    />
                  </FormField>
                ))}
            </>
          )
        }
      case 'endNode':
        {
          const data = selectedNode.data as EndNodeData
          return (
            <>
              <FormField label="End Message">
                <input
                  style={inputStyle}
                  value={data.endMessage}
                  onFocus={focusedBorder}
                  onBlur={blurBorder}
                  onChange={(e) => updateNodeData(selectedNode.id, { endMessage: e.target.value })}
                />
              </FormField>
              <FormField label="Show Summary">
                <Toggle checked={data.showSummary} onChange={(val) => updateNodeData(selectedNode.id, { showSummary: val })} />
              </FormField>
            </>
          )
        }
      default:
        return (
          <div style={{ color: '#94A3B8', fontSize: 12 }}>Unsupported node type.</div>
        )
    }
  }

  return (
    <aside
      style={{
        width: 300,
        minWidth: 300,
        height: '100%',
        background: '#2A2A3E',
        borderLeft: '1px solid #3F3F5A',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: 16, borderBottom: '1px solid #3F3F5A' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: `${nodeColors[selectedNode.type]}20`,
            border: `1px solid ${nodeColors[selectedNode.type]}`,
            color: nodeColors[selectedNode.type],
            borderRadius: 20,
            padding: '4px 10px',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <span>{nodeIcons[selectedNode.type]}</span>
          <span>{nodeLabels[selectedNode.type]}</span>
        </span>
        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 6 }}>ID: {selectedNode.id}</div>
      </div>
      <div style={{ padding: 16, overflowY: 'auto', flexGrow: 1 }}>{renderFormByType()}</div>
      <div style={{ padding: 16, borderTop: '1px solid #3F3F5A' }}>
        <button
          style={{
            width: '100%',
            background: '#EF4444',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: 10,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#DC2626')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#EF4444')}
          onClick={() => {
            deleteNode(selectedNode.id)
            setSelectedNodeId(null)
          }}
        >
          🗑 Delete Node
        </button>
      </div>
    </aside>
  )
}
