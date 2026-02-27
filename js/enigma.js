/**
 * Enigma Cipher - Simplified 3-Rotor Simulation
 * Simulates the Enigma machine with 3 rotors and a reflector.
 * Key: 3 rotor starting positions (e.g., "ABC")
 */

const EnigmaCipher = {
    name: 'Enigma Cipher',

    // Historical Enigma rotor wirings (Enigma I)
    ROTORS: [
        // Rotor I
        'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
        // Rotor II
        'AJDKSIRUXBLHWTMCQGZNPYFVOE',
        // Rotor III
        'BDFHJLCPRTXVZNYEIWGAKMUSQO'
    ],

    // Rotor notch positions (turnover points)
    NOTCHES: ['Q', 'E', 'V'], // Rotors I, II, III

    // Reflector B
    REFLECTOR: 'YRUHQSLDPXNGOKMIEBFZCWVJAT',

    /**
     * Pass a character through a rotor forward (right to left).
     */
    rotorForward(char, rotor, offset) {
        const index = (char.charCodeAt(0) - 65 + offset + 26) % 26;
        const outChar = rotor[index];
        return String.fromCharCode(((outChar.charCodeAt(0) - 65 - offset + 26) % 26) + 65);
    },

    /**
     * Pass a character through a rotor backward (left to right).
     */
    rotorBackward(char, rotor, offset) {
        const index = (char.charCodeAt(0) - 65 + offset + 26) % 26;
        const inputChar = String.fromCharCode(index + 65);
        const outIndex = rotor.indexOf(inputChar);
        return String.fromCharCode(((outIndex - offset + 26) % 26) + 65);
    },

    /**
     * Pass a character through the reflector.
     */
    reflect(char) {
        return this.REFLECTOR[char.charCodeAt(0) - 65];
    },

    /**
     * Step the rotors (right-to-left, with double stepping).
     */
    stepRotors(positions) {
        // Double stepping: if middle rotor is at its notch, it steps too
        const middleAtNotch = positions[1] === this.NOTCHES[1].charCodeAt(0) - 65;
        const rightAtNotch = positions[2] === this.NOTCHES[2].charCodeAt(0) - 65;

        // Right rotor always steps
        positions[2] = (positions[2] + 1) % 26;

        // Middle rotor steps if right was at notch OR middle is at notch (double stepping)
        if (rightAtNotch || middleAtNotch) {
            positions[1] = (positions[1] + 1) % 26;
        }

        // Left rotor steps if middle was at notch
        if (middleAtNotch) {
            positions[0] = (positions[0] + 1) % 26;
        }
    },

    /**
     * Encrypt/Decrypt a single character through the Enigma machine.
     * Note: Enigma is symmetric - encrypt and decrypt are the same operation.
     */
    processChar(char, positions) {
        let c = char;

        // Forward through rotors (right to left: III, II, I)
        c = this.rotorForward(c, this.ROTORS[2], positions[2]);
        c = this.rotorForward(c, this.ROTORS[1], positions[1]);
        c = this.rotorForward(c, this.ROTORS[0], positions[0]);

        // Through reflector
        c = this.reflect(c);

        // Backward through rotors (left to right: I, II, III)
        c = this.rotorBackward(c, this.ROTORS[0], positions[0]);
        c = this.rotorBackward(c, this.ROTORS[1], positions[1]);
        c = this.rotorBackward(c, this.ROTORS[2], positions[2]);

        return c;
    },

    /**
     * Process text through the Enigma machine.
     * Enigma encryption is symmetric: encrypting ciphertext with same key gives plaintext.
     */
    process(text, key) {
        const startPositions = key.positions.toUpperCase().replace(/[^A-Z]/g, '');
        if (startPositions.length !== 3) {
            throw new Error('Posisi rotor harus terdiri dari 3 huruf (contoh: ABC).');
        }

        // Initialize rotor positions
        const positions = [
            startPositions.charCodeAt(0) - 65,
            startPositions.charCodeAt(1) - 65,
            startPositions.charCodeAt(2) - 65
        ];

        const input = text.toUpperCase();
        let result = '';

        for (let i = 0; i < input.length; i++) {
            const charCode = input.charCodeAt(i);
            if (charCode >= 65 && charCode <= 90) {
                // Step rotors before encrypting each character
                this.stepRotors(positions);
                result += this.processChar(input[i], positions);
            } else {
                result += input[i];
            }
        }

        return result;
    },

    encrypt(plaintext, key) {
        return this.process(plaintext, key);
    },

    decrypt(ciphertext, key) {
        // Enigma is symmetric - same operation for encrypt and decrypt
        return this.process(ciphertext, key);
    },

    getKeyInputHTML() {
        return `
            <div class="key-field">
                <label for="enigma-positions">Posisi Awal Rotor</label>
                <input type="text" id="enigma-positions" placeholder="Contoh: ABC" maxlength="3" autocomplete="off" spellcheck="false">
                <span class="key-hint">Masukkan 3 huruf sebagai posisi awal rotor I, II, dan III</span>
            </div>
            <div class="enigma-info">
                <div class="info-label">ℹ️ Informasi Enigma</div>
                <p>Simulasi mesin Enigma dengan 3 rotor (I, II, III) dan reflektor B.</p>
                <p>Enigma bersifat simetris — enkripsi ciphertext dengan kunci yang sama akan menghasilkan plaintext.</p>
            </div>
        `;
    },

    getKeyFromInputs() {
        const positions = document.getElementById('enigma-positions').value;
        if (!positions.trim()) throw new Error('Posisi rotor tidak boleh kosong.');
        if (positions.replace(/[^a-zA-Z]/g, '').length !== 3) {
            throw new Error('Posisi rotor harus terdiri dari tepat 3 huruf.');
        }
        return { positions };
    }
};
