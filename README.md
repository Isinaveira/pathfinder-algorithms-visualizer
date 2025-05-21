# Visualizador de Algoritmos de Pathfinding

Este proyecto es un visualizador interactivo de algoritmos de búsqueda de caminos (pathfinding), desarrollado en React y TypeScript. Te permite simular cómo diferentes algoritmos encuentran la ruta más eficiente en una cuadrícula, pudiendo dibujar muros, establecer puntos de inicio y meta, y hasta definir terrenos con costos variables.

¡Explora, experimenta y aprende los fundamentos de estos algoritmos!

---

## 🚀 Características Principales

* **Múltiples Algoritmos:** Incluye implementaciones de BFS (Búsqueda en Amplitud), DFS (Búsqueda en Profundidad), Dijkstra y A\* (A-Star).
* **Modos de Dibujo Flexibles:**
    * **Punto de Inicio:** Dónde comienza la búsqueda.
    * **Punto de Meta:** El objetivo de la búsqueda.
    * **Muro:** Bloquea el paso de los algoritmos.
    * **Terreno Costoso (Peso):** Zonas donde el paso tiene un costo más alto (solo afecta a Dijkstra y A\*).
    * **Borrar:** Elimina cualquier elemento de un nodo.
* **Visualización Dinámica:** Observa la expansión de los nodos y el camino final encontrado en tiempo real.
* **Estadísticas Detalladas:** Muestra la longitud del camino y el costo total del viaje al finalizar la visualización.
* **Controles Intuitivos:** Botones para ejecutar el algoritmo, reiniciar la cuadrícula por completo o limpiar solo la visualización actual.

---

## 🛠️ Tecnologías Utilizadas

* **React:** Para la construcción de la interfaz de usuario interactiva y dinámica.
* **TypeScript:** Garantiza un código más robusto y con tipado estático, mejorando la detección de errores en desarrollo.
* **CSS:** Estilizado moderno y animaciones para la cuadrícula y los nodos.

---

## 📦 Instalación y Ejecución Local

