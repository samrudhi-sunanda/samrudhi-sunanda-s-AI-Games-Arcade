export interface Point {
  r: number;
  c: number;
}

export interface AStarNode {
  r: number;
  c: number;
  g: number;
  h: number;
  f: number;
  parent: AStarNode | null;
}

export interface AStarResult {
  found: boolean;
  path: Point[];
  visitedNodesInOrder: Point[];
  pathLength: number;
  nodesExploredCount: number;
}

export function manhattanDistance(a: Point, b: Point): number {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
}

export function pointToKey(p: Point): string {
  return `${p.r},${p.c}`;
}

export function keyToPoint(key: string): Point {
  const [r, c] = key.split(',').map(Number);
  return { r, c };
}

/**
 * A* Pathfinding Algorithm on a 2D 4-directional grid
 */
export function runAStarSearch(
  rows: number,
  cols: number,
  start: Point,
  goal: Point,
  walls: Set<string>
): AStarResult {
  const startKey = pointToKey(start);
  const goalKey = pointToKey(goal);

  if (startKey === goalKey) {
    return {
      found: true,
      path: [start],
      visitedNodesInOrder: [start],
      pathLength: 1,
      nodesExploredCount: 1,
    };
  }

  const openSet: AStarNode[] = [];
  const closedSet = new Set<string>();
  const gScores = new Map<string, number>();
  const visitedNodesInOrder: Point[] = [];

  const startNode: AStarNode = {
    r: start.r,
    c: start.c,
    g: 0,
    h: manhattanDistance(start, goal),
    f: manhattanDistance(start, goal),
    parent: null,
  };

  openSet.push(startNode);
  gScores.set(startKey, 0);

  const directions = [
    { r: -1, c: 0 }, // Up
    { r: 1, c: 0 },  // Down
    { r: 0, c: -1 }, // Left
    { r: 0, c: 1 },  // Right
  ];

  while (openSet.length > 0) {
    // Pick node with lowest f-score (tie-break with lowest h)
    openSet.sort((a, b) => a.f - b.f || a.h - b.h);
    const current = openSet.shift()!;
    const currentKey = pointToKey(current);

    if (closedSet.has(currentKey)) continue;
    closedSet.add(currentKey);
    visitedNodesInOrder.push({ r: current.r, c: current.c });

    // Check if goal reached
    if (current.r === goal.r && current.c === goal.c) {
      const path: Point[] = [];
      let temp: AStarNode | null = current;
      while (temp !== null) {
        path.unshift({ r: temp.r, c: temp.c });
        temp = temp.parent;
      }
      return {
        found: true,
        path,
        visitedNodesInOrder,
        pathLength: path.length,
        nodesExploredCount: visitedNodesInOrder.length,
      };
    }

    for (const dir of directions) {
      const nr = current.r + dir.r;
      const nc = current.c + dir.c;
      const neighborKey = `${nr},${nc}`;

      // Out of bounds check
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

      // Wall check
      if (walls.has(neighborKey)) continue;

      // Closed set check
      if (closedSet.has(neighborKey)) continue;

      const tentativeG = current.g + 1;
      const currentG = gScores.get(neighborKey) ?? Infinity;

      if (tentativeG < currentG) {
        gScores.set(neighborKey, tentativeG);
        const h = manhattanDistance({ r: nr, c: nc }, goal);
        const neighborNode: AStarNode = {
          r: nr,
          c: nc,
          g: tentativeG,
          h,
          f: tentativeG + h,
          parent: current,
        };

        const existingIdx = openSet.findIndex((n) => n.r === nr && n.c === nc);
        if (existingIdx !== -1) {
          openSet[existingIdx] = neighborNode;
        } else {
          openSet.push(neighborNode);
        }
      }
    }
  }

  return {
    found: false,
    path: [],
    visitedNodesInOrder,
    pathLength: 0,
    nodesExploredCount: visitedNodesInOrder.length,
  };
}

/**
 * Procedural Maze Generation using randomized DFS to guarantee corridors
 */
export function generateProceduralMaze(rows: number, cols: number, start: Point, goal: Point): Set<string> {
  const walls = new Set<string>();

  // Fill everything with walls initially
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      walls.add(`${r},${c}`);
    }
  }

  // Carve passages using recursive backtracking
  const visited = new Set<string>();

  function carve(r: number, c: number) {
    visited.add(`${r},${c}`);
    walls.delete(`${r},${c}`);

    const directions = [
      { r: -2, c: 0 },
      { r: 2, c: 0 },
      { r: 0, c: -2 },
      { r: 0, c: 2 },
    ].sort(() => Math.random() - 0.5);

    for (const dir of directions) {
      const nr = r + dir.r;
      const nc = c + dir.c;
      if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1 && !visited.has(`${nr},${nc}`)) {
        // Carve in-between wall
        const wallR = r + dir.r / 2;
        const wallC = c + dir.c / 2;
        walls.delete(`${wallR},${wallC}`);
        carve(nr, nc);
      }
    }
  }

  // Ensure start is on an odd cell
  const startCarveR = start.r % 2 === 1 ? start.r : Math.max(1, start.r - 1);
  const startCarveC = start.c % 2 === 1 ? start.c : Math.max(1, start.c - 1);
  carve(startCarveR, startCarveC);

  // Clear start and goal and direct adjacent cells so path is accessible
  walls.delete(pointToKey(start));
  walls.delete(pointToKey(goal));
  walls.delete(`${start.r + 1},${start.c}`);
  walls.delete(`${start.r},${start.c + 1}`);
  walls.delete(`${goal.r - 1},${goal.c}`);
  walls.delete(`${goal.r},${goal.c - 1}`);

  // Randomly punch a few loops into the maze for multi-path exploration
  for (let r = 2; r < rows - 2; r += 2) {
    for (let c = 2; c < cols - 2; c += 2) {
      if (Math.random() < 0.25) {
        walls.delete(`${r},${c}`);
      }
    }
  }

  return walls;
}
