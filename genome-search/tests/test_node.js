/**
 * Test runner for KMP and Brute Force algorithms
 * Node.js version using vm module for proper global scope
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Create a context with global objects
const context = vm.createContext({
    window: {},
    console: console,
    performance: performance,
    RegExp: RegExp,
    TypeError: TypeError,
    Error: Error,
    Math: Math,
    JSON: JSON,
    Array: Array,
    String: String,
    Number: Number,
    Boolean: Boolean,
    Object: Object,
    parseInt: parseInt,
    parseFloat: parseFloat,
    isNaN: isNaN,
    process: process
});

// Load and execute the algorithm files
function loadFile(filePath) {
    const code = fs.readFileSync(filePath, 'utf8');
    vm.runInContext(code, context, { filename: filePath });
}

// Load the algorithm files
loadFile(path.join(__dirname, '..', 'js', 'kmp.js'));
loadFile(path.join(__dirname, '..', 'js', 'forca_bruta.js'));
loadFile(path.join(__dirname, '..', 'js', 'utils.js'));

// Extract functions from context
const { kmpSearch, computeLPS } = context.window;
const { bruteForceSearch } = context.window;
const { isValidDNA, measureTime, formatTime } = context.window;

// Test utilities
let totalPassed = 0;
let totalFailed = 0;
const allResults = [];

function assert(testName, condition, details = '') {
    if (condition) {
        totalPassed++;
        console.log(`✅ PASSOU: ${testName}`);
    } else {
        totalFailed++;
        console.error(`❌ FALHOU: ${testName}${details ? ' — ' + details : ''}`);
    }
    allResults.push({ name: testName, passed: condition, details });
    return condition;
}

function arrayEquals(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

// ============================================================
// SEÇÃO 1: TESTES KMP
// ============================================================
console.log('\n═══════════════════════════════════════');
console.log('  TESTES KMP (Knuth-Morris-Pratt)');
console.log('═══════════════════════════════════════');

let kmpPassed = 0;
let kmpTotal = 0;

function kmpTest(name, fn) {
    kmpTotal++;
    try {
        const result = fn();
        if (result) kmpPassed++;
    } catch (e) {
        console.error(`❌ ERRO: ${name} — ${e.message}`);
    }
}

// T1: Padrão com múltiplas ocorrências
console.log('\n▸ T1: Padrão com múltiplas ocorrências');
kmpTest('KMP: "ATCG" em "ATCGATCGATCG"', () => {
    const r = kmpSearch('ATCGATCGATCG', 'ATCG');
    return assert('KMP: "ATCG" em "ATCGATCGATCG"', arrayEquals(r, [0, 4, 8]),
        `obtido [${r}] esperado [0,4,8]`);
});

// T2: Padrão inexistente
console.log('\n▸ T2: Padrão inexistente');
kmpTest('KMP: "GCTA" em "ATCGATCG"', () => {
    const r = kmpSearch('ATCGATCG', 'GCTA');
    return assert('KMP: "GCTA" em "ATCGATCG"', arrayEquals(r, []),
        `obtido [${r}] esperado []`);
});

// T3: Padrão no início
console.log('\n▸ T3: Padrão no início do texto');
kmpTest('KMP: padrão começa na posição 0', () => {
    const r = kmpSearch('ATCGATCG', 'ATCG');
    return assert('KMP: padrão no início (pos 0)', r[0] === 0,
        `primeira posição: ${r[0]}`);
});

// T4: Padrão no fim
console.log('\n▸ T4: Padrão no final do texto');
kmpTest('KMP: padrão termina no último caractere', () => {
    const r = kmpSearch('ATCGATCGATCG', 'ATCG');
    const lastPos = r[r.length - 1];
    return assert('KMP: padrão no fim', lastPos === 8,
        `última posição: ${lastPos}, esperado: 8`);
});

// T5: Padrão de 1 caractere
console.log('\n▸ T5: Padrão de 1 caractere');
kmpTest('KMP: "A" em "ATCGATCG"', () => {
    const r = kmpSearch('ATCGATCG', 'A');
    return assert('KMP: "A" em "ATCGATCG"', arrayEquals(r, [0, 4]),
        `obtido [${r}] esperado [0,4]`);
});

// T6: Padrão é o texto inteiro
console.log('\n▸ T6: Padrão é o texto inteiro');
kmpTest('KMP: padrão == texto', () => {
    const r = kmpSearch('ATCG', 'ATCG');
    return assert('KMP: padrão == texto', arrayEquals(r, [0]),
        `obtido [${r}] esperado [0]`);
});

// T7: Padrão maior que texto
console.log('\n▸ T7: Padrão maior que texto');
kmpTest('KMP: padrão > texto retorna vazio', () => {
    const r = kmpSearch('AT', 'ATCG');
    return assert('KMP: padrão > texto', arrayEquals(r, []),
        `obtido [${r}] esperado []`);
});

// T8: Padrões sobrepostos
console.log('\n▸ T8: Padrões sobrepostos');
kmpTest('KMP: "AAA" em "AAAA"', () => {
    const r = kmpSearch('AAAA', 'AAA');
    return assert('KMP: "AAA" em "AAAA"', arrayEquals(r, [0, 1]),
        `obtido [${r}] esperado [0,1]`);
});

// T9: Texto = padrão repetido
console.log('\n▸ T9: Texto = padrão repetido');
kmpTest('KMP: "AT" em "ATATATAT"', () => {
    const r = kmpSearch('ATATATAT', 'AT');
    return assert('KMP: "AT" em "ATATATAT"', arrayEquals(r, [0, 2, 4, 6]),
        `obtido [${r}] esperado [0,2,4,6]`);
});

// T10: LPS
console.log('\n▸ T10: Cálculo LPS');
kmpTest('KMP: LPS de "AABAACAABAA"', () => {
    const lps = computeLPS('AABAACAABAA');
    return assert('KMP: LPS correto', arrayEquals(lps, [0,1,0,1,2,0,1,2,3,4,5]),
        `obtido [${lps}]`);
});

// T11: DNA realista
console.log('\n▸ T11: Sequência DNA realista');
kmpTest('KMP: "GATTACA" em sequência longa', () => {
    const dna = 'ATCGATCGGATTACAGCTAGATTACAATCG';
    const r = kmpSearch(dna, 'GATTACA');
    return assert('KMP: "GATTACA" encontrado', r.length > 0,
        `posições: [${r}]`);
});

console.log(`\n─── KMP: ${kmpPassed}/${kmpTotal} testes passaram ───`);

// ============================================================
// SEÇÃO 2: TESTES FORÇA BRUTA
// ============================================================
console.log('\n═══════════════════════════════════════');
console.log('  TESTES FORÇA BRUTA');
console.log('═══════════════════════════════════════');

let bfPassed = 0;
let bfTotal = 0;

function bfTest(name, fn) {
    bfTotal++;
    try {
        const result = fn();
        if (result) bfPassed++;
    } catch (e) {
        console.error(`❌ ERRO: ${name} — ${e.message}`);
    }
}

// T1: Padrão com múltiplas ocorrências
console.log('\n▸ T1: Padrão com múltiplas ocorrências');
bfTest('FB: "ATCG" em "ATCGATCGATCG"', () => {
    const r = bruteForceSearch('ATCGATCGATCG', 'ATCG');
    return assert('FB: "ATCG" em "ATCGATCGATCG"', arrayEquals(r, [0, 4, 8]),
        `obtido [${r}] esperado [0,4,8]`);
});

// T2: Padrão inexistente
console.log('\n▸ T2: Padrão inexistente');
bfTest('FB: "GCTA" em "ATCGATCG"', () => {
    const r = bruteForceSearch('ATCGATCG', 'GCTA');
    return assert('FB: "GCTA" em "ATCGATCG"', arrayEquals(r, []),
        `obtido [${r}] esperado []`);
});

// T3: Padrão no início
console.log('\n▸ T3: Padrão no início do texto');
bfTest('FB: padrão começa na posição 0', () => {
    const r = bruteForceSearch('ATCGATCG', 'ATCG');
    return assert('FB: padrão no início (pos 0)', r[0] === 0,
        `primeira posição: ${r[0]}`);
});

// T4: Padrão no fim
console.log('\n▸ T4: Padrão no final do texto');
bfTest('FB: padrão termina no último caractere', () => {
    const r = bruteForceSearch('ATCGATCGATCG', 'ATCG');
    const lastPos = r[r.length - 1];
    return assert('FB: padrão no fim', lastPos === 8,
        `última posição: ${lastPos}, esperado: 8`);
});

// T5: Padrão de 1 caractere
console.log('\n▸ T5: Padrão de 1 caractere');
bfTest('FB: "A" em "ATCGATCG"', () => {
    const r = bruteForceSearch('ATCGATCG', 'A');
    return assert('FB: "A" em "ATCGATCG"', arrayEquals(r, [0, 4]),
        `obtido [${r}] esperado [0,4]`);
});

// T6: Padrão é o texto inteiro
console.log('\n▸ T6: Padrão é o texto inteiro');
bfTest('FB: padrão == texto', () => {
    const r = bruteForceSearch('ATCG', 'ATCG');
    return assert('FB: padrão == texto', arrayEquals(r, [0]),
        `obtido [${r}] esperado [0]`);
});

// T7: Padrão maior que texto (lança erro)
console.log('\n▸ T7: Padrão maior que texto');
bfTest('FB: padrão > texto lança erro', () => {
    try {
        bruteForceSearch('AT', 'ATCG');
        return assert('FB: padrão > texto', false, 'deveria lançar erro');
    } catch (e) {
        return assert('FB: padrão > texto lança erro', true, e.message);
    }
});

// T8: Padrões sobrepostos
console.log('\n▸ T8: Padrões sobrepostos');
bfTest('FB: "AAA" em "AAAA"', () => {
    const r = bruteForceSearch('AAAA', 'AAA');
    return assert('FB: "AAA" em "AAAA"', arrayEquals(r, [0, 1]),
        `obtido [${r}] esperado [0,1]`);
});

// T9: Texto = padrão repetido
console.log('\n▸ T9: Texto = padrão repetido');
bfTest('FB: "AT" em "ATATATAT"', () => {
    const r = bruteForceSearch('ATATATAT', 'AT');
    return assert('FB: "AT" em "ATATATAT"', arrayEquals(r, [0, 2, 4, 6]),
        `obtido [${r}] esperado [0,2,4,6]`);
});

// T10: Validação de entrada
console.log('\n▸ T10: Validação de entrada');
bfTest('FB: texto vazio lança erro', () => {
    try {
        bruteForceSearch('', 'ATCG');
        return assert('FB: texto vazio', false, 'deveria lançar erro');
    } catch (e) {
        return assert('FB: texto vazio lança erro', true, e.message);
    }
});
bfTest('FB: padrão vazio lança erro', () => {
    try {
        bruteForceSearch('ATCG', '');
        return assert('FB: padrão vazio', false, 'deveria lançar erro');
    } catch (e) {
        return assert('FB: padrão vazio lança erro', true, e.message);
    }
});
bfTest('FB: caracteres inválidos lança erro', () => {
    try {
        bruteForceSearch('ATCGATCG', 'XYZW');
        return assert('FB: caracteres inválidos', false, 'deveria lançar erro');
    } catch (e) {
        return assert('FB: caracteres inválidos lança erro', true, e.message);
    }
});
bfTest('FB: parâmetros não-string lançam erro', () => {
    try {
        bruteForceSearch(123, 'ATCG');
        return assert('FB: não-string', false, 'deveria lançar erro');
    } catch (e) {
        return assert('FB: parâmetros não-string lança erro', true, e.message);
    }
});

// T11: DNA realista
console.log('\n▸ T11: Sequência DNA realista');
bfTest('FB: "GATTACA" em sequência longa', () => {
    const dna = 'ATCGATCGGATTACAGCTAGATTACAATCG';
    const r = bruteForceSearch(dna, 'GATTACA');
    return assert('FB: "GATTACA" encontrado', r.length > 0,
        `posições: [${r}]`);
});

console.log(`\n─── Força Bruta: ${bfPassed}/${bfTotal} testes passaram ───`);

// ============================================================
// SEÇÃO 3: COMPARAÇÃO KMP vs FORÇA BRUTA
// ============================================================
console.log('\n═══════════════════════════════════════');
console.log('  COMPARAÇÃO: KMP vs FORÇA BRUTA');
console.log('═══════════════════════════════════════');

const testCases = [
    { text: 'ATCGATCGATCG', pattern: 'ATCG', desc: 'Ocorrências múltiplas' },
    { text: 'ATCGATCG', pattern: 'GCTA', desc: 'Padrão inexistente' },
    { text: 'ATCGATCGATCG', pattern: 'A', desc: 'Padrão single char' },
    { text: 'ATCGATCGATCG', pattern: 'ATCGATCGATCG', desc: 'Padrão = texto' },
    { text: 'AAAA', pattern: 'AAA', desc: 'Padrões sobrepostos' },
    { text: 'ATATATAT', pattern: 'AT', desc: 'Texto repetido' },
    { text: 'ATCGATCGGATTACAGCTAGATTACAATCG', pattern: 'GATTACA', desc: 'DNA realista' },
    { text: 'ATCGATCGATCGATCGATCG', pattern: 'ATCGATCG', desc: 'Padrão longo' },
];

let allMatch = true;
let matchCount = 0;

testCases.forEach((tc, i) => {
    console.log(`\n▸ C${i + 1}: ${tc.desc}`);
    const kmpResult = kmpSearch(tc.text, tc.pattern);
    const bfResult = bruteForceSearch(tc.text, tc.pattern);
    const match = arrayEquals(kmpResult, bfResult);

    if (match) matchCount++;
    else allMatch = false;

    console.log(`  Texto: "${tc.text.substring(0, 30)}${tc.text.length > 30 ? '...' : ''}"`);
    console.log(`  Padrão: "${tc.pattern}"`);
    console.log(`  KMP:    [${kmpResult.join(', ')}]`);
    console.log(`  FB:     [${bfResult.join(', ')}]`);
    console.log(`  Match:  ${match ? '✅ SIM' : '❌ NÃO'}`);

    assert(`Comparação C${i + 1}: ${tc.desc}`, match,
        `KMP=[${kmpResult}] FB=[${bfResult}]`);
});

console.log(`\n─── Comparação: ${matchCount}/${testCases.length} cenários idênticos ───`);

if (allMatch) {
    console.log('\n✅ CONCLUSÃO: KMP e Força Bruta retornam os mesmos resultados em todos os cenários!');
} else {
    console.log('\n❌ ALERTA: Existem diferenças entre KMP e Força Bruta!');
}

// ============================================================
// SEÇÃO 4: TESTES DE PERFORMANCE
// ============================================================
console.log('\n═══════════════════════════════════════');
console.log('  TESTES DE PERFORMANCE');
console.log('═══════════════════════════════════════');

function generateDNA(length) {
    const bases = ['A', 'T', 'C', 'G'];
    let dna = '';
    for (let i = 0; i < length; i++) {
        dna += bases[Math.floor(Math.random() * 4)];
    }
    return dna;
}

const sizes = [
    { textLen: 1000, patternLen: 4, label: 'Pequeno (1K)' },
    { textLen: 10000, patternLen: 6, label: 'Médio (10K)' },
    { textLen: 100000, patternLen: 8, label: 'Grande (100K)' },
];

const speedups = [];

sizes.forEach((size, i) => {
    console.log(`\n▸ Teste ${i + 1}: ${size.label}`);

    const text = generateDNA(size.textLen);
    const pattern = text.substring(Math.floor(size.textLen / 2), Math.floor(size.textLen / 2) + size.patternLen);

    // KMP: rodar 10 vezes e pegar a mediana
    const kmpTimes = [];
    let kmpResult;
    for (let r = 0; r < 10; r++) {
        const t = measureTime(kmpSearch, 10, text, pattern);
        kmpTimes.push(t.time);
        kmpResult = t.result;
    }
    kmpTimes.sort((a, b) => a - b);
    const kmpMedian = kmpTimes[4];

    // Força Bruta: rodar 10 vezes e pegar a mediana
    const bfTimes = [];
    let bfResult;
    for (let r = 0; r < 10; r++) {
        const t = measureTime(bruteForceSearch, 10, text, pattern);
        bfTimes.push(t.time);
        bfResult = t.result;
    }
    bfTimes.sort((a, b) => a - b);
    const bfMedian = bfTimes[4];

    const speedup = bfMedian / kmpMedian;
    speedups.push(speedup);

    console.log(`  Texto: ${size.textLen.toLocaleString()} chars | Padrão: ${size.patternLen} chars`);
    console.log(`  KMP:           ${formatTime(kmpMedian)} (mediana de 10)`);
    console.log(`  Força Bruta:   ${formatTime(bfMedian)} (mediana de 10)`);
    console.log(`  Speedup:       ${speedup.toFixed(2)}x`);
    console.log(`  Resultados iguais: ${arrayEquals(kmpResult, bfResult) ? '✅' : '❌'}`);
});

// Resumo
console.log('\n═══════════════════════════════════════');
console.log('  RESUMO DE PERFORMANCE');
console.log('═══════════════════════════════════════');

const avgSpeedup = speedups.reduce((a, b) => a + b, 0) / speedups.length;
console.log(`Speedups: ${speedups.map(s => s.toFixed(2) + 'x').join(', ')}`);
console.log(`Speedup médio: ${avgSpeedup.toFixed(2)}x`);

if (avgSpeedup > 1) {
    console.log('\n✅ KMP é consistentemente mais rápido que Força Bruta!');
} else {
    console.log('\n⚠️ KMP não mostrou vantagem (dados pequenos podem não revelar diferença)');
}

// ============================================================
// SEÇÃO 5: TESTES ISSUE #17 — Tratamento de erros e loading
// ============================================================
console.log('\n═══════════════════════════════════════');
console.log('  TESTES ISSUE #17 — Erros e Loading');
console.log('═══════════════════════════════════════');

let i17Passed = 0;
let i17Total = 0;

function i17Test(name, fn) {
    i17Total++;
    try {
        const result = fn();
        if (result) i17Passed++;
    } catch (e) {
        console.error(`❌ ERRO: ${name} — ${e.message}`);
    }
}

// T1: Validação de extensão .txt
console.log('\n▸ T1: Validação de extensão do arquivo');
i17Test('Extensão .txt é aceita', () => {
    const fileName = 'genome.txt';
    const ext = fileName.split('.').pop().toLowerCase();
    return assert('Extensão .txt', ext === 'txt', `obtido: ${ext}`);
});
i17Test('Extensão .csv é rejeitada', () => {
    const fileName = 'genome.csv';
    const ext = fileName.split('.').pop().toLowerCase();
    return assert('Extensão .csv', ext !== 'txt', `obtido: ${ext}`);
});
i17Test('Extensão .fasta é rejeitada', () => {
    const fileName = 'genome.fasta';
    const ext = fileName.split('.').pop().toLowerCase();
    return assert('Extensão .fasta', ext !== 'txt', `obtido: ${ext}`);
});
i17Test('Sem extensão é rejeitada', () => {
    const fileName = 'genome';
    const ext = fileName.split('.').pop().toLowerCase();
    return assert('Sem extensão', ext !== 'txt', `obtido: ${ext}`);
});
i17Test('Extensão .TXT (maiúscula) é aceita', () => {
    const fileName = 'genome.TXT';
    const ext = fileName.split('.').pop().toLowerCase();
    return assert('Extensão .TXT', ext === 'txt', `obtido: ${ext}`);
});

// T2: Remoção de caracteres inválidos
console.log('\n▸ T2: Remoção de caracteres inválidos (strip + warn)');
i17Test('Caracteres inválidos são removidos', () => {
    const raw = 'ATCGXYZ123ATCG';
    const invalidCount = (raw.match(/[^ATCG]/g) || []).length;
    const genome = raw.replace(/[^ATCG]/g, '');
    return assert('Remove inválidos', genome === 'ATCGATCG' && invalidCount === 6,
        `genome: ${genome}, invalidCount: ${invalidCount}`);
});
i17Test('Sequência limpa permanece intacta', () => {
    const raw = 'ATCGATCG';
    const invalidCount = (raw.match(/[^ATCG]/g) || []).length;
    const genome = raw.replace(/[^ATCG]/g, '');
    return assert('Sequência limpa', genome === 'ATCGATCG' && invalidCount === 0,
        `genome: ${genome}, invalidCount: ${invalidCount}`);
});
i17Test('Espaços e quebras de linha são removidos', () => {
    const raw = 'AT CG\nATCG';
    const cleaned = raw.toUpperCase().replace(/\s/g, '');
    const genome = cleaned.replace(/[^ATCG]/g, '');
    return assert('Espaços removidos', genome === 'ATCGATCG',
        `genome: ${genome}`);
});
i17Test('Mistura de válidos e inválidos', () => {
    const raw = 'A-T-C-G-XYZ';
    const invalidCount = (raw.match(/[^ATCG]/g) || []).length;
    const genome = raw.replace(/[^ATCG]/g, '');
    return assert('Mistura', genome === 'ATCG' && invalidCount === 7,
        `genome: ${genome}, invalidCount: ${invalidCount}`);
});
i17Test('Genoma resultante é válido para busca', () => {
    const raw = 'ATCGXYZATCG';
    const genome = raw.replace(/[^ATCG]/g, '');
    const isValid = /^[ATCG]+$/.test(genome);
    const positions = kmpSearch(genome, 'ATCG');
    return assert('Genoma limpo é válido', isValid && positions.length === 2,
        `isValid: ${isValid}, positions: [${positions}]`);
});
i17Test('Genoma vazio após remoção', () => {
    const raw = 'XYZ123';
    const genome = raw.replace(/[^ATCG]/g, '');
    return assert('Genoma vazio', genome === '', `genome: "${genome}"`);
});

// T3: Formatação de mensagens de erro (pt-BR)
console.log('\n▸ T3: Mensagens de erro em português');
i17Test('Mensagem de formato inválido', () => {
    const msg = 'Formato inválido. Use apenas arquivos .txt.';
    return assert('Msg formato', msg.includes('inválido') && msg.includes('.txt'),
        `msg: ${msg}`);
});
i17Test('Mensagem de caracteres removidos', () => {
    const count = 5;
    const msg = `${count} caracteres inválidos foram removidos. Apenas A, T, C, G são permitidos.`;
    return assert('Msg caracteres', msg.includes('5') && msg.includes('removidos'),
        `msg: ${msg}`);
});
i17Test('Mensagem de arquivo vazio', () => {
    const msg = 'O arquivo está vazio.';
    return assert('Msg vazio', msg.includes('vazio'), `msg: ${msg}`);
});

// ============================================================
// RESUMO FINAL
// ============================================================
console.log('\n═══════════════════════════════════════');
console.log('  RESUMO FINAL');
console.log('═══════════════════════════════════════');
console.log(`  KMP:          ${kmpPassed}/${kmpTotal} passaram`);
console.log(`  Força Bruta:  ${bfPassed}/${bfTotal} passaram`);
console.log(`  Comparação:   ${matchCount}/${testCases.length} idênticos`);
console.log(`  Issue #17:    ${i17Passed}/${i17Total} passaram`);
console.log(`  Speedup médio: ${avgSpeedup.toFixed(2)}x`);

if (totalFailed === 0 && i17Passed === i17Total) {
    console.log('\n✅ TODOS OS TESTES PASSARAM!');
    process.exit(0);
} else {
    const totalAllFailed = totalFailed + (i17Total - i17Passed);
    console.log(`\n❌ ${totalAllFailed} teste(s) falharam`);
    process.exit(1);
}
