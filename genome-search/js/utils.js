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
 * Formatar tempo em ms
 * @param {number} ms - Tempo em milissegundos
 * @returns {string} Tempo formatado (ex: '0.002 ms', '1.500 ms')
 */
function formatTime(ms) {
    if (typeof ms !== 'number' || isNaN(ms)) return '0.000 ms';
    return ms.toFixed(3) + ' ms';
}

// Exportar funções
window.isValidDNA = isValidDNA;
window.measureTime = measureTime;
window.formatTime = formatTime;
