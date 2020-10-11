import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './Header';
import Board from './Board';
import Node from './Node'
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useStateValue } from './StateProvider'
import { actionTypes, speed, algoList} from './reducer'
import CountUp from 'react-countup';

function App() {
	const [speedText, setSpeedText] = useState('Fast');
	const [{algoCost, buildingWalls}, dispatch] = useStateValue();
	const changeSpeed = (event) => {
		setSpeedText(event.target.value);
		let newSpeed = 0;
		switch(event.target.value){
			case 'Low':
				newSpeed = speed[0];
				break;
			case 'Average':
				newSpeed = speed[1];
				break;
			default:
				newSpeed = speed[2];
		}
		dispatch({
			type: actionTypes.SET_SPEED,
			speed: newSpeed,
		})
	}
	return (
		<div className="App">
			<Header></Header>
			<div className='title_text'><h1>Choose an Algorithm and Visualize</h1></div>
			<div className='visualizer'>
				<div className='options'>
					<div className='opt'>
						<h3>Speed</h3>
						<FormControl className='speed'>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={speedText}
								onChange={changeSpeed}
							>
								<MenuItem value='Low'>Slow</MenuItem>
								<MenuItem value='Average'>Average</MenuItem>
								<MenuItem value='Fast'>Fast</MenuItem>
							</Select>
						</FormControl>
					</div>
					<h2>Statistics:</h2>
					<div className='statistics'>
						<div className='stat'>
							<div className='algo_title'><h3>BFS:</h3></div>
							<div className='number'>
								<span className='visited-number'>
									Visited: {algoCost[0][0] === 'TBD' ? 'TBD' 
											: <CountUp 
												end={algoCost[0][0]} 
												duration={4}
												useEasing={false}
											></CountUp>}
								</span>
								<span className='path-number'>
									Path: {algoCost[0][1] === 'TBD' ? 'TBD' 
											: <CountUp 
												end={algoCost[0][1]} 
												duration={5}
											></CountUp>}
								</span>
							</div>
						</div>
						<div className='stat'>
							<div className='algo_title'><h3>DFS:</h3></div>
							<div className='number'>
								<span className='visited-number'>
									Visited: {algoCost[1][0] === 'TBD' ? 'TBD' 
											: <CountUp 
												end={algoCost[1][0]} 
												duration={4}
												useEasing={false}
											></CountUp>}
								</span>
								<span className='path-number'>
									Path: {algoCost[1][1] === 'TBD' ? 'TBD' 
											: <CountUp 
												end={algoCost[1][1]} 
												duration={5}
											></CountUp>}
								</span>
							</div>
						</div>
						<div className='stat'>
							<div className='algo_title'><h3>Dijkstra:</h3></div>
							<div className='number'>
								<span className='visited-number'>
									Visited: {algoCost[2][0] === 'TBD' ? 'TBD' 
											: <CountUp 
												end={algoCost[2][0]} 
												duration={4}
												useEasing={false}
											></CountUp>}
								</span>
								<span className='path-number'>
									Path: {algoCost[2][1] === 'TBD' ? 'TBD' 
											: <CountUp 
												end={algoCost[2][1]} 
												duration={5}
											></CountUp>}
								</span>
							</div>
						</div>
						<div className='stat'>
							<div className='algo_title'><h3>A-star:</h3></div>
							<div className='number'>
								<span className='visited-number'>
									Visited: {algoCost[3][0] === 'TBD' ? 'TBD' 
											: <CountUp 
												end={algoCost[3][0]} 
												duration={4}
												useEasing={false}
											></CountUp>}
								</span>
								<span className='path-number'>
									Path: {algoCost[3][1] === 'TBD' ? 'TBD' 
											: <CountUp 
												end={algoCost[3][1]} 
												duration={5}
											></CountUp>}
								</span>
							</div>
						</div>
					</div>
				</div>
				<Board></Board>
				<div className='note'>
					<div className='note_opt'>
						<Node 
							key='unvisited-note'
							isNote={true}
							onMouseDown={() => {}}
							onMouseEnter={() => {}}
							onMouseUp={() => {}}
						></Node>
						<h3>Unvisited Node</h3>
					</div>
					<div className='note_opt'>
						<Node 
							key='visited-note'
							isNote={true}
							isVisited={true}
							onMouseDown={() => {}}
							onMouseEnter={() => {}}
							onMouseUp={() => {}}
						></Node>
						<h3>Visited Node</h3>
					</div>
					<div className='note_opt'>
						<Node 
							key='wall-note'
							isNote={true}
							isWall={true}
							onMouseDown={() => {}}
							onMouseEnter={() => {}}
							onMouseUp={() => {}}
						></Node>
						<h3>Wall</h3>
					</div>
					<div className='note_opt'>
						<Node 
							key='path-note'
							isNote={true}
							isPath={true}
							onMouseDown={() => {}}
							onMouseEnter={() => {}}
							onMouseUp={() => {}}
						></Node>
						<h3>Path</h3>
					</div>
					<div className='wall_building'>
						{!buildingWalls ? <h3 id='go_build_walls'>Click to build tons of walls</h3>
										: <h3 id='stop_build_walls'>Re-click to stop building</h3>}
						<h3 id='build_single_wall'>Right click to switch a single square</h3>
					</div>
				</div>
			</div>
		</div>

	);
}

export default App;
