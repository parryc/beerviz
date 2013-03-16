function init() {
  // Instanciate sigma.js and customize rendering :
  var sigInst = sigma.init(document.getElementById('graph')).drawingProperties({
    defaultLabelColor: '#fff',
    defaultLabelSize: 14,
    defaultLabelBGColor: '#fff',
    defaultLabelHoverColor: '#000',
    labelThreshold: 6,
    defaultEdgeType: 'curve'
  }).graphProperties({
    minNodeSize: 0.5,
    maxNodeSize: 5,
    minEdgeSize: 1,
    maxEdgeSize: 1
  }).mouseProperties({
    maxRatio: 4
  });
 
  // Parse a GEXF encoded file to fill the graph
  // (requires "sigma.parseGexf.js" to be included)
  sigInst.parseGexf('files/beer.gexf');
 
  
  // Draw the graph :
  sigInst.draw();
}
 
$(document).ready(function(){
  init();
});
