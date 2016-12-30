'use strict';

// 绘制画布比真实画布，长高都减少100像素
var width = 900;
var height = 700;
var area = width * height;

// SVG操作封装
function create(type) {
  return document.createElementNS('http://www.w3.org/2000/svg', type);
}

function setAttr(target, attr) {
  return Object.keys(attr).forEach(function (item) {
    target.setAttribute(item, attr[item]);
  });
}

function renderNodes(parent, nodes, lastTime) {
  nodes.forEach(function (node, i) {
    createNode(parent, {
      ox: node.ox,
      oy: node.oy,
      cx: node.cx,
      cy: node.cy,
      r: 12,
      id: node.id,
      group: node.group,
      path: node.path
    }, lastTime);
  });
}

function renderLink(parent, nodes, links, lastTime) {
  links.forEach(function (link, i) {
    createLink(parent, link, nodes, lastTime);
  });
}

function createNode(parent, _ref, lastTime) {
  var ox = _ref.ox;
  var oy = _ref.oy;
  var cx = _ref.cx;
  var cy = _ref.cy;
  var r = _ref.r;
  var id = _ref.id;
  var group = _ref.group;
  var path = _ref.path;
  var queue = _ref.queue;

  var color = undefined,
      textColor = undefined;

  switch (group) {
    case 0:
      {
        color = 'black';
        textColor = 'white';
        break;
      }
    case 1:
      {
        color = 'yellow';
        textColor = 'black';
        break;
      };
    case 2:
      {
        color = 'red';
        textColor = 'white';
        break;
      }
    case 3:
      {
        color = 'green';
        textColor = 'white';
        break;
      }
    case 4:
      {
        color = 'blue';
        textColor = 'white';
        break;
      }
    case 5:
      {
        color = 'hotPink';
        textColor = 'white';
        break;
      };
    case 6:
      {
        color = 'SandyBrown';
        textColor = 'white';
        break;
      }
    case 7:
      {
        color = 'Wheat';
        textColor = 'black';
        break;
      }
    case 8:
      {
        color = 'Purple';
        textColor = 'white';
        break;
      }
    case 9:
      {
        color = 'PaleTurquoise';
        textColor = 'black';
        break;
      }
    case 10:
      {
        color = 'black';
        textColor = 'white';
      }
  }

  if (isNaN(cx)) console.warn({ cx: cx, cy: cy, r: r, id: id, group: group });
  if (isNaN(cy)) console.warn({ cx: cx, cy: cy, r: r, id: id, group: group });

  var node = create("circle");
  setAttr(node, {
    id: id,
    cx: ox + width / 2 + 50,
    cy: oy + height / 2 + 50,
    r: r,
    stroke: 'black',
    'stroke-width': 2,
    fill: color
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

  var cxAnimate = create("animate");

  var cxValues = path.map(function (e, i) {
    return ox + e.dx + width / 2 + 50;
  }).join(';');

  setAttr(cxAnimate, {
    attributeName: "cx",
    begin: "render.DOMNodeInsertedIntoDocument",
    dur: lastTime + 's',
    values: cxValues,
    repeatCount: "1",
    fill: "freeze"
  });

  var cyAnimate = create("animate");

  var cyValues = path.map(function (e, i) {
    return oy + e.dy + height / 2 + 50;
  }).join(';');

  setAttr(cyAnimate, {
    attributeName: "cy",
    begin: "render.DOMNodeInsertedIntoDocument",
    dur: lastTime + 's',
    values: cyValues,
    repeatCount: "1",
    fill: "freeze"
  });

  node.appendChild(cxAnimate);
  node.appendChild(cyAnimate);

  var text = create("text");
  text.textContent = id;
  setAttr(text, {
    id: 't' + id,
    x: ox + width / 2 + 50 - 5,
    y: oy + height / 2 + 50 + 6,
    fill: textColor
  });

  if (queue) {
    text.addEventListener("mouseover", function (e) {
      queue.forEach(function (item, i) {
        $('#' + item)[0].setAttribute('opacity', 0.5);
      });
    });
    text.addEventListener("mouseout", function (e) {
      queue.forEach(function (item, i) {
        $('#' + item)[0].setAttribute('opacity', 1);
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

  var xAnimate = create("animate");

  var xValues = path.map(function (e, i) {
    return ox + e.dx + width / 2 + 50 - 5;
  }).join(';');

  setAttr(xAnimate, {
    attributeName: "x",
    begin: "render.DOMNodeInsertedIntoDocument",
    dur: lastTime + 's',
    values: xValues,
    repeatCount: "1",
    fill: "freeze"
  });

  var yAnimate = create("animate");

  var yValues = path.map(function (e, i) {
    return oy + e.dy + height / 2 + 50 + 6;
  }).join(';');

  setAttr(yAnimate, {
    attributeName: "y",
    begin: "render.DOMNodeInsertedIntoDocument",
    dur: lastTime + 's',
    values: yValues,
    repeatCount: "1",
    fill: "freeze"
  });

  text.appendChild(xAnimate);
  text.appendChild(yAnimate);

  parent.appendChild(node);
  parent.appendChild(text);
}

function find(arr, obj, key) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][key] === obj[key]) {
      return { node: arr[i], index: i };
    }
  }
}

function createLink(parent, link, nodes, lastTime) {
  var source = link.source;
  var target = link.target;

  var _find = find(nodes, { id: source }, 'id');

  var sourceNode = _find.node;

  var _find2 = find(nodes, { id: target }, 'id');

  var targetNode = _find2.node;

  var line = create("line");
  setAttr(line, {
    x1: sourceNode.ox + width / 2 + 50,
    y1: sourceNode.oy + height / 2 + 50,
    x2: targetNode.ox + width / 2 + 50,
    y2: targetNode.oy + height / 2 + 50,
    stroke: 'red',
    'stroke-width': 1
  });

  var x1Values = sourceNode.path.map(function (e, i) {
    return sourceNode.ox + e.dx + width / 2 + 50;
  }).join(';');

  var y1Values = sourceNode.path.map(function (e, i) {
    return sourceNode.oy + e.dy + height / 2 + 50;
  }).join(';');

  var x1Animate = create("animate");
  setAttr(x1Animate, {
    attributeName: "x1",
    begin: "render.DOMNodeInsertedIntoDocument",
    dur: lastTime + 's',
    values: x1Values,
    repeatCount: "1",
    fill: "freeze"
  });

  var y1Animate = create("animate");
  setAttr(y1Animate, {
    attributeName: "y1",
    begin: "render.DOMNodeInsertedIntoDocument",
    dur: lastTime + 's',
    values: y1Values,
    repeatCount: "1",
    fill: "freeze"
  });

  line.appendChild(x1Animate);
  line.appendChild(y1Animate);

  var x2Values = targetNode.path.map(function (e, i) {
    return targetNode.ox + e.dx + width / 2 + 50;
  }).join(';');

  var y2Values = targetNode.path.map(function (e, i) {
    return targetNode.oy + e.dy + height / 2 + 50;
  }).join(';');

  var x2Animate = create("animate");
  setAttr(x2Animate, {
    attributeName: "x2",
    begin: "render.DOMNodeInsertedIntoDocument",
    dur: lastTime + 's',
    values: x2Values,
    repeatCount: "1",
    fill: "freeze"
  });

  var y2Animate = create("animate");
  setAttr(y2Animate, {
    attributeName: "y2",
    begin: "render.DOMNodeInsertedIntoDocument",
    dur: lastTime + 's',
    values: y2Values,
    repeatCount: "1",
    fill: "freeze"
  });

  line.appendChild(x2Animate);
  line.appendChild(y2Animate);

  parent.appendChild(line);
}

function initNodes(nodes, links) {
  var degreeCount = {};
  links.forEach(function (link, i) {
    var source = link.source;
    var target = link.target;

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

  nodes.forEach(function (node, i) {
    // 随机节点位置
    var randCx = Math.floor(Math.random() * width);
    var randCy = Math.floor(Math.random() * height);
    var r = 12;

    nodes[i] = Object.assign({}, node, {
      // 起始位置
      ox: randCx - width / 2,
      oy: randCy - height / 2,
      // 当前位置
      cx: randCx - width / 2,
      cy: randCy - height / 2,
      r: r,
      // x轴上速度初始化
      dispX: 0,
      // y轴上速度初始化
      dispY: 0,
      // 相对位移储存
      path: [{ dx: 0,
        dy: 0 }],
      // 从属于哪个社团中心
      clubNodeNumber: -1,
      degree: degreeCount[node.id],
      degreeCenter: degreeCount[node.id] / (nodes.length - 1)
    });
  });
}

// 计算排斥力
function repulsion(x, k, cr) {
  if (isNaN(k * k / x)) console.warn('repulsion error');
  return k * k / x * cr;
}

// 判断排斥力的方向， 返回-1为负方向的力，1为正方向的力
function calculateRepulsionDisp(curNode, nextNode, k, cr) {
  var curX = curNode.cx;
  var curY = curNode.cy;
  var nextX = nextNode.cx;
  var nextY = nextNode.cy;

  var x = nextX - curX;
  var y = nextY - curY;

  var l = Math.sqrt(x * x + y * y);

  return l === 0 ? {
    xDisp: 0,
    yDisp: 0
  } : {
    xDisp: repulsion(l, k, cr) * (x / l),
    yDisp: repulsion(l, k, cr) * (y / l)
  };
}

function calculateRepulsion(nodes, k, cr) {
  var l = nodes.length;
  for (var i = 0; i < l; i++) {
    for (var j = 0; j < l; j++) {
      if (i === j) continue;

      var _calculateRepulsionDi = calculateRepulsionDisp(nodes[i], nodes[j], k, cr);

      var xDisp = _calculateRepulsionDi.xDisp;
      var yDisp = _calculateRepulsionDi.yDisp;

      nodes[j] = Object.assign({}, nodes[j], {
        dispX: nodes[j].dispX + xDisp,
        dispY: nodes[j].dispY + yDisp
      });
    }
  }
}

// 计算吸引力
function attraction(x, k, ca) {
  var weight = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  if (isNaN(x * x / k)) console.warn('attraction error');
  return x * x / k * (ca + weight);
}

function calculateAttractionDisp(sourceNode, targetNode, k, ca) {
  var sourceX = sourceNode.cx;
  var sourceY = sourceNode.cy;
  var targetX = targetNode.cx;
  var targetY = targetNode.cy;

  var x = sourceX - targetX;
  var y = sourceY - targetY;

  var l = Math.sqrt(x * x + y * y);

  return l === 0 ? {
    sourceXDisp: 0,
    sourceYDisp: 0,
    targetXDisp: 0,
    targetYDisp: 0
  } : {
    sourceXDisp: -1 * attraction(l, k, ca) * (x / l),
    sourceYDisp: -1 * attraction(l, k, ca) * (y / l),
    targetXDisp: attraction(l, k, ca) * (x / l),
    targetYDisp: attraction(l, k, ca) * (y / l)
  };
}

function calculateAttraction(nodes, links, k, ca) {
  links.forEach(function (link, i) {
    var source = link.source;
    var target = link.target;

    var _find3 = find(nodes, { id: source }, 'id');

    var sourceNode = _find3.node;
    var sourceIndex = _find3.index;

    var _find4 = find(nodes, { id: target }, 'id');

    var targetNode = _find4.node;
    var targetIndex = _find4.index;

    var _calculateAttractionD = calculateAttractionDisp(sourceNode, targetNode, k, ca);

    var sourceXDisp = _calculateAttractionD.sourceXDisp;
    var sourceYDisp = _calculateAttractionD.sourceYDisp;
    var targetXDisp = _calculateAttractionD.targetXDisp;
    var targetYDisp = _calculateAttractionD.targetYDisp;

    nodes[sourceIndex] = Object.assign({}, sourceNode, {
      dispX: sourceNode.dispX + sourceXDisp,
      dispY: sourceNode.dispY + sourceYDisp
    });

    nodes[targetIndex] = Object.assign({}, targetNode, {
      dispX: targetNode.dispX + targetXDisp,
      dispY: targetNode.dispY + targetYDisp
    });
  });
}

function calculatePos(nodes, temperature) {
  nodes.forEach(function (node, i) {
    var posX = node.dispX;
    var posY = node.dispY;

    var dis = Math.sqrt(posX * posX + posY * posY);

    var finalX = node.cx;
    var finalY = node.cy;
    if (dis !== 0) {
      finalX = finalX + posX / dis * Math.min(temperature, dis);
      finalY = finalY + posY / dis * Math.min(temperature, dis);
    }

    var cx = Math.min(width / 2, Math.max(finalX, -(width / 2)));
    var cy = Math.min(height / 2, Math.max(finalY, -(height / 2)));

    // 相对于初始点路径记录
    nodes[i].path.push({
      dx: cx - node.ox,
      dy: cy - node.oy
    });

    nodes[i] = Object.assign({}, nodes[i], {
      cx: cx,
      cy: cy,
      dispX: 0,
      dispY: 0
    });
  });
}

function cool(t, ce) {
  if (t > ce) return t - ce;else if (t > 0) return t - 0.01;else return 0;
}

function randomClubNodes(nodes, k) {
  var selectedNodes = [];
  var l = nodes.length;

  var count = k;
  while (count--) {
    var id = Math.floor(Math.random() * 100) % l;

    var flag = 1;
    for (var i = 0; i < selectedNodes.length; i++) {
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
          dy: 0
        }],
        count: 0,
        degreeCount: 0
      });
    }
  }

  return selectedNodes;
}

function updateClubNodes(nodes, clubNodes, gc) {
  if (nodes[0].clubNodeNumber === -1) return;

  for (var i = 0; i < clubNodes.length; i++) {
    clubNodes[i] = {
      count: 0,
      cx: 0,
      cy: 0,
      ox: clubNodes[i].ox,
      oy: clubNodes[i].oy,
      queue: [],
      path: clubNodes[i].path,
      degreeCount: 0
    };
  }

  nodes.forEach(function (node) {
    clubNodes[node.clubNodeNumber].count++;
  });

  nodes.forEach(function (node) {
    var _clubNodes$node$clubN = clubNodes[node.clubNodeNumber];
    var cx = _clubNodes$node$clubN.cx;
    var cy = _clubNodes$node$clubN.cy;
    var count = _clubNodes$node$clubN.count;

    clubNodes[node.clubNodeNumber].cx = cx + node.cx / count;
    clubNodes[node.clubNodeNumber].cy = cy + node.cy / count;
    clubNodes[node.clubNodeNumber].queue.push(node.id);
    clubNodes[node.clubNodeNumber].degreeCount += node.degreeCenter;
  });

  // 社团中心的斥力
  var records = [];
  for (var _i = 0; _i < clubNodes.length; _i++) {
    records[_i] = {
      cx: 0,
      cy: 0
    };
    for (var j = 0; j < clubNodes.length; j++) {
      if (_i === j) continue;
      var x = clubNodes[_i].cx - clubNodes[j].cx;
      var y = clubNodes[_i].cy - clubNodes[j].cy;
      var dis = Math.sqrt(x * x + y * y);

      if (dis !== 0) {
        var f = gc * clubNodes[_i].degreeCount * clubNodes[j].degreeCount / dis;
        records[_i].cx = records[_i].cx + f * (x / dis);
        records[_i].cy = records[_i].cy + f * (y / dis);
      }
    }
  }

  clubNodes.forEach(function (node, i) {
    clubNodes[i].cx = clubNodes[i].cx + records[i].cx;
    clubNodes[i].cy = clubNodes[i].cy + records[i].cy;
    clubNodes[i].path.push({
      dx: node.cx - node.ox,
      dy: node.cy - node.oy
    });
  });
}

function calculateClubForce(node, clubNode, g) {
  var x = clubNode.cx - node.cx;
  var y = clubNode.cy - node.cy;

  var dis = Math.sqrt(x * x + y * y);

  // clubNode与node重合
  if (dis === 0) return {
    dis: 0,
    dispX: 0,
    dispY: 0
  };

  // 社团引力
  var f = g * node.degreeCenter * dis;

  return {
    dis: dis,
    dispX: f * (x / dis),
    dispY: f * (y / dis)
  };
}

function calculateClubAttraction(nodes, clubNodes, g) {
  var resultForce = undefined;

  nodes.forEach(function (node, i) {
    var clubNodeNumber = undefined;

    resultForce = {
      dis: Number.MAX_VALUE,
      dispX: 0,
      dispY: 0
    };

    clubNodes.forEach(function (clubNode, j) {
      var res = calculateClubForce(node, clubNode, g);

      if (res.dis < resultForce.dis) {
        resultForce = {
          dis: res.dis,
          dispX: res.dispX,
          dispY: res.dispY
        };
        clubNodeNumber = j;
      }
    });

    // console.log(clubNodes, clubNodeNumber);

    nodes[i] = Object.assign({}, node, {
      clubNodeNumber: clubNodeNumber,
      dispX: node.dispX + resultForce.dispX,
      dispY: node.dispY + resultForce.dispY
    });
  });
}

function renderClubNodes(parent, clubNodes, lastTime) {
  clubNodes.forEach(function (node, i) {
    createNode(parent, {
      ox: node.ox,
      oy: node.oy,
      cx: node.cx,
      cy: node.cy,
      r: 14,
      id: 'c' + i,
      group: 10,
      path: node.path,
      queue: node.queue
    }, lastTime);
  });
}

function checkClub(nodes, links) {
  var linksMap = {};
  links.forEach(function (link, i) {
    var source = link.source;
    var target = link.target;

    var key = source + '-' + target;
    linksMap[key] = 1;
  });

  var l = nodes.length;
  var m = links.length;

  var result = 0;
  for (var i = 0; i < l; i++) {
    for (var j = 0; j < l; j++) {
      if (i === j) continue;
      var sNode = nodes[i];
      var tNode = nodes[j];

      var ans = ((linksMap[sNode.id + '-' + tNode.id] === 1 || linksMap[tNode.id + '-' + sNode.id] === 1 ? 1 : 0) - sNode.degree * tNode.degree / (2 * m)) * (sNode.clubNodeNumber === tNode.clubNodeNumber ? 1 : 0);

      result += ans;
    }
  }

  return result / (2 * m);
}

function solve(svg, data) {
  var testG = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.81;
  var testGC = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 4;
  var record = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  var nodes = data.nodes;
  var links = data.links;

  // 初始化节点

  initNodes(nodes, links);

  var k = Math.sqrt(area / nodes.length);

  // 引力系数
  var inputCa = parseFloat($('#ca').val());
  var ca = inputCa ? inputCa : 8.5;
  console.info('本次引力系数为' + ca);

  // 斥力系数
  var inputCr = parseFloat($('#cr').val());
  var cr = inputCr ? inputCr : 1;
  console.info('本次斥力系数为' + cr);

  // 迭代次数
  var inputCount = parseInt($('#count').val());
  var count = Number.isInteger(inputCount) ? inputCount : 200;
  console.info('本次迭代次数为' + count);

  // 初始温度
  var inputTemperature = parseInt($('#temperature').val());
  var temperature = Number.isInteger(inputTemperature) ? inputTemperature : 100;
  console.info('本次初始温度为' + temperature);

  // 阈值温度
  var inputTemperatureMin = parseInt($('#temperatureMin').val());
  var temperatureMin = Number.isInteger(inputTemperatureMin) ? inputTemperatureMin : 2;
  console.info('本次阈值温度为' + temperatureMin);

  // 随机社团中心
  var inputClubNumber = parseInt($('#clubNumber').val());
  var clubNumber = Number.isInteger(inputClubNumber) ? inputClubNumber : 4;
  console.info('本次社团中心个数为' + clubNumber);

  // 持续时间
  var inputLastTime = parseInt($('#lastTime').val());
  var lastTime = Number.isInteger(inputLastTime) ? inputLastTime : 20;
  console.info('本次动画持续时间为' + lastTime);

  // 社团引力系数
  var inputG = parseFloat($('#g').val());
  var g = inputG ? inputG : testG;
  console.info('本次社团引力系数为' + g);

  // 社团中心斥力系数
  var inputGc = parseFloat($('#gc').val());
  var gc = inputGc ? inputGc : testGC;
  console.info('本次社团中心斥力系数为' + gc);

  // 是否使用社团引力
  var isUseClub = $('#isUseClub')[0].checked;

  var clubNodes = randomClubNodes(nodes, clubNumber);

  while (count--) {
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
    var res = checkClub(nodes, links);
    console.info('当前模块度:', res);
    $('.modelValue').text(res);

    record.push({
      testG: testG,
      testGC: testGC,
      res: res
    });
  }

  renderLink(svg, nodes, links, lastTime);
  renderNodes(svg, nodes, lastTime);

  if (isUseClub) {
    renderClubNodes(svg, clubNodes, lastTime);
  }

  setTimeout(function () {
    var renderStartNode = create("text");
    setAttr(renderStartNode, {
      id: 'render'
    });
    svg.appendChild(renderStartNode);
  }, 0);
}

function getJSON(jsonName) {
  console.info(jsonName);
  $.getJSON('./' + jsonName + '.json', function (data) {
    $('svg').empty();
    solve($('svg')[0], data);
  });
}

getJSON('data2');

$("#reRender").click(function () {
  var jsonName = $("#select").val();
  getJSON(jsonName);
});
