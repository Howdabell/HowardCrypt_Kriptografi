/**
 * Main Application Logic
 * Handles cipher selection, UI interactions, and encrypt/decrypt operations.
 */

// Registry of all available ciphers
const CIPHERS = {
    vigenere: VigenereCipher,
    affine: AffineCipher,
    playfair: PlayfairCipher,
    hill: HillCipher,
    enigma: EnigmaCipher
};

let currentCipher = 'vigenere';

/**
 * Initialize the application.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Set up cipher navigation
    const navButtons = document.querySelectorAll('.cipher-nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            selectCipher(btn.dataset.cipher);
        });
    });

    // Set up action buttons
    document.getElementById('btn-encrypt').addEventListener('click', performEncrypt);
    document.getElementById('btn-decrypt').addEventListener('click', performDecrypt);
    document.getElementById('btn-clear').addEventListener('click', clearAll);
    document.getElementById('btn-swap').addEventListener('click', swapTexts);
    document.getElementById('btn-copy').addEventListener('click', copyOutput);

    // Initialize with default cipher
    selectCipher('vigenere');

    // Add particle animation
    createParticles();
});

/**
 * Select a cipher and update the UI.
 */
function selectCipher(cipherId) {
    currentCipher = cipherId;
    const cipher = CIPHERS[cipherId];

    // Update nav buttons
    document.querySelectorAll('.cipher-nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.cipher === cipherId);
    });

    // Update header
    document.getElementById('cipher-title').textContent = cipher.name;

    // Update key input area
    document.getElementById('key-inputs').innerHTML = cipher.getKeyInputHTML();

    // Update description
    updateCipherDescription(cipherId);

    // Clear error
    hideError();

    // Add entrance animation
    const keySection = document.getElementById('key-inputs');
    keySection.classList.remove('fade-in');
    void keySection.offsetWidth; // Trigger reflow
    keySection.classList.add('fade-in');
}

/**
 * Update cipher description text.
 */
function updateCipherDescription(cipherId) {
    const descriptions = {
        vigenere: 'Cipher polialfabetik yang menggunakan keyword untuk mengenkripsi setiap huruf dengan pergeseran yang berbeda. Merupakan pengembangan dari Caesar cipher.',
        affine: 'Cipher monoalfabetik dengan rumus E(x) = (ax + b) mod 26. Nilai a harus coprime dengan 26 agar dapat didekripsi.',
        playfair: 'Cipher digrafik yang mengenkripsi pasangan huruf menggunakan matriks 5×5 yang dibangun dari keyword. Huruf I dan J digabung.',
        hill: 'Cipher poligrafik yang menggunakan aljabar linear (perkalian matriks mod 26). Kunci berupa matriks 2×2 yang harus invertible mod 26.',
        enigma: 'Simulasi mesin Enigma dengan 3 rotor dan reflektor. Bersifat simetris — enkripsi ciphertext dengan kunci sama menghasilkan plaintext.'
    };
    document.getElementById('cipher-description').textContent = descriptions[cipherId] || '';
}

/**
 * Perform encryption.
 */
function performEncrypt() {
    try {
        hideError();
        const cipher = CIPHERS[currentCipher];
        const plaintext = document.getElementById('input-text').value;

        if (!plaintext.trim()) {
            showError('Plaintext tidak boleh kosong.');
            return;
        }

        const key = cipher.getKeyFromInputs();
        const ciphertext = cipher.encrypt(plaintext, key);

        document.getElementById('output-text').value = ciphertext;
        animateResult();
    } catch (e) {
        showError(e.message);
    }
}

/**
 * Perform decryption.
 */
function performDecrypt() {
    try {
        hideError();
        const cipher = CIPHERS[currentCipher];
        const ciphertext = document.getElementById('input-text').value;

        if (!ciphertext.trim()) {
            showError('Ciphertext tidak boleh kosong.');
            return;
        }

        const key = cipher.getKeyFromInputs();
        const plaintext = cipher.decrypt(ciphertext, key);

        document.getElementById('output-text').value = plaintext;
        animateResult();
    } catch (e) {
        showError(e.message);
    }
}

/**
 * Clear all text fields.
 */
function clearAll() {
    document.getElementById('input-text').value = '';
    document.getElementById('output-text').value = '';
    hideError();
}

/**
 * Swap input and output text.
 */
function swapTexts() {
    const input = document.getElementById('input-text');
    const output = document.getElementById('output-text');
    const temp = input.value;
    input.value = output.value;
    output.value = temp;
}

/**
 * Copy output to clipboard.
 */
async function copyOutput() {
    const output = document.getElementById('output-text');
    if (!output.value) return;

    try {
        await navigator.clipboard.writeText(output.value);
        const btn = document.getElementById('btn-copy');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span class="btn-icon">✓</span> Tersalin!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('copied');
        }, 2000);
    } catch (e) {
        // Fallback
        output.select();
        document.execCommand('copy');
    }
}

/**
 * Show error message.
 */
function showError(message) {
    const errorEl = document.getElementById('error-message');
    errorEl.textContent = '⚠ ' + message;
    errorEl.classList.add('visible');
}

/**
 * Hide error message.
 */
function hideError() {
    const errorEl = document.getElementById('error-message');
    errorEl.classList.remove('visible');
}

/**
 * Animate result appearance.
 */
function animateResult() {
    const output = document.getElementById('output-text');
    output.classList.remove('result-flash');
    void output.offsetWidth;
    output.classList.add('result-flash');
}

/**
 * Create floating background particles for visual effect.
 */
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = particle.style.height = (Math.random() * 4 + 1) + 'px';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 20 + 15) + 's';
        container.appendChild(particle);
    }
}
