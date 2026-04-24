import ApprovalNode from './ApprovalNode'
import AutomatedNode from './AutomatedNode'
import EndNode from './EndNode'
import StartNode from './StartNode'
import TaskNode from './TaskNode'

export const nodeTypes = {
  startNode: StartNode,
  taskNode: TaskNode,
  approvalNode: ApprovalNode,
  automatedNode: AutomatedNode,
  endNode: EndNode,
}
