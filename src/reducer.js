export const speed = [600, 50, 5];
export const algoList = ['bfs', 'dfs', 'dijkstra', 'a-star'];

const initCost = [ ['TBD', 'TBD'], 
                    ['TBD', 'TBD'],
                    ['TBD', 'TBD'],
                    ['TBD', 'TBD'] ]

export const initialState = {
    speed: speed[2],
    algorithm: 'bfs',
    algoCost: JSON.parse(JSON.stringify(initCost)),
    visualizing: false,
    buildingWalls: false,
};

export const actionTypes = {
    SET_ALGO: "SET_ALGO",
    SET_SPEED: "SET_SPEED",
    SET_VISIT_COST: "SET_VISIT_COST",
    SET_PATH_COST: "SET_PATH_COST",
    RESET_COST: "RESET_COST",
    VISUALIZE: "VISUALIZE",
    WALL_BUILDING: "WALL_BUILDING",
}

const reducer = (state, action) => {
    switch(action.type){
        case actionTypes.SET_SPEED:
            return {
                ...state,
                speed: action.speed,
            };

        case actionTypes.SET_ALGO:
            return {
                ...state,
                algorithm: action.algorithm,
            }

        case actionTypes.SET_VISIT_COST: 
            const newVisitCost = [...state.algoCost];
            newVisitCost[action.idx][0] = action.cost;
            return {
                ...state,
                algoCost: newVisitCost,
            }

        case actionTypes.SET_PATH_COST:
            const newPathCost = [...state.algoCost];
            newPathCost[action.idx][1] = action.cost;
            return {
                ...state,
                algoCost: newPathCost,
            }    

        case actionTypes.RESET_COST:
            return{
                ...state,
                algoCost: JSON.parse(JSON.stringify(initCost)),
            }

        case actionTypes.WALL_BUILDING:
            return {
                ...state,
                buildingWalls: action.build,
            }
        default:
            return state;
    }
};

export default reducer;