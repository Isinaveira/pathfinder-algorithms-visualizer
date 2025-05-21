// src/algorithms/bfs.ts
import type { Node } from '../utils/types';
import { ROWS, COLS } from '../utils/gridHelpers';
import { reconstructPath } from '../utils/path/pathUtils';

// Función auxiliar para obtener los vecinos de un nodo
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

export async function bfs(grid: Node[][], startNode: Node, targetNode: Node, animate: (node: Node, type: 'visited' | 'path') => Promise<void>): Promise<Node[]> {
    const queue: Node[] = [startNode];

    // Clonar el grid para el algoritmo
    // Esto asegura que cada algoritmo trabaje sobre su propia copia del estado
    const localGrid: Node[][] = JSON.parse(JSON.stringify(grid));
    // Reinicializar las propiedades de distancia y parent para el algoritmo actual
    // (Esto ya debería hacerse en clearPathfindingState antes de llamar al algoritmo)
    for (const row of localGrid) {
        for (const node of row) {
            node.distance = Infinity; // BFS también puede usar distance para seguimiento de pasos si quisiera
            node.parent = null;
            node.isVisited = false; // Asegurarse de que esté limpio
        }
    }

    const startNodeInLocalGrid = localGrid[startNode.row][startNode.col];
    const targetNodeInLocalGrid = localGrid[targetNode.row][targetNode.col];

    startNodeInLocalGrid.distance = 0; // Distancia de BFS es número de pasos
    startNodeInLocalGrid.isVisited = true; // Marcar como visitado
    await animate(startNodeInLocalGrid, 'visited');

    while (queue.length > 0) {
        const currentNode = queue.shift()!;

        // Si ya llegamos al objetivo
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
            // BFS solo se preocupa por si un nodo ha sido visitado o es un muro
            // No usamos 'neighbor.weight' para calcular la distancia en BFS.
            if (!neighbor.isVisited && !neighbor.isWall) {
                neighbor.isVisited = true;
                neighbor.parent = currentNode;
                // En BFS, la "distancia" (número de pasos) es simplemente la distancia del padre + 1
                neighbor.distance = currentNode.distance + 1; // Aunque no es crucial para el funcionamiento de BFS, es buena práctica para mantener la coherencia de la propiedad.
                queue.push(neighbor);
                if (!neighbor.isTarget) {
                    await animate(neighbor, 'visited');
                }
            }
        }
    }
    return []; // No se encontró el camino
}