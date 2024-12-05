import React, { useState, useEffect } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { floydWarshall, getOptimalRoute } from "./floydWarshall"
import './App.css';

function App() {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [optimalPaths, setOptimalPaths] = useState([]);
  const [nextMatrix, setNextMatrix] = useState([]);
  const [startNode, setStartNode] = useState('');
  const [endNode, setEndNode] = useState('');
  const [optimalDistance, setOptimalDistance] = useState(null);
  const [optimalRoute, setOptimalRoute] = useState([]);

  // Fetch data and initialize Floyd-Warshall
  useEffect(() => {
    fetch('http://localhost:5000/graph')
      .then(res => res.json())
      .then(data => {
        const nodes = data.nodes.map((node, index) => ({
          data: { id: `n${index}`, label: node },
        }));

        const edges = [];
        data.edges.forEach((row, source) => {
          row.forEach((weight, target) => {
            if (weight > 0) {
              edges.push({
                data: {
                  source: `n${source}`,
                  target: `n${target}`,
                  label: `Distance: ${weight}`,
                  weight,
                },
              });
            }
          });
        });

        setGraphData({ nodes, edges });

        const { dist, next } = floydWarshall(data);
        setOptimalPaths(dist);
        setNextMatrix(next);
      });
  }, []);

  // Calculate the optimal path based on user selection
  const calculateOptimalRoute = () => {
    const startIdx = graphData.nodes.findIndex(n => n.data.label === startNode);
    const endIdx = graphData.nodes.findIndex(n => n.data.label === endNode);

    if (startIdx !== -1 && endIdx !== -1) {
      const distance = optimalPaths[startIdx][endIdx];
      const routeIndices = getOptimalRoute(startIdx, endIdx, nextMatrix);
      const routeLabels = routeIndices.map(idx => graphData.nodes[idx].data.label);

      setOptimalDistance(distance);
      setOptimalRoute(routeLabels);
    }
  };

  return (
    <div className="App">
      <h1>Floyd-Warshall Path Finder</h1>
      
      {/* Dropdowns for selecting nodes */}
      <div>
        <label>Start Node: </label>
        <select value={startNode} onChange={e => setStartNode(e.target.value)}>
          <option value="">Select Start Node</option>
          {graphData.nodes.map(node => (
            <option key={node.data.id} value={node.data.label}>
              {node.data.label}
            </option>
          ))}
        </select>

        <label>End Node: </label>
        <select value={endNode} onChange={e => setEndNode(e.target.value)}>
          <option value="">Select End Node</option>
          {graphData.nodes.map(node => (
            <option key={node.data.id} value={node.data.label}>
              {node.data.label}
            </option>
          ))}
        </select>

        <button onClick={calculateOptimalRoute}>Find Optimal Route</button>
      </div>

      {/* Display the optimal distance and route */}
      {optimalDistance !== null && (
        <>
          <h3>Optimal Distance: {optimalDistance}</h3>
          <h3>Optimal Route: {optimalRoute.join(" → ")}</h3>
        </>
      )}

      <CytoscapeComponent
        elements={[...graphData.nodes, ...graphData.edges]}
        style={{ width: '100%', height: '90vh', backgroundImage:'url(https://res.cloudinary.com/dubrgx4b1/image/upload/v1733405222/udoxingykjkdzqcpfxue.avif)'}}
        layout={{ name: 'circle',
          padding: 5
         }}
        userZoomingEnabled={false}
        stylesheet={[
          { 
            selector: 'node',  
            style: {
              'color':"#fff",
            'background-color': '#fff',
            'background-image': 'data(imageUrl)',
            'background-fit': 'cover',
            'width': 30,
            'height': 30,
            'label': 'data(label)',
            } 
        },
          { selector: 'edge', style: { 'line-color': '#FF4136', label: 'data(label)' } },
        ]}
      />
    </div>
  );
}

export default App;

