const video = document.getElementById('videoFeed');
const videoWrapper = document.getElementById('videoWrapper');
const canvas = document.getElementById('canvas');
const baseURL = document.getElementById('baseURL');
const instructionText = document.getElementById('instructionText');
const historyContainer = document.getElementById('historyContainer');
const intervalSelect = document.getElementById('intervalSelect');
const maxTokensInput = document.getElementById('maxTokensInput');
const tempSlider = document.getElementById('tempSlider');
const filterSelect = document.getElementById('filterSelect');
const startButton = document.getElementById('startButton');
const statusDot = document.getElementById('statusDot');
const headerDot = document.getElementById('headerDot');
const statusText = document.getElementById('statusText');
const snapshotModal = document.getElementById('snapshotModal');
const annotationCanvas = document.getElementById('annotationCanvas');
const roiToggle = document.getElementById('roiToggle');
const roiBox = document.getElementById('roiBox');
const ttsToggle = document.getElementById('ttsToggle');
const metricsBadge = document.getElementById('metricsBadge');
const personaSelect = document.getElementById('personaSelect');
const micButton = document.getElementById('micButton');

let stream;
let intervalId;
let isProcessing = false;
let lastSnapshotDataUrl = null;

// Metrics tracking state
let lastFrameTime = performance.now();
let frameCount = 0;
let currentFps = 0;

// ROI state variables
let isRoiActive = false;
let isDrawing = false;
let startX = 0, startY = 0, currentX = 0, currentY = 0;
let roiCoords = null; 

// Persona Presets Map
const personas = {
    default: "You are a helpful visual assistant.",
    security: "You are a strict security monitoring system. Explicitly watch for intruders, anomalies, or unexpected movement and alert immediately.",
    hardware: "You are an expert electronics and hardware engineering assistant. Analyze components, pins, breadboards, and identify wiring or soldering faults.",
    accessibility: "You are a descriptive guide for visually impaired individuals. Describe surroundings, text layout, and spatial positioning cleanly."
};

// Multi-turn conversation messages array
let conversationMessages = [];

// Annotation canvas variables
let annotationCtx = null;
let currentTool = 'pen';
let isAnnotating = false;
let annotStartX = 0, annotStartY = 0;
let baseAnnotationImg = new Image();

// Voice Recognition setup
let recognition = null;
let isListening = false;

if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        instructionText.value = speechResult;
        micButton.style.background = '';
        isListening = false;
    };

    recognition.onerror = () => {
        micButton.style.background = '';
        isListening = false;
    };

    recognition.onend = () => {
        micButton.style.background = '';
        isListening = false;
    };
}

function toggleVoiceInput() {
    if (!recognition) {
        alert("Speech recognition is not supported in this browser.");
        return;
    }
    if (isListening) {
        recognition.stop();
        isListening = false;
        micButton.style.background = '';
    } else {
        recognition.start();
        isListening = true;
        micButton.style.background = '#00ffcc44';
    }
}

function applyPersona() {
    const selected = personaSelect.value;
    if (personas[selected]) {
        // Prepend system instruction behavior implicitly into multi-turn messages stack
        conversationMessages = [{ role: 'system', content: personas[selected] }];
    }
}

// Load chat history from localStorage on startup
let chatHistoryLog = [];
try {
    const savedLog = localStorage.getItem('ollama_chat_history');
    if (savedLog) {
        chatHistoryLog = JSON.parse(savedLog);
        if (chatHistoryLog.length > 0) {
            historyContainer.innerHTML = '';
            chatHistoryLog.forEach(item => renderHistoryItem(item.time, item.prompt, item.response));
        }
    }
} catch (e) {
    console.error("Failed to load local history", e);
}

function setPrompt(text) {
    if (!instructionText.disabled) {
        instructionText.value = text;
    }
}

function changeVideoFilter() {
    video.className = '';
    video.classList.add(filterSelect.value);
}

