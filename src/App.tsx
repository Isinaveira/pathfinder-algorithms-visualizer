// src/App.tsx
import React, { useState, useEffect } from "react";
import Grid from "./components/Grid";
import type { DrawingMode } from "./utils/types";
import { ALGORITHM_INFO } from "./utils/algorithmInfo";
import "./App.css";

export type AlgorithmType = "bfs" | "dfs" | "dijkstra" | "aStar";

const App: React.FC = () => {
  const [drawingMode, setDrawingMode] = useState<DrawingMode>("start");
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<AlgorithmType>("bfs");

  useEffect(() => {
    if (
      (selectedAlgorithm === "bfs" || selectedAlgorithm === "dfs") &&
      drawingMode === "weight"
    ) {
      setDrawingMode("wall");
    }
  }, [selectedAlgorithm, drawingMode]);

  return (
    <div className="App">
      <h1>Visualizador de Algoritmos de Pathfinding</h1>

      <div className="controls-main">
        <div className="control-group">
          <label htmlFor="mode-select">Modo de Dibujo:</label>
          <select
            id="mode-select"
            value={drawingMode}
            onChange={(e) => setDrawingMode(e.target.value as DrawingMode)}
            aria-label="Seleccionar modo de dibujo"
          >
            <option value="start">Punto de Inicio</option>
            <option value="target">Punto de Meta</option>
            <option value="wall">Muro</option>
            <option
              value="weight"
              disabled={
                selectedAlgorithm === "bfs" || selectedAlgorithm === "dfs"
              }
            >
              Terreno Costoso (Peso)
            </option>
            <option value="erase">Borrar</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="algorithm-select">Algoritmo:</label>
          <select
            id="algorithm-select"
            value={selectedAlgorithm}
            onChange={(e) =>
              setSelectedAlgorithm(e.target.value as AlgorithmType)
            }
            aria-label="Seleccionar algoritmo de pathfinding"
          >
            <option value="bfs">BFS (Breadth-First Search)</option>
            <option value="dfs">DFS (Depth-First Search)</option>
            <option value="dijkstra">Dijkstra</option>
            <option value="aStar">A* (A-Star)</option>
          </select>
          {/* Usa el objeto importado directamente */}
        </div>
      </div>

      <Grid drawingMode={drawingMode} selectedAlgorithm={selectedAlgorithm} />
      <div className="algorithm-info-container">
        <p className="algorithm-info">{ALGORITHM_INFO[selectedAlgorithm]}</p>
      </div>
    </div>
  );
};

export default App;
