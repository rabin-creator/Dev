// Simulated Containers Data
let containers = [
  { id: 'c9a28b1', image: 'redis:7-alpine', status: 'running', port: '6379' },
  { id: 'f41e0c7', image: 'postgres:15-alpine', status: 'running', port: '5432' },
  { id: '3b8901a', image: 'node:20-alpine', status: 'running', port: '3000' },
  { id: '82fa119', image: 'nginx:alpine', status: 'stopped', port: '80' }
];

function renderContainers() {
  const tbody = document.getElementById('container-tbody');
  tbody.innerHTML = '';
  containers.forEach((c, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><code>${c.id}</code></td>
      <td>${c.image}</td>
      <td><span class="status-badge ${c.status === 'running' ? 'status-running' : 'status-stopped'}">${c.status.toUpperCase()}</span></td>
      <td>:${c.port}</td>
      <td>
        <button onclick="toggleContainer(${idx})" class="action-btn ${c.status === 'running' ? 'danger' : ''}">${c.status === 'running' ? 'Kill' : 'Start'}</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function toggleContainer(idx) {
  containers[idx].status = containers[idx].status === 'running' ? 'stopped' : 'running';
  renderContainers();
}

function spawnContainer() {
  const images = ['redis:alpine', 'mongo:latest', 'node:20', 'python:3.11', 'nginx:latest'];
  const newId = Math.random().toString(16).substring(2, 9);
  const randomImage = images[Math.floor(Math.random() * images.length)];
  const randomPort = Math.floor(Math.random() * 5000) + 3000;
  
  containers.push({ id: newId, image: randomImage, status: 'running', port: randomPort.toString() });
  renderContainers();
}

// Live Telemetry Simulation
setInterval(() => {
  const cpuVal = (Math.random() * 25 + 15).toFixed(1);
  const ramVal = (Math.random() * 1.5 + 5.8).toFixed(1);
  const diskVal = (Math.random() * 5 + 12).toFixed(1);

  document.getElementById('metric-cpu').textContent = `${cpuVal}%`;
  document.getElementById('bar-cpu').style.width = `${cpuVal}%`;

  document.getElementById('metric-ram').textContent = `${ramVal} / 16 GB`;
  document.getElementById('bar-ram').style.width = `${(ramVal / 16) * 100}%`;

  document.getElementById('metric-disk').textContent = `${diskVal} MB/s`;
  document.getElementById('bar-disk').style.width = `${diskVal * 2}%`;
}, 1500);

// CI/CD Pipeline Simulation
function logBuild(msg, type = 'info') {
  const logs = document.getElementById('build-logs');
  const div = document.createElement('div');
  div.className = `log-line ${type}`;
  div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  logs.appendChild(div);
  logs.scrollTop = logs.scrollHeight;
}

let isPipelineRunning = false;

async function triggerPipeline() {
  if (isPipelineRunning) return;
  isPipelineRunning = true;
  const btn = document.getElementById('pipeline-btn');
  btn.disabled = true;
  btn.textContent = 'Building...';

  const stages = ['stage-git', 'stage-test', 'stage-build', 'stage-deploy'];
  stages.forEach(s => document.getElementById(s).className = 'stage-node');

  document.getElementById('build-logs').innerHTML = '';
  logBuild('Pipeline triggered by user via webhook.', 'info');

  // Stage 1: Git
  document.getElementById('stage-git').classList.add('active');
  logBuild('Cloning repository from origin/main...', 'info');
  await new Promise(r => setTimeout(r, 1000));
  document.getElementById('stage-git').classList.replace('active', 'success');
  logBuild('Checkout successful. Commit SHA: e8f9a2b', 'success');

  // Stage 2: Test
  document.getElementById('stage-test').classList.add('active');
  logBuild('Running unit & integration test suites...', 'info');
  await new Promise(r => setTimeout(r, 1400));
  document.getElementById('stage-test').classList.replace('active', 'success');
  logBuild('All 48 test suites passed successfully (0 failures).', 'success');

  // Stage 3: Docker Build
  document.getElementById('stage-build').classList.add('active');
  logBuild('Building container image app:v2.4.0...', 'warn');
  await new Promise(r => setTimeout(r, 1600));
  document.getElementById('stage-build').classList.replace('active', 'success');
  logBuild('Docker image successfully pushed to registry.', 'success');

  // Stage 4: Deploy
  document.getElementById('stage-deploy').classList.add('active');
  logBuild('Applying Kubernetes manifests to cluster...', 'warn');
  await new Promise(r => setTimeout(r, 1200));
  document.getElementById('stage-deploy').classList.replace('active', 'success');
  logBuild('Deployment complete! Pods running and healthy.', 'success');

  logBuild('CI/CD Pipeline finished successfully in 5.2s.', 'success');
  btn.disabled = false;
  btn.textContent = 'Trigger Pipeline';
  isPipelineRunning = false;
}

renderContainers();