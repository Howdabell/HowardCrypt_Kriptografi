/**
 * Hill Cipher - 2x2 Matrix
 * Encrypts digraphs using matrix multiplication mod 26.
 * Key is a 2x2 matrix that must be invertible mod 26.
 */

const HillCipher = {
    name: 'Hill Cipher',

    /**
     * Calculate GCD.
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
     * Find modular multiplicative inverse.
     */
    modInverse(a, m) {
        a = ((a % m) + m) % m;
        for (let x = 1; x < m; x++) {
            if ((a * x) % m === 1) return x;
        }
        return -1;
    },

    /**
     * Mod that always returns positive.
     */
    mod(n, m) {
        return ((n % m) + m) % m;
    },

    /**
     * Encrypt plaintext using Hill cipher with a 2x2 key matrix.
     * @param {string} plaintext
     * @param {object} key - { a: number, b: number, c: number, d: number } representing [[a,b],[c,d]]
     */
    encrypt(plaintext, key) {
        const { a, b, c, d } = this.parseKey(key);
        const det = this.mod(a * d - b * c, 26);

        if (this.gcd(det, 26) !== 1) {
            throw new Error(`Determinan matriks (${det}) harus coprime dengan 26. Matriks kunci tidak valid.`);
        }

        let text = plaintext.toUpperCase().replace(/[^A-Z]/g, '');
        if (text.length % 2 !== 0) text += 'X'; // Pad with X

        let result = '';

        for (let i = 0; i < text.length; i += 2) {
            const p1 = text.charCodeAt(i) - 65;
            const p2 = text.charCodeAt(i + 1) - 65;

            const c1 = this.mod(a * p1 + b * p2, 26);
            const c2 = this.mod(c * p1 + d * p2, 26);

            result += String.fromCharCode(c1 + 65);
            result += String.fromCharCode(c2 + 65);
        }

        return result;
    },

    /**
     * Decrypt ciphertext using Hill cipher.
     */
    decrypt(ciphertext, key) {
        const { a, b, c, d } = this.parseKey(key);
        const det = this.mod(a * d - b * c, 26);

        if (this.gcd(det, 26) !== 1) {
            throw new Error(`Determinan matriks (${det}) harus coprime dengan 26. Matriks kunci tidak valid.`);
        }

        const detInv = this.modInverse(det, 26);
        if (detInv === -1) throw new Error('Tidak dapat menemukan inverse dari determinan.');

        // Inverse matrix: detInv * [[d, -b], [-c, a]] mod 26
        const invA = this.mod(detInv * d, 26);
        const invB = this.mod(detInv * (-b), 26);
        const invC = this.mod(detInv * (-c), 26);
        const invD = this.mod(detInv * a, 26);

        let text = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
        if (text.length % 2 !== 0) text += 'X';

        let result = '';

        for (let i = 0; i < text.length; i += 2) {
            const c1 = text.charCodeAt(i) - 65;
            const c2 = text.charCodeAt(i + 1) - 65;

            const p1 = this.mod(invA * c1 + invB * c2, 26);
            const p2 = this.mod(invC * c1 + invD * c2, 26);

            result += String.fromCharCode(p1 + 65);
            result += String.fromCharCode(p2 + 65);
        }

        return result;
    },

    parseKey(key) {
        const a = parseInt(key.a);
        const b = parseInt(key.b);
        const c = parseInt(key.c);
        const d = parseInt(key.d);

        if ([a, b, c, d].some(isNaN)) {
            throw new Error('Semua nilai matriks harus berupa angka.');
        }

        return { a, b, c, d };
    },

    getKeyInputHTML() {
        return `
            <div class="key-field">
                <label>Matriks Kunci 2×2</label>
                <div class="matrix-input">
                    <div class="matrix-bracket left">[</div>
                    <div class="matrix-grid">
                        <input type="number" id="hill-a" placeholder="a" title="Baris 1, Kolom 1">
                        <input type="number" id="hill-b" placeholder="b" title="Baris 1, Kolom 2">
                        <input type="number" id="hill-c" placeholder="c" title="Baris 2, Kolom 1">
                        <input type="number" id="hill-d" placeholder="d" title="Baris 2, Kolom 2">
                    </div>
                    <div class="matrix-bracket right">]</div>
                </div>
                <span class="key-hint">Determinan (ad - bc) harus coprime dengan 26. Contoh: a=3, b=3, c=2, d=5</span>
            </div>
        `;
    },

    getKeyFromInputs() {
        const a = document.getElementById('hill-a').value;
        const b = document.getElementById('hill-b').value;
        const c = document.getElementById('hill-c').value;
        const d = document.getElementById('hill-d').value;
        if (!a || !b || !c || !d) throw new Error('Semua nilai matriks harus diisi.');
        return { a, b, c, d };
    }
};
