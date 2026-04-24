type ToggleProps = {
  label?: string
  checked: boolean
  onChange: (val: boolean) => void
}

export const Toggle = ({ checked, onChange, label }: ToggleProps) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        background: checked ? '#F97316' : '#3F3F5A',
        transition: 'background 0.2s',
        cursor: 'pointer',
        position: 'relative',
        border: 'none',
      }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: '#fff',
          position: 'absolute',
          top: 2,
          left: checked ? 18 : 2,
          transition: 'left 0.2s',
        }}
      />
    </button>
    {label ? <span style={{ color: '#E2E8F0', fontSize: 13 }}>{label}</span> : null}
  </div>
)
