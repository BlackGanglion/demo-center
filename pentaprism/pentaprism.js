// 绘制画布比真实画布，长高都减少100像素
const width = 900;
const height = 700;
const area = width * height;

// SVG操作封装
function create(type) {
  return document.createElementNS('http://www.w3.org/2000/svg', type);
}

function setAttr(target, attr) {
  return Object.keys(attr).forEach((item) => {
    target.setAttribute(item, attr[item]);
  });
}

function renderNodes(parent, nodes) {
  nodes.forEach((node, i) => {
    createNode(parent, {
      ox: node.ox,
      oy: node.oy,
      cx: node.cx,
      cy: node.cy,
      r: 12,
      id: node.id,
      group: node.group,
      path: node.path,
    });
  });
}

function renderLink(parent, nodes, links) {
  links.forEach((link, i) => {
    createLink(parent, link, nodes);
  });
}

function createNode(parent, { ox, oy, cx, cy, r, id, group, path }) {
  let color, textColor;

  switch (group) {
    case 0: {
      color = 'black';
      textColor = 'white';
      break;
    }
    case 1: {
      color = 'yellow';
      textColor = 'black';
      break;
    };
    case 2: {
      color = 'red';
      textColor = 'white';
      break;
    }
    case 3: {
      color = 'green';
      textColor = 'white';
      break;
    }
    case 4: {
      color = 'blue';
      textColor = 'white';
      break;
    }
    case 5: {
      color = 'hotPink';
      textColor = 'white';
      break;
    };
    case 6: {
      color = 'SandyBrown';
      textColor = 'white';
      break;
    }
    case 7: {
      color = 'Wheat';
      textColor = 'black';
      break;
    }
    case 8: {
      color = 'Purple';
      textColor = 'white';
      break;
    }
    case 9: {
      color = 'PaleTurquoise';
      textColor = 'black';
      break;
    }
  }

  if(isNaN(cx)) console.warn({ cx, cy, r, id, group });
  if(isNaN(cy)) console.warn({ cx, cy, r, id, group });

  const node = create("circle");
  setAttr(node, {
    id,
    cx: ox + (width / 2) + 50,
    cy: oy + (height / 2) + 50,
    r,
    stroke: 'black',
    'stroke-width': 2,
    fill: color,
  });

  /*
  const circleAnimateMotion = create("animateMotion");

  setAttr(circleAnimateMotion, {
    path: path.map((p, i) => {
      if (i === 0) return `M${0},${0}`;
      return `L${p.dx},${p.dy}`;
    }).join(' '),
    begin: '0s',
    dur: '20s',
    repeatCount: "1",
    fill: "freeze",
    calcMode: "linear",
  });
  */

  const cxAnimate = create("animate");

  const cxValues = path.map((e, i) => {
    return ox + e.dx + (width / 2) + 50;
  }).join(';');

  setAttr(cxAnimate, {
    attributeName: "cx",
    begin: "DOMNodeInsertedIntoDocument",
    dur: "20s",
    values: cxValues,
    repeatCount: "1",
    fill: "freeze",
  });

  const cyAnimate = create("animate");

  const cyValues = path.map((e, i) => {
    return oy + e.dy + (height / 2) + 50;
  }).join(';');

  setAttr(cyAnimate, {
    attributeName: "cy",
    begin: "DOMNodeInsertedIntoDocument",
    dur: "20s",
    values: cyValues,
    repeatCount: "1",
    fill: "freeze",
  });

  node.appendChild(cxAnimate);
  node.appendChild(cyAnimate);

  const text = create("text");
  text.textContent = id;
  setAttr(text, {
    id,
    x: ox + (width / 2) + 50 - 5,
    y: oy + (height / 2) + 50 + 6,
    fill: textColor,
  });

  /*
  const textAnimateMotion = create("animateMotion");

  setAttr(textAnimateMotion, {
    path: path.map((p, i) => {
      if (i === 0) return `M${0},${0}`;
      return `L${p.dx},${p.dy}`;
    }).join(' '),
    begin: "0s",
    dur: "20s",
    repeatCount: "1",
    fill: "freeze",
    calcMode: "linear",
  });

  text.appendChild(textAnimateMotion);
  */

  const xAnimate = create("animate");

  const xValues = path.map((e, i) => {
    return ox + e.dx + (width / 2) + 50 - 5;
  }).join(';');

  setAttr(xAnimate, {
    attributeName: "x",
    begin: "DOMNodeInsertedIntoDocument",
    dur: "20s",
    values: xValues,
    repeatCount: "1",
    fill: "freeze",
  });

  const yAnimate = create("animate");

  const yValues = path.map((e, i) => {
    return oy + e.dy + (height / 2) + 50 + 6;
  }).join(';');

  setAttr(yAnimate, {
    attributeName: "y",
    begin: "DOMNodeInsertedIntoDocument",
    dur: "20s",
    values: yValues,
    repeatCount: "1",
    fill: "freeze",
  });

  text.appendChild(xAnimate);
  text.appendChild(yAnimate);

  parent.appendChild(node);
  parent.appendChild(text);
}

