# OrkaAI — Autonomous AI Execution Layer for Productivity

> **"Tell it the outcome. It handles the work."**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-cyan.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-purple.svg)](https://vitejs.dev/)
[![Google Gemini API](https://img.shields.io/badge/Google%20Gemini-1.5%20Flash-orange.svg)](https://ai.google.dev/)
[![Express.js](https://img.shields.io/badge/Express-4.21-green.svg)](https://expressjs.com/)

OrkaAI is an autonomous **AI execution layer** designed to transform natural language outcomes into structured, auditable, and verified work execution across productivity tools (Gmail, Google Calendar, Google Drive).

OrkaAI features **two unified interfaces** powered by the exact same backend engine, Gemini AI model, and policy engine:
1. 🌐 **Web UI Workspace** (`http://localhost:5173`)
2. 💻 **Terminal CLI Agent** (`orka`)

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
- **💻 Terminal-Native CLI (`orka`):** Full-featured terminal interface sharing the backend API, interactive approval gate, live step rendering, and execution receipts.
- **❓ "Why Orka Did This" Explanations:** Hover tooltips (Web) and line annotations (CLI) explain *why* the AI selected a specific tool.
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
                    ORKA CORE
                       │
             ┌─────────┴─────────┐
             ↓                   ↓
          WEB APP              CLI
             ↓                   ↓
          Backend API      Backend API
             │                   │
             └─────────┬─────────┘
                       ↓
                  ORKA AGENT
                       ↓
                    GEMINI
                       ↓
              TOOL REGISTRY
              /     |      \
          Gmail  Calendar  Drive
```

---

## 💻 Orka Terminal CLI (`orka`)

OrkaAI includes a standalone terminal CLI binary powered by `commander`, `inquirer`, `chalk`, and `cli-table3`.

### CLI Installation & Symlink

```bash
# Link the CLI binary globally to use the 'orka' command anywhere:
npm link

# Alternatively, run via npm:
npm run cli -- "prepare me for my Acme meeting tomorrow"
```

### CLI Commands Reference

| Command | Description |
| :--- | :--- |
| `orka "<goal>"` | Execute natural language outcome goal directly in terminal |
| `orka` | Launch interactive terminal shell |
| `orka demo` | Run centerpiece Acme meeting scenario in Demo Mode |
| `orka auth login` | Check Google Workspace OAuth connection status |
| `orka status` | Display system status, Gemini model, and active accounts |
| `orka activity` | View recent auditable workflow executions and receipts |
| `orka automations` | View active automation rules and AI discovered patterns |
| `orka config mode [copilot\|autopilot]` | View or update Orka policy operating mode |
| `orka --help` | Display CLI help menu |

### CLI Approval Gate & Draft Editing
When executing high-risk write actions (`send_email`) in Copilot mode, the CLI pauses and prompts:

```text
⚠ APPROVAL REQUIRED
────────────────────────────────────────────────────────────
Action:  Send Email
To:      rahul.sharma@acmecorp.com
Subject: Acme Integration Sync - Pre-Meeting Alignment & Docs
Why:     Orka Policy Engine: Transmitting external email communication requires human sign-off.
────────────────────────────────────────────────────────────

Select action for this sensitive operation:
❯ ✓  [a] Approve & Send Email
  ✏️   [e] Edit Email Draft
  ✕  [r] Reject Action
```

Selecting `[e] Edit Email Draft` allows interactive inline editing of recipient, subject line, and body before approval.

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

# Run TypeScript type check (0 errors across Web & CLI)
npm run typecheck

# Build web production bundle
npm run build

# Start backend server & frontend client concurrently
npm run dev

# Start Orka CLI in natural language mode
npm run cli -- "prepare me for my Acme meeting tomorrow"

# Start Orka CLI in interactive shell mode
npm run cli
```

- **Frontend Application:** `http://localhost:5173`
- **Backend API Server:** `http://localhost:3001`
- **API Health Check:** `http://localhost:3001/api/health`

---

## 🎬 90-Second Hackathon Demo Scenario

### Web Demo:
1. Open `http://localhost:5173`.
2. Click **"Launch Acme Demo"** or enter `"Prepare me for my Acme meeting tomorrow."`
3. Watch the text transform into the **DAG Execution Graph**.
4. On the Approval Modal, edit draft fields if desired and click **Approve & Send Email**.
5. Review the **"YOU'RE READY."** outcome package and click **"View Execution Receipt"**.

### CLI Demo:
```bash
npm run cli -- demo
```

---

## 📄 License

Distributed under the [MIT License](LICENSE).

---

## 👤 Author

Developed for the Productivity Track Hackathon.  
**OrkaAI Engine** — *"Tell it the outcome. It handles the work."*