function renderHistoryItem(timeStr, prompt, responseTextVal) {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
        <div class="history-meta">${timeStr}</div>
        <div class="history-prompt">Prompt: "${escapeHTML(prompt)}"</div>
        <div class="history-response">${escapeHTML(responseTextVal)}</div>
    `;
    historyContainer.appendChild(item);
    historyContainer.scrollTop = historyContainer.scrollHeight;
}

function appendHistory(prompt, responseTextVal) {
    if (historyContainer.children.length === 1 && historyContainer.children[0].querySelector('.history-response').textContent.includes("Waiting to start")) {
        historyContainer.innerHTML = '';
    }

    const timeStr = new Date().toLocaleTimeString();
    renderHistoryItem(timeStr, prompt, responseTextVal);

    chatHistoryLog.push({ time: timeStr, prompt, response: responseTextVal });
    try {
        localStorage.setItem('ollama_chat_history', JSON.stringify(chatHistoryLog));
    } catch (e) {
        console.error("Failed to save storage", e);
    }

    if (ttsToggle.checked && prompt !== "System") {
        speakText(responseTextVal);
    }
}

function speakText(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }
}

function clearHistory() {
    chatHistoryLog = [];
    conversationMessages = [];
    applyPersona();
    localStorage.removeItem('ollama_chat_history');
    historyContainer.innerHTML = `
        <div class="history-item">
            <div class="history-meta">System</div>
            <div class="history-response">History cleared. Ready.</div>
        </div>
    `;
}

function exportHistory(format) {
    if (chatHistoryLog.length === 0) {
        alert("No history to export.");
        return;
    }
    let content, filename, mimeType;
    if (format === 'json') {
        content = JSON.stringify(chatHistoryLog, null, 2);
        filename = `ollama-chat-history-${Date.now()}.json`;
        mimeType = 'application/json';
    } else {
        content = chatHistoryLog.map(h => `[${h.time}] Prompt: ${h.prompt}\nResponse: ${h.response}\n-----------------------------------`).join('\n');
        filename = `ollama-chat-history-${Date.now()}.txt`;
        mimeType = 'text/plain';
    }
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        videoWrapper.requestFullscreen().catch(err => {
            alert(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

async function sendChatCompletionRequest(instruction, imageBase64URL) {
    const temp = parseFloat(tempSlider.value);
    const maxTokens = parseInt(maxTokensInput.value, 10) || 100;

    // Push current interaction onto multi-turn conversation stack
    conversationMessages.push({
        role: 'user',
        content: [
            { type: 'text', text: instruction },
            { type: 'image_url', image_url: { url: imageBase64URL } }
        ]
    });

    // Keep context window trimmed to last 6 messages to avoid bloating payloads
    if (conversationMessages.length > 7) {
        conversationMessages.splice(1, 2);
    }

    const startTime = performance.now();

    const response = await fetch(`${baseURL.value}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: "llava",
            temperature: temp,
            max_tokens: maxTokens,
            messages: conversationMessages
        })
    });

    const latency = Math.round(performance.now() - startTime);
    metricsBadge.textContent = `Latency: ${latency} ms | FPS: ${currentFps}`;

    if (!response.ok) {
        const errorData = await response.text();
        return `Server error: ${response.status} - ${errorData}`;
    }
    
    const data = await response.json();
    const assistantReply = data.choices[0].message.content;

    // Push response to message stack for memory context
    conversationMessages.push({ role: 'assistant', content: assistantReply });

    return assistantReply;
}

async function initCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false });
        video.srcObject = stream;
        statusDot.classList.add('active');
        headerDot.classList.add('active');
        statusText.textContent = "Camera Ready";
        applyPersona();
    } catch (err) {
        console.error("Error accessing camera:", err);
        statusText.textContent = "Camera Error";
        appendHistory("System", `Error accessing camera: ${err.name} - ${err.message}.`);
    }
}

