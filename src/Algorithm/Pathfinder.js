const dx = [-1, 0, 1, 0];
const dy = [0, 1, 0, -1];

const outRange = (grid, row, col) => {
    return row < 0 || row === grid.length || 
            col < 0 || col === grid[0].length;
}

// BFS - Breath-First Search
const bfs = (grid, startX, startY) => {
    const visitOrder = [], queue = [];
    queue.push([startX, startY]); visitOrder.push(grid[startX][startY]);
    grid[startX][startY].isVisited = true;
    while(queue.length){
        const a = queue.shift();
        const x = a[0], y = a[1];

        for(let i = 0; i < 4; i++){
            const nextX = x + dx[i], nextY = y + dy[i];

            if(outRange(grid, nextX, nextY)) continue;
            if(grid[nextX][nextY].isWall) continue;            
            if(grid[nextX][nextY].isVisited) continue;

            grid[nextX][nextY].isVisited = true;
            visitOrder.push(grid[nextX][nextY]);
            grid[nextX][nextY].previousNode = grid[x][y];

            if(grid[nextX][nextY].isFinish) return visitOrder;
            queue.push([nextX, nextY]);
        }
    }
    return visitOrder;
}

// DFS - Depth-First Search
const dfs = (grid, startX, startY) => {
    const visitOrder = [], stack = [];
    stack.push([startX, startY]);
    while(stack.length){
        const a = stack.pop();
        const x = a[0], y = a[1];

        if(grid[x][y].isVisited) continue;
        grid[x][y].isVisited = true;
        visitOrder.push(grid[x][y]);

        if(grid[x][y].isFinish) return visitOrder;
        for(let i = 3; i >= 0; i--){
            const nextX = x + dx[i];
            const nextY = y + dy[i];

            if(outRange(grid, nextX, nextY)) continue;
            if(grid[nextX][nextY].isVisited) continue;
            if(grid[nextX][nextY].isWall) continue; 

            grid[nextX][nextY].previousNode = grid[x][y];
            stack.push([nextX, nextY]);
        }
    }
    return visitOrder;
}

// Dijkstra Algorithm
const dijkstra = (grid, startX, startY) => {
    const visitOrder = [];
    grid[startX][startY].distance = 0;
    const unvisitedNodes = getAllNode(grid);
    while(!!unvisitedNodes.length){
        unvisitedNodes.sort((a, b) => a.distance - b.distance);
        const node = unvisitedNodes.shift();
        if(node.isWall) continue;
        if(node.distance === Infinity) return visitOrder;
        visitOrder.push(node);
        if(node.isFinish) return visitOrder;
        // update distance
        for(let i = 0; i < 4; i++){
            const x = node.row + dx[i];
            const y = node.col + dy[i];
            if(x < 0 || y < 0 || x === grid.length || y === grid[0].length) continue;
            if(grid[x][y].isVisited) continue;
            if(grid[x][y].distance > node.distance + 1){
                grid[x][y].distance = node.distance + 1;
                grid[x][y].previousNode = node;
            }
        }
    }
    return visitOrder;
}

const getAllNode = (grid) => {
    const nodes = [];
    grid.forEach(row => row.forEach(node => nodes.push(node)));
    return nodes;
}

// A* Algorithm
const Astar = (grid, startX, startY, finishX, finishY) => {
    const visitOrder = [];
    grid[startX][startY].distance = 0;
    const target = grid[finishX][finishY];
    const unvisitedNodes = getAllNode(grid);

    const getHeuristics = (node) => {
        return node.distance + manhattan(node, target);
    }

    while(!!unvisitedNodes.length){
        unvisitedNodes.sort((a, b) => {
            const ha = getHeuristics(a);
            const hb = getHeuristics(b);
            if(ha !== hb) return ha - hb;
            return manhattan(a, target) - manhattan(b, target);
        });
        const node = unvisitedNodes.shift();

        if(node.isWall) continue;
        if(node.distance === Infinity) return visitOrder;
        visitOrder.push(node);
        if(node.isFinish) return visitOrder;

        // update distance
        for(let i = 0; i < 4; i++){
            const x = node.row + dx[i];
            const y = node.col + dy[i];
            if(x < 0 || y < 0 || x === grid.length || y === grid[0].length) continue;
            if(grid[x][y].isVisited) continue;
            if(getHeuristics(grid[x][y]) > getHeuristics(node)){
                grid[x][y].distance = node.distance + 1;
                grid[x][y].previousNode = node;
            }
        }
    }
}

const manhattan = (nodeA, nodeB) => {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col); 
}

// get the path for by tracing previous node. (Does not guarantee shortest with DFS)
const getShortestPath = (grid, finishX, finishY) => {
    const path = [];
    let curNode = grid[finishX][finishY];
    while(curNode !== null){
        path.unshift(curNode);
        curNode = curNode.previousNode;
    }
    return path;
}


export {bfs, dfs, dijkstra, Astar, getShortestPath};