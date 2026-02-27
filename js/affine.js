/**
 * Affine Cipher
 * E(x) = (a*x + b) mod 26
 * D(x) = a_inv * (x - b) mod 26
 * where gcd(a, 26) = 1
 */

const AffineCipher = {
    name: 'Affine Cipher',

    /**
     * Calculate GCD of two numbers.
     */
    gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b) {
            [a, b] = [b, a % b];
        }
        return a;
    },

    /**
     * Find modular multiplicative inverse of a mod m using extended Euclidean algorithm.
     */
    modInverse(a, m) {
        a = ((a % m) + m) % m;
        for (let x = 1; x < m; x++) {
            if ((a * x) % m === 1) return x;
        }
        return -1;
    },

    /**
     * Encrypt plaintext using Affine cipher.
     * @param {string} plaintext
     * @param {object} key - { a: number, b: number }
     * @returns {string} ciphertext
     */
    encrypt(plaintext, key) {
        const a = parseInt(key.a);
        const b = parseInt(key.b);

        if (isNaN(a) || isNaN(b)) throw new Error('Nilai a dan b harus berupa angka.');
        if (this.gcd(a, 26) !== 1) throw new Error(`Nilai a (${a}) harus coprime dengan 26. Nilai yang valid: 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25.`);

        const text = plaintext.toUpperCase();
        let result = '';

        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            if (charCode >= 65 && charCode <= 90) {
                const x = charCode - 65;
                const encrypted = ((a * x + b) % 26 + 26) % 26;
                result += String.fromCharCode(encrypted + 65);
            } else {
                result += text[i];
            }
        }

        return result;
    },

    /**
     * Decrypt ciphertext using Affine cipher.
     * @param {string} ciphertext
     * @param {object} key - { a: number, b: number }
     * @returns {string} plaintext
     */
    decrypt(ciphertext, key) {
        const a = parseInt(key.a);
        const b = parseInt(key.b);

        if (isNaN(a) || isNaN(b)) throw new Error('Nilai a dan b harus berupa angka.');
        if (this.gcd(a, 26) !== 1) throw new Error(`Nilai a (${a}) harus coprime dengan 26. Nilai yang valid: 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25.`);

        const aInv = this.modInverse(a, 26);
        if (aInv === -1) throw new Error('Tidak dapat menemukan modular inverse dari a.');

        const text = ciphertext.toUpperCase();
        let result = '';

        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            if (charCode >= 65 && charCode <= 90) {
                const y = charCode - 65;
                const decrypted = ((aInv * (y - b + 26)) % 26 + 26) % 26;
                result += String.fromCharCode(decrypted + 65);
            } else {
                result += text[i];
            }
        }

        return result;
    },

    getKeyInputHTML() {
        return `
            <div class="key-field">
                <label for="affine-a">Nilai a</label>
                <input type="number" id="affine-a" placeholder="Contoh: 5" min="1" max="25">
                <span class="key-hint">Harus coprime dengan 26 (1,3,5,7,9,11,15,17,19,21,23,25)</span>
            </div>
            <div class="key-field">
                <label for="affine-b">Nilai b</label>
                <input type="number" id="affine-b" placeholder="Contoh: 8" min="0" max="25">
                <span class="key-hint">Nilai pergeseran (0-25)</span>
            </div>
        `;
    },

    getKeyFromInputs() {
        const a = document.getElementById('affine-a').value;
        const b = document.getElementById('affine-b').value;
        if (!a || !b) throw new Error('Nilai a dan b tidak boleh kosong.');
        return { a: parseInt(a), b: parseInt(b) };
    }
};
