// Instruction Memory
const instructions = [
  { pc: '0x00', code: 'ADD R1, R2, R3', op: 'R1 = R2 + R3', state: 'QUEUED' },
  { pc: '0x04', code: 'SUB R4, R1, R5', op: 'R4 = R1 - R5', state: 'QUEUED' },
  { pc: '0x08', code: 'AND R6, R2, R1', op: 'R6 = R2 & R1', state: 'QUEUED' },
  { pc: '0x0C', code: 'OR  R7, R4, R6', op: 'R7 = R4 | R6', state: 'QUEUED' },
  { pc: '0x10', code: 'ADD R2, R7, R1', op: 'R2 = R7 + R1', state: 'QUEUED' }
];
// Register File (R0 to R7)
let registers = {
  R0: 0, R1: 5, R2: 10, R3: 15,
  R4: 20, R5: 3, R6: 8, R7: 12
};

let clockCycle = 0;
let pipeline = { IF: null, ID: null, EX: null, MEM: null, WB: null };
let pcIndex = 0;
let autoInterval = null;

function renderRegisters() {
  const grid = document.getElementById('reg-grid');
  grid.innerHTML = '';
  Object.entries(registers).forEach(([name, val]) => {
    const box = document.createElement('div');
    box.className = 'reg-box';
    box.innerHTML = `
      <span class="reg-name">${name}</span>
      <span class="reg-val">0x${val.toString(16).toUpperCase()} (${val})</span>
    `;
    grid.appendChild(box);
  });
}

function renderInstructions() {
  const tbody = document.getElementById('instruction-tbody');
  tbody.innerHTML = '';
  instructions.forEach((ins, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><code>${ins.pc}</code></td>
      <td><strong>${ins.code}</strong></td>
      <td>${ins.op}</td>
      <td><span class="cyan">${ins.state}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function logALU(msg, type = 'info') {
  const logs = document.getElementById('alu-logs');
  const div = document.createElement('div');
  div.className = `log-line ${type}`;
  div.textContent = `[Cycle ${clockCycle}] ${msg}`;
  logs.appendChild(div);
  logs.scrollTop = logs.scrollHeight;
}

function stepClock() {
  clockCycle++;
  document.getElementById('clock-cycle').textContent = clockCycle;
  document.getElementById('sim-status').textContent = 'RUNNING';

  // Shift pipeline stages: WB <- MEM <- EX <- ID <- IF <- New Instruction
  pipeline.WB = pipeline.MEM;
  pipeline.MEM = pipeline.EX;
  pipeline.EX = pipeline.ID;
  pipeline.ID = pipeline.IF;

  if (pcIndex < instructions.length) {
    pipeline.IF = instructions[pcIndex];
    instructions[pcIndex].state = 'IF';
    pcIndex++;
  } else {
    pipeline.IF = null;
  }

  // Update UI contents for stages
  document.getElementById('content-if').textContent = pipeline.IF ? pipeline.IF.code : 'NOP';
  document.getElementById('content-id').textContent = pipeline.ID ? pipeline.ID.code : 'NOP';
  document.getElementById('content-ex').textContent = pipeline.EX ? pipeline.EX.code : 'NOP';
  document.getElementById('content-mem').textContent = pipeline.MEM ? pipeline.MEM.code : 'NOP';
  document.getElementById('content-wb').textContent = pipeline.WB ? pipeline.WB.code : 'NOP';

  // Highlight active boxes
  document.getElementById('stage-if').className = `stage-box ${pipeline.IF ? 'active' : ''}`;
  document.getElementById('stage-id').className = `stage-box ${pipeline.ID ? 'active' : ''}`;
  document.getElementById('stage-ex').className = `stage-box ${pipeline.EX ? 'active' : ''}`;
  document.getElementById('stage-mem').className = `stage-box ${pipeline.MEM ? 'active' : ''}`;
  document.getElementById('stage-wb').className = `stage-box ${pipeline.WB ? 'active' : ''}`;

  logALU(`Pipeline shifted. Executing ALU stage for: ${pipeline.EX ? pipeline.EX.code : 'Idle'}`, 'success');
  renderInstructions();
}

function toggleAutoRun() {
  const btn = document.getElementById('auto-btn');
  if (autoInterval) {
    clearInterval(autoInterval);
    autoInterval = null;
    btn.textContent = 'Auto Play';
    document.getElementById('sim-status').textContent = 'PAUSED';
  } else {
    autoInterval = setInterval(stepClock, 1200);
    btn.textContent = 'Pause';
  }
}

function resetPipeline() {
  if (autoInterval) {
    clearInterval(autoInterval);
    autoInterval = null;
  }
  clockCycle = 0;
  pcIndex = 0;
  pipeline = { IF: null, ID: null, EX: null, MEM: null, WB: null };
  instructions.forEach(i => i.state = 'QUEUED');
  document.getElementById('clock-cycle').textContent = '0';
  document.getElementById('sim-status').textContent = 'IDLE';
  document.getElementById('auto-btn').textContent = 'Auto Play';
  
  ['if', 'id', 'ex', 'mem', 'wb'].forEach(s => {
    document.getElementById(`content-${s}`).textContent = '-';
    document.getElementById(`stage-${s}`).className = 'stage-box';
  });

  document.getElementById('alu-logs').innerHTML = '<div class="log-line">[System] Pipeline reset to initial state.</div>';
  renderInstructions();
  renderRegisters();
}

renderRegisters();
renderInstructions();