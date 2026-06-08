// build.js
// Reads all .md files from /content/apartments, parses their frontmatter,
// and injects the apartment data as JSON into index.html before Netlify deploys.

const fs   = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, 'content', 'apartments');
const INDEX_FILE  = path.join(__dirname, 'index.html');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const yaml = match[1];
  const result = {};

  yaml.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return;
    const key   = line.slice(0, colonIdx).trim();
    let   value = line.slice(colonIdx + 1).trim();

    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Boolean
    if (value === 'true')  { result[key] = true; return; }
    if (value === 'false') { result[key] = false; return; }

    // Number
    if (!isNaN(value) && value !== '') { result[key] = Number(value); return; }

    result[key] = value;
  });

  // Parse list fields (photos, amenities)
  ['photos', 'amenities'].forEach(field => {
    const listMatch = yaml.match(new RegExp(field + ':\\n((?:  - .+\\n?)+)'));
    if (listMatch) {
      result[field] = listMatch[1]
        .split('\n')
        .filter(l => l.trim().startsWith('- '))
        .map(l => l.replace(/^\s*- /, '').replace(/^["']|["']$/g, '').trim());
    }
  });

  return result;
}

function build() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.log('No content/apartments directory found — skipping apartment injection.');
    return;
  }

  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));

  if (files.length === 0) {
    console.log('No apartment markdown files found.');
    return;
  }

  const apartments = files.map(file => {
    const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
    return parseFrontmatter(content);
  }).filter(apt => apt.title);

  // Sort: available first, then by area
  apartments.sort((a, b) => {
    if (a.available === b.available) return (a.area || '').localeCompare(b.area || '');
    return a.available ? -1 : 1;
  });

  const json = JSON.stringify(apartments, null, 2);

  let html = fs.readFileSync(INDEX_FILE, 'utf8');

  // Replace the JSON between the apartmentData script tags
  html = html.replace(
    /(<script id="apartmentData" type="application\/json">)[\s\S]*?(<\/script>)/,
    '$1\n' + json + '\n$2'
  );

  fs.writeFileSync(INDEX_FILE, html, 'utf8');
  console.log('Build complete: injected ' + apartments.length + ' apartments into index.html');
  apartments.forEach(a => console.log('  - ' + a.title + ' (' + a.area + ')'));
}

build();
