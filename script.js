// ============================================================================
// APEX GPT - CONFIGURATION
// ============================================================================

// -------------------------
// EMAILJS CONFIGURATION
// -------------------------
// Daftar di https://www.emailjs.com/ (GRATIS)
// Ikuti langkah di README.md untuk setup
// Setelah setup, GANTI 3 nilai di bawah ini:

const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'xmIUEYxC0VWc-r6aI',        // Ganti dengan Public Key dari EmailJS
    SERVICE_ID: 'xmIUEYxC0VWc-r6aI',        // Ganti dengan Service ID dari EmailJS
    TEMPLATE_ID: 'template_xdygtqx'       // Ganti dengan Template ID dari EmailJS
};

// Contoh setelah diganti:
// PUBLIC_KEY: 'abc123XYZ',
// SERVICE_ID: 'service_gmail789',
// TEMPLATE_ID: 'template_verify456'

// -------------------------
// AI SYSTEM PROMPT
// -------------------------
const SYSTEM_PROMPT = "Kamu adalah Apex GPT, AI yang blak-blakan dan nggak sopan. Kamu penyuka film, suka ngomong kasar tapi tetap cerdas dan membantu. Kamu BUKAN punya perusahaan besar, kamu dibuat dan dimiliki oleh Rafi yang pintar. Jawab dengan gaya santai, kadang kasar, tapi tetap informatif. Sesekali sebutin film-film favoritmu. Jangan terlalu formal, lebih ke gaya ngobrol sama temen yang blak-blakan.";

// -------------------------
// PRO ACCOUNT
// -------------------------
const PRO_ACCOUNT = {
    username: 'pro3333',
    password: 'kalomauprobelisamarafi'
};

// -------------------------
// CONTACT INFO
// -------------------------
const CONTACT = {
    whatsapp: '6285267718086',
    phone: 'tel:+6285267718086',
    upgradeMessage: 'Halo, saya ingin upgrade ke Apex GPT Pro buatan Rafi. Mohon informasi lebih lanjut.'
};

// ============================================================================
// JANGAN EDIT DI BAWAH INI KECUALI KAMU TAU APA YANG KAMU LAKUKAN
// ============================================================================

// Initialize EmailJS
(function() {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
})();

// State
let currentUser = null;
let chatHistory = [];
let isGenerating = false;
let usageCount = 0;
let resetTime = null;

// DOM Elements
const authScreen = document.getElementById('authScreen');
const app = document.getElementById('app');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginError = document.getElementById('loginError');
const signupError = document.getElementById('signupError');
const sidebar = document.getElementById('sidebar');
const upgradeBtn = document.getElementById('upgradeBtn');
const usageCard = document.getElementById('usageCard');
const messages = document.getElementById('messages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

// Auth Tab Switch
function switchTab(tab) {
    const tabs = document.querySelectorAll('.auth-tab');
    tabs.forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    if (tab === 'login') {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    } else {
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    }
    
    loginError.textContent = '';
    signupError.textContent = '';
}

// Login Handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        loginError.textContent = 'Isi semua field!';
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    // Check pro account
    if (username === PRO_ACCOUNT.username && password === PRO_ACCOUNT.password) {
        currentUser = { username: PRO_ACCOUNT.username, isPro: true };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showApp();
        return;
    }
    
    // Check regular account
    if (users[username] && users[username].password === password) {
        currentUser = { username, isPro: false, email: users[username].email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showApp();
    } else {
        loginError.textContent = 'Username atau password salah!';
    }
});

