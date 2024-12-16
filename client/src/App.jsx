import React, { useState, useEffect } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { floydWarshall, getOptimalRoute, getPathsWithDistances} from "./floydWarshall"


function App() {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [optimalPaths, setOptimalPaths] = useState([]);
  const [nextMatrix, setNextMatrix] = useState([]);
  const [startNode, setStartNode] = useState('');
  const [endNode, setEndNode] = useState('');
  const [optimalDistance, setOptimalDistance] = useState(null);
  const [optimalRoute, setOptimalRoute] = useState([]);
  const [allRoutes, setAllRoutes] = useState([]);

  const nodeImages = {
    "Adventurer": 'https://res.cloudinary.com/dubrgx4b1/image/upload/v1733408320/z3byiid4tlqaxsgyzfm6.jpg',
    "Bizzare Desert": 'https://res.cloudinary.com/dubrgx4b1/image/upload/v1733409876/rlxjoanir514bxtr9v1i.jpg',
    "Carlos Smithy": 'https://res.cloudinary.com/dubrgx4b1/image/upload/v1733422788/xsdkn2dz0nb3vv8ojr7n.jpg',
    "Dungeon Roar": 'https://res.cloudinary.com/dubrgx4b1/image/upload/v1733467911/buxixpvnprccghhqbssq.png',
    "Elora forest": 'https://res.cloudinary.com/dubrgx4b1/image/upload/v1733423017/krhpt3bff92nx6fibecr.jpg',
    "Flaurance eternal hotel": 'https://res.cloudinary.com/dubrgx4b1/image/upload/v1733423464/k6knp8prus0kjluxupis.jpg',
    "Gabriel's merchantry": 'https://res.cloudinary.com/dubrgx4b1/image/upload/v1733410310/zd6g89vncjaz7q20iwzr.png',
  };
  // Fetch data and initialize Floyd-Warshall
  useEffect(() => {
    fetch('/graph')
      .then(res => res.json())
      .then(data => {
        console.log(data.nodes.map((node, index)=>{
          console.log(nodeImages[node]);
        }));
        const nodes = data.nodes.map((node, index) => ({
          data: { 
            id: `n${index}`, 
            label: node,
            imageUrl: nodeImages[node]
           },
        }));

        const edges = [];
        data.edges.forEach((row, source) => {
          row.forEach((weight, target) => {
            if (weight > 0) {
              edges.push({
                data: {
                  source: `n${source}`,
                  target: `n${target}`,
                  label: `Travel : ${weight}`,
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
  // const calculateOptimalRoute = () => {
  //   const startIdx = graphData.nodes.findIndex(n => n.data.label === startNode);
  //   const endIdx = graphData.nodes.findIndex(n => n.data.label === endNode);

  //   if (startIdx !== -1 && endIdx !== -1) {
  //     const distance = optimalPaths[startIdx][endIdx];
  //     const routeIndices = getOptimalRoute(startIdx, endIdx, nextMatrix);
  //     const routeLabels = routeIndices.map(idx => graphData.nodes[idx].data.label);

  //     setOptimalDistance(distance);
  //     setOptimalRoute(routeLabels);
  //   }
  // };

  const calculateOptimalRoute = () => {
    const startIdx = graphData.nodes.findIndex(n => n.data.label === startNode);
    const endIdx = graphData.nodes.findIndex(n => n.data.label === endNode);

    if (startIdx !== -1 && endIdx !== -1) {
      const distance = optimalPaths[startIdx][endIdx];
      const routeIndices = getOptimalRoute(startIdx, endIdx, nextMatrix);
      const routeLabels = routeIndices.map(idx => graphData.nodes[idx].data.label);

      const allPaths = getPathsWithDistances(startIdx, endIdx, optimalPaths, nextMatrix);

      setOptimalDistance(distance);
      setOptimalRoute(routeLabels);
      setAllRoutes(allPaths);
    }
  };

  const calculateAllRoutes = () => {
    console.log("itting calculate all routes")
    const startIdx = graphData.nodes.findIndex(n => n.data.label === startNode);
    const endIdx = graphData.nodes.findIndex(n => n.data.label === endNode);

    if (startIdx !== -1 && endIdx !== -1) {
      const allPathsWithDistances = getPathsWithDistances(startIdx, endIdx, optimalPaths, nextMatrix);
      console.log(allPathsWithDistances);
      setAllRoutes(allPathsWithDistances);
    }
  };
  

  // return (
  //   <div className="App bg-gray-50 min-h-screen flex flex-col items-center justify-start p-6">
  //     <h1 className="text-3xl font-bold text-slate-700 mb-6">Amargadon: Dungeon Game</h1>
      
  //     {/* Dropdowns for selecting nodes */}
  //     <div className="flex gap-6 mb-6">
  //       <div className="flex flex-col">
  //         <label htmlFor="startNode" className="font-medium text-gray-700 mb-2">Start Node:</label>
  //         <select 
  //           id="startNode" 
  //           value={startNode} 
  //           onChange={e => setStartNode(e.target.value)} 
  //           className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  //         >
  //           <option value="">Select Start Node</option>
  //           {graphData.nodes.map(node => (
  //             <option key={node.data.id} value={node.data.label}>
  //               {node.data.label}
  //             </option>
  //           ))}
  //         </select>
  //       </div>

  //       <div className="flex flex-col">
  //         <label htmlFor="endNode" className="font-medium text-gray-700 mb-2">End Node:</label>
  //         <select 
  //           id="endNode" 
  //           value={endNode} 
  //           onChange={e => setEndNode(e.target.value)} 
  //           className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  //         >
  //           <option value="">Select End Node</option>
  //           {graphData.nodes.map(node => (
  //             <option key={node.data.id} value={node.data.label}>
  //               {node.data.label}
  //             </option>
  //           ))}
  //         </select>
  //       </div>

  //       <button 
  //         onClick={calculateOptimalRoute} 
  //         className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //       >
  //         Find Optimal Route
  //       </button>
  //     </div>

  //     {/* Display the optimal distance and route */}
  //     {optimalDistance !== null && (
  //       <div className="bg-white p-4 rounded-md shadow-md mb-6 w-full max-w-lg">
  //         <h3 className="text-xl font-semibold text-green-600 w-full">Optimal Distance: {optimalDistance}</h3>
  //         <h3 className="text-lg text-gray-800 w-full">Optimal Route: {optimalRoute.join(" → ")}</h3>
  //         <h3 className="text-lg text-gray-800 w-full">Optimal Route: </h3>

  //       </div>
  //     )}

  //     <CytoscapeComponent
  //       elements={[...graphData.nodes, ...graphData.edges]}
  //       style={{ width: '100%', height: '90vh', backgroundImage:'url(https://res.cloudinary.com/dubrgx4b1/image/upload/v1733423134/lsy9u8wowqse0zeqvxce.jpg)'}}
  //       layout={{ name: 'circle',
  //         padding: 5,
  //         animate:true,
  //         fit:true,
  //         avoidOverlap: true,
  //         startAngle: 3 / 2 * Math.PI,
  //         animationDuration: 500,
  //         animationEasing: undefined,
  //         clockwise: true,
  //        }}     
  //       userZoomingEnabled={false}
  //       stylesheet={[
  //         { 
  //           selector: 'node',  
  //           style: {
  //           'color':"#fff",
  //           "font-weight":"600",
  //           "font-size":20,
  //           'background-image': `data(imageUrl)`,
  //           'background-fit': 'cover',
  //           'width': 60,
  //           'height': 60,
  //           'label': 'data(label)',
  //           'font-family': 'Arial',
  //           } 
  //       },
  //         { selector: 'edge', style: { 'line-color': '#8a817c', label: 'data(label)', 'color': '#edede9', 'text-margin-y': -10,'target-arrow-shape': 'triangle', 'target-arrow-color': '#FF4136',} },
  //       ]}
  //     />
  //   </div>
  // );

  return (
    <div className="App bg-gray-50 min-h-screen flex flex-col items-center justify-start p-6">
      <h1 className="text-3xl font-bold text-slate-700 mb-6">Amargadon: Dungeon Game</h1>
      
      {/* Dropdowns for selecting nodes */}
      <div className="flex gap-6 mb-6">
        <div className="flex flex-col">
          <label htmlFor="startNode" className="font-medium text-gray-700 mb-2">Start Node:</label>
          <select 
            id="startNode" 
            value={startNode} 
            onChange={e => setStartNode(e.target.value)} 
            className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Start Node</option>
            {graphData.nodes.map(node => (
              <option key={node.data.id} value={node.data.label}>
                {node.data.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="endNode" className="font-medium text-gray-700 mb-2">End Node:</label>
          <select 
            id="endNode" 
            value={endNode} 
            onChange={e => setEndNode(e.target.value)} 
            className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select End Node</option>
            {graphData.nodes.map(node => (
              <option key={node.data.id} value={node.data.label}>
                {node.data.label}
              </option>
            ))}
          </select>
        </div>

        <button 
          onClick={calculateOptimalRoute} 
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Find Optimal Route
        </button>
        <button 
          onClick={calculateAllRoutes} 
          className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Show All Routes
        </button>
      </div>

      {/* Display the optimal distance and route */}
      {optimalDistance !== null && (
        <div className="bg-white p-4 rounded-md shadow-md mb-6 w-full max-w-lg">
          <h3 className="text-xl font-semibold text-green-600 w-full">Optimal Distance: {optimalDistance}</h3>
          <h3 className="text-lg text-gray-800 w-full">Optimal Route: {optimalRoute.join(" → ")}</h3>
        </div>
      )}

      {/* Display all possible routes */}
      {allRoutes.length > 0 && (
        <div className="bg-white p-4 rounded-md shadow-md mb-6 w-full max-w-lg">
          <h3 className="text-xl font-semibold text-blue-600 mb-4">All Possible Routes:</h3>
          <ul className="list-disc ml-6 text-gray-800">
            {allRoutes.map((route, index) => (
              <li key={index}>
                Route: {route.path.join(" → ")}, Distance: {route.distance}
              </li>
            ))}
          </ul>
        </div>
      )}

      <CytoscapeComponent
        elements={[...graphData.nodes, ...graphData.edges]}
        style={{ width: '100%', height: '90vh', backgroundImage: 'url(https://res.cloudinary.com/dubrgx4b1/image/upload/v1733423134/lsy9u8wowqse0zeqvxce.jpg)' }}
        layout={{ name: 'circle', padding: 5, animate: true, fit: true, avoidOverlap: true, startAngle: 3 / 2 * Math.PI, animationDuration: 500 }}
        userZoomingEnabled={false}
        stylesheet={[
          { 
            selector: 'node',  
            style: {
              'color': "#fff",
              "font-weight": "600",
              "font-size": 20,
              'background-image': `data(imageUrl)`,
              'background-fit': 'cover',
              'width': 60,
              'height': 60,
              'label': 'data(label)',
              'font-family': 'Arial',
            }
          },
          { selector: 'edge', style: { 'line-color': '#8a817c', label: 'data(label)', 'color': '#edede9', 'text-margin-y': -10, 'target-arrow-shape': 'triangle', 'target-arrow-color': '#FF4136', } },
        ]}
      />
    </div>
  );
}

export default App;

