# Relatório Acadêmico: Busca em Genoma com Algoritmos KMP e Força Bruta

**Disciplina:** Estrutura de Dados 2 (2026.2)  
**Trabalho:** Trabalho 1 — Conteúdo do Módulo: Busca  
**Equipe:** G20  
**Alunos:**
- Italo Alves Sampaio de Oliveira (232037937)
- José Eduardo Vieira do Prado (221008202)

---

## 1. Introdução

A bioinformática é um campo interdisciplinar que combina biologia, ciência da computação e estatística para analisar e interpretar dados biológicos. Um dos problemas fundamentais nesse domínio é a busca por padrões em sequências de DNA, molécula que armazena as instruções genéticas de todos os organismos vivos. O DNA é composto por uma sequência de quatro bases nitrogenadas — Adenina (A), Timina (T), Citosina (C) e Guanina (G) — e seu genoma pode atingir bilhões de pares de bases em organismos complexos como o ser humano.

O problema de busca em genoma consiste em, dado um texto $T$ (a sequência de DNA, de comprimento $n$) e um padrão $P$ (a subsequência a ser localizada, de comprimento $m$), encontrar todas as posições em $T$ onde $P$ ocorre. Esse problema tem aplicações práticas em identificação de genes, análise de mutações, diagnóstico de doenças genéticas e epidemiologia molecular.

O objetivo deste trabalho é implementar e comparar dois algoritmos de busca em sequências de DNA: o algoritmo Knuth-Morris-Pratt (KMP) e o algoritmo de Força Bruta. A escolha desses algoritmos justifica-se por representarem abordagens contrastantes — KMP utiliza informação pré-computada sobre o padrão para evitar comparações redundantes, enquanto Força Bruta adota uma estratégia de exaustão simples. A comparação visa demonstrar, de forma teórica e experimental, as vantagens do algoritmo KMP em termos de eficiência computacional.

---

## 2. Fundamentação Teórica

### 2.1 Algoritmo KMP (Knuth-Morris-Pratt)

O algoritmo KMP foi proposto por Donald Knuth, James Morris e Vaughan Pratt em 1977. Trata-se de um algoritmo de busca em string que resolve o problema de padrão em texto em tempo linear, $O(n + m)$, onde $n$ é o comprimento do texto e $m$ é o comprimento do padrão.

O insight central do KMP é a construção de um array chamado **LPS** (*Longest Proper Prefix Suffix*), que armazena, para cada posição $j$ do padrão, o comprimento do maior prefixo próprio de $P[0..j]$ que também é sufixo desse substring. O array LPS permite que, ao ocorrer um *mismatch* (incompatibilidade entre caracteres), o ponteiro do padrão salte diretamente para a posição indicada por $LPS[j-1]$, em vez de recomeçar da posição zero.

**Construção do array LPS:**

O array LPS é construído em tempo $O(m)$ utilizando dois ponteiros: `len` (comprimento do prefixo-sufixo atual) e `i` (posição corrente no padrão). O algoritmo percorre o padrão da esquerda para a direita:

1. Se $P[i] = P[len]$, incrementa `len` e atribui $LPS[i] = len$.
2. Se $P[i] \neq P[len]$ e `len > 0`, redefine `len = LPS[len - 1]`.
3. Se $P[i] \neq P[len]$ e `len = 0`, atribui $LPS[i] = 0$ e avança `i`.

**Processo de busca:**

Após construir o array LPS, a busca ocorre com dois ponteiros ($i$ para o texto e $j$ para o padrão):

1. Se $T[i] = P[j]$, ambos os ponteiros avançam.
2. Se $j = m$, uma ocorrência é registrada na posição $i - j$, e $j$ é redefinido para $LPS[j-1]$.
3. Se $T[i] \neq P[j]$ e $j > 0$, $j$ é redefinido para $LPS[j-1]$.
4. Se $T[i] \neq P[j]$ e $j = 0$, $i$ avança para a próxima posição.

**Complexidade:**

| Aspecto | Complexidade |
|---------|-------------|
| Construção do LPS | $O(m)$ |
| Busca no texto | $O(n)$ |
| Complexidade temporal total | $O(n + m)$ |
| Complexidade espacial | $O(m)$ (array LPS) |

