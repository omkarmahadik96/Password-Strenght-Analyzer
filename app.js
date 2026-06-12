/* ==========================================================================
   FORTRESSPASS SECURE SYSTEM LOGIC ENGINE
   Theme: HTML5 Canvas Digital Constellation, Physics Confetti & CRT Logging
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------------------------
    // UI ELEMENTS SELECTORS
    // ----------------------------------------------------------------------
    const passwordInput = document.getElementById("password-input");
    const togglePasswordBtn = document.getElementById("toggle-password-btn");
    const eyeOpenIcon = togglePasswordBtn.querySelector(".eye-open-icon");
    const eyeClosedIcon = togglePasswordBtn.querySelector(".eye-closed-icon");
    
    // Matrix badges
    const matrixLength = document.getElementById("matrix-length");
    const matrixUpper = document.getElementById("matrix-upper");
    const matrixLower = document.getElementById("matrix-lower");
    const matrixNumber = document.getElementById("matrix-number");
    const matrixSymbol = document.getElementById("matrix-symbol");
    
    // Gauge & rating elements
    const entropyValue = document.getElementById("entropy-value");
    const securityGrade = document.getElementById("security-grade");
    const gaugeFill = document.querySelector(".gauge-fill");
    const leakIndicator = document.getElementById("leak-indicator");
    const leakDisplayBox = document.getElementById("leak-display-box");
    
    // Threat table time labels
    const timePhone = document.getElementById("time-phone");
    const timeRig = document.getElementById("time-rig");
    const timeSuper = document.getElementById("time-super");
    const timeQuantum = document.getElementById("time-quantum");
    
    // Generator elements
    const tabChar = document.getElementById("tab-char");
    const tabPhrase = document.getElementById("tab-phrase");
    const charControls = document.getElementById("char-controls-group");
    const phraseControls = document.getElementById("phrase-controls-group");
    const lengthSlider = document.getElementById("length-slider");
    const sliderLengthVal = document.getElementById("slider-length-val");
    const generatedDisplay = document.getElementById("generated-string-display");
    const generateTrigger = document.getElementById("generate-trigger");
    const copyBtn = document.getElementById("copy-btn");
    
    // Generator settings checkboxes
    const genUpper = document.getElementById("gen-upper");
    const genLower = document.getElementById("gen-lower");
    const genNumbers = document.getElementById("gen-numbers");
    const genSymbols = document.getElementById("gen-symbols");
    const genSep = document.getElementById("gen-sep");
    const genCap = document.getElementById("gen-cap");
    
    // Audit elements
    const auditListBox = document.getElementById("audit-list-box");
    const clearAuditBtn = document.getElementById("clear-audit-btn");
    const hudAlertsBox = document.getElementById("hud-alerts-box");

    // ----------------------------------------------------------------------
    // STATE MANAGERS
    // ----------------------------------------------------------------------
    let activeTab = "char"; 
    let breachDebounceTimer = null;
    let realTimeCrackTimer = null;
    let activeSessionLogs = [];

    // HSL State Colors Map
    const STATE_COLORS = {
        empty: { hue: 230, rgb: "100, 116, 139", hex: "#64748b", label: "EMPTY SYSTEM" },
        fragile: { hue: 345, rgb: "239, 68, 68", hex: "#ef4444", label: "FRAGILE SHIELD" },
        weak: { hue: 20, rgb: "249, 115, 22", hex: "#f97316", label: "WEAK CORE" },
        moderate: { hue: 45, rgb: "234, 179, 8", hex: "#eab308", label: "MODERATE GUARD" },
        robust: { hue: 185, rgb: "6, 182, 212", hex: "#06b6d4", label: "ROBUST SHIELD" },
        fortified: { hue: 145, rgb: "34, 197, 94", hex: "#22c55e", label: "FORTIFIED ACCESS" }
    };

    // Dictionary words for cyber passphrase generator
    const CYBER_DICTIONARY = {
        adjectives: ["cyber", "quantum", "neon", "cryptic", "phantom", "vector", "static", "obsidian", "spectral", "digital", "turbo", "sonic", "glitch", "hyper", "neural", "plasma", "carbon", "binary", "atomic", "optics"],
        nouns: ["matrix", "shield", "node", "fortress", "protocol", "grid", "synth", "pulse", "vortex", "breach", "circuit", "kernel", "cipher", "daemon", "proxy", "core", "shell", "mesh", "array", "nexus"],
        actions: ["guard", "link", "lock", "override", "forge", "trace", "bypass", "inject", "secure", "encrypt", "hack", "load", "scan", "sync", "compile"]
    };

    // ----------------------------------------------------------------------
    // DIGITAL PARTICLES CONSTELLATION BACKDROP (NATIVE HTML5 CANVAS)
    // ----------------------------------------------------------------------
    const canvas = document.getElementById("cyber-particles-canvas");
    const ctx = canvas.getContext("2d");
    
    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };

    function initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        const numParticles = Math.min(65, Math.floor((canvas.width * canvas.height) / 18000));
        
        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                radius: Math.random() * 1.5 + 0.8
            });
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            // Motion update
            p.x += p.vx;
            p.y += p.vy;
            
            // Edge collision
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            
            // Draw node particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0, 242, 254, 0.18)";
            ctx.shadowBlur = 4;
            ctx.shadowColor = "#00f2fe";
            ctx.fill();
            ctx.shadowBlur = 0; // reset shadow for performance
            
            // Mouse magnet pull logic
            if (mouse.x !== null) {
                let dx = mouse.x - p.x;
                let dy = mouse.y - p.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    p.x += dx * 0.003;
                    p.y += dy * 0.003;
                }
            }
        });

        // Draw node connectors
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = Math.sqrt(
                    Math.pow(particles[i].x - particles[j].x, 2) +
                    Math.pow(particles[i].y - particles[j].y, 2)
                );
                
                if (dist < 110) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const alpha = (1 - dist / 110) * 0.08;
                    ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                    ctx.lineWidth = 0.55;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animateParticles);
    }

    window.addEventListener("resize", () => {
        initCanvas();
        initConfettiCanvas();
    });

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });

    initCanvas();
    animateParticles();

    // ----------------------------------------------------------------------
    // CYBER PHYSICS CONFETTI ENGINE (NATIVE HTML5 CANVAS)
    // ----------------------------------------------------------------------
    const confettiCanvas = document.getElementById("confetti-canvas");
    const confettiCtx = confettiCanvas.getContext("2d");
    let confettiList = [];
    let isConfettiLoopActive = false;

    function initConfettiCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }

    function spawnConfetti(originX, originY) {
        const colors = ["#00f2fe", "#4facfe", "#22c55e", "#a855f7", "#ec4899", "#facc15"];
        const count = 95;
        
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 9 + 4;
            
            confettiList.push({
                x: originX,
                y: originY,
                vx: Math.cos(angle) * velocity + (Math.random() - 0.5) * 2,
                vy: Math.sin(angle) * velocity - Math.random() * 5 - 2, // blast slightly upward
                radius: Math.random() * 3 + 2.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                gravity: 0.18,
                decay: Math.random() * 0.015 + 0.008,
                drag: 0.96
            });
        }

        if (!isConfettiLoopActive) {
            isConfettiLoopActive = true;
            animateConfetti();
        }
    }

    function animateConfetti() {
        if (confettiList.length === 0) {
            isConfettiLoopActive = false;
            confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            return;
        }
        
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        confettiList.forEach((c, index) => {
            c.vy += c.gravity;
            c.vx *= c.drag;
            c.vy *= c.drag;
            c.x += c.vx;
            c.y += c.vy;
            c.alpha -= c.decay;
            
            if (c.alpha <= 0) {
                confettiList.splice(index, 1);
                return;
            }
            
            confettiCtx.beginPath();
            confettiCtx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
            confettiCtx.fillStyle = c.color;
            confettiCtx.globalAlpha = c.alpha;
            confettiCtx.shadowBlur = 6;
            confettiCtx.shadowColor = c.color;
            confettiCtx.fill();
            confettiCtx.shadowBlur = 0; // reset shadow
        });
        
        confettiCtx.globalAlpha = 1; // restore global alpha
        requestAnimationFrame(animateConfetti);
    }

    initConfettiCanvas();

    // ----------------------------------------------------------------------
    // HIGH-QUALITY CLINICAL TERMINAL CONSOLE LOG ENGINE
    // ----------------------------------------------------------------------
    function clearConsole() {
        leakDisplayBox.innerHTML = "";
    }

    function appendConsoleLine(message, type = "info") {
        // Strip out the previous cursor line classes
        const lines = leakDisplayBox.querySelectorAll(".console-line");
        lines.forEach(l => l.classList.remove("cursor-line"));

        const date = new Date();
        const timestamp = `[${date.toTimeString().split(" ")[0]}]`;
        
        const line = document.createElement("div");
        line.className = `console-line ${type}-line cursor-line`;
        line.innerHTML = `<span class="system-line">${timestamp} SYSTEM // </span>${message}`;
        
        leakDisplayBox.appendChild(line);
        
        // Auto scroll to make sure new logs are cleanly visible
        setTimeout(() => {
            leakDisplayBox.scrollTop = leakDisplayBox.scrollHeight;
        }, 10);
    }

    // ----------------------------------------------------------------------
    // HELPER HUD FLOATING NOTIFICATIONS
    // ----------------------------------------------------------------------
    function triggerAlert(title, message, type = "info") {
        const alert = document.createElement("div");
        alert.className = `hud-alert alert-${type}`;
        alert.innerHTML = `
            <span class="alert-title">${title}</span>
            <span class="alert-desc">${message}</span>
        `;
        
        hudAlertsBox.appendChild(alert);
        
        // Animated release after 4 seconds
        setTimeout(() => {
            alert.style.animation = "alert-fade-out 0.3s ease forwards";
            setTimeout(() => alert.remove(), 300);
        }, 4000);
    }

    // ----------------------------------------------------------------------
    // THE INPUT EYE TOGGLER
    // ----------------------------------------------------------------------
    togglePasswordBtn.addEventListener("click", () => {
        const isPassword = passwordInput.getAttribute("type") === "password";
        passwordInput.setAttribute("type", isPassword ? "text" : "password");
        
        eyeOpenIcon.classList.toggle("hidden", isPassword);
        eyeClosedIcon.classList.toggle("hidden", !isPassword);
    });

    // ----------------------------------------------------------------------
    // SHANNON ENTROPY & SECURITY SCORING ALGORITHM
    // ----------------------------------------------------------------------
    function calculateShannonEntropy(password) {
        if (!password) return 0;
        
        const len = password.length;
        const frequencies = {};
        
        for (let i = 0; i < len; i++) {
            const char = password[i];
            frequencies[char] = (frequencies[char] || 0) + 1;
        }
        
        let shannon = 0;
        for (const char in frequencies) {
            const frequency = frequencies[char] / len;
            shannon -= frequency * Math.log2(frequency);
        }
        
        let poolSize = 0;
        if (/[a-z]/.test(password)) poolSize += 26;
        if (/[A-Z]/.test(password)) poolSize += 26;
        if (/[0-9]/.test(password)) poolSize += 10;
        if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;
        if (poolSize === 0) poolSize = 1;

        const poolEntropy = len * Math.log2(poolSize);
        
        // Combined weighted index: 45% Dynamic Frequency + 55% Pool space size
        const finalEntropy = (shannon * 0.45 + (poolEntropy / len) * 0.55) * len;
        
        return Math.round(finalEntropy * 10) / 10;
    }

    function getSecurityState(entropy, length) {
        if (length === 0) return STATE_COLORS.empty;
        if (entropy < 28) return STATE_COLORS.fragile;
        if (entropy >= 28 && entropy < 50) return STATE_COLORS.weak;
        if (entropy >= 50 && entropy < 72) return STATE_COLORS.moderate;
        if (entropy >= 72 && entropy < 100) return STATE_COLORS.robust;
        return STATE_COLORS.fortified;
    }

    // ----------------------------------------------------------------------
    // ATTACK SPEED BRUTE-FORCE SIMULATOR
    // ----------------------------------------------------------------------
    function formatTimeDuration(seconds) {
        if (seconds === 0) return "Instant";
        if (seconds < 1) return "Instant (< 1 Sec)";
        if (seconds < 60) return `${Math.round(seconds * 10) / 10} Seconds`;
        
        const minutes = seconds / 60;
        if (minutes < 60) return `${Math.round(minutes * 10) / 10} Minutes`;
        
        const hours = minutes / 60;
        if (hours < 24) return `${Math.round(hours * 10) / 10} Hours`;
        
        const days = hours / 24;
        if (days < 365) return `${Math.round(days * 10) / 10} Days`;
        
        const years = days / 365;
        if (years < 100) return `${Math.round(years * 10) / 10} Years`;
        if (years < 1000000) return `${Math.round(years)} Years`;
        
        const millions = years / 1000000;
        if (millions < 1000) return `${Math.round(millions * 10) / 10} Million Years`;
        
        const billions = millions / 1000;
        if (billions < 1000) return `${Math.round(billions * 10) / 10} Billion Years`;
        
        const trillions = billions / 1000;
        return `${Math.round(trillions * 10) / 10} Trillion Years`;
    }

    function updateSimulator(entropy) {
        if (entropy === 0) {
            timePhone.textContent = "Instant";
            timeRig.textContent = "Instant";
            timeSuper.textContent = "Instant";
            timeQuantum.textContent = "Instant";
            return;
        }

        const searchSpace = Math.pow(2, entropy);

        const smartphoneSpeed = 1.0e4; 
        const fastRigSpeed = 3.5e9;    
        const supercomputerSpeed = 1.0e12; 

        const quantumSearchSpace = Math.pow(2, entropy / 2);
        const quantumSpeed = 1.0e9; 

        const timePhoneSec = (searchSpace / 2) / smartphoneSpeed;
        const timeRigSec = (searchSpace / 2) / fastRigSpeed;
        const timeSuperSec = (searchSpace / 2) / supercomputerSpeed;
        const timeQuantumSec = (quantumSearchSpace / 2) / quantumSpeed;

        timePhone.textContent = formatTimeDuration(timePhoneSec);
        timeRig.textContent = formatTimeDuration(timeRigSec);
        timeSuper.textContent = formatTimeDuration(timeSuperSec);
        timeQuantum.textContent = formatTimeDuration(timeQuantumSec);

        document.querySelector("#vector-phone").style.setProperty("--row-time-color", timePhoneSec < 3600 ? "345, 100%, 60%" : "145, 100%, 45%");
        document.querySelector("#vector-rig").style.setProperty("--row-time-color", timeRigSec < 3600 * 24 ? "345, 100%, 60%" : (timeRigSec < 3600 * 24 * 365 ? "45, 100%, 50%" : "145, 100%, 45%"));
        document.querySelector("#vector-super").style.setProperty("--row-time-color", timeSuperSec < 3600 * 24 * 365 ? "345, 100%, 60%" : (timeSuperSec < 3600 * 24 * 365 * 1000 ? "45, 100%, 50%" : "145, 100%, 45%"));
        document.querySelector("#vector-quantum").style.setProperty("--row-time-color", timeQuantumSec < 3600 * 24 * 365 ? "345, 100%, 60%" : (timeQuantumSec < 3600 * 24 * 365 * 100 ? "45, 100%, 50%" : "145, 100%, 45%"));
    }

    // ----------------------------------------------------------------------
    // CLIENT HASH ENGINES
    // ----------------------------------------------------------------------
    async function sha1Hex(str) {
        const buffer = new TextEncoder().encode(str);
        const hashBuffer = await window.crypto.subtle.digest("SHA-1", buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
    }

    // ----------------------------------------------------------------------
    // SECURE K-ANONYMITY DATAPORT
    // ----------------------------------------------------------------------
    async function checkPasswordBreach(password) {
        if (!password || password.length < 3) {
            leakIndicator.className = "hud-indicator";
            clearConsole();
            appendConsoleLine("Standing by for cryptanalysis inputs...", "system");
            return;
        }

        leakIndicator.className = "hud-indicator scanning";
        clearConsole();
        appendConsoleLine("Initializing client-side hashing encryption...", "scanning");

        try {
            const fullHash = await sha1Hex(password);
            const prefix = fullHash.substring(0, 5);
            const suffixTarget = fullHash.substring(5);

            appendConsoleLine(`Local SHA-1 hash generated: ${prefix}...${suffixTarget.substring(suffixTarget.length - 8)}`, "info");
            appendConsoleLine(`Querying HIBP ledger via k-Anonymity protocol (Target Prefix: ${prefix})...`, "scanning");

            const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
            
            if (!response.ok) {
                throw new Error("Ledger handshake dropped by target API server.");
            }

            const text = await response.text();
            const lines = text.split("\n");
            
            let leakCount = 0;
            for (const line of lines) {
                const [suffix, count] = line.trim().split(":");
                if (suffix === suffixTarget) {
                    leakCount = parseInt(count, 10);
                    break;
                }
            }

            if (leakCount > 0) {
                leakIndicator.className = "hud-indicator compromised";
                appendConsoleLine(`☣️ EXPLOIT VERIFICATION: compromises found: ${leakCount.toLocaleString()} times in leaks. DO NOT REUSE!`, "danger");
                triggerAlert("Vulnerability Flagged!", `Compromised ${leakCount.toLocaleString()} times in past public data breaches!`, "danger");
            } else {
                leakIndicator.className = "hud-indicator safe";
                appendConsoleLine("🛡️ SYSTEM SAFE: Zero compromised matches in global data breach archives.", "safe");
            }

            logSessionAudit(password, getSecurityState(calculateShannonEntropy(password), password.length), leakCount);

        } catch (error) {
            leakIndicator.className = "hud-indicator";
            appendConsoleLine(`Warning: network bypass check offline (${error.message})`, "info");
        }
    }

    // ----------------------------------------------------------------------
    // CORE DYNAMIC INTERFACES BINDINGS
    // ----------------------------------------------------------------------
    function updateAnalyzerState() {
        const password = passwordInput.value;
        const len = password.length;
        const entropy = calculateShannonEntropy(password);
        const state = getSecurityState(entropy, len);

        document.documentElement.style.setProperty("--active-state-hue", state.hue);
        document.documentElement.style.setProperty("--active-state-rgb", state.rgb);
        document.documentElement.style.setProperty("--gauge-color-hue", state.hue);

        entropyValue.textContent = entropy.toFixed(1);
        securityGrade.textContent = state.label;

        // Sync with Three.js 3D Visualizer Core
        const stateKey = Object.keys(STATE_COLORS).find(key => STATE_COLORS[key] === state) || "empty";
        if (typeof updateThreeJSParameters === "function") {
            updateThreeJSParameters(stateKey, entropy);
        }

        const maxExpectedEntropy = 120;
        const mappedProgress = Math.min(1, entropy / maxExpectedEntropy);
        const offset = 263.8 - (263.8 * mappedProgress);
        gaugeFill.style.strokeDashoffset = offset;

        updateMatrixBadge(matrixLength, len >= 8, `${len} / 8`);
        updateMatrixBadge(matrixUpper, /[A-Z]/.test(password), /[A-Z]/.test(password) ? "Met" : "None");
        updateMatrixBadge(matrixLower, /[a-z]/.test(password), /[a-z]/.test(password) ? "Met" : "None");
        updateMatrixBadge(matrixNumber, /[0-9]/.test(password), /[0-9]/.test(password) ? "Met" : "None");
        updateMatrixBadge(matrixSymbol, /[^a-zA-Z0-9]/.test(password), /[^a-zA-Z0-9]/.test(password) ? "Met" : "None");

        updateSimulator(entropy);

        // Run upgraded sub-modules
        if (typeof updatePatternInspector === "function") {
            updatePatternInspector(password);
        }
        if (typeof updateHashLaboratory === "function") {
            updateHashLaboratory(password);
        }

        clearTimeout(breachDebounceTimer);
        clearTimeout(realTimeCrackTimer);
        if (len >= 3) {
            breachDebounceTimer = setTimeout(() => {
                checkPasswordBreach(password);
            }, 700);
            
            realTimeCrackTimer = setTimeout(() => {
                startCrackingSimulation(password);
            }, 250);
        } else {
            leakIndicator.className = "hud-indicator";
            clearConsole();
            appendConsoleLine("Standing by for cryptanalysis inputs...", "system");
            stopCrackingSimulation();
        }
    }

    function updateMatrixBadge(badge, met, valText) {
        if (met) {
            badge.classList.add("active-met");
            badge.style.setProperty("--badge-glow-rgb", "0, 242, 254");
        } else {
            badge.classList.remove("active-met");
        }
        badge.querySelector(".badge-value").textContent = valText;
    }

    passwordInput.addEventListener("input", updateAnalyzerState);

    // ----------------------------------------------------------------------
    // SESSION AUDIT REGISTRY ENGINE
    // ----------------------------------------------------------------------
    function logSessionAudit(password, state, leakCount) {
        if (!password || password.length === 0) return;
        
        const masked = password[0] + "••••" + (password.length > 5 ? password[password.length - 1] : "•");
        
        if (activeSessionLogs.some(log => log.masked === masked && log.score === state.label)) return;

        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        const logItem = {
            masked,
            time: timeString,
            score: state.label,
            rgb: state.rgb,
            leakCount
        };

        activeSessionLogs.unshift(logItem);
        if (activeSessionLogs.length > 5) activeSessionLogs.pop();

        renderSessionLogs();
    }

    function renderSessionLogs() {
        if (activeSessionLogs.length === 0) {
            auditListBox.innerHTML = '<div class="audit-empty">No active security records checked in this session.</div>';
            return;
        }

        auditListBox.innerHTML = activeSessionLogs.map(log => `
            <div class="audit-item" style="animation-delay: 50ms;">
                <div class="audit-meta">
                    <span class="audit-masked">${log.masked}</span>
                    <span class="audit-time">Timestamp: ${log.time}</span>
                </div>
                <div class="audit-badge" style="--badge-color-rgb: ${log.rgb}">
                    ${log.score} ${log.leakCount > 0 ? `// COMPROMISED` : '// SAFE'}
                </div>
            </div>
        `).join("");
    }

    clearAuditBtn.addEventListener("click", () => {
        activeSessionLogs = [];
        renderSessionLogs();
        triggerAlert("Audit Purged", "Local session history cleared successfully.", "success");
    });

    // ----------------------------------------------------------------------
    // ADVANCED ARCHITECT GENERATORS
    // ----------------------------------------------------------------------
    tabChar.addEventListener("click", () => {
        activeTab = "char";
        tabChar.classList.add("active");
        tabPhrase.classList.remove("active");
        charControls.classList.remove("hidden");
        phraseControls.classList.add("hidden");
        generateSecureToken();
    });

    tabPhrase.addEventListener("click", () => {
        activeTab = "phrase";
        tabPhrase.classList.add("active");
        tabChar.classList.remove("active");
        phraseControls.classList.remove("hidden");
        charControls.classList.add("hidden");
        generateSecureToken();
    });

    lengthSlider.addEventListener("input", () => {
        sliderLengthVal.textContent = lengthSlider.value;
        generateSecureToken();
    });

    function generateRandomChars(length) {
        const uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowers = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

        let pool = "";
        let finalPassword = "";

        if (genUpper.checked) { pool += uppers; finalPassword += uppers[Math.floor(Math.random() * uppers.length)]; }
        if (genLower.checked) { pool += lowers; finalPassword += lowers[Math.floor(Math.random() * lowers.length)]; }
        if (genNumbers.checked) { pool += numbers; finalPassword += numbers[Math.floor(Math.random() * numbers.length)]; }
        if (genSymbols.checked) { pool += symbols; finalPassword += symbols[Math.floor(Math.random() * symbols.length)]; }

        if (pool.length === 0) {
            return "Please select characters";
        }

        const fillLength = length - finalPassword.length;
        for (let i = 0; i < fillLength; i++) {
            finalPassword += pool[Math.floor(Math.random() * pool.length)];
        }

        return finalPassword.split("").sort(() => 0.5 - Math.random()).join("");
    }

    function generateCyberPhrase(length) {
        let parts = [];
        let wordCount = 3;
        if (length > 24) wordCount = 4;
        if (length > 40) wordCount = 5;

        for (let i = 0; i < wordCount; i++) {
            let collection;
            if (i % 3 === 0) collection = CYBER_DICTIONARY.adjectives;
            else if (i % 3 === 1) collection = CYBER_DICTIONARY.nouns;
            else collection = CYBER_DICTIONARY.actions;

            let word = collection[Math.floor(Math.random() * collection.length)];
            
            if (genCap.checked) {
                word = word.charAt(0).toUpperCase() + word.slice(1);
            }
            parts.push(word);
        }

        const separator = genSep.checked ? "-" : "";
        let passphrase = parts.join(separator);

        const numbersList = "0123456789";
        const symbolsList = "!@#$%*?";
        
        let suffix = "";
        suffix += numbersList[Math.floor(Math.random() * numbersList.length)];
        suffix += symbolsList[Math.floor(Math.random() * symbolsList.length)];
        
        passphrase += suffix;

        return passphrase;
    }

    function generateSecureToken() {
        let result = "";
        const targetLength = parseInt(lengthSlider.value, 10);

        if (activeTab === "char") {
            result = generateRandomChars(targetLength);
        } else {
            result = generateCyberPhrase(targetLength);
        }

        generatedDisplay.textContent = result;
    }

    generateTrigger.addEventListener("click", generateSecureToken);

    [genUpper, genLower, genNumbers, genSymbols, genSep, genCap].forEach(el => {
        el.addEventListener("change", generateSecureToken);
    });

    // ----------------------------------------------------------------------
    // THE COPY & CONFETTI ENGINE
    // ----------------------------------------------------------------------
    copyBtn.addEventListener("click", (e) => {
        const textToCopy = generatedDisplay.textContent;
        
        if (textToCopy === "Please select characters" || textToCopy.startsWith("Generating")) return;

        navigator.clipboard.writeText(textToCopy).then(() => {
            const tooltip = copyBtn.querySelector(".copy-tooltip");
            tooltip.textContent = "COPIED!";
            
            triggerAlert("Access Copied!", "Generated token successfully copied to safety board.", "success");
            
            // Trigger particle blast!
            const rect = copyBtn.getBoundingClientRect();
            spawnConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
            
            setTimeout(() => {
                tooltip.textContent = "COPY";
            }, 2000);
        }).catch(() => {
            triggerAlert("Process Error", "Clipboard copy rejected by OS.", "danger");
        });
    });

    // Initial console logs
    clearConsole();
    appendConsoleLine("FortressPass cybersecurity node online.", "system");
    appendConsoleLine("Standing by for cryptanalysis inputs...", "system");

    // ----------------------------------------------------------------------
    // THREE.JS 3D HOLOGRAM SHIELD ENGINE
    // ----------------------------------------------------------------------
    const threejsContainer = document.getElementById("threejs-container");
    const svgContainer = document.getElementById("svg-container");
    const toggle3dBtn = document.getElementById("toggle-3d-btn");
    
    let threeActive = true;
    let scene, camera, renderer;
    let hologramSphere, particleSystem, outerRing1, outerRing2;
    let animationFrameId = null;
    let currentThemeColor = new THREE.Color("#64748b");
    let targetThemeColor = new THREE.Color("#64748b");
    
    // Target parameters for animation smoothing
    let visualParams = {
        rotationSpeed: 0.004,
        targetRotationSpeed: 0.004,
        wobble: 0.0,
        targetWobble: 0.0,
        scale: 1.0,
        targetScale: 1.0,
        ringsVisible: 0,
        targetRingsVisible: 0
    };

    function initThreeJS() {
        if (!threejsContainer) return;
        
        try {
            // Scene & Camera
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
            camera.position.z = 13;
            
            // Renderer
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(threejsContainer.clientWidth, threejsContainer.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            threejsContainer.appendChild(renderer.domElement);
            
            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            
            const pointLight = new THREE.PointLight(0xffffff, 1.5, 30);
            pointLight.position.set(5, 5, 8);
            scene.add(pointLight);

            // Hologram Sphere - low poly look
            const geo = new THREE.IcosahedronGeometry(2.4, 1);
            const mat = new THREE.MeshBasicMaterial({
                color: 0x64748b,
                wireframe: true,
                transparent: true,
                opacity: 0.6
            });
            hologramSphere = new THREE.Mesh(geo, mat);
            scene.add(hologramSphere);

            // Store original coordinates for wobbly simulations
            const positionAttribute = hologramSphere.geometry.attributes.position;
            const originalPositions = positionAttribute.clone();
            hologramSphere.geometry.userData = { originalPositions };

            // Security orbital shields (Rings)
            const ringGeo1 = new THREE.TorusGeometry(3.5, 0.03, 8, 48);
            const ringMat1 = new THREE.MeshBasicMaterial({
                color: 0x64748b,
                wireframe: true,
                transparent: true,
                opacity: 0.0
            });
            outerRing1 = new THREE.Mesh(ringGeo1, ringMat1);
            outerRing1.rotation.x = Math.PI / 3;
            scene.add(outerRing1);

            const ringGeo2 = new THREE.TorusGeometry(4.0, 0.03, 8, 48);
            const ringMat2 = new THREE.MeshBasicMaterial({
                color: 0x64748b,
                wireframe: true,
                transparent: true,
                opacity: 0.0
            });
            outerRing2 = new THREE.Mesh(ringGeo2, ringMat2);
            outerRing2.rotation.y = Math.PI / 4;
            scene.add(outerRing2);

            // Particle matrix system orbiting the sphere core
            const particleCount = 280;
            const particleGeo = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const originalPoints = new Float32Array(particleCount * 3);
            const rates = new Float32Array(particleCount);

            for (let i = 0; i < particleCount; i++) {
                const u = Math.random();
                const v = Math.random();
                const theta = u * 2.0 * Math.PI;
                const phi = Math.acos(2.0 * v - 1.0);
                const r = 2.6 + Math.random() * 1.0;
                
                positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
                positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                positions[i * 3 + 2] = r * Math.cos(phi);
                
                originalPoints[i * 3] = positions[i * 3];
                originalPoints[i * 3 + 1] = positions[i * 3 + 1];
                originalPoints[i * 3 + 2] = positions[i * 3 + 2];
                rates[i] = 0.5 + Math.random() * 1.5;
            }

            particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
            particleGeo.userData = { originalPoints, rates };

            const particleMat = new THREE.PointsMaterial({
                color: 0x64748b,
                size: 0.08,
                transparent: true,
                opacity: 0.7
            });
            particleSystem = new THREE.Points(particleGeo, particleMat);
            scene.add(particleSystem);

            // Observe element resizing to scale ThreeJS layout correctly
            const resizeObserver = new ResizeObserver(() => {
                const width = threejsContainer.clientWidth || 220;
                const height = threejsContainer.clientHeight || 220;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            });
            resizeObserver.observe(threejsContainer);

            // Launch rendering
            animateThreeJS(0);
        } catch (err) {
            console.warn("WebGL is unsupported or blocked. Standard visualizer engaged.", err);
            disable3DMode();
        }
    }

    function animateThreeJS(time) {
        if (!threeActive) return;
        animationFrameId = requestAnimationFrame(animateThreeJS);

        const clockTime = time * 0.001;

        // Smooth animations
        visualParams.rotationSpeed += (visualParams.targetRotationSpeed - visualParams.rotationSpeed) * 0.1;
        visualParams.wobble += (visualParams.targetWobble - visualParams.wobble) * 0.1;
        visualParams.scale += (visualParams.targetScale - visualParams.scale) * 0.1;
        visualParams.ringsVisible += (visualParams.targetRingsVisible - visualParams.ringsVisible) * 0.1;

        currentThemeColor.lerp(targetThemeColor, 0.08);

        if (hologramSphere) {
            hologramSphere.material.color.copy(currentThemeColor);
            
            const pulse = 1.0 + Math.sin(clockTime * 3.0) * (0.01 + visualParams.wobble * 0.04);
            const dynamicScale = visualParams.scale * pulse;
            hologramSphere.scale.set(dynamicScale, dynamicScale, dynamicScale);

            hologramSphere.rotation.y += visualParams.rotationSpeed;
            hologramSphere.rotation.x += visualParams.rotationSpeed * 0.4;

            // Wobbly shader logic
            const posAttr = hologramSphere.geometry.attributes.position;
            const origPosAttr = hologramSphere.geometry.userData.originalPositions;
            
            for (let i = 0; i < posAttr.count; i++) {
                const ox = origPosAttr.getX(i);
                const oy = origPosAttr.getY(i);
                const oz = origPosAttr.getZ(i);

                const wave = clockTime * 6.0 + (ox + oy + oz) * 2.0;
                const amplitude = visualParams.wobble * 0.35;
                
                posAttr.setXYZ(
                    i,
                    ox + Math.sin(wave) * amplitude,
                    oy + Math.cos(wave * 1.1) * amplitude,
                    oz + Math.sin(wave * 0.9) * amplitude
                );
            }
            posAttr.needsUpdate = true;
        }

        if (particleSystem) {
            particleSystem.material.color.copy(currentThemeColor);
            particleSystem.rotation.y -= visualParams.rotationSpeed * 0.6;
            particleSystem.rotation.z += visualParams.rotationSpeed * 0.2;
            
            const positions = particleSystem.geometry.attributes.position.array;
            const original = particleSystem.geometry.userData.originalPoints;
            const rates = particleSystem.geometry.userData.rates;
            
            for (let i = 0; i < positions.length / 3; i++) {
                const idx = i * 3;
                const rx = original[idx];
                const ry = original[idx + 1];
                const rz = original[idx + 2];
                const rate = rates[i];
                
                const expansion = 1.0 + Math.sin(clockTime * rate * 2.0 + rate) * (0.04 + visualParams.wobble * 0.12);
                positions[idx] = rx * expansion;
                positions[idx + 1] = ry * expansion;
                positions[idx + 2] = rz * expansion;
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;
        }

        if (outerRing1) {
            outerRing1.material.color.copy(currentThemeColor);
            outerRing1.material.opacity = Math.max(0, Math.min(0.5, visualParams.ringsVisible * 0.5));
            outerRing1.rotation.y += visualParams.rotationSpeed * 1.3;
            outerRing1.rotation.x -= visualParams.rotationSpeed * 0.3;
            outerRing1.scale.setScalar(visualParams.scale);
        }

        if (outerRing2) {
            outerRing2.material.color.copy(currentThemeColor);
            outerRing2.material.opacity = Math.max(0, Math.min(0.35, (visualParams.ringsVisible - 1.0) * 0.35));
            outerRing2.rotation.x -= visualParams.rotationSpeed * 1.1;
            outerRing2.rotation.z += visualParams.rotationSpeed * 0.5;
            outerRing2.scale.setScalar(visualParams.scale);
        }

        renderer.render(scene, camera);
    }

    // Export parameter update logic to scope
    window.updateThreeJSParameters = updateThreeJSParameters;

    function updateThreeJSParameters(stateKey, entropy) {
        let colorHex = "#64748b";
        let speed = 0.004;
        let wobble = 0.0;
        let scale = 1.0;
        let ringCount = 0;
        
        if (entropy > 0) {
            switch(stateKey) {
                case "fragile":
                    colorHex = "#ef4444";
                    speed = 0.007;
                    wobble = 0.38;
                    scale = 0.85;
                    ringCount = 0;
                    break;
                case "weak":
                    colorHex = "#f97316";
                    speed = 0.011;
                    wobble = 0.22;
                    scale = 0.95;
                    ringCount = 0;
                    break;
                case "moderate":
                    colorHex = "#eab308";
                    speed = 0.02;
                    wobble = 0.08;
                    scale = 1.0;
                    ringCount = 1.0;
                    break;
                case "robust":
                    colorHex = "#06b6d4";
                    speed = 0.035;
                    wobble = 0.02;
                    scale = 1.08;
                    ringCount = 1.4;
                    break;
                case "fortified":
                    colorHex = "#22c55e";
                    speed = 0.052;
                    wobble = 0.0;
                    scale = 1.15;
                    ringCount = 2.0;
                    break;
            }
        }
        
        targetThemeColor.set(colorHex);
        visualParams.targetRotationSpeed = speed;
        visualParams.targetWobble = wobble;
        visualParams.targetScale = scale;
        visualParams.targetRingsVisible = ringCount;
    }

    function disable3DMode() {
        threeActive = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        if (threejsContainer) threejsContainer.classList.add("hidden");
        if (svgContainer) svgContainer.classList.remove("hidden");
        if (toggle3dBtn) {
            toggle3dBtn.textContent = "3D ENGINE OFFLINE";
            toggle3dBtn.classList.add("fallback-active");
        }
    }

    function enable3DMode() {
        if (svgContainer) svgContainer.classList.add("hidden");
        if (threejsContainer) threejsContainer.classList.remove("hidden");
        if (toggle3dBtn) {
            toggle3dBtn.textContent = "3D ENGINE ACTIVE";
            toggle3dBtn.classList.remove("fallback-active");
        }
        
        threeActive = true;
        if (!scene) {
            initThreeJS();
        } else {
            animateThreeJS(0);
        }
    }

    if (toggle3dBtn) {
        toggle3dBtn.addEventListener("click", () => {
            if (threeActive) {
                disable3DMode();
                triggerAlert("Hologram Core Suspended", "WebGL engine offline. Fallback 2D metrics engaged.", "info");
            } else {
                enable3DMode();
                triggerAlert("Hologram Core Active", "3D visualizer core online.", "success");
            }
        });
    }

    // Initialize WebGL Visualizer
    initThreeJS();

    // ----------------------------------------------------------------------
    // GLASS PANELS 3D PARALLAX TILT ACTION
    // ----------------------------------------------------------------------
    const glassPanels = document.querySelectorAll(".glass-panel");
    
    glassPanels.forEach(panel => {
        panel.addEventListener("mousemove", (e) => {
            const rect = panel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const tiltX = (y / rect.height - 0.5) * 12; // tilt max 6deg
            const tiltY = (0.5 - x / rect.width) * 12;
            
            panel.classList.add("tilting");
            panel.style.setProperty("--rx", `${tiltX}deg`);
            panel.style.setProperty("--ry", `${tiltY}deg`);
        });
        
        panel.addEventListener("mouseleave", () => {
            panel.classList.remove("tilting");
            panel.style.removeProperty("--rx");
            panel.style.removeProperty("--ry");
        });
    });

    // ----------------------------------------------------------------------
    // CYBER TOGGLE CELLS INITIALIZATION & SYNC
    // ----------------------------------------------------------------------
    const toggleCells = document.querySelectorAll(".cyber-toggle-cell");
    toggleCells.forEach(cell => {
        const checkbox = cell.querySelector("input[type='checkbox']");
        if (!checkbox) return;
        
        const updateVisuals = () => {
            const isActive = checkbox.checked;
            cell.classList.toggle("active", isActive);
            const led = cell.querySelector(".indicator-led");
            const text = cell.querySelector(".indicator-text");
            if (led) {
                led.classList.toggle("led-on", isActive);
            }
            if (text) {
                text.textContent = isActive ? "ACTIVE" : "OFFLINE";
            }
        };

        // Sync initial state on load
        updateVisuals();

        // Handle cell clicks
        cell.addEventListener("click", (e) => {
            if (e.target === checkbox) return;
            
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event("change"));
            updateVisuals();
            
            cell.classList.add("clicked");
            setTimeout(() => cell.classList.remove("clicked"), 150);
        });

        // Sync visual changes if programmatically changed
        checkbox.addEventListener("change", () => {
            updateVisuals();
        });
    });


    // ==========================================================================
    // SPA ROUTING CONTROLLER
    // ==========================================================================
    const navTabs = document.querySelectorAll(".nav-tab");
    const viewSections = document.querySelectorAll(".view-section");

    navTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const targetViewId = tab.getAttribute("data-view");
            
            navTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            
            viewSections.forEach(section => {
                if (section.id === targetViewId) {
                    section.classList.remove("hidden");
                    section.classList.add("active");
                    
                    // Trigger canvas redraws or sizing updates on reveal
                    if (targetViewId === "view-biometrics") {
                        drawBiometricsGraph();
                    } else if (targetViewId === "view-cracking") {
                        initCrackingMatrixCanvas();
                    }
                } else {
                    section.classList.remove("active");
                    section.classList.add("hidden");
                }
            });
            
            triggerAlert("Dashboard Routing", `Switched view-channel to: ${tab.textContent.replace(/[^A-Z]/g, '')}`, "info");
        });
    });

    // ==========================================================================
    // ADVANCED MODULE 1: WEB WORKER CRACKING SIMULATOR
    // ==========================================================================
    const crackCanvas = document.getElementById("cracking-canvas");
    const startCrackBtn = document.getElementById("start-crack-btn");
    const crackStatusLbl = document.getElementById("crack-status-lbl");
    const crackCurrentGuess = document.getElementById("crack-current-guess");
    const crackProgressBar = document.getElementById("crack-progress-bar");
    const crackProgressPct = document.getElementById("crack-progress-pct");
    const crackTargetPassword = document.getElementById("crack-target-password");
    const crackActiveSpeed = document.getElementById("crack-active-speed");
    const crackTimeElapsed = document.getElementById("crack-time-elapsed");
    const crackTimeRemaining = document.getElementById("crack-time-remaining");
    const rigCells = document.querySelectorAll(".rig-select-cell");

    let crackWorker = null;
    let isCracking = false;
    let activeCrackSpeed = 150000; // default Smartphone speed
    let crackingMatrixInterval = null;

    // Inline Web Worker Code Blob
    const workerScript = `
        let crackInterval = null;
        self.onmessage = function(e) {
            const { action, password, speed, mode, vulnerableList } = e.data;
            if (action === "start") {
                if (crackInterval) clearInterval(crackInterval);
                
                let progress = 0;
                let elapsed = 0;
                const length = password.length;
                const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
                
                if (mode === "dict") {
                    // DICTIONARY ATTACK MODE
                    let index = 0;
                    const totalDict = vulnerableList.length;
                    
                    crackInterval = setInterval(() => {
                        elapsed += 0.08;
                        const checks = Math.floor(speed * 0.08);
                        index += checks;
                        
                        let guess = vulnerableList[Math.floor(Math.random() * totalDict)] || "password";
                        const dictionaryHit = vulnerableList.includes(password.toLowerCase());
                        
                        if (index >= totalDict || dictionaryHit) {
                            clearInterval(crackInterval);
                            self.postMessage({
                                status: "cracked",
                                guess: password,
                                progress: 100,
                                elapsed: elapsed,
                                remaining: 0
                            });
                        } else {
                            progress = Math.min(99.98, (index / totalDict) * 100);
                            self.postMessage({
                                status: "running",
                                guess: guess,
                                progress: progress,
                                elapsed: elapsed,
                                remaining: Math.max(0.1, (totalDict - index) / speed)
                            });
                        }
                    }, 80);
                } else if (mode === "hybrid") {
                    // HYBRID MUTATOR MODE
                    let step = 0;
                    const totalMutations = 10000;
                    const bases = ["admin", "root", "password", "secret", "guest", "qwerty", "dragon", "pass123"];
                    
                    crackInterval = setInterval(() => {
                        elapsed += 0.08;
                        const checks = Math.floor(speed * 0.08);
                        step += checks;
                        
                        const base = bases[Math.floor(Math.random() * bases.length)];
                        const suffix = Math.floor(Math.random() * 1000);
                        const mutations = [
                            base,
                            base.toUpperCase(),
                            base + suffix,
                            base.charAt(0).toUpperCase() + base.slice(1) + "!",
                            "@" + base + "123",
                            base.replace(/e/g, "3").replace(/o/g, "0").replace(/a/g, "@")
                        ];
                        const guess = mutations[Math.floor(Math.random() * mutations.length)];
                        
                        const isHybridSusceptible = bases.some(b => password.toLowerCase().includes(b));
                        
                        if (step >= totalMutations || isHybridSusceptible) {
                            clearInterval(crackInterval);
                            self.postMessage({
                                status: "cracked",
                                guess: password,
                                progress: 100,
                                elapsed: elapsed,
                                remaining: 0
                            });
                        } else {
                            progress = Math.min(99.98, (step / totalMutations) * 100);
                            self.postMessage({
                                status: "running",
                                guess: guess,
                                progress: progress,
                                elapsed: elapsed,
                                remaining: Math.max(0.1, (totalMutations - step) / speed)
                            });
                        }
                    }, 80);
                } else {
                    // BRUTE FORCE MODE
                    const charSpace = (/[A-Z]/.test(password) ? 26 : 0) + (/[a-z]/.test(password) ? 26 : 0) + (/[0-9]/.test(password) ? 10 : 0) + (/[^a-zA-Z0-9]/.test(password) ? 32 : 0);
                    const pool = charSpace || 1;
                    const totalEntropySpace = Math.pow(pool, Math.min(length, 6)); 
                    
                    crackInterval = setInterval(() => {
                        elapsed += 0.08;
                        const hashesTested = speed * elapsed;
                        progress = Math.min(99.98, (hashesTested / totalEntropySpace) * 100);
                        
                        let guessMask = "";
                        const revealedChars = Math.floor((progress / 100) * length);
                        for (let i = 0; i < length; i++) {
                            if (i < revealedChars) {
                                guessMask += password[i];
                            } else if (i === revealedChars) {
                                guessMask += charset[Math.floor(Math.random() * charset.length)];
                            } else {
                                guessMask += "•";
                            }
                        }
                        
                        const timeRemaining = Math.max(0, (totalEntropySpace - hashesTested) / speed);
                        
                        if (progress >= 99.9 || hashesTested >= totalEntropySpace) {
                            clearInterval(crackInterval);
                            self.postMessage({
                                status: "cracked",
                                guess: password,
                                progress: 100,
                                elapsed: elapsed,
                                remaining: 0
                            });
                        } else {
                            self.postMessage({
                                status: "running",
                                guess: guessMask,
                                progress: progress,
                                elapsed: elapsed,
                                remaining: timeRemaining
                            });
                        }
                    }, 80);
                }
            } else if (action === "stop") {
                if (crackInterval) {
                    clearInterval(crackInterval);
                    crackInterval = null;
                }
            }
        };
    `;

    let selectedAttackMode = "brute";
    const attackModeCells = document.querySelectorAll(".attack-mode-cell");
    attackModeCells.forEach(cell => {
        cell.addEventListener("click", () => {
            if (isCracking) {
                stopCrackingSimulation();
            }
            attackModeCells.forEach(c => c.classList.remove("active"));
            cell.classList.add("active");
            selectedAttackMode = cell.getAttribute("data-mode");
            triggerAlert("Strategy Shift", `Attack vector set to: ${selectedAttackMode.toUpperCase()}`, "success");
            
            const pass = passwordInput.value;
            if (pass && pass.length > 0) {
                startCrackingSimulation(pass);
            }
        });
    });

    function renderThreadCores(running, cracked = false) {
        const threadGrid = document.getElementById("thread-core-grid");
        if (!threadGrid) return;
        
        let cores = 8;
        if (activeCrackSpeed >= 25000000000) cores = 16;
        if (activeCrackSpeed >= 8000000000000) cores = 32;
        
        if (cores === 32) {
            threadGrid.style.gridTemplateColumns = "repeat(8, 1fr)";
        } else if (cores === 16) {
            threadGrid.style.gridTemplateColumns = "repeat(8, 1fr)";
        } else {
            threadGrid.style.gridTemplateColumns = "repeat(4, 1fr)";
        }
        
        threadGrid.innerHTML = "";
        for (let i = 0; i < cores; i++) {
            const core = document.createElement("div");
            core.className = "thread-core";
            if (running) {
                core.classList.add("active");
                core.style.animationDelay = `${Math.random() * 500}ms`;
            }
            if (cracked) {
                core.classList.add("active", "cracked");
                core.style.animation = "none";
            }
            threadGrid.appendChild(core);
        }
    }

    // Initialize Web Worker instance
    function initCrackWorker() {
        if (crackWorker) return; // Keep worker alive, do not terminate/re-create!
        const blob = new Blob([workerScript], { type: "application/javascript" });
        crackWorker = new Worker(URL.createObjectURL(blob));
        
        crackWorker.onmessage = function(e) {
            const { status, guess, progress, elapsed, remaining } = e.data;
            
            crackCurrentGuess.textContent = `MASK: ${guess}`;
            crackProgressBar.style.width = `${progress}%`;
            crackProgressPct.textContent = `${progress.toFixed(2)}% SYNCED`;
            crackTimeElapsed.textContent = `${elapsed.toFixed(2)}s`;
            if (remaining === 0 || status === "cracked") {
                stopCrackingSimulation();
                renderThreadCores(true, true);
                crackStatusLbl.textContent = "STATUS: PASSWORD EXPLOITED";
                crackStatusLbl.style.color = "#ef4444";
                crackTimeRemaining.textContent = "0.00s (Cracked)";
                triggerAlert("Simulator Finished", "Target password cracked successfully.", "danger");
            } else {
                crackTimeRemaining.textContent = formatTimeDuration(remaining);
            }
        };
    }

    // Rig profile selection click handling
    rigCells.forEach(cell => {
        cell.addEventListener("click", () => {
            if (isCracking) {
                stopCrackingSimulation();
            }
            rigCells.forEach(c => c.classList.remove("active"));
            cell.classList.add("active");
            activeCrackSpeed = parseInt(cell.getAttribute("data-speed"), 10);
            crackActiveSpeed.textContent = `${activeCrackSpeed.toLocaleString()} /s`;
            triggerAlert("Rig Swapped", `Rig speed adjusted to ${activeCrackSpeed.toLocaleString()} guesses/sec.`, "success");
            
            const pass = passwordInput.value;
            if (pass && pass.length > 0) {
                startCrackingSimulation(pass);
            }
        });
    });

    startCrackBtn.addEventListener("click", () => {
        if (isCracking) {
            stopCrackingSimulation();
            triggerAlert("Simulator Aborted", "Security core force terminated the simulation.", "info");
        } else {
            const pass = passwordInput.value;
            if (!pass || pass.length === 0) {
                triggerAlert("Simulation Blocked", "Enter a password in the Scanner view first.", "warning");
                return;
            }
            startCrackingSimulation(pass);
        }
    });

    function startCrackingSimulation(password) {
        isCracking = true;
        startCrackBtn.querySelector("span").textContent = "FORCE TERMINATE ATTACK";
        startCrackBtn.style.background = "var(--grad-cyber-red)";
        crackStatusLbl.textContent = "STATUS: DECRYPTING CELL CORES...";
        crackStatusLbl.style.color = "#eab308";
        crackTargetPassword.textContent = "•".repeat(password.length) + ` (${password.length} chars)`;
        
        initCrackWorker();
        renderThreadCores(true);
        crackWorker.postMessage({
            action: "start",
            password: password,
            speed: activeCrackSpeed,
            mode: selectedAttackMode,
            vulnerableList: VULNERABLE_DICTIONARY
        });
        
        // Start Matrix visualizer animation
        startCrackingMatrixAnim();
    }

    function stopCrackingSimulation() {
        isCracking = false;
        startCrackBtn.querySelector("span").textContent = "INITIALIZE BRUTE-FORCE SIMULATOR";
        startCrackBtn.style.background = "var(--grad-primary)";
        
        // Reset compromise display if aborted manually rather than finishing
        if (!crackStatusLbl.textContent.includes("EXPLOITED")) {
            crackStatusLbl.textContent = "STATUS: STANDBY";
            crackStatusLbl.style.color = "#64748b";
        }
        
        if (crackWorker) {
            crackWorker.postMessage({ action: "stop" });
            crackWorker.terminate();
            crackWorker = null;
        }
        
        renderThreadCores(false);
        stopCrackingMatrixAnim();
    }

    // Canvas matrix digital fall animation inside the visualizer viewport
    let matrixCtx = null;
    let matrixColumns = [];

    function initCrackingMatrixCanvas() {
        if (!crackCanvas) return;
        matrixCtx = crackCanvas.getContext("2d");
        
        // Size adjust
        crackCanvas.width = crackCanvas.parentElement.clientWidth;
        crackCanvas.height = crackCanvas.parentElement.clientHeight;
        
        const columnWidth = 14;
        const columnCount = Math.floor(crackCanvas.width / columnWidth);
        
        matrixColumns = [];
        for (let i = 0; i < columnCount; i++) {
            matrixColumns.push({
                y: Math.random() * -100,
                speed: 1 + Math.random() * 3
            });
        }
    }

    function startCrackingMatrixAnim() {
        initCrackingMatrixCanvas();
        if (crackingMatrixInterval) clearInterval(crackingMatrixInterval);
        
        crackingMatrixInterval = setInterval(() => {
            if (!matrixCtx) return;
            
            // Fading bg to create trails
            matrixCtx.fillStyle = "rgba(1, 1, 3, 0.15)";
            matrixCtx.fillRect(0, 0, crackCanvas.width, crackCanvas.height);
            
            matrixCtx.fillStyle = isCracking ? "rgba(239, 68, 68, 0.4)" : "rgba(0, 242, 254, 0.25)";
            matrixCtx.font = "10px monospace";
            
            const characters = "010101XYZ@#$%-+=<>[]";
            const columnWidth = 14;
            
            matrixColumns.forEach((col, idx) => {
                const char = characters[Math.floor(Math.random() * characters.length)];
                matrixCtx.fillText(char, idx * columnWidth, col.y);
                
                col.y += col.speed * 4;
                if (col.y > crackCanvas.height) {
                    col.y = Math.random() * -30;
                    col.speed = 1 + Math.random() * 3;
                }
            });
        }, 50);
    }

    function stopCrackingMatrixAnim() {
        if (crackingMatrixInterval) {
            clearInterval(crackingMatrixInterval);
            crackingMatrixInterval = null;
        }
        if (matrixCtx) {
            matrixCtx.clearRect(0, 0, crackCanvas.width, crackCanvas.height);
        }
    }

    // ==========================================================================
    // ADVANCED MODULE 2: KEYSTROKE BIOMETRICS ENGINE
    // ==========================================================================
    const bioCanvas = document.getElementById("biometrics-canvas");
    const bioAvgDwell = document.getElementById("bio-avg-dwell");
    const bioAvgFlight = document.getElementById("bio-avg-flight");
    const bioRhythmQuality = document.getElementById("bio-rhythm-quality");
    const bioSignatureHash = document.getElementById("bio-signature-hash");

    let bioKeyEvents = [];
    let bioDwellTimes = [];
    let bioFlightTimes = [];
    let bioKeyLogs = [];
    let lastKeyupTime = null;

    passwordInput.addEventListener("keydown", (e) => {
        if (e.repeat) return; // ignore repeating holds
        
        const timestamp = performance.now();
        const key = e.key;
        
        // Flight time calc (from previous keyup to this keydown)
        if (lastKeyupTime !== null) {
            const flightTime = timestamp - lastKeyupTime;
            bioFlightTimes.push(flightTime);
            bioKeyLogs.push({ type: "flight", time: flightTime, key: `gap-${key}` });
        }
        
        bioKeyEvents.push({ key: key, downTime: timestamp });
    });

    passwordInput.addEventListener("keyup", (e) => {
        const timestamp = performance.now();
        const key = e.key;
        lastKeyupTime = timestamp;
        
        const matchIdx = bioKeyEvents.findIndex(evt => evt.key === key);
        if (matchIdx !== -1) {
            const dwellTime = timestamp - bioKeyEvents[matchIdx].downTime;
            bioDwellTimes.push(dwellTime);
            bioKeyLogs.push({ type: "dwell", time: dwellTime, key: key });
            bioKeyEvents.splice(matchIdx, 1); // remove from stack
            
            // Limit log entries to fit screen visual space
            if (bioKeyLogs.length > 12) bioKeyLogs.shift();
            
            // Recalculate readouts
            updateBiometricMetrics();
        }
    });

    // Reset biometric data if inputs cleared
    passwordInput.addEventListener("input", (e) => {
        if (e.target.value === "") {
            bioKeyEvents = [];
            bioDwellTimes = [];
            bioFlightTimes = [];
            bioKeyLogs = [];
            lastKeyupTime = null;
            updateBiometricMetrics();
        }
    });

    function updateBiometricMetrics() {
        if (bioDwellTimes.length === 0) {
            bioAvgDwell.textContent = "0 ms";
            bioAvgFlight.textContent = "0 ms";
            bioRhythmQuality.textContent = "WAITING FOR INPUT";
            bioRhythmQuality.style.color = "#64748b";
            bioSignatureHash.textContent = "NO INPUT SIGNATURE RECORDED";
            drawBiometricsGraph();
            return;
        }

        const avgDwell = bioDwellTimes.reduce((a, b) => a + b, 0) / bioDwellTimes.length;
        const avgFlight = bioFlightTimes.length > 0 ? (bioFlightTimes.reduce((a, b) => a + b, 0) / bioFlightTimes.length) : 0;
        
        bioAvgDwell.textContent = `${Math.round(avgDwell)} ms`;
        bioAvgFlight.textContent = `${Math.round(avgFlight)} ms`;

        // Rhythm consistency math
        let variance = 0;
        if (bioDwellTimes.length > 1) {
            const mean = avgDwell;
            const diffs = bioDwellTimes.map(t => Math.pow(t - mean, 2));
            variance = diffs.reduce((a, b) => a + b, 0) / diffs.length;
        }
        
        const stdDev = Math.sqrt(variance);
        let quality = "CONSISTENT RHYTHM";
        let color = "#22c55e"; // green
        
        if (stdDev > 85) {
            quality = "ERRATIC RHYTHM";
            color = "#ef4444"; // red
        } else if (stdDev > 40) {
            quality = "NEUTRAL RHYTHM";
            color = "#eab308"; // yellow
        }

        bioRhythmQuality.textContent = quality;
        bioRhythmQuality.style.color = color;

        // Generate timing profile signature hash (hashed dynamic key string)
        const rawProfileString = bioDwellTimes.map(Math.round).join("-") + "+" + bioFlightTimes.map(Math.round).join("-");
        sha1Hex(rawProfileString).then(hash => {
            bioSignatureHash.textContent = `BIO-SIG-${hash.substring(0, 16)}`;
        });

        // Redraw canvas bar charts
        drawBiometricsGraph();
    }

    function drawBiometricsGraph() {
        if (!bioCanvas) return;
        const ctx = bioCanvas.getContext("2d");
        
        // Auto-scale coordinate system to wrapper size
        bioCanvas.width = bioCanvas.parentElement.clientWidth;
        bioCanvas.height = bioCanvas.parentElement.clientHeight;
        
        ctx.clearRect(0, 0, bioCanvas.width, bioCanvas.height);
        
        if (bioKeyLogs.length === 0) {
            ctx.fillStyle = "#475569";
            ctx.font = "12px 'JetBrains Mono'";
            ctx.textAlign = "center";
            ctx.fillText("TYPE IN THE SCANNER TO INITIALIZE TELEMETRY GRAPH", bioCanvas.width / 2, bioCanvas.height / 2);
            return;
        }

        const barWidth = 32;
        const spacing = 16;
        const startX = (bioCanvas.width - (bioKeyLogs.length * (barWidth + spacing))) / 2;
        const maxTimeHeight = 400; // ms cap for visual height scale

        bioKeyLogs.forEach((log, idx) => {
            const height = Math.min(220, (log.time / maxTimeHeight) * 220);
            const x = startX + idx * (barWidth + spacing);
            const y = bioCanvas.height - height - 40;

            // Pick glowing indicator color based on timing delay
            let color = "#22c55e"; // Green for fast
            let glowColor = "rgba(34, 197, 94, 0.4)";
            if (log.time > 250) {
                color = "#ef4444"; // Red for slow
                glowColor = "rgba(239, 68, 68, 0.4)";
            } else if (log.time > 100) {
                color = "#eab308"; // Yellow for normal
                glowColor = "rgba(234, 179, 8, 0.4)";
            }

            // Draw Bar
            ctx.shadowBlur = 8;
            ctx.shadowColor = color;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, barWidth, height);
            
            // Draw grid outline brackets inside bar
            ctx.shadowBlur = 0;
            ctx.strokeStyle = "rgba(255,255,255,0.15)";
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, barWidth, height);

            // Draw Key code label
            ctx.fillStyle = "#cbd5e1";
            ctx.font = "10px 'JetBrains Mono'";
            ctx.textAlign = "center";
            const cleanLabel = log.type === "dwell" ? log.key : "gap";
            ctx.fillText(cleanLabel, x + barWidth / 2, bioCanvas.height - 24);
            
            // Draw time count
            ctx.fillStyle = "#64748b";
            ctx.font = "8px 'JetBrains Mono'";
            ctx.fillText(`${Math.round(log.time)}ms`, x + barWidth / 2, y - 8);
        });
    }

    // ==========================================================================
    // ADVANCED MODULE 3: CLIENT-SIDE BLOOM FILTER ENGINE
    // ==========================================================================
    const bloomBitArrayContainer = document.getElementById("bloom-bit-array");
    const ledgerDisplayBox = document.getElementById("ledger-display-box");

    const VULNERABLE_DICTIONARY = [
        "123456", "password", "123456789", "qwerty", "12345", "1234567", "111111", "12345678", "123123", "1234567890", 
        "password123", "admin", "letmein", "sunshine", "iloveyou", "mustang", "princess", "superman", "monkey", "charlie", 
        "welcome", "shadow", "killer", "hunter", "michael", "jessica", "soccer", "football", "baseball", "adidas", "nike", 
        "jordan", "dallas", "boston", "cookie", "ginger", "system", "override", "cyberpunk", "hacker", "fortress", "access", 
        "root", "matrix", "shield", "secure", "pass123", "secret", "security", "dragon", "simpson", "monkey123", "master", 
        "login", "signin", "testing", "testing123", "qwertyuiop", "asdfghjkl", "zxcvbnm", "querty", "password1", "password!", 
        "qwerty123", "loveme", "loveyou", "babygirl", "forever", "chelsea", "arsenal", "liverpool", "manchester", "barcelona",
        "madrid", "family", "friends", "freedom", "awesome", "perfect", "beautiful", "hacker123", "cyber123", "root123",
        "admin123", "admin1234", "administrator", "superadmin", "passkey", "passwordkey", "fortresspass", "fortresspass1"
    ];

    // FNV-1a Hashing function seeds
    function fnv1aHash(str, seed) {
        let hash = seed;
        for (let i = 0; i < str.length; i++) {
            hash ^= str.charCodeAt(i);
            hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
        }
        return Math.abs(hash);
    }

    // Map any string to 4 bit indexes in 1024-bit Bloom filter array
    function getBloomIndexes(str) {
        const seeds = [0x811c9dc5, 0x1f829d2b, 0xa34b8c91, 0x7c49129d];
        return seeds.map(seed => fnv1aHash(str, seed) % 1024);
    }

    const BLOOM_FILTER_SIZE = 1024;
    const bloomBitArray = new Uint8Array(BLOOM_FILTER_SIZE);

    // Populate filter with vulnerable dictionaries
    function initBloomFilter() {
        VULNERABLE_DICTIONARY.forEach(pass => {
            const indexes = getBloomIndexes(pass.toLowerCase());
            indexes.forEach(idx => {
                bloomBitArray[idx] = 1;
            });
        });

        renderBloomGrid();
    }

    // Build the visual bit-cells grid (1024 tiny boxes)
    function renderBloomGrid() {
        if (!bloomBitArrayContainer) return;
        bloomBitArrayContainer.innerHTML = "";
        
        for (let i = 0; i < BLOOM_FILTER_SIZE; i++) {
            const cell = document.createElement("div");
            cell.className = "bloom-bit-cell";
            cell.id = `bloom-bit-${i}`;
            if (bloomBitArray[i] === 1) {
                cell.style.background = "rgba(255, 255, 255, 0.04)";
                cell.style.borderColor = "rgba(255, 255, 255, 0.02)";
            }
            bloomBitArrayContainer.appendChild(cell);
        }
    }

    // Run verification during input listening
    function checkBloomFilterLedger(password) {
        if (!password || password.length === 0) {
            renderBloomGrid();
            return;
        }

        const indexes = getBloomIndexes(password.toLowerCase());
        
        // Reset cell states to original dictionary states first
        const cells = bloomBitArrayContainer.querySelectorAll(".bloom-bit-cell");
        cells.forEach((cell, idx) => {
            cell.className = "bloom-bit-cell";
            if (bloomBitArray[idx] === 1) {
                cell.style.background = "rgba(255, 255, 255, 0.04)";
                cell.style.borderColor = "rgba(255, 255, 255, 0.02)";
            } else {
                cell.style.background = "";
                cell.style.borderColor = "";
            }
        });

        // Highlights checked indexes dynamically
        indexes.forEach(idx => {
            const cell = document.getElementById(`bloom-bit-${idx}`);
            if (cell) {
                cell.classList.add("active");
            }
        });

        const isProbableMember = indexes.every(idx => bloomBitArray[idx] === 1);
        
        const timestamp = `[${new Date().toTimeString().split(" ")[0]}]`;
        const ledgerLine = document.createElement("div");
        ledgerLine.className = "console-line";

        if (isProbableMember) {
            // Confirm with dictionary directly to verify exact hit
            const exactMatch = VULNERABLE_DICTIONARY.includes(password.toLowerCase());
            
            if (exactMatch) {
                ledgerLine.innerHTML = `<span class="system-line">${timestamp} WARNING // </span><span class="danger-line">DICTIONARY EXPLODED: Exact match found in local vulnerable dictionary: "${password}"</span>`;
                triggerAlert("Vulnerable Password Logged", "Password matched offline vulnerability database.", "danger");
            } else {
                // False positive case (common in Bloom filters due to hash collision)
                ledgerLine.innerHTML = `<span class="system-line">${timestamp} ALERT // </span><span class="scanning-line">COLLISION REGISTERED: Indices mapped to active slots. Possible dictionary signature collision.</span>`;
            }
        } else {
            ledgerLine.innerHTML = `<span class="system-line">${timestamp} OK // </span><span class="safe-line">INDEX SAFE: Verified clean signature across bit registries.</span>`;
        }

        ledgerDisplayBox.appendChild(ledgerLine);
        ledgerDisplayBox.scrollTop = ledgerDisplayBox.scrollHeight;
    }

    // ==========================================================================
    // EXTRA UPGRADED MODULE: CRYPTOGRAPHIC HASH FUNCTIONS
    // ==========================================================================
    function md5(string) {
        function rotateLeft(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }
        function addUnsigned(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            if (lX4 | lY4) {
                if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            } else return (lResult ^ lX8 ^ lY8);
        }
        function F(x, y, z) { return (x & y) | ((~x) & z); }
        function G(x, y, z) { return (x & z) | (y & (~z)); }
        function H(x, y, z) { return (x ^ y ^ z); }
        function I(x, y, z) { return (y ^ (x | (~z))); }
        function FF(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        }
        function GG(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        }
        function HH(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        }
        function II(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        }
        function convertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lMessageLength + 8 - ((lMessageLength + 8) % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = Array(lNumberOfWords);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lBytePosition < lMessageLength) {
                lWordCount = (lBytePosition - (lBytePosition % 4)) / 4;
                lByteCount = (lBytePosition % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lBytePosition) << lByteCount));
                lBytePosition++;
            }
            lWordCount = (lBytePosition - (lBytePosition % 4)) / 4;
            lByteCount = (lBytePosition % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lByteCount);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        }
        function wordToHex(lValue) {
            var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        }
        function utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) utftext += String.fromCharCode(c);
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        }
        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
        var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
        var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
        var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
        string = utf8Encode(string);
        x = convertToWordArray(string);
        a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
        for (k = 0; k < x.length; k += 16) {
            AA = a; BB = b; CC = c; DD = d;
            a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478); d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756); c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB); b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF); d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A); c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613); b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8); d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF); c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1); b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122); d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193); c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E); b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562); d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340); c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51); b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D); d = GG(d, a, b, c, x[k + 10], S22, 0x2441453); c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681); b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6); d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6); c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87); b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905); d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8); c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9); b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942); d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681); c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122); b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44); d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9); c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60); b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6); d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA); c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085); b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039); d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5); c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8); b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = II(a, b, c, d, x[k + 0], S41, 0xF4292244); d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97); c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7); b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3); d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92); c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D); b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F); d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0); c = II(c, d, a, b, x[k + 6], S43, 0xA3014314); b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = addUnsigned(a, AA); b = addUnsigned(b, BB); c = addUnsigned(c, CC); d = addUnsigned(d, DD);
        }
        return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
    }

    async function getCryptoHashHex(algorithm, message) {
        const msgUint8 = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Update dynamic cryptographic output view
    function updateHashLaboratory(password) {
        const saltInput = document.getElementById("salt-input");
        const salt = saltInput ? saltInput.value : "";
        const saltedText = password + salt;

        // MD5 calculations
        const md5Out = document.getElementById("hash-md5");
        if (md5Out) {
            md5Out.textContent = password ? md5(saltedText) : "d41d8cd98f00b204e9800998ecf8427e";
        }

        // Web Crypto async hashes
        if (password) {
            getCryptoHashHex("SHA-1", saltedText).then(hex => {
                const sha1Out = document.getElementById("hash-sha1");
                if (sha1Out) sha1Out.textContent = hex;
            });
            getCryptoHashHex("SHA-256", saltedText).then(hex => {
                const sha256Out = document.getElementById("hash-sha256");
                if (sha256Out) sha256Out.textContent = hex;
            });
            getCryptoHashHex("SHA-512", saltedText).then(hex => {
                const sha512Out = document.getElementById("hash-sha512");
                if (sha512Out) sha512Out.textContent = hex;
            });
        } else {
            // Default blank hashes
            const sha1Out = document.getElementById("hash-sha1");
            const sha256Out = document.getElementById("hash-sha256");
            const sha512Out = document.getElementById("hash-sha512");
            if (sha1Out) sha1Out.textContent = "da39a3ee5e6b4b0d3255bfef95601890afd80709";
            if (sha256Out) sha256Out.textContent = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
            if (sha512Out) sha512Out.textContent = "cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e";
        }
    }

    // Hook Hash lab controls
    const generateSaltBtn = document.getElementById("generate-salt-btn");
    const saltInput = document.getElementById("salt-input");
    
    if (generateSaltBtn && saltInput) {
        generateSaltBtn.addEventListener("click", () => {
            const charset = "0123456789abcdef";
            let salt = "";
            for (let i = 0; i < 8; i++) {
                salt += charset[Math.floor(Math.random() * charset.length)];
            }
            saltInput.value = salt;
            updateHashLaboratory(passwordInput.value);
            triggerAlert("Salt Injected", `Hex salt '${salt}' generated. Hashes updated.`, "success");
        });

        saltInput.addEventListener("input", () => {
            updateHashLaboratory(passwordInput.value);
        });
    }

    const hashCopyButtons = document.querySelectorAll(".hash-copy-btn");
    hashCopyButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target");
            const hashText = document.getElementById(targetId).textContent;
            navigator.clipboard.writeText(hashText).then(() => {
                btn.textContent = "COPIED";
                triggerAlert("Hash Copied", "Cryptographic signature copied to safety board.", "success");
                setTimeout(() => { btn.textContent = "COPY"; }, 1500);
            });
        });
    });


    // ==========================================================================
    // EXTRA UPGRADED MODULE: ZXCVBN-LITE PATTERN RECOGNITION
    // ==========================================================================
    function detectKeyboardWalksAndRuns(password) {
        if (!password || password.length < 3) return [];
        const patterns = [];
        const lower = password.toLowerCase();
        
        const rows = [
            "qwertyuiop", "asdfghjkl", "zxcvbnm",
            "1234567890"
        ];
        
        // 1. Keyboard walks
        rows.forEach(row => {
            const revRow = row.split("").reverse().join("");
            for (let len = Math.min(password.length, 8); len >= 3; len--) {
                for (let i = 0; i <= password.length - len; i++) {
                    const sub = lower.substring(i, i + len);
                    if (row.includes(sub) || revRow.includes(sub)) {
                        patterns.push({
                            type: "danger",
                            msg: `Keyboard Walk: '${password.substring(i, i + len)}'`,
                            raw: sub
                        });
                        i += len - 1;
                    }
                }
            }
        });

        // 2. Sequential Runs
        for (let len = Math.min(password.length, 8); len >= 3; len--) {
            for (let i = 0; i <= password.length - len; i++) {
                const sub = lower.substring(i, i + len);
                let ascending = true;
                let descending = true;
                for (let j = 1; j < len; j++) {
                    const diff = sub.charCodeAt(j) - sub.charCodeAt(j - 1);
                    if (diff !== 1) ascending = false;
                    if (diff !== -1) descending = false;
                }
                if (ascending || descending) {
                    patterns.push({
                        type: "warning",
                        msg: `Sequential Run: '${password.substring(i, i + len)}'`,
                        raw: sub
                    });
                    i += len - 1;
                }
            }
        }

        // 3. Repeated sequences (aaa, bbb)
        const repeatRegex = /(.)\1{2,}/g;
        let match;
        while ((match = repeatRegex.exec(lower)) !== null) {
            patterns.push({
                type: "danger",
                msg: `Repeated Block: '${match[0]}'`,
                raw: match[0]
            });
        }

        // 4. Leet speak mutations checks
        const leetMap = {
            '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't',
            '@': 'a', '$': 's', '!': 'i', '8': 'b', '9': 'g'
        };
        
        let deleeted = "";
        for (let i = 0; i < lower.length; i++) {
            deleeted += leetMap[lower[i]] || lower[i];
        }
        
        if (deleeted !== lower) {
            const exactMatch = VULNERABLE_DICTIONARY.includes(deleeted);
            if (exactMatch) {
                patterns.push({
                    type: "danger",
                    msg: `Leet Match: '${password}' -> '${deleeted}'`,
                    raw: password
                });
            }
        }

        // Clean duplicates
        const seen = new Set();
        const uniquePatterns = [];
        patterns.forEach(p => {
            const key = p.msg;
            if (!seen.has(key)) {
                seen.add(key);
                uniquePatterns.push(p);
            }
        });

        return uniquePatterns;
    }

    function updatePatternInspector(password) {
        const patternListBox = document.getElementById("pattern-list-box");
        if (!patternListBox) return;

        const patterns = detectKeyboardWalksAndRuns(password);
        if (patterns.length === 0) {
            patternListBox.innerHTML = '<div class="pattern-empty">No dangerous keyboard walks, sequences, or repeating patterns detected.</div>';
        } else {
            patternListBox.innerHTML = patterns.map(p => `
                <div class="pattern-badge ${p.type === 'warning' ? 'warning' : ''}">
                    <span class="pattern-icon">${p.type === 'warning' ? '⚠️' : '🚨'}</span>
                    <span class="pattern-msg">${p.msg}</span>
                    <span class="pattern-type">${p.type === 'warning' ? 'Warning' : 'Danger'}</span>
                </div>
            `).join("");
        }
    }


    // ==========================================================================
    // EXTRA UPGRADED MODULE: KEYSTROKE BIOMETRICS VAULT LOCKBOX
    // ==========================================================================
    let vaultEnrollmentMode = true; 
    let vaultEnrollmentCount = 0; 
    let vaultTargetPassphrase = "cyber-shield"; 
    let vaultEnrollmentData = []; 
    let vaultUserProfile = null; 
    
    let vaultKeyEvents = [];
    let vaultDwellTimes = [];
    let vaultFlightTimes = [];
    let vaultLastKeyup = null;
    let isTrainingActive = false;

    const vaultInput = document.getElementById("vault-input");
    const vaultControlBtn = document.getElementById("vault-control-btn");
    const vaultInstructions = document.getElementById("vault-instructions");
    const btnVaultEnroll = document.getElementById("btn-vault-enroll");
    const btnVaultVerify = document.getElementById("btn-vault-verify");
    const vaultSimulatorEl = document.querySelector(".vault-simulator");
    const vaultStatusText = document.getElementById("vault-status-text");

    if (btnVaultEnroll && btnVaultVerify) {
        btnVaultEnroll.addEventListener("click", () => switchVaultMode(true));
        btnVaultVerify.addEventListener("click", () => {
            if (!vaultUserProfile) return;
            switchVaultMode(false);
        });
    }

    function switchVaultMode(isEnroll) {
        vaultEnrollmentMode = isEnroll;
        btnVaultEnroll.classList.toggle("active", isEnroll);
        btnVaultVerify.classList.toggle("active", !isEnroll);
        resetVaultInputs();
        
        if (isEnroll) {
            vaultInstructions.textContent = `Click "START RHYTHM TRAINING" to train the biometric system.`;
            vaultControlBtn.textContent = "START RHYTHM TRAINING";
            vaultControlBtn.classList.remove("cancel");
            if (vaultInput) vaultInput.placeholder = "Enrollment inactive...";
            updateLedStates(vaultEnrollmentCount);
        } else {
            vaultInstructions.textContent = `Type the enrolled passphrase "${vaultTargetPassphrase}" in the input above to unlock the vault.`;
            vaultControlBtn.textContent = "VERIFY KEYSTROKE RHYTHM";
            vaultControlBtn.classList.remove("cancel");
            if (vaultInput) vaultInput.placeholder = "Click Verify to begin...";
            updateLedStates(0);
        }
    }

    function resetVaultInputs() {
        if (!vaultInput) return;
        vaultInput.value = "";
        vaultInput.disabled = true;
        isTrainingActive = false;
        vaultKeyEvents = [];
        vaultDwellTimes = [];
        vaultFlightTimes = [];
        vaultLastKeyup = null;
        if (vaultSimulatorEl) vaultSimulatorEl.className = "vault-simulator glass-inset locked";
        if (vaultStatusText) vaultStatusText.textContent = "SYSTEM ARMED // LOCKED";
    }

    function updateLedStates(passCount) {
        const dots = ["led-pass-1", "led-pass-2", "led-pass-3"];
        dots.forEach((dotId, index) => {
            const dot = document.getElementById(dotId);
            if (!dot) return;
            dot.className = "enroll-dot";
            if (index < passCount) {
                dot.classList.add("success");
            } else if (index === passCount && isTrainingActive) {
                dot.classList.add("active");
            }
        });
    }

    if (vaultInput) {
        vaultInput.addEventListener("keydown", (e) => {
            if (!isTrainingActive || e.repeat) return;
            
            const timestamp = performance.now();
            const key = e.key;
            
            if (vaultLastKeyup !== null) {
                const flightTime = timestamp - vaultLastKeyup;
                vaultFlightTimes.push(flightTime);
            }
            
            vaultKeyEvents.push({ key: key, downTime: timestamp });
        });

        vaultInput.addEventListener("keyup", (e) => {
            if (!isTrainingActive) return;
            
            const timestamp = performance.now();
            const key = e.key;
            vaultLastKeyup = timestamp;
            
            const matchIdx = vaultKeyEvents.findIndex(evt => evt.key === key);
            if (matchIdx !== -1) {
                const dwellTime = timestamp - vaultKeyEvents[matchIdx].downTime;
                vaultDwellTimes.push(dwellTime);
                vaultKeyEvents.splice(matchIdx, 1);
            }

            if (e.key === "Enter" || vaultInput.value === vaultTargetPassphrase) {
                processVaultSubmission();
            }
        });
    }

    if (vaultControlBtn) {
        vaultControlBtn.addEventListener("click", () => {
            if (isTrainingActive) {
                resetVaultInputs();
                triggerAlert("Vault Action", "Training sequence aborted.", "info");
                vaultControlBtn.textContent = vaultEnrollmentMode ? "START RHYTHM TRAINING" : "VERIFY KEYSTROKE RHYTHM";
                vaultControlBtn.classList.remove("cancel");
                return;
            }

            isTrainingActive = true;
            vaultInput.disabled = false;
            vaultInput.value = "";
            vaultInput.focus();
            vaultKeyEvents = [];
            vaultDwellTimes = [];
            vaultFlightTimes = [];
            vaultLastKeyup = null;

            vaultControlBtn.textContent = "CANCEL ACTION";
            vaultControlBtn.classList.add("cancel");

            if (vaultEnrollmentMode) {
                vaultInstructions.textContent = `Type "${vaultTargetPassphrase}" and hit Enter (Pass ${vaultEnrollmentCount + 1} / 3)`;
                updateLedStates(vaultEnrollmentCount);
            } else {
                vaultInstructions.textContent = `Type "${vaultTargetPassphrase}" and hit Enter to match rhythm signature.`;
            }
        });
    }

    function processVaultSubmission() {
        isTrainingActive = false;
        vaultInput.disabled = true;
        vaultControlBtn.classList.remove("cancel");
        
        const textTyped = vaultInput.value;
        if (textTyped !== vaultTargetPassphrase) {
            triggerAlert("Vault Access Denied", "Incorrect passphrase string. Verification failed.", "warning");
            resetVaultInputs();
            switchVaultMode(vaultEnrollmentMode);
            return;
        }

        if (vaultEnrollmentMode) {
            vaultEnrollmentData.push({
                dwell: [...vaultDwellTimes],
                flight: [...vaultFlightTimes]
            });
            vaultEnrollmentCount++;
            triggerAlert("Pass Logged", `Timing signature logged for enrollment pass ${vaultEnrollmentCount}/3.`, "success");
            
            if (vaultEnrollmentCount >= 3) {
                compileBiometricProfile();
                vaultEnrollmentCount = 0;
                vaultEnrollmentData = [];
                btnVaultVerify.disabled = false;
                triggerAlert("Biometrics Synced", "Vault profile successfully compiled! Verify mode enabled.", "success");
                switchVaultMode(false); 
            } else {
                switchVaultMode(true); 
            }
        } else {
            verifyVaultRhythm();
        }
    }

    function compileBiometricProfile() {
        const dwellAvg = [];
        const flightAvg = [];
        
        const lenDwell = vaultEnrollmentData[0].dwell.length;
        const lenFlight = vaultEnrollmentData[0].flight.length;
        
        for (let i = 0; i < lenDwell; i++) {
            const sum = vaultEnrollmentData[0].dwell[i] + vaultEnrollmentData[1].dwell[i] + vaultEnrollmentData[2].dwell[i];
            dwellAvg.push(sum / 3);
        }
        for (let i = 0; i < lenFlight; i++) {
            const sum = vaultEnrollmentData[0].flight[i] + vaultEnrollmentData[1].flight[i] + vaultEnrollmentData[2].flight[i];
            flightAvg.push(sum / 3);
        }
        
        vaultUserProfile = {
            dwell: dwellAvg,
            flight: flightAvg
        };
    }

    function verifyVaultRhythm() {
        if (!vaultUserProfile) return;
        
        const dwellVerify = vaultDwellTimes;
        const flightVerify = vaultFlightTimes;
        
        let sumDist = 0;
        let terms = 0;
        
        for (let i = 0; i < Math.min(dwellVerify.length, vaultUserProfile.dwell.length); i++) {
            sumDist += Math.abs(dwellVerify[i] - vaultUserProfile.dwell[i]);
            terms++;
        }
        for (let i = 0; i < Math.min(flightVerify.length, vaultUserProfile.flight.length); i++) {
            sumDist += Math.abs(flightVerify[i] - vaultUserProfile.flight[i]);
            terms++;
        }
        
        if (terms === 0) {
            triggerAlert("Validation Error", "Incomplete timing statistics gathered.", "warning");
            resetVaultInputs();
            switchVaultMode(false);
            return;
        }

        const avgDistance = sumDist / terms;
        
        let matchScore = 100 - (avgDistance * 0.5);
        matchScore = Math.max(0, Math.min(100, Math.round(matchScore)));

        if (matchScore >= 75) {
            vaultSimulatorEl.className = "vault-simulator glass-inset unlocked";
            vaultStatusText.textContent = `VAULT ACCESS GRANTED // MATCH: ${matchScore}%`;
            vaultInstructions.textContent = `Access granted! Keystroke rhythm match score: ${matchScore}%.`;
            vaultControlBtn.textContent = "ACCESS GRANTED";
            
            const rect = vaultInput.getBoundingClientRect();
            spawnConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
            triggerAlert("Vault Unlocked", `Rhythm matched at ${matchScore}%. Biometrics identity verified.`, "success");
        } else {
            vaultSimulatorEl.className = "vault-simulator glass-inset compromised";
            vaultStatusText.textContent = `ACCESS VIOLATION // MATCH: ${matchScore}%`;
            vaultInstructions.textContent = `ACCESS BLOCKED: Identity signature mismatch (${matchScore}% match). Try again.`;
            vaultControlBtn.textContent = "VERIFY KEYSTROKE RHYTHM";
            triggerAlert("Biometric Mismatch", `Rhythm mismatch signature at ${matchScore}%. Access denied.`, "danger");
        }
    }

    // ==========================================================================
    // INITIALIZATION RUN
    // ==========================================================================

    // Hook Bloom Filter test check directly inside input listener
    passwordInput.addEventListener("input", (e) => {
        checkBloomFilterLedger(e.target.value);
    });

    // Initialize Bloom filter
    initBloomFilter();

    // Initialize Hash lab on startup
    if (typeof updateHashLaboratory === "function") {
        updateHashLaboratory("");
    }

    // Init core setup generator
    generateSecureToken();
});
