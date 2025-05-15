const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get page details from user
rl.question('Enter the page name (e.g., "contact"): ', (pageName) => {
  rl.question('Enter the navigation title (e.g., "Contact Us"): ', (navTitle) => {
    rl.question('Enter the page content (HTML): ', (content) => {
      // Create page JSON
      createPage(pageName, navTitle, content);
      rl.close();
    });
  });
});

function createPage(pageName, navTitle, content) {
  // Normalize page name for filenames
  const normalizedName = pageName.toLowerCase().replace(/\s+/g, '-');
  const activeName = normalizedName.replace(/-/g, '_');
  
  // Create page JSON
  const pageData = {
    active: activeName,
    content: content
  };
  
  // Write JSON file
  const jsonPath = path.join('./pages', `${normalizedName}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(pageData, null, 2));
  console.log(`Created page JSON: ${jsonPath}`);
  
  // Read template to update navigation
  const templatePath = './templates/template.html';
  let template = fs.readFileSync(templatePath, 'utf8');
  
  // Check if nav link already exists
  if (template.includes(`href="/${normalizedName}"`)) {
    console.log('Navigation link already exists in template.');
  } else {
    // Find the last nav link
    const navRegex = /<nav>([\s\S]*?)<\/nav>/;
    const navMatch = template.match(navRegex);
    
    if (navMatch) {
      const nav = navMatch[1];
      // Insert new link before closing nav tag
      const newNav = nav + `\n        <a href="/${normalizedName}" {{#if ${activeName}}}class="active"{{/if}}>${navTitle}</a>`;
      template = template.replace(nav, newNav);
      
      // Write updated template
      fs.writeFileSync(templatePath, template);
      console.log(`Updated navigation in ${templatePath}`);
    } else {
      console.log('Could not find navigation section in template.');
    }
  }
  
  console.log('\nTo generate the HTML file, run:');
  console.log('node build.js');
}