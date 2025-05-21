// src/utils/algorithmInfo.ts

// Mapea cada tipo de algoritmo a su descripción informativa
export const ALGORITHM_INFO: Record<string, string> = {
    bfs: 'BFS encuentra el camino más corto en cuadrículas sin pesos (cada paso cuesta 1).',
    dfs: 'DFS encuentra *un* camino, pero no necesariamente el más corto o eficiente. Explora profundamente antes de retroceder.',
    dijkstra: 'Dijkstra encuentra el camino de menor costo en cuadrículas con pesos, explorando en un patrón de ondas.',
    aStar: 'A* encuentra el camino de menor costo de forma más eficiente que Dijkstra, usando una heurística para guiarse hacia la meta.',
};