function captureImage() {
    if (!stream || !video.videoWidth) {
        console.warn("Video stream not ready for capture.");
        return null;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');

    context.filter = window.getComputedStyle(video).filter;

    if (roiCoords && roiCoords.width > 10 && roiCoords.height > 10) {
        context.drawImage(
            video, 
            roiCoords.x, roiCoords.y, roiCoords.width, roiCoords.height,
            0, 0, canvas.width, canvas.height
        );
    } else {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    // FPS Counter tracking calculation
    frameCount++;
    const now = performance.now();
    if (now - lastFrameTime >= 1000) {
        currentFps = Math.round((frameCount * 1000) / (now - lastFrameTime));
        frameCount = 0;
        lastFrameTime = now;
    }

    return canvas.toDataURL('image/jpeg', 0.85);
}

function takeSnapshot() {
    const dataUrl = captureImage();
    if (!dataUrl) {
        alert("Camera feed not active to take snapshot.");
        return;
    }
    lastSnapshotDataUrl = dataUrl;
    
    // Setup modal annotation canvas
    baseAnnotationImg.src = dataUrl;
    baseAnnotationImg.onload = () => {
        annotationCanvas.width = baseAnnotationImg.width;
        annotationCanvas.height = baseAnnotationImg.height;
        annotationCtx = annotationCanvas.getContext('2d');
        annotationCtx.drawImage(baseAnnotationImg, 0, 0);
        snapshotModal.classList.remove('hidden');
    };
}

function setAnnotationTool(tool) {
    currentTool = tool;
}

function clearAnnotationCanvas() {
    if (!annotationCtx) return;
    annotationCtx.clearRect(0, 0, annotationCanvas.width, annotationCanvas.height);
    annotationCtx.drawImage(baseAnnotationImg, 0, 0);
}

// Annotation mouse event bindings
annotationCanvas.addEventListener('mousedown', (e) => {
    isAnnotating = true;
    const rect = annotationCanvas.getBoundingClientRect();
    const scaleX = annotationCanvas.width / rect.width;
    const scaleY = annotationCanvas.height / rect.height;
    annotStartX = (e.clientX - rect.left) * scaleX;
    annotStartY = (e.clientY - rect.top) * scaleY;
});

annotationCanvas.addEventListener('mousemove', (e) => {
    if (!isAnnotating || !annotationCtx) return;
    const rect = annotationCanvas.getBoundingClientRect();
    const scaleX = annotationCanvas.width / rect.width;
    const scaleY = annotationCanvas.height / rect.height;
    const currentMouseX = (e.clientX - rect.left) * scaleX;
    const currentMouseY = (e.clientY - rect.top) * scaleY;

    if (currentTool === 'pen') {
        annotationCtx.strokeStyle = '#00ffcc';
        annotationCtx.lineWidth = 4;
        annotationCtx.lineTo(currentMouseX, currentMouseY);
        annotationCtx.stroke();
    }
});

annotationCanvas.addEventListener('mouseup', (e) => {
    if (!isAnnotating || !annotationCtx) return;
    isAnnotating = false;
    const rect = annotationCanvas.getBoundingClientRect();
    const scaleX = annotationCanvas.width / rect.width;
    const scaleY = annotationCanvas.height / rect.height;
    const endX = (e.clientX - rect.left) * scaleX;
    const endY = (e.clientY - rect.top) * scaleY;

    if (currentTool === 'rect') {
        annotationCtx.strokeStyle = '#ff0055';
        annotationCtx.lineWidth = 4;
        annotationCtx.strokeRect(annotStartX, annotStartY, endX - annotStartX, endY - annotStartY);
    }
    annotationCtx.beginPath();
});

function closeModal() {
    snapshotModal.classList.add('hidden');
    lastSnapshotDataUrl = null;
}

function downloadSnapshotFromModal() {
    if (!annotationCanvas) return;
    const annotatedDataUrl = annotationCanvas.toDataURL('image/jpeg', 0.9);
    const link = document.createElement('a');
    link.download = `snapshot-annotated-${Date.now()}.jpg`;
    link.href = annotatedDataUrl;
    link.click();
    closeModal();
}

function toggleRoiMode() {
    isRoiActive = roiToggle.checked;
    if (!isRoiActive) {
        roiCoords = null;
        roiBox.style.display = 'none';
    }
}

videoWrapper.addEventListener('mousedown', (e) => {
    if (!isRoiActive) return;
    isDrawing = true;
    const rect = videoWrapper.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    roiBox.style.left = `${startX}px`;
    roiBox.style.top = `${startY}px`;
    roiBox.style.width = `0px`;
    roiBox.style.height = `0px`;
    roiBox.style.display = 'block';
});

videoWrapper.addEventListener('mousemove', (e) => {
    if (!isDrawing || !isRoiActive) return;
    const rect = videoWrapper.getBoundingClientRect();
    currentX = e.clientX - rect.left;
    currentY = e.clientY - rect.top;

    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);
    const left = Math.min(currentX, startX);
    const top = Math.min(currentY, startY);

    roiBox.style.left = `${left}px`;
    roiBox.style.top = `${top}px`;
    roiBox.style.width = `${width}px`;
    roiBox.style.height = `${height}px`;
});

videoWrapper.addEventListener('mouseup', (e) => {
    if (!isDrawing || !isRoiActive) return;
    isDrawing = false;
    const rect = videoWrapper.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const uiLeft = Math.min(endX, startX);
    const uiTop = Math.min(endY, startY);
    const uiWidth = Math.abs(endX - startX);
    const uiHeight = Math.abs(endY - startY);

    if (uiWidth < 10 || uiHeight < 10) {
        roiCoords = null;
        roiBox.style.display = 'none';
        return;
    }

    const scaleX = video.videoWidth / videoWrapper.clientWidth;
    const scaleY = video.videoHeight / videoWrapper.clientHeight;

    roiCoords = {
        x: uiLeft * scaleX,
        y: uiTop * scaleY,
        width: uiWidth * scaleX,
        height: uiHeight * scaleY
    };
});

async function sendData() {
    if (!isProcessing) return;

    const instruction = instructionText.value;
    const imageBase64URL = captureImage();

    if (!imageBase64URL) {
        appendHistory("System", "Failed to capture image. Stream might not be active.");
        return;
    }

    try {
        const response = await sendChatCompletionRequest(instruction, imageBase64URL);
        appendHistory(instruction, response);
    } catch (error) {
        console.error('Error sending data:', error);
        appendHistory("System", `Connection Error: Is your local server running at ${baseURL.value}?`);
    }
}

function handleStart() {
    if (!stream) {
        alert("Camera not available. Please grant permission first.");
        return;
    }
    isProcessing = true;
    startButton.textContent = "Stop Vision Stream";
    startButton.classList.add('stop');

    intervalSelect.disabled = true;
    statusText.textContent = "Streaming AI Active";

    const intervalMs = parseInt(intervalSelect.value, 10);
    sendData(); 
    intervalId = setInterval(sendData, intervalMs);
}

function handleStop() {
    isProcessing = false;
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    startButton.textContent = "Start Vision Stream";
    startButton.classList.remove('stop');

    intervalSelect.disabled = false;
    statusText.textContent = "Camera Ready";
    appendHistory("System", "Processing stopped.");
}

startButton.addEventListener('click', () => {
    if (isProcessing) {
        handleStop();
    } else {
        handleStart();
    }
});

window.addEventListener('DOMContentLoaded', initCamera);

window.addEventListener('beforeunload', () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    if (intervalId) clearInterval(intervalId);
});