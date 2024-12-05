const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_CONNECTION_URL).then(()=>{
    console.log("connected to db successfully...");
}).catch((err) => {
    console.log("the error connecting to db is : ", err);
})

const graphSchema = new mongoose.Schema({
  nodes: [String], // List of node names
  edges: [[Number]], // Adjacency matrix
});

const Graph = mongoose.model('Graph', graphSchema);
module.exports = {
    Graph
}
