#!/usr/bin/env node
/**
 * Script para gerar genoma_medium.txt (100.000 caracteres)
 * Gera DNA aleatório e insere múltiplos padrões em posições conhecidas
 */

const fs = require('fs');
const path = require('path');

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
 * Gerar genoma médio (100.000 caracteres)
 * @returns {object} { dna: string, positions: object }
 */
function generateMediumGenome() {
    const length = 100000;
    const patterns = [
        { pattern: 'ATCG', count: 10 },   // 10 ocorrências de ATCG
        { pattern: 'GCTA', count: 8 },    // 8 ocorrências de GCTA
        { pattern: 'TTTT', count: 5 }     // 5 ocorrências de TTTT (poli-T)
    ];

    console.log(`Gerando DNA aleatório de ${length} caracteres...`);
    let dna = generateRandomDNA(length);

    // Inserir múltiplos padrões em posições conhecidas
    const insertedPatterns = {};
    let offset = 0;

    for (const { pattern, count } of patterns) {
        insertedPatterns[pattern] = [];
        const sectionLength = Math.floor((length - offset) / (count + 1));

        console.log(`Inserindo padrão "${pattern}" (${count} vezes)...`);

        for (let i = 1; i <= count; i++) {
            const pos = offset + i * sectionLength;
            if (pos + pattern.length <= dna.length) {
                dna = insertPattern(dna, pattern, pos);
                insertedPatterns[pattern].push(pos);
            }
        }

        offset += Math.floor(length / patterns.length);
    }

    return { dna, positions: insertedPatterns };
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
    console.log(`Comprimento: ${dna.length} caracteres`);

    // Salvar posições em arquivo de metadados
    const metadataPath = outputPath.replace('.txt', '_positions.json');
    const metadata = {
        length: dna.length,
        patterns: positions,
        description: 'Genoma médio com 100.000 caracteres e padrões conhecidos',
        created: new Date().toISOString()
    };
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
    console.log(`Posições salvas em: ${metadataPath}`);
}

/**
 * Validar genoma
 * @param {string} dna - Sequência de DNA
 * @returns {boolean} true se válido
 */
function validateGenome(dna) {
    // Verificar comprimento
    if (dna.length !== 100000) {
        console.error(`❌ Comprimento inválido: ${dna.length} (esperado: 100000)`);
        return false;
    }

    // Verificar caracteres válidos
    const invalidChars = dna.replace(/[ATCG]/g, '');
    if (invalidChars.length > 0) {
        console.error(`❌ Caracteres inválidos encontrados: ${invalidChars}`);
        return false;
    }

    console.log(`✅ Validação passou: ${dna.length} caracteres, apenas A/T/C/G`);
    return true;
}

// Executar geração
const outputPath = path.join(__dirname, '..', 'dados', 'genoma_medium.txt');

console.log('=== Gerador de Genoma Médio (100k) ===\n');

const { dna, positions } = generateMediumGenome();

if (validateGenome(dna)) {
    saveGenome(dna, positions, outputPath);

    console.log('\n=== Resumo das Posições ===');
    for (const [pattern, posList] of Object.entries(positions)) {
        console.log(`  "${pattern}": ${posList.length} ocorrências em posições [${posList.join(', ')}]`);
    }
} else {
    console.error('\n❌ Falha na validação do genoma');
    process.exit(1);
}
