// src/algorithms/dfs.ts
import type { Node } from '../utils/types';
import { ROWS, COLS } from '../utils/gridHelpers';
import { reconstructPath } from '../utils/path/pathUtils';

// Función auxiliar para obtener los vecinos de un nodo
function getNeighbors(node: Node, grid: Node[][]): Node[] {
    const neighbors: Node[] = [];
    const { row, col } = node;

    // Direcciones: Arriba, Abajo, Izquierda, Derecha
    // Es importante que el orden aquí sea consistente para que DFS sea predecible.
    // Por ejemplo, preferir ir "arriba", luego "abajo", luego "izquierda", luego "derecha".
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
 * Implementación del algoritmo Depth-First Search (DFS).
 * @param grid La cuadrícula de nodos en la que buscar.
 * @param startNode El nodo de inicio de la búsqueda.
 * @param targetNode El nodo objetivo a encontrar.
 * @param animate Una función asíncrona para visualizar cada paso del algoritmo.
 * @returns Una Promise que resuelve en el camino encontrado (array de nodos) o un array vacío si no hay camino.
 */
export async function dfs(grid: Node[][], startNode: Node, targetNode: Node, animate: (node: Node, type: 'visited' | 'path') => Promise<void>): Promise<Node[]> {
    // Clonar el grid y reinicializar propiedades relevantes para el algoritmo actual
    // (Esto ya debería hacerse en clearPathfindingState antes de llamar al algoritmo,
    // pero lo hacemos aquí para mayor seguridad en el contexto del algoritmo individual)
    const localGrid: Node[][] = JSON.parse(JSON.stringify(grid));
    for (const row of localGrid) {
        for (const node of row) {
            node.distance = Infinity; // Se usa para la distancia (número de pasos)
            node.parent = null;
            node.isVisited = false; // Asegurarse de que esté limpio
            node.heuristicCost = Infinity; // También inicializar estos por consistencia si existen en Node
            node.totalCost = Infinity;     // También inicializar estos por consistencia si existen en Node
        }
    }

    const startNodeInLocalGrid = localGrid[startNode.row][startNode.col];
    const targetNodeInLocalGrid = localGrid[targetNode.row][targetNode.col];

    // La pila para DFS: almacena los nodos a visitar
    const stack: Node[] = [startNodeInLocalGrid];

    // Marcar el nodo de inicio como visitado y asignarle una distancia
    startNodeInLocalGrid.isVisited = true;
    startNodeInLocalGrid.distance = 0; // Distancia para DFS es el número de pasos desde el inicio

    // Animar el nodo de inicio
    await animate(startNodeInLocalGrid, 'visited');

    // Bucle principal de DFS
    while (stack.length > 0) {
        // DFS extrae el ÚLTIMO nodo de la pila (LIFO)
        const currentNode = stack.pop()!;

        // Si encontramos el nodo objetivo, reconstruimos y animamos el camino
        if (currentNode.row === targetNodeInLocalGrid.row && currentNode.col === targetNodeInLocalGrid.col) {
            const path = reconstructPath(currentNode);
            for (let i = 0; i < path.length; i++) {
                if (!path[i].isStart && !path[i].isTarget) {
                    await animate(path[i], 'path');
                }
            }
            return path; // Retorna el camino encontrado
        }

        // Explora los vecinos del nodo actual
        const neighbors = getNeighbors(currentNode, localGrid);

        // Para DFS, la clave es el ORDEN en que se añaden los vecinos a la pila.
        // Si quieres que el algoritmo "se sumerja" primero en una dirección (ej. arriba),
        // debes añadir los vecinos a la pila en el ORDEN INVERSO de cómo quieres que se exploren.
        // Por ejemplo, si quieres explorar Arriba -> Abajo -> Izquierda -> Derecha,
        // los añades a la pila como Derecha, Izquierda, Abajo, Arriba.
        // Esto es porque pop() saca el último elemento.

        // Por simplicidad y para un comportamiento más "visiblemente profundo",
        // iteraremos sobre los vecinos en orden inverso al que getNeighbors los devuelve.
        // Esto asegura que, por ejemplo, si getNeighbors da [arriba, abajo, izq, der],
        // el último en añadirse (der) será el primero en sacarse, luego izq, etc.
        // Para que Arriba sea el primero en explorarse, necesitaríamos añadirlo al final.
        // Vamos a probar con el orden inverso de las direcciones:
        // Si directions es [[-1,0], [1,0], [0,-1], [0,1]] (Arriba, Abajo, Izquierda, Derecha)
        // Y queremos que explore Arriba primero, luego Abajo, etc.
        // Los añadimos a la pila como: Derecha, Izquierda, Abajo, Arriba (último añadido es el primero en salir).
        for (let i = neighbors.length - 1; i >= 0; i--) { // Iterar en orden inverso
            const neighbor = neighbors[i];

            if (!neighbor.isVisited && !neighbor.isWall) {
                neighbor.isVisited = true; // Marcar como visitado ANTES de añadir a la pila
                neighbor.parent = currentNode; // Establecer el padre para reconstruir el camino
                neighbor.distance = currentNode.distance + 1; // Actualizar la distancia
                stack.push(neighbor); // Añadir a la pila para visitar más tarde
                if (!neighbor.isTarget) {
                    await animate(neighbor, 'visited');
                }
            }
        }
    }

    return []; // Si la pila se vacía y no se encuentra el objetivo, no hay camino
}