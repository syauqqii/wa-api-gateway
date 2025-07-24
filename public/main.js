const API_BASE = 'http://localhost:4437/api';

let sessions = [];
let currentView = 'sessions';

// Sidebar functionality
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const menuToggle = document.getElementById('menu-toggle');
const closeSidebar = document.getElementById('close-sidebar');

function openSidebar() {
    sidebar.classList.remove('-translate-x-full');
    sidebarOverlay.classList.remove('hidden');
}

function closeSidebarFunc() {
    sidebar.classList.add('-translate-x-full');
    sidebarOverlay.classList.add('hidden');
}

menuToggle.addEventListener('click', openSidebar);
closeSidebar.addEventListener('click', closeSidebarFunc);
sidebarOverlay.addEventListener('click', closeSidebarFunc);

// View switching
function switchView(view) {
    document.querySelectorAll('.view-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(`${view}-view`).classList.remove('hidden');
    
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('bg-dark-border');
        el.querySelector('div').classList.remove('bg-accent');
        el.querySelector('div').classList.add('bg-gray-400');
    });
    
    event.target.classList.add('bg-dark-border');
    event.target.querySelector('div').classList.remove('bg-gray-400');
    event.target.querySelector('div').classList.add('bg-accent');
    
    // Update page title
    const titles = {
        'sessions': 'Session Management',
        'send-message': 'Send Message',
        'send-file': 'Send File'
    };
    document.getElementById('page-title').textContent = titles[view];
    
    currentView = view;
    closeSidebarFunc();
    
    if (view === 'send-message' || view === 'send-file') {
        loadSessionsForSelect();
    }
}

// Toast notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const colors = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-blue-600'
    };
    
    toast.className = `${colors[type]} text-white px-4 py-2 rounded shadow-lg transform translate-x-full transition-transform duration-300`;
    toast.textContent = message;
    
    document.getElementById('toast-container').appendChild(toast);
    
    setTimeout(() => toast.classList.remove('translate-x-full'), 100);
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// API functions
async function createSession() {
    try {
        const response = await fetch(`${API_BASE}/session/create`, { method: 'POST' });
        const data = await response.json();
        
        if (data.success) {
            showToast(`Session created: ${data.id}`, 'success');
            loadSessions();
        } else {
            showToast(data.message || 'Failed to create session', 'error');
        }
    } catch (error) {
        showToast('Network error', 'error');
    }
}

async function loadSessions() {
    try {
        const response = await fetch(`${API_BASE}/session/list`);
        const data = await response.json();
        
        if (data.success) {
            sessions = data.sessions || [];
            renderSessions();
        }
    } catch (error) {
        showToast('Failed to load sessions', 'error');
    }
}

async function getSessionStatus(sessionId) {
    try {
        const response = await fetch(`${API_BASE}/session/status?id=${sessionId}`);
        const data = await response.json();
        return data.status || 'unknown';
    } catch (error) {
        return 'error';
    }
}

async function showQR(sessionId) {
    try {
        const response = await fetch(`${API_BASE}/session/qr?id=${sessionId}`);
        const data = await response.json();
        
        if (data.success && data.qr) {
            document.getElementById('qr-content').innerHTML = `<img src="${data.qr}" alt="QR Code" class="mx-auto max-w-full">`;
            document.getElementById('qr-modal').classList.remove('hidden');
        } else if (data.success && data.qr === null) {
            showToast('QR code not available - session is already connected', 'info');
        } else {
            showToast('QR code not available', 'error');
        }
    } catch (error) {
        showToast('Failed to load QR code', 'error');
    }
}

function closeQRModal() {
    document.getElementById('qr-modal').classList.add('hidden');
}

