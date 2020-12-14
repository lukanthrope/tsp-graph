import { useEffect, useState } from 'react';
import { Graph } from "react-d3-graph";
import TextField from '@material-ui/core/TextField';

import TSP from './algorithm';

import './App.css';
 
const myConfig = {
    nodeHighlightBehavior: true,
    node: {
        color: "green",
        size: 300,
        highlightStrokeColor: "red",
    },
    link: {
        highlightColor: "lightblue",
    },
};


const initialMatrix = [
  [0, 2, 7, 0, 0, 0, 0],
  [2, 0, 0, 3, 3, 4, 0],
  [7, 0, 0, 1, 0, 0, 0],
  [0, 3, 7, 0, 5, 1, 0],
  [0, 3, 0, 5, 0, 0, 5],
  [0, 4, 0, 1, 0, 0, 2],
  [0, 0, 0, 0, 5, 2, 0]
];

function App() { 
  const [matrix, setMatrix] = useState(initialMatrix);
  const [schema, setSchema] = useState(null);
  const [minPath, setMinPath] = useState(null);

  useEffect(() => {
    const tsp = new TSP(matrix);
    setSchema(tsp.solve());
    setMinPath(tsp.path);
  }, [matrix]);

  const handleChange = (e, i, j) => {
    const m = [...matrix];
    m[i][j] = Number(e.target.value);
    setMatrix(m);
  };

  return (
    <div className="App">
      <div className="container">
        {schema && (
          <Graph
            id="graph-id"
            data={schema}
            config={myConfig}
          />
        )}
        {minPath && <h2>Min path{minPath}</h2>}
      </div>
      <div className="form-container">
        {
          matrix.map((r, i) => (
            <div key={i}>
              {r.map((el, index) =>
                <TextField
                  key={index}
                  value={el}
                  id="standard-required"
                  disabled={i === index}
                  onChange={(e) => handleChange(e, i, index)}
                  />
              )}
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default App;
