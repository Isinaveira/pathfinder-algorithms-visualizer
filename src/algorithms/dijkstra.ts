// src/algorithms/dijkstra.ts
import type { Node } from '../utils/types';
import { ROWS, COLS } from '../utils/gridHelpers';
import { reconstructPath } from '../utils/path/pathUtils';

// Función auxiliar para obtener los vecinos de un nodo (misma que en BFS/DFS)
function getNeighbors(node: Node, grid: Node[][]): Node[] {
    const neighbors: Node[] = [];
    const { row, col } = node;

    // Direcciones: Arriba, Abajo, Izquierda, Derecha
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

/**
 * Implementación del algoritmo de Dijkstra.
 * @param grid La cuadrícula de nodos.
 * @param startNode El nodo de inicio.
 * @param targetNode El nodo objetivo.
 * @param animate Una función asíncrona para visualizar cada paso.
 * @returns Una Promise que resuelve en el camino encontrado o un array vacío.
 */
export async function dijkstra(grid: Node[][], startNode: Node, targetNode: Node, animate: (node: Node, type: 'visited' | 'path') => Promise<void>): Promise<Node[]> {
    // Clonar el grid para el algoritmo y inicializar distancias
    const localGrid: Node[][] = JSON.parse(JSON.stringify(grid));
    const nodes: Node[] = []; // Lista plana de todos los nodos para fácil acceso
    for (const row of localGrid) {
        for (const node of row) {
            node.distance = Infinity; // Inicializar distancia a infinito
            node.isVisited = false;
            node.parent = null;
            nodes.push(node);
        }
    }

    const startNodeInLocalGrid = localGrid[startNode.row][startNode.col];
    const targetNodeInLocalGrid = localGrid[targetNode.row][targetNode.col];

    startNodeInLocalGrid.distance = 0; // Distancia del nodo de inicio es 0

    // Utilizaremos un array que simularemos como cola de prioridad.
    // En cada iteración, lo ordenaremos para obtener el nodo con la menor distancia.
    const unvisitedNodes = nodes.filter(node => !node.isWall); // Excluir muros de la búsqueda

    while (unvisitedNodes.length > 0) {
        // Ordenar los nodos no visitados por su distancia actual (simula cola de prioridad)
        unvisitedNodes.sort((a, b) => a.distance - b.distance);

        const currentNode = unvisitedNodes.shift()!; // Extraer el nodo con la distancia más pequeña

        // Si el nodo actual es infinito, significa que los nodos restantes son inalcanzables
        if (currentNode.distance === Infinity) {
            return [];
        }

        // Marcar el nodo como visitado
        currentNode.isVisited = true;
        if (!currentNode.isStart && !currentNode.isTarget) {
            await animate(currentNode, 'visited');
        }

        // Si encontramos el nodo objetivo, reconstruimos el camino
        if (currentNode.row === targetNodeInLocalGrid.row && currentNode.col === targetNodeInLocalGrid.col) {
            const path = reconstructPath(currentNode);
            for (let i = 0; i < path.length; i++) {
                if (!path[i].isStart && !path[i].isTarget) {
                    await animate(path[i], 'path');
                }
            }
            return path;
        }

        // Explora los vecinos del nodo actual
        const neighbors = getNeighbors(currentNode, localGrid);
        for (const neighbor of neighbors) {
            if (!neighbor.isVisited && !neighbor.isWall) {
                // El costo de moverse a un vecino es 1 en esta cuadrícula sin pesos
                const newDistance = currentNode.distance + 1;

                if (newDistance < neighbor.distance) {
                    neighbor.distance = newDistance;
                    neighbor.parent = currentNode;
                }
            }
        }
        // No necesitamos reinsertar en la "cola de prioridad" ya que unvisitedNodes se reordena cada vez
        // y se eliminan los nodos visitados de la lista.
    }

    return []; // No se encontró el camino
}