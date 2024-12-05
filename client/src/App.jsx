import React, { useEffect, useState } from 'react';
import './App.css';

function floydWarshall(graph) {
  const dist = [...graph.edges];
  const V = graph.nodes.length;

  for (let k = 0; k < V; k++) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        if (dist[i][j] > dist[i][k] + dist[k][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }

  return dist;
}

function App() {
  const [graph, setGraph] = useState(null);
  const [optimalPaths, setOptimalPaths] = useState([]);
  const [userPath, setUserPath] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/graph')
      .then((res) => res.json())
      .then((data) => {
        setGraph(data);
        const paths = floydWarshall(data);
        setOptimalPaths(paths);
      });
  }, []);

  const handleUserPath = (path) => {
    const distance = path.reduce(
      (acc, [from, to]) => acc + graph.edges[from][to],
      0
    );
    setUserPath(path);
    setTotalDistance(distance);
  };

  return (
    <div className="App">
      <h1>Floyd-Warshall Game</h1>
      {graph && (
        <div>
          <h2>Graph: {graph.nodes.join(', ')}</h2>
          <h3>Optimal Paths (Distances):</h3>
          <pre>{JSON.stringify(optimalPaths, null, 2)}</pre>
          <button onClick={() => handleUserPath([[0, 1], [1, 0]])}>
            Select Example Path
          </button>
          <h3>User Path Distance: {totalDistance}</h3>
        </div>
      )}
    </div>
  );
}

export default App;
