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

function renderNodes(parent, nodes, lastTime) {
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
      realGroup: node.realGroup,
    }, lastTime);
  });
}

function renderLink(parent, nodes, links, lastTime) {
  links.forEach((link, i) => {
    createLink(parent, link, nodes, lastTime);
  });
}

function createNode(parent, { ox, oy, cx, cy, r, id, group, path, queue, realGroup }, lastTime) {
  let color, textColor;

  switch (realGroup + 1) {
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
    default: {
      color = 'black';
      textColor = 'white';
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
    begin: "render.DOMNodeInsertedIntoDocument",
    dur: `${lastTime}s`,
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
    begin: "render.DOMNodeInsertedIntoDocument",
    dur: `${lastTime}s`,
    values: cyValues,
    repeatCount: "1",
    fill: "freeze",
  });

  node.appendChild(cxAnimate);
  node.appendChild(cyAnimate);

  const text = create("text");
  text.textContent = id;
  setAttr(text, {
    id: `t${id}`,
    x: ox + (width / 2) + 50 - 5,
    y: oy + (height / 2) + 50 + 6,
    fill: textColor,
  });

  if (queue) {
    text.addEventListener("mouseover", (e) => {
      queue.forEach((item, i) => {
        $(`#${item}`)[0].setAttribute('opacity', 0.5);
      });
    });
    text.addEventListener("mouseout", (e) => {
      queue.forEach((item, i) => {
        $(`#${item}`)[0].setAttribute('opacity', 1);
      });
    });
  }

  /*
  const textAnimateMotion = create("animateMotion");

  setAttr(textAnimateMotion, {
    path: path.map((p, i) => {
      if (i === 0) return `M${0},${0}`;
      return `L${p.dx},${p.dy}`;
    }).join(' '),
    begin: "0s",
    dur: `${lastTime}s`,
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
    begin: "render.DOMNodeInsertedIntoDocument",
    dur: `${lastTime}s`,
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
    begin: "render.DOMNodeInsertedIntoDocument",
    dur: `${lastTime}s`,
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

function createLink(parent, link, nodes, lastTime) {
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
    begin: "render.DOMNodeInsertedIntoDocument",
    dur: `${lastTime}s`,
    values: x1Values,
    repeatCount: "1",
    fill: "freeze",
  });

  const y1Animate = create("animate");
  setAttr(y1Animate, {
    attributeName: "y1",
    begin: "render.DOMNodeInsertedIntoDocument",
    dur: `${lastTime}s`,
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
    begin: "render.DOMNodeInsertedIntoDocument",
    dur: `${lastTime}s`,
    values: x2Values,
    repeatCount: "1",
    fill: "freeze",
  });

  const y2Animate = create("animate");
  setAttr(y2Animate, {
    attributeName: "y2",
    begin: "render.DOMNodeInsertedIntoDocument",
    dur: `${lastTime}s`,
    values: y2Values,
    repeatCount: "1",
    fill: "freeze",
  });

  line.appendChild(x2Animate);
  line.appendChild(y2Animate);

  parent.appendChild(line);
}

function initNodes(nodes, links) {
  let degreeCount = {};
  links.forEach((link, i) => {
    const { source, target } = link;

    if (degreeCount[source]) {
      degreeCount[source] += 1;
    } else {
      degreeCount[source] = 1;
    }

    if (degreeCount[target]) {
      degreeCount[target] += 1;
    } else {
      degreeCount[target] = 1;
    }
  });

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
      // 从属于哪个社团中心
      clubNodeNumber: -1,
      degree: degreeCount[node.id],
      degreeCenter: degreeCount[node.id] / (nodes.length - 1),
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


function randomClubNodes(nodes, k) {
  const selectedNodes = [];
  const l = nodes.length;

  let count = k;
  while(count--) {
    const id = Math.floor(Math.random() * 100) % l;

    let flag = 1;
    for (let i = 0; i < selectedNodes.length; i++) {
      if (selectedNodes[i].id === nodes[i].id) {
        count++;
        flag = 0;
        break;
      }
    }

    if (flag) {
      selectedNodes.push({
        cx: nodes[id].cx,
        cy: nodes[id].cy,
        ox: nodes[id].cx,
        oy: nodes[id].cy,
        path: [{
          dx: 0,
          dy: 0,
        }],
        count: 0,
        degreeCount: 0,
      });
    }
  }

  return selectedNodes;
}

/*
function updateClubNodes(nodes, clubNodes, gc) {
  if (nodes[0].clubNodeNumber === -1) return;

  for(let i = 0; i < clubNodes.length; i++) {
    clubNodes[i] = {
      count: 0,
      cx: 0,
      cy: 0,
      ox: clubNodes[i].ox,
      oy: clubNodes[i].oy,
      queue: [],
      path: clubNodes[i].path,
      degreeCount: 0,
    }
  }

  nodes.forEach((node) => {
    clubNodes[node.clubNodeNumber].count++;
  });

  nodes.forEach((node) => {
    const { cx, cy, count } = clubNodes[node.clubNodeNumber];
    clubNodes[node.clubNodeNumber].cx = cx + (node.cx / count);
    clubNodes[node.clubNodeNumber].cy = cy + (node.cy / count);
    clubNodes[node.clubNodeNumber].queue.push(node.id);
    clubNodes[node.clubNodeNumber].degreeCount += node.degreeCenter;
  });

  // 社团中心的斥力
  const records = [];
  for(let i = 0; i < clubNodes.length; i++) {
    records[i] = {
      cx: 0,
      cy: 0,
    };
    for(let j = 0; j < clubNodes.length; j++) {
      if (i === j) continue;
      const x = clubNodes[i].cx - clubNodes[j].cx;
      const y = clubNodes[i].cy - clubNodes[j].cy;
      const dis = Math.sqrt(x * x + y * y);

      if (dis !== 0) {
        const f = gc * clubNodes[i].degreeCount * clubNodes[j].degreeCount / dis;
        records[i].cx = records[i].cx + f * (x / dis);
        records[i].cy = records[i].cy + f * (y / dis);
      }
    }
  }

  clubNodes.forEach((node, i) => {
    clubNodes[i].cx = clubNodes[i].cx + records[i].cx;
    clubNodes[i].cy = clubNodes[i].cy + records[i].cy;
    clubNodes[i].path.push({
      dx: node.cx - node.ox,
      dy: node.cy - node.oy,
    })
  });
}

function calculateClubForce(node, clubNode, g) {
  const x = clubNode.cx - node.cx;
  const y = clubNode.cy - node.cy;

  const dis = Math.sqrt(x * x + y * y);

  // clubNode与node重合
  if (dis === 0) return {
    dis: 0,
    dispX: 0,
    dispY: 0,
  }

  // 社团引力
  const f = g * node.degreeCenter * dis;

  return {
    dis,
    dispX: f * (x / dis),
    dispY: f * (y / dis),
  }
}

function calculateClubAttraction(nodes, clubNodes, g) {
  let resultForce;

  nodes.forEach((node, i) => {
    let clubNodeNumber;

    resultForce = {
      dis: Number.MAX_VALUE,
      dispX: 0,
      dispY: 0,
    };

    clubNodes.forEach((clubNode, j) => {
      const res = calculateClubForce(node, clubNode, g);

      if (res.dis < resultForce.dis) {
        resultForce = {
          dis: res.dis,
          dispX: res.dispX,
          dispY: res.dispY,
        }
        clubNodeNumber = j;
      }
    });

    // console.log(clubNodes, clubNodeNumber);

    nodes[i] = Object.assign({}, node, {
      clubNodeNumber,
      dispX: node.dispX + resultForce.dispX,
      dispY: node.dispY + resultForce.dispY,
    });
  });
}
*/

function updateClubNodes(nodes, clubNodes, gc) {
  if (nodes[0].clubNodeNumber === -1) return;

  for(let i = 0; i < clubNodes.length; i++) {
    clubNodes[i] = {
      count: 0,
      cx: 0,
      cy: 0,
      ox: clubNodes[i].ox,
      oy: clubNodes[i].oy,
      queue: [],
      path: clubNodes[i].path,
      degreeCount: 0,
    }
  }

  nodes.forEach((node) => {
    clubNodes[node.clubNodeNumber].count++;
  });

  nodes.forEach((node) => {
    const { cx, cy, count } = clubNodes[node.clubNodeNumber];
    clubNodes[node.clubNodeNumber].cx = cx + (node.cx / count);
    clubNodes[node.clubNodeNumber].cy = cy + (node.cy / count);
    clubNodes[node.clubNodeNumber].queue.push(node.id);
    clubNodes[node.clubNodeNumber].degreeCount += node.degreeCenter;
  });

  // 社团中心的斥力
  const records = [];
  for(let i = 0; i < clubNodes.length; i++) {
    records[i] = {
      cx: 0,
      cy: 0,
    };
    for(let j = 0; j < clubNodes.length; j++) {
      if (i === j) continue;
      const x = clubNodes[i].cx - clubNodes[j].cx;
      const y = clubNodes[i].cy - clubNodes[j].cy;
      const dis = Math.sqrt(x * x + y * y);

      if (dis !== 0) {
        const f = gc * clubNodes[i].degreeCount * clubNodes[j].degreeCount / dis;
        records[i].cx = records[i].cx + f * (x / dis);
        records[i].cy = records[i].cy + f * (y / dis);
      }
    }
  }

  clubNodes.forEach((node, i) => {
    clubNodes[i].cx = clubNodes[i].cx + records[i].cx;
    clubNodes[i].cy = clubNodes[i].cy + records[i].cy;
    clubNodes[i].path.push({
      dx: node.cx - node.ox,
      dy: node.cy - node.oy,
    })
  });
}

function calculateClubForce(node, clubNode, g) {
  const x = clubNode.cx - node.cx;
  const y = clubNode.cy - node.cy;

  const dis = Math.sqrt(x * x + y * y);

  // clubNode与node重合
  if (dis === 0) return {
    dis: 0,
    dispX: 0,
    dispY: 0,
  }

  // 社团引力
  const f = g * node.degreeCenter * dis;

  return {
    dis,
    dispX: f * (x / dis),
    dispY: f * (y / dis),
  }
}

function calculateClubAttraction(nodes, clubNodes, g) {
  let resultForce;

  nodes.forEach((node, i) => {
    const realGroup = Number(node.realGroup);

    let clubNodeNumber;

    const res = calculateClubForce(node, clubNodes[realGroup], g);

    resultForce = {
      dis: res.dis,
      dispX: res.dispX,
      dispY: res.dispY,
    };

    /*
    clubNodes.forEach((clubNode, j) => {
      const res = calculateClubForce(node, clubNode, g);

      if (res.dis < resultForce.dis) {
        resultForce = {
          dis: res.dis,
          dispX: res.dispX,
          dispY: res.dispY,
        }
        clubNodeNumber = j;
      }
    });
    */

    // console.log(clubNodes, clubNodeNumber);

    nodes[i] = Object.assign({}, node, {
      clubNodeNumber: realGroup,
      dispX: node.dispX + resultForce.dispX,
      dispY: node.dispY + resultForce.dispY,
    });
  });
}

function renderClubNodes(parent, clubNodes, lastTime) {
  clubNodes.forEach((node, i) => {
    createNode(parent, {
      ox: node.ox,
      oy: node.oy,
      cx: node.cx,
      cy: node.cy,
      r: 14,
      id: `c${i}`,
      group: 10,
      path: node.path,
      queue: node.queue,
      realGroup: 10,
    }, lastTime);
  });
}

function checkClub(nodes, links) {
  let linksMap = {};
  links.forEach((link, i) => {
    const { source, target } = link;
    const key = `${source}-${target}`;
    linksMap[key] = 1;
  });

  const l = nodes.length;
  const m = links.length;

  let result = 0;
  for (let i = 0; i < l; i++) {
    for (let j = 0; j < l; j++) {
      if (i === j) continue;
      const sNode = nodes[i];
      const tNode = nodes[j];

      const ans = ((linksMap[`${sNode.id}-${tNode.id}`] === 1
        || linksMap[`${tNode.id}-${sNode.id}`] === 1 ? 1 : 0) - (sNode.degree * tNode.degree / (2 * m)))
        * (sNode.clubNodeNumber === tNode.clubNodeNumber ? 1 : 0);

      result += ans;
    }
  }

  return (result / (2 * m));
}

function solve(svg, data, testG = 100, testGC = 60, record = []) {
  const { nodes, links } = data;

  // 初始化节点
  initNodes(nodes, links);

  const k = Math.sqrt(area / nodes.length);

  // 引力系数
  const inputCa = parseFloat($('#ca').val());
  const ca = inputCa ? inputCa : 6;
  console.info(`本次引力系数为${ca}`);

  // 斥力系数
  const inputCr = parseFloat($('#cr').val());
  const cr = inputCr ? inputCr : 1;
  console.info(`本次斥力系数为${cr}`);

  // 迭代次数
  const inputCount = parseInt($('#count').val());
  let count = Number.isInteger(inputCount) ? inputCount : 200;
  console.info(`本次迭代次数为${count}`);

  // 初始温度
  const inputTemperature = parseInt($('#temperature').val());
  let temperature = Number.isInteger(inputTemperature) ? inputTemperature : 100;
  console.info(`本次初始温度为${temperature}`);

  // 阈值温度
  const inputTemperatureMin = parseInt($('#temperatureMin').val());
  let temperatureMin = Number.isInteger(inputTemperatureMin) ? inputTemperatureMin : 2;
  console.info(`本次阈值温度为${temperatureMin}`);

  // 随机社团中心
  const inputClubNumber = parseInt($('#clubNumber').val());
  let clubNumber = Number.isInteger(inputClubNumber) ? inputClubNumber : 4;
  console.info(`本次社团中心个数为${clubNumber}`);

  // 持续时间
  const inputLastTime = parseInt($('#lastTime').val());
  let lastTime = Number.isInteger(inputLastTime) ? inputLastTime : 20;
  console.info(`本次动画持续时间为${lastTime}`);

  // 社团引力系数
  const inputG = parseFloat($('#g').val());
  const g = inputG ? inputG : testG;
  console.info(`本次社团引力系数为${g}`);

  // 社团中心斥力系数
  const inputGc = parseFloat($('#gc').val());
  const gc = inputGc ? inputGc : testGC;
  console.info(`本次社团中心斥力系数为${gc}`);

  // 是否使用社团引力
  // const isUseClub = $('#isUseClub')[0].checked;
  const isUseClub = false;

  let clubNodes = randomClubNodes(nodes, clubNumber);

  while(count--) {
    // 计算排斥力
    calculateRepulsion(nodes, k, cr);

    // 计算吸引力
    calculateAttraction(nodes, links, k, ca);

    // 社团引力
    // 更新社团中心
    if (isUseClub) {
      updateClubNodes(nodes, clubNodes, gc);
      calculateClubAttraction(nodes, clubNodes, g);
    }

    // 计算位置
    calculatePos(nodes, temperature);

    // 模拟退火
    temperature = cool(temperature, 2);
  }

  // 最终结果，渲染点和线
  console.info('节点最终状态:', nodes);


  if (isUseClub) {
    console.info('社团引力聚类结果:', clubNodes);
    const res = checkClub(nodes, links);
    console.info('当前模块度:', res);
    $('.modelValue').text(res);

    record.push({
      testG,
      testGC,
      res,
    });
  }

  renderLink(svg, nodes, links, lastTime);
  renderNodes(svg, nodes, lastTime);

  if (isUseClub) {
    renderClubNodes(svg, clubNodes, lastTime);
  }

  setTimeout(() => {
    const renderStartNode = create("text");
    setAttr(renderStartNode, {
      id: 'render',
    });
    svg.appendChild(renderStartNode);
  }, 0);
}

function getJSON(jsonName) {
  console.info(jsonName);
  $.getJSON(`./${jsonName}.json`, (data) => {
    $('svg').empty();
    solve($('svg')[0], data);
  });
}

getJSON('data8');

$("#reRender").click(() => {
  const jsonName = $("#select").val();
  getJSON(jsonName);
});


