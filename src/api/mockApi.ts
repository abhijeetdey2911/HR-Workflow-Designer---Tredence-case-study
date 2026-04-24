import type {
  ApprovalNodeData,
  AutomatedNodeData,
  AutomationAction,
  SimulationResult,
  TaskNodeData,
  WorkflowEdge,
  WorkflowNode,
} from '../types'
import { getTopologicalOrder } from '../utils/graphUtils'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getAutomations = async (): Promise<AutomationAction[]> => {
  await wait(300)
  return [
    { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
    { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
    { id: 'notify_slack', label: 'Notify Slack', params: ['channel', 'message'] },
    { id: 'update_hris', label: 'Update HRIS', params: ['employeeId', 'field', 'value'] },
    { id: 'create_ticket', label: 'Create Ticket', params: ['title', 'priority', 'assignee'] },
  ]
}

const createNodeMessage = (node: WorkflowNode): string => {
  if (node.type === 'startNode') return 'Workflow initiated'
  if (node.type === 'taskNode') return `Task assigned to ${(node.data as TaskNodeData).assignee || 'unassigned'}`
  if (node.type === 'approvalNode') {
    return `Pending approval from ${(node.data as ApprovalNodeData).approverRole || 'unknown role'}`
  }
  if (node.type === 'automatedNode') {
    return `Executing automation: ${(node.data as AutomatedNodeData).actionId || 'unconfigured action'}`
  }
  return 'Workflow completed'
}

export const simulateWorkflow = async (
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): Promise<SimulationResult> => {
  await wait(1500)
  const orderedNodes = getTopologicalOrder(nodes, edges)
  const now = Date.now()

  const steps = orderedNodes.map((node, index) => ({
    nodeId: node.id,
    nodeType: node.type,
    label: node.data.label,
    status: 'success' as const,
    message: createNodeMessage(node),
    timestamp: new Date(now + index * 1000).toISOString(),
  }))

  return {
    success: true,
    totalSteps: steps.length,
    steps,
  }
}