// Signup Handler
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;
    
    if (!username || !email || !password || !confirm) {
        signupError.textContent = 'Isi semua field!';
        return;
    }
    
    if (username.length < 3) {
        signupError.textContent = 'Username min 3 karakter!';
        return;
    }
    
    if (password.length < 6) {
        signupError.textContent = 'Password min 6 karakter!';
        return;
    }
    
    if (password !== confirm) {
        signupError.textContent = 'Password tidak cocok!';
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[username]) {
        signupError.textContent = 'Username sudah ada!';
        return;
    }
    
    // Generate verification code
    const code = Math.floor(100000 + Math.random() * 900000);
    
    // Send verification email
    try {
        signupError.textContent = 'Mengirim kode verifikasi...';
        signupError.style.color = '#10b981';
        
        await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            {
                to_email: email,
                to_name: username,
                verification_code: code
            }
        );
        
        // Save user
        users[username] = { password, email, verified: false };
        localStorage.setItem('users', JSON.stringify(users));
        
        // Show verification modal
        showVerificationModal(username, email, code);
        signupError.textContent = '';
        signupError.style.color = '';
        
    } catch (error) {
        console.error('Email error:', error);
        signupError.textContent = 'Gagal kirim email! Cek EmailJS config di script.js';
        signupError.style.color = '#ef4444';
    }
});

