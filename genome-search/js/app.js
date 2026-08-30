/**
 * App Principal - Genome Search
 * Lógica da interface
 */

// Estado da aplicação
const state = {
    genome: '',
    pattern: '',
    fileName: '',
    results: null,
    performance: null
};

const elements = {};

function getElements() {
    elements.fileInput = document.getElementById('genome-file');
    elements.uploadZone = document.getElementById('upload-zone');
    elements.fileInfo = document.getElementById('file-info');
    elements.fileName = document.getElementById('file-name');
    elements.fileSize = document.getElementById('file-size');
    elements.fileFeedback = document.getElementById('file-feedback');
    elements.patternInput = document.getElementById('pattern-input');
    elements.patternFeedback = document.getElementById('pattern-feedback');
    elements.searchFeedback = document.getElementById('search-feedback');
    elements.searchButton = document.getElementById('search-button');
    elements.searchForm = document.getElementById('search-form');
    elements.searchPanel = document.getElementById('search-panel');
    elements.searchOverlay = document.getElementById('search-overlay');
    elements.resultsPanel = document.getElementById('results-panel');
    elements.performancePanel = document.getElementById('performance-panel');
    elements.genomeView = document.getElementById('genome-view');
    elements.renderFeedback = document.getElementById('render-feedback');
    elements.matchTotal = document.getElementById('match-total');
    elements.positionsList = document.getElementById('positions-list');
    elements.kmpBar = document.getElementById('kmp-bar');
    elements.bruteBar = document.getElementById('brute-bar');
    elements.kmpTime = document.getElementById('kmp-time');
    elements.bruteTime = document.getElementById('brute-time');
    elements.kmpCardTime = document.getElementById('kmp-card-time');
    elements.bruteCardTime = document.getElementById('brute-card-time');
    elements.speedupValue = document.getElementById('speedup-value');
    elements.speedupLabel = document.getElementById('speedup-label');
}

function cleanDNA(value) {
    return value.toUpperCase().replace(/\s/g, '');
}

