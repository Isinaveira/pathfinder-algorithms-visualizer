// src/utils/pathUtils.ts
// src/utils/pathUtils.ts
import type { Node } from '../types'; // Importa la interfaz Node
 // Importa la interfaz Node

/**
 * Reconstruye el camino desde el nodo objetivo hasta el inicio,
 * utilizando la propiedad 'parent' de cada nodo.
 * @param targetNode El nodo objetivo desde el cual empezar a reconstruir.
 * @returns Un array de nodos que representan el camino del inicio al objetivo, o un array vacío si no hay camino válido.
 */
export function reconstructPath(targetNode: Node | null): Node[] {
    const path: Node[] = [];
    let currentNode = targetNode;

    // Remonta el camino desde el objetivo usando los padres
    while (currentNode !== null) {
        path.unshift(currentNode); // Añade el nodo al principio del array para obtener el orden correcto
        currentNode = currentNode.parent;
    }

    // El primer nodo en 'path' debería ser el inicio. Lo eliminamos si el inicio ya lo está
    // y solo si el camino es válido (tiene más de 1 nodo, es decir, inicio y fin o más).
    // O simplemente verificamos si el camino empieza con el nodo de inicio.
    if (path.length > 0 && path[0].isStart) {
        return path; // Retornamos el camino desde el inicio hasta el objetivo
    }
    return []; // Retorna un array vacío si no se pudo reconstruir un camino válido
}