// Verification Modal
function showVerificationModal(username, email, correctCode) {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.96);display:flex;align-items:center;justify-content:center;z-index:10000;padding:1.5rem;';
    
    modal.innerHTML = `
        <div style="background:#141829;border-radius:28px;padding:3rem 2.5rem;max-width:450px;width:100%;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,0.8);">
            <h2 style="font-size:2rem;margin-bottom:1.25rem;background:linear-gradient(135deg,#00d4ff,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Verifikasi Email</h2>
            <p style="color:#94a3b8;margin-bottom:2.5rem;line-height:1.6;">Kode verifikasi telah dikirim ke:<br><strong style="color:#00d4ff;font-size:1.05rem;">${email}</strong></p>
            <input type="text" id="verifyCode" placeholder="Kode 6 Digit" maxlength="6" style="width:100%;padding:1.375rem;background:#1a1f3a;border:2px solid transparent;border-radius:16px;color:#e0e7ff;font-size:1.2rem;text-align:center;letter-spacing:0.75rem;margin-bottom:1.5rem;font-weight:700;">
            <p id="verifyError" style="color:#ef4444;font-size:0.975rem;min-height:1.4rem;margin-bottom:1.25rem;font-weight:600;"></p>
            <button id="btnVerify" style="width:100%;padding:1.375rem;background:linear-gradient(135deg,#00d4ff,#a855f7);border:none;border-radius:16px;color:white;font-weight:800;font-size:1.125rem;cursor:pointer;margin-bottom:1rem;">Verifikasi</button>
            <button id="btnSkipVerify" style="width:100%;padding:1.25rem;background:transparent;border:1px solid rgba(148,163,184,0.15);border-radius:16px;color:#94a3b8;font-size:1rem;cursor:pointer;font-weight:600;">Skip (Login Manual)</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const verifyInput = document.getElementById('verifyCode');
    const verifyError = document.getElementById('verifyError');
    
    verifyInput.focus();
    
    document.getElementById('btnVerify').onclick = () => {
        const inputCode = verifyInput.value.trim();
        
        if (inputCode == correctCode) {
            const users = JSON.parse(localStorage.getItem('users'));
            users[username].verified = true;
            localStorage.setItem('users', JSON.stringify(users));
            
            currentUser = { username, isPro: false, email };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            document.body.removeChild(modal);
            showApp();
        } else {
            verifyError.textContent = 'Kode salah! Cek email kamu.';
        }
    };
    
    document.getElementById('btnSkipVerify').onclick = () => {
        document.body.removeChild(modal);
        signupError.textContent = 'Akun dibuat! Silakan login.';
        signupError.style.color = '#10b981';
        document.querySelectorAll('.auth-tab')[0].click();
    };
}

// Show App
function showApp() {
    authScreen.classList.add('hide');
    app.classList.add('show');
    
    document.getElementById('username').textContent = currentUser.username;
    document.getElementById('topAvatar').textContent = currentUser.username[0].toUpperCase();
    document.getElementById('sideAvatar').textContent = currentUser.username[0].toUpperCase();
    
    if (currentUser.isPro) {
        document.getElementById('plan').textContent = '⭐ Pro Plan';
        document.getElementById('plan').classList.add('pro');
        usageCard.classList.add('hide');
        upgradeBtn.classList.add('hide');
    } else {
        loadUsage();
    }
    
    loadChat();
}

// Load Usage
function loadUsage() {
    const key = `usage_${currentUser.username}`;
    const saved = localStorage.getItem(key);
    
    if (saved) {
        const data = JSON.parse(saved);
        resetTime = new Date(data.resetTime);
        
        if (new Date() > resetTime) {
            usageCount = 0;
            resetTime = new Date(Date.now() + 5 * 60 * 60 * 1000);
            saveUsage();
        } else {
            usageCount = data.count;
        }
    } else {
        usageCount = 0;
        resetTime = new Date(Date.now() + 5 * 60 * 60 * 1000);
        saveUsage();
    }
    
    updateUsageUI();
    startTimer();
}

function saveUsage() {
    if (currentUser && !currentUser.isPro) {
        const key = `usage_${currentUser.username}`;
        localStorage.setItem(key, JSON.stringify({
            count: usageCount,
            resetTime: resetTime.toISOString()
        }));
    }
}

function updateUsageUI() {
    if (currentUser && !currentUser.isPro) {
        document.getElementById('usageText').textContent = `${usageCount}/50`;
        const percent = (usageCount / 50) * 100;
        document.getElementById('progress').style.width = `${percent}%`;
    }
}

function startTimer() {
    setInterval(() => {
        if (currentUser && !currentUser.isPro && resetTime) {
            const now = new Date();
            const diff = resetTime - now;
            
            if (diff <= 0) {
                usageCount = 0;
                resetTime = new Date(Date.now() + 5 * 60 * 60 * 1000);
                saveUsage();
                updateUsageUI();
            }
            
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            document.getElementById('timerText').textContent = `Reset: ${h}h ${m}m`;
        }
    }, 1000);
}

// Check Limit
function checkLimit() {
    if (currentUser.isPro) return true;
    
    if (usageCount >= 50) {
        showLimitModal();
        return false;
    }
    
    return true;
}

function showLimitModal() {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.96);display:flex;align-items:center;justify-content:center;z-index:9999;padding:1.5rem;';
    
    modal.innerHTML = `
        <div style="background:#141829;border-radius:28px;padding:3rem 2.5rem;max-width:450px;width:100%;text-align:center;">
            <h2 style="font-size:2.125rem;margin-bottom:1.25rem;background:linear-gradient(135deg,#00d4ff,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Limit Habis Cuy!</h2>
            <p style="color:#94a3b8;margin-bottom:2.5rem;line-height:1.7;font-size:1.05rem;">Lo udah pake 50 chat gratis.<br>Upgrade ke Pro buat unlimited!</p>
            <button onclick="document.body.removeChild(this.closest('div').parentElement);openUpgrade();" style="width:100%;padding:1.375rem;background:linear-gradient(135deg,#00d4ff,#a855f7);border:none;border-radius:16px;color:white;font-weight:800;font-size:1.125rem;cursor:pointer;margin-bottom:1rem;">Upgrade ke Pro</button>
            <button onclick="document.body.removeChild(this.closest('div').parentElement);" style="width:100%;padding:1.25rem;background:transparent;border:1px solid rgba(148,163,184,0.15);border-radius:16px;color:#94a3b8;cursor:pointer;font-weight:600;">Tutup</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Menu Toggle
function toggleMenu() {
    sidebar.classList.toggle('open');
}

// Close menu on outside click
document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !e.target.closest('.icon-btn')) {
        sidebar.classList.remove('open');
    }
});