function formatSize(size) {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function setFeedback(element, message, type = '') {
    element.textContent = message;
    element.classList.remove('error', 'success', 'warning');
    if (type) element.classList.add(type);
}

function setLoadingState(isLoading) {
    document.body.classList.toggle('is-loading', isLoading);
    if (elements.searchButton) {
        elements.searchButton.disabled = isLoading;
    }
}

function clearResults() {
    state.results = null;
    state.performance = null;

    if (!elements.resultsPanel || !elements.performancePanel) return;

    elements.resultsPanel.classList.add('is-hidden');
    elements.performancePanel.classList.add('is-hidden');
    elements.genomeView.textContent = '';
    elements.positionsList.textContent = '';
    elements.matchTotal.textContent = '0 matches';
    setFeedback(elements.renderFeedback, '');
}

function validatePattern() {
    const pattern = state.pattern;

    if (!pattern) {
        return { valid: false, message: 'Informe um padrão de DNA.' };
    }

    if (!/^[ATCG]+$/.test(pattern)) {
        return { valid: false, message: 'Use apenas os caracteres A, T, C e G.' };
    }

    if (state.genome && state.genome.length < pattern.length) {
        return {
            valid: false,
            message: 'O padrão não pode ser maior que o genoma carregado.'
        };
    }

    return { valid: true, message: 'Padrão válido.' };
}

function updateSearchState() {
    const patternStatus = validatePattern();
    const hasGenome = state.genome.length > 0;
    const canSearch = hasGenome && patternStatus.valid;

    elements.searchButton.disabled = !canSearch;

    if (!state.pattern) {
        setFeedback(elements.patternFeedback, '', '');
    } else {
        setFeedback(
            elements.patternFeedback,
            patternStatus.message,
            patternStatus.valid ? 'success' : 'error'
        );
    }

    if (!hasGenome && !elements.fileFeedback.textContent) {
        setFeedback(elements.fileFeedback, 'Carregue um arquivo de genoma para habilitar a busca.');
    }
}

function showFileInfo(file, genome) {
    elements.fileName.textContent = `Arquivo: ${file.name}`;
    elements.fileSize.textContent = `Tamanho: ${genome.length.toLocaleString('pt-BR')} bases (${formatSize(file.size)})`;
    elements.fileInfo.classList.remove('is-hidden');
}

function loadGenomeFile(file) {
    if (!file) return;

    // Validação de extensão do arquivo
    const fileName = file.name || '';
    const extension = fileName.split('.').pop().toLowerCase();
    if (extension !== 'txt') {
        setFeedback(
            elements.fileFeedback,
            'Formato inválido. Use apenas arquivos .txt.',
            'error'
        );
        return;
    }

    const reader = new FileReader();
    // Mostrar spinner durante leitura
    setFeedback(elements.fileFeedback, '', '');
    elements.fileFeedback.innerHTML = '<span class="spinner"></span> Lendo arquivo...';
    elements.searchButton.disabled = true;

    reader.onload = function onLoad(event) {
        const raw = event.target.result || '';
        const cleaned = raw.toUpperCase().replace(/\s/g, '');

        if (!cleaned) {
            state.genome = '';
            state.fileName = '';
            clearResults();
            elements.fileInfo.classList.add('is-hidden');
            setFeedback(elements.fileFeedback, 'O arquivo está vazio.', 'error');
            updateSearchState();
            return;
        }

        // Contar caracteres inválidos
        const invalidCount = (cleaned.match(/[^ATCG]/g) || []).length;
        // Remover caracteres inválidos, manter apenas A, T, C, G
        const genome = cleaned.replace(/[^ATCG]/g, '');

        state.genome = genome;
        state.fileName = file.name;
        clearResults();
        showFileInfo(file, genome);

        if (invalidCount > 0) {
            setFeedback(
                elements.fileFeedback,
                `${invalidCount} caracteres inválidos foram removidos. Apenas A, T, C, G são permitidos.`,
                'warning'
            );
        } else {
            setFeedback(elements.fileFeedback, 'Genoma carregado com sucesso.', 'success');
        }

        setFeedback(elements.searchFeedback, '');
        updateSearchState();
    };

    reader.onerror = function onError() {
        state.genome = '';
        state.fileName = '';
        clearResults();
        elements.fileInfo.classList.add('is-hidden');
        setFeedback(elements.fileFeedback, 'Não foi possível ler o arquivo.', 'error');
        updateSearchState();
    };

    reader.readAsText(file);
}

function handlePatternInput(event) {
    const rawValue = event.target.value;
    const normalized = cleanDNA(rawValue);

    state.pattern = normalized;
    event.target.value = normalized;
    clearResults();
    setFeedback(elements.searchFeedback, '');
    updateSearchState();
}

function getRenderWindow(positions) {
    const maxVisibleBases = 5000;

    if (state.genome.length <= maxVisibleBases) {
        return { start: 0, end: state.genome.length };
    }

    if (positions.length === 0) {
        return { start: 0, end: maxVisibleBases };
    }

    const firstMatch = positions[0];
    const start = Math.max(0, firstMatch - 120);
    const end = Math.min(state.genome.length, start + maxVisibleBases);
    return { start, end };
}

function buildHighlightedRanges(positions, start, end) {
    const highlighted = new Set();

    positions.forEach(function addRange(position) {
        const matchStart = position;
        const matchEnd = position + state.pattern.length;

        if (matchEnd <= start || matchStart >= end) return;

        for (let index = Math.max(matchStart, start); index < Math.min(matchEnd, end); index++) {
            highlighted.add(index);
        }
    });

    return highlighted;
}

function renderGenome(positions) {
    const windowRange = getRenderWindow(positions);
    const highlighted = buildHighlightedRanges(positions, windowRange.start, windowRange.end);
    const fragment = document.createDocumentFragment();

    elements.genomeView.textContent = '';

    for (let index = windowRange.start; index < windowRange.end; index++) {
        const base = state.genome[index];
        const span = document.createElement('span');
        span.className = `base base-${base.toLowerCase()}`;
        span.textContent = base;

        if (highlighted.has(index)) {
            span.classList.add('match');
            span.title = `Posicao ${index + 1}`;
        }

        fragment.appendChild(span);
    }

    elements.genomeView.appendChild(fragment);

    if (state.genome.length > windowRange.end || windowRange.start > 0) {
        setFeedback(
            elements.renderFeedback,
            `Mostrando bases ${windowRange.start + 1} a ${windowRange.end} de ${state.genome.length.toLocaleString('pt-BR')}.`
        );
    } else {
        setFeedback(elements.renderFeedback, '');
    }
}

function renderPositions(positions) {
    elements.positionsList.textContent = '';

    if (positions.length === 0) {
        const message = document.createElement('p');
        message.className = 'empty-result';
        message.textContent = 'Padrao nao encontrado no genoma carregado.';
        elements.positionsList.appendChild(message);
        return;
    }

    const maxVisiblePositions = 200;
    const fragment = document.createDocumentFragment();

    positions.slice(0, maxVisiblePositions).forEach(function addPosition(position) {
        const pill = document.createElement('span');
        pill.className = 'position-pill';
        pill.textContent = String(position + 1);
        fragment.appendChild(pill);
    });

    if (positions.length > maxVisiblePositions) {
        const extra = document.createElement('span');
        extra.className = 'empty-result';
        extra.textContent = `+ ${positions.length - maxVisiblePositions} posicoes`;
        fragment.appendChild(extra);
    }

    elements.positionsList.appendChild(fragment);
}

function renderResults(positions) {
    elements.resultsPanel.classList.remove('is-hidden');
    elements.matchTotal.textContent = `${positions.length.toLocaleString('pt-BR')} ${positions.length === 1 ? 'match' : 'matches'}`;

    renderGenome(positions);
    renderPositions(positions);
}

function renderPerformance(kmpTimeValue, bruteTimeValue) {
    const maxTime = Math.max(kmpTimeValue, bruteTimeValue, 0.001);
    const kmpWidth = Math.max(4, (kmpTimeValue / maxTime) * 100);
    const bruteWidth = Math.max(4, (bruteTimeValue / maxTime) * 100);
    const speedup = bruteTimeValue / Math.max(kmpTimeValue, 0.001);

    elements.performancePanel.classList.remove('is-hidden');
    elements.kmpBar.style.width = `${kmpWidth}%`;
    elements.bruteBar.style.width = `${bruteWidth}%`;

    elements.kmpTime.textContent = formatTime(kmpTimeValue);
    elements.bruteTime.textContent = formatTime(bruteTimeValue);
    elements.kmpCardTime.textContent = formatTime(kmpTimeValue);
    elements.bruteCardTime.textContent = formatTime(bruteTimeValue);

    if (speedup >= 1) {
        elements.speedupValue.textContent = `${speedup.toFixed(1)}x faster`;
        elements.speedupLabel.textContent = 'KMP foi mais rapido que Forca Bruta para este padrao.';
    } else {
        elements.speedupValue.textContent = `${(1 / speedup).toFixed(1)}x slower`;
        elements.speedupLabel.textContent = 'KMP nao superou Forca Bruta nesta execucao.';
    }
}

async function handleSearch(event) {
    event.preventDefault();

    if (elements.searchButton.disabled) return;

    // Ativar estado de loading
    setLoadingState(true);
    if (elements.searchOverlay) {
        elements.searchOverlay.style.display = 'grid';
    }

    // Usar setTimeout para permitir que o DOM atualize antes de executar a busca
    await new Promise(function (resolve) {
        setTimeout(function () {
            try {
                const kmpMeasurement = measureTime(kmpSearch, 5, state.genome, state.pattern);
                const bruteMeasurement = measureTime(bruteForceSearch, 5, state.genome, state.pattern);

                state.results = kmpMeasurement.result;
                state.performance = {
                    kmp: kmpMeasurement.time,
                    bruteForce: bruteMeasurement.time
                };

                renderResults(state.results);
                renderPerformance(state.performance.kmp, state.performance.bruteForce);

                setFeedback(
                    elements.searchFeedback,
                    state.results.length > 0
                        ? `Busca concluída: ${state.results.length.toLocaleString('pt-BR')} ocorrência(s) encontrada(s).`
                        : 'Busca concluída: padrão não encontrado.',
                    'success'
                );
            } catch (err) {
                setFeedback(
                    elements.searchFeedback,
                    'Erro durante a busca: ' + err.message,
                    'error'
                );
            }

            // Desativar estado de loading
            setLoadingState(false);
            if (elements.searchOverlay) {
                elements.searchOverlay.style.display = 'none';
            }

            resolve();
        }, 50);
    });
}

function bindEvents() {
    elements.fileInput.addEventListener('change', function onChange(event) {
        loadGenomeFile(event.target.files[0]);
    });

    elements.patternInput.addEventListener('input', handlePatternInput);
    elements.searchForm.addEventListener('submit', handleSearch);

    elements.uploadZone.addEventListener('dragover', function onDragOver(event) {
        event.preventDefault();
        elements.uploadZone.classList.add('is-dragging');
    });

    elements.uploadZone.addEventListener('dragleave', function onDragLeave() {
        elements.uploadZone.classList.remove('is-dragging');
    });

    elements.uploadZone.addEventListener('drop', function onDrop(event) {
        event.preventDefault();
        elements.uploadZone.classList.remove('is-dragging');
        const file = event.dataTransfer.files[0];
        loadGenomeFile(file);
    });
}

document.addEventListener('DOMContentLoaded', function initApp() {
    getElements();
    bindEvents();
    updateSearchState();
});
