/**
 * Brute Force Search Algorithm
 * Implementação em JavaScript puro
 *
 * Complexidade temporal: O(n * m)
 *   - n = comprimento do texto
 *   - m = comprimento do padrão
 *   - No pior caso, para cada posição do texto (n - m + 1),
 *     comparamos até m caracteres do padrão.
 *
 * Complexidade espacial: O(1) adicional (exceto o array de resultados)
 */

/**
 * Valida se uma string contém apenas caracteres de DNA válidos (A, T, C, G).
 * @param {string} str - String a validar
 * @returns {boolean} true se válida
 */
function isValidDNA(str) {
    return /^[ATCG]*$/i.test(str);
}

/**
 * Brute Force Search — busca exaustiva por todas as ocorrências do padrão no texto.
 *
 * Para cada posição i no texto (de 0 até n-m), compara o caractere do texto
 * com o caractere correspondente do padrão. Se todos os m caracteres coincidirem,
 * a posição i é registrada como uma ocorrência.
 *
 * @param {string} text - Texto de busca (sequência de DNA: A, T, C, G)
 * @param {string} pattern - Padrão a encontrar (sequência de DNA: A, T, C, G)
 * @returns {number[]} Array de posições onde o padrão foi encontrado (0-indexed)
 * @throws {Error} Se os parâmetros não forem strings ou estiverem vazios
 * @throws {Error} Se contiverem caracteres inválidos (diferentes de A, T, C, G)
 * @throws {Error} Se o padrão for maior que o texto
 */
function bruteForceSearch(text, pattern) {
    // --- Validação de entrada ---
    if (typeof text !== 'string' || typeof pattern !== 'string') {
        throw new Error('Os parâmetros text e pattern devem ser strings.');
    }

    if (text.length === 0) {
        throw new Error('O texto de busca não pode ser vazio.');
    }

    if (pattern.length === 0) {
        throw new Error('O padrão de busca não pode ser vazio.');
    }

    if (!isValidDNA(text)) {
        throw new Error(
            'O texto contém caracteres inválidos. Use apenas A, T, C ou G.'
        );
    }

    if (!isValidDNA(pattern)) {
        throw new Error(
            'O padrão contém caracteres inválidos. Use apenas A, T, C ou G.'
        );
    }

    if (pattern.length > text.length) {
        throw new Error('O padrão não pode ser maior que o texto.');
    }

    // --- Algoritmo de força bruta ---
    const results = [];
    const n = text.length;
    const m = pattern.length;

    // DNA já vem em maiúsculas do cleanDNA(), mas normalizar por segurança
    const textUpper = text.length < 100000 ? text.toUpperCase() : text;
    const patternUpper = pattern.toUpperCase();

    // Percorrer cada posição possível no texto
    for (let i = 0; i <= n - m; i++) {
        let found = true;

        // Comparar caractere a caractere
        for (let j = 0; j < m; j++) {
            if (textUpper[i + j] !== patternUpper[j]) {
                found = false;
                break; // Rompe no primeiro mismatch (otimização)
            }
        }

        if (found) {
            results.push(i);
        }
    }

    return results;
}

// Exportar função globalmente para uso no navegador
window.bruteForceSearch = bruteForceSearch;
