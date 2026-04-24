import type { ValidationError, WorkflowEdge, WorkflowNode } from '../types'

export const getTopologicalOrder = (nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowNode[] => {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]))
  const inDegree = new Map(nodes.map((node) => [node.id, 0]))
  const outgoing = new Map<string, string[]>()

  edges.forEach((edge) => {
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1)
    outgoing.set(edge.source, [...(outgoing.get(edge.source) ?? []), edge.target])
  })

  const queue = nodes.filter((node) => (inDegree.get(node.id) ?? 0) === 0).map((node) => node.id)
  const ordered: WorkflowNode[] = []

  while (queue.length) {
    const currentId = queue.shift()
    if (!currentId) continue
    const node = nodeMap.get(currentId)
    if (!node) continue
    ordered.push(node)

    ;(outgoing.get(currentId) ?? []).forEach((targetId) => {
      const nextDegree = (inDegree.get(targetId) ?? 0) - 1
      inDegree.set(targetId, nextDegree)
      if (nextDegree === 0) queue.push(targetId)
    })
  }

  return ordered.length === nodes.length ? ordered : nodes
}

export const hasCycle = (nodes: WorkflowNode[], edges: WorkflowEdge[]): boolean => {
  const adjacency = new Map<string, string[]>()
  nodes.forEach((node) => adjacency.set(node.id, []))
  edges.forEach((edge) => adjacency.set(edge.source, [...(adjacency.get(edge.source) ?? []), edge.target]))

  const visiting = new Set<string>()
  const visited = new Set<string>()

  const dfs = (nodeId: string): boolean => {
    if (visiting.has(nodeId)) return true
    if (visited.has(nodeId)) return false

    visiting.add(nodeId)
    for (const neighbor of adjacency.get(nodeId) ?? []) {
      if (dfs(neighbor)) return true
    }
    visiting.delete(nodeId)
    visited.add(nodeId)
    return false
  }

  return nodes.some((node) => dfs(node.id))
}

export const hasStartNode = (nodes: WorkflowNode[]): boolean => nodes.some((node) => node.type === 'startNode')

export const validateWorkflow = (nodes: WorkflowNode[], edges: WorkflowEdge[]): ValidationError[] => {
  const errors: ValidationError[] = []
  const startNodes = nodes.filter((node) => node.type === 'startNode')
  const endNodes = nodes.filter((node) => node.type === 'endNode')

  if (startNodes.length !== 1) errors.push({ message: 'Workflow must have exactly one start node.' })
  if (endNodes.length !== 1) errors.push({ message: 'Workflow must have exactly one end node.' })

  nodes.forEach((node) => {
    const incoming = edges.filter((edge) => edge.target === node.id)
    const outgoing = edges.filter((edge) => edge.source === node.id)
    if (node.type !== 'endNode' && outgoing.length === 0) {
      errors.push({ nodeId: node.id, message: `${node.data.label} must have at least one outgoing edge.` })
    }
    if (node.type !== 'startNode' && incoming.length === 0) {
      errors.push({ nodeId: node.id, message: `${node.data.label} must have at least one incoming edge.` })
    }
  })

  const firstStart = startNodes[0]
  if (firstStart && edges.some((edge) => edge.target === firstStart.id)) {
    errors.push({ nodeId: firstStart.id, message: 'Start node must not have incoming edges.' })
  }

  if (hasCycle(nodes, edges)) errors.push({ message: 'Workflow cannot contain cycles.' })

  return errors
}
