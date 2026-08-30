/**
 * Script de geração de DNA aleatório
 * Gera sequências de DNA com padrões conhecidos
 */

/**
 * Gerar DNA aleatório
 * @param {number} length - Comprimento da sequência
 * @returns {string} Sequência de DNA
 */
function generateRandomDNA(length) {
    const bases = ['A', 'T', 'C', 'G'];
    let dna = '';
    for (let i = 0; i < length; i++) {
        dna += bases[Math.floor(Math.random() * 4)];
    }
    return dna;
}

/**
 * Inserir padrão em posição específica
 * @param {string} dna - DNA original
 * @param {string} pattern - Padrão a inserir
 * @param {number} position - Posição para inserir
 * @returns {string} DNA com padrão inserido
 */
function insertPattern(dna, pattern, position) {
    if (position < 0 || position > dna.length) {
        throw new Error('Posição inválida');
    }
    return dna.substring(0, position) + pattern + dna.substring(position);
}

/**
 * Gerar genoma pequeno (1.000 caracteres)
 * @returns {object} { dna: string, positions: number[] }
 */
function generateSmallGenome() {
    const length = 1000;
    const pattern = 'ATCG';
    const numOccurrences = 5;
    
    let dna = generateRandomDNA(length);
    
    // Inserir padrão em posições conhecidas
    const positions = [];
    const spacing = Math.floor(length / (numOccurrences + 1));
    
    for (let i = 1; i <= numOccurrences; i++) {
        const pos = i * spacing;
        dna = insertPattern(dna, pattern, pos);
        positions.push(pos);
    }
    
    return { dna, positions };
}

/**
 * Gerar genoma médio (100.000 caracteres)
 * @returns {object} { dna: string, positions: object }
 */
function generateMediumGenome() {
    const length = 100000;
    const patterns = [
        { pattern: 'ATCG', count: 10 },
        { pattern: 'GCTA', count: 8 },
        { pattern: 'TTTT', count: 5 }
    ];
    
    let dna = generateRandomDNA(length);
    
    // Inserir múltiplos padrões
    const insertedPatterns = {};
    let currentPos = 0;
    
    for (const { pattern, count } of patterns) {
        insertedPatterns[pattern] = [];
        const spacing = Math.floor((length - currentPos) / (count + 1));
        
        for (let i = 1; i <= count; i++) {
            const pos = currentPos + i * spacing;
            if (pos + pattern.length <= dna.length) {
                dna = insertPattern(dna, pattern, pos);
                insertedPatterns[pattern].push(pos);
            }
        }
        
        currentPos += Math.floor(length / patterns.length);
    }
    
    return { dna, positions: insertedPatterns };
}

/**
 * Gerar genoma E. coli (5MB)
 * @returns {object} { dna: string, positions: object }
 */
function generateEColiGenome() {
    const length = 5000000; // 5MB
    const patterns = [
        { pattern: 'ATCG', count: 50 },
        { pattern: 'GCTA', count: 40 },
        { pattern: 'TTTT', count: 30 }
    ];
    
    let dna = generateRandomDNA(length);
    
    // Inserir múltiplos padrões
    const insertedPatterns = {};
    let currentPos = 0;
    
    for (const { pattern, count } of patterns) {
        insertedPatterns[pattern] = [];
        const spacing = Math.floor((length - currentPos) / (count + 1));
        
        for (let i = 1; i <= count; i++) {
            const pos = currentPos + i * spacing;
            if (pos + pattern.length <= dna.length) {
                dna = insertPattern(dna, pattern, pos);
                insertedPatterns[pattern].push(pos);
            }
        }
        
        currentPos += Math.floor(length / patterns.length);
    }
    
    return { dna, positions: insertedPatterns };
}

// Exportar funções
window.generateSmallGenome = generateSmallGenome;
window.generateMediumGenome = generateMediumGenome;
window.generateEColiGenome = generateEColiGenome;