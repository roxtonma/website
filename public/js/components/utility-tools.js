// Utility Tools JavaScript

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
    document.getElementById('open-text-formatter').addEventListener('click', () => {
      openModal('text-formatter-modal');
    });
    
    document.getElementById('open-color-tools').addEventListener('click', () => {
      openModal('color-tools-modal');
      updateColorInfo(); // Initialize with default color
    });
    
    document.getElementById('open-qr-generator').addEventListener('click', () => {
      openModal('qr-generator-modal');
    });
    
    document.getElementById('open-image-resizer').addEventListener('click', () => {
      openModal('image-resizer-modal');
    });
    
    document.getElementById('open-markdown-editor').addEventListener('click', () => {
      openModal('markdown-editor-modal');
      updateMarkdownPreview(); // Initialize the preview
    });
    
    document.getElementById('open-json-formatter').addEventListener('click', () => {
      openModal('json-formatter-modal');
    });
    
    document.getElementById('open-unit-converter').addEventListener('click', () => {
      openModal('unit-converter-modal');
      setupUnitConverter();
    });

    document.getElementById('open-image-compressor').addEventListener('click', () => {
      openModal('image-compressor-modal');
    });
    
    document.getElementById('open-currency-converter').addEventListener('click', () => {
      openModal('currency-converter-modal');
      initCurrencyConverter();
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
    
    // Text Formatter Logic
    const textFormatterForm = document.getElementById('text-formatter-form');
    const textResult = document.getElementById('text-result');
    
    if (textFormatterForm) {
      textFormatterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const text = document.getElementById('text-input').value;
        const operation = document.getElementById('text-operation').value;
        let result = '';
        
        switch (operation) {
          case 'uppercase':
            result = text.toUpperCase();
            break;
          case 'lowercase':
            result = text.toLowerCase();
            break;
          case 'capitalize':
            result = text.replace(/\b\w/g, char => char.toUpperCase());
            break;
          case 'reverse':
            result = text.split('').reverse().join('');
            break;
          case 'remove-extra-spaces':
            result = text.replace(/\s+/g, ' ').trim();
            break;
          case 'remove-lines':
            result = text.replace(/^\s*[\r\n]/gm, '');
            break;
          case 'count':
            const charCount = text.length;
            const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
            result = `Characters: ${charCount}, Words: ${wordCount}`;
            break;
          case 'remove-duplicates':
            // Split text into lines, filter out duplicates, then rejoin
            const lines = text.split('\n');
            const uniqueLines = [...new Set(lines)];
            result = uniqueLines.join('\n');
            break;
          case 'remove-duplicate-words':
            // Split text into words, filter out duplicates, then rejoin
            // Preserving whitespace and punctuation
            result = text.replace(/[\w']+/g, function(word) {
              // Create a Set to track seen words (case insensitive)
              if (!this.seenWords) this.seenWords = new Set();
              
              // Check if we've seen this word before (case insensitive)
              if (!this.seenWords.has(word.toLowerCase())) {
                this.seenWords.add(word.toLowerCase());
                return word;
              } else {
                return ''; // Remove duplicate word
              }
            });
            
            // Clean up any resulting double spaces
            result = result.replace(/\s+/g, ' ').trim();
            break;
          default:
            result = text;
        }
        
        textResult.innerHTML = operation === 'count' 
          ? result 
          : `<textarea class="tool-input" rows="6" readonly>${result}</textarea>
             <div class="copy-result-action">
               <button id="copy-text-result" class="tool-btn">
                 <i class="bi bi-clipboard"></i> Copy
               </button>
             </div>`;
             
        textResult.style.display = 'block';
        
        // Add copy functionality
        const copyButton = document.getElementById('copy-text-result');
        if (copyButton) {
          copyButton.addEventListener('click', () => {
            const resultText = textResult.querySelector('textarea').value;
            navigator.clipboard.writeText(resultText).then(() => {
              copyButton.innerHTML = '<i class="bi bi-check"></i> Copied!';
              setTimeout(() => {
                copyButton.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
              }, 2000);
            });
          });
        }
      });
    }
    
    // Color Tools Logic
    const colorPicker = document.getElementById('color-picker');
    const hexValue = document.getElementById('hex-value');
    const rgbValue = document.getElementById('rgb-value');
    const hslValue = document.getElementById('hsl-value');
    const colorPalette = document.getElementById('color-palette');
    
    // Update color information when color is picked
    if (colorPicker) {
      colorPicker.addEventListener('input', updateColorInfo);
    
      // Generate color palettes
      document.getElementById('generate-analogous').addEventListener('click', () => {
        const color = colorPicker.value;
        const r = parseInt(color.substr(1, 2), 16);
        const g = parseInt(color.substr(3, 2), 16);
        const b = parseInt(color.substr(5, 2), 16);
        const hsl = rgbToHsl(r, g, b);
        
        const colors = [];
        for (let i = -2; i <= 2; i++) {
          if (i === 0) {
            colors.push(colorPicker.value);
            continue;
          }
          
          let newHue = (hsl[0] + i * 30) % 360;
          if (newHue < 0) newHue += 360;
          
          const rgb = hslToRgb(newHue, hsl[1], hsl[2]);
          const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
          colors.push(hex);
        }
        
        displayColorPalette(colors);
      });
      
      document.getElementById('generate-complementary').addEventListener('click', () => {
        const color = colorPicker.value;
        const r = parseInt(color.substr(1, 2), 16);
        const g = parseInt(color.substr(3, 2), 16);
        const b = parseInt(color.substr(5, 2), 16);
        const hsl = rgbToHsl(r, g, b);
        
        const complementaryHue = (hsl[0] + 180) % 360;
        const rgb = hslToRgb(complementaryHue, hsl[1], hsl[2]);
        const complementaryColor = rgbToHex(rgb[0], rgb[1], rgb[2]);
        
        displayColorPalette([colorPicker.value, complementaryColor]);
      });
      
      document.getElementById('generate-triadic').addEventListener('click', () => {
        const color = colorPicker.value;
        const r = parseInt(color.substr(1, 2), 16);
        const g = parseInt(color.substr(3, 2), 16);
        const b = parseInt(color.substr(5, 2), 16);
        const hsl = rgbToHsl(r, g, b);
        
        const colors = [colorPicker.value];
        
        for (let i = 1; i <= 2; i++) {
          const newHue = (hsl[0] + i * 120) % 360;
          const rgb = hslToRgb(newHue, hsl[1], hsl[2]);
          const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
          colors.push(hex);
        }
        
        displayColorPalette(colors);
      });
    }
    
    function updateColorInfo() {
      const color = colorPicker.value;
      
      // Update HEX value
      hexValue.value = color.toUpperCase();
      
      // Convert to RGB
      const r = parseInt(color.substr(1, 2), 16);
      const g = parseInt(color.substr(3, 2), 16);
      const b = parseInt(color.substr(5, 2), 16);
      rgbValue.value = `rgb(${r}, ${g}, ${b})`;
      
      // Convert to HSL
      const hsl = rgbToHsl(r, g, b);
      hslValue.value = `hsl(${Math.round(hsl[0])}, ${Math.round(hsl[1])}%, ${Math.round(hsl[2])}%)`;
    }
    
    function displayColorPalette(colors) {
      colorPalette.innerHTML = '';
      
      colors.forEach(color => {
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.style.width = `${100 / colors.length}%`;
        colorBox.style.backgroundColor = color;
        
        const colorLabel = document.createElement('div');
        colorLabel.className = 'color-label';
        colorLabel.textContent = color.toUpperCase();
        
        colorBox.appendChild(colorLabel);
        
        // Copy color on click
        colorBox.addEventListener('click', () => {
          navigator.clipboard.writeText(color.toUpperCase()).then(() => {
            const originalText = colorLabel.textContent;
            colorLabel.textContent = 'Copied!';
            setTimeout(() => {
              colorLabel.textContent = originalText;
            }, 1000);
          });
        });
        
        colorPalette.appendChild(colorBox);
      });
    }
    
    // RGB to HSL conversion
    function rgbToHsl(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      
      if (max === min) {
        h = s = 0; // achromatic
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
      }
      
      return [h * 360, s * 100, l * 100];
    }
    
    // HSL to RGB conversion
    function hslToRgb(h, s, l) {
      h /= 360;
      s /= 100;
      l /= 100;
      
      let r, g, b;
      
      if (s === 0) {
        r = g = b = l; // achromatic
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
    
    // RGB to HEX conversion
    function rgbToHex(r, g, b) {
      return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
    }
    
    function componentToHex(c) {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }
    
    // QR Code Generator Logic
    const qrContentType = document.getElementById('qr-content-type');
    const qrGeneratorForm = document.getElementById('qr-generator-form');
    const qrResult = document.getElementById('qr-result');
    
    if (qrContentType) {
      // Show/hide different input sections based on selected content type
      qrContentType.addEventListener('change', function() {
        const contentType = this.value;
        
        // Hide all input sections first
        document.querySelectorAll('.qr-input-section').forEach(section => {
          section.style.display = 'none';
        });
        
        // Show the relevant section
        document.getElementById(`qr-${contentType}-input`).style.display = 'block';
      });
    }
    
    if (qrGeneratorForm) {
      qrGeneratorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        try {
          const contentType = qrContentType.value;
          let qrContent = '';
          
          // Build QR code content based on type
          switch (contentType) {
            case 'url':
              qrContent = document.getElementById('qr-url').value;
              if (!qrContent.startsWith('http')) {
                qrContent = 'https://' + qrContent;
              }
              break;
              
            case 'text':
              qrContent = document.getElementById('qr-text').value;
              break;
              
            case 'email':
              const email = document.getElementById('qr-email').value;
              const subject = document.getElementById('qr-email-subject').value;
              const body = document.getElementById('qr-email-body').value;
              
              qrContent = 'mailto:' + email;
              
              if (subject || body) {
                qrContent += '?';
                if (subject) qrContent += 'subject=' + encodeURIComponent(subject);
                if (subject && body) qrContent += '&';
                if (body) qrContent += 'body=' + encodeURIComponent(body);
              }
              break;
              
            case 'wifi':
              const ssid = document.getElementById('qr-wifi-ssid').value;
              const type = document.getElementById('qr-wifi-type').value;
              const password = document.getElementById('qr-wifi-password').value;
              const hidden = document.getElementById('qr-wifi-hidden').checked;
              
              qrContent = 'WIFI:S:' + ssid + ';T:' + type + ';';
              if (password && type !== 'nopass') qrContent += 'P:' + password + ';';
              if (hidden) qrContent += 'H:true;';
              qrContent += ';';
              break;
              
            case 'phone':
              const phone = document.getElementById('qr-phone').value;
              qrContent = 'tel:' + phone;
              break;
          }
          
          if (!qrContent) {
            throw new Error('Empty content');
          }
          
          // Generate QR code
          const qr = qrcode(0, 'L');
          qr.addData(qrContent);
          qr.make();
          
          // Display the QR code
          const qrCodeHtml = qr.createImgTag(5, 10);
          qrResult.innerHTML = `
            <div class="qr-code-display">
              ${qrCodeHtml}
            </div>
            <div class="qr-instructions">
              Scan with your device's camera app to use this QR code.
            </div>
            <div class="download-qr-btn">
              <button id="download-qr" class="tool-btn">
                <i class="bi bi-download"></i> Download QR Code
              </button>
            </div>
          `;
          qrResult.style.display = 'block';
          
          // Setup download functionality
          document.getElementById('download-qr').addEventListener('click', function() {
            // Create a temporary canvas to convert QR code to image
            const img = qrResult.querySelector('img');
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Draw the QR code image on the canvas
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            
            // Create a download link
            const link = document.createElement('a');
            link.download = 'qrcode.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
          });
        } catch (error) {
          qrResult.innerHTML = `
            <div class="error-message">
              <i class="bi bi-exclamation-triangle"></i>
              Error generating QR code. Please check your input.
            </div>
          `;
          qrResult.style.display = 'block';
          console.error(error);
        }
      });
    }
    
    // Image Resizer Logic
    const imageUpload = document.getElementById('image-upload');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const originalDimensions = document.getElementById('original-dimensions');
    const resizeOptions = document.getElementById('resize-options');
    const widthInput = document.getElementById('width-input');
    const heightInput = document.getElementById('height-input');
    const maintainAspectRatio = document.getElementById('maintain-aspect-ratio');
    const resizeButton = document.getElementById('resize-button');
    const resizedResult = document.getElementById('resized-result');
    const resizedImageContainer = document.getElementById('resized-image-container');
    const newDimensions = document.getElementById('new-dimensions');
    const downloadResized = document.getElementById('download-resized');

    let originalImage = null;
    let aspectRatio = 1;

    // Handle image upload
    if (imageUpload) {
      imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file && file.type.match('image.*')) {
          const reader = new FileReader();
          
          reader.onload = function(e) {
            // Create an image to get dimensions
            originalImage = new Image();
            originalImage.onload = function() {
              // Display original image
              imagePreview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 300px;">`;
              imagePreviewContainer.style.display = 'block';
              
              // Show original dimensions
              originalDimensions.textContent = `Original size: ${originalImage.width} × ${originalImage.height} pixels`;
              
              // Set default resize values
              widthInput.value = originalImage.width;
              heightInput.value = originalImage.height;
              
              // Calculate aspect ratio
              aspectRatio = originalImage.width / originalImage.height;
              
              // Show resize options
              resizeOptions.style.display = 'block';
              
              // Hide previous results
              resizedResult.style.display = 'none';
            };
            originalImage.src = e.target.result;
          };
          
          reader.readAsDataURL(file);
        }
      });
    }

    // Handle width/height changes while maintaining aspect ratio
    if (widthInput && heightInput && maintainAspectRatio) {
      widthInput.addEventListener('input', function() {
        if (maintainAspectRatio.checked && originalImage) {
          const newWidth = parseInt(this.value) || 0;
          heightInput.value = Math.round(newWidth / aspectRatio);
        }
      });

      heightInput.addEventListener('input', function() {
        if (maintainAspectRatio.checked && originalImage) {
          const newHeight = parseInt(this.value) || 0;
          widthInput.value = Math.round(newHeight * aspectRatio);
        }
      });
    }

    // Resize the image
    if (resizeButton) {
      resizeButton.addEventListener('click', function() {
        if (!originalImage) return;
        
        const newWidth = parseInt(widthInput.value) || originalImage.width;
        const newHeight = parseInt(heightInput.value) || originalImage.height;
        
        // Create a canvas to resize the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Draw the resized image
        ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);
        
        // Convert to data URL
        const resizedImageUrl = canvas.toDataURL('image/png');
        
        // Display resized image
        resizedImageContainer.innerHTML = `<img src="${resizedImageUrl}" style="max-width: 100%; max-height: 300px; border: 1px solid var(--color-border);">`;
        newDimensions.textContent = `New size: ${newWidth} × ${newHeight} pixels`;
        resizedResult.style.display = 'block';
        
        // Set up download button
        downloadResized.onclick = function() {
          const link = document.createElement('a');
          link.download = 'resized-image.png';
          link.href = resizedImageUrl;
          link.click();
        };
      });
    }

    // Markdown Editor Logic
    const markdownInput = document.getElementById('markdown-input');
    const markdownPreview = document.getElementById('markdown-preview');
    const copyMarkdownHtml = document.getElementById('copy-markdown-html');
    const downloadMarkdown = document.getElementById('download-markdown');
    const markdownButtons = document.querySelectorAll('.markdown-btn');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (markdownInput && markdownPreview) {
      // Initialize with example content if empty
      if (!markdownInput.value) {
        markdownInput.value = markdownInput.placeholder;
      }
      
      // Update preview when input changes
      markdownInput.addEventListener('input', updateMarkdownPreview);
      
      // Initial preview
      updateMarkdownPreview();
      
      // Tab switching
      if (tabButtons && tabButtons.length) {
        tabButtons.forEach(button => {
          button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));
            // Show selected tab content
            const tabName = this.getAttribute('data-tab');
            document.getElementById(`${tabName}-tab`).classList.add('active');
            
            // Update preview when switching to preview tab
            if (tabName === 'preview') {
              updateMarkdownPreview();
            }
          });
        });
      }
      
      // Markdown toolbar functionality
      markdownButtons.forEach(button => {
        button.addEventListener('click', function() {
          const markdownType = this.getAttribute('data-markdown');
          insertMarkdown(markdownType);
        });
      });
      
      // Copy HTML button
      if (copyMarkdownHtml) {
        copyMarkdownHtml.addEventListener('click', function() {
          const htmlContent = markdownPreview.innerHTML;
          navigator.clipboard.writeText(htmlContent).then(() => {
            this.innerHTML = '<i class="bi bi-check"></i> Copied!';
            setTimeout(() => {
              this.innerHTML = '<i class="bi bi-clipboard"></i> Copy HTML';
            }, 2000);
          });
        });
      }
      
      // Download button
      if (downloadMarkdown) {
        downloadMarkdown.addEventListener('click', function() {
          const markdownContent = markdownInput.value;
          const htmlContent = markdownPreview.innerHTML;
          const format = confirm('Download as Markdown? Click Cancel for HTML.') ? 'md' : 'html';
          
          const content = format === 'md' ? markdownContent : `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Markdown Export</title>
  <style>
    body { font-family: sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 1rem; }
    h1, h2, h3 { color: #222; }
    code { background: #f5f5f5; padding: 2px 4px; border-radius: 3px; }
    pre { background: #f5f5f5; padding: 1rem; border-radius: 4px; overflow-x: auto; }
    blockquote { border-left: 3px solid #ddd; margin-left: 0; padding-left: 1rem; color: #666; }
    img { max-width: 100%; }
    a { color: #0366d6; }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;
          
          const blob = new Blob([content], { type: format === 'md' ? 'text/markdown' : 'text/html' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `document.${format}`;
          link.href = url;
          link.click();
        });
      }
    }

    // Function to convert markdown to HTML
    function updateMarkdownPreview() {
      if (!markdownInput || !markdownPreview) return;
      
      let markdown = markdownInput.value;
      
      // Convert markdown to HTML
      // Headings
      markdown = markdown.replace(/^### (.*$)/gm, '<h3>$1</h3>');
      markdown = markdown.replace(/^## (.*$)/gm, '<h2>$1</h2>');
      markdown = markdown.replace(/^# (.*$)/gm, '<h1>$1</h1>');
      
      // Bold and Italic
      markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      markdown = markdown.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      // Links
      markdown = markdown.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
      
      // Images
      markdown = markdown.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');
      
      // Code blocks
      markdown = markdown.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
      
      // Inline code
      markdown = markdown.replace(/`([^`]+)`/g, '<code>$1</code>');
      
      // Lists
      markdown = markdown.replace(/^\s*- (.*$)/gm, '<ul><li>$1</li></ul>');
      markdown = markdown.replace(/^\s*\d+\. (.*$)/gm, '<ol><li>$1</li></ol>');
      
      // Fix consecutive list items
      markdown = markdown.replace(/<\/ul>\s*<ul>/g, '');
      markdown = markdown.replace(/<\/ol>\s*<ol>/g, '');
      
      // Blockquotes
      markdown = markdown.replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>');
      
      // Paragraphs
      markdown = markdown.replace(/^([^<].*)/gm, function(match) {
        if (match.trim() === '') return '';
        // Skip if already wrapped in HTML tag
        if (match.match(/^<(\w+).*>[\s\S]*<\/\1>$/)) {
          return match;
        }
        return '<p>' + match + '</p>';
      });
      
      // Set the HTML content
      markdownPreview.innerHTML = markdown;
    }

    // Function to insert markdown formatting
    function insertMarkdown(type) {
      if (!markdownInput) return;
      
      const textarea = markdownInput;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      let replacement = '';
      
      switch (type) {
        case 'heading':
          replacement = `# ${selectedText || 'Heading'}`;
          break;
        case 'bold':
          replacement = `**${selectedText || 'bold text'}**`;
          break;
        case 'italic':
          replacement = `*${selectedText || 'italic text'}*`;
          break;
        case 'link':
          replacement = `[${selectedText || 'link text'}](https://example.com)`;
          break;
        case 'list':
          replacement = `- ${selectedText || 'list item'}\n- another item`;
          break;
        case 'code':
          replacement = `\`${selectedText || 'code'}\``;
          break;
      }
      
      // Insert the replacement
      textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
      
      // Set cursor position after insertion
      const newCursorPosition = start + replacement.length;
      textarea.selectionStart = newCursorPosition;
      textarea.selectionEnd = newCursorPosition;
      
      // Focus the textarea
      textarea.focus();
      
      // Update preview
      updateMarkdownPreview();
    }

    // JSON Formatter Logic
    const jsonFormatterForm = document.getElementById('json-formatter-form');
    const jsonInput = document.getElementById('json-input');
    const jsonIndent = document.getElementById('json-indent');
    const jsonOperation = document.getElementById('json-operation');
    const jsonResult = document.getElementById('json-result');
    const jsonOutputContainer = document.getElementById('json-output-container');
    const copyJsonResult = document.getElementById('copy-json-result');

    if (jsonFormatterForm) {
      jsonFormatterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const input = jsonInput.value.trim();
        const operation = jsonOperation.value;
        const indentValue = jsonIndent.value;
        
        // Define actual indent to use
        let indent;
        switch (indentValue) {
          case '2':
            indent = 2;
            break;
          case '4':
            indent = 4;
            break;
          case 'tab':
            indent = '\t';
            break;
          case '0':
            indent = null; // Use null for no indentation
            break;
          default:
            indent = 2;
        }
        
        try {
          // First parse the JSON to validate it
          let parsedJSON;
          try {
            parsedJSON = JSON.parse(input);
          } catch (error) {
            throw new Error(`Invalid JSON: ${error.message}`);
          }
          
          let result = '';
          let contentType = 'json';
          
          switch (operation) {
            case 'format':
              // Format the JSON with specified indentation
              result = indent === null 
                ? JSON.stringify(parsedJSON) 
                : JSON.stringify(parsedJSON, null, indent);
              break;
              
            case 'minify':
              // Minify the JSON (no indentation or whitespace)
              result = JSON.stringify(parsedJSON);
              break;
              
            case 'to-yaml':
              // Convert to YAML
              result = jsonToYaml(parsedJSON, indent === null ? 2 : indent);
              contentType = 'yaml';
              break;
              
            case 'to-csv':
              // Convert to CSV (flat objects only)
              result = jsonToCsv(parsedJSON);
              contentType = 'csv';
              break;
              
            default:
              result = indent === null 
                ? JSON.stringify(parsedJSON) 
                : JSON.stringify(parsedJSON, null, indent);
          }
          
          // Highlight the output based on content type
          let highlightedOutput;
          if (contentType === 'json') {
            highlightedOutput = syntaxHighlight(result);
          } else {
            highlightedOutput = escapeHtml(result);
          }
          
          // Display the result
          jsonOutputContainer.innerHTML = `<pre class="json-output"><code>${highlightedOutput}</code></pre>`;
          jsonResult.style.display = 'block';
          
          // Set up copy button
          if (copyJsonResult) {
            copyJsonResult.onclick = function() {
              navigator.clipboard.writeText(result).then(() => {
                this.innerHTML = '<i class="bi bi-check"></i> Copied!';
                setTimeout(() => {
                  this.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
                }, 2000);
              });
            };
          }
          
        } catch (error) {
          jsonOutputContainer.innerHTML = `
            <div class="error-message">
              <i class="bi bi-exclamation-triangle"></i>
              ${error.message}
            </div>
          `;
          jsonResult.style.display = 'block';
        }
      });
    }

    // Function to convert JSON to YAML
    function jsonToYaml(json, indent) {
      let result = '';
      const actualIndent = typeof indent === 'number' ? ' '.repeat(indent) : indent;
      
      function processValue(value, level = 0) {
        const indentation = actualIndent.repeat(level);
        
        if (value === null) {
          return 'null';
        } else if (typeof value === 'object') {
          if (Array.isArray(value)) {
            if (value.length === 0) return '[]';
            
            let arrayResult = '';
            for (const item of value) {
              arrayResult += `${indentation}- ${processValue(item, level + 1).trim()}\n`;
            }
            return '\n' + arrayResult;
          } else {
            if (Object.keys(value).length === 0) return '{}';
            
            let objectResult = '\n';
            for (const [key, val] of Object.entries(value)) {
              objectResult += `${indentation}${key}: ${processValue(val, level + 1)}\n`;
            }
            return objectResult;
          }
        } else if (typeof value === 'string') {
          // Check if string needs quotes
          if (value.includes('\n') || value.match(/[:#{}[\],&*?|<>=!%@`]/)) {
            return `"${value.replace(/"/g, '\\"')}"`;
          }
          return value;
        } else {
          return String(value);
        }
      }
      
      // Process the root object
      if (Array.isArray(json)) {
        for (const item of json) {
          result += `- ${processValue(item, 1).trim()}\n`;
        }
      } else {
        for (const [key, value] of Object.entries(json)) {
          result += `${key}: ${processValue(value, 1)}\n`;
        }
      }
      
      return result;
    }

    // Function to convert JSON to CSV (for flat objects)
    function jsonToCsv(json) {
      if (!Array.isArray(json) || json.length === 0) {
        throw new Error('CSV conversion requires an array of objects');
      }
      
      // Check if all items are flat objects (no nested objects/arrays)
      for (const item of json) {
        if (typeof item !== 'object' || item === null) {
          throw new Error('CSV conversion requires an array of objects');
        }
        
        for (const value of Object.values(item)) {
          if (typeof value === 'object' && value !== null) {
            throw new Error('CSV conversion does not support nested objects or arrays');
          }
        }
      }
      
      // Get all unique keys
      const keys = [...new Set(json.flatMap(item => Object.keys(item)))];
      
      // Create header row
      let csv = keys.map(key => `"${key}"`).join(',') + '\n';
      
      // Create data rows
      for (const item of json) {
        const row = keys.map(key => {
          const value = item[key] !== undefined ? item[key] : '';
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : `"${value}"`;
        });
        csv += row.join(',') + '\n';
      }
      
      return csv;
    }

    // Function to escape HTML to prevent XSS
    function escapeHtml(unsafe) {
      return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // Add a syntax highlighting function for JSON
    function syntaxHighlight(json) {
      if (typeof json !== 'string') {
        json = JSON.stringify(json, null, 2);
      }
      
      json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        let cls = 'json-number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'json-key';
          } else {
            cls = 'json-string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'json-boolean';
        } else if (/null/.test(match)) {
          cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
      });
    }

    // Unit Converter Logic - add this at the end of your file
    const unitType = document.getElementById('unit-type');
    const fromValue = document.getElementById('from-value');
    const fromUnit = document.getElementById('from-unit');
    const toValue = document.getElementById('to-value');
    const toUnit = document.getElementById('to-unit');
    const swapUnits = document.getElementById('swap-units');
    const resetConverter = document.getElementById('reset-converter');
    const conversionFormula = document.getElementById('conversion-formula');

    // Unit conversion data
    const unitData = {
      length: {
        name: 'Length',
        units: {
          mm: { name: 'Millimeters', factor: 0.001 },
          cm: { name: 'Centimeters', factor: 0.01 },
          m: { name: 'Meters', factor: 1 },
          km: { name: 'Kilometers', factor: 1000 },
          in: { name: 'Inches', factor: 0.0254 },
          ft: { name: 'Feet', factor: 0.3048 },
          yd: { name: 'Yards', factor: 0.9144 },
          mi: { name: 'Miles', factor: 1609.344 }
        }
      },
      weight: {
        name: 'Weight/Mass',
        units: {
          mg: { name: 'Milligrams', factor: 0.000001 },
          g: { name: 'Grams', factor: 0.001 },
          kg: { name: 'Kilograms', factor: 1 },
          t: { name: 'Metric Tons', factor: 1000 },
          oz: { name: 'Ounces', factor: 0.028349523125 },
          lb: { name: 'Pounds', factor: 0.45359237 },
          st: { name: 'Stone', factor: 6.35029318 }
        }
      },
      temperature: {
        name: 'Temperature',
        units: {
          c: { name: 'Celsius', convert: val => val },
          f: { name: 'Fahrenheit', convert: val => (val * 9/5) + 32, reverse: val => (val - 32) * 5/9 },
          k: { name: 'Kelvin', convert: val => val + 273.15, reverse: val => val - 273.15 }
        },
        special: true
      },
      area: {
        name: 'Area',
        units: {
          mm2: { name: 'Square Millimeters', factor: 0.000001 },
          cm2: { name: 'Square Centimeters', factor: 0.0001 },
          m2: { name: 'Square Meters', factor: 1 },
          ha: { name: 'Hectares', factor: 10000 },
          km2: { name: 'Square Kilometers', factor: 1000000 },
          in2: { name: 'Square Inches', factor: 0.00064516 },
          ft2: { name: 'Square Feet', factor: 0.09290304 },
          ac: { name: 'Acres', factor: 4046.8564224 },
          mi2: { name: 'Square Miles', factor: 2589988.110336 }
        }
      },
      volume: {
        name: 'Volume',
        units: {
          ml: { name: 'Milliliters', factor: 0.001 },
          l: { name: 'Liters', factor: 1 },
          m3: { name: 'Cubic Meters', factor: 1000 },
          tsp: { name: 'Teaspoons (US)', factor: 0.00492892159375 },
          tbsp: { name: 'Tablespoons (US)', factor: 0.01478676478125 },
          cup: { name: 'Cups (US)', factor: 0.2365882365 },
          pt: { name: 'Pints (US)', factor: 0.473176473 },
          qt: { name: 'Quarts (US)', factor: 0.946352946 },
          gal: { name: 'Gallons (US)', factor: 3.785411784 },
          floz: { name: 'Fluid Ounces (US)', factor: 0.0295735295625 }
        }
      },
      speed: {
        name: 'Speed',
        units: {
          mps: { name: 'Meters per Second', factor: 1 },
          kph: { name: 'Kilometers per Hour', factor: 0.277777778 },
          mph: { name: 'Miles per Hour', factor: 0.44704 },
          fps: { name: 'Feet per Second', factor: 0.3048 },
          knot: { name: 'Knots', factor: 0.514444444 }
        }
      },
      time: {
        name: 'Time',
        units: {
          ms: { name: 'Milliseconds', factor: 0.001 },
          s: { name: 'Seconds', factor: 1 },
          min: { name: 'Minutes', factor: 60 },
          h: { name: 'Hours', factor: 3600 },
          day: { name: 'Days', factor: 86400 },
          wk: { name: 'Weeks', factor: 604800 },
          mo: { name: 'Months (avg)', factor: 2629746 },
          yr: { name: 'Years', factor: 31556952 }
        }
      },
      digital: {
        name: 'Digital Storage',
        units: {
          bit: { name: 'Bits', factor: 0.125 },
          B: { name: 'Bytes', factor: 1 },
          KB: { name: 'Kilobytes', factor: 1024 },
          MB: { name: 'Megabytes', factor: 1048576 },
          GB: { name: 'Gigabytes', factor: 1073741824 },
          TB: { name: 'Terabytes', factor: 1099511627776 }
        }
      }
    };

    function setupUnitConverter() {
      if (!unitType || !fromUnit || !toUnit) return;
      
      // Initialize with default values
      populateUnitDropdowns(unitType.value);
      
      // Add event listeners
      unitType.addEventListener('change', function() {
        populateUnitDropdowns(this.value);
        updateConversion();
      });
      
      fromValue.addEventListener('input', updateConversion);
      fromUnit.addEventListener('change', updateConversion);
      toUnit.addEventListener('change', updateConversion);
      
      if (swapUnits) {
        swapUnits.addEventListener('click', function() {
          const tempUnit = fromUnit.value;
          fromUnit.value = toUnit.value;
          toUnit.value = tempUnit;
          updateConversion();
        });
      }
      
      if (resetConverter) {
        resetConverter.addEventListener('click', function() {
          fromValue.value = 1;
          populateUnitDropdowns(unitType.value, true);
          updateConversion();
        });
      }
      
      // Initial conversion
      updateConversion();
    }

    function populateUnitDropdowns(type, resetSelections = false) {
      const data = unitData[type];
      if (!data) return;
      
      // Clear existing options
      fromUnit.innerHTML = '';
      toUnit.innerHTML = '';
      
      // Add new options
      for (const [code, unit] of Object.entries(data.units)) {
        const fromOption = document.createElement('option');
        fromOption.value = code;
        fromOption.textContent = unit.name;
        fromUnit.appendChild(fromOption);
        
        const toOption = document.createElement('option');
        toOption.value = code;
        toOption.textContent = unit.name;
        toUnit.appendChild(toOption);
      }
      
      // Set default selections
      if (resetSelections) {
        const keys = Object.keys(data.units);
        if (keys.length >= 2) {
          fromUnit.value = keys[0];
          toUnit.value = keys[1];
        }
      }
    }

    function updateConversion() {
      if (!unitType || !fromValue || !fromUnit || !toValue || !toUnit || !conversionFormula) return;
      
      const type = unitType.value;
      const from = fromUnit.value;
      const to = toUnit.value;
      const value = parseFloat(fromValue.value) || 0;
      
      const data = unitData[type];
      if (!data) return;
      
      let result;
      let formula = '';
      
      // Special case for temperature
      if (data.special) {
        // First convert to base unit (Celsius)
        let baseValue = from === 'c' ? value : data.units[from].reverse(value);
        // Then convert from base to target
        result = to === 'c' ? baseValue : data.units[to].convert(baseValue);
        
        if (from === 'c' && to === 'f') {
          formula = `${value}°C × (9/5) + 32 = ${result.toFixed(2)}°F`;
        } else if (from === 'f' && to === 'c') {
          formula = `(${value}°F - 32) × (5/9) = ${result.toFixed(2)}°C`;
        } else if (from === 'c' && to === 'k') {
          formula = `${value}°C + 273.15 = ${result.toFixed(2)}K`;
        } else if (from === 'k' && to === 'c') {
          formula = `${value}K - 273.15 = ${result.toFixed(2)}°C`;
        } else if (from === 'f' && to === 'k') {
          formula = `(${value}°F - 32) × (5/9) + 273.15 = ${result.toFixed(2)}K`;
        } else if (from === 'k' && to === 'f') {
          formula = `(${value}K - 273.15) × (9/5) + 32 = ${result.toFixed(2)}°F`;
        } else {
          formula = `${value} ${data.units[from].name} = ${result.toFixed(2)} ${data.units[to].name}`;
        }
      } else {
        // Standard conversion using factors
        const fromFactor = data.units[from].factor;
        const toFactor = data.units[to].factor;
        
        // Convert to base unit, then to target unit
        result = (value * fromFactor) / toFactor;
        
        // Format the formula differently if fromFactor or toFactor is 1
        if (from === to) {
          formula = `${value} ${data.units[from].name} = ${result.toFixed(5)} ${data.units[to].name}`;
        } else if (fromFactor === 1) {
          formula = `${value} ${data.units[from].name} ÷ ${toFactor} = ${result.toFixed(5)} ${data.units[to].name}`;
        } else if (toFactor === 1) {
          formula = `${value} ${data.units[from].name} × ${fromFactor} = ${result.toFixed(5)} ${data.units[to].name}`;
        } else {
          formula = `${value} ${data.units[from].name} × (${fromFactor} ÷ ${toFactor}) = ${result.toFixed(5)} ${data.units[to].name}`;
        }
      }
      
      // Update the result
      toValue.value = result.toFixed(5);
      conversionFormula.textContent = formula;
      
      // Highlight the formula for clarity
      conversionFormula.innerHTML = `<strong>${formula}</strong>`;
    }

    function initImageCompressor() {
      const fileInput = document.getElementById('compress-image-upload');
      const previewContainer = document.getElementById('compress-image-preview-container');
      const previewElement = document.getElementById('compress-image-preview');
      const originalSizeElement = document.getElementById('compress-original-size');
      const compressOptions = document.getElementById('compress-options');
      const compressButton = document.getElementById('compress-button');
      const compressedResult = document.getElementById('compressed-result');
      const compressedImageContainer = document.getElementById('compressed-image-container');
      const compressedSizeElement = document.getElementById('compressed-size');
      const compressionInfoElement = document.querySelector('.compression-info');
      const downloadButton = document.getElementById('download-compressed');
      const qualitySlider = document.getElementById('quality-slider');
      const qualityValue = document.getElementById('quality-value');
      
      let originalImage = null;
      let originalFile = null;
      
      // Update quality value display
      qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = qualitySlider.value;
      });
      
      // Handle file selection
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          originalFile = e.target.files[0];
          const reader = new FileReader();
          
          reader.onload = (event) => {
            // Display preview
            originalImage = new Image();
            originalImage.src = event.target.result;
            
            originalImage.onload = () => {
              previewElement.innerHTML = '';
              const img = document.createElement('img');
              img.src = event.target.result;
              img.style.maxWidth = '100%';
              img.style.maxHeight = '300px';
              previewElement.appendChild(img);
              
              // Show file size
              const fileSizeMB = (originalFile.size / (1024 * 1024)).toFixed(2);
              originalSizeElement.textContent = `Original Size: ${fileSizeMB} MB (${originalFile.size.toLocaleString()} bytes)`;
              
              // Show compression options
              previewContainer.style.display = 'block';
              compressOptions.style.display = 'block';
              compressedResult.style.display = 'none';
            };
          };
          
          reader.readAsDataURL(originalFile);
        }
      });
      
      // Compress image
      compressButton.addEventListener('click', () => {
        if (!originalImage) return;
        
        const targetSize = parseInt(document.getElementById('target-size-input').value) * 1024; // Convert KB to bytes
        const initialQuality = parseInt(qualitySlider.value) / 100;
        const outputFormat = document.querySelector('input[name="output-format"]:checked').value;
        
        compressImage(originalImage, targetSize, initialQuality, outputFormat);
      });
      
      // Function to compress image
      function compressImage(image, targetSize, quality, format) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match image
        canvas.width = image.width;
        canvas.height = image.height;
        
        // Draw image to canvas
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        
        // Binary search to find the optimal quality
        compressBinarySearch(canvas, targetSize, 0.01, quality, format, 15);
      }
      
      // Binary search for optimal compression
      function compressBinarySearch(canvas, targetSize, min, max, format, attempts) {
        const mid = (min + max) / 2;
        const quality = Math.max(0.01, Math.min(1.0, mid)); // Lower minimum quality to 0.01
        
        const dataUrl = canvas.toDataURL(`image/${format}`, quality);
        const blob = dataURItoBlob(dataUrl);
        
        // Increase max attempts to 15
        if (attempts <= 0 || Math.abs(max - min) < 0.001) { // Smaller threshold
          displayCompressedImage(dataUrl, blob, quality, format);
          return;
        }
        
        // Reduce tolerance to 2%
        if (Math.abs(blob.size - targetSize) < targetSize * 0.02) {
          displayCompressedImage(dataUrl, blob, quality, format);
        } else if (blob.size > targetSize) {
          compressBinarySearch(canvas, targetSize, min, mid, format, attempts - 1);
        } else {
          compressBinarySearch(canvas, targetSize, mid, max, format, attempts - 1);
        }
      }
      
      // Display compressed image results
      function displayCompressedImage(dataUrl, blob, quality, format) {
        const compressedImage = new Image();
        compressedImage.src = dataUrl;
        
        compressedImage.onload = () => {
          // Show the compressed image
          compressedImageContainer.innerHTML = '';
          const img = document.createElement('img');
          img.src = dataUrl;
          img.style.maxWidth = '100%';
          img.style.maxHeight = '300px';
          compressedImageContainer.appendChild(img);
          
          // Show size info
          const originalSizeMB = (originalFile.size / (1024 * 1024)).toFixed(2);
          const compressedSizeMB = (blob.size / (1024 * 1024)).toFixed(2);
          const compressionRatio = ((1 - (blob.size / originalFile.size)) * 100).toFixed(1);
          
          compressedSizeElement.textContent = `Compressed Size: ${compressedSizeMB} MB (${blob.size.toLocaleString()} bytes)`;
          compressionInfoElement.innerHTML = `
            <strong>Compression Results:</strong><br>
            Original: ${originalSizeMB} MB | Compressed: ${compressedSizeMB} MB<br>
            Compression Ratio: ${compressionRatio}%<br>
            Quality: ${Math.round(quality * 100)}% | Format: ${format.toUpperCase()}
          `;
          
          // Setup download button
          downloadButton.onclick = () => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `compressed_image.${format}`;
            link.click();
          };
          
          // Show results
          compressedResult.style.display = 'block';
        };
      }
      
      // Convert Data URI to Blob
      function dataURItoBlob(dataURI) {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        
        return new Blob([ab], { type: mimeString });
      }

      // Add reset button
      const resetButton = document.getElementById('reset-compressor');
      if (resetButton) {
        resetButton.addEventListener('click', () => {
          // Clear image and reset UI
          fileInput.value = '';
          originalImage = null;
          originalFile = null;
          previewElement.innerHTML = '';
          originalSizeElement.textContent = '';
          previewContainer.style.display = 'none';
          compressOptions.style.display = 'none';
          compressedResult.style.display = 'none';
        });
      }
    }
    
    // Initialize all tools that need setup
    initImageCompressor();
    setupUnitConverter();

    function initCurrencyConverter() {
      const fromCurrency = document.getElementById('from-currency');
      const toCurrency = document.getElementById('to-currency');
      const amount = document.getElementById('amount');
      const convertBtn = document.getElementById('convert-currency');
      const swapBtn = document.getElementById('swap-currencies');
      const resultDiv = document.getElementById('conversion-result');
      const resultAmount = document.getElementById('result-amount');
      const exchangeRate = document.getElementById('exchange-rate');
      const lastUpdated = document.getElementById('last-updated');
      const apiError = document.getElementById('api-error');
      
      // API details - using ExchangeRate-API's free tier
      const apiUrl = 'https://open.er-api.com/v6/latest/';
      
      // Common currencies to show at the top
      const commonCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR'];
      
      // Cached exchange rates data
      let ratesData = null;
      let lastFetchTime = null;
      
      // Populate currency dropdowns
      function populateCurrencyDropdowns() {
        fetch(apiUrl + 'USD')
          .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
          })
          .then(data => {
            if (data.result !== 'success') {
              throw new Error('API returned an error');
            }
            
            ratesData = data;
            lastFetchTime = new Date(data.time_last_update_utc);
            
            // Get all available currencies
            const currencies = Object.keys(data.rates);
            
            // Create an array of currency objects with code and name
            const currencyObjects = currencies.map(code => ({
              code,
              name: getCurrencyName(code),
              isCommon: commonCurrencies.includes(code)
            }));
            
            // Sort currencies: first by common status, then alphabetically by name
            currencyObjects.sort((a, b) => {
              // First sort by common status
              if (a.isCommon && !b.isCommon) return -1;
              if (!a.isCommon && b.isCommon) return 1;
              
              // Then sort alphabetically by name
              return a.name.localeCompare(b.name);
            });
            
            // Clear existing options
            fromCurrency.innerHTML = '';
            toCurrency.innerHTML = '';
            
            // Add options for each currency
            currencyObjects.forEach(currency => {
              const fromOption = document.createElement('option');
              fromOption.value = currency.code;
              fromOption.textContent = `${currency.code} - ${currency.name}`;
              fromCurrency.appendChild(fromOption);
              
              const toOption = document.createElement('option');
              toOption.value = currency.code;
              toOption.textContent = `${currency.code} - ${currency.name}`;
              toCurrency.appendChild(toOption);
            });
            
            // Set default selections
            fromCurrency.value = 'USD';
            toCurrency.value = 'EUR';
            
            // Hide error message if it was shown
            apiError.style.display = 'none';
            
            // Initial conversion
            convertCurrency();
          })
          .catch(error => {
            console.error('Error fetching currency data:', error);
            apiError.textContent = `Error loading currency data: ${error.message}`;
            apiError.style.display = 'block';
          });
      }
      
      // Convert currency
      function convertCurrency() {
        const from = fromCurrency.value;
        const to = toCurrency.value;
        const amountValue = parseFloat(amount.value) || 1;
        
        // Check if we need to fetch fresh data (if base currency changed or data is old)
        const shouldRefetch = !ratesData || ratesData.base_code !== from || 
          (new Date() - lastFetchTime > 60 * 60 * 1000); // Refetch if older than 1 hour
        
        if (shouldRefetch) {
          fetch(apiUrl + from)
            .then(response => {
              if (!response.ok) throw new Error('Network response was not ok');
              return response.json();
            })
            .then(data => {
              if (data.result !== 'success') {
                throw new Error('API returned an error');
              }
                
              ratesData = data;
              lastFetchTime = new Date(data.time_last_update_utc);
              calculateAndDisplayResult(from, to, amountValue);
              
              // Hide error message if it was shown
              apiError.style.display = 'none';
            })
            .catch(error => {
              console.error('Error fetching currency data:', error);
              apiError.textContent = `Error: ${error.message}`;
              apiError.style.display = 'block';
              resultDiv.style.display = 'none';
            });
        } else {
          calculateAndDisplayResult(from, to, amountValue);
        }
      }
      
      // Calculate and display the conversion result
      function calculateAndDisplayResult(from, to, amountValue) {
        if (!ratesData || !ratesData.rates[to]) {
          apiError.textContent = 'Error: Currency rate not available';
          apiError.style.display = 'block';
          resultDiv.style.display = 'none';
          return;
        }
        
        const rate = ratesData.rates[to];
        const convertedAmount = amountValue * rate;
        
        const fromName = getCurrencyName(from);
        const toName = getCurrencyName(to);
        
        resultAmount.textContent = `${amountValue.toLocaleString()} ${from} = ${convertedAmount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })} ${to}`;
        
        exchangeRate.textContent = `1 ${from} (${fromName}) = ${rate.toFixed(6)} ${to} (${toName})`;
        lastUpdated.textContent = `Last updated: ${new Date(ratesData.time_last_update_utc).toLocaleString()}`;
        
        resultDiv.style.display = 'block';
        apiError.style.display = 'none';
      }
      
      // Helper function to get currency names
      function getCurrencyName(code) {
        const currencyNames = {
          AED: 'United Arab Emirates Dirham',
          AFN: 'Afghan Afghani',
          ALL: 'Albanian Lek',
          AMD: 'Armenian Dram',
          ANG: 'Netherlands Antillean Guilder',
          AOA: 'Angolan Kwanza',
          ARS: 'Argentine Peso',
          AUD: 'Australian Dollar',
          AWG: 'Aruban Florin',
          AZN: 'Azerbaijani Manat',
          BAM: 'Bosnia-Herzegovina Convertible Mark',
          BBD: 'Barbadian Dollar',
          BDT: 'Bangladeshi Taka',
          BGN: 'Bulgarian Lev',
          BHD: 'Bahraini Dinar',
          BIF: 'Burundian Franc',
          BMD: 'Bermudan Dollar',
          BND: 'Brunei Dollar',
          BOB: 'Bolivian Boliviano',
          BRL: 'Brazilian Real',
          BSD: 'Bahamian Dollar',
          BTC: 'Bitcoin',
          BTN: 'Bhutanese Ngultrum',
          BWP: 'Botswanan Pula',
          BYN: 'Belarusian Ruble',
          BZD: 'Belize Dollar',
          CAD: 'Canadian Dollar',
          CDF: 'Congolese Franc',
          CHF: 'Swiss Franc',
          CLF: 'Chilean Unit of Account (UF)',
          CLP: 'Chilean Peso',
          CNH: 'Chinese Yuan (Offshore)',
          CNY: 'Chinese Yuan',
          COP: 'Colombian Peso',
          CRC: 'Costa Rican Colón',
          CUC: 'Cuban Convertible Peso',
          CUP: 'Cuban Peso',
          CVE: 'Cape Verdean Escudo',
          CZK: 'Czech Republic Koruna',
          DJF: 'Djiboutian Franc',
          DKK: 'Danish Krone',
          DOP: 'Dominican Peso',
          DZD: 'Algerian Dinar',
          EGP: 'Egyptian Pound',
          ERN: 'Eritrean Nakfa',
          ETB: 'Ethiopian Birr',
          EUR: 'Euro',
          FJD: 'Fijian Dollar',
          FKP: 'Falkland Islands Pound',
          GBP: 'British Pound Sterling',
          GEL: 'Georgian Lari',
          GGP: 'Guernsey Pound',
          GHS: 'Ghanaian Cedi',
          GIP: 'Gibraltar Pound',
          GMD: 'Gambian Dalasi',
          GNF: 'Guinean Franc',
          GTQ: 'Guatemalan Quetzal',
          GYD: 'Guyanaese Dollar',
          HKD: 'Hong Kong Dollar',
          HNL: 'Honduran Lempira',
          HRK: 'Croatian Kuna',
          HTG: 'Haitian Gourde',
          HUF: 'Hungarian Forint',
          IDR: 'Indonesian Rupiah',
          ILS: 'Israeli New Shekel',
          IMP: 'Manx Pound',
          INR: 'Indian Rupee',
          IQD: 'Iraqi Dinar',
          IRR: 'Iranian Rial',
          ISK: 'Icelandic Króna',
          JEP: 'Jersey Pound',
          JMD: 'Jamaican Dollar',
          JOD: 'Jordanian Dinar',
          JPY: 'Japanese Yen',
          KES: 'Kenyan Shilling',
          KGS: 'Kyrgystani Som',
          KHR: 'Cambodian Riel',
          KMF: 'Comorian Franc',
          KPW: 'North Korean Won',
          KRW: 'South Korean Won',
          KWD: 'Kuwaiti Dinar',
          KYD: 'Cayman Islands Dollar',
          KZT: 'Kazakhstani Tenge',
          LAK: 'Laotian Kip',
          LBP: 'Lebanese Pound',
          LKR: 'Sri Lankan Rupee',
          LRD: 'Liberian Dollar',
          LSL: 'Lesotho Loti',
          LYD: 'Libyan Dinar',
          MAD: 'Moroccan Dirham',
          MDL: 'Moldovan Leu',
          MGA: 'Malagasy Ariary',
          MKD: 'Macedonian Denar',
          MMK: 'Myanma Kyat',
          MNT: 'Mongolian Tugrik',
          MOP: 'Macanese Pataca',
          MRU: 'Mauritanian Ouguiya',
          MUR: 'Mauritian Rupee',
          MVR: 'Maldivian Rufiyaa',
          MWK: 'Malawian Kwacha',
          MXN: 'Mexican Peso',
          MYR: 'Malaysian Ringgit',
          MZN: 'Mozambican Metical',
          NAD: 'Namibian Dollar',
          NGN: 'Nigerian Naira',
          NIO: 'Nicaraguan Córdoba',
          NOK: 'Norwegian Krone',
          NPR: 'Nepalese Rupee',
          NZD: 'New Zealand Dollar',
          OMR: 'Omani Rial',
          PAB: 'Panamanian Balboa',
          PEN: 'Peruvian Nuevo Sol',
          PGK: 'Papua New Guinean Kina',
          PHP: 'Philippine Peso',
          PKR: 'Pakistani Rupee',
          PLN: 'Polish Złoty',
          PYG: 'Paraguayan Guarani',
          QAR: 'Qatari Rial',
          RON: 'Romanian Leu',
          RSD: 'Serbian Dinar',
          RUB: 'Russian Ruble',
          RWF: 'Rwandan Franc',
          SAR: 'Saudi Riyal',
          SBD: 'Solomon Islands Dollar',
          SCR: 'Seychellois Rupee',
          SDG: 'Sudanese Pound',
          SEK: 'Swedish Krona',
          SGD: 'Singapore Dollar',
          SHP: 'Saint Helena Pound',
          SLL: 'Sierra Leonean Leone',
          SOS: 'Somali Shilling',
          SRD: 'Surinamese Dollar',
          SSP: 'South Sudanese Pound',
          STN: 'São Tomé and Príncipe Dobra',
          SVC: 'Salvadoran Colón',
          SYP: 'Syrian Pound',
          SZL: 'Swazi Lilangeni',
          THB: 'Thai Baht',
          TJS: 'Tajikistani Somoni',
          TMT: 'Turkmenistani Manat',
          TND: 'Tunisian Dinar',
          TOP: 'Tongan Paʻanga',
          TRY: 'Turkish Lira',
          TTD: 'Trinidad and Tobago Dollar',
          TWD: 'New Taiwan Dollar',
          TZS: 'Tanzanian Shilling',
          UAH: 'Ukrainian Hryvnia',
          UGX: 'Ugandan Shilling',
          USD: 'United States Dollar',
          UYU: 'Uruguayan Peso',
          UZS: 'Uzbekistan Som',
          VES: 'Venezuelan Bolívar Soberano',
          VND: 'Vietnamese Dong',
          VUV: 'Vanuatu Vatu',
          WST: 'Samoan Tala',
          XAF: 'CFA Franc BEAC',
          XAG: 'Silver Ounce',
          XAU: 'Gold Ounce',
          XCD: 'East Caribbean Dollar',
          XDR: 'Special Drawing Rights',
          XOF: 'CFA Franc BCEAO',
          XPD: 'Palladium Ounce',
          XPF: 'CFP Franc',
          XPT: 'Platinum Ounce',
          YER: 'Yemeni Rial',
          ZAR: 'South African Rand',
          ZMW: 'Zambian Kwacha',
          ZWL: 'Zimbabwean Dollar'
        };
        
        return currencyNames[code] || 'Unknown Currency';
      }
      
      // Event listeners
      convertBtn.addEventListener('click', convertCurrency);
      
      swapBtn.addEventListener('click', function() {
        const temp = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = temp;
        convertCurrency();
      });
      
      // Also convert when input changes
      amount.addEventListener('input', convertCurrency);
      fromCurrency.addEventListener('change', convertCurrency);
      toCurrency.addEventListener('change', convertCurrency);
      
      // Initialize
      populateCurrencyDropdowns();
    }

    // File Converter start
    document.getElementById('open-file-converter').addEventListener('click', () => {
      openModal('file-converter-modal');
      initFileConverter();
    });

    // File Converter Logic
    function initFileConverter() {
      const fileInput = document.getElementById('file-upload');
      const conversionOptions = document.getElementById('conversion-options');
      const targetFormat = document.getElementById('target-format');
      const conversionSettings = document.getElementById('conversion-settings');
      const convertBtn = document.getElementById('convert-file-btn');
      const conversionResult = document.getElementById('conversion-result');
      const conversionStatus = document.getElementById('conversion-status');
      const downloadActions = document.querySelector('.download-actions');
      const downloadBtn = document.getElementById('download-converted');
      
      let currentFile = null;
      let convertedFile = null;
      
      // Supported conversion types
      const conversionTypes = {
        // Image conversions
        'image/jpeg': ['image/png', 'image/webp', 'image/gif', 'image/bmp'],
        'image/png': ['image/jpeg', 'image/webp', 'image/gif', 'image/bmp'],
        'image/webp': ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'],
        'image/gif': ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'],
        'image/bmp': ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        
        // Document conversions (requires external libraries)
        'application/pdf': ['image/jpeg', 'image/png'],
        'application/epub+zip': ['application/pdf', 'text/html', 'text/plain'],
        'text/plain': ['application/pdf', 'text/html'],
        'text/html': ['application/pdf', 'text/plain', 'text/markdown', 'application/epub+zip'],
        'text/markdown': ['text/html', 'application/pdf', 'application/epub+zip'],
        
        // Audio conversions
        'audio/mpeg': ['audio/wav', 'audio/ogg'],
        'audio/wav': ['audio/mpeg', 'audio/ogg'],
        'audio/ogg': ['audio/mpeg', 'audio/wav'],
      };
      
      // Format display names
      const formatNames = {
        'image/jpeg': 'JPEG Image (.jpg)',
        'image/png': 'PNG Image (.png)',
        'image/webp': 'WebP Image (.webp)',
        'image/gif': 'GIF Image (.gif)',
        'image/bmp': 'Bitmap Image (.bmp)',
        'application/pdf': 'PDF Document (.pdf)',
        'application/epub+zip': 'EPUB eBook (.epub)',
        'text/plain': 'Text File (.txt)',
        'text/html': 'HTML Document (.html)',
        'text/markdown': 'Markdown Document (.md)',
        'audio/mpeg': 'MP3 Audio (.mp3)',
        'audio/wav': 'WAV Audio (.wav)',
        'audio/ogg': 'OGG Audio (.ogg)'
      };
      
      // File extensions
      const fileExtensions = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
        'image/bmp': 'bmp',
        'application/pdf': 'pdf',
        'application/epub+zip': 'epub',
        'text/plain': 'txt',
        'text/html': 'html',
        'text/markdown': 'md',
        'audio/mpeg': 'mp3',
        'audio/wav': 'wav',
        'audio/ogg': 'ogg'
      };
      
      // Handle file selection
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          currentFile = e.target.files[0];
          
          // Show conversion options based on file type
          showConversionOptions(currentFile.type);
          
          // Reset previous results
          conversionResult.style.display = 'none';
          downloadActions.style.display = 'none';
          convertedFile = null;
        }
      });
      
      // Show conversion options based on file type
      function showConversionOptions(fileType) {
        // Clear previous options
        targetFormat.innerHTML = '';
        conversionSettings.innerHTML = '';
        
        // Check if this file type is supported
        if (!conversionTypes[fileType]) {
          conversionOptions.style.display = 'none';
          conversionResult.style.display = 'block';
          conversionStatus.innerHTML = `
            <div class="error-message">
              <i class="bi bi-exclamation-triangle"></i>
              Sorry, conversion from ${fileType} is not supported yet.
            </div>
          `;
          return;
        }
        
        // Populate conversion options
        const targetFormats = conversionTypes[fileType];
        targetFormats.forEach(format => {
          const option = document.createElement('option');
          option.value = format;
          option.textContent = formatNames[format] || format;
          targetFormat.appendChild(option);
        });
        
        // Show conversion-specific settings
        updateConversionSettings(fileType, targetFormat.value);
        
        // Show the options
        conversionOptions.style.display = 'block';
      }
      
      // Update settings based on conversion type
      targetFormat.addEventListener('change', () => {
        updateConversionSettings(currentFile.type, targetFormat.value);
      });
      
      // Show settings specific to the conversion type
      function updateConversionSettings(fromType, toType) {
        conversionSettings.innerHTML = '';
        
        // Settings for image conversions
        if (fromType.startsWith('image/') && toType.startsWith('image/')) {
          // Quality setting for lossy formats
          if (toType === 'image/jpeg' || toType === 'image/webp') {
            conversionSettings.innerHTML = `
              <div class="setting-group">
                <label for="image-quality">Quality:</label>
                <div class="quality-slider-container">
                  <input type="range" id="image-quality" min="1" max="100" value="90" class="quality-slider">
                  <span id="quality-value">90%</span>
                </div>
              </div>
            `;
            
            // Update quality value display
            const qualitySlider = document.getElementById('image-quality');
            const qualityValue = document.getElementById('quality-value');
            
            qualitySlider.addEventListener('input', () => {
              qualityValue.textContent = `${qualitySlider.value}%`;
            });
          }
          
          // Image dimensions
          conversionSettings.innerHTML += `
            <div class="setting-group">
              <label for="resize-image">Resize image:</label>
              <div class="resize-option">
                <input type="checkbox" id="resize-image" class="resize-checkbox">
                <div id="resize-dimensions" style="display: none; margin-top: 0.5rem;">
                  <div style="display: flex; gap: 1rem;">
                    <div>
                      <label for="image-width">Width:</label>
                      <input type="number" id="image-width" class="tool-input" placeholder="Width">
                    </div>
                    <div>
                      <label for="image-height">Height:</label>
                      <input type="number" id="image-height" class="tool-input" placeholder="Height">
                    </div>
                  </div>
                  <div style="margin-top: 0.5rem;">
                    <input type="checkbox" id="maintain-aspect-ratio" checked>
                    <label for="maintain-aspect-ratio">Maintain aspect ratio</label>
                  </div>
                </div>
              </div>
            </div>
          `;
          
          // Toggle resize options
          const resizeCheckbox = document.getElementById('resize-image');
          const resizeDimensions = document.getElementById('resize-dimensions');
          
          resizeCheckbox.addEventListener('change', () => {
            resizeDimensions.style.display = resizeCheckbox.checked ? 'block' : 'none';
          });
        }
        
        // Settings for PDF to image conversion
        if (fromType === 'application/pdf' && toType.startsWith('image/')) {
          conversionSettings.innerHTML = `
            <div class="setting-group">
              <label for="pdf-page">Page to convert:</label>
              <input type="number" id="pdf-page" class="tool-input" value="1" min="1">
            </div>
            <div class="setting-group">
              <label for="pdf-dpi">DPI (quality):</label>
              <select id="pdf-dpi" class="tool-input">
                <option value="72">72 DPI (screen resolution)</option>
                <option value="150">150 DPI (medium quality)</option>
                <option value="300" selected>300 DPI (print quality)</option>
              </select>
            </div>
          `;
        }
        
        // Settings for text to PDF conversion
        if ((fromType === 'text/plain' || fromType === 'text/html' || fromType === 'text/markdown') && 
            toType === 'application/pdf') {
          conversionSettings.innerHTML = `
            <div class="setting-group">
              <label for="page-size">Page size:</label>
              <select id="page-size" class="tool-input">
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
                <option value="legal">Legal</option>
              </select>
            </div>
            <div class="setting-group">
              <label for="page-orientation">Orientation:</label>
              <select id="page-orientation" class="tool-input">
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
          `;
        }
        
        // Settings for audio conversions
        if (fromType.startsWith('audio/') && toType.startsWith('audio/')) {
          conversionSettings.innerHTML = `
            <div class="setting-group">
              <label for="audio-bitrate">Bitrate:</label>
              <select id="audio-bitrate" class="tool-input">
                <option value="128">128 kbps (standard quality)</option>
                <option value="192">192 kbps (high quality)</option>
                <option value="256">256 kbps (very high quality)</option>
                <option value="320">320 kbps (maximum quality)</option>
              </select>
            </div>
          `;
        }
      }
      
      // Convert button click handler
      convertBtn.addEventListener('click', () => {
        if (!currentFile) {
          return;
        }
        
        const fromFormat = currentFile.type;
        const toFormat = targetFormat.value;
        
        conversionResult.style.display = 'block';
        conversionStatus.innerHTML = `
          <div class="progress-message">
            <i class="bi bi-arrow-repeat spinner"></i>
            Converting ${formatNames[fromFormat] || fromFormat} to ${formatNames[toFormat] || toFormat}...
          </div>
        `;
        
        // Perform the conversion based on file types
        if (fromFormat.startsWith('image/') && toFormat.startsWith('image/')) {
          convertImage(currentFile, toFormat);
        } else if (fromFormat === 'application/pdf' && toFormat.startsWith('image/')) {
          convertPdfToImage(currentFile, toFormat);
        } else if (fromFormat === 'application/epub+zip') {
          convertEpub(currentFile, toFormat);
        } else if ((fromFormat === 'text/plain' || fromFormat === 'text/html' || fromFormat === 'text/markdown') && 
                  toFormat === 'application/pdf') {
          convertTextToPdf(currentFile, toFormat);
        } else if ((fromFormat === 'text/html' || fromFormat === 'text/markdown') && 
                  toFormat === 'application/epub+zip') {
          convertTextToEpub(currentFile, toFormat);
        } else if (fromFormat.startsWith('audio/') && toFormat.startsWith('audio/')) {
          convertAudio(currentFile, toFormat);
        } else {
          conversionStatus.innerHTML = `
            <div class="error-message">
              <i class="bi bi-exclamation-triangle"></i>
              Sorry, conversion from ${formatNames[fromFormat] || fromFormat} to ${formatNames[toFormat] || toFormat} is not implemented yet.
            </div>
          `;
        }
      });
      
      // Image conversion function
      function convertImage(file, targetFormat) {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          const img = new Image();
          
          img.onload = () => {
            // Get settings
            const quality = document.getElementById('image-quality') ? 
              parseInt(document.getElementById('image-quality').value) / 100 : 0.9;
            
            const shouldResize = document.getElementById('resize-image') && 
              document.getElementById('resize-image').checked;
            
            let width = img.width;
            let height = img.height;
            
            if (shouldResize) {
              const newWidth = parseInt(document.getElementById('image-width').value);
              const newHeight = parseInt(document.getElementById('image-height').value);
              const maintainRatio = document.getElementById('maintain-aspect-ratio').checked;
              
              if (newWidth && newHeight) {
                width = newWidth;
                height = newHeight;
              } else if (newWidth) {
                width = newWidth;
                if (maintainRatio) {
                  height = (img.height / img.width) * newWidth;
                }
              } else if (newHeight) {
                height = newHeight;
                if (maintainRatio) {
                  width = (img.width / img.height) * newHeight;
                }
              }
            }
            
            // Create canvas for the conversion
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            
            // Draw image on canvas
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to target format
            let outputType = targetFormat;
            let outputExt = fileExtensions[targetFormat];
            
            // Convert to target format
            canvas.toBlob((blob) => {
              if (blob) {
                // Successfully converted
                convertedFile = new File([blob], `converted.${outputExt}`, { type: targetFormat });
                
                // Show success message and download button
                conversionStatus.innerHTML = `
                  <div class="success-message">
                    <i class="bi bi-check-circle"></i>
                    Conversion successful! Your ${formatNames[targetFormat]} is ready to download.
                  </div>
                `;
                
                downloadActions.style.display = 'block';
              } else {
                // Conversion failed
                conversionStatus.innerHTML = `
                  <div class="error-message">
                    <i class="bi bi-exclamation-triangle"></i>
                    Sorry, conversion failed. Please try a different format.
                  </div>
                `;
              }
            }, outputType, quality);
          };
          
          img.onerror = () => {
            conversionStatus.innerHTML = `
              <div class="error-message">
                <i class="bi bi-exclamation-triangle"></i>
                Error loading image. The file may be corrupted.
              </div>
            `;
          };
          
          img.src = event.target.result;
        };
        
        reader.readAsDataURL(file);
      }

      // PDF to image conversion (simplified, would need a PDF.js library for real implementation)
      function convertPdfToImage(file, targetFormat) {
        // In a real implementation, you would use PDF.js or a similar library
        conversionStatus.innerHTML = `
          <div class="info-message">
            <i class="bi bi-info-circle"></i>
            PDF conversion requires the PDF.js library. This is a placeholder for demonstration.
          </div>
        `;
        
        // Simulate conversion for demo purposes
        setTimeout(() => {
          conversionStatus.innerHTML = `
            <div class="info-message">
              <i class="bi bi-info-circle"></i>
              For PDF conversions, we recommend using a server-side solution or dedicated PDF.js implementation.
            </div>
          `;
        }, 2000);
      }
      
      // Text to PDF conversion (simplified, would need a PDF generation library)
      function convertTextToPdf(file, targetFormat) {
        // In a real implementation, you would use jsPDF or a similar library
        conversionStatus.innerHTML = `
          <div class="info-message">
            <i class="bi bi-info-circle"></i>
            Text to PDF conversion requires the jsPDF library. This is a placeholder for demonstration.
          </div>
        `;
        
        // Simulate conversion for demo purposes
        setTimeout(() => {
          conversionStatus.innerHTML = `
            <div class="info-message">
              <i class="bi bi-info-circle"></i>
              For PDF generation, we recommend using jsPDF or a server-side solution.
            </div>
          `;
        }, 2000);
      }
      
      // Audio conversion (simplified, would need audio processing libraries)
      function convertAudio(file, targetFormat) {
        conversionStatus.innerHTML = `
          <div class="info-message">
            <i class="bi bi-info-circle"></i>
            Audio conversion in the browser is limited. This is a placeholder for demonstration.
          </div>
        `;
        
        // Simulate conversion for demo purposes
        setTimeout(() => {
          conversionStatus.innerHTML = `
            <div class="info-message">
              <i class="bi bi-info-circle"></i>
              For reliable audio conversion, we recommend using a server-side solution or WebAssembly-based libraries.
            </div>
          `;
        }, 2000);
      }
      
      // EPUB conversion function
      function convertEpub(file, targetFormat) {
        conversionStatus.innerHTML = `
          <div class="progress-message">
            <i class="bi bi-arrow-repeat spinner"></i>
            Processing EPUB file...
          </div>
        `;
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
          const data = e.target.result;
          
          try {
            // Use epub.js to parse the EPUB file
            const book = ePub(data);
      
            // Just test getting some basic info first
            book.loaded.metadata.then(function(metadata) {
              
              // Now proceed with conversion based on target format
              if (targetFormat === 'text/html') {
                convertEpubToHtml(book);
              } else if (targetFormat === 'application/pdf') {
                convertEpubToPdf(book);
              } else if (targetFormat === 'text/plain') {
                convertEpubToText(book);
              } else {
                conversionStatus.innerHTML = `
                  <div class="error-message">
                    <i class="bi bi-exclamation-triangle"></i>
                    Conversion to ${formatNames[targetFormat]} is not supported yet.
                  </div>
                `;
              }
            }).catch(function(error) {
              console.error('Error loading book metadata:', error);
              conversionStatus.innerHTML = `
                <div class="error-message">
                  <i class="bi bi-exclamation-triangle"></i>
                  Error processing EPUB: ${error.message}
                </div>
              `;
            });
          } catch (error) {
            console.error('Error in EPUB processing:', error);
            conversionStatus.innerHTML = `
              <div class="error-message">
                <i class="bi bi-exclamation-triangle"></i>
                Error processing EPUB: ${error.message}
              </div>
            `;
          }
        };
        reader.readAsArrayBuffer(file);
      }

      // EPUB to HTML conversion
      function convertEpubToHtml(book) {
        // Get spine items (chapters)
        const chapters = [];
        let chapterPromises = [];
        
        book.spine.each(function(item) {
          chapterPromises.push(
            item.load(book.load.bind(book))
              .then(function(contents) {
                chapters.push({
                  id: item.idref,
                  title: item.title || item.idref,
                  content: contents.content || contents
                });
              })
          );
        });
        
        Promise.all(chapterPromises)
          .then(function() {
            // Create a single HTML document
            let htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${book.packaging.metadata.title}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 2em; }
    h1, h2, h3 { color: #333; }
    img { max-width: 100%; }
  </style>
</head>
<body>
  <h1>${book.packaging.metadata.title || 'Converted EPUB'}</h1>
  <p><em>Author: ${book.packaging.metadata.creator || 'Unknown'}</em></p>
`;

            // Add all chapters
            chapters.forEach(function(chapter) {
              htmlContent += `<div class="chapter" id="${chapter.id}">
  ${chapter.content}
</div>
`;
            });
            
            htmlContent += `</body>
</html>`;
            
            // Create file
            const blob = new Blob([htmlContent], { type: 'text/html' });
            convertedFile = new File([blob], 'converted.html', { type: 'text/html' });
            
            conversionStatus.innerHTML = `
              <div class="success-message">
                <i class="bi bi-check-circle"></i>
                EPUB successfully converted to HTML!
              </div>
            `;
            
            downloadActions.style.display = 'block';
          })
          .catch(function(error) {
            conversionStatus.innerHTML = `
              <div class="error-message">
                <i class="bi bi-exclamation-triangle"></i>
                Error converting EPUB to HTML: ${error.message}
              </div>
            `;
          });
      }

      // EPUB to PDF conversion
      function convertEpubToPdf(book) {
        const pageSize = document.getElementById('page-size') ? 
            document.getElementById('page-size').value : 'a4';
        const pageOrientation = document.getElementById('page-orientation') ? 
            document.getElementById('page-orientation').value : 'portrait';

        conversionStatus.innerHTML = `
          <div class="info-message">
            <i class="bi bi-info-circle"></i>
            Converting EPUB to PDF requires processing all content and images. This may take a moment...
          </div>
        `;
        
        // This is a simplified implementation that would need improvement
        // for a production-ready solution
        try {
          // Create a new PDF document
          const pdf = new jspdf.jsPDF({
              orientation: pageOrientation,
              unit: 'mm',
              format: pageSize
          });

          let y = 20;
          
          // Add title
          pdf.setFontSize(24);
          pdf.text(book.packaging.metadata.title || 'Converted EPUB', 20, y);
          y += 10;
          
          // Add author
          pdf.setFontSize(12);
          pdf.text(`Author: ${book.packaging.metadata.creator || 'Unknown'}`, 20, y);
          y += 20;
          
          // Get spine items and process one by one
          let currentChapter = 0;
          
          function processNextChapter() {
            if (currentChapter >= book.spine.length) {
              // All chapters processed, save the PDF
              try {
                const pdfBlob = pdf.output('blob');
                convertedFile = new File([pdfBlob], 'converted.pdf', { type: 'application/pdf' });
                
                conversionStatus.innerHTML = `
                  <div class="success-message">
                    <i class="bi bi-check-circle"></i>
                    EPUB successfully converted to PDF!
                  </div>
                `;
                
                setTimeout(() => {
                  const url = URL.createObjectURL(convertedFile);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'converted.pdf';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }, 1000);

                downloadActions.style.display = 'block';
              } catch (error) {
                console.error('Error saving PDF:', error);
                conversionStatus.innerHTML = `
                  <div class="error-message">
                    <i class="bi bi-exclamation-triangle"></i>
                    Error saving PDF: ${error.message}
                  </div>
                `;
              }
              return;
            }
            
            try {
              // Get spine item
              const item = book.spine.get(currentChapter);
              
              // Load content
              book.load(item.href).then(function(content) {
                
                try {
                  // Add chapter title if available
                  if (item.label) {
                    pdf.setFontSize(16);
                    pdf.text(item.label, 20, y);
                    y += 10;
                  }
                  
                  // Create a temporary div to extract text
                  let tempDiv = document.createElement('div');

                  // Check if content is an object with content property
                  if (content && typeof content === 'object' && content.content) {
                    tempDiv.innerHTML = content.content;
                  } else if (content && typeof content === 'object' && content.documentElement) {
                    // Handle HTMLDocument objects
                    tempDiv.innerHTML = content.documentElement.outerHTML;
                  } else {
                    tempDiv.innerHTML = content;
                  }

                  // Extract all text content
                  const text = tempDiv.textContent || tempDiv.innerText;

                  // Set page format - use A4 with proper margins
                  if (currentChapter > 0) {
                    pdf.addPage();
                    y = 20; // Reset y position for new page
                  }

                  // Process paragraphs - split by newlines or reasonable chunks
                  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
                  if (paragraphs.length === 0 && text.trim()) {
                    // If no paragraphs detected but we have text, treat as one paragraph
                    paragraphs.push(text.trim());
                  }

                  // Set text properties
                  pdf.setFontSize(11);
                  const lineHeight = 7;
                  const pageWidth = pdf.internal.pageSize.width;
                  const margin = 20;
                  const textWidth = pageWidth - (margin * 2);

                  // Process each paragraph with proper flow between pages
                  for (let i = 0; i < paragraphs.length; i++) {
                    const paragraph = paragraphs[i].trim();
                    if (!paragraph) continue;
                    
                    const textLines = pdf.splitTextToSize(paragraph, textWidth);
                    
                    // Check if we need a new page based on actual remaining space
                    if (y + (textLines.length * lineHeight) > pdf.internal.pageSize.height - margin) {
                      pdf.addPage({format: pageSize});
                      y = margin; // Reset to top of page with margin
                    }
                    
                    pdf.text(textLines, margin, y);
                    y += textLines.length * lineHeight + 3; // Small gap between paragraphs
                  }

                  // Process next chapter
                  currentChapter++;
                  setTimeout(processNextChapter, 0); // Use setTimeout to prevent stack overflow with large books
                } catch (error) {
                  console.error(`Error processing chapter ${currentChapter} content:`, error);
                  currentChapter++;
                  setTimeout(processNextChapter, 0);
                }
              }).catch(function(error) {
                console.error(`Error loading chapter ${currentChapter}:`, error);
                currentChapter++;
                setTimeout(processNextChapter, 0);
              });
            } catch (error) {
              console.error(`Error getting spine item ${currentChapter}:`, error);
              currentChapter++;
              setTimeout(processNextChapter, 0);
            }
          }
          
          // Start processing chapters
          processNextChapter();
        } catch (error) {
          console.error('Error in convertEpubToPdf:', error);
          conversionStatus.innerHTML = `
            <div class="error-message">
              <i class="bi bi-exclamation-triangle"></i>
              Error converting EPUB to PDF: ${error.message}
            </div>
          `;
        }
      }

      // EPUB to text conversion
      function convertEpubToText(book) {
        // Get spine items (chapters)
        const chapters = [];
        let chapterPromises = [];
        
        book.spine.each(function(item) {
          chapterPromises.push(
            item.load(book.load.bind(book))
              .then(function(contents) {
                let tempDiv = document.createElement('div');
                tempDiv.innerHTML = contents.content || contents;
                
                chapters.push({
                  title: item.title || item.idref,
                  text: tempDiv.textContent || tempDiv.innerText
                });
              })
          );
        });

        Promise.all(chapterPromises)
          .then(function() {
            // Create a text file with all content
            let textContent = `${book.packaging.metadata.title || 'Converted EPUB'}\n`;
            textContent += `Author: ${book.packaging.metadata.creator || 'Unknown'}\n\n`;
            
            // Add all chapters
            chapters.forEach(function(chapter) {
              textContent += `\n\n== ${chapter.title} ==\n\n`;
              textContent += chapter.text;
            });
            
            // Create file
            const blob = new Blob([textContent], { type: 'text/plain' });
            convertedFile = new File([blob], 'converted.txt', { type: 'text/plain' });
            
            conversionStatus.innerHTML = `
              <div class="success-message">
                <i class="bi bi-check-circle"></i>
                EPUB successfully converted to text!
              </div>
            `;
            
            downloadActions.style.display = 'block';
          })
          .catch(function(error) {
            conversionStatus.innerHTML = `
              <div class="error-message">
                <i class="bi bi-exclamation-triangle"></i>
                Error converting EPUB to text: ${error.message}
              </div>
            `;
          });
      }

      // Text/HTML to EPUB conversion
      function convertTextToEpub(file, targetFormat) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          const content = e.target.result;
          
          try {
            // Create a new JSZip instance for the EPUB
            const zip = new JSZip();
            
            // Add mimetype file (must be first and uncompressed)
            zip.file("mimetype", "application/epub+zip");
            
            // Add META-INF directory
            zip.file("META-INF/container.xml", `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);
            
            // Create OEBPS directory
            const oebps = zip.folder("OEBPS");
            
            // Create content based on file type
            let htmlContent;
            let title = "Converted Document";
            const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            
            if (file.type === 'text/html') {
              htmlContent = content;
              
              // Try to extract title from HTML
              const titleMatch = content.match(/<title>(.*?)<\/title>/i);
              if (titleMatch && titleMatch[1]) {
                title = titleMatch[1];
              }
            } else if (file.type === 'text/markdown') {
              // Simple markdown to HTML conversion
              htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Converted from Markdown</title>
  <meta charset="utf-8">
</head>
<body>`;
              
              // Very basic markdown conversion
              const lines = content.split('\n');
              for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                
                // Headers
                if (line.startsWith('# ')) {
                  htmlContent += `<h1>${line.substring(2)}</h1>`;
                } else if (line.startsWith('## ')) {
                  htmlContent += `<h2>${line.substring(3)}</h2>`;
                } else if (line.startsWith('### ')) {
                  htmlContent += `<h3>${line.substring(4)}</h3>`;
                } else if (line.startsWith('- ')) {
                  // List items
                  htmlContent += `<ul><li>${line.substring(2)}</li></ul>`;
                } else if (line.match(/^\d+\. /)) {
                  // Numbered list
                  htmlContent += `<ol><li>${line.replace(/^\d+\. /, '')}</li></ol>`;
                } else if (line === '') {
                  // Empty line
                  htmlContent += '<br>';
                } else {
                  // Regular paragraph
                  htmlContent += `<p>${line}</p>`;
                }
              }
              
              htmlContent += `</body></html>`;
            } else {
              // Plain text
              htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Converted Text</title>
  <meta charset="utf-8">
</head>
<body>
  <pre>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body>
</html>`;
            }
            
            // Add the HTML content file
            oebps.file("chapter1.html", htmlContent);
            
            // Add content.opf file
            const contentOpf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookID" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>${title}</dc:title>
    <dc:creator>Utility Tools Converter</dc:creator>
    <dc:language>en</dc:language>
    <dc:identifier id="BookID">urn:uuid:${generateUUID()}</dc:identifier>
    <dc:date>${now}</dc:date>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="chapter1" href="chapter1.html" media-type="application/xhtml+xml"/>
  </manifest>
  <spine toc="ncx">
    <itemref idref="chapter1"/>
  </spine>
</package>`;
            oebps.file("content.opf", contentOpf);
            
            // Add toc.ncx file
            const tocNcx = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:${generateUUID()}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle>
    <text>${title}</text>
  </docTitle>
  <navMap>
    <navPoint id="navpoint-1" playOrder="1">
      <navLabel>
        <text>${title}</text>
      </navLabel>
      <content src="chapter1.html"/>
    </navPoint>
  </navMap>
</ncx>`;
            oebps.file("toc.ncx", tocNcx);
            
            // Generate EPUB file
            zip.generateAsync({type: "blob"})
              .then(function(blob) {
                convertedFile = new File([blob], "converted.epub", {type: "application/epub+zip"});
                
                conversionStatus.innerHTML = `
                  <div class="success-message">
                    <i class="bi bi-check-circle"></i>
                    Successfully converted to EPUB!
                  </div>
                `;
                
                downloadActions.style.display = 'block';
              })
              .catch(function(error) {
                conversionStatus.innerHTML = `
                  <div class="error-message">
                    <i class="bi bi-exclamation-triangle"></i>
                    Error creating EPUB: ${error.message}
                  </div>
                `;
              });
          } catch (error) {
            conversionStatus.innerHTML = `
              <div class="error-message">
                <i class="bi bi-exclamation-triangle"></i>
                Error converting to EPUB: ${error.message}
              </div>
            `;
          }
        };
        
        // Read file as text
        if (file.type === 'text/html' || file.type === 'text/markdown' || file.type === 'text/plain') {
          reader.readAsText(file);
        } else {
          conversionStatus.innerHTML = `
            <div class="error-message">
              <i class="bi bi-exclamation-triangle"></i>
              Unsupported file type for EPUB conversion.
            </div>
          `;
        }
      }

      // Helper function to generate UUID for EPUB
      function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

      // Download button handler
      downloadBtn.addEventListener('click', () => {
        if (convertedFile) {
          const url = URL.createObjectURL(convertedFile);
          const link = document.createElement('a');
          link.href = url;
          link.download = convertedFile.name;
          link.click();
          
          // Clean up
          URL.revokeObjectURL(url);
        }
      });
    }
});