import { useCallback, useMemo, useState, type DragEvent } from 'react'
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react'
import { v4 as uuidv4 } from 'uuid'
import { ConfigPanel } from './components/panels/ConfigPanel'
import { Sidebar } from './components/panels/Sidebar'
import { SimulationPanel } from './components/panels/SimulationPanel'
import { useWorkflowValidation } from './hooks/useWorkflowValidation'
import { useWorkflowStore } from './store'
import type { NodeType, WorkflowNodeData } from './types'
import { nodeTypes } from './components/nodes'

const DesignerCanvas = () => {
  useWorkflowValidation()
  const { screenToFlowPosition } = useReactFlow()
  const [isSimulationOpen, setIsSimulationOpen] = useState(false)

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setSelectedNodeId,
    validationErrors,
  } = useWorkflowStore()

  const flowNodeTypes = useMemo(() => nodeTypes, [])

  const onDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const nodeType = event.dataTransfer.getData('nodeType') as NodeType
    if (!nodeType) return
    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY })
    const id = uuidv4()
    const defaultData: Record<NodeType, WorkflowNodeData> = {
      startNode: { label: 'Start', title: 'Workflow Start', metadata: [] },
      taskNode: { label: 'Task', title: 'New Task', description: '', assignee: '', dueDate: '', customFields: [] },
      approvalNode: { label: 'Approval', title: 'Approval Step', approverRole: 'Manager', autoApproveThreshold: 3 },
      automatedNode: { label: 'Automated', title: 'Automated Step', actionId: '', actionParams: {} },
      endNode: { label: 'End', endMessage: 'Workflow completed successfully.', showSummary: true },
    }
    addNode({ id, type: nodeType, position, data: defaultData[nodeType] })
  }, [screenToFlowPosition, addNode])

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <div
        style={{
          height: 48,
          background: '#2A2A3E',
          borderBottom: '1px solid #3F3F5A',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#E2E8F0', fontWeight: 700 }}>
          <span style={{ color: '#F97316' }}>●</span>
          <span>HR Workflow Designer</span>
        </div>
        <div style={{ color: validationErrors.length ? '#EF4444' : '#22C55E', fontSize: 13, fontWeight: 600 }}>
          {validationErrors.length ? `✗ ${validationErrors.length} errors` : '✓ Valid'}
        </div>
      </div>

      <div style={{ flexGrow: 1, display: 'flex', overflow: 'hidden', background: '#1E1E2E' }}>
        <div style={{ width: 220, flexShrink: 0 }}>
          <Sidebar onOpenSimulation={() => setIsSimulationOpen(true)} />
        </div>

        <main style={{ flexGrow: 1, position: 'relative' }} onDrop={onDrop} onDragOver={onDragOver}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={flowNodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_event, node) => setSelectedNodeId(node.id)}
            onPaneClick={() => setSelectedNodeId(null)}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
          >
            <Background color="#3F3F5A" gap={22} />
            <Controls />
            <MiniMap
              style={{
                background: '#2A2A3E',
                border: '1px solid #3F3F5A',
                borderRadius: '8px',
              }}
              nodeColor={(node) => {
                switch (node.type) {
                  case 'startNode': return '#22C55E'
                  case 'taskNode': return '#3B82F6'
                  case 'approvalNode': return '#EAB308'
                  case 'automatedNode': return '#A855F7'
                  case 'endNode': return '#EF4444'
                  default: return '#3F3F5A'
                }
              }}
              maskColor="rgba(30, 30, 46, 0.8)"
            />
          </ReactFlow>
        </main>

        <div style={{ width: 300, flexShrink: 0 }}>
          <ConfigPanel />
        </div>
      </div>

      <SimulationPanel isOpen={isSimulationOpen} onClose={() => setIsSimulationOpen(false)} />
    </div>
  )
}

const App = () => (
  <ReactFlowProvider>
    <DesignerCanvas />
  </ReactFlowProvider>
)

export default App