<div align="center">

# OLLAMA Vision Stream

**A real-time local multimodal vision platform that connects your browser webcam directly to local AI vision models through Ollama.**

Analyze live camera feeds, ask questions about what the camera sees, extract text, identify objects, inspect environments, and interact with your local AI—all without sending your camera data to a cloud AI service.

[Report Bug](https://github.com) · [Request Feature](https://github.com)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Frontend](https://img.shields.io/badge/Frontend-HTML5%20%2F%20CSS%2F%20JS-F7DF1E?logo=javascript\&logoColor=black)
![Ollama](https://img.shields.io/badge/AI-Ollama-black)
![Vision Model](https://img.shields.io/badge/Model-LLaVA-orange)
![UI](https://img.shields.io/badge/UI-Cyberpunk%20Dark-c95bf5)

</div>

---

## Overview

**OLLAMA Vision Stream** is a browser-based local AI vision application built around **Ollama** and multimodal vision models.

The application captures frames directly from your webcam and sends them to a locally running vision model for analysis. Instead of relying on cloud-based computer vision APIs, inference happens on your own machine through Ollama.

The result is a private, interactive vision workspace where you can:

* Analyze live webcam footage
* Ask questions about visible objects and environments
* Extract and read text from camera frames
* Inspect people and scenes
* Maintain visual conversation context
* Capture and annotate snapshots
* Monitor inference latency and performance
* Interact with the model using voice

> **Local-first AI. Your camera feed stays on your machine.**

---

## Interface Preview

<div align="center">

![OLLAMA Vision Stream Interface](./Images/vision-stream.png)

*Real-time webcam inference with multimodal AI analysis, prompt controls, telemetry, and snapshot tools.*

</div>

---

## Features

### 👁️ Real-Time Vision Analysis

Stream frames from your browser webcam to a local multimodal AI model and receive visual analysis in real time.

* Continuous vision streaming
* Manual snapshot analysis
* Adjustable capture intervals
* Scene understanding
* Object identification
* Environment descriptions
* Person analysis
* OCR / text extraction

### 🧠 Local Ollama Inference

Connect directly to your locally running Ollama instance.

```text
Browser
   │
   │ Webcam Frame
   ▼
OLLAMA Vision Stream
   │
   │ HTTP Request
   ▼
Ollama
   │
   ▼
Local Vision Model
   │
   │ Analysis
   ▼
Browser Interface
```

No external AI API is required.

### 🎛️ Dynamic Capture Controls

Fine-tune how visual data is processed.

* Capture frequency
* Token limits
* Temperature
* Manual / automatic capture
* Processing intervals
* Model configuration

### 🎨 Visual Processing

Customize the camera feed before sending frames to the model.

* Real-time visual filters
* Region of Interest (ROI) mode
* Targeted image cropping
* Snapshot previews

### 💬 Interactive Prompt Console

Use predefined prompts or write your own instructions.

Example presets include:

* Describe Scene
* Detect Objects
* Read Text
* Check Person
* Analyze Environment
* Custom Prompt

### 🎙️ Voice Interaction

Interact with the system without typing.

* Speech-to-text input
* Microphone toggle
* Voice-driven prompts
* Text-to-speech model responses

### 🧠 Multi-Turn Visual Memory

Maintain conversational context across multiple visual interactions.

The model can use previous prompts and responses to provide more contextual analysis throughout an investigation session.

### 📊 Performance Telemetry

Monitor inference performance directly from the interface.

* Round-trip latency
* Response time
* Estimated throughput
* Request status
* Live processing telemetry

### 🎭 Custom AI Personas

Switch between predefined system prompts for different use cases.

Example personas:

* Security Guard
* Electronics Debugger
* Descriptive Assistant
* General Vision Assistant

You can also define your own system prompt and create specialized vision workflows.

### ✏️ Snapshot Annotation

Capture a frame and annotate it before saving.

The annotation interface supports:

* Freehand drawing
* Pen tools
* Bounding boxes
* Visual markup
* Snapshot preview
* Image download

This is useful for highlighting objects, regions, components, or areas that require further inspection.

---

## Architecture

OLLAMA Vision Stream follows a simple local-first architecture:

```text
┌───────────────────────────────┐
│        Browser Client         │
│                               │
│  ┌─────────┐   ┌───────────┐  │
│  │ Webcam  │──▶│ Vision UI │  │
│  └─────────┘   └─────┬─────┘  │
│                      │        │
│              Captured Frame   │
└──────────────────────┼────────┘
                       │
                       ▼
              ┌────────────────┐
              │     Ollama      │
              │ localhost:11434 │
              └───────┬────────┘
                      │
                      ▼
              ┌────────────────┐
              │  Vision Model  │
              │     LLaVA      │
              └───────┬────────┘
                      │
                      ▼
              ┌────────────────┐
              │ AI Vision Text │
              │    Response    │
              └───────┬────────┘
                      │
                      ▼
              Browser Interface
```

All model inference is performed locally through Ollama.

---

## Tech Stack

| Layer              | Technology                      |
| ------------------ | ------------------------------- |
| Frontend           | HTML5, CSS3, Vanilla JavaScript |
| Local AI Runtime   | Ollama                          |
| Vision Model       | LLaVA                           |
| Camera API         | Browser MediaDevices / WebRTC   |
| Speech Input       | Web Speech API                  |
| Speech Output      | Browser Speech Synthesis API    |
| Development Server | VS Code Live Server             |
| UI                 | Custom Cyberpunk Dark Theme     |
| Layout             | CSS Flexbox / Grid              |

---

## Requirements

Before running the application, make sure you have:

* A modern Chromium-based browser or compatible browser
* A working webcam
* A microphone for voice input
* [Ollama](https://ollama.com/) installed
* A compatible multimodal vision model
* VS Code with Live Server, or another local HTTP server

---

## Installation

### 1. Install Ollama

Download and install Ollama for your operating system.

[Download Ollama](https://ollama.com/)

Verify that Ollama is available:

```bash
ollama --version
```

---

### 2. Install the Vision Model

Pull the LLaVA vision model:

```bash
ollama pull llava
```

Then start it:

```bash
ollama run llava
```

Ollama should now be available locally at:

```text
http://localhost:11434
```

You can verify the Ollama service is running by opening the address in your browser or checking it from your terminal.

---

### 3. Clone the Repository

```bash
git clone https://github.com/mhdhamka/ollama-vision-stream.git
```

Move into the project directory:

```bash
cd ollama-vision-stream
```

---

### 4. Open the Project

Open the project in VS Code:

```bash
code .
```

The project is intentionally lightweight and does not require a Node.js build system.

---

### 5. Start the Local Server

Using the VS Code **Live Server** extension:

1. Open the project in VS Code.
2. Right-click `index.html`.
3. Select **Open with Live Server**.
4. The application should open at:

```text
http://localhost:5500
```

> Webcam access generally requires the page to be served through `localhost` or a secure HTTPS context.

---

## Usage

### Start the Camera

Allow the browser to access your:

* Camera
* Microphone, if using voice input

The webcam feed will appear inside the vision workspace.

### Select a Vision Model

Choose the locally installed Ollama vision model.

For the default setup:

```text
llava
```

### Analyze the Scene

Use one of the preset prompts or enter your own.

For example:

```text
Describe everything you can see in this scene.
```

```text
Identify all electronic components visible in the image.
```

```text
Read and transcribe any text visible in the camera frame.
```

```text
Describe any potential safety hazards in the environment.
```

### Enable Continuous Vision

Enable the streaming / automatic capture mode to continuously send frames for analysis.

Adjust the capture interval depending on your hardware and desired response speed.

### Capture a Snapshot

Capture the current frame to open the snapshot workspace.

From there you can annotate the image and save the result.

---

## Privacy

OLLAMA Vision Stream is designed around a **local-first architecture**.

Your webcam frames are processed through your locally running Ollama instance rather than being uploaded to a third-party cloud AI service.

```text
Webcam
   ↓
Browser
   ↓
Local Application
   ↓
localhost:11434
   ↓
Local Ollama Model
```

However, privacy ultimately depends on your local environment, browser permissions, installed software, network configuration, and Ollama configuration.

---

## Performance

Vision inference can be computationally expensive.

Performance depends heavily on:

* CPU
* GPU
* Available VRAM
* System RAM
* Vision model size
* Image resolution
* Capture frequency
* Maximum output tokens
* Temperature
* Number of concurrent requests

For smoother real-time operation, start with a lower capture frequency and adjust it according to your hardware.

---

## Project Structure

```text
ollama-vision-stream/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   └── app.js
│
├── Images/
│   └── vision-stream.png
│
└── README.md
```

> Adjust the structure above if your actual repository uses a different asset organization.

---

## Troubleshooting

### Ollama Connection Failed

Make sure Ollama is running:

```bash
ollama run llava
```

Then verify that the service is listening on:

```text
http://localhost:11434
```

### Camera Not Available

Check your browser's site permissions and make sure the correct webcam is connected.

Also ensure the application is running through `localhost` rather than opening `index.html` directly with a `file://` URL.

### Model Not Found

Check the installed models:

```bash
ollama list
```

If LLaVA is missing:

```bash
ollama pull llava
```

### Slow Inference

Try reducing:

* Camera resolution
* Capture frequency
* Maximum output tokens
* Number of requests being processed simultaneously

Local multimodal inference can be significantly slower on CPU-only systems.

---

## Roadmap

Potential future improvements include:

* [ ] Multiple vision model support
* [ ] Model performance comparison
* [ ] GPU utilization telemetry
* [ ] Advanced ROI tracking
* [ ] Object detection overlays
* [ ] Persistent conversation sessions
* [ ] Image history and session management
* [ ] Video recording and replay
* [ ] Custom model configuration
* [ ] Advanced OCR pipeline
* [ ] Local vector memory
* [ ] WebSocket-based streaming
* [ ] Multi-camera support
* [ ] Mobile / tablet interface
* [ ] Docker deployment
* [ ] Custom Ollama model management

---

## Security Considerations

Although the application is designed for local inference, avoid exposing your Ollama API directly to the public internet.

Recommended deployment model:

```text
Browser
   │
   ▼
Local Web Server
   │
   ▼
Ollama
   │
   ▼
Local Vision Model
```

If you expose Ollama or the application beyond your local machine, implement appropriate authentication, network controls, CORS configuration, and access restrictions.

---

## Contributing

Contributions, improvements, bug reports, and feature ideas are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/my-new-feature
```

3. Make your changes.
4. Test the application locally.
5. Commit your changes.

```bash
git commit -m "feat: add new vision capability"
```

6. Push the branch.

```bash
git push origin feature/my-new-feature
```

7. Open a pull request.

---

## License

This project is licensed under the **MIT License**.

See the `LICENSE` file for more information.

---

## Author

<div align="center">

**mhdhamka**

Built with ⚡, JavaScript, Ollama, and local AI.

</div>

---

<div align="center">

⭐ If you find **OLLAMA Vision Stream** useful or interesting, consider giving the repository a star.

**Local AI. Real-Time Vision. Zero Cloud Dependency.**

</div>
