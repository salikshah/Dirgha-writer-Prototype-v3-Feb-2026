# Writer

**Writer** is an AI-native scientific writing environment designed to bridge the gap between traditional text editors and advanced AI research assistants. It seamlessly integrates reference management, generative AI, and real-time voice collaboration into a distraction-free interface.

## ✨ Features

### 📝 Core Editing
- **Distraction-Free Writing**: Clean, serif-font typography optimized for long-form academic work.
- **Zen Mode**: One-click toggle to collapse sidebars and focus purely on the text.
- **Smart Outline**: Auto-generated table of contents that tracks your reading position.
- **Rich Formatting**: Support for academic structures, headers, and standard formatting tools.

### 🤖 AI-Powered Workflows
- **Contextual Rewrite**: Highlight paragraphs to get AI suggestions for "Academic Tone", "Shortening", or "Expanding".
- **Ghost Text**: Intelligent inline text completion—just press Tab to accept.
- **Diff View**: Review AI changes with a clear tracked-changes interface before accepting.
- **Gemini Assistant**: A dedicated sidebar for chatting with your document context.

### 🎙️ Real-time Voice Collaboration
- **Gemini Live Integration**: Have natural, low-latency voice conversations with your AI research partner.
- **Hands-free Brainstorming**: Discuss ideas while the AI maintains context of your document.

### 📚 Reference Management
- **Integrated Library**: Manage sources directly within the editor.
- **Smart Citations**: Hover over citations (e.g., *(Smith et al., 2023)*) to see full metadata, abstracts, and impact factors without losing your place.
- **Search & Filter**: Quickly find references by author, title, or year.

### 🌓 Personalization
- **Dark Mode**: Fully supported dark theme for late-night research sessions.
- **Responsive Design**: optimized for desktop and mobile workflows.

## 🛠️ Technical Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **AI Engine**: Google Gemini API (`@google/genai` SDK)
- **Voice**: Web Audio API for PCM streaming (Gemini Live)
- **Icons**: Lucide React
- **Typography**: Inter (UI) and Merriweather (Content)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/writer.git
   cd writer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   Create a `.env` file in the root directory and add your key:
   ```env
   API_KEY=your_google_genai_api_key
   ```
   *Note: Ensure your API key has access to `gemini-3-flash-preview` and `gemini-2.5-flash-native-audio-preview` models.*

4. **Run the development server**
   ```bash
   npm start
   ```

## 📖 Usage Guide

1. **Library**: Click the **Book icon** (top-left) to open your reference library. Toggle sources to include them in the AI's context.
2. **Writing**: Type in the center canvas. Use the **Sparkles icon** next to paragraphs to trigger AI rewrites.
3. **Chat**: Click the **Message icon** (top-right) to open the Assistant. Use text or click the **Microphone** for voice mode.
4. **Citing**: Hover over citations to view details. Use the floating toolbar (bottom) to insert new citations.

## 📄 License

This project is licensed under the MIT License.