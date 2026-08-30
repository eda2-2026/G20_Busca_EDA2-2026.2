/**
 * Funções Utilitárias
 * Implementação em JavaScript puro
 */

/**
 * Validar sequência de DNA
 * Aceita apenas A, T, C, G (case-insensitive), ignorando espaços e quebras de linha
 * @param {string} sequence - Sequência de DNA
 * @returns {boolean} True se válida (apenas A, T, C, G)
 */
function isValidDNA(sequence) {
    if (typeof sequence !== 'string') return false;
    const cleaned = sequence.toUpperCase().replace(/\s/g, '');
    if (cleaned.length === 0) return false;
    return /^[ATCG]+$/.test(cleaned);
}

/**
 * Medir tempo de execução
 * @param {Function} fn - Função a medir
 * @param {...*} args - Argumentos da função
 * @returns {{ result: *, time: number }} Resultado e tempo em ms
 */
function measureTime(fn, ...args) {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    return { result, time: end - start };
}

/**
 * Comparar dois algoritmos com múltiplas rodadas
 * Roda cada algoritmo alternadamente para evitar bias do JIT
 * @param {Function} fnA - Primeiro algoritmo
 * @param {Function} fnB - Segundo algoritmo
 * @param {number} rounds - Número de rodadas (default: 10)
 * @param {...*} args - Argumentos para ambos
 * @returns {{ resultA: *, resultB: *, timeA: number, timeB: number }}
 */
function compareAlgorithms(fnA, fnB, rounds, ...args) {
    if (typeof rounds !== 'number' || rounds < 1) rounds = 10;

    const timesA = [];
    const timesB = [];
    let resultA, resultB;

    // Warmup alternado (3 pares)
    for (let w = 0; w < 3; w++) {
        fnA(...args);
        fnB(...args);
    }

    // Medir alternadamente para公平
    for (let i = 0; i < rounds; i++) {
        const startA = performance.now();
        resultA = fnA(...args);
        const endA = performance.now();
        timesA.push(endA - startA);

        const startB = performance.now();
        resultB = fnB(...args);
        const endB = performance.now();
        timesB.push(endB - startB);
    }

    timesA.sort((a, b) => a - b);
    timesB.sort((a, b) => a - b);

    return {
        resultA,
        resultB,
        timeA: timesA[Math.floor(timesA.length / 2)],
        timeB: timesB[Math.floor(timesB.length / 2)]
    };
}

/**
 * Formatar tempo em ms com escala adaptativa
 * @param {number} ms - Tempo em milissegundos
 * @returns {string} Tempo formatado
 */
function formatTime(ms) {
    if (typeof ms !== 'number' || isNaN(ms)) return '0 ms';
    if (ms < 0.001) return (ms * 1000).toFixed(1) + ' µs';
    if (ms < 1) return ms.toFixed(3) + ' ms';
    if (ms < 10) return ms.toFixed(2) + ' ms';
    return ms.toFixed(1) + ' ms';
}

// Exportar funções
window.isValidDNA = isValidDNA;
window.measureTime = measureTime;
window.compareAlgorithms = compareAlgorithms;
window.formatTime = formatTime;
