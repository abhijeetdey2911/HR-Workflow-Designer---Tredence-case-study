# HR Workflow Designer
### Case Study Submission — Tredence Studio AI Engineering Internship

> A visual, drag-and-drop HR workflow builder built with React, TypeScript, and React Flow. Designed to let HR admins create, configure, and simulate internal workflows such as onboarding, leave approval, and document verification.

---

## 🚀 Live Demo

> Run locally using the instructions below.

---

## 📸 Screenshots

| Canvas | Simulation Panel |
|--------|-----------------|
| Drag-and-drop workflow builder with 5 node types | Step-by-step execution log with validation |

---

## ⚙️ How to Run

```bash
# 1. Clone the repository
git clone https://github.com/abhijeetdey2911/HR-Workflow-Designer---Tredence-case-study.git
cd hr-workflow-designer

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
http://localhost:5173
```

**Requirements:** Node.js 18+ and npm 9+

---

## 🧱 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | React 18 + TypeScript | Type safety, component model |
| Build Tool | Vite | Fast HMR, modern ESM |
| Canvas | @xyflow/react (React Flow v12) | Industry-standard flow diagram library |
| State | Zustand | Simple, scalable, no boilerplate |
| Styling | Tailwind CSS v4 + inline styles | Utility-first, dark theme |
| IDs | uuid v4 | Collision-free node identifiers |

---

## 🗂️ Project Architecture

```
src/
├── api/
│   └── mockApi.ts          # GET /automations, POST /simulate (mock with delays)
├── components/
│   ├── nodes/
│   │   ├── StartNode.tsx    # Green — workflow entry, source handle only
│   │   ├── TaskNode.tsx     # Blue — human task with assignee/due date
│   │   ├── ApprovalNode.tsx # Yellow — approval with role + threshold
│   │   ├── AutomatedNode.tsx# Purple — system action from API
│   │   ├── EndNode.tsx      # Red — workflow completion, target only
│   │   └── index.ts         # nodeTypes registry for React Flow
│   ├── panels/
│   │   ├── Sidebar.tsx      # Draggable node palette + workflow controls
│   │   ├── ConfigPanel.tsx  # Dynamic forms for selected node
│   │   └── SimulationPanel.tsx # Modal with step-by-step execution log
│   └── ui/
│       ├── Button.tsx       # Reusable button (primary/secondary/danger/ghost)
│       ├── Input.tsx        # Labeled input with dark theme
│       ├── Toggle.tsx       # Boolean pill toggle switch
│       └── KeyValueEditor.tsx # Dynamic key-value pair editor
├── hooks/
│   └── useWorkflowValidation.ts # Runs validation on every state change
├── store/
│   └── workflowStore.ts    # Zustand store — single source of truth
├── types/
│   └── index.ts            # All TypeScript interfaces and types
└── utils/
    └── graphUtils.ts       # Topological sort, cycle detection, validation
```

---

## 🎨 Design Decisions

### 1. Zustand over Context/Redux
Zustand was chosen for its minimal API and zero boilerplate. With React Context, passing canvas state (nodes, edges, selectedNodeId, simulationResult) through the component tree would require multiple providers or prop drilling. Zustand gives us a single `useWorkflowStore` hook accessible anywhere — including inside node components — without any wrapping.

### 2. Inline Styles for Node Components
Node components use inline styles instead of Tailwind classes. This is intentional — React Flow passes `selected` as a prop, and conditional styles based on runtime props are cleaner with inline objects than with Tailwind's arbitrary value syntax. This also makes the visual feedback (orange glow on selection) straightforward to implement.

### 3. Separation of Canvas Logic, Node Logic, and API Logic
- `App.tsx` / `FlowCanvas` — handles React Flow lifecycle (onDrop, onConnect, onNodeClick)
- `components/nodes/` — purely presentational, reads from store for selection state
- `store/workflowStore.ts` — all state mutations
- `api/mockApi.ts` — isolated data layer, easily replaceable with real API calls
- `utils/graphUtils.ts` — pure functions for graph algorithms (no React dependencies)

This separation means any layer can be swapped independently.

### 4. Topological Sort for Simulation
The simulation traverses nodes in topological order using Kahn's algorithm (BFS-based). This ensures nodes are "executed" in the correct dependency order — a task cannot run before its predecessor. The algorithm also detects cycles, which are flagged as validation errors.

