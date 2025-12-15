const express = require('express');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage (untuk production, ganti dengan database)
let projects = {};
let characters = {};
let locations = {};
let generatedAssets = {};

// API Routes

// Projects
app.get('/api/projects', (req, res) => {
  res.json(Object.values(projects));
});

app.post('/api/projects', (req, res) => {
  const id = uuidv4();
  const project = { id, ...req.body, createdAt: new Date().toISOString() };
  projects[id] = project;
  res.json(project);
});

app.get('/api/projects/:id', (req, res) => {
  res.json(projects[req.params.id] || null);
});

app.put('/api/projects/:id', (req, res) => {
  if (projects[req.params.id]) {
    projects[req.params.id] = { ...projects[req.params.id], ...req.body };
    res.json(projects[req.params.id]);
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

app.delete('/api/projects/:id', (req, res) => {
  delete projects[req.params.id];
  res.json({ success: true });
});

// Characters
app.get('/api/characters', (req, res) => {
  const projectId = req.query.projectId;
  const chars = Object.values(characters).filter(c => !projectId || c.projectId === projectId);
  res.json(chars);
});

app.post('/api/characters', (req, res) => {
  const id = uuidv4();
  const character = { id, ...req.body, createdAt: new Date().toISOString() };
  characters[id] = character;
  res.json(character);
});

app.put('/api/characters/:id', (req, res) => {
  if (characters[req.params.id]) {
    characters[req.params.id] = { ...characters[req.params.id], ...req.body };
    res.json(characters[req.params.id]);
  } else {
    res.status(404).json({ error: 'Character not found' });
  }
});

app.delete('/api/characters/:id', (req, res) => {
  delete characters[req.params.id];
  res.json({ success: true });
});

// Locations
app.get('/api/locations', (req, res) => {
  const projectId = req.query.projectId;
  const locs = Object.values(locations).filter(l => !projectId || l.projectId === projectId);
  res.json(locs);
});

app.post('/api/locations', (req, res) => {
  const id = uuidv4();
  const location = { id, ...req.body, createdAt: new Date().toISOString() };
  locations[id] = location;
  res.json(location);
});

app.put('/api/locations/:id', (req, res) => {
  if (locations[req.params.id]) {
    locations[req.params.id] = { ...locations[req.params.id], ...req.body };
    res.json(locations[req.params.id]);
  } else {
    res.status(404).json({ error: 'Location not found' });
  }
});

app.delete('/api/locations/:id', (req, res) => {
  delete locations[req.params.id];
  res.json({ success: true });
});

// Assets (generated images/videos references)
app.get('/api/assets', (req, res) => {
  const projectId = req.query.projectId;
  const assets = Object.values(generatedAssets).filter(a => !projectId || a.projectId === projectId);
  res.json(assets);
});

app.post('/api/assets', (req, res) => {
  const id = uuidv4();
  const asset = { id, ...req.body, createdAt: new Date().toISOString() };
  generatedAssets[id] = asset;
  res.json(asset);
});

app.delete('/api/assets/:id', (req, res) => {
  delete generatedAssets[req.params.id];
  res.json({ success: true });
});

// Serve main app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🎬 AI Filmmaking Studio running on port ${PORT}`);
});
