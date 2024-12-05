export function floydWarshall(graph) {
    const V = graph.nodes.length;
    const dist = graph.edges.map((row, i) =>
      row.map((val, j) => (i === j ? 0 : val === 0 ? Infinity : val))
    );
    const next = Array.from({ length: V }, () => Array(V).fill(null));
  
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        if (dist[i][j] !== Infinity && i !== j) {
          next[i][j] = j;
        }
      }
    }
  
    for (let k = 0; k < V; k++) {
      for (let i = 0; i < V; i++) {
        for (let j = 0; j < V; j++) {
          if (dist[i][j] > dist[i][k] + dist[k][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
            next[i][j] = next[i][k];
          }
        }
      }
    }
  
    return { dist, next };
  }
  
  
  
  
export function getOptimalRoute(start, end, next) {
    if (next[start][end] === null) return [];
    const route = [];
    let current = start;
  
    while (current !== end) {
      route.push(current);
      current = next[current][end];
    }
    route.push(end);
    return route;
  }