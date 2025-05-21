import React from "react";
import type { Node as NodeType } from '../utils/types';

interface NodeProps {
    node: NodeType;
    onMouseDown: (row: number, col: number) => void;
    onMouseEnter: (row: number, col: number) => void;
    onMouseUp: () => void;
}

const Node: React.FC<NodeProps> = ({node, onMouseDown, onMouseEnter, onMouseUp }) => {
    const { row, col, isStart, isTarget, isWall, isVisited, isPath, weight } = node;

    //Determina las clases CSS basadas en el estado del nodo
    //El orden de las condiciones es importante para la prioridad visual

    const extraClassName = isTarget
        ? 'target'
        : isStart
            ? 'start'
            : isWall
                ? 'wall'
                : isPath
                    ? 'path'
                    : (weight && weight > 1) // Si tiene peso extra
                        ? 'weight'
                        : isVisited
                            ? 'visited'
                            : '';
    return (
        <div
            id={`node-${row}-${col}`} //UID basado en su posición en el grid
            className={`node ${extraClassName}`}
            onMouseDown={ () => onMouseDown(row, col) }
            onMouseEnter={ () => onMouseEnter(row, col)}
            onMouseUp={onMouseUp}
            
            title={`(${row},${col}) ${isWall ? 'Muro': ''} ${isStart ? 'Inicio': ''} ${isTarget ? 'Meta': ''}`}
        >
        </div>
    );
}

export default Node;

