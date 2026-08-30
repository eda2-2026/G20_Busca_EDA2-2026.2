/**
 * KMP (Knuth-Morris-Pratt) Search Algorithm
 * Implementação em JavaScript puro
 */

/**
 * Compute Longest Proper Prefix Suffix array
 * @param {string} pattern - Padrão de busca
 * @returns {number[]} Array LPS
 */
function computeLPS(pattern) {
    if (typeof pattern !== 'string') {
        throw new TypeError('Pattern must be a string');
    }
    if (pattern.length === 0) {
        return [];
    }

    const m = pattern.length;
    const lps = new Array(m).fill(0);
    let len = 0;
    let i = 1;

    while (i < m) {
        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len !== 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }

    return lps;
}

/**
 * KMP Search Algorithm
 * @param {string} text - Texto de busca
 * @param {string} pattern - Padrão a encontrar
 * @returns {number[]} Array de posições (0-indexed)
 */
function kmpSearch(text, pattern) {
    if (typeof text !== 'string' || typeof pattern !== 'string') {
        throw new TypeError('Both text and pattern must be strings');
    }
    if (text.length === 0 || pattern.length === 0) {
        return [];
    }
    if (pattern.length > text.length) {
        return [];
    }

    const n = text.length;
    const m = pattern.length;
    const lps = computeLPS(pattern);
    const positions = [];
    let i = 0;
    let j = 0;

    while (i < n) {
        if (text[i] === pattern[j]) {
            i++;
            j++;
            if (j === m) {
                positions.push(i - j);
                j = lps[j - 1];
            }
        } else {
            if (j !== 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }

    return positions;
}

// Exportar funções
window.computeLPS = computeLPS;
window.kmpSearch = kmpSearch;
