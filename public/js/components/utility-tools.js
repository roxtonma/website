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
});
