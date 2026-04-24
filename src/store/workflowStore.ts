import { create } from 'zustand'
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from '@xyflow/react'
import type { SimulationResult, ValidationError, WorkflowEdge, WorkflowNode, WorkflowNodeData } from '../types'

export const createInitialNodes = (): WorkflowNode[] => [
  {
    id: 'start-1',
    type: 'startNode',
    position: { x: 250, y: 80 },
    data: {
      label: 'Start',
      title: 'Workflow Start',
      metadata: [],
    },
  },
  {
    id: 'end-1',
    type: 'endNode',
    position: { x: 250, y: 400 },
    data: {
      label: 'End',
      endMessage: 'Workflow completed successfully.',
      showSummary: true,
    },
  },
]

type WorkflowStoreState = {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  selectedNodeId: string | null
  simulationResult: SimulationResult | null
  isSimulating: boolean
  validationErrors: ValidationError[]
  setNodes: (nodes: WorkflowNode[]) => void
  setEdges: (edges: WorkflowEdge[]) => void
  addNode: (node: WorkflowNode) => void
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void
  deleteNode: (nodeId: string) => void
  deleteEdge: (edgeId: string) => void
  setSelectedNodeId: (id: string | null) => void
  setSimulationResult: (result: SimulationResult | null) => void
  setIsSimulating: (val: boolean) => void
  setValidationErrors: (errors: ValidationError[]) => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
}

export const useWorkflowStore = create<WorkflowStoreState>((set, get) => ({
  nodes: createInitialNodes(),
  edges: [],
  selectedNodeId: null,
  simulationResult: null,
  isSimulating: false,
  validationErrors: [],
  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) as WorkflowNode[] }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) as WorkflowEdge[] }),
  onConnect: (connection) =>
    set({
      edges: addEdge(
        { ...connection, animated: true, style: { stroke: '#F97316', strokeWidth: 2 } },
        get().edges,
      ) as WorkflowEdge[],
    }),
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addNode: (node) => set({ nodes: [...get().nodes, node] }),
  updateNodeData: (nodeId, data) =>
    set({
      nodes: get().nodes.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node)),
    }),
  deleteNode: (nodeId) =>
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    }),
  deleteEdge: (edgeId) => set({ edges: get().edges.filter((edge) => edge.id !== edgeId) }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setSimulationResult: (result) => set({ simulationResult: result }),
  setIsSimulating: (val) => set({ isSimulating: val }),
  setValidationErrors: (errors) => set({ validationErrors: errors }),
}))