import { v4 as uuidv4 } from 'uuid'
import type { KeyValuePair } from '../../types'

type KeyValueEditorProps = {
  pairs: KeyValuePair[]
  onChange: (pairs: KeyValuePair[]) => void
}

export const KeyValueEditor = ({ pairs, onChange }: KeyValueEditorProps) => {
  const updatePair = (id: string, field: 'key' | 'value', value: string) => {
    onChange(pairs.map((pair) => (pair.id === id ? { ...pair, [field]: value } : pair)))
  }

  const removePair = (id: string) => onChange(pairs.filter((pair) => pair.id !== id))
  const addPair = () => onChange([...pairs, { id: uuidv4(), key: '', value: '' }])

  return (
    <div>
      {pairs.map((pair) => (
        <div key={pair.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <input
            style={{
              flex: 1,
              background: '#1E1E2E',
              border: '1px solid #3F3F5A',
              color: '#E2E8F0',
              borderRadius: 6,
              padding: '8px 12px',
              fontSize: 13,
            }}
            placeholder="key"
            value={pair.key}
            onChange={(event) => updatePair(pair.id, 'key', event.target.value)}
          />
          <span style={{ color: '#94A3B8' }}>:</span>
          <input
            style={{
              flex: 1,
              background: '#1E1E2E',
              border: '1px solid #3F3F5A',
              color: '#E2E8F0',
              borderRadius: 6,
              padding: '8px 12px',
              fontSize: 13,
            }}
            placeholder="value"
            value={pair.value}
            onChange={(event) => updatePair(pair.id, 'value', event.target.value)}
          />
          <button
            type="button"
            style={{ color: '#EF4444', background: 'transparent', border: 'none', cursor: 'pointer' }}
            onClick={() => removePair(pair.id)}
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addPair}
        style={{
          background: 'transparent',
          border: '1px dashed #3F3F5A',
          color: '#94A3B8',
          borderRadius: 6,
          padding: '6px 12px',
          fontSize: 12,
          cursor: 'pointer',
          width: '100%',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#F97316'
          e.currentTarget.style.color = '#F97316'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#3F3F5A'
          e.currentTarget.style.color = '#94A3B8'
        }}
      >
        ＋ Add Field
      </button>
    </div>
  )
}
