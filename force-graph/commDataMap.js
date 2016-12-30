const fs = require('fs');

function readLines(input, func) {
  var remaining = '';
  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    while (index > -1) {
      var line = remaining.substring(0, index);
      remaining = remaining.substring(index + 1);
      func(line);
      index = remaining.indexOf('\n');
    }

  });

  input.on('end', function() {
    if (remaining.length > 0) {
      func(remaining);
    }
  });
}

const map = JSON.parse(fs.readFileSync('./data4.json'));

const nodes = map.nodes;
const links = map.links;

const newNodes = [];
var count = 0;

const groupMap = {};

function func(data) {
  const groupId = Number(data);

  /*
  if(groupMap[groupId] && groupMap[groupId].length) {
    groupMap[groupId].push(nodes[count].id);
  } else {
    groupMap[groupId] = [];
    groupMap[groupId].push(nodes[count].id);
  }
  */

  newNodes.push({
    id: nodes[count].id,
    group: nodes[count].group,
    realGroup: groupId,
  });
  count++;

  if (count === nodes.length) {
    // console.log(groupMap);
    console.log(JSON.stringify({
      nodes: newNodes,
      links,
    }));
  }
}

var input = fs.createReadStream('./karate_comm_comboC++.txt');
readLines(input, func);
