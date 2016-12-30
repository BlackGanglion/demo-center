const fs = require('fs');
const map = JSON.parse(fs.readFileSync('./data4.json'));

const nodes = map.nodes;
const links = map.links;

console.log(`*Vertices ${nodes.length}`);
nodes.forEach((node, i) => {
  console.log(` ${i+1} "v${node.id}"`);
});

console.log('*Arcs');
links.forEach((link, i) => {
  const source = Number(link.source);
  const target = Number(link.target);
  console.log(` ${source} ${target} 1.000000000000000`);
});