### 2.2 Algoritmo de Força Bruta

O algoritmo de Força Bruta é a abordagem mais intuitiva para o problema de busca em string. Para cada posição $i$ no texto (de $0$ até $n - m$), compara-se o caractere $T[i + j]$ com $P[j]$ para $j = 0, 1, \ldots, m-1$. Se todos os $m$ caracteres coincidirem, a posição $i$ é registrada como uma ocorrência. Em caso de *mismatch*, o algoritmo interrompe a comparação e avança para a próxima posição do texto.

**Complexidade:**

| Aspecto | Complexidade |
|---------|-------------|
| Complexidade temporal (pior caso) | $O(n \times m)$ |
| Complexidade temporal (caso médio) | $O(n)$ |
| Complexidade espacial | $O(1)$ |

O caso pior ocorre quando o padrão apresenta muitas repetições internas, como buscar `AAAA` em `AAAAAAAA`. Nessa situação, cada posição do texto exige $m$ comparações. Porém, para sequências de DNA — que possuem alta variabilidade de caracteres — o caso médio tende a se aproximar de $O(n)$, pois *mismatches* ocorrem rapidamente nas primeiras comparações.

### 2.3 Comparação Teórica

| Critério | KMP | Força Bruta |
|----------|-----|-------------|
| Complexidade temporal | $O(n + m)$ | $O(n \times m)$ |
| Complexidade espacial | $O(m)$ | $O(1)$ |
| Pré-processamento | Sim (array LPS) | Não |
| Caso pior garantido | Linear | Quadrático |
| Implementação | Moderada | Simples |
| Desempenho em textos grandes | Superior | Inferior |
| Adequação para DNA | Excelente | Boa (caso médio) |

O algoritmo KMP é vantajoso quando o padrão possui prefixos que também são sufixos, pois o array LPS permite "pular" comparações redundantes. Para sequências de DNA, que possuem alfabeto reduzido ({A, T, C, G}), o KMP tende a apresentar ganho significativo sobre a Força Bruta, especialmente em textos grandes, pois a probabilidade de *mismatches* parciais é alta.

---

## 3. Implementação

### 3.1 Stack Tecnológica

O projeto foi implementado utilizando exclusivamente tecnologias web nativas, sem dependências externas de frameworks ou bibliotecas:

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Estrutura | HTML5 | Semântica e acessibilidade |
| Estilo | CSS3 + Custom Properties | Design system configurável |
| Lógica | JavaScript (ES6+) puro | Controle total, sem overhead de bibliotecas |
| Medição | `performance.now()` | Alta precisão para medição de tempo |
| Leitura de arquivos | `FileReader` API | Acesso local a arquivos do usuário |

### 3.2 Arquitetura do Sistema

A aplicação segue uma arquitetura cliente-side (*single-page application*) com responsabilidades bem definidas entre os módulos:

```
genome-search/
├── index.html              # Ponto de entrada da aplicação
├── css/
│   └── style.css           # Design system com CSS Custom Properties
├── js/
│   ├── app.js              # Lógica principal e manipulação do DOM
│   ├── kmp.js              # Algoritmo KMP (computeLPS + kmpSearch)
│   ├── forca_bruta.js      # Algoritmo de Força Bruta
│   └── utils.js            # Funções utilitárias (validação, medição)
├── scripts/
│   ├── generate_dna.js     # Gerador de sequências DNA aleatórias
│   ├── generate_medium.js  # Gerador de sequências de tamanho médio
│   └── generate_ecoli.js   # Gerador baseado no genoma de E. coli
└── tests/
    ├── test_node.js        # Suite de testes automatizados (Node.js)
    └── test_manual.html    # Testes manuais no navegador
```

**Fluxo de dados:**

1. O usuário carrega um arquivo `.txt` contendo a sequência de DNA via `FileReader` API.
2. O conteúdo é normalizado (maiúsculas, remoção de espaços e caracteres inválidos).
3. O padrão de busca é inserido e validado em tempo real.
4. Ao submeter a busca, ambos os algoritmos são executados sequencialmente.
5. Os resultados são exibidos com destaque visual das ocorrências no genoma.
6. Métricas de performance são calculadas e comparadas lado a lado.