### 5. Dynamic Forms without a Form Library
Rather than adding React Hook Form or Formik, forms are built with controlled components and `updateNodeData` from the store. Each `onChange` directly updates the store, giving live node label updates as you type. This demonstrates understanding of controlled components and state flow without adding dependencies.

---

## ✅ Features Implemented

### Core
- [x] Drag-and-drop workflow canvas (React Flow)
- [x] 5 custom node types: Start, Task, Approval, Automated, End
- [x] Drag nodes from sidebar onto canvas
- [x] Connect nodes with animated edges
- [x] Delete nodes and edges
- [x] Node selection with orange highlight glow

### Node Configuration
- [x] Start Node — title + dynamic metadata key-value pairs
- [x] Task Node — title, description, assignee, due date, custom fields
- [x] Approval Node — title, approver role (dropdown), auto-approve threshold
- [x] Automated Node — title, action picker (from mock API), dynamic param inputs
- [x] End Node — end message + show summary toggle

### Mock API Layer
- [x] `GET /automations` — returns 5 automation actions with param definitions
- [x] `POST /simulate` — accepts workflow JSON, returns step-by-step execution log
- [x] Artificial network delays (300ms / 1500ms) to simulate real API behavior

### Workflow Validation
- [x] Must have exactly one Start node
- [x] Must have exactly one End node
- [x] All nodes must be connected (no orphaned nodes)
- [x] Start node must have no incoming edges
- [x] End node must have no outgoing edges
- [x] Cycle detection using DFS
- [x] Validation errors shown in sidebar + simulation modal

### Simulation Panel
- [x] Validates workflow before running
- [x] Shows errors as a list if workflow is invalid
- [x] Loading state while simulation runs
- [x] Step-by-step execution timeline with status icons
- [x] Success/failure result banner

### UI/UX
- [x] Dark theme throughout (#1E1E2E background)
- [x] MiniMap with color-coded nodes
- [x] Canvas controls (zoom in/out, fit view, lock)
- [x] Validation error count in navbar and sidebar
- [x] Clear canvas button (resets to initial Start + End state)
- [x] Responsive panels (sidebar 220px, config panel 300px)

---

## 🔧 What I Would Add With More Time

### Features
- **Export/Import JSON** — serialize workflow to file and reload it
- **Undo/Redo** — using a history stack in the Zustand store
- **Auto-layout** — using dagre or elkjs to auto-arrange nodes
- **Node templates** — save frequently used node configurations
- **Workflow version history** — track changes with timestamps
- **Visual validation errors on nodes** — red border on invalid nodes directly

### Technical Improvements
- **Backend persistence** — replace mock API with FastAPI + PostgreSQL
- **Real authentication** — OAuth/OIDC with Azure AD
- **E2E tests** — Cypress/Playwright for drag-drop and simulation flows
- **Unit tests** — Jest + React Testing Library for graphUtils and store
- **Storybook** — isolated component development for the node library
- **WebSocket simulation** — stream simulation steps in real-time instead of batch

### Architecture
- **Micro-frontend ready** — the node registry pattern (`nodeTypes` object) already supports adding new node types without modifying existing code
- **Plugin system** — node types could be loaded dynamically from a config file
- **Monorepo** — split into `@hr-workflow/canvas`, `@hr-workflow/api`, `@hr-workflow/types` packages

---

## 🧪 Running Validation Manually

To test the validation system:
1. Open the app — you'll see 2 validation errors (Start and End are not connected)
2. Connect Start → End by dragging from the orange handle
3. Errors drop to 0 and the navbar shows "✓ Valid"
4. Click "Test Workflow" → "Run Simulation" to see the execution log

---

## 📐 Component Extensibility

Adding a new node type takes exactly 4 steps:
```
1. Add type to NodeType union in src/types/index.ts
2. Add data interface (e.g., DecisionNodeData) in src/types/index.ts  
3. Create DecisionNode.tsx in src/components/nodes/
4. Add to nodeTypes registry in src/components/nodes/index.ts
5. Add form case in ConfigPanel.tsx switch statement
```
No other files need to change. This demonstrates the open/closed principle.

---

## 👤 Author

**[Your Name]**  
[GitHub](https://github.com/YOUR_USERNAME) • [LinkedIn](https://linkedin.com/in/YOUR_USERNAME)

---

*Built as part of the Tredence Studio AI Engineering Internship — 2025 Cohort case study.*
