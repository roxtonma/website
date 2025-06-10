// Data Structures & Algorithms Visualizer

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const tabButtons = document.querySelectorAll('.tab-btn');
  const selectionPanels = document.querySelectorAll('.selection-panel');
  const vizButtons = document.querySelectorAll('.viz-btn');
  const visualizationCanvas = document.getElementById('visualization-canvas');
  const visualizationTitle = document.querySelector('.visualization-title');
  const explanationContent = document.getElementById('explanation-content');
  
  // State variables
  let currentVisualization = null;
  
  // Tab switching functionality
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all tab buttons
      tabButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Hide all panels
      selectionPanels.forEach(panel => panel.classList.add('hidden'));
      
      // Show the corresponding panel
      const tabId = button.getAttribute('data-tab');
      document.getElementById(`${tabId}-panel`).classList.remove('hidden');
    });
  });
  
  // Visualization selection
  vizButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all visualization buttons
      vizButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get the selected visualization
      const vizType = button.getAttribute('data-viz');
      
      // Load the selected visualization
      loadVisualization(vizType);
    });
  });
  
  // Function to load a visualization
  function loadVisualization(vizType) {
    const visualization = visualizations[vizType];
    
    if (!visualization) {
      console.error(`Visualization '${vizType}' not found`);
      return;
    }
    
    currentVisualization = vizType;
    visualizationTitle.textContent = visualization.title;
    explanationContent.innerHTML = visualization.explanation;
    
    // Initialize the visualization
    visualization.initialize();
  }
  
  // Visualization data and implementations
  const visualizations = {
    'array': {
      title: 'Arrays',
      explanation: `
        <p>An array is a collection of elements stored at contiguous memory locations. The elements can be accessed using indices. Arrays provide O(1) time for accessing elements by index, but have a fixed size in most languages.</p>
        <br>
        <h4>Time Complexity:</h4>
        <ul>
          <li>Access: O(1)</li>
          <li>Search: O(n)</li>
          <li>Insertion at end: O(1) (amortized)</li>
          <li>Insertion at middle: O(n)</li>
          <li>Deletion: O(n)</li>
        </ul>
        <br>
        <h4>Code Example:</h4>
        <pre><code>// JavaScript
let arr = [1, 2, 3, 4, 5];
console.log(arr[2]);  // Access: O(1)

// Insertion at end
arr.push(6);  // O(1) amortized

// Insertion at middle
arr.splice(2, 0, 10);  // O(n)

// Deletion
arr.splice(3, 1);  // O(n)</code></pre>
      `,
      initialize: function() {
        visualizationCanvas.innerHTML = '<div class="array-container"></div>';
        const arrayContainer = visualizationCanvas.querySelector('.array-container');
        
        // Create initial array visualization
        const initialArray = [5, 8, 2, 1, 9, 4, 7];
        initialArray.forEach(value => {
          const element = document.createElement('div');
          element.className = 'array-element';
          element.textContent = value;
          arrayContainer.appendChild(element);
        });
      }
    },
    'linked-list': {
      title: 'Linked Lists',
      explanation: `
        <p>A linked list is a linear data structure where elements are stored in nodes. Each node contains data and a reference to the next node. Linked lists allow for efficient insertions and deletions but have O(n) access time.</p>
        <br>
        <h4>Time Complexity:</h4>
        <ul>
        <li>Access: O(n)</li>
        <li>Search: O(n)</li>
        <li>Insertion at beginning: O(1)</li>
        <li>Insertion at end: O(n) or O(1) with tail pointer</li>
        <li>Deletion: O(1) after finding the element</li>
        </ul>
        <br>
        <h4>Code Example:</h4>
        <pre><code>// JavaScript
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
  
  append(value) {
    const newNode = new Node(value);
    
    if (!this.head) {
      this.head = newNode;
      return;
    }
    
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    
    current.next = newNode;
  }
}</code></pre>
      `,
      initialize: function() {
        visualizationCanvas.innerHTML = '<div class="linked-list-container"></div>';
        const linkedListContainer = visualizationCanvas.querySelector('.linked-list-container');
        
        // Create initial linked list visualization
        const values = [5, 8, 2, 1, 9];
        
        // Create linked list nodes
        values.forEach((value, index) => {
          const nodeElement = document.createElement('div');
          nodeElement.className = 'list-node';
          
          // Create node value element
          const valueElement = document.createElement('div');
          valueElement.className = 'node-value';
          valueElement.textContent = value;
          nodeElement.appendChild(valueElement);
          
          // Add pointer arrow (except for last node)
          if (index < values.length - 1) {
            const pointerElement = document.createElement('div');
            pointerElement.className = 'node-pointer';
            pointerElement.innerHTML = '→';
            nodeElement.appendChild(pointerElement);
          }
          
          linkedListContainer.appendChild(nodeElement);
        });
      }
    },
    'stack': {
      title: 'Stacks',
      explanation: `
        <p>A stack is a linear data structure that follows the Last In First Out (LIFO) principle. Elements are added and removed from the same end, called the top. Stacks are used in function calls, expression evaluation, and backtracking algorithms.</p>
        <br>
        <h4>Time Complexity:</h4>
        <ul>
          <li>Push: O(1)</li>
          <li>Pop: O(1)</li>
          <li>Peek: O(1)</li>
          <li>Search: O(n)</li>
        </ul>
        <br>
        <h4>Code Example:</h4>
        <pre><code>// JavaScript
class Stack {
  constructor() {
    this.items = [];
  }
  
  push(element) {
    this.items.push(element);
  }
  
  pop() {
    if (this.isEmpty()) return "Underflow";
    return this.items.pop();
  }
  
  peek() {
    return this.items[this.items.length - 1];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
}</code></pre>
      `,
      initialize: function() {
        visualizationCanvas.innerHTML = '<div class="stack-container"></div>';
        const stackContainer = visualizationCanvas.querySelector('.stack-container');
        
        // Create initial stack visualization
        const values = [7, 4, 9, 1, 2];
        
        values.forEach(value => {
          const element = document.createElement('div');
          element.className = 'stack-element';
          element.textContent = value;
          stackContainer.appendChild(element);
        });
        
        // Add "top" indicator
        const topIndicator = document.createElement('div');
        topIndicator.className = 'stack-indicator';
        topIndicator.textContent = 'Top';
        stackContainer.appendChild(topIndicator);
      }
    },

    'queue': {
      title: 'Queues',
      explanation: `
        <p>A queue is a linear data structure that follows the First In First Out (FIFO) principle. Elements are added at the rear and removed from the front. Queues are used in scheduling, BFS algorithms, and managing resources.</p>
        <br>
        <h4>Time Complexity:</h4>
        <ul>
          <li>Enqueue: O(1)</li>
          <li>Dequeue: O(1)</li>
          <li>Peek: O(1)</li>
          <li>Search: O(n)</li>
        </ul>
        <br>
        <h4>Code Example:</h4>
        <pre><code>// JavaScript
class Queue {
  constructor() {
    this.items = [];
  }
  
  enqueue(element) {
    this.items.push(element);
  }
  
  dequeue() {
    if (this.isEmpty()) return "Underflow";
    return this.items.shift();
  }
  
  front() {
    if (this.isEmpty()) return "No elements";
    return this.items[0];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
}</code></pre>
      `,
      initialize: function() {
        visualizationCanvas.innerHTML = '<div class="queue-container"><div class="queue-elements"></div><div class="queue-labels"><span>Front</span><span>Rear</span></div></div>';
        const queueElements = visualizationCanvas.querySelector('.queue-elements');
        
        // Create initial queue visualization
        const values = [5, 8, 2, 1, 9];
        
        values.forEach(value => {
          const element = document.createElement('div');
          element.className = 'queue-element';
          element.textContent = value;
          queueElements.appendChild(element);
        });
      }
    },

    'tree': {
      title: 'Trees',
      explanation: `
        <p>A tree is a hierarchical data structure consisting of nodes connected by edges. Each tree has a root node, and each node can have multiple children. Trees are used for representing hierarchical relationships, organizing data for quick search, and more.</p>
        <br>
        <h4>Time Complexity (Binary Search Tree):</h4>
        <ul>
          <li>Access: O(log n)</li>
          <li>Search: O(log n)</li>
          <li>Insertion: O(log n)</li>
          <li>Deletion: O(log n)</li>
        </ul>
        <br>
        <h4>Code Example:</h4>
        <pre><code>// JavaScript
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  
  insert(value) {
    const newNode = new TreeNode(value);
    
    if (!this.root) {
      this.root = newNode;
      return;
    }
    
    function insertNode(node, newNode) {
      if (newNode.value < node.value) {
        if (node.left === null) {
          node.left = newNode;
        } else {
          insertNode(node.left, newNode);
        }
      } else {
        if (node.right === null) {
          node.right = newNode;
        } else {
          insertNode(node.right, newNode);
        }
      }
    }
    
    insertNode(this.root, newNode);
  }
}</code></pre>
      `,
      initialize: function() {
        visualizationCanvas.innerHTML = '<div class="tree-container"></div>';
        const treeContainer = visualizationCanvas.querySelector('.tree-container');
        
        // Create a simple binary tree visualization (2 levels)
        // Level 1 (Root)
        const level1 = document.createElement('div');
        level1.className = 'tree-level';
        const rootNode = document.createElement('div');
        rootNode.className = 'tree-node';
        rootNode.textContent = '10';
        level1.appendChild(rootNode);
        treeContainer.appendChild(level1);
        
        // Level 2
        const level2 = document.createElement('div');
        level2.className = 'tree-level';
        const leftNode = document.createElement('div');
        leftNode.className = 'tree-node';
        leftNode.textContent = '5';
        const rightNode = document.createElement('div');
        rightNode.className = 'tree-node';
        rightNode.textContent = '15';
        level2.appendChild(leftNode);
        level2.appendChild(rightNode);
        treeContainer.appendChild(level2);
        
        // Level 3
        const level3 = document.createElement('div');
        level3.className = 'tree-level';
        const leftLeftNode = document.createElement('div');
        leftLeftNode.className = 'tree-node';
        leftLeftNode.textContent = '3';
        const leftRightNode = document.createElement('div');
        leftRightNode.className = 'tree-node';
        leftRightNode.textContent = '7';
        const rightLeftNode = document.createElement('div');
        rightLeftNode.className = 'tree-node';
        rightLeftNode.textContent = '12';
        const rightRightNode = document.createElement('div');
        rightRightNode.className = 'tree-node';
        rightRightNode.textContent = '18';
        level3.appendChild(leftLeftNode);
        level3.appendChild(leftRightNode);
        level3.appendChild(rightLeftNode);
        level3.appendChild(rightRightNode);
        treeContainer.appendChild(level3);
      }
    },

    'graph': {
      title: 'Graphs',
      explanation: `
        <p>A graph is a non-linear data structure consisting of nodes (vertices) and edges. Graphs can be directed or undirected, weighted or unweighted, and are used to represent networks, social connections, maps, and more.</p>
        <br>
        <h4>Time Complexity:</h4>
        <ul>
          <li>Storage (Adjacency Matrix): O(V²)</li>
          <li>Storage (Adjacency List): O(V+E)</li>
          <li>DFS/BFS Traversal: O(V+E)</li>
          <li>Finding Shortest Path (Dijkstra's): O(V²) or O(E log V) with min-heap</li>
        </ul>
        <br>
        <h4>Code Example:</h4>
        <pre><code>// JavaScript - Adjacency List representation
class Graph {
  constructor() {
    this.adjacencyList = {};
  }
  
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }
  
  addEdge(vertex1, vertex2) {
    this.adjacencyList[vertex1].push(vertex2);
    this.adjacencyList[vertex2].push(vertex1); // for undirected graph
  }
  
  removeEdge(vertex1, vertex2) {
    this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(
      v => v !== vertex2
    );
    this.adjacencyList[vertex2] = this.adjacencyList[vertex2].filter(
      v => v !== vertex1
    );
  }
}</code></pre>
      `,
      initialize: function() {
        visualizationCanvas.innerHTML = '<div class="graph-container"><svg width="100%" height="100%" viewBox="0 0 300 300"></svg></div>';
        const svg = visualizationCanvas.querySelector('svg');
        
        // Define graph nodes and their positions
        const nodes = [
          { id: 'A', x: 150, y: 50 },
          { id: 'B', x: 75, y: 150 },
          { id: 'C', x: 225, y: 150 },
          { id: 'D', x: 100, y: 250 },
          { id: 'E', x: 200, y: 250 }
        ];
        
        // Define graph edges
        const edges = [
          { source: 'A', target: 'B' },
          { source: 'A', target: 'C' },
          { source: 'B', target: 'D' },
          { source: 'C', target: 'D' },
          { source: 'C', target: 'E' },
          { source: 'D', target: 'E' }
        ];
        
        // Draw edges
        edges.forEach(edge => {
          const source = nodes.find(n => n.id === edge.source);
          const target = nodes.find(n => n.id === edge.target);
          
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', source.x);
          line.setAttribute('y1', source.y);
          line.setAttribute('x2', target.x);
          line.setAttribute('y2', target.y);
          line.setAttribute('class', 'graph-edge');
          svg.appendChild(line);
        });
        
        // Draw nodes
        nodes.forEach(node => {
          // Node circle
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', node.x);
          circle.setAttribute('cy', node.y);
          circle.setAttribute('r', 20);
          circle.setAttribute('class', 'graph-node');
          svg.appendChild(circle);
          
          // Node label
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', node.x);
          text.setAttribute('y', node.y);
          text.setAttribute('class', 'graph-text');
          text.textContent = node.id;
          svg.appendChild(text);
        });
      }
    },

    'hash-table': {
      title: 'Hash Tables',
      explanation: `
        <p>A hash table is a data structure that stores key-value pairs. It uses a hash function to compute an index into an array where the value is stored. Hash tables provide efficient lookup, insertion, and deletion operations.</p>
        <br>
        <h4>Time Complexity:</h4>
        <ul>
          <li>Search: O(1) average, O(n) worst case</li>
          <li>Insertion: O(1) average, O(n) worst case</li>
          <li>Deletion: O(1) average, O(n) worst case</li>
        </ul>
        <br>
        <h4>Code Example:</h4>
        <pre><code>// JavaScript
class HashTable {
  constructor(size = 53) {
    this.keyMap = new Array(size);
  }
  
  _hash(key) {
    let total = 0;
    const WEIRD_PRIME = 31;
    for (let i = 0; i < Math.min(key.length, 100); i++) {
      const char = key[i];
      const value = char.charCodeAt(0) - 96;
      total = (total * WEIRD_PRIME + value) % this.keyMap.length;
    }
    return total;
  }
  
  set(key, value) {
    const index = this._hash(key);
    if (!this.keyMap[index]) {
      this.keyMap[index] = [];
    }
    this.keyMap[index].push([key, value]);
  }
  
  get(key) {
    const index = this._hash(key);
    if (!this.keyMap[index]) return undefined;
    for (let i = 0; i < this.keyMap[index].length; i++) {
      if (this.keyMap[index][i][0] === key) {
        return this.keyMap[index][i][1];
      }
    }
    return undefined;
  }
}</code></pre>
      `,
      initialize: function() {
        visualizationCanvas.innerHTML = '<div class="hash-table-container"></div>';
        const hashTableContainer = visualizationCanvas.querySelector('.hash-table-container');
        
        // Create a simple hash table visualization
        const buckets = [
          { index: 0, items: [] },
          { index: 1, items: [{ key: 'name', value: 'John' }] },
          { index: 2, items: [] },
          { index: 3, items: [{ key: 'age', value: '30' }, { key: 'gender', value: 'male' }] },
          { index: 4, items: [] },
          { index: 5, items: [{ key: 'city', value: 'New York' }] },
          { index: 6, items: [] },
          { index: 7, items: [{ key: 'job', value: 'developer' }] }
        ];
        
        buckets.forEach(bucket => {
          const bucketElement = document.createElement('div');
          bucketElement.className = 'hash-bucket';
          
          const indexElement = document.createElement('div');
          indexElement.className = 'bucket-index';
          indexElement.textContent = bucket.index;
          bucketElement.appendChild(indexElement);
          
          const itemsElement = document.createElement('div');
          itemsElement.className = 'bucket-items';
          
          if (bucket.items.length === 0) {
            itemsElement.textContent = 'Empty';
            itemsElement.style.color = '#999';
          } else {
            bucket.items.forEach(item => {
              const hashItem = document.createElement('div');
              hashItem.className = 'hash-item';
              hashItem.textContent = `${item.key}: ${item.value}`;
              itemsElement.appendChild(hashItem);
            });
          }
          
          bucketElement.appendChild(itemsElement);
          hashTableContainer.appendChild(bucketElement);
        });
      }
    },
    
    // Additional visualizations would be implemented similarly

    // Sorting Algorithms
    'sorting': {
      title: 'Sorting Algorithms',
      explanation: `
        <p>Sorting algorithms arrange elements in a specific order, commonly in ascending or descending order.</p>
        <br>
        <h4>Common Sorting Algorithms:</h4>
        <ul>
          <li><strong>Bubble Sort:</strong> O(n²) - Simple but inefficient</li>
          <li><strong>Selection Sort:</strong> O(n²) - Simple, minimal swaps</li>
          <li><strong>Insertion Sort:</strong> O(n²) - Efficient for small data sets</li>
          <li><strong>Merge Sort:</strong> O(n log n) - Divide and conquer, stable</li>
          <li><strong>Quick Sort:</strong> O(n log n) average - Efficient, in-place</li>
          <li><strong>Heap Sort:</strong> O(n log n) - In-place, not stable</li>
        </ul>
        <br>
        <h4>Code Example (Quick Sort):</h4>
        <pre><code>function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
  return arr;
}

function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left - 1;
  
  for (let j = left; j < right; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
}</code></pre>
      `,
      initialize: function() {
        visualizationCanvas.innerHTML = '<div class="array-container sorting-container"></div>';
        const arrayContainer = visualizationCanvas.querySelector('.array-container');
        
        // Create array to be sorted
        const initialArray = [8, 3, 1, 7, 0, 10, 2];
        initialArray.forEach(value => {
          const element = document.createElement('div');
          element.className = 'array-element';
          element.textContent = value;
          arrayContainer.appendChild(element);
        });
      }
    },

    // Searching Algorithms
    'searching': {
      title: 'Searching Algorithms',
      explanation: `
        <p>Searching algorithms find an element within a data structure.</p>
        <br>
        <h4>Common Searching Algorithms:</h4>
        <ul>
          <li><strong>Linear Search:</strong> O(n) - Checks each element sequentially</li>
          <li><strong>Binary Search:</strong> O(log n) - Requires sorted data</li>
          <li><strong>Hash-Based Search:</strong> O(1) average - Uses hash tables</li>
          <li><strong>Depth-First Search:</strong> O(V+E) - For trees and graphs</li>
          <li><strong>Breadth-First Search:</strong> O(V+E) - For trees and graphs</li>
        </ul>
        <br>
        <h4>Code Example (Binary Search):</h4>
        <pre><code>function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1; // Not found
}</code></pre>
      `,
      initialize: function() {
        visualizationCanvas.innerHTML = '<div class="array-container searching-container"></div>';
        const arrayContainer = visualizationCanvas.querySelector('.array-container');
        
        // Create sorted array for binary search
        const sortedArray = [1, 3, 5, 7, 9, 11, 13, 15];
        sortedArray.forEach(value => {
          const element = document.createElement('div');
          element.className = 'array-element';
          element.textContent = value;
          arrayContainer.appendChild(element);
        });
      }
    },

    // Graph Traversal
    'graph-traversal': {
      title: 'Graph Traversal',
      explanation: `
        <p>Graph traversal algorithms systematically visit every vertex in a graph.</p>
        <br>
        <h4>Time Complexity:</h4>
        <ul>
          <li>Time: O(V + E) where V is vertices and E is edges</li>
          <li>Space: O(V)</li>
        </ul>
        <br>
        <h4>Common Graph Traversal Algorithms:</h4>
        <ul>
          <li><strong>Depth-First Search (DFS):</strong> Uses stack (or recursion), explores as far as possible along each branch</li>
          <li><strong>Breadth-First Search (BFS):</strong> Uses queue, explores neighbors before children</li>
        </ul>
        <br>
        <h4>Code Example (DFS):</h4>
        <pre><code>function dfs(graph, start) {
  const visited = new Set();
  const result = [];
  
  function traverse(vertex) {
    visited.add(vertex);
    result.push(vertex);
    
    for (let neighbor of graph[vertex]) {
      if (!visited.has(neighbor)) {
        traverse(neighbor);
      }
    }
  }
  
  traverse(start);
  return result;
}</code></pre>
      `,
      initialize: function() {
        visualizationCanvas.innerHTML = '<div class="graph-container"><svg width="100%" height="100%" viewBox="0 0 300 300"></svg><div class="path-info">DFS Traversal Order: A → B → D → E → C</div></div>';
        const svg = visualizationCanvas.querySelector('svg');
        
        // Define graph nodes and their positions
        const nodes = [
          { id: 'A', x: 150, y: 50 },
          { id: 'B', x: 75, y: 150 },
          { id: 'C', x: 225, y: 150 },
          { id: 'D', x: 100, y: 250 },
          { id: 'E', x: 200, y: 250 }
        ];
        
        // Define graph edges with traversal order
        const edges = [
          { source: 'A', target: 'B', order: 1 },
          { source: 'A', target: 'C', order: 5 },
          { source: 'B', target: 'D', order: 2 },
          { source: 'C', target: 'D', order: null },
          { source: 'C', target: 'E', order: null },
          { source: 'D', target: 'E', order: 3 }
        ];
        
        // Draw edges
        edges.forEach(edge => {
          const source = nodes.find(n => n.id === edge.source);
          const target = nodes.find(n => n.id === edge.target);
          
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', source.x);
          line.setAttribute('y1', source.y);
          line.setAttribute('x2', target.x);
          line.setAttribute('y2', target.y);
          
          // Highlight edges in the DFS path
          if (edge.order !== null) {
            line.setAttribute('stroke', '#e74c3c');
            line.setAttribute('stroke-width', '3');
          } else {
            line.setAttribute('stroke', '#777');
            line.setAttribute('stroke-width', '2');
          }
          
          svg.appendChild(line);
          
          // Add traversal order indicator for edges in the path
          if (edge.order !== null) {
            const midX = (source.x + target.x) / 2;
            const midY = (source.y + target.y) / 2;
            
            // Create order background
            const orderBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            orderBg.setAttribute('cx', midX);
            orderBg.setAttribute('cy', midY);
            orderBg.setAttribute('r', 10);
            orderBg.setAttribute('fill', 'white');
            orderBg.setAttribute('stroke', '#e74c3c');
            svg.appendChild(orderBg);
            
            // Create order text
            const orderText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            orderText.setAttribute('x', midX);
            orderText.setAttribute('y', midY);
            orderText.setAttribute('text-anchor', 'middle');
            orderText.setAttribute('dominant-baseline', 'middle');
            orderText.setAttribute('fill', '#333');
            orderText.setAttribute('font-weight', 'bold');
            orderText.setAttribute('font-size', '12px');
            orderText.textContent = edge.order;
            svg.appendChild(orderText);
          }
        });
        
        // Draw nodes
        nodes.forEach(node => {
          // Node circle
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', node.x);
          circle.setAttribute('cy', node.y);
          circle.setAttribute('r', 20);
          
          // Special styling for nodes in DFS path
          const traversalIndex = ['A', 'B', 'D', 'E', 'C'].indexOf(node.id);
          
          if (node.id === 'A') {
            circle.setAttribute('fill', '#c3e6cb'); // Start node - green
            circle.setAttribute('stroke', '#28a745');
          } else if (traversalIndex > 0) {
            circle.setAttribute('fill', '#fff3cd'); // Path nodes - yellow
            circle.setAttribute('stroke', '#ffc107');
          } else {
            circle.setAttribute('fill', '#d1e7f6'); // Other nodes - blue
            circle.setAttribute('stroke', '#3E9BCD');
          }
          
          circle.setAttribute('stroke-width', '2');
          svg.appendChild(circle);
          
          // Node label
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', node.x);
          text.setAttribute('y', node.y);
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('dominant-baseline', 'middle');
          text.setAttribute('font-weight', 'bold');
          text.setAttribute('fill', '#333');
          text.textContent = node.id;
          svg.appendChild(text);
          
          // Add visit order indicator
          if (traversalIndex >= 0) {
            const visitOrder = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            visitOrder.setAttribute('x', node.x + 18);
            visitOrder.setAttribute('y', node.y - 18);
            visitOrder.setAttribute('text-anchor', 'middle');
            visitOrder.setAttribute('dominant-baseline', 'middle');
            visitOrder.setAttribute('font-size', '12px');
            visitOrder.setAttribute('font-weight', 'bold');
            visitOrder.setAttribute('fill', 'white');
            
            // Create background circle for visit order
            const visitOrderBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            visitOrderBg.setAttribute('cx', node.x + 18);
            visitOrderBg.setAttribute('cy', node.y - 18);
            visitOrderBg.setAttribute('r', 10);
            visitOrderBg.setAttribute('fill', '#3E9BCD');
            
            svg.appendChild(visitOrderBg);
            visitOrder.textContent = traversalIndex + 1;
            svg.appendChild(visitOrder);
          }
        });
        
        // Add legend for start node
        const legendX = 20;
        const legendY = 20;
        
        // Legend title
        const legendTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        legendTitle.setAttribute('x', legendX);
        legendTitle.setAttribute('y', legendY);
        legendTitle.setAttribute('font-size', '12px');
        legendTitle.setAttribute('font-weight', 'bold');
        legendTitle.setAttribute('class', 'graph-legend-text');
        legendTitle.textContent = 'DFS from node A';
        svg.appendChild(legendTitle);
      }
    },

    // Path Finding
    'path-finding': {
      title: 'Path Finding Algorithms',
      explanation: `
        <p>Path finding algorithms find the shortest or optimal path between two points in a graph.</p>
        <br>
        <h4>Time Complexity (Dijkstra's):</h4>
        <ul>
          <li>O(V²) with array implementation</li>
          <li>O(E log V) with binary heap</li>
        </ul>
        <br>
        <h4>Common Path Finding Algorithms:</h4>
        <ul>
          <li><strong>Dijkstra's Algorithm:</strong> Finds shortest path in weighted graphs with non-negative edges</li>
          <li><strong>A* Search:</strong> Uses heuristics to improve performance over Dijkstra's</li>
          <li><strong>Bellman-Ford:</strong> Handles negative edge weights</li>
          <li><strong>Floyd-Warshall:</strong> Finds shortest paths between all pairs of vertices</li>
        </ul>
        <br>
        <h4>Code Example (Dijkstra's):</h4>
        <pre><code>function dijkstra(graph, start) {
  const distances = {};
  const previous = {};
  const nodes = new Set();
  
  // Initialize
  for (let vertex in graph) {
    distances[vertex] = Infinity;
    previous[vertex] = null;
    nodes.add(vertex);
  }
  distances[start] = 0;
  
  while (nodes.size > 0) {
    // Find vertex with minimum distance
    let minVertex = null;
    for (let vertex of nodes) {
      if (minVertex === null || distances[vertex] < distances[minVertex]) {
        minVertex = vertex;
      }
    }
    
    nodes.delete(minVertex);
    
    // Update distances to neighbors
    for (let neighbor in graph[minVertex]) {
      let distance = distances[minVertex] + graph[minVertex][neighbor];
      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
        previous[neighbor] = minVertex;
      }
    }
  }
  
  return { distances, previous };
}</code></pre>
      `,
      initialize: function() {
        visualizationCanvas.innerHTML = '<div class="graph-container"><svg width="100%" height="100%" viewBox="0 0 300 300"></svg><div class="path-info">Shortest path from A to E: A → C → D → E (Total: 5)</div></div>';
        const svg = visualizationCanvas.querySelector('svg');
        
        // Define graph nodes and their positions
        const nodes = [
          { id: 'A', x: 150, y: 50 },
          { id: 'B', x: 75, y: 150 },
          { id: 'C', x: 225, y: 150 },
          { id: 'D', x: 100, y: 250 },
          { id: 'E', x: 200, y: 250 }
        ];
        
        // Define graph edges with weights
        const edges = [
          { source: 'A', target: 'B', weight: 4 },
          { source: 'A', target: 'C', weight: 2 },
          { source: 'B', target: 'D', weight: 5 },
          { source: 'C', target: 'D', weight: 1 },
          { source: 'C', target: 'E', weight: 3 },
          { source: 'D', target: 'E', weight: 2 }
        ];
        
        // Draw regular edges
        edges.forEach(edge => {
          const source = nodes.find(n => n.id === edge.source);
          const target = nodes.find(n => n.id === edge.target);
          
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', source.x);
          line.setAttribute('y1', source.y);
          line.setAttribute('x2', target.x);
          line.setAttribute('y2', target.y);
          line.setAttribute('stroke', '#777');
          line.setAttribute('stroke-width', '2');
          
          // Special highlight for the shortest path
          if ((edge.source === 'A' && edge.target === 'C') || 
              (edge.source === 'C' && edge.target === 'D') || 
              (edge.source === 'D' && edge.target === 'E')) {
            line.setAttribute('stroke', '#e74c3c');
            line.setAttribute('stroke-width', '3');
          }
          
          svg.appendChild(line);
          
          // Add weight label
          const midX = (source.x + target.x) / 2;
          const midY = (source.y + target.y) / 2;
          
          // Create weight background
          const weightBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          weightBg.setAttribute('cx', midX);
          weightBg.setAttribute('cy', midY);
          weightBg.setAttribute('r', 10);
          weightBg.setAttribute('fill', 'white');
          weightBg.setAttribute('stroke', '#777');
          svg.appendChild(weightBg);
          
          // Create weight text
          const weightText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          weightText.setAttribute('x', midX);
          weightText.setAttribute('y', midY);
          weightText.setAttribute('text-anchor', 'middle');
          weightText.setAttribute('dominant-baseline', 'middle');
          weightText.setAttribute('fill', '#333');
          weightText.setAttribute('font-weight', 'bold');
          weightText.setAttribute('font-size', '12px');
          weightText.textContent = edge.weight;
          svg.appendChild(weightText);
        });
        
        // Draw nodes
        nodes.forEach(node => {
          // Node circle
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', node.x);
          circle.setAttribute('cy', node.y);
          circle.setAttribute('r', 20);
          
          // Special styling for start, end, and path nodes
          if (node.id === 'A') {
            circle.setAttribute('fill', '#c3e6cb');
            circle.setAttribute('stroke', '#28a745');
          } else if (node.id === 'E') {
            circle.setAttribute('fill', '#f8d7da');
            circle.setAttribute('stroke', '#dc3545');
          } else if (['C', 'D'].includes(node.id)) {
            circle.setAttribute('fill', '#fff3cd');
            circle.setAttribute('stroke', '#ffc107');
          } else {
            circle.setAttribute('fill', '#d1e7f6');
            circle.setAttribute('stroke', '#3E9BCD');
          }
          
          circle.setAttribute('stroke-width', '2');
          svg.appendChild(circle);
          
          // Node label
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', node.x);
          text.setAttribute('y', node.y);
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('dominant-baseline', 'middle');
          text.setAttribute('font-weight', 'bold');
          text.setAttribute('fill', '#333');
          text.textContent = node.id;
          svg.appendChild(text);
        });
      }
    },

    // Dynamic Programming
    'dynamic-programming': {
      title: 'Dynamic Programming',
      explanation: `
        <p>Dynamic Programming breaks problems down into simpler subproblems and stores their solutions to avoid redundant calculations.</p>
        <br>
        <h4>Common Dynamic Programming Problems:</h4>
        <ul>
          <li><strong>Fibonacci Sequence:</strong> Calculate Fibonacci numbers efficiently</li>
          <li><strong>Knapsack Problem:</strong> Maximize value given weight constraints</li>
          <li><strong>Longest Common Subsequence:</strong> Find longest sequence common to two strings</li>
          <li><strong>Matrix Chain Multiplication:</strong> Find most efficient way to multiply matrices</li>
        </ul>
        <br>
        <h4>Code Example (Fibonacci):</h4>
        <pre><code>// Recursive approach (inefficient)
function fibRecursive(n) {
  if (n <= 1) return n;
  return fibRecursive(n-1) + fibRecursive(n-2);
}

// Dynamic Programming approach (efficient)
function fibDP(n) {
  const memo = [0, 1];
  
  for (let i = 2; i <= n; i++) {
    memo[i] = memo[i-1] + memo[i-2];
  }
  
  return memo[n];
}</code></pre>
      `,
      initialize: function() {
        visualizationCanvas.innerHTML = '<div class="dp-container"></div>';
        const dpContainer = visualizationCanvas.querySelector('.dp-container');
        
        // Create Fibonacci visualization with a table showing memoization
        const table = document.createElement('table');
        table.className = 'dp-table';
        
        // Create table header
        const headerRow = document.createElement('tr');
        const indexHeader = document.createElement('th');
        indexHeader.textContent = 'n';
        headerRow.appendChild(indexHeader);
        
        const valueHeader = document.createElement('th');
        valueHeader.textContent = 'Fibonacci(n)';
        headerRow.appendChild(valueHeader);
        
        table.appendChild(headerRow);
        
        // Create table rows for Fibonacci values
        for (let i = 0; i <= 10; i++) {
          const row = document.createElement('tr');
          
          const indexCell = document.createElement('td');
          indexCell.textContent = i;
          row.appendChild(indexCell);
          
          const valueCell = document.createElement('td');
          valueCell.textContent = fibonacci(i);
          row.appendChild(valueCell);
          
          table.appendChild(row);
        }
        
        dpContainer.appendChild(table);
        
        // Helper function to calculate Fibonacci numbers
        function fibonacci(n) {
          if (n <= 1) return n;
          
          let a = 0, b = 1;
          for (let i = 2; i <= n; i++) {
            const temp = a + b;
            a = b;
            b = temp;
          }
          
          return b;
        }
      }
    }
  };
});
