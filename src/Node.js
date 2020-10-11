import React from 'react';
import './Node.css'

function Node({ row, col, isFinish, isStart, isWall, 
    onMouseDown, onMouseEnter, onMouseUp, isVisited, isPath, isNote, wallToggle }) {
    const extraClassName = (isFinish ? 'node-finish'
                        : isStart ? 'node-start'
                        : isWall ? 'node-wall'
                        : isVisited ? 'note-visited'
                        : isPath ? 'note_path'
                        : '').concat(isNote ? ' node-note' : '');
    return (
        <td 
            id={`node-${row}-${col}`} 
            className={`node ${extraClassName}`}
            onContextMenu={e => {
                e.preventDefault();
                wallToggle(row, col);
            }}
            onClick={(e) => {
                e.preventDefault();
                onMouseDown(row, col);
            }}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseUp={onMouseUp}
            onAnimationStart={e => e.stopPropagation()}
            onMouseLeave={e => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
        ></td>
    )
    
}

export default Node
