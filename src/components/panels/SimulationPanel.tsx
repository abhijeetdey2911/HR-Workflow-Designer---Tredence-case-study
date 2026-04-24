import { useEffect, useMemo, useState } from 'react'
import { simulateWorkflow } from '../../api/mockApi'
import { useWorkflowStore } from '../../store'
import type { SimulationStep } from '../../types'
import { validateWorkflow } from '../../utils/graphUtils'

type SimulationPanelProps = {
  isOpen: boolean
  onClose: () => void
}

export const SimulationPanel = ({ isOpen, onClose }: SimulationPanelProps) => {
  const nodes = useWorkflowStore((state) => state.nodes)
  const edges = useWorkflowStore((state) => state.edges)
  const simulationResult = useWorkflowStore((state) => state.simulationResult)
  const isSimulating = useWorkflowStore((state) => state.isSimulating)
  const setSimulationResult = useWorkflowStore((state) => state.setSimulationResult)
  const setIsSimulating = useWorkflowStore((state) => state.setIsSimulating)
  const [visibleCount, setVisibleCount] = useState(0)

  const validationErrors = useMemo(() => validateWorkflow(nodes, edges), [nodes, edges])

  useEffect(() => {
    if (!simulationResult) return
    setVisibleCount(0)
    const timers: number[] = []
    simulationResult.steps.forEach((_, index) => {
      const timer = window.setTimeout(() => setVisibleCount(index + 1), (index + 1) * 200)
      timers.push(timer)
    })
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [simulationResult])

  const runSimulation = async () => {
    if (validationErrors.length > 0 || isSimulating) return
    setIsSimulating(true)
    setSimulationResult(null)
    const result = await simulateWorkflow(nodes, edges)
    setSimulationResult(result)
    setIsSimulating(false)
  }

  const statusMeta: Record<string, { bg: string; color: string; icon: string }> = {
    success: { bg: 'rgba(34,197,94,0.15)', color: '#22C55E', icon: '✓' },
    error: { bg: 'rgba(239,68,68,0.15)', color: '#EF4444', icon: '✕' },
    running: { bg: 'rgba(249,115,22,0.15)', color: '#F97316', icon: '⟳' },
    pending: { bg: 'rgba(148,163,184,0.15)', color: '#94A3B8', icon: '○' },
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 1000,
        display: isOpen ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: '#2A2A3E',
          border: '1px solid #3F3F5A',
          borderRadius: 12,
          width: 560,
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #3F3F5A',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700, color: '#E2E8F0' }}>🧪 Workflow Simulation</div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: 16 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#E2E8F0')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
          >
            ✕
          </button>
        </div>

        <div style={{ overflowY: 'auto', flexGrow: 1, padding: 24 }}>
          {validationErrors.length > 0 ? (
            <div
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 8,
                padding: 16,
              }}
            >
              <div style={{ color: '#EF4444', fontSize: 14, fontWeight: 600 }}>⚠️ Fix these errors before simulating</div>
              <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                {validationErrors.map((error, idx) => (
                  <li key={`${error.message}-${idx}`} style={{ fontSize: 13, color: '#FCA5A5', marginTop: 6 }}>
                    {error.message}
                  </li>
                ))}
              </ul>
            </div>
          ) : isSimulating ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 240 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  border: '3px solid rgba(249,115,22,0.3)',
                  borderTopColor: '#F97316',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <div style={{ marginTop: 16, color: '#94A3B8', fontSize: 14 }}>Running simulation...</div>
            </div>
          ) : simulationResult ? (
            <div>
              <div
                style={{
                  background: simulationResult.success ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  border: simulationResult.success
                    ? '1px solid rgba(34,197,94,0.3)'
                    : '1px solid rgba(239,68,68,0.3)',
                  color: simulationResult.success ? '#22C55E' : '#EF4444',
                  borderRadius: 8,
                  padding: '12px 16px',
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 20,
                }}
              >
                {simulationResult.success ? '✅ Simulation Successful' : '❌ Simulation Failed'}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 12,
                }}
              >
                Execution Steps
              </div>
              {simulationResult.steps.slice(0, visibleCount).map((step: SimulationStep, index) => {
                const meta = statusMeta[step.status]
                return (
                  <div key={`${step.nodeId}-${index}`} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: meta.bg,
                        color: meta.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {meta.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0' }}>{step.label}</div>
                      <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{step.message}</div>
                      <div style={{ fontSize: 11, color: '#3F3F5A', marginTop: 2 }}>
                        {new Date(step.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 240 }}>
              <div style={{ fontSize: 48 }}>🚀</div>
              <div style={{ marginTop: 12, fontSize: 16, fontWeight: 600, color: '#E2E8F0' }}>Ready to simulate</div>
              <div style={{ marginTop: 6, fontSize: 13, color: '#94A3B8' }}>
                Your workflow looks valid. Click Run to begin.
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #3F3F5A',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid #3F3F5A',
              color: '#E2E8F0',
              borderRadius: 6,
              padding: '8px 14px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
          <button
            disabled={validationErrors.length > 0 || isSimulating}
            onClick={runSimulation}
            style={{
              background: validationErrors.length > 0 || isSimulating ? '#6B7280' : '#F97316',
              border: 'none',
              color: '#fff',
              borderRadius: 6,
              padding: '8px 14px',
              cursor: validationErrors.length > 0 || isSimulating ? 'not-allowed' : 'pointer',
            }}
          >
            {isSimulating ? 'Running...' : 'Run Simulation'}
          </button>
        </div>
      </div>
      <style>
        {`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
      </style>
    </div>
  )
}
