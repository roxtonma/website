// Playground JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Modal functionality
  const toolButtons = document.querySelectorAll('.tool-btn[data-modal]');
  const modals = document.querySelectorAll('.tool-modal');
  const closeButtons = document.querySelectorAll('.close-modal');
  
  toolButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modalId = button.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = 'flex';
      }
    });
  });
  
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.tool-modal');
      if (modal) {
        modal.style.display = 'none';
      }
    });
  });
  
  window.addEventListener('click', (event) => {
    if (event.target.classList.contains('tool-modal')) {
      event.target.style.display = 'none';
    }
  });
  
  // Regex Tester functionality
  if (document.getElementById('regex-tester-modal')) {
    initRegexTester();
  }
  
  // HTTP Request Tester functionality
  if (document.getElementById('http-tester-modal')) {
    initHttpTester();
  }
  
  // Other tool initializations will go here
});

// Regex Tester Initialization
function initRegexTester() {
  const regexPattern = document.getElementById('regex-pattern');
  const testString = document.getElementById('test-string');
  const regexFlags = document.querySelectorAll('.regex-flag');
  const regexResults = document.getElementById('regex-results');
  const regexMatchList = document.getElementById('regex-match-list');
  const patternButtons = document.querySelectorAll('.pattern-btn');
  const showFlagInfoBtn = document.getElementById('show-flag-info');
  const flagInfoPanel = document.getElementById('flag-info-panel');
  
  // Show/hide flag info panel
  if (showFlagInfoBtn && flagInfoPanel) {
    showFlagInfoBtn.addEventListener('click', () => {
      if (flagInfoPanel.style.display === 'none') {
        flagInfoPanel.style.display = 'block';
        showFlagInfoBtn.innerHTML = '<i class="bi bi-dash-circle"></i> Hide flag info';
      } else {
        flagInfoPanel.style.display = 'none';
        showFlagInfoBtn.innerHTML = '<i class="bi bi-info-circle"></i> What are flags?';
      }
    });
  }
  
  // Update results when inputs change
  function updateResults() {
    if (!regexPattern || !testString || !regexResults || !regexMatchList) return;
    
    const pattern = regexPattern.value;
    const text = testString.value;
    let activeFlags = '';
    
    regexFlags.forEach(flag => {
      if (flag.checked) {
        activeFlags += flag.value;
      }
    });
    
    if (!pattern) {
      regexResults.innerHTML = '<span class="regex-no-match">Enter a regular expression pattern</span>';
      regexMatchList.innerHTML = '';
      return;
    }
    
    try {
      const regex = new RegExp(pattern, activeFlags);
      const matches = text.match(regex);
      
      if (!text) {
        regexResults.innerHTML = '<span class="regex-no-match">Enter text to test against</span>';
        regexMatchList.innerHTML = '';
        return;
      }
      
      // Highlight matches in the test string
      let highlightedText = text;
      if (matches) {
        if (activeFlags.includes('g')) {
          // For global matches, replace all occurrences
          highlightedText = text.replace(regex, match => `<span class="regex-match">${match}</span>`);
        } else {
          // For non-global matches, replace only the first occurrence
          const firstMatch = matches[0];
          const firstIndex = text.indexOf(firstMatch);
          const beforeMatch = text.substring(0, firstIndex);
          const afterMatch = text.substring(firstIndex + firstMatch.length);
          highlightedText = `${beforeMatch}<span class="regex-match">${firstMatch}</span>${afterMatch}`;
        }
      }
      
      regexResults.innerHTML = highlightedText || '<span class="regex-no-match">No matches found</span>';
      
      // List all matches
      regexMatchList.innerHTML = '';
      
      if (matches && matches.length > 0) {
        if (activeFlags.includes('g')) {
          matches.forEach((match, index) => {
            const li = document.createElement('li');
            li.className = 'regex-match-item';
            li.textContent = `Match ${index + 1}: "${match}"`;
            regexMatchList.appendChild(li);
          });
        } else {
          // For non-global regex, the first element is the complete match
          const li = document.createElement('li');
          li.className = 'regex-match-item';
          li.textContent = `Complete match: "${matches[0]}"`;
          regexMatchList.appendChild(li);
          
          // Remaining elements are capturing groups
          for (let i = 1; i < matches.length; i++) {
            const li = document.createElement('li');
            li.className = 'regex-match-item';
            li.textContent = `Group ${i}: "${matches[i]}"`;
            regexMatchList.appendChild(li);
          }
        }
      } else {
        const li = document.createElement('li');
        li.className = 'regex-no-match';
        li.textContent = 'No matches found';
        regexMatchList.appendChild(li);
      }
    } catch (error) {
      regexResults.innerHTML = `<span class="regex-error">Error: ${error.message}</span>`;
      regexMatchList.innerHTML = '';
    }
  }
  
  // Event listeners
  if (regexPattern) regexPattern.addEventListener('input', updateResults);
  if (testString) testString.addEventListener('input', updateResults);
  regexFlags.forEach(flag => {
    flag.addEventListener('change', updateResults);
  });
  
  // Pattern buttons
  patternButtons.forEach(button => {
    button.addEventListener('click', () => {
      const pattern = button.getAttribute('data-pattern');
      regexPattern.value = pattern;
      updateResults();
    });
  });
  
  // Initial update
  updateResults();
}