function find(arr, obj, key) {
  for(let i = 0; i < arr.length; i++) {
    if (arr[i][key] === obj[key]) {
      return { node: arr[i], index: i };
    }
  }
}

function createLink(parent, link, nodes) {
  const { source, target } = link;

  const { node: sourceNode } = find(nodes, { id: source }, 'id');
  const { node: targetNode } = find(nodes, { id: target }, 'id');

  const line = create("line");
  setAttr(line, {
    x1: sourceNode.ox + (width / 2) + 50,
    y1: sourceNode.oy + (height / 2) + 50,
    x2: targetNode.ox + (width / 2) + 50,
    y2: targetNode.oy + (height / 2) + 50,
    stroke: 'red',
    'stroke-width': 1,
  });

  const x1Values = sourceNode.path.map((e, i) => {
    return sourceNode.ox + e.dx + (width / 2) + 50;
  }).join(';');

  const y1Values = sourceNode.path.map((e, i) => {
    return sourceNode.oy + e.dy + (height / 2) + 50;
  }).join(';');

  const x1Animate = create("animate");
  setAttr(x1Animate, {
    attributeName: "x1",
    begin: "DOMNodeInsertedIntoDocument",
    dur: "20s",
    values: x1Values,
    repeatCount: "1",
    fill: "freeze",
  });

  const y1Animate = create("animate");
  setAttr(y1Animate, {
    attributeName: "y1",
    begin: "DOMNodeInsertedIntoDocument",
    dur: "20s",
    values: y1Values,
    repeatCount: "1",
    fill: "freeze",
  })

  line.appendChild(x1Animate);
  line.appendChild(y1Animate);

  const x2Values = targetNode.path.map((e, i) => {
    return targetNode.ox + e.dx + (width / 2) + 50;
  }).join(';');

  const y2Values = targetNode.path.map((e, i) => {
    return targetNode.oy + e.dy + (height / 2) + 50;
  }).join(';');

  const x2Animate = create("animate");
  setAttr(x2Animate, {
    attributeName: "x2",
    begin: "DOMNodeInsertedIntoDocument",
    dur: "20s",
    values: x2Values,
    repeatCount: "1",
    fill: "freeze",
  });

  const y2Animate = create("animate");
  setAttr(y2Animate, {
    attributeName: "y2",
    begin: "DOMNodeInsertedIntoDocument",
    dur: "20s",
    values: y2Values,
    repeatCount: "1",
    fill: "freeze",
  });

  line.appendChild(x2Animate);
  line.appendChild(y2Animate);

  parent.appendChild(line);
}

