# G20_Busca_EDA2-2026.2

**Número do trabalho:** 1 <br>
**Conteúdo do Módulo:** Busca <br>
**Disciplina:** Estrutura de Dados 2 (2026.2)

## Alunos

| Matrícula |          Nome Completo           |
| :-------: | :------------------------------: |
| 232037937 | Italo Alves Sampaio de Oliveira  |
| 221008202 | José Eduardo Vieira do Prado     |

## Sobre o trabalho

**Genome Search** é uma ferramenta web interta para busca de padrões em sequências de DNA utilizando os algoritmos **KMP (Knuth-Morris-Pratt)** e **Força Bruta**. O projeto permite ao usuário carregar arquivos de genoma, inserir um padrão de busca e comparar o desempenho de ambos os algoritmos em tempo real.

### Objetivo

- Implementar e comparar os algoritmos KMP e Força Bruta para busca de padrões em sequências de DNA
- Visualizar as ocorrências encontradas diretamente na sequência genômica
- Exibir métricas de performance (tempo de execução e speedup) para ambos os algoritmos
- Oferecer uma interface amigável para upload de arquivos `.txt` contendo sequências de DNA

## Como usar

### Pré-requisitos

- Um navegador web moderno (Chrome, Firefox, Edge, Safari)
- Arquivo `.txt` contendo uma sequência de DNA (caracteres: A, T, C, G)

### Passo a passo

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/G20_Busca_EDA2-2026.2.git
   cd G20_Busca_EDA2-2026.2
   ```

2. Abra o arquivo `genome-search/index.html` no navegador:
   ```bash
   # Windows
   start genome-search/index.html

   # macOS
   open genome-search/index.html

   # Linux
   xdg-open genome-search/index.html
   ```

3. Na interface:
   - **Upload:** Arraste e solte um arquivo `.txt` ou clique para selecionar
   - **Busca:** Digite o padrão de DNA (ex: `ATCG`) e clique em "Search"
   - **Resultados:** Visualize as ocorrências destacadas e a comparação de performance

### Dados de exemplo

O projeto inclui arquivos de genoma prontos para teste na pasta `genome-search/dados/`:

| Arquivo             | Tamanho | Descrição                 |
| ------------------- | ------: | ------------------------- |
| `genoma_small.txt`  |   Pequeno | Genoma pequeno para testes rápidos |
| `genoma_medium.txt` |  100 KB  | Genoma médio              |
| `genoma_ecoli.txt`  |    5 MB  | Genoma completo da *E. coli* |

## Screenshots (demonstração)

### Tela principal

![Interface principal](genome-search/screenshots/upload.png)

### Resultado da busca

![Resultado da busca](genome-search/screenshots/search.png)

### Comparação de performance

![Performance KMP vs Força Bruta](genome-search/screenshots/performance.png)

## Algoritmos implementados

### KMP (Knuth-Morris-Pratt)

O algoritmo KMP utiliza o array **LPS (Longest Proper Prefix Suffix)** para evitar comparações redundantes. Quando ocorre um mismatch, o algoritmo aproveita as informações já computadas para pular posições no texto, sem retroceder.

**Complexidade:**
- Tempo: `O(n + m)` — onde `n` é o tamanho do texto e `m` o tamanho do padrão
- Espaço: `O(m)` — para o array LPS

```
Exemplo de execução:
Texto:    A T C G A T C G A T C
Padrão:   A T C G
LPS:      [0, 0, 0, 0]

Passo 1: A T C G ← match completo na posição 0
Passo 2: Continua scan sem retroceder...
```

### Força Bruta

O algoritmo de força bruta realiza uma busca exaustiva, comparando o padrão em cada posição possível do texto. No primeiro mismatch, avança para a próxima posição.

**Complexidade:**
- Tempo: `O(n * m)` — pior caso, quando há muitos mismatchs parciais
- Espaço: `O(1)` — apenas ponteiros para iteração

```
Exemplo de execução:
Texto:    A T C G A T C G A T C
Padrão:   A T C G

Posição 0: A=T ✓, T=T ✓, C=C ✓, G=G ✓ → match
Posição 1: A≠T ✗ → avança
...
```

## Estrutura do projeto

```
genome-search/
├── index.html              # Interface principal
├── css/
│   └── style.css           # Design system e estilos
├── js/
│   ├── app.js              # Lógica principal e estado da aplicação
│   ├── kmp.js              # Algoritmo KMP (computeLPS + kmpSearch)
│   ├── forca_bruta.js      # Algoritmo Força Bruta
│   └── utils.js            # Funções utilitárias (validação, medição de tempo)
├── dados/
│   ├── genoma_small.txt    # Genoma pequeno
│   ├── genoma_medium.txt   # Genoma médio (100K bases)
│   ├── genoma_medium_positions.json  # Posições esperadas (medium)
│   ├── genoma_ecoli.txt    # Genoma E. coli (5MB)
│   └── genoma_ecoli_positions.json   # Posições esperadas (E. coli)
├── tests/
│   ├── test_node.js        # Testes automatizados (Node.js)
│   └── test_manual.html    # Testes manuais (navegador)
└── scripts/
    ├── generate_dna.js     # Gerador de DNA aleatório
    ├── generate_medium.js  # Gerador de genoma médio (100K)
    └── generate_ecoli.js   # Gerador de genoma E. coli (5MB)
```

## Tecnologias utilizadas

| Tecnologia | Uso |
| :--------: | :-- |
| HTML5      | Estrutura semântica da interface |
| CSS3       | Design system com Custom Properties |
| JavaScript | Algoritmos de busca e lógica da aplicação (puro, sem frameworks) |

## Executando os testes

### Testes automatizados (Node.js)

```bash
cd genome-search
node tests/test_node.js
```

### Testes manuais (navegador)

Abra `genome-search/tests/test_manual.html` no navegador para executar testes interativos.

### Geradores de dados

```bash
cd genome-search/scripts

# Gerar DNA aleatório (1KB)
node generate_dna.js

# Gerar genoma médio (100KB)
node generate_medium.js

# Gerar genoma E. coli (5MB)
node generate_ecoli.js
```

## Vídeo (demonstração)

[Apresentação G20 - Busca 2026.2](https://youtu.be/linkaqui)

## Créditos e referências

- **Disciplina:** Estrutura de Dados 2 — 2026.2
- **Algoritmo KMP:** Knuth, D. E., Morris, J. H., & Pratt, V. R. (1977). *Fast pattern matching in strings*. SIAM Journal on Computing, 6(2), 323-350.
- **Implementação:** Desenvolvida integralmente pela equipe G20
- **Dados genômicos:** Genoma da *E. coli* disponível em [NCBI](https://www.ncbi.nlm.nih.gov/)
