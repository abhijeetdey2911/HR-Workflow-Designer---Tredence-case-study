import { useEffect, useMemo } from 'react'
import { useWorkflowStore } from '../store'
import { validateWorkflow } from '../utils/graphUtils'

export const useWorkflowValidation = () => {
  const nodes = useWorkflowStore((state) => state.nodes)
  const edges = useWorkflowStore((state) => state.edges)
  const validationErrors = useWorkflowStore((state) => state.validationErrors)
  const setValidationErrors = useWorkflowStore((state) => state.setValidationErrors)

  useEffect(() => {
    setValidationErrors(validateWorkflow(nodes, edges))
  }, [nodes, edges, setValidationErrors])

  const isValid = useMemo(() => validationErrors.length === 0, [validationErrors])
  return { validationErrors, isValid }
}
