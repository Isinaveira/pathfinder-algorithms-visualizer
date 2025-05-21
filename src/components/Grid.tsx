import React, { useState, useEffect, useCallback } from 'react';
import Node from './Node';
import type { Node as NodeType, DrawingMode } from '../utils/types';
import { createGrid, clearPathfindingState, ROWS, COLS } from '../utils/gridHelpers';
import { bfs } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';
import { dijkstra } from '../algorithms/dijkstra';
import { aStar } from '../algorithms/aStar';
import type {  AlgorithmType } from '../App';

import './../App.css'; // Asegúrate de que los estilos estén importados

// Propiedades que el componente Grid espera recibir
interface GridProps {
    drawingMode: DrawingMode;
    selectedAlgorithm: AlgorithmType;
}

const Grid: React.FC<GridProps> = ({ drawingMode, selectedAlgorithm }) => {
    // Estado principal de la cuadrícula
    const [grid, setGrid] = useState<NodeType[][]>([]);
    // Nodos de inicio y meta seleccionados por el usuario
    const [startNode, setStartNode] = useState<NodeType | null>(null);
    const [targetNode, setTargetNode] = useState<NodeType | null>(null);
    // Controla si el usuario está arrastrando el ratón para dibujar
    const [isDrawing, setIsDrawing] = useState(false);
    // Controla si un algoritmo está actualmente en visualización para deshabilitar interacciones
    const [isVisualizing, setIsVisualizing] = useState(false);

    const [pathLength, setPathLength] = useState<number>(0);
    const [totalCost, setTotalCost] = useState<number>(0);



    // Efecto para inicializar la cuadrícula una vez al montar el componente
    useEffect(() => {
        const initialGrid = createGrid();
        setGrid(initialGrid);
    }, []); // El array de dependencias vacío asegura que solo se ejecute una vez al inicio

    // Función para animar un nodo en la UI, pasada a los algoritmos
    const animateNode = useCallback(async (node: NodeType, type: 'visited' | 'path'): Promise<void> => {
        return new Promise(resolve => {
            setGrid(prevGrid => {
                // Crea una nueva copia del grid para asegurar la inmutabilidad
                const newGrid = prevGrid.map((rowArr, rowIndex) =>
                    rowArr.map((n, colIndex) => {
                        // Si es el nodo que debe ser actualizado, crea una copia y modifica sus propiedades
                        if (rowIndex === node.row && colIndex === node.col) {
                            const updatedNode = { ...n };
                            if (type === 'visited') {
                                updatedNode.isVisited = true;
                            } else if (type === 'path') {
                                updatedNode.isPath = true;
                            }
                            return updatedNode;
                        }
                        return n; // Retorna el nodo sin cambios si no es el objetivo
                    })
                );
                return newGrid; // Actualiza el estado de la cuadrícula, provocando un re-render
            });
            // Pequeño retraso para que la animación sea visible
            setTimeout(resolve, type === 'visited' ? 30 : 80); // Ajusta estos valores para cambiar la velocidad de la animación
        });
    }, []); // Dependencias vacías, ya que `setGrid` es una función estable proporcionada por React

    // Maneja la acción de dibujar o seleccionar nodos en la cuadrícula
    const handleNodeAction = useCallback((row: number, col: number) => {
        // No permitir interacciones si un algoritmo se está visualizando
        if (isVisualizing) return;

        // Crea una copia profunda del grid para mutar y luego actualizar el estado
        const newGrid = grid.map(rowArr => rowArr.map(node => ({ ...node })));
        const node = newGrid[row][col]; // El nodo sobre el que se está actuando

        switch (drawingMode) {
            case 'start':
                // Si ya hay un nodo de inicio, lo limpia primero
                if (startNode) {
                    newGrid[startNode.row][startNode.col].isStart = false;
                    newGrid[startNode.row][startNode.col].weight = 1; // Asegura que vuelva a peso normal
                }
                node.isStart = true;
                node.isWall = false; // Un nodo de inicio no puede ser un muro
                node.weight = 1; // Un nodo de inicio no tiene peso extra
                setStartNode(node); // Establece el nuevo nodo de inicio
                break;
            case 'target':
                // Si ya hay un nodo de meta, lo limpia primero
                if (targetNode) {
                    newGrid[targetNode.row][targetNode.col].isTarget = false;
                    newGrid[targetNode.row][targetNode.col].weight = 1; // Asegura que vuelva a peso normal
                }
                node.isTarget = true;
                node.isWall = false; // Un nodo de meta no puede ser un muro
                node.weight = 1; // Un nodo de meta no tiene peso extra
                setTargetNode(node); // Establece el nuevo nodo de meta
                break;
            case 'wall':
                // Alterna el estado de muro para nodos que no sean inicio o meta
                if (!node.isStart && !node.isTarget) {
                    node.isWall = !node.isWall;
                    node.weight = 1; // Un muro siempre tiene peso normal (o infinito implícitamente)
                }
                break;
            case 'weight':
                // Alterna el peso del nodo entre 1 y un valor mayor (ej. 5), si no es inicio/meta/muro
                if (!node.isStart && !node.isTarget && !node.isWall) {
                    node.weight = node.weight === 1 ? 5 : 1;
                }
                break;
            case 'erase':
                // Restaura el nodo a su estado por defecto
                node.isWall = false;
                node.weight = 1; // Restaura el peso a 1
                if (node.isStart) setStartNode(null); // Si era el inicio, lo "desestablece"
                if (node.isTarget) setTargetNode(null); // Si era la meta, lo "desestablece"
                node.isStart = false;
                node.isTarget = false;
                break;
        }
        setGrid(newGrid); // Actualiza el estado del grid
    }, [grid, startNode, targetNode, drawingMode, isVisualizing]); // Dependencias para useCallback

    // Inicia el dibujo cuando se presiona el botón del ratón sobre un nodo
    const handleMouseDown = useCallback((row: number, col: number) => {
        setIsDrawing(true);
        handleNodeAction(row, col);
    }, [setIsDrawing, handleNodeAction]); // Dependencias para useCallback

    // Continúa el dibujo cuando el ratón se mueve y el botón está presionado
    const handleMouseEnter = useCallback((row: number, col: number) => {
        if (isDrawing) {
            handleNodeAction(row, col);
        }
    }, [isDrawing, handleNodeAction]); // Dependencias para useCallback

    // Detiene el dibujo cuando se suelta el botón del ratón
    const handleMouseUp = useCallback(() => {
        setIsDrawing(false);
    }, [setIsDrawing]); // Dependencias para useCallback

    // Limpia solo la visualización del camino y los nodos visitados (muros y nodos inicio/fin permanecen)
    const handleClearVisualization = useCallback(() => {
        if (isVisualizing) return; // No permitir limpiar mientras se visualiza
        setGrid(prevGrid => clearPathfindingState(prevGrid));
        setPathLength(0);
        setTotalCost(0);
    }, [isVisualizing]); // Dependencia para useCallback

    // Reinicia la cuadrícula por completo a su estado inicial
    const handleResetGrid = useCallback(() => {
        if (isVisualizing) return; // No permitir resetear mientras se visualiza
        setGrid(createGrid());
        setStartNode(null);
        setTargetNode(null);
        setPathLength(0);
        setTotalCost(0);
    }, [isVisualizing]); // Dependencia para useCallback

    // Función principal para ejecutar el algoritmo de pathfinding seleccionado
    const visualizeAlgorithm = async () => {
        // Validaciones previas a la ejecución
        if (!startNode || !targetNode || isVisualizing) {
            alert('Por favor, selecciona un punto de inicio y uno de meta.');
            return;
        }

        setIsVisualizing(true); // Deshabilita interacciones mientras se visualiza
        handleClearVisualization(); // Limpia cualquier visualización anterior

        try {
            const gridForAlgorithm = JSON.parse(JSON.stringify(grid));
            const startNodeForAlgorithm = gridForAlgorithm[startNode.row][startNode.col];
            const targetNodeForAlgorithm = gridForAlgorithm[targetNode.row][targetNode.col];

            let path: NodeType[] = [];

            if (selectedAlgorithm === 'bfs') {
                path = await bfs(gridForAlgorithm, startNodeForAlgorithm, targetNodeForAlgorithm, animateNode);
            } else if (selectedAlgorithm === 'dfs') {
                path = await dfs(gridForAlgorithm, startNodeForAlgorithm, targetNodeForAlgorithm, animateNode);
            } else if (selectedAlgorithm === 'dijkstra') {
                path = await dijkstra(gridForAlgorithm, startNodeForAlgorithm, targetNodeForAlgorithm, animateNode);
            } else if (selectedAlgorithm === 'aStar') {
                path = await aStar(gridForAlgorithm, startNodeForAlgorithm, targetNodeForAlgorithm, animateNode);
            }

            if (path.length > 0) {
                // CALCULAR Y ACTUALIZAR LOS ESTADOS DE PATHLENGTH Y TOTALCOST
                setPathLength(path.length); // La longitud del camino es simplemente el número de nodos en el camino
                let calculatedCost = 0;
                for (const node of path) {
                    calculatedCost += node.weight; // Sumar el peso de cada nodo en el camino
                }
                // Si el nodo de inicio y fin no deben contar en el costo, ajusta aquí.
                // A menudo, el costo es el de los pasos, no el de los nodos.
                // Si path.length es 1 (inicio=fin), el costo es 0.
                if (path.length > 0) {
                     // El costo total es la distancia del nodo final, si está configurado así en Dijkstra/A*
                     // O la suma de los pesos de los nodos en el camino (excluyendo el inicio si se cuenta el movimiento al nodo).
                     // Para A* y Dijkstra, path[path.length - 1].distance ya es el costo mínimo.
                     calculatedCost = path[path.length - 1].distance;

                     // Para BFS/DFS, la 'distance' también es el número de pasos.
                     // Si quieres que el "costo total" para BFS/DFS sea solo el número de casillas,
                     // entonces sería path.length - 1 (excluyendo el nodo de inicio) o path[path.length - 1].distance.
                     // Si quieres que BFS/DFS muestre el costo con pesos (como Dijkstra/A*),
                     // entonces tendrías que sumar los pesos de cada nodo en el path,
                     // pero no sería coherente con el algoritmo.
                     // Lo más preciso es usar la 'distance' del nodo final para Dijkstra/A*.
                     // Para BFS/DFS, el "costo" es el número de pasos.
                }

                setTotalCost(calculatedCost);

            } else {
                alert('No se encontró un camino!');
                setPathLength(0);
                setTotalCost(0);
            }
        } catch (error) {
            console.error("Error durante la visualización del algoritmo:", error);
            alert("Ocurrió un error al ejecutar el algoritmo. Revisa la consola.");
        } finally {
            setIsVisualizing(false); // Vuelve a habilitar las interacciones al finalizar
        }
    };

    return (
        <div className="pathfinding-container">
            <div className="controls">
                {/* Botón para ejecutar el algoritmo seleccionado */}
                <button onClick={visualizeAlgorithm} disabled={isVisualizing}>
                    Ejecutar algoritmo
                </button>
                {/* Botón para reiniciar la cuadrícula a su estado inicial */}
                <button onClick={handleResetGrid} disabled={isVisualizing}>
                    Reiniciar Cuadrícula
                </button>
                {/* Botón para limpiar solo los nodos visitados y el camino */}
                <button onClick={handleClearVisualization} disabled={isVisualizing}>
                    Limpiar Visualización
                </button>
            </div>
            {/* Contenedor de la cuadrícula con estilos CSS Grid */}
            <div
                id="grid-container"
                onMouseLeave={handleMouseUp} // Detiene el dibujo si el ratón sale del contenedor
                style={{
                    gridTemplateColumns: `repeat(${COLS}, 1fr)`, // Define las columnas del grid CSS
                    gridTemplateRows: `repeat(${ROWS}, 1fr)`     // Define las filas del grid CSS
                }}
            >
                {/* Mapea sobre el estado del grid para renderizar cada nodo */}
                {grid.map((row, rowIndex) => (
                    row.map((node, nodeIndex) => (
                        <Node
                            key={`${rowIndex}-${nodeIndex}`} // Clave única para cada nodo
                            node={node}
                            // Pasa las funciones de manejo de eventos del ratón al componente Node
                            onMouseDown={handleMouseDown}
                            onMouseEnter={handleMouseEnter}
                            onMouseUp={handleMouseUp}
                        />
                    ))
                ))}
            </div>
            <div className="path-info">
                <p>Longitud del Camino: <strong>{pathLength > 0 ? pathLength : 'N/A'}</strong> casillas</p>
                <p>Costo Total: <strong>{totalCost > 0 || (pathLength > 0 && totalCost === 0) ? totalCost : 'N/A'}</strong></p>
                {/* La condición (pathLength > 0 && totalCost === 0) es para cubrir el caso de un camino de 1 casilla (inicio=fin) que tiene costo 0 */}
            </div>
        </div>
    );
};

export default Grid;