// HTTP Request Tester Initialization
function initHttpTester() {
  // DOM Elements
  const httpMethod = document.getElementById('http-method');
  const requestUrl = document.getElementById('request-url');
  const sendRequestBtn = document.getElementById('send-request');
  const bodyContentType = document.getElementById('body-content-type');
  const requestBody = document.getElementById('request-body');
  
  // Example endpoints
  const exampleEndpointBtns = document.querySelectorAll('.example-endpoint-btn');
  
  // Add param/header buttons
  const addParamBtn = document.getElementById('add-param');
  const addHeaderBtn = document.getElementById('add-header');
  
  // Add parameter row
  if (addParamBtn) {
    addParamBtn.addEventListener('click', () => {
      const paramsTable = document.querySelector('.params-table tbody');
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td><input type="text" class="param-key" placeholder="Parameter name"></td>
        <td><input type="text" class="param-value" placeholder="Parameter value"></td>
      `;
      paramsTable.appendChild(newRow);
    });
  }
  
  // Add header row
  if (addHeaderBtn) {
    addHeaderBtn.addEventListener('click', () => {
      const headersTable = document.querySelector('.headers-table tbody');
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td><input type="text" class="header-key" placeholder="Header name"></td>
        <td><input type="text" class="header-value" placeholder="Header value"></td>
      `;
      headersTable.appendChild(newRow);
    });
  }
  
  // Example endpoint buttons
  exampleEndpointBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      requestUrl.value = btn.getAttribute('data-url');
    });
  });
  
  // Send request
  if (sendRequestBtn) {
    sendRequestBtn.addEventListener('click', sendRequest);
  }
  
  // Send request function
  async function sendRequest() {
    // Reset response display
    const responseStatus = document.getElementById('response-status');
    const responseTime = document.getElementById('response-time');
    const responseBody = document.getElementById('response-body');
    
    if (!responseStatus || !responseTime || !responseBody) {
      console.error('Response elements not found');
      return;
    }
    
    responseStatus.textContent = 'Sending request...';
    responseStatus.className = 'response-status';
    responseTime.textContent = '';
    responseBody.textContent = '';
    
    // Get URL
    let url = requestUrl.value.trim();
    if (!url) {
      responseStatus.textContent = 'Error: URL is required';
      responseStatus.className = 'response-status status-error';
      return;
    }
    
    // Add query parameters
    const paramRows = document.querySelectorAll('.params-table tbody tr');
    const params = new URLSearchParams();
    let hasParams = false;
    
    paramRows.forEach(row => {
      const keyInput = row.querySelector('.param-key');
      const valueInput = row.querySelector('.param-value');
      
      if (keyInput && valueInput) {
        const key = keyInput.value.trim();
        const value = valueInput.value.trim();
        
        if (key) {
          params.append(key, value);
          hasParams = true;
        }
      }
    });
    
    if (hasParams) {
      url += url.includes('?') ? '&' : '?';
      url += params.toString();
    }
    
    // Get headers
    const headerRows = document.querySelectorAll('.headers-table tbody tr');
    const headers = {};
    
    headerRows.forEach(row => {
      const keyInput = row.querySelector('.header-key');
      const valueInput = row.querySelector('.header-value');
      
      if (keyInput && valueInput) {
        const key = keyInput.value.trim();
        const value = valueInput.value.trim();
        
        if (key) {
          headers[key] = value;
        }
      }
    });
    
    // Build request options
    const method = httpMethod.value;
    const options = {
      method,
      headers,
      mode: 'cors'
    };
    
    // Add body for POST, PUT, PATCH
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const contentType = bodyContentType.value;
      headers['Content-Type'] = contentType;
      
      if (contentType === 'application/json') {
        try {
          // Try to parse JSON to validate
          const body = requestBody.value.trim();
          if (body) {
            const jsonBody = JSON.parse(body);
            options.body = JSON.stringify(jsonBody);
          }
        } catch (error) {
          responseStatus.textContent = `Error: Invalid JSON - ${error.message}`;
          responseStatus.className = 'response-status status-error';
          return;
        }
      } else {
        options.body = requestBody.value;
      }
    }
    
    // Send request and measure time
    const startTime = performance.now();
    
    try {
      const response = await fetch(url, options);
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Display response time
      responseTime.textContent = `${duration.toFixed(0)}ms`;
      
      // Display status
      const statusCode = response.status;
      const statusText = `${statusCode} ${response.statusText}`;
      responseStatus.textContent = statusText;
      
      // Set status color based on response code
      if (statusCode >= 200 && statusCode < 300) {
        responseStatus.className = 'response-status status-success';
      } else if (statusCode >= 400) {
        responseStatus.className = 'response-status status-error';
      } else {
        responseStatus.className = 'response-status';
      }
      
      // Show combined headers and body
      try {
        const contentType = response.headers.get('content-type') || '';
        
        // Get headers text
        let headersText = '// Response Headers:\n';
        response.headers.forEach((value, key) => {
          headersText += `// ${key}: ${value}\n`;
        });
        headersText += '\n// Response Body:\n';
        
        // Get body
        let bodyText = '';
        if (contentType.includes('application/json')) {
          const jsonResponse = await response.json();
          bodyText = JSON.stringify(jsonResponse, null, 2);
        } else {
          bodyText = await response.text();
        }
        
        // Set combined content
        responseBody.textContent = headersText + bodyText;
        
      } catch (error) {
        responseBody.textContent = `Error parsing response: ${error.message}`;
      }
      
    } catch (error) {
      responseStatus.textContent = `Error: ${error.message}`;
      responseStatus.className = 'response-status status-error';
      responseBody.textContent = `Request failed: ${error.message}`;
      
      // Check for CORS error
      if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
        responseBody.textContent = `CORS Error: The request was blocked due to Cross-Origin Resource Sharing (CORS) policy restrictions.\n\nThis happens when the server doesn't allow requests from your browser's origin.\n\nTry one of the example CORS-friendly endpoints below instead.`;
      }
    }
  }
} 