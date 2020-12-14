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
  const [initialSchema, setInitialSchema] = useState(null); 
  const [schema, setSchema] = useState(null);
  const [minPath, setMinPath] = useState(null);

  useEffect(() => {
    const tsp = new TSP(matrix);
    setSchema(tsp.solve());
    setMinPath(tsp.path);

    const newInitSchema = {
      nodes: [],
      links: []
    };

    for (let i = 0; i < matrix.length; i++) {
      newInitSchema.nodes.push({ id: TSP.toString(i) });
    }

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        if (matrix[i][j] > 0) {
          newInitSchema.links.push({ source: TSP.toString(i), target: TSP.toString(j) });
        }
      }
    }

    setInitialSchema(newInitSchema);
  }, [matrix]);

  const handleChange = (e, i, j) => {
    const m = [...matrix];
    m[i][j] = Number(e.target.value);
    setMatrix(m);
  };

  return (
    <div className="App">
      <div className="form-container">
        <h2>Матриця</h2>
        {
          matrix.map((r, i) => (
            <div key={i}>
              {r.map((el, index) =>
                <TextField
                  key={index}
                  value={el}
                  disabled={i === index}
                  onChange={(e) => handleChange(e, i, index)}
                  />
              )}
            </div>
          ))
        }
      </div>
      <div className="container">
        <section>
          <h2>Початковий граф</h2>
          {initialSchema && (
            <Graph
              id="graph-id-0"
              data={initialSchema}
              config={myConfig}
            />
          )}
        </section>
        <section>
          {minPath && <h2>Мінімальний шлях = {minPath}</h2>}
          {schema && (
            <Graph
              id="graph-id-1"
              data={schema}
              config={myConfig}
            />
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
