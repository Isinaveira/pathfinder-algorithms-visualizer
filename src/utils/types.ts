// src/utils/types.ts

// Define los modos de dibujo disponibles para el usuario
export type DrawingMode = 'start' | 'target' | 'wall' | 'erase' | 'weight';

// Define la estructura de cada nodo en la cuadrícula
export interface Node {
    row: number; // Fila del nodo
    col: number; // Columna del nodo
    isStart: boolean; // ¿Es el nodo de inicio?
    isTarget: boolean; // ¿Es el nodo objetivo/meta?
    isWall: boolean; // ¿Es un muro que bloquea el paso?
    isVisited: boolean; // ¿Ha sido visitado por el algoritmo?
    isPath: boolean; // ¿Forma parte del camino final encontrado?
    distance: number; // gCost: Distancia real desde el nodo de inicio
    heuristicCost: number; // hCost: Costo estimado desde este nodo hasta el objetivo (¡NUEVO!)
    totalCost: number; // fCost: gCost + hCost (¡NUEVO!)
    parent: Node | null; // Referencia al nodo previo en el camino más corto
    weight: number; // El costo de pasar por este nodo
}
 