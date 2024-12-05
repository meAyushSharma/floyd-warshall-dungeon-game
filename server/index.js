require("dotenv").config();
const express = require("express");
const cors = require('cors');
const {Graph} = require("./models/Graph");

const PORT=process.env.PORT;
const HOST="0.0.0.0";

const app= express();

app.use(cors());
app.use(express.json());

app.get('/graph', async (req, res) => {
    const graph = await Graph.findOne(); // Fetch the graph
    res.json(graph);
});
  
app.post('/graph', async (req, res) => {
    const { nodes, edges } = req.body;
    const graph = new Graph({ nodes, edges });
    await graph.save();
    res.status(201).json(graph);
});
  
app.listen(PORT,HOST, () => console.log('Server running on port 5000 : http://localhost:5000'));
