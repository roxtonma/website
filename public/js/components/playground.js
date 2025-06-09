// Playground JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Modal functionality
  const openModal = (modalId) => {
    document.getElementById(modalId).style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  };
  
  const closeAllModals = () => {
    const modals = document.querySelectorAll('.tool-modal');
    modals.forEach(modal => {
      modal.style.display = 'none';
    });
    document.body.style.overflow = ''; // Restore scrolling
  };
  
  // Setup close buttons
  const closeButtons = document.querySelectorAll('.close-modal');
  closeButtons.forEach(button => {
    button.addEventListener('click', closeAllModals);
  });
  
  // Close modal when clicking outside
  document.querySelectorAll('.tool-modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });
  
  // Open specific modals
  const toolButtons = document.querySelectorAll('[data-modal]');
  toolButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modalId = this.getAttribute('data-modal');
      openModal(modalId);
      
      // Initialize specific tool if needed
      if (modalId === 'regex-tester-modal') {
        initRegexTester();
      }
    });
  });
  
  // Make only overflowing tool descriptions expandable
  const descriptions = document.querySelectorAll('.tool-description');
  
  descriptions.forEach(description => {
    // Ensure the description has content
    if (!description.textContent.trim()) return;
    
    // More accurate overflow detection
    const isOverflowing = description.scrollHeight > description.clientHeight + 5; // 5px buffer
    
    if (isOverflowing) {
      // Add indicator class for styling
      description.classList.add('has-overflow');
      
      // Add click handler only to descriptions with overflow
      description.addEventListener('click', function() {
        this.classList.toggle('expanded');
      });
    } else {
      // Remove has-overflow class if previously added
      description.classList.remove('has-overflow');
      
      // Remove pointer cursor for non-overflowing descriptions
      description.style.cursor = 'default';
    }
  });
  
  // Regex Tester Logic
  function initRegexTester() {
    const regexPattern = document.getElementById('regex-pattern');
    const regexFlags = document.querySelectorAll('.regex-flag');
    const testString = document.getElementById('test-string');
    const regexResults = document.getElementById('regex-results');
    const regexMatchList = document.getElementById('regex-match-list');
    const patternButtons = document.querySelectorAll('.pattern-btn');
    
    // Function to run the regex test
    function runRegexTest() {
      // Clear previous results
      regexResults.innerHTML = '';
      regexMatchList.innerHTML = '';
      
      // Get regex pattern and flags
      const pattern = regexPattern.value;
      let flags = '';
      
      regexFlags.forEach(flag => {
        if (flag.checked) {
          flags += flag.value;
        }
      });
      
      // Validate input
      if (!pattern) {
        regexResults.innerHTML = '<div class="regex-no-match">Enter a regular expression pattern</div>';
        return;
      }
      
      // Create regex and test string
      try {
        const regex = new RegExp(pattern, flags);
        const string = testString.value;
        
        // Test for matches
        const matches = [];
        let match;
        const globalRegex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
        
        while ((match = globalRegex.exec(string)) !== null) {
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
            groupCount: match.length - 1
          });
          
          // Prevent infinite loops for zero-width matches
          if (match.index === globalRegex.lastIndex) {
            globalRegex.lastIndex++;
          }
        }
        
        // Display results
        if (matches.length > 0) {
          // Highlight matches in the original string
          let highlightedString = string;
          let offset = 0;
          
          // Sort matches by index (descending) to avoid offset issues
          matches.sort((a, b) => b.index - a.index);
          
          // Add highlighting
          matches.forEach(match => {
            const before = highlightedString.substring(0, match.index + offset);
            const after = highlightedString.substring(match.index + offset + match.text.length);
            highlightedString = before + '<span class="regex-match">' + match.text + '</span>' + after;
            offset += '<span class="regex-match"></span>'.length;
          });
          
          regexResults.innerHTML = highlightedString || '<div class="regex-no-match">No matches found</div>';
          
          // Sort matches by index (ascending) for the list
          matches.sort((a, b) => a.index - b.index);
          
          // Add match details to the list
          matches.forEach((match, i) => {
            const matchItem = document.createElement('li');
            matchItem.className = 'regex-match-item';
            
            let matchDetails = `Match ${i + 1}: "${match.text}" at index ${match.index}`;
            
            if (match.groupCount > 0) {
              matchDetails += '<ul>';
              match.groups.forEach((group, j) => {
                matchDetails += `<li>Group ${j + 1}: "${group}"</li>`;
              });
              matchDetails += '</ul>';
            }
            
            matchItem.innerHTML = matchDetails;
            regexMatchList.appendChild(matchItem);
          });
        } else {
          regexResults.innerHTML = '<div class="regex-no-match">No matches found</div>';
          regexMatchList.innerHTML = '';
        }
      } catch (error) {
        regexResults.innerHTML = `<div class="regex-error">Error: ${error.message}</div>`;
        regexMatchList.innerHTML = '';
      }
    }
    
    // Add event listeners
    if (regexPattern) regexPattern.addEventListener('input', runRegexTest);
    if (testString) testString.addEventListener('input', runRegexTest);
    
    regexFlags.forEach(flag => {
      flag.addEventListener('change', runRegexTest);
    });
    
    // Common patterns
    if (patternButtons.length) {
      patternButtons.forEach(button => {
        button.addEventListener('click', function() {
          const pattern = this.getAttribute('data-pattern');
          regexPattern.value = pattern;
          runRegexTest();
        });
      });
    }
    
    // Add flag info toggle
    const showFlagInfo = document.getElementById('show-flag-info');
    const flagInfoPanel = document.getElementById('flag-info-panel');
    
    if (showFlagInfo && flagInfoPanel) {
      showFlagInfo.addEventListener('click', function() {
        const isVisible = flagInfoPanel.style.display !== 'none';
        flagInfoPanel.style.display = isVisible ? 'none' : 'block';
        this.innerHTML = isVisible ? 
          '<i class="bi bi-info-circle"></i> What are flags?' : 
          '<i class="bi bi-x-circle"></i> Hide flag info';
      });
    }
    
    // Initial run
    runRegexTest();
  }
}); 