# OrkaAI — Autonomous AI Execution Layer for Productivity

> **"Tell it the outcome. It handles the work."**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-cyan.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-purple.svg)](https://vitejs.dev/)
[![Google Gemini API](https://img.shields.io/badge/Google%20Gemini-1.5%20Flash-orange.svg)](https://ai.google.dev/)
[![Express.js](https://img.shields.io/badge/Express-4.21-green.svg)](https://expressjs.com/)

OrkaAI is an autonomous **AI execution layer** designed to transform natural language outcomes into structured, auditable, and verified work execution across productivity tools (Gmail, Google Calendar, Google Drive).

Unlike standard chatbots that provide static text responses, OrkaAI parses user intent, constructs a live Directed Acyclic Graph (DAG) execution plan, interacts with real workspace APIs, enforces human-in-the-loop policy guardrails for high-risk actions, and produces an auditable **Execution Receipt**.

---

## 🚀 Core Paradigm Shift

```
TRADITIONAL CHATBOT:  User → Question → Text Answer
TRADITIONAL AUTOMATION: IF X THEN Y (Static Rigid Scripts)

ORKAAI AGENT ENGINE:   USER GOAL → INTENT → DYNAMIC PLAN → TOOL EXECUTION → APPROVAL → VERIFICATION → OUTCOME RECEIPT
```

---

## ✨ Key Features

- **🧠 Google Gemini API Brain:** Uses official `@google/generative-ai` SDK for dynamic goal decomposition, intent parsing, contextual reasoning, executive brief synthesis, and email drafting.
- **📊 Live Execution DAG Graph:** Visualizes real-time tool orchestration steps with node states (`○ Pending`, `◉ Running`, `✓ Completed & Verified`, `⚠ Approval Required`, `✕ Failed`).
- **🛡️ Deterministic Action Policy Engine:** Security rules are enforced strictly by backend policy code, **not** LLM recommendations. High-risk write actions (`send_email`) strictly require human approval in Copilot mode.
- **❓ "Why Orka Did This" Explanations:** Hover tooltips on every DAG node explain *why* the AI selected a specific tool.
- **🧾 Orka Execution Receipt:** Generates an auditable execution receipt detailing total actions executed, API-verified actions, granted approvals, audited items, and execution duration in seconds.
- **🔐 Google Workspace OAuth 2.0:** Integrates with real Gmail, Calendar, and Drive scopes (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`).
- **🎭 Dual Engine (Real vs Demo Mode):** Includes an embedded Acme Corp dataset (14 emails, 3 docs, meeting invite) enabling a rock-solid, 100% reliable 90-second demo out-of-the-box.
- **✍️ Editable Email Drafts:** Live editing for Recipient, Subject, and Body text inside both the Approval Modal and the final *"YOU'RE READY."* screen.
- **⚡ Autopilot vs Copilot Modes:**
  - **Copilot:** Pauses before sensitive actions for explicit human verification.
  - **Autopilot:** Automatically executes safe routines based on user rules.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend Client (Vite + React)              │
│   - Command Control Center ("What outcome should I handle?")     │
│   - Live DAG Execution Graph & Step Timeline                     │
│   - High-Risk Approval Gate Modal (With Inline Draft Editor)     │
│   - "YOU'RE READY." Result Screen & Execution Receipt Modal     │
└────────────────────────────────┌────────────────────────────────┘
                                 │ HTTP / REST API
┌────────────────────────────────▼────────────────────────────────┐
│                   Express Backend API Server                    │
│   - Agent Pipeline: IntentParser → Planner → Executor           │
│   - ActionPolicyEngine (Deterministic Risk & Permission Gates)   │
│   - Strict Allowlisted Tool Registry                            │
│   - Google OAuth 2.0 Client & Fallback Demo Store               │
└───────────────────┬─────────────────────────┬───────────────────┘
                    │                         │
┌───────────────────▼───────────┐ ┌───────────▼───────────────────┐
│   Google Gemini API Provider  │ │ Google Workspace APIs         │
│   (Intent, Briefs, Drafts)    │ │ (Gmail, Calendar, Drive)      │
└───────────────────────────────┘ └───────────────────────────────┘
```

---

## 🛠️ Tool Registry & Risk Levels

| Tool ID | Category | Risk Level | Description | Permission |
| :--- | :--- | :--- | :--- | :--- |
| `find_calendar_event` | Calendar | `READ` | Search upcoming meetings & attendees | Auto-Execute |
| `search_emails` | Gmail | `READ` | Search inbox threads & conversation history | Auto-Execute |
| `get_email_thread` | Gmail | `READ` | Fetch full body text of specific email thread | Auto-Execute |
| `search_drive` | Drive | `READ` | Search specs, PDFs, and term sheets | Auto-Execute |
| `get_drive_document` | Drive | `READ` | Extract text content from Drive document | Auto-Execute |
| `analyze_context` | AI Engine | `READ` | Cross-reference emails & documents for commitments | Auto-Execute |
| `generate_brief` | AI Engine | `LOW_RISK_WRITE` | Synthesize executive briefing package | Auto-Execute |
| `create_task` | Tasks | `LOW_RISK_WRITE` | Queue action items into user task list | Auto-Execute |
| `create_draft_email` | Gmail | `LOW_RISK_WRITE` | Prepare pre-meeting alignment email draft | Auto-Execute |
| `send_email` | Gmail | `HIGH_RISK_WRITE` | Transmit email to client contacts | **Approval Required** |

---

## 📦 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher (Tested on Node v24.13.1)
- **npm**: `v9.0.0` or higher

### Environment Configuration

Create a `.env` file in the root directory (or copy `.env.example`):

```bash
cp .env.example .env
```

Set your configuration:

```env
# Gemini API Key (Primary LLM Engine)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# Google OAuth Credentials (For Real Workspace Mode)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback

# Server Config
PORT=3001
NODE_ENV=development
```

> **Note:** If `GEMINI_API_KEY` or Google OAuth credentials are not provided, OrkaAI automatically runs in **Demo Mode**, utilizing the built-in Acme Corp dataset.

---

## 🏃 Commands

```bash
# Install all dependencies
npm install

# Run TypeScript type check (0 errors)
npm run typecheck

# Build for production
npm run build

# Start backend server & frontend client concurrently in development mode
npm run dev

# Start backend API server only
npm run dev:server

# Start frontend client only
npm run dev:client
```

- **Frontend Application:** `http://localhost:5173`
- **Backend API Server:** `http://localhost:3001`
- **API Health Check:** `http://localhost:3001/api/health`

---

## 🎬 90-Second Hackathon Demo Scenario

1. **Launch App:** Open `http://localhost:5173`.
2. **Submit Outcome Goal:** Click **"Launch Acme Demo"** or enter:
   ```text
   Prepare me for my Acme meeting tomorrow.
   ```
3. **Observe Agent Execution:**
   - Watch the text transform into the **DAG Execution Graph**.
   - See steps execute in real time (`Calendar → Gmail → Drive → Analysis → Brief → Tasks → Draft`).
   - Hover over nodes to inspect **"Why Orka Did This"**.
4. **Human-in-the-Loop Approval:**
   - When the **Approval Modal** pops up for `Send Email`, review the policy warning and recipient details.
   - Edit the recipient, subject, or body text if desired.
   - Click **Approve & Send Email**.
5. **Verified Outcome:**
   - Transition to the **"YOU'RE READY."** screen.
   - Review Executive Summary, Key Decisions, Open Commitments, Created Tasks, Relevant Email/Document Cards, and Follow-Up Draft.
   - Click **"View Execution Receipt"** to open the official audit trail modal.

---

## 📄 License

Distributed under the [MIT License](LICENSE).

---

## 👤 Author

Developed for the Productivity Track Hackathon.  
**OrkaAI Engine** — *"Tell it the outcome. It handles the work."*