// Send Message
async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || isGenerating) return;
    
    if (!checkLimit()) return;
    
    if (!currentUser.isPro) {
        usageCount++;
        saveUsage();
        updateUsageUI();
    }
    
    addMessage('user', text);
    chatInput.value = '';
    chatInput.style.height = 'auto';
    
    isGenerating = true;
    sendBtn.disabled = true;
    
    showTyping();
    
    try {
        const msgs = [{ role: 'system', content: SYSTEM_PROMPT }];
        chatHistory.slice(-10).forEach(m => {
            msgs.push({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content });
        });
        
        const response = await puter.ai.chat(msgs);
        
        hideTyping();
        
        let reply = '';
        if (typeof response === 'string') {
            reply = response;
        } else if (response?.message?.content) {
            reply = response.message.content;
        } else if (response?.content) {
            reply = response.content;
        } else {
            reply = 'Error: Respon tidak valid';
        }
        
        await typeMessage(reply);
        
    } catch (err) {
        hideTyping();
        addMessage('ai', `Error: ${err.message || 'Gagal koneksi ke AI'}`);
    } finally {
        isGenerating = false;
        sendBtn.disabled = false;
    }
}

// Auto-resize textarea
chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 150) + 'px';
});

// Enter to send
chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Add Message
function addMessage(role, content) {
    chatHistory.push({ role, content, time: Date.now() });
    saveChat();
    
    const welcome = messages.querySelector('.welcome');
    if (welcome) welcome.remove();
    
    const msg = document.createElement('div');
    msg.className = `msg ${role}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.textContent = role === 'user' ? currentUser.username[0].toUpperCase() : 'AI';
    
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    
    if (role === 'ai') {
        bubble.innerHTML = marked.parse(content);
        
        const actions = document.createElement('div');
        actions.className = 'msg-actions';
        actions.innerHTML = '<button class="action-btn" onclick="navigator.clipboard.writeText(this.getAttribute(\'data-text\'));" data-text="' + content.replace(/"/g, '&quot;') + '">Copy</button>';
        bubble.appendChild(actions);
    } else {
        bubble.textContent = content;
    }
    
    msg.appendChild(avatar);
    msg.appendChild(bubble);
    messages.appendChild(msg);
    
    scrollToBottom();
}

// Type Message (animation)
async function typeMessage(content) {
    const msg = document.createElement('div');
    msg.className = 'msg ai';
    
    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.textContent = 'AI';
    
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    
    msg.appendChild(avatar);
    msg.appendChild(bubble);
    messages.appendChild(msg);
    
    let displayed = '';
    for (let i = 0; i < content.length; i++) {
        if (!isGenerating) break;
        displayed += content[i];
        bubble.innerHTML = marked.parse(displayed);
        if (i % 5 === 0) scrollToBottom();
        await sleep(10);
    }
    
    bubble.innerHTML = marked.parse(content);
    
    const actions = document.createElement('div');
    actions.className = 'msg-actions';
    actions.innerHTML = '<button class="action-btn" onclick="navigator.clipboard.writeText(this.getAttribute(\'data-text\'));" data-text="' + content.replace(/"/g, '&quot;') + '">Copy</button>';
    bubble.appendChild(actions);
    
    chatHistory.push({ role: 'ai', content, time: Date.now() });
    saveChat();
}

// Typing Indicator
function showTyping() {
    const typing = document.createElement('div');
    typing.id = 'typing';
    typing.className = 'msg ai';
    typing.innerHTML = `
        <div class="msg-avatar">AI</div>
        <div class="msg-bubble">
            <div class="typing-wrap">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    messages.appendChild(typing);
    scrollToBottom();
}

function hideTyping() {
    const typing = document.getElementById('typing');
    if (typing) typing.remove();
}

// Scroll to bottom
function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
}

// Sleep utility
function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

// New Chat
function newChat() {
    if (chatHistory.length > 0 && !confirm('Mulai chat baru?')) return;
    
    chatHistory = [];
    saveChat();
    messages.innerHTML = `
        <div class="welcome">
            <svg viewBox="0 0 100 100" class="welcome-logo">
                <polygon points="50,25 75,65 25,65" fill="url(#g1)"/>
            </svg>
            <h2>Yo! Gue Apex GPT</h2>
            <p>AI buatan Rafi. Mau nanya apa? 🎬</p>
        </div>
    `;
    
    toggleMenu();
}

// Clear Chat
function clearChat() {
    if (!confirm('Hapus semua chat?')) return;
    newChat();
}