Para poner en marcha el proyecto en tu máquina, sigue estos sencillos pasos:

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/nombre-del-repositorio.git](https://github.com/tu-usuario/nombre-del-repositorio.git)
    cd nombre-del-repositorio
    ```
    (Reemplaza `<URL_DEL_REPOSITORIO>` con la URL real de tu repositorio si es público).

2.  **Instala las dependencias:**
    ```bash
    npm install
    # o si usas Yarn
    yarn install
    ```

3.  **Inicia la aplicación:**
    ```bash
    npm run dev
    # o si usas Yarn
    yarn dev
    ```
    Tu navegador se abrirá automáticamente en `http://localhost:5173/` (o un puerto similar) con la aplicación funcionando.

---

## 💡 Algoritmos de Pathfinding

A continuación, exploramos cada algoritmo incluido y su comportamiento distintivo:

### 1. BFS (Breadth-First Search) - Búsqueda en Amplitud

BFS explora el grafo por "niveles", visitando todos los nodos a una distancia `N` del inicio antes de pasar a los nodos a una distancia `N+1`. Es ideal para encontrar el **camino más corto en número de pasos** en un grafo sin ponderar.

* **Comportamiento Visual:** Observarás una expansión de "ondas" desde el nodo de inicio que se propaga uniformemente en todas direcciones.
* **Nota Importante:** Este algoritmo **ignora** el "Terreno Costoso (Peso)". Cada paso cuenta como `1`.

**[IMAGEN o GIF: BFS explorando y mostrando el camino más corto en pasos]**
(Inserta aquí un GIF o imagen que muestre el comportamiento de BFS. Asegúrate de que el patrón de onda sea claro.)

---

### 2. DFS (Depth-First Search) - Búsqueda en Profundidad

DFS prioriza la exploración de una "rama" o dirección lo más profundamente posible antes de retroceder y explorar otras. No garantiza encontrar el camino más corto, solo *un* camino si existe.

* **Comportamiento Visual:** El algoritmo se "sumerge" por un camino hasta que no puede avanzar más, luego retrocede para probar otras rutas. El camino encontrado puede parecer "serpenteante".
* **Nota Importante:** Al igual que BFS, este algoritmo también **ignora** el "Terreno Costoso (Peso)".

**[IMAGEN o GIF: DFS mostrando su exploración profunda y un posible camino no óptimo/serpenteante]**
(Inserta aquí un GIF o imagen de DFS en acción. Destaca su comportamiento de "inmersión" y cómo el camino final puede no ser el más directo.)

---

### 3. Algoritmo de Dijkstra

Dijkstra es un algoritmo fundamental para encontrar el **camino de menor costo** desde un nodo de origen a todos los demás nodos en un grafo con pesos de arista no negativos.

* **Comportamiento Visual:** La visualización también mostrará una "onda" expansiva. Sin embargo, esta onda se propagará más lentamente a través de los nodos que tienen un "peso" (costo) más alto, reflejando su búsqueda del camino más barato.
* **Clave:** Este algoritmo **considera** el "Terreno Costoso (Peso)", lo que le permite encontrar rutas óptimas que evitan o minimizan el paso por zonas de alto costo.

**[IMAGEN o GIF: Dijkstra explorando con pesos, mostrando cómo la expansión es afectada por las zonas de costo]**
(Inserta aquí un GIF o imagen de Dijkstra. Muestra cómo la "onda" se desvía o avanza más lento por las zonas de peso.)

---

### 4. Algoritmo A\* (A-Star)

A\* es una extensión del algoritmo de Dijkstra, considerado uno de los algoritmos de pathfinding más eficientes y populares. Utiliza una **heurística** para estimar la distancia restante al objetivo, lo que guía la búsqueda de forma más inteligente y reduce drásticamente los nodos explorados.

* **Comportamiento Visual:** La exploración de A\* es notablemente más "dirigida" hacia el objetivo. Verás cómo el algoritmo prioriza las direcciones que, según su estimación, lo acercan más a la meta, visitando significativamente menos nodos que Dijkstra para encontrar el mismo camino óptimo.
* **Clave:** También **considera** el "Terreno Costoso (Peso)" y su eficiencia lo hace ideal para cuadrículas grandes y complejas.

**[IMAGEN o GIF: A* explorando de forma dirigida, con menos nodos visitados que Dijkstra en un escenario similar con pesos]**
(Inserta aquí un GIF o imagen de A\*. La diferencia clave con Dijkstra es que A\* debe mostrar una búsqueda más enfocada hacia el objetivo.)

---

## ✍️ Guía de Uso

1.  **Define Inicio y Meta:** Selecciona el "Modo de Dibujo" `Punto de Inicio` y haz clic en una celda, luego haz lo mismo con `Punto de Meta`.
2.  **Dibuja el Entorno:** Utiliza los modos `Muro` para bloquear caminos o `Terreno Costoso (Peso)` para añadir zonas de alto coste (recuerda que el Terreno Costoso solo afecta a Dijkstra y A\*). Usa `Borrar` para limpiar celdas.
3.  **Elige tu Algoritmo:** Selecciona entre BFS, DFS, Dijkstra o A\* en el menú desplegable.
4.  **¡Visualiza!** Haz clic en "Ejecutar [Nombre del Algoritmo]" para ver el proceso en acción. Observa los nodos visitados y el camino final.
5.  **Revisa las Estadísticas:** Debajo de la cuadrícula, se mostrará la longitud del camino (número de casillas) y el costo total del viaje.
6.  **Gestiona la Cuadrícula:**
    * **Reiniciar Cuadrícula:** Vuelve al estado inicial, eliminando todo.
    * **Limpiar Visualización:** Elimina solo los nodos visitados y el camino, manteniendo muros, inicio y meta para probar otro algoritmo.

---

## 🤝 Contribuciones

¡Las contribuciones son siempre bienvenidas! Si tienes ideas para mejorar la aplicación, añadir nuevos algoritmos o corregir errores, no dudes en abrir un *issue* o enviar un *pull request*.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
