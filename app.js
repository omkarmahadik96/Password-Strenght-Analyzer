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

        clearTimeout(breachDebounceTimer);
        if (len >= 3) {
            breachDebounceTimer = setTimeout(() => {
                checkPasswordBreach(password);
            }, 700);
        } else {
            leakIndicator.className = "hud-indicator";
            clearConsole();
            appendConsoleLine("Standing by for cryptanalysis inputs...", "system");
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

    // Init core setup generator
    generateSecureToken();
});
