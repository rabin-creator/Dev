const LANE_COLORS = ['#00f0ff', '#10b981', '#8b5cf6', '#f59e0b', '#f43f5e'];

let repo = {};

function generateHash() {
  return Math.random().toString(16).substring(2, 9);
}

function initRepo() {
  const rootId = generateHash();
  repo = {
    commits: {
      [rootId]: {
        id: rootId,
        message: 'Initial commit',
        parents: [],
        lane: 0,
        step: 0,
        branch: 'main'
      }
    },
    branches: { main: rootId },
    lanes: { main: 0 },
    HEAD: { type: 'branch', ref: 'main' },
    selectedCommit: rootId,
    stepCounter: 1
  };
  render();
}

function getHeadCommitId() {
  return repo.HEAD.type === 'branch'
    ? repo.branches[repo.HEAD.ref]
    : repo.HEAD.ref;
}

function logTerminal(msg, type = 'log-info') {
  const out = document.getElementById('terminal-output');
  const div = document.createElement('div');
  div.className = type;
  div.innerHTML = msg;
  out.appendChild(div);
  out.scrollTop = out.scrollHeight;
}

function executeCommand(raw) {
  const cmd = raw.trim();
  if (!cmd) return;
  logTerminal(`$ ${cmd}`);

  if (cmd === 'help') {
    logTerminal('Commands: git init | git commit -m "msg" | git branch <name> | git checkout <branch|hash> | git checkout -b <name> | git merge <branch> | git reset --hard HEAD~1');
    return;
  }

  if (cmd === 'git init') {
    initRepo();
    logTerminal('Reinitialized empty Git repository.', 'log-success');
    return;
  }

  // git commit -m "..."
  const commitMatch = cmd.match(/^git commit -m ["'](.+)["']$/);
  if (commitMatch) {
    const parentId = getHeadCommitId();
    const newId = generateHash();
    const activeBranch = repo.HEAD.type === 'branch' ? repo.HEAD.ref : 'detached';
    const lane = repo.HEAD.type === 'branch' ? repo.lanes[activeBranch] : Object.keys(repo.lanes).length;

    repo.commits[newId] = {
      id: newId,
      message: commitMatch[1],
      parents: [parentId],
      lane,
      step: repo.stepCounter++,
      branch: activeBranch
    };

    if (repo.HEAD.type === 'branch') {
      repo.branches[activeBranch] = newId;
    } else {
      repo.HEAD.ref = newId;
    }
    repo.selectedCommit = newId;
    logTerminal(`[${activeBranch} ${newId}] ${commitMatch[1]}`, 'log-success');
    render();
    return;
  }

  // git branch <name>
  const branchMatch = cmd.match(/^git branch ([a-zA-Z0-9_-]+)$/);
  if (branchMatch) {
    const name = branchMatch[1];
    if (repo.branches[name]) {
      logTerminal(`fatal: A branch named '${name}' already exists.`, 'log-error');
      return;
    }
    repo.branches[name] = getHeadCommitId();
    repo.lanes[name] = Object.keys(repo.lanes).length;
    logTerminal(`Created branch '${name}'.`, 'log-success');
    render();
    return;
  }

  // git checkout -b <name>
  const checkoutNewMatch = cmd.match(/^git checkout -b ([a-zA-Z0-9_-]+)$/);
  if (checkoutNewMatch) {
    const name = checkoutNewMatch[1];
    if (repo.branches[name]) {
      logTerminal(`fatal: A branch named '${name}' already exists.`, 'log-error');
      return;
    }
    repo.branches[name] = getHeadCommitId();
    repo.lanes[name] = Object.keys(repo.lanes).length;
    repo.HEAD = { type: 'branch', ref: name };
    logTerminal(`Switched to a new branch '${name}'`, 'log-success');
    render();
    return;
  }

  // git checkout <target>
  const checkoutMatch = cmd.match(/^git checkout ([a-zA-Z0-9_-]+)$/);
  if (checkoutMatch) {
    const target = checkoutMatch[1];
    if (repo.branches[target]) {
      repo.HEAD = { type: 'branch', ref: target };
      repo.selectedCommit = repo.branches[target];
      logTerminal(`Switched to branch '${target}'`, 'log-success');
      render();
      return;
    }
    if (repo.commits[target]) {
      repo.HEAD = { type: 'commit', ref: target };
      repo.selectedCommit = target;
      logTerminal(`Note: switching to '${target}' (detached HEAD).`, 'log-info');
      render();
      return;
    }
    logTerminal(`error: pathspec '${target}' did not match any branch or commit.`, 'log-error');
    return;
  }

  // git merge <branch>
  const mergeMatch = cmd.match(/^git merge ([a-zA-Z0-9_-]+)$/);
  if (mergeMatch) {
    const sourceBranch = mergeMatch[1];
    if (!repo.branches[sourceBranch]) {
      logTerminal(`merge: ${sourceBranch} - not something we can merge`, 'log-error');
      return;
    }
    if (repo.HEAD.type !== 'branch') {
      logTerminal(`Cannot merge into a detached HEAD.`, 'log-error');
      return;
    }
    const targetBranch = repo.HEAD.ref;
    const targetId = repo.branches[targetBranch];
    const sourceId = repo.branches[sourceBranch];

    if (targetId === sourceId) {
      logTerminal(`Already up to date.`, 'log-info');
      return;
    }

    // Create 3-way merge commit
    const mergeId = generateHash();
    repo.commits[mergeId] = {
      id: mergeId,
      message: `Merge branch '${sourceBranch}' into ${targetBranch}`,
      parents: [targetId, sourceId],
      lane: repo.lanes[targetBranch],
      step: repo.stepCounter++,
      branch: targetBranch
    };
    repo.branches[targetBranch] = mergeId;
    repo.selectedCommit = mergeId;
    logTerminal(`Merged '${sourceBranch}' into '${targetBranch}' (${mergeId})`, 'log-success');
    render();
    return;
  }

  // git reset --hard HEAD~1
  if (cmd === 'git reset --hard HEAD~1') {
    const currId = getHeadCommitId();
    const currCommit = repo.commits[currId];
    if (!currCommit || currCommit.parents.length === 0) {
      logTerminal(`Cannot reset past initial commit.`, 'log-error');
      return;
    }
    const parentId = currCommit.parents[0];
    if (repo.HEAD.type === 'branch') {
      repo.branches[repo.HEAD.ref] = parentId;
    } else {
      repo.HEAD.ref = parentId;
    }
    repo.selectedCommit = parentId;
    logTerminal(`HEAD is now at ${parentId}`, 'log-success');
    render();
    return;
  }

  logTerminal(`git: '${cmd}' is not recognized. Type 'help' for valid commands.`, 'log-error');
}

function runQuickCmd(cmd) {
  executeCommand(cmd);
}

function render() {
  // Update Status Pills
  const headLabel = repo.HEAD.type === 'branch' ? repo.HEAD.ref : `DETACHED (${repo.HEAD.ref})`;
  document.getElementById('head-status').textContent = headLabel;
  document.getElementById('commit-count').textContent = Object.keys(repo.commits).length;

  // Update Branch List
  const branchUl = document.getElementById('branch-list');
  branchUl.innerHTML = '';
  Object.entries(repo.branches).forEach(([name, commitId]) => {
    const li = document.createElement('li');
    if (repo.HEAD.type === 'branch' && repo.HEAD.ref === name) li.classList.add('active');
    li.innerHTML = `<span>${name}</span><span>${commitId}</span>`;
    li.onclick = () => executeCommand(`git checkout ${name}`);
    branchUl.appendChild(li);
  });

  // Update Selected Commit Details
  const sel = repo.commits[repo.selectedCommit];
  if (sel) {
    document.getElementById('det-hash').textContent = sel.id;
    document.getElementById('det-branch').textContent = sel.branch;
    document.getElementById('det-parents').textContent = sel.parents.length ? sel.parents.join(', ') : 'None (Root)';
    document.getElementById('det-msg').textContent = sel.message;
  }

  // Draw SVG Graph
  const svg = document.getElementById('git-graph');
  svg.innerHTML = '';
  const commitsArr = Object.values(repo.commits);
  const startX = 80;
  const startY = 70;
  const stepX = 115;
  const laneY = 75;

  svg.setAttribute('width', Math.max(700, startX + commitsArr.length * stepX + 120));
  svg.setAttribute('height', Math.max(320, startY + Object.keys(repo.lanes).length * laneY + 80));

  // Draw Edges First
  commitsArr.forEach(c => {
    const x2 = startX + c.step * stepX;
    const y2 = startY + c.lane * laneY;

    c.parents.forEach((pId, idx) => {
      const p = repo.commits[pId];
      if (!p) return;
      const x1 = startX + p.step * stepX;
      const y1 = startY + p.lane * laneY;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const midX = (x1 + x2) / 2;
      path.setAttribute('d', `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', idx === 1 ? '#f43f5e' : '#334155');
      path.setAttribute('stroke-width', '2.5');
      if (idx === 1) path.setAttribute('stroke-dasharray', '5,4');
      svg.appendChild(path);
    });
  });

  // Draw Nodes
  commitsArr.forEach(c => {
    const cx = startX + c.step * stepX;
    const cy = startY + c.lane * laneY;
    const color = LANE_COLORS[c.lane % LANE_COLORS.length];
    const isHead = getHeadCommitId() === c.id;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.style.cursor = 'pointer';
    g.onclick = () => {
      repo.selectedCommit = c.id;
      render();
    };

    if (isHead) {
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ring.setAttribute('cx', cx);
      ring.setAttribute('cy', cy);
      ring.setAttribute('r', '21');
      ring.setAttribute('fill', 'none');
      ring.setAttribute('stroke', '#00f0ff');
      ring.setAttribute('stroke-width', '2');
      ring.setAttribute('stroke-dasharray', '4,3');
      g.appendChild(ring);
    }

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', '14');
    circle.setAttribute('fill', '#0a101d');
    circle.setAttribute('stroke', color);
    circle.setAttribute('stroke-width', '3');
    g.appendChild(circle);

    const hashText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    hashText.setAttribute('x', cx);
    hashText.setAttribute('y', cy + 28);
    hashText.setAttribute('text-anchor', 'middle');
    hashText.setAttribute('fill', '#94a3b8');
    hashText.setAttribute('font-size', '11');
    hashText.textContent = c.id;
    g.appendChild(hashText);

    // Branch Labels attached to this commit
    const pointingBranches = Object.entries(repo.branches)
      .filter(([, id]) => id === c.id)
      .map(([name]) => name);

    pointingBranches.forEach((bName, idx) => {
      const tag = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      tag.setAttribute('x', cx);
      tag.setAttribute('y', cy - 24 - idx * 16);
      tag.setAttribute('text-anchor', 'middle');
      tag.setAttribute('fill', isHead && repo.HEAD.ref === bName ? '#00f0ff' : '#10b981');
      tag.setAttribute('font-size', '11');
      tag.setAttribute('font-weight', 'bold');
      tag.textContent = isHead && repo.HEAD.ref === bName ? `HEAD -> ${bName}` : bName;
      g.appendChild(tag);
    });

    svg.appendChild(g);
  });
}

document.getElementById('terminal-form').addEventListener('submit', e => {
  e.preventDefault();
  const input = document.getElementById('cmd-input');
  executeCommand(input.value);
  input.value = '';
});

initRepo();