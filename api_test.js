const http = require('http');

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      let body = '';
      res.on('data', chunk => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body });
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function runTests() {
  // Test GET /notes (should be empty)
  let res = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/notes',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  console.log('GET /notes:', res.statusCode, res.body);

  // Test POST /notes with valid data
  const newNoteData = JSON.stringify({ title: 'Test Note', content: 'Test content' });
  res = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/notes',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(newNoteData) }
  }, newNoteData);
  console.log('POST /notes (valid):', res.statusCode, res.body);
  const createdNote = JSON.parse(res.body);

  // Test POST /notes with missing title
  const missingTitleData = JSON.stringify({ content: 'No title' });
  res = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/notes',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(missingTitleData) }
  }, missingTitleData);
  console.log('POST /notes (missing title):', res.statusCode, res.body);

  // Test POST /notes with missing content
  const missingContentData = JSON.stringify({ title: 'No content' });
  res = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/notes',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(missingContentData) }
  }, missingContentData);
  console.log('POST /notes (missing content):', res.statusCode, res.body);

  // Test GET /notes/:id with valid ID
  res = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: `/notes/${createdNote.id}`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  console.log(`GET /notes/${createdNote.id}:`, res.statusCode, res.body);

  // Test GET /notes/:id with invalid ID
  res = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/notes/invalid-id',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  console.log('GET /notes/invalid-id:', res.statusCode, res.body);

  // Test DELETE /notes/:id with valid ID
  res = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: `/notes/${createdNote.id}`,
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  console.log(`DELETE /notes/${createdNote.id}:`, res.statusCode, res.body);

  // Test DELETE /notes/:id with invalid ID
  res = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/notes/invalid-id',
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  console.log('DELETE /notes/invalid-id:', res.statusCode, res.body);

  // Final GET /notes to confirm deletion
  res = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/notes',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  console.log('Final GET /notes:', res.statusCode, res.body);
}

runTests().catch(console.error);
