<div align="center"> 
 
# OLLAMA Vision Stream 
 
An advanced real-time local multimodal inference platform connecting your browser webcam directly to local AI engines via Ollama. 
 
Report Bug · Request Feature 
 
!License 
!HTML5/JS 
!Ollama 
!Theme 
 
</div> 
 
--- 
 
## Overview 
 
OLLAMA Vision Stream enables seamless, real-time multimodal interaction right from your browser. By leveraging local vision models, it streams webcam feeds to analyze scenes on the fly, extract text, check individuals, describe environments, and capture snapshots—all running completely locally with zero cloud dependencies. 
 
--- 
 
## Interface Preview 
 
<div align="center"> 
 
!OLLAMA Vision Stream Interface 
 
*Real-time webcam inference and live chat telemetry panel* 
 
</div> 
 
--- 
 
## Key Features 
 
* Real-Time Vision Streaming: Continuous or manual snapshot analysis of your browser webcam feed via local multimodal models. 
* Ollama Local Engine Integration: Direct connection to your local backend (`http://localhost:11434`) for private, offline AI inference. 
* Dynamic Capture Settings: Customizable capture frequencies (e.g., Balanced intervals), token limits, and temperature controls. 
* Video Filter Modes: Apply real-time visual filters or enable an ROI (Region of Interest) crop box for targeted analysis. 
* Text-to-Speech (TTS) Support: Optional audio readouts for model responses. 
* Interactive Prompt Console: Quick presets for describing scenes, listing objects, checking people, or reading text. 
* Voice-to-Text (Speech Recognition): Integrated microphone toggle button next to the prompt area for hands-free speech input. 
* Multi-Turn Visual Memory: Maintains conversation history so the model remembers previous messages and context throughout the stream. 
* Performance & Latency Metrics Tracker: Live round-trip latency tracking in milliseconds and estimated throughput displayed directly on the UI. 
* Preset Modes & Custom System Prompts: Instant persona switching dropdowns (e.g., Security Guard, Electronics Debugger, Descriptive Aid). 
* Snapshot Annotation & Markup Tool: Interactive drawing canvas inside the modal preview screen to mark up images with pens or boxes before downloading. 
 
--- 
 
## Tech Stack 
 
* Frontend: HTML, CSS, JavaScript, Live Server 
* AI Engine: Ollama (`llava`) 
* Styling & UI: Custom Cyberpunk Dark CSS Theme, Responsive Flexbox/Grid Layouts 
 
--- 
 
## Getting Started & Installation 
 
Follow these steps to set up and run OLLAMA Vision Stream locally on your machine. 
 
### Prerequisites 
Make sure you have Ollama installed on your operating system. 
 
### 1. Install and Run the Vision Model 
Open your terminal and pull/run the multimodal llava model: 
bash 
ollama run llava  
(This will download and start the model locally on the default Ollama port 11434) 
 
### 2. Setup the Project Files 
Ensure your project directory includes your index.html file and application assets structure. 
 
### 3. Launch via Live Server 
1. Open your project folder in VS Code. 
 
2. Make sure you have the Live Server extension installed. 
 
3. Click "Go Live" at the bottom status bar of VS Code, or open the project via Live Server on: 
http://localhost:5500 
 
--- 
 
If you found this project interesting, consider giving it a star! 
 
Crafted with ⚡ by mhdhamka