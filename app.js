const BOARDWIDTH = 8;
const possibleMoves = [
  [2, 1],
  [1, 2],
  [-1, 2],
  [-2, 1],
  [-2, -1],
  [-1, -2],
  [1, -2],
  [2, -1],
];

function squareToCoords(square) {
  const col = square.charCodeAt(0) - 'A'.charCodeAt(0);
  const row = parseInt(square[1], 10) - 1;
  return [col, row];
}

function coordsToSquare([col, row]) {
  return `${String.fromCharCode('A'.charCodeAt(0) + col)}${row + 1}`;
}

function getKnightNeighbors(square) {
  const neighbors = [];
  const [col, row] = squareToCoords(square);
  for (const [dc, dr] of possibleMoves) {
    const nc = col + dc;
    const nr = row + dr;
    if (nc >= 0 && nc < BOARDWIDTH && nr >= 0 && nr < BOARDWIDTH) {
      neighbors.push(coordsToSquare([nc, nr]));
    }
  }
  return neighbors;
}

function getHeuristic(from, to) {
  const [fx, fy] = squareToCoords(from);
  const [tx, ty] = squareToCoords(to);
  const dx = Math.abs(fx - tx);
  const dy = Math.abs(fy - ty);
  return Math.ceil(Math.max(dx, dy) / 3);
}

function knightMoves(start, goal) {
  const openSet = [start];
  const cameFrom = {};
  const gScore = { [start]: 0 };
  const fScore = { [start]: getHeuristic(start, goal) };
  const visited = new Set();

  while (openSet.length > 0) {
    openSet.sort((a, b) => fScore[a] - fScore[b]);
    const current = openSet.shift();

    if (current === goal) return reconstructPath(cameFrom, current);
    visited.add(current);

    for (const neighbor of getKnightNeighbors(current)) {
      if (visited.has(neighbor)) continue;

      const tentative_gScore = gScore[current] + 1;

      if (tentative_gScore < (gScore[neighbor] || Infinity)) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentative_gScore;
        fScore[neighbor] = tentative_gScore + getHeuristic(neighbor, goal);

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }
  return null;
}

function reconstructPath(cameFrom, current) {
  const path = [current];
  while (cameFrom[current]) {
    current = cameFrom[current];
    path.push(current);
  }
  return path.reverse();
}

let path = knightMoves('A1', 'H8');
console.log(`You made it in ${knightMoves.length} moves! Here's your path:`);
for (const square of path) {
  console.log(square);
}
