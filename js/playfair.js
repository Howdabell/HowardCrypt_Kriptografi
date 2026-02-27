/**
 * Playfair Cipher - 26 alphabet (I/J combined)
 * Uses a 5x5 matrix generated from a keyword.
 */

const PlayfairCipher = {
    name: 'Playfair Cipher',

    /**
     * Generate the 5x5 Playfair matrix from a keyword.
     */
    generateMatrix(keyword) {
        const key = keyword.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
        const seen = new Set();
        const matrix = [];

        // Add keyword characters first
        for (const ch of key) {
            if (!seen.has(ch)) {
                seen.add(ch);
                matrix.push(ch);
            }
        }

        // Add remaining alphabet letters
        for (let i = 0; i < 26; i++) {
            const ch = String.fromCharCode(65 + i);
            if (ch === 'J') continue; // Skip J, use I instead
            if (!seen.has(ch)) {
                seen.add(ch);
                matrix.push(ch);
            }
        }

        return matrix;
    },

    /**
     * Find the position (row, col) of a character in the matrix.
     */
    findPosition(matrix, char) {
        const idx = matrix.indexOf(char);
        return { row: Math.floor(idx / 5), col: idx % 5 };
    },

    /**
     * Prepare plaintext for Playfair: split into digraphs, insert X between duplicates, pad if odd.
     */
    prepareText(text) {
        let prepared = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
        let digraphs = [];
        let i = 0;

        while (i < prepared.length) {
            const first = prepared[i];
            let second;

            if (i + 1 >= prepared.length) {
                second = 'X';
                i++;
            } else if (prepared[i] === prepared[i + 1]) {
                second = 'X';
                i++;
            } else {
                second = prepared[i + 1];
                i += 2;
            }

            digraphs.push([first, second]);
        }

        return digraphs;
    },

    /**
     * Encrypt plaintext using Playfair cipher.
     */
    encrypt(plaintext, key) {
        const keyword = key.keyword;
        if (!keyword || !keyword.trim()) throw new Error('Keyword tidak boleh kosong.');

        const matrix = this.generateMatrix(keyword);
        const digraphs = this.prepareText(plaintext);
        let result = '';

        for (const [a, b] of digraphs) {
            const posA = this.findPosition(matrix, a);
            const posB = this.findPosition(matrix, b);

            if (posA.row === posB.row) {
                // Same row: shift right
                result += matrix[posA.row * 5 + (posA.col + 1) % 5];
                result += matrix[posB.row * 5 + (posB.col + 1) % 5];
            } else if (posA.col === posB.col) {
                // Same column: shift down
                result += matrix[((posA.row + 1) % 5) * 5 + posA.col];
                result += matrix[((posB.row + 1) % 5) * 5 + posB.col];
            } else {
                // Rectangle: swap columns
                result += matrix[posA.row * 5 + posB.col];
                result += matrix[posB.row * 5 + posA.col];
            }
        }

        return result;
    },

    /**
     * Decrypt ciphertext using Playfair cipher.
     */
    decrypt(ciphertext, key) {
        const keyword = key.keyword;
        if (!keyword || !keyword.trim()) throw new Error('Keyword tidak boleh kosong.');

        const matrix = this.generateMatrix(keyword);
        let text = ciphertext.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');

        // Pad if odd length
        if (text.length % 2 !== 0) text += 'X';

        let result = '';

        for (let i = 0; i < text.length; i += 2) {
            const a = text[i];
            const b = text[i + 1];
            const posA = this.findPosition(matrix, a);
            const posB = this.findPosition(matrix, b);

            if (posA.row === posB.row) {
                // Same row: shift left
                result += matrix[posA.row * 5 + (posA.col + 4) % 5];
                result += matrix[posB.row * 5 + (posB.col + 4) % 5];
            } else if (posA.col === posB.col) {
                // Same column: shift up
                result += matrix[((posA.row + 4) % 5) * 5 + posA.col];
                result += matrix[((posB.row + 4) % 5) * 5 + posB.col];
            } else {
                // Rectangle: swap columns
                result += matrix[posA.row * 5 + posB.col];
                result += matrix[posB.row * 5 + posA.col];
            }
        }

        return result;
    },

    getKeyInputHTML() {
        return `
            <div class="key-field">
                <label for="playfair-keyword">Keyword</label>
                <input type="text" id="playfair-keyword" placeholder="Contoh: MONARCHY" autocomplete="off" spellcheck="false">
                <span class="key-hint">Masukkan kata kunci untuk membuat matriks 5×5 (huruf I dan J digabung)</span>
            </div>
        `;
    },

    getKeyFromInputs() {
        const keyword = document.getElementById('playfair-keyword').value;
        if (!keyword.trim()) throw new Error('Keyword tidak boleh kosong.');
        return { keyword };
    }
};
