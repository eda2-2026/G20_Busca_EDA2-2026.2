#!/usr/bin/env node
/**
 * Script para gerar genoma_ecoli.txt (~5MB)
 * Gera DNA aleatório de 5.000.000 caracteres e insere múltiplos padrões
 * em posições conhecidas para validação de busca.
 */

const fs = require('fs');
const path = require('path');

/**
 * Gerar DNA aleatório usando buffer para performance
 * @param {number} length - Comprimento da sequência
 * @returns {string} Sequência de DNA
 */
function generateRandomDNA(length) {
    const bases = ['A', 'T', 'C', 'G'];
    const bufferSize = Math.min(length, 1000000);
    const buffer = Buffer.alloc(bufferSize);
    let dna = '';

    let remaining = length;
    while (remaining > 0) {
        const chunk = Math.min(remaining, bufferSize);
        for (let i = 0; i < chunk; i++) {
            buffer[i] = bases[Math.floor(Math.random() * 4)].charCodeAt(0);
        }
        dna += buffer.toString('utf8', 0, chunk);
        remaining -= chunk;
    }
    return dna;
}

/**
 * Inserir padrão em posição específica (substitui, não insere)
 * @param {string} dna - DNA original
 * @param {string} pattern - Padrão a inserir
 * @param {number} position - Posição para inserir
 * @returns {string} DNA com padrão inserido
 */
function insertPattern(dna, pattern, position) {
    if (position < 0 || position + pattern.length > dna.length) {
        throw new Error(`Posição inválida: ${position} para padrão de tamanho ${pattern.length}`);
    }
    return dna.substring(0, position) + pattern + dna.substring(position + pattern.length);
}

/**
 * Gerar genoma E. coli (5.000.000 caracteres)
 * @returns {object} { dna: string, positions: object }
 */
function generateEColiGenome() {
    const length = 5000000;
    const patterns = [
        { pattern: 'ATCG', count: 50 },      // 50 ocorrências de ATCG
        { pattern: 'GCTA', count: 40 },       // 40 ocorrências de GCTA
        { pattern: 'TTTT', count: 30 },       // 30 ocorrências de TTTT (poli-T)
        { pattern: 'GATTACA', count: 20 },    // 20 ocorrências de GATTACA
        { pattern: 'ATGATG', count: 15 }      // 15 ocorrências de ATGATG
    ];

    console.log(`Gerando DNA aleatório de ${length.toLocaleString()} caracteres...`);
    let dna = generateRandomDNA(length);

    // Inserir múltiplos padrões em posições conhecidas
    const insertedPatterns = {};

    for (const { pattern, count } of patterns) {
        insertedPatterns[pattern] = [];
        const sectionLength = Math.floor(length / (count + 1));

        console.log(`Inserindo padrão "${pattern}" (${count} vezes)...`);

        for (let i = 1; i <= count; i++) {
            const pos = i * sectionLength;
            if (pos + pattern.length <= dna.length) {
                dna = insertPattern(dna, pattern, pos);
                insertedPatterns[pattern].push(pos);
            }
        }
    }

    return { dna, positions: insertedPatterns };
}

/**
 * Validar genoma
 * @param {string} dna - Sequência de DNA
 * @returns {boolean} true se válido
 */
function validateGenome(dna) {
    // Verificar comprimento mínimo (1MB)
    if (dna.length < 1000000) {
        console.error(`❌ Comprimento inválido: ${dna.length} (mínimo: 1.000.000)`);
        return false;
    }

    // Verificar caracteres válidos
    const invalidChars = dna.replace(/[ATCG]/g, '');
    if (invalidChars.length > 0) {
        console.error(`❌ Caracteres inválidos encontrados: ${invalidChars.substring(0, 100)}`);
        return false;
    }

    console.log(`✅ Validação passou: ${dna.length.toLocaleString()} caracteres, apenas A/T/C/G`);
    return true;
}

/**
 * Salvar genoma em arquivo
 * @param {string} dna - Sequência de DNA
 * @param {object} positions - Posições dos padrões inseridos
 * @param {string} outputPath - Caminho do arquivo de saída
 */
function saveGenome(dna, positions, outputPath) {
    fs.writeFileSync(outputPath, dna, 'utf8');
    console.log(`\nGenoma salvo em: ${outputPath}`);
    console.log(`Comprimento: ${dna.length.toLocaleString()} caracteres`);

    // Salvar posições em arquivo de metadados
    const metadataPath = outputPath.replace('.txt', '_positions.json');
    const metadata = {
        length: dna.length,
        patterns: positions,
        description: 'Genoma E. coli sintético com 5.000.000 caracteres e padrões conhecidos',
        created: new Date().toISOString()
    };
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
    console.log(`Posições salvas em: ${metadataPath}`);

    // Calcular tamanho em bytes
    const stats = fs.statSync(outputPath);
    console.log(`Tamanho do arquivo: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
}

// Executar geração
const outputPath = path.join(__dirname, '..', 'dados', 'genoma_ecoli.txt');

console.log('=== Gerador de Genoma E. coli (5MB) ===\n');

const { dna, positions } = generateEColiGenome();

if (validateGenome(dna)) {
    saveGenome(dna, positions, outputPath);

    console.log('\n=== Resumo das Posições ===');
    for (const [pattern, posList] of Object.entries(positions)) {
        console.log(`  "${pattern}": ${posList.length} ocorrências (primeiras 5: [${posList.slice(0, 5).join(', ')}])`);
    }
} else {
    console.error('\n❌ Falha na validação do genoma');
    process.exit(1);
}
