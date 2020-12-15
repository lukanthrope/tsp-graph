class TSP {
  matrix = [];
  path = 0;
  len = 0;

  constructor(matrix) {
    console.log(matrix)
    this.matrix = matrix;
    this.len = matrix.length;
  }

  get getMatrix() {
    return this.matrix;
  }

  minKey(key, mstSet) {
    let min = Infinity, min_index;  
  
    for (let v = 0; v < this.len; v++) {
      if (mstSet[v] === false && key[v] < min) {
        min = key[v];
        min_index = v;
      }
    }
    return min_index;  
  } 

  static toString(n) {
    return (n + 1).toString()
  }

  _returnResult(parent, graph) {  
    const res = {
      nodes: [],
      links: []
    };

    parent.forEach((_,index) => {
      res.nodes.push({ id: TSP.toString(index) });
    });

    for (let i = 1; i < graph.length; i++) {
      if (parent[i] !== undefined && graph[i][parent[i]] !== undefined) {
        console.log(parent[i], " - ", i, " \t", graph[i][parent[i]]," \n");
        this.path += graph[i][parent[i]]; 
      
        res.links.push({ source: TSP.toString(parent[i]), target: TSP.toString(i) });
      }
    } 

    return res;
  }  

  solve() {
    const parent = [];  
    const key = [];    
    const mstSet = [];  

    for (let i = 0; i < this.len; i++) { 
      key[i] = Infinity;
      mstSet[i] = false;
    }  
    
    key[0] = 0;  
    parent[0] = -1; 

    for (let count = 0; count < this.len - 1; count++) {    
      let u = this.minKey(key, mstSet);  
      mstSet[u] = true;  
  
      for (let v = 0; v < this.len; v++) {
        if (this.matrix[u][v] && mstSet[v] === false && this.matrix[u][v] < key[v]) {
          parent[v] = u;
          key[v] = this.matrix[u][v];
        }
      }
    }  
    
    return this._returnResult(parent, this.matrix);  
  }  

}

export default TSP;
