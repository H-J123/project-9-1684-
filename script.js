
let currentFrame = 1;
let selectedParameters = [];
let parameterValues = {};

const frames = document.querySelectorAll('.frame');
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backBtn');
const resetBtn = document.getElementById('resetBtn');

nextBtn.addEventListener('click', function () {
  if (currentFrame === 1) {
    selectedParameters = [];
    document.querySelectorAll('input[name="parameter"]:checked').forEach(param => selectedParameters.push(param.value));
    if (selectedParameters.length === 0) { alert("Select at least one parameter"); return; }
    generateValueInputs();
  } else if (currentFrame === 2) {
    parameterValues = {};
    selectedParameters.forEach(param => {
      const val = parseFloat(document.getElementById(param).value);
      if (!isNaN(val)) parameterValues[param] = val;
    });
  } else if (currentFrame === 3) {
    generateCharts();
    classifyWater();
  }
  if (currentFrame < 4) currentFrame++;
  updateFrames();
});

backBtn.addEventListener('click', () => { if (currentFrame > 1) currentFrame--; updateFrames(); });
resetBtn.addEventListener('click', () => { currentFrame = 1; selectedParameters = []; parameterValues = {}; updateFrames(); });

function updateFrames() { frames.forEach((f, i) => f.classList.toggle('active', i === currentFrame - 1)); }

function generateValueInputs() {
  const area = document.getElementById('valueInputs');
  area.innerHTML = '';
  selectedParameters.forEach(param => {
    area.innerHTML += `<div><label>${param}</label><input type="number" id="${param}" placeholder="Enter value"></div>`;
  });
}

function generateCharts() {
  new Chart(document.getElementById('pieChart'), { type: 'pie', data: { labels: Object.keys(parameterValues), datasets: [{ data: Object.values(parameterValues) }] } });
  new Chart(document.getElementById('barChart'), { type: 'bar', data: { labels: Object.keys(parameterValues), datasets: [{ data: Object.values(parameterValues) }] } });
  new Chart(document.getElementById('scatterChart'), { type: 'scatter', data: { datasets: [{ label: 'Scatter', data: Object.entries(parameterValues).map(([x,y]) => ({x, y})) }] } });
  new Chart(document.getElementById('gaugeChart'), { type: 'doughnut', data: { datasets: [{ data: [parameterValues['pH'] || 7, 14 - (parameterValues['pH'] || 7)], backgroundColor: [(parameterValues['pH'] || 7) < 7 ? 'red' : 'blue', '#ddd'] }] }, options: { cutout: '70%' } });
  new Chart(document.getElementById('ribbonChart'), { type: 'line', data: { labels: Object.keys(parameterValues), datasets: [{ data: Object.values(parameterValues), fill: true }] } });
}

function classifyWater() {
  const result = Object.values(parameterValues).some(val => val > 10) ? 'INORGANIC' : 'ORGANIC';
  document.getElementById('classificationResult').innerText = `Water Type: ${result}`;
}