function initNodes(nodes) {
  nodes.forEach((node, i) => {
    // 随机节点位置
    let randCx = Math.floor(Math.random() * width);
    let randCy = Math.floor(Math.random() * height);
    const r = 12;

    nodes[i] = Object.assign({}, node, {
      // 起始位置
      ox: randCx - (width / 2),
      oy: randCy - (height / 2),
      // 当前位置
      cx: randCx - (width / 2),
      cy: randCy - (height / 2),
      r,
      // x轴上速度初始化
      dispX: 0,
      // y轴上速度初始化
      dispY: 0,
      // 相对位移储存
      path: [
        { dx: 0,
          dy: 0 },
      ],
    });
  });
}

// 计算排斥力
function repulsion(x, k, cr) {
  if(isNaN(k * k / x)) console.warn('repulsion error');
  return k * k / x * cr;
}

// 判断排斥力的方向， 返回-1为负方向的力，1为正方向的力
function calculateRepulsionDisp(curNode, nextNode, k, cr) {
  const { cx: curX, cy: curY } = curNode;
  const { cx: nextX, cy: nextY } = nextNode;

  const x = nextX - curX;
  const y = nextY - curY;

  const l = Math.sqrt(x * x + y * y);

  return l === 0 ? {
    xDisp: 0,
    yDisp: 0,
  } : {
    xDisp: repulsion(l, k, cr) * (x / l),
    yDisp: repulsion(l, k, cr) * (y / l),
  }
}

function calculateRepulsion(nodes, k, cr) {
  const l = nodes.length;
  for(let i = 0; i < l; i++) {
    for(let j = 0; j < l; j++) {
      if (i === j) continue;
      const { xDisp, yDisp } = calculateRepulsionDisp(nodes[i], nodes[j], k, cr);

      nodes[j] = Object.assign({}, nodes[j], {
        dispX: nodes[j].dispX + xDisp,
        dispY: nodes[j].dispY + yDisp,
      });
    }
  }
}

// 计算吸引力
function attraction(x, k, ca, weight = 0) {
  if(isNaN(x * x / k)) console.warn('attraction error');
  return x * x / k * (ca + weight);
}

function calculateAttractionDisp(sourceNode, targetNode, k, ca) {
  const { cx: sourceX, cy: sourceY } = sourceNode;
  const { cx: targetX, cy: targetY } = targetNode;

  const x = sourceX - targetX;
  const y = sourceY - targetY;

  const l = Math.sqrt(x * x + y * y);

  return l === 0 ? {
    sourceXDisp: 0,
    sourceYDisp: 0,
    targetXDisp: 0,
    targetYDisp: 0,
  } : {
    sourceXDisp: (-1) * attraction(l, k, ca) * (x / l),
    sourceYDisp: (-1) * attraction(l, k, ca) * (y / l),
    targetXDisp: attraction(l, k, ca) * (x / l),
    targetYDisp: attraction(l, k, ca) * (y / l),
  }
}

function calculateAttraction(nodes, links, k, ca) {
  links.forEach((link, i) => {
    const { source, target } = link;
    let { node: sourceNode, index: sourceIndex } = find(nodes, { id: source }, 'id');
    let { node: targetNode, index: targetIndex } = find(nodes, { id: target }, 'id');

    const { sourceXDisp, sourceYDisp,
     targetXDisp, targetYDisp } = calculateAttractionDisp(sourceNode, targetNode, k, ca);

    nodes[sourceIndex] = Object.assign({}, sourceNode, {
      dispX: sourceNode.dispX + sourceXDisp,
      dispY: sourceNode.dispY + sourceYDisp,
    });

    nodes[targetIndex] = Object.assign({}, targetNode, {
      dispX: targetNode.dispX + targetXDisp,
      dispY: targetNode.dispY + targetYDisp,
    });
  });
}

