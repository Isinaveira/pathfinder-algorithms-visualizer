
import type { Node } from '../utils/types';
import { ROWS, COLS } from '../utils/gridHelpers';
import { reconstructPath } from '../utils/path/pathUtils';

// Función auxiliar para obtener los vecinos de un nodo (misma que en BFS/DFS/Dijkstra)
function getNeighbors(node: Node, grid: Node[][]): Node[] {
    const neighbors: Node[] = [];
    const { row, col } = node;

    const directions = [
        [-1, 0], // Arriba
        [1, 0],  // Abajo
        [0, -1], // Izquierda
        [0, 1]   // Derecha
    ];

    for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;

        if (newRow >= 0 && newCol >= 0 && newRow < ROWS && newCol < COLS) {
            neighbors.push(grid[newRow][newCol]);
        }
    }
    return neighbors;
}

// Función heurística: Distancia de Manhattan (abs(x1-x2) + abs(y1-y2))
function heuristic(node: Node, targetNode: Node): number {
    return Math.abs(node.row - targetNode.row) + Math.abs(node.col - targetNode.col);
}

export async function aStar(grid: Node[][], startNode: Node, targetNode: Node, animate: (node: Node, type: 'visited' | 'path') => Promise<void>): Promise<Node[]> {
    const localGrid: Node[][] = JSON.parse(JSON.stringify(grid));
    const nodes: Node[] = [];
    for (const row of localGrid) {
        for (const node of row) {
            node.distance = Infinity;
            node.heuristicCost = Infinity; // ¡NUEVO! Inicializar
            node.totalCost = Infinity;     // ¡NUEVO! Inicializar
            node.isVisited = false;
            node.parent = null;
            nodes.push(node);
        }
    }

    const startNodeInLocalGrid = localGrid[startNode.row][startNode.col];
    const targetNodeInLocalGrid = localGrid[targetNode.row][targetNode.col];

    startNodeInLocalGrid.distance = 0;
    startNodeInLocalGrid.heuristicCost = heuristic(startNodeInLocalGrid, targetNodeInLocalGrid); // Calcular hCost para el inicio
    startNodeInLocalGrid.totalCost = startNodeInLocalGrid.distance + startNodeInLocalGrid.heuristicCost; // Calcular fCost para el inicio

    const openSet: Node[] = [startNodeInLocalGrid];

    while (openSet.length > 0) {
        // Ordenar por totalCost directamente
        openSet.sort((a, b) => a.totalCost - b.totalCost);

        const currentNode = openSet.shift()!;

        if (currentNode.distance === Infinity) {
            return [];
        }

        // Marcar como visitado después de haber sido extraído de la cola de prioridad
        // y antes de expandir sus vecinos.
        currentNode.isVisited = true;
        if (!currentNode.isStart && !currentNode.isTarget) {
            await animate(currentNode, 'visited');
        }

        if (currentNode.row === targetNodeInLocalGrid.row && currentNode.col === targetNodeInLocalGrid.col) {
            const path = reconstructPath(currentNode);
            for (let i = 0; i < path.length; i++) {
                if (!path[i].isStart && !path[i].isTarget) {
                    await animate(path[i], 'path');
                }
            }
            return path;
        }

        const neighbors = getNeighbors(currentNode, localGrid);
        for (const neighbor of neighbors) {
            if (neighbor.isWall || neighbor.isVisited) {
                continue;
            }

            const costToNeighbor = neighbor.weight;
            const tentativeGScore = currentNode.distance + costToNeighbor;

            // Si se encontró un camino más corto a este vecino
            if (tentativeGScore < neighbor.distance) {
                neighbor.parent = currentNode;
                neighbor.distance = tentativeGScore; // gCost
                neighbor.heuristicCost = heuristic(neighbor, targetNodeInLocalGrid); // hCost
                neighbor.totalCost = neighbor.distance + neighbor.heuristicCost; // fCost

                // Solo añadir al openSet si no estaba ya (o si su fCost mejoró, que ya lo tenemos cubierto con la condición anterior)
                const isInOpenSet = openSet.some(node => node.row === neighbor.row && node.col === neighbor.col);
                if (!isInOpenSet) {
                    openSet.push(neighbor);
                    if (!neighbor.isTarget) {
                        await animate(neighbor, 'visited');
                    }
                }
                // Si ya está en openSet, se reordenará en la próxima iteración debido a .sort().
            }
        }
    }
    return [];
}