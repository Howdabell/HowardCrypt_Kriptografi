/**
 * Vigenere Cipher - Standard 26 alphabet
 * Encrypts and decrypts text using a keyword-based polyalphabetic substitution.
 */

const VigenereCipher = {
    name: 'Vigenere Cipher',

    /**
     * Encrypt plaintext using Vigenere cipher.
     * @param {string} plaintext - The text to encrypt
     * @param {object} key - { keyword: string }
     * @returns {string} ciphertext
     */
    encrypt(plaintext, key) {
        const keyword = key.keyword.toUpperCase().replace(/[^A-Z]/g, '');
        if (!keyword) throw new Error('Keyword harus berisi huruf alfabet (A-Z).');

        const text = plaintext.toUpperCase();
        let result = '';
        let keyIndex = 0;

        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            if (charCode >= 65 && charCode <= 90) {
                const shift = keyword.charCodeAt(keyIndex % keyword.length) - 65;
                const encrypted = ((charCode - 65 + shift) % 26) + 65;
                result += String.fromCharCode(encrypted);
                keyIndex++;
            } else {
                result += text[i];
            }
        }

        return result;
    },

    /**
     * Decrypt ciphertext using Vigenere cipher.
     * @param {string} ciphertext - The text to decrypt
     * @param {object} key - { keyword: string }
     * @returns {string} plaintext
     */
    decrypt(ciphertext, key) {
        const keyword = key.keyword.toUpperCase().replace(/[^A-Z]/g, '');
        if (!keyword) throw new Error('Keyword harus berisi huruf alfabet (A-Z).');

        const text = ciphertext.toUpperCase();
        let result = '';
        let keyIndex = 0;

        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            if (charCode >= 65 && charCode <= 90) {
                const shift = keyword.charCodeAt(keyIndex % keyword.length) - 65;
                const decrypted = ((charCode - 65 - shift + 26) % 26) + 65;
                result += String.fromCharCode(decrypted);
                keyIndex++;
            } else {
                result += text[i];
            }
        }

        return result;
    },

    /**
     * Returns the key input HTML for this cipher.
     */
    getKeyInputHTML() {
        return `
            <div class="key-field">
                <label for="vigenere-keyword">Keyword</label>
                <input type="text" id="vigenere-keyword" placeholder="Contoh: KUNCI" autocomplete="off" spellcheck="false">
                <span class="key-hint">Masukkan kata kunci (huruf A-Z)</span>
            </div>
        `;
    },

    /**
     * Gets the key values from the DOM inputs.
     */
    getKeyFromInputs() {
        const keyword = document.getElementById('vigenere-keyword').value;
        if (!keyword.trim()) throw new Error('Keyword tidak boleh kosong.');
        return { keyword };
    }
};
