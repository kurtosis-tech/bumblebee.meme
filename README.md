# Bumblebee Website

A simple static website with a minimal templating system.

## How it works

The website uses a simple Node.js-based templating system to generate static HTML files.

### File Structure

- `templates/template.html`: The main HTML template with placeholders
- `pages/*.json`: JSON files containing content for each page
- `build.js`: Node.js script to generate HTML files from templates and page data
- `add-page.js`: Helper script to create new pages
- `*.html`: Generated HTML files

### Adding a new page

#### Method 1: Using the add-page helper script

Run the script and follow the prompts:

```
node add-page.js
```

The script will:
1. Create a JSON file for the page
2. Add the navigation link to the template
3. Instruct you to run the build script

#### Method 2: Manually

1. Create a new JSON file in the `pages` directory (e.g., `new-page.json`):

```json
{
  "active": "new_page",
  "content": "<h1>New Page</h1><p>Your content goes here</p>"
}
```

2. Update the navigation in `templates/template.html` by adding a new link:

```html
<a href="/new-page" {{#if new_page}}class="active"{{/if}}>New Page</a>
```

3. Run the build script:

```
node build.js
```

### How the template system works

The system uses a simple custom templating approach:

1. Page content is defined in JSON files in the `pages` directory
2. Each page has an `active` property to mark the current page in navigation
3. The build script preserves any hardcoded `active` classes in existing files
4. When generating files, the system replaces `{{#if var}}content{{/if}}` with the content when the variable is true
5. The content placeholder `{{content}}` is replaced with the page-specific content

### Editing pages

To edit a page's content, modify the corresponding JSON file in the `pages` directory and run the build script again.