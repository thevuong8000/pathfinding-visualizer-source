import React, { useState, useEffect } from 'react'
import './Board.css'
import Node from './Node'
import { bfs, dfs, dijkstra, Astar, getShortestPath } from './Algorithm/Pathfinder';
import { useStateValue } from './StateProvider'
import { actionTypes, algoList } from './reducer'


const ROWS = 20;
const COLUMNS = 32;

function Board() {
    const [START_ROW, setStartRow] = useState(10);
    const [START_COL, setStartCol] = useState(6);
    const [FINISH_ROW, setFinishRow] = useState(10);
    const [FINISH_COL, setFinishCol] = useState(25);
    const [{algorithm, speed, algoCost}, dispatch] = useStateValue();
    const [grid, setGrid] = useState([]);
    const [mouseDown, setMouseDown] = useState(false);
    const [setStart, setSetStart] = useState(false);
    const [setFinish, setSetFinish] = useState(false);
    const [visualizing, setVisualizing] = useState(false);
    const lastWall = {row: -1, col: -1};

    const getInitGrid = () => {
        const grid = [];
        for (let row = 0; row < ROWS; row++) {
            const currentRow = [];
            for (let col = 0; col < COLUMNS; col++) {
                currentRow.push(createNode(col, row));
            }
            grid.push(currentRow);
        }
        return grid;
    }

    const createNode = (col, row) => {
        return {
            col,
            row,
            isStart: row === START_ROW && col === START_COL,
            isFinish: row === FINISH_ROW && col === FINISH_COL,
            distance: Infinity,
            isVisited: false,
            isWall: false,
            previousNode: null,
        };
    };

    const handleMouseDown = (row, col) => {
        if(grid[row][col].isStart){
            setSetStart(true);
        } else if(grid[row][col].isFinish){
            setSetFinish(true);
        } else{
            if(mouseDown){
                console.log('not wall');
                dispatch({
                    type: actionTypes.WALL_BUILDING,
                    build: false,
                });
                setMouseDown(false);
            } else{
                dispatch({
                    type: actionTypes.WALL_BUILDING,
                    build: true,
                });
                wallToggle(row, col);
                setMouseDown(true);
            }
        }
    }
    
    const handleMouseEnter = (row, col) => {
        if(setStart){
            if(grid[row][col].isFinish) return;
            document.getElementById(`node-${START_ROW}-${START_COL}`)
                    .className = 'node '
                    .concat(grid[START_ROW][START_COL].isWall ? 'node-wall' : '');
            document.getElementById(`node-${row}-${col}`)
                    .className += ' node-start';
            grid[START_ROW][START_COL].isStart = false;
            grid[row][col].isStart = true;
            setStartRow(row);
            setStartCol(col);
        } else if(setFinish){
            if(grid[row][col].isStart) return;
            document.getElementById(`node-${FINISH_ROW}-${FINISH_COL}`)
                    .className = 'node '
                    .concat(grid[FINISH_ROW][FINISH_COL].isWall ? 'node-wall' : '');
            document.getElementById(`node-${row}-${col}`)
                    .className = 'node node-finish';
            grid[FINISH_ROW][FINISH_COL].isFinish = false;
            grid[row][col].isFinish = true;
            setFinishRow(row);
            setFinishCol(col);
        } else{
            if (!mouseDown) return;
            wallToggle(row, col);
        }
    }
    
    const handleMouseUp = () => {
        // setMouseDown(false);
        setSetStart(false);
        setSetFinish(false);
    }

    const wallToggle = (row, col) => {
        const node = grid[row][col];
        if(node.isFinish || node.isStart) return grid;
        if(row === lastWall.row && col === lastWall.col) return;
        lastWall.row = row;
        lastWall.col = col;
        node.isWall = !node.isWall;
        const nodeLink = document.getElementById(`node-${row}-${col}`)
        if(nodeLink.className.includes('node-wall')) nodeLink.className = 'node';
        else nodeLink.className = 'node node-wall';
    };
    
    useEffect(() => {
        setGrid(getInitGrid());
    }, []);

    // nodeType: 0(visited) or 1(path)
    const countIncr = (isVisited, cost) => {
        const idx = algoList.indexOf(algorithm);
        dispatch({
            type: isVisited ? actionTypes.SET_VISIT_COST : actionTypes.SET_PATH_COST,
            idx: idx,
            cost: cost,
        })
    }

    const animate = (visitedNodesInOrder, nodesInShortestPathOrder) => {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    animateShortestPath(nodesInShortestPathOrder);
                    countIncr(true, i);
                }, speed * i);
                return;
            }
            const node = visitedNodesInOrder[i];
            setTimeout(() => {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visiting'
                    .concat(grid[node.row][node.col].isStart ? ' node-start'
                            : grid[node.row][node.col].isFinish ? ' node-finish'
                            : '');
            }, speed * (i - 0.8));
            setTimeout(() => {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited'
                    .concat(grid[node.row][node.col].isStart ? ' node-start'
                            : grid[node.row][node.col].isFinish ? ' node-finish'
                            : '');
            }, speed * i);
        }
    }

    const animateShortestPath = (nodesInShortestPathOrder) => {
        for (let i = 0; i <= nodesInShortestPathOrder.length; i++) {
            if(i == nodesInShortestPathOrder.length){
                setTimeout(() => {
                    countIncr(false, i);
                    setVisualizing(false);
                    runButtonToggle('start_button');
                }, 4 * speed * i);
                return;
            }
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = 
                    'node node-shortest-path'
                    .concat(grid[node.row][node.col].isStart ? ' node-start'
                            : grid[node.row][node.col].isFinish ? ' node-finish'
                            : '');
            }, 4 * speed * i);
        }
    }

    const runButtonToggle = (className) => {
        document.getElementById('run_algorithm').className = className;
    }

    const findPath = () => {
        if(visualizing) return;
        setVisualizing(true);
        runButtonToggle('blocked_button');
        clearBoard(false);
        const visitedNodesInOrder = algorithm === 'bfs' ? bfs(grid, START_ROW, START_COL)
                                    : algorithm === 'dfs' ? dfs(grid, START_ROW, START_COL)
                                    : algorithm === 'dijkstra' ? dijkstra(grid, START_ROW, START_COL)
                                    : Astar(grid, START_ROW, START_COL, FINISH_ROW, FINISH_COL);
        // visitedNodesInOrder.shift();
        const nodesInShortestPathOrder = getShortestPath(grid, FINISH_ROW, FINISH_COL);
        animate(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    const clearBoard = (delWall) => {
        if(visualizing) return;
        let nodes = document.getElementsByClassName('node');
        for(let i = 0; i < nodes.length; i++){
            if(nodes[i].className.includes('node-note')) continue;
            nodes[i].className = 'node '
                                .concat(!delWall && 
                                    nodes[i].className.includes('node-wall') 
                                    ? 'node-wall' : '');
        }
        const newGrid = grid.map(row => row.map(node => {
            return {
                ...node,
                isWall: delWall ? false : node.isWall,
                previousNode: null,
                isVisited: false,
                distance: Infinity,
            }
        }));
        setGrid(newGrid);
        document.getElementById(`node-${START_ROW}-${START_COL}`).className = 'node node-start';
        document.getElementById(`node-${FINISH_ROW}-${FINISH_COL}`).className = 'node node-finish';
        
        if(delWall){
            dispatch({
                type: actionTypes.RESET_COST,
            })
        }
    }

    return (
        <div>
        <table className='board'>
            <tbody>
            {grid.length ? grid.map((row, rowIdx) => {
                return (
                    <tr className='row' key={rowIdx}>
                        {row.map((node, nodeIdx) => {
                            // console.log("rewrite");
                            const {row, col, isWall, isStart, isFinish} = node;
                            return (
                                <Node 
                                    key={nodeIdx}
                                    row={row}
                                    col={col}
                                    isFinish={isFinish}
                                    isStart={isStart}
                                    isWall={isWall}
                                    wallToggle={wallToggle}
                                    onMouseDown={(row, col) => handleMouseDown(row, col)}
                                    onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                                    onMouseUp={() => handleMouseUp()}
                                ></Node>
                            )
                        })}
                    </tr>
                )
            }) : <div>Nothing here</div>}
            </tbody>
        </table>
        <button id='start-algorithm' className='hidden' onClick={findPath}>button</button>
        <button id='clear-board' className='hidden' onClick={() => clearBoard(true)}>clear</button>
        <button id='clear-path' className='hidden' onClick={() => clearBoard(false)}>clear</button>
        </div>
    )
}

export default Board;