function calculatePos(nodes, temperature) {
  nodes.forEach((node, i) => {
    const posX = node.dispX;
    const posY = node.dispY;

    const dis = Math.sqrt(posX * posX + posY * posY);

    let finalX = node.cx;
    let finalY = node.cy;
    if (dis !== 0) {
      finalX = finalX + (posX / dis) * Math.min(temperature, dis);
      finalY = finalY + (posY / dis) * Math.min(temperature, dis);
    }

    const cx = Math.min(width / 2, Math.max(finalX, -(width / 2)));
    const cy = Math.min(height / 2, Math.max(finalY, -(height / 2)));

    // 相对于初始点路径记录
    nodes[i].path.push({
      dx: cx - node.ox,
      dy: cy - node.oy,
    })

    nodes[i] = Object.assign({}, nodes[i], {
      cx,
      cy,
      dispX: 0,
      dispY: 0,
    });
  });
}

function cool(t, ce) {
  if (t > ce)
    return t - ce;
  else if (t > 0)
    return t - 0.01;
  else
    return 0;
}

function solve(svg, data) {
  const { nodes, links } = data;

  // 初始化节点
  initNodes(nodes);

  const k = Math.sqrt(area / nodes.length);

  // 引力系数
  const inputCa = parseFloat($('#ca').val());
  const ca = inputCa ? inputCa : 4;
  console.info(`本次引力系数为${ca}`);

  // 斥力系数
  const inputCr = parseFloat($('#cr').val());
  const cr = inputCr ? inputCr : 1;
  console.info(`本次斥力系数为${cr}`);

  // 迭代次数
  const inputCount = parseInt($('#count').val());
  let count = Number.isInteger(inputCount) ? inputCount : 100;
  console.info(`本次迭代次数为${count}`);

  // 初始温度
  const inputTemperature = parseInt($('#temperature').val());
  let temperature = Number.isInteger(inputTemperature) ? inputTemperature : 100;
  console.info(`本次初始温度为${temperature}`);

  // 阈值温度
  const inputTemperatureMin = parseInt($('#temperatureMin').val());
  let temperatureMin = Number.isInteger(inputTemperatureMin) ? inputTemperatureMin : 2;
  console.info(`本次阈值温度为${temperatureMin}`);

  while(count--) {
    // 计算排斥力
    calculateRepulsion(nodes, k, cr);

    // 计算吸引力
    calculateAttraction(nodes, links, k, ca);

    // 计算位置
    calculatePos(nodes, temperature);

    // 模拟退火
    temperature = cool(temperature, 2);
  }

  // 最终结果，渲染点和线
  renderLink(svg, nodes, links);
  renderNodes(svg, nodes);
}

const data = {
  "nodes": [
    { "id": "0", "group": 0 },
    { "id": "1", "group": 1 },
    { "id": "2", "group": 2 },
    { "id": "3", "group": 3 },
    { "id": "4", "group": 4 },
    { "id": "5", "group": 5 },
    { "id": "6", "group": 6 },
    { "id": "7", "group": 7 },
    { "id": "8", "group": 8 },
    { "id": "9", "group": 9 },
  ],
  "links": [
    { "source": "0", "target": "3", "value": 1 },
    { "source": "0", "target": "1", "value": 1 },
    { "source": "0", "target": "8", "value": 1 },
    { "source": "1", "target": "2", "value": 1 },
    { "source": "1", "target": "9", "value": 1 },
    { "source": "2", "target": "3", "value": 1 },
    { "source": "3", "target": "4", "value": 1 },
    { "source": "2", "target": "7", "value": 1 },
    { "source": "8", "target": "9", "value": 1 },
    { "source": "6", "target": "9", "value": 1 },
    { "source": "6", "target": "7", "value": 1 },
    { "source": "6", "target": "5", "value": 1 },
    { "source": "4", "target": "5", "value": 1 },
    { "source": "7", "target": "4", "value": 1 },
    { "source": "5", "target": "8", "value": 1 },
  ],
};

solve($('svg')[0], data);

$("#reRender").click(() => {
  $('svg').empty();
  solve($('svg')[0], data);
});