### 3.3 Estrutura do Projeto

O módulo KMP (`kmp.js`) expõe duas funções: `computeLPS(pattern)`, que retorna o array de longest proper prefix suffix, e `kmpSearch(text, pattern)`, que retorna um array com as posições de ocorrência do padrão no texto. Ambas validam os tipos de entrada e tratam casos extremos (textos ou padrões vazios, padrão maior que o texto).

O módulo de Força Bruta (`forca_bruta.js`) implementa `bruteForceSearch(text, pattern)` com validação rigorosa de entrada: verifica tipos, vazio, caracteres válidos de DNA (A, T, C, G via regex `/^[ATCG]*$/i`) e extensão relativa entre texto e padrão. A comparação é interrompida no primeiro *mismatch* como otimização.

O módulo de utilidades (`utils.js`) fornece `isValidDNA(sequence)` para validação de sequências, `measureTime(fn, ...args)` para cronometragem com `performance.now()`, e `formatTime(ms)` para formatação legível dos tempos.

A interface (`app.js`) gerencia o estado da aplicação com um objeto `state` centralizado, manipula o DOM para renderização de resultados e painéis de performance, e implementa validação em tempo real do padrão de busca. O layout é responsivo (*mobile-first*) e inclui drag-and-drop para upload de arquivos.

---

## 4. Resultados Experimentais

### 4.1 Testes Unitários

A suite de testes automatizados foi executada no ambiente Node.js, utilizando o módulo `vm` para isolar o escopo global dos algoritmos. Os resultados são apresentados na Tabela 1.

**Tabela 1: Resultados dos testes unitários**

| Conjunto de Testes | Total | Aprovados | Taxa de Sucesso |
|-------------------|-------|-----------|-----------------|
| KMP | 11 | 11 | 100% |
| Força Bruta | 14 | 14 | 100% |
| Comparação (KMP vs FB) | 8 | 8 | 100% |
| Issue #17 (Tratamento de erros) | 14 | 14 | 100% |
| **Total** | **47** | **47** | **100%** |

Os testes abrangem casos que incluem: múltiplas ocorrências, padrão inexistente, padrão no início/fim do texto, padrão de 1 caractere, padrão igual ao texto inteiro, padrão maior que o texto, padrões sobrepostos, textos repetitivos, sequências DNA realistas, e validação robusta de entrada (extensão de arquivo, caracteres inválidos, mensagens de erro em português).

### 4.2 Testes de Performance

Os testes de performance foram conduzidos com sequências DNA geradas aleatoriamente em três tamanhos distintos. Para cada tamanho, 10 execuções foram realizadas e a mediana foi utilizada como medida representativa, minimizando a influência de variações do sistema. Os resultados são apresentados na Tabela 2.

**Tabela 2: Resultados de performance (mediana de 10 execuções)**

| Tamanho | Texto (n) | Padrão (m) | KMP (ms) | Força Bruta (ms) | Speedup |
|---------|-----------|------------|----------|------------------|---------|
| Pequeno | 1.000 | 4 | 0,048 | 0,055 | 1,15x |
| Médio | 10.000 | 6 | 0,082 | 0,143 | 1,74x |
| Grande | 100.000 | 8 | 0,718 | 1,216 | 1,70x |
| **Média** | — | — | — | — | **1,53x** |

### 4.3 Análise Comparativa

Os resultados experimentais confirmam a superioridade do algoritmo KMP sobre a Força Bruta em termos de velocidade de execução. O speedup médio de 1,53x demonstra que o KMP é consistentemente mais rápido, com a vantagem sendo mais evidente em textos maiores.

**Observações relevantes:**

1. **Escalabilidade:** À medida que o tamanho do texto cresce de 1.000 para 100.000 caracteres, o tempo do KMP cresce de 0,048ms para 0,718ms (fator ~15x), enquanto a Força Bruta cresce de 0,055ms para 1,216ms (fator ~22x). Isso valida a complexidade linear $O(n+m)$ do KMP versus a complexidade quadraticamente dependente $O(n \times m)$ da Força Bruta.

