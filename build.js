const fs = require('fs');
const path = require('path');

// Read template
const templateContent = fs.readFileSync('./templates/template.html', 'utf8');

// Get all page configs
const pagesDir = './pages';
const pageFiles = fs.readdirSync(pagesDir).filter(file => file.endsWith('.json'));

// Simple template rendering function
function renderTemplate(template, data) {
  let result = template;
  
  // Handle active nav items for templated class attributes
  Object.keys(data).forEach(key => {
    if (key !== 'content') {
      const regex = new RegExp(`{{#if ${key}}}(.*?){{/if}}`, 'g');
      result = result.replace(regex, data[key] ? '$1' : '');
    }
  });
  
  // Replace content
  result = result.replace('{{content}}', data.content || '');
  
  return result;
}

// Process each page
pageFiles.forEach(pageFile => {
  const pageName = path.basename(pageFile, '.json');
  const pageConfig = JSON.parse(fs.readFileSync(path.join(pagesDir, pageFile), 'utf8'));
  
  const data = {
    content: pageConfig.content,
    // Set active flag
    [pageConfig.active]: true
  };
  
  const outputPath = `./${pageName}.html`;
  
  // For existing files, preserve the hardcoded active classes
  if (fs.existsSync(outputPath)) {
    const existingContent = fs.readFileSync(outputPath, 'utf8');
    
    // Extract the nav section to preserve hardcoded active classes
    const navRegex = /<nav>([\s\S]*?)<\/nav>/;
    const navMatch = existingContent.match(navRegex);
    
    if (navMatch) {
      // Use the existing nav section and render the rest of the template
      let template = templateContent;
      template = template.replace(navRegex, navMatch[0]);
      
      // Replace the content
      const rendered = renderTemplate(template, data);
      fs.writeFileSync(outputPath, rendered);
      console.log(`Updated ${outputPath} (preserved nav)`);
    } else {
      // If nav section not found, use the full template
      const rendered = renderTemplate(templateContent, data);
      fs.writeFileSync(outputPath, rendered);
      console.log(`Updated ${outputPath} (full template)`);
    }
  } else {
    // For new files, use the full template
    const rendered = renderTemplate(templateContent, data);
    fs.writeFileSync(outputPath, rendered);
    console.log(`Created ${outputPath}`);
  }
});

console.log('Build complete!');

console.log('\nWebsite files:');
pageFiles.forEach(pageFile => {
  const pageName = path.basename(pageFile, '.json');
  console.log(`- ${pageName}.html`);
});

console.log('\nTo add a new page:');
console.log('Run the helper script: node add-page.js');
console.log('\nOr manually:');
console.log('1. Create a JSON file in the pages directory (e.g., pages/new-page.json)');
console.log('2. Add a navigation link in templates/template.html');
console.log('3. Run this build script (node build.js)');
console.log('\nSee README.md for more information.');