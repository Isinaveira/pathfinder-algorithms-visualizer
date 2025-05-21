import type { Node } from '../utils/types';

export const ROWS = 20;
export const COLS = 40; 


function createNode(row: number, col: number): Node {
    return {
        row,
        col,
        isWall: false,
        isStart: false,
        isTarget: false,
        isVisited: false,
        isPath: false,
        parent: null,
        distance: Infinity,
        heuristicCost: Infinity,
        totalCost: Infinity,
        weight: 1   
    }
}

export function createGrid(): Node[][] {
    const grid: Node [][] = [];
    for( let row = 0; row < ROWS; row ++) {
        const currentRow: Node [] = [];
        for (let column = 0; column < COLS; column++) {
            currentRow.push(createNode(row, column))
        }
        grid.push(currentRow);
    }
    return grid;
}

export function clearPathfindingState(grid: Node[][]): Node[][] {
    const newGrid = grid.map(row => row.map(node => ({
        ...node,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        heuristicCost: Infinity, 
        totalCost: Infinity,     
        parent: null,
    })));
    return newGrid;
}