2. **Eficiência em pequenas entradas:** Para sequências pequenas (1.000 caracteres), o ganho do KMP é modesto (1,15x), pois o overhead de construção do array LPS $(O(m))$ é significativo em relação ao tempo total de busca. Nesse cenário, a simplicidade da Força Bruta pode ser preferível.

3. **Ganho em textos grandes:** A partir de 10.000 caracteres, o speedup se estabiliza em torno de 1,7x, demonstrando que o pré-processamento do KMP é amplamente compensado pela eliminação de comparações redundantes.

4. **Correção dos resultados:** Todos os 8 cenários de comparação direta entre KMP e Força Bruta retornaram resultados idênticos, validando a correção de ambas as implementações.

5. **Precisão da medição:** A utilização da mediana de 10 execuções, combinada com `performance.now()` (resolução sub-milissegundo), garante confiabilidade nas medições de performance.

**Tabela 3: Resumo da comparação qualitativa**

| Aspecto | KMP | Força Bruta |
|---------|-----|-------------|
| Velocidade | Mais rápido (1,53x médio) | Mais lento |
| Uso de memória | O(m) adicional | O(1) |
| Complexidade de implementação | Moderada | Simples |
| Caso pior garantido | Linear | Quadrático |
| Adequação para genomas grandes | Recomendado | Aceitável para genomas pequenos |

---

## 5. Conclusão

### 5.1 Resultados Obtidos

Este trabalho实现ou a implementação e comparação dos algoritmos KMP e Força Bruta para busca em sequências de DNA, demonstrando que:

- O algoritmo KMP apresenta complexidade temporal linear $O(n + m)$, enquanto a Força Bruta possui complexidade $O(n \times m)$ no pior caso.
- Experimentalmente, o KMP foi 1,53 vezes mais rápido que a Força Bruta em média, com ganho de até 1,74x em textos de tamanho médio.
- Ambas as implementações são corretas, produzindo resultados idênticos em todos os 8 cenários de teste.
- A suite completa de 47 testes automatizados foi aprovada a 100%, incluindo validação de entrada e tratamento de erros.

A aplicação web desenvolvida permite que usuários carreguem arquivos de genoma, insiram padrões de busca e visualizem os resultados com destaque nas ocorrências, além de comparar o desempenho dos dois algoritmos em tempo real.

### 5.2 Limitações

- **Tamanho do genoma:** A aplicação é executada inteiramente no navegador (*client-side*), o que limita o tamanho máximo processável pela memória disponível do dispositivo.
- **Alfabeto restrito:** A implementação é específica para o alfabeto de DNA ({A, T, C, G}), não sendo diretamente aplicável a outras sequências biológicas (proteínas, RNA).
- **Medições de performance:** As medições no navegador podem ser influenciadas por其他 processos do sistema operacional, garbage collection e variações do JavaScript engine.

### 5.3 Trabalhos Futuros

- Implementação de algoritmos adicionais: Boyer-Moore, Aho-Corasick e Suffix Trees.
- Extensão para busca em múltiplos padrões simultaneamente.
- Processamento *server-side* para genomas de grande escala (bilhões de bases).
- Integração com formatos biológicos padronizados (FASTA, FASTQ, SAM/BAM).
- Análise de similaridade aproximada (*fuzzy matching*) para lidar com mutações e erros de sequenciamento.

---

## Referências

1. KNUTH, D. E.; MORRIS, J. H.; PRATT, V. R. Fast pattern matching in strings. *SIAM Journal on Computing*, v. 6, n. 2, p. 323–350, 1977.

2. CORMEN, T. H.; LEISERSON, C. E.; RIVEST, R. L.; STEIN, C. *Introduction to Algorithms*. 4. ed. Cambridge: MIT Press, 2022.

3. NATIONAL CENTER FOR BIOTECHNOLOGY INFORMATION (NCBI). *GenBank Overview*. Disponível em: https://www.ncbi.nlm.nih.gov/genbank/. Acesso em: 30 ago. 2026.

4. SEDGEWICK, R.; WAYNE, K. *Algorithms*. 4. ed. Boston: Addison-Wesley, 2011.

5. NCBI. *Escherichia coli K-12 genome*. Disponível em: https://www.ncbi.nlm.nih.gov/genome/512. Acesso em: 30 ago. 2026.