function renderSessions() {
    const grid = document.getElementById('sessions-grid');
    
    if (sessions.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center text-gray-400 py-8">No sessions found. Create a new session to get started.</div>';
        return;
    }
    
    grid.innerHTML = sessions.map(session => {
        const sessionId = session.id;
        const status = session.status || 'unknown';
        const meta = session.meta || {};
        
        return `
        <div class="bg-dark-surface border border-dark-border rounded-lg p-4">
            <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                    <h3 class="font-semibold text-sm mb-1">${sessionId}</h3>
                    <p class="text-xs text-gray-400" id="status-${sessionId}">${status}</p>
                    ${meta.phone_number ? `
                        <div class="mt-2 text-xs text-gray-300">
                            <div>📱 ${meta.phone_number}</div>
                            <div>👤 ${meta.name || 'N/A'}</div>
                            <div>💬 ${meta.chats || 0} chats • ${meta.unread || 0} unread</div>
                        </div>
                    ` : ''}
                </div>
                <div class="w-3 h-3 rounded ml-2" id="indicator-${sessionId}"></div>
            </div>
            <div class="flex space-x-2">
                <button onclick="showQR('${sessionId}')" class="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition-colors">
                    QR Code
                </button>
                <button onclick="refreshStatus('${sessionId}')" class="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition-colors">
                    Refresh
                </button>
            </div>
        </div>
        `;
    }).join('');
    
    // Update status indicators
    sessions.forEach(session => {
        updateStatusIndicator(session.id, session.status);
    });
}

function updateStatusIndicator(sessionId, status) {
    const statusEl = document.getElementById(`status-${sessionId}`);
    const indicatorEl = document.getElementById(`indicator-${sessionId}`);
    
    if (statusEl && indicatorEl) {
        statusEl.textContent = status || 'unknown';
        
        const colors = {
            'READY': 'bg-green-500',
            'PENDING': 'bg-yellow-500',
            'DISCONNECTED': 'bg-red-500',
            'ERROR': 'bg-red-500'
        };
        
        indicatorEl.className = `w-3 h-3 rounded ${colors[status] || 'bg-gray-500'}`;
    }
}

async function refreshStatus(sessionId) {
    const status = await getSessionStatus(sessionId);
    updateStatusIndicator(sessionId, status);
    
    // Refresh the entire session list to get updated metadata
    loadSessions();
}

function loadSessionsForSelect() {
    const selects = [document.getElementById('session-select'), document.getElementById('session-select-file')];
    
    selects.forEach(select => {
        if (select) {
            select.innerHTML = '<option value="">Select Session</option>' +
                sessions.map(session => `<option value="${session.id}">${session.id} (${session.status})</option>`).join('');
        }
    });
}

// Message sending
document.getElementById('message-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const sessionId = document.getElementById('session-select').value;
    const phoneNumber = document.getElementById('phone-number').value;
    const messageText = document.getElementById('message-text').value;
    
    if (!sessionId || !phoneNumber || !messageText) {
        showToast('Please fill all fields', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/send-message/${sessionId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: phoneNumber, text: messageText })
        });
        
        const data = await response.json();
        
        // Response is an array
        if (Array.isArray(data) && data.length > 0 && data[0].success) {
            showToast(`Message sent to ${data[0].number}`, 'success');
            document.getElementById('message-form').reset();
        } else {
            showToast(data[0]?.message || 'Failed to send message', 'error');
        }
    } catch (error) {
        showToast('Network error', 'error');
    }
});

// File sending
document.getElementById('file-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const sessionId = document.getElementById('session-select-file').value;
    const phoneNumber = document.getElementById('phone-number-file').value;
    const messageText = document.getElementById('message-text-file').value;
    const file = document.getElementById('file-input').files[0];
    
    if (!sessionId || !phoneNumber || !file) {
        showToast('Please fill all required fields', 'error');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
        showToast('File size must be less than 10MB', 'error');
        return;
    }
    
    const formData = new FormData();
    formData.append('to', phoneNumber);
    formData.append('text', messageText || '');
    formData.append('file', file);
    
    try {
        const response = await fetch(`${API_BASE}/send-message-with-file/${sessionId}`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        // Response is an array
        if (Array.isArray(data) && data.length > 0 && data[0].success) {
            showToast(`File sent to ${data[0].number}`, 'success');
            document.getElementById('file-form').reset();
        } else {
            showToast(data[0]?.message || 'Failed to send file', 'error');
        }
    } catch (error) {
        showToast('Network error', 'error');
    }
});

// Initialize
loadSessions();

// Refresh sessions every 30 seconds
setInterval(loadSessions, 30000);