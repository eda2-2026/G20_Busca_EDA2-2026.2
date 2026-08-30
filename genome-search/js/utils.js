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
 * Medir tempo de execução com warmup e múltiplas execuções
 * @param {Function} fn - Função a medir
 * @param {number} iterations - Número de iterações (default: 5)
 * @param {...*} args - Argumentos da função
 * @returns {{ result: *, time: number }} Resultado e mediana dos tempos em ms
 */
function measureTime(fn, iterations, ...args) {
    if (typeof iterations !== 'number' || iterations < 1) {
        iterations = 5;
    }

    // Warmup: executar 3 vezes para aquecer o JIT
    for (let w = 0; w < 3; w++) {
        fn(...args);
    }

    // Medir múltiplas vezes e pegar a mediana
    const times = [];
    let result;

    for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        result = fn(...args);
        const end = performance.now();
        times.push(end - start);
    }

    times.sort((a, b) => a - b);
    const median = times[Math.floor(times.length / 2)];
    return { result, time: median };
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
window.formatTime = formatTime;
