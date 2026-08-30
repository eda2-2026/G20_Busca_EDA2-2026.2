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
    element.classList.remove('error', 'success');
    if (type) element.classList.add(type);
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

    const reader = new FileReader();
    setFeedback(elements.fileFeedback, 'Lendo arquivo...');
    elements.searchButton.disabled = true;

    reader.onload = function onLoad(event) {
        const genome = cleanDNA(event.target.result || '');

        if (!genome) {
            state.genome = '';
            state.fileName = '';
            elements.fileInfo.classList.add('is-hidden');
            setFeedback(elements.fileFeedback, 'O arquivo está vazio.', 'error');
            updateSearchState();
            return;
        }

        if (!/^[ATCG]+$/.test(genome)) {
            state.genome = '';
            state.fileName = '';
            elements.fileInfo.classList.add('is-hidden');
            setFeedback(
                elements.fileFeedback,
                'O genoma contém caracteres inválidos. Use apenas A, T, C e G.',
                'error'
            );
            updateSearchState();
            return;
        }

        state.genome = genome;
        state.fileName = file.name;
        showFileInfo(file, genome);
        setFeedback(elements.fileFeedback, 'Genoma carregado com sucesso.', 'success');
        setFeedback(elements.searchFeedback, '');
        updateSearchState();
    };

    reader.onerror = function onError() {
        state.genome = '';
        state.fileName = '';
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
    setFeedback(elements.searchFeedback, '');
    updateSearchState();
}

function handleSearch(event) {
    event.preventDefault();

    if (elements.searchButton.disabled) return;

    setFeedback(
        elements.searchFeedback,
        `Fluxo básico validado: "${state.pattern}" pode ser buscado em ${state.fileName}.`,
        'success'
    );
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