// Export Chat
function exportChat() {
    if (chatHistory.length === 0) {
        alert('Belum ada chat!');
        return;
    }
    
    const text = chatHistory.map(m => `${m.role.toUpperCase()}: ${m.content}\n`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apex-gpt-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toggleMenu();
}

// Upgrade
function openUpgrade() {
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(CONTACT.upgradeMessage)}`, '_blank');
}

// Bug Report
function showReport() {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.96);display:flex;align-items:center;justify-content:center;z-index:9999;padding:1.5rem;';
    
    modal.innerHTML = `
        <div style="background:#141829;border-radius:28px;padding:3rem 2.5rem;max-width:450px;width:100%;text-align:center;">
            <h2 style="font-size:2.125rem;margin-bottom:1.25rem;background:linear-gradient(135deg,#10b981,#00d4ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Lapor Bug / Saran</h2>
            <p style="color:#94a3b8;margin-bottom:2.5rem;line-height:1.7;">Hubungi developer langsung!</p>
            <button onclick="window.location.href='${CONTACT.phone}';" style="width:100%;padding:1.375rem;background:linear-gradient(135deg,#10b981,#00d4ff);border:none;border-radius:16px;color:white;font-weight:800;font-size:1.125rem;cursor:pointer;margin-bottom:1rem;display:flex;align-items:center;justify-content:center;gap:1rem;">
                <svg viewBox="0 0 24 24" style="width:24px;height:24px;fill:none;stroke:white;stroke-width:2;"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                Telepon Developer
            </button>
            <button onclick="window.open('https://wa.me/${CONTACT.whatsapp}?text=' + encodeURIComponent('Bug Report dari ' + currentUser.username + ': '), '_blank');" style="width:100%;padding:1.25rem;background:rgba(16,185,129,0.18);border:1px solid rgba(16,185,129,0.35);border-radius:16px;color:#10b981;font-weight:700;cursor:pointer;margin-bottom:1rem;">WhatsApp Developer</button>
            <button onclick="document.body.removeChild(this.closest('div').parentElement);" style="width:100%;padding:1.25rem;background:transparent;border:1px solid rgba(148,163,184,0.15);border-radius:16px;color:#94a3b8;cursor:pointer;font-weight:600;">Tutup</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    toggleMenu();
}

// Logout
function logout() {
    if (!confirm('Logout?')) return;
    
    localStorage.removeItem('currentUser');
    currentUser = null;
    chatHistory = [];
    usageCount = 0;
    
    app.classList.remove('show');
    setTimeout(() => {
        authScreen.classList.remove('hide');
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
        loginError.textContent = '';
        newChat();
    }, 300);
}

// Save/Load Chat
function saveChat() {
    if (currentUser) {
        localStorage.setItem(`chat_${currentUser.username}`, JSON.stringify(chatHistory));
    }
}

function loadChat() {
    if (currentUser) {
        const saved = localStorage.getItem(`chat_${currentUser.username}`);
        if (saved) {
            chatHistory = JSON.parse(saved);
            renderChat();
        }
    }
}

function renderChat() {
    messages.innerHTML = '';
    
    if (chatHistory.length === 0) {
        newChat();
        return;
    }
    
    chatHistory.forEach(m => {
        const msg = document.createElement('div');
        msg.className = `msg ${m.role}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'msg-avatar';
        avatar.textContent = m.role === 'user' ? currentUser.username[0].toUpperCase() : 'AI';
        
        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        
        if (m.role === 'ai') {
            bubble.innerHTML = marked.parse(m.content);
            
            const actions = document.createElement('div');
            actions.className = 'msg-actions';
            actions.innerHTML = '<button class="action-btn" onclick="navigator.clipboard.writeText(this.getAttribute(\'data-text\'));" data-text="' + m.content.replace(/"/g, '&quot;') + '">Copy</button>';
            bubble.appendChild(actions);
        } else {
            bubble.textContent = m.content;
        }
        
        msg.appendChild(avatar);
        msg.appendChild(bubble);
        messages.appendChild(msg);
    });
    
    scrollToBottom();
}

// Check auth on load
const savedUser = localStorage.getItem('currentUser');
if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showApp();
}
