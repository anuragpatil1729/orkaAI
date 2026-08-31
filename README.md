# OrkaAI — Autonomous AI Execution Layer for Productivity

> **"Tell it the outcome. It handles the work."**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-cyan.svg)](https://react.dev/)
[![Flutter](https://img.shields.io/badge/Flutter-3.44-blue.svg)](https://flutter.dev/)
[![Google Gemini API](https://img.shields.io/badge/Google%20Gemini-1.5%20Flash-orange.svg)](https://ai.google.dev/)
[![Express.js](https://img.shields.io/badge/Express-4.21-green.svg)](https://expressjs.com/)

OrkaAI is an autonomous **AI execution layer** designed to transform natural language outcomes into structured, auditable, and verified work execution across productivity tools (Gmail, Google Calendar, Google Drive).

OrkaAI features **three unified native clients** powered by the exact same backend engine, Gemini AI model, tool registry, and policy engine:
1. 🌐 **Web UI Workspace** (`http://localhost:5173`)
2. 📱 **Flutter Android Mobile App** (`mobile/`)
3. 💻 **Terminal CLI Agent** (`orka`)

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
- **📱 Native Flutter Mobile Application (`mobile/`):** Material 3 Android app with voice speech recognition (`speech_to_text`), vertical step execution timeline, native approval bottom sheet, and outcome receipt dialog.
- **📊 Live Execution DAG Graph:** Visualizes real-time tool orchestration steps with node states (`○ Pending`, `◉ Running`, `✓ Completed & Verified`, `⚠ Approval Required`, `✕ Failed`).
- **🛡️ Deterministic Action Policy Engine:** Security rules are enforced strictly by backend policy code, **not** LLM recommendations. High-risk write actions (`send_email`) strictly require human approval in Copilot mode.
- **💻 Terminal-Native CLI (`orka`):** Full-featured terminal interface sharing the backend API, interactive approval gate, live step rendering, and execution receipts.
- **❓ "Why Orka Did This" Explanations:** Explains tool selection rationale across Web, CLI, and Mobile interfaces.
- **🧾 Orka Execution Receipt:** Generates an auditable execution receipt detailing total actions executed, API-verified actions, granted approvals, audited items, and execution duration in seconds.
- **🔐 Google Workspace OAuth 2.0:** Integrates with real Gmail, Calendar, and Drive scopes (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`).
- **🎭 Dual Engine (Real vs Demo Mode):** Includes an embedded Acme Corp dataset (14 emails, 3 docs, meeting invite) enabling a rock-solid, 100% reliable 90-second demo out-of-the-box.
- **✍️ Editable Email Drafts:** Live editing for Recipient, Subject, and Body text inside both the Approval Modal and the final *"YOU'RE READY."* screen.

---

## 🏗️ Architecture Overview

```
                    ORKA CORE
                        │
                 Node.js Backend
                        │
          ┌─────────────┼─────────────┐
          ↓             ↓             ↓
        WEB          FLUTTER          CLI
          │             │             │
          └─────────────┼─────────────┘
                        ↓
                  ORKA AGENT
                        ↓
                     GEMINI
                        ↓
                 TOOL REGISTRY
                 /      |      \
             Gmail   Calendar   Drive
```

---

## 📱 Flutter Mobile Application (`mobile/`)

Built using Flutter, Dart, and Material 3 design principles (`mobile/`).

### App Architecture
- `mobile/lib/api/orka_api_client.dart`: Communicates with Express backend (automatically resolving `http://10.0.2.2:3001` for Android emulator and `http://localhost:3001` for desktop/web).
- `mobile/lib/providers/workflow_provider.dart`: `ChangeNotifier` managing goal execution, voice listener, step advancement polling, and step approvals.
- `mobile/lib/screens/`: `HomeScreen` (voice + text input), `ExecutionScreen` (vertical timeline), `ResultScreen` (**YOU'RE READY.**), `ActivityScreen`, `AutomationsScreen`, `SettingsScreen`.
- `mobile/lib/widgets/`: `ApprovalBottomSheet` (interactive approval gate with inline draft editor), `ExecutionReceiptDialog` (auditable receipt).

### Mobile Commands

```bash
# Navigate to mobile directory:
cd mobile

# Fetch dependencies:
flutter pub get

# Run Dart static analysis (0 errors):
flutter analyze

# Run unit & widget tests:
flutter test

# Run application on emulator / connected device:
flutter run

# Build Android APK binary:
flutter build apk
```

---

## 💻 Orka Terminal CLI (`orka`)

OrkaAI includes a standalone terminal CLI binary powered by `commander`, `inquirer`, `chalk`, and `cli-table3`.

```bash
# Link binary globally:
npm link

# Run natural language goal:
orka "prepare me for my Acme meeting tomorrow"

# Run interactive shell:
orka

# Run status check:
orka status
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

### Server & Web Application

```bash
# Install node dependencies
npm install

# Run TypeScript type check (0 errors across Web & CLI)
npm run typecheck

# Build web production bundle
npm run build

# Start backend server & frontend client concurrently
npm run dev
```

- **Frontend Application:** `http://localhost:5173`
- **Backend API Server:** `http://localhost:3001`

---

## 🎬 90-Second Hackathon Demo Scenario

### 🌐 Web Demo:
1. Open `http://localhost:5173`.
2. Click **"Launch Acme Demo"** or enter `"Prepare me for my Acme meeting tomorrow."`
3. Watch the text transform into the **DAG Execution Graph**.
4. Review the policy warning on the Approval Modal and click **Approve & Send Email**.
5. Review the **"YOU'RE READY."** outcome package and click **"View Execution Receipt"**.

### 📱 Mobile Demo:
1. Open Orka Android App.
2. Tap microphone icon or type `"Prepare me for my Acme meeting tomorrow."`
3. Watch vertical step timeline advance (`Calendar → Gmail → Drive → Brief → Tasks → Draft`).
4. Native approval bottom sheet pops up for `Send Email` — click **Approve & Send**.
5. View **"YOU'RE READY."** screen and tap **"View Execution Receipt"**.

### 💻 CLI Demo:
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
