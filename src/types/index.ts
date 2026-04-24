import type { Edge, Node } from '@xyflow/react'

export type NodeType = 'startNode' | 'taskNode' | 'approvalNode' | 'automatedNode' | 'endNode'

export type KeyValuePair = { id: string; key: string; value: string }

export type StartNodeData = { label: string; title: string; metadata: KeyValuePair[] }

export type TaskNodeData = {
  label: string
  title: string
  description: string
  assignee: string
  dueDate: string
  customFields: KeyValuePair[]
}

export type ApprovalNodeData = {
  label: string
  title: string
  approverRole: string
  autoApproveThreshold: number
}

export type AutomatedNodeData = {
  label: string
  title: string
  actionId: string
  actionParams: Record<string, string>
}

export type EndNodeData = {
  label: string
  endMessage: string
  showSummary: boolean
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData

export type WorkflowNode = Node<WorkflowNodeData, NodeType>

export type WorkflowEdge = Edge

export type AutomationAction = { id: string; label: string; params: string[] }

export type SimulationStepStatus = 'pending' | 'running' | 'success' | 'error'

export type SimulationStep = {
  nodeId: string
  nodeType: NodeType
  label: string
  status: SimulationStepStatus
  message: string
  timestamp: string
}

export type SimulationResult = {
  success: boolean
  totalSteps: number
  steps: SimulationStep[]
  error?: string
}

export type ValidationError = { nodeId?: string; message: string }