const fs = require('fs');
const path = require('path');

// Load Results Data
const jsonPath = path.join(__dirname, '..', 'test-results', 'results.json');
if (!fs.existsSync(jsonPath)) {
  console.error(`Error: File not found at ${jsonPath}`);
  process.exit(1);
}

const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const reportGeneratedAt = new Date().toLocaleString();

const envMetadata = rawData.config?.metadata?.environments || {
  Sakani: 'Pre-Prod',
  Digitar: 'STG',
  Sayal: 'Pre-Prod'
};
const globalEnv = rawData.config?.metadata?.environment || process.env.TEST_ENV || 'Pre-Prod';

function formatDuration(ms) {
  if (!ms || ms <= 0) return '0s';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = (ms % 60000 / 1000).toFixed(1);

  if (hours > 0) return `${hours}h ${minutes > 0 ? minutes + 'm ' : ''}${seconds > 0 ? Math.floor(seconds) + 's' : ''}`.trim();
  if (minutes > 0) return `${minutes}m ${Math.floor(seconds) > 0 ? Math.floor(seconds) + 's' : ''}`.trim();
  return `${(ms / 1000).toFixed(2)}s`;
}

function getCleanFileName(filePath) {
  if (!filePath) return 'Default Suite';
  return path.basename(filePath).replace(/\.(spec|test)\.[jt]sx?$/i, '').replace(/\.[jt]sx?$/i, '');
}

function extractAllTests(suites, parentAnnotations = [], parentSuiteTitle = '') {
  let testItems = [];

  for (const suite of suites) {
    const currentAnnotations = [...parentAnnotations, ...(suite.annotations || [])];
    const fileName = getCleanFileName(suite.file);
    let currentSuiteTitle = suite.title && suite.title !== suite.file ? suite.title : (parentSuiteTitle || fileName);

    if (suite.specs) {
      for (const spec of suite.specs) {
        const specAnnotations = [...currentAnnotations, ...(spec.annotations || [])];
        const displaySuite = spec.suiteTitle || (suite.title && suite.title !== spec.file ? suite.title : currentSuiteTitle);

        if (spec.tests && spec.tests.length > 0) {
          for (const test of spec.tests) {
            testItems.push({
              suiteTitle: displaySuite,
              specTitle: spec.title,
              specFile: spec.file || suite.file || '',
              testObj: test,
              annotations: [...specAnnotations, ...(test.annotations || [])]
            });
          }
        } else {
          testItems.push({
            suiteTitle: displaySuite,
            specTitle: spec.title,
            specFile: spec.file || suite.file || '',
            testObj: { status: spec.ok ? 'passed' : 'skipped', results: [] },
            annotations: specAnnotations
          });
        }
      }
    }

    if (suite.suites) {
      testItems = testItems.concat(extractAllTests(suite.suites, currentAnnotations, currentSuiteTitle));
    }
  }

  return testItems;
}

function getProductName(annotations) {
  if (annotations && Array.isArray(annotations)) {
    for (const a of annotations) {
      if (a.product) return a.product;
      if (a.Product) return a.Product;
      if ((a.type === 'product' || a.type === 'Product') && (a.description || a.value)) {
        return a.description || a.value;
      }
      if (a.type === 'tag' && a.description) {
        const cleanTag = a.description.replace(/^@/, '');
        if (!/^p[0-4]$/i.test(cleanTag)) {
          return cleanTag.charAt(0).toUpperCase() + cleanTag.slice(1);
        }
      }
    }
  }
  return 'Sakani';
}

function getEnvironmentName(annotations, productKey) {
  if (annotations && Array.isArray(annotations)) {
    for (const a of annotations) {
      if (a.env || a.environment) return a.env || a.environment;
      if ((a.type === 'env' || a.type === 'environment') && (a.description || a.value)) {
        return a.description || a.value;
      }
    }
  }
  return envMetadata[productKey] || globalEnv;
}

function isCriticalTest(annotations) {
  if (!annotations || !Array.isArray(annotations)) return false;
  return annotations.some(a => 
    a.type === 'critical' || 
    a.type === 'Critical' || 
    a.critical === true || 
    (a.type === 'tag' && a.description && a.description.toLowerCase().includes('p1'))
  );
}

const allTests = extractAllTests(rawData.suites || []);
const rawProcessedSpecs = [];

allTests.forEach((item, index) => {
  const productKey = getProductName(item.annotations);
  const environmentKey = getEnvironmentName(item.annotations, productKey);
  const isCritical = isCriticalTest(item.annotations);

  let status = 'Skipped';
  let testDurationMs = 0;
  let steps = [];
  const lastResult = item.testObj.results?.[item.testObj.results.length - 1];

  if (lastResult) {
    testDurationMs = lastResult.duration || 0;
    if (lastResult.status === 'passed') status = 'Passed';
    else if (lastResult.status === 'failed' || lastResult.status === 'timedOut') status = 'Failed';
    else if (lastResult.status === 'skipped') status = 'Skipped';

    if (lastResult.steps && Array.isArray(lastResult.steps)) {
      steps = lastResult.steps.map(step => ({
        title: step.title,
        durationMs: step.duration || 0,
        durationStr: formatDuration(step.duration || 0)
      }));
    }
  } else if (item.testObj.status === 'passed') {
    status = 'Passed';
  }

  rawProcessedSpecs.push({
    id: `tc-${index + 1}`,
    suite: item.suiteTitle,
    title: item.specTitle,
    product: productKey,
    environment: environmentKey,
    file: item.specFile,
    durationMs: testDurationMs,
    durationStr: formatDuration(testDurationMs),
    status: status,
    isCritical: isCritical,
    steps: steps
  });
});

function buildProductData(specsList) {
  const productData = {};

  specsList.forEach(spec => {
    const pKey = spec.product || 'Sakani';

    if (!productData[pKey]) {
      productData[pKey] = {
        product: pKey,
        environment: spec.environment,
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        durationMs: 0,
        suitesSet: new Set(),
        specs: []
      };
    }

    productData[pKey].total += 1;
    productData[pKey].durationMs += spec.durationMs;
    if (spec.suite) productData[pKey].suitesSet.add(spec.suite);
    if (spec.status === 'Passed') productData[pKey].passed += 1;
    else if (spec.status === 'Failed') productData[pKey].failed += 1;
    else productData[pKey].skipped += 1;
    productData[pKey].specs.push(spec);
  });

  Object.keys(productData).forEach(key => {
    productData[key].formattedDuration = formatDuration(productData[key].durationMs);
    productData[key].suitesList = Array.from(productData[key].suitesSet).join(', ') || 'N/A';
  });

  return productData;
}

const healthCheckData = buildProductData(rawProcessedSpecs);
const readinessData = buildProductData(rawProcessedSpecs.filter(s => s.isCritical));

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sakani Test Automation Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    html, body {
      overflow-y: scroll !important;
      -ms-overflow-style: scrollbar !important;
      scrollbar-width: auto !important;
    }

    ::-webkit-scrollbar {
      display: block !important;
      width: 10px !important;
      height: 10px !important;
    }

    ::-webkit-scrollbar-track {
      background: #f1f5f9 !important;
    }

    ::-webkit-scrollbar-thumb {
      background: #cbd5e1 !important;
      border-radius: 4px !important;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #166242 !important;
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen p-6 font-sans">
  <div class="max-w-7xl mx-auto space-y-6">
    
    <header class="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-wide" style="color: #166242;">Sakani Automation Test Dashboard</h1>
      </div>

      <!-- Single Button Pill Product Filter -->
      <div class="relative inline-block text-left w-full sm:w-auto min-w-[220px]" id="productDropdownContainer">
        <button id="productDropdownBtn" onclick="toggleDropdown('productDropdownMenu')" class="w-full bg-[#166242] hover:bg-[#125036] text-white font-semibold text-sm rounded-xl px-4 py-2 border-2 border-slate-200/60 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 cursor-pointer transition-all shadow-sm flex items-center justify-between gap-2.5">
          <div class="flex items-center gap-2 truncate">
            <svg class="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 6h10M3 10h8M3 14h6M3 18h4M17 6v12m0 0l-3-3m3 3l3-3"></path>
            </svg>
            <span class="truncate">Product: <strong id="productDropdownSelected" class="font-bold">${Object.keys(healthCheckData)[0] || 'Sakani'}</strong></span>
          </div>
          <svg class="w-3.5 h-3.5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div id="productDropdownMenu" class="hidden absolute left-0 right-0 w-full mt-1.5 rounded-xl shadow-lg bg-white border border-slate-200 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
          ${Object.keys(healthCheckData).map(key => `
            <div onclick="selectProductOption('${key}')" class="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-[#166242] hover:text-white cursor-pointer transition-colors flex items-center justify-between">
              <span>${healthCheckData[key].product}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </header>

    <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-sm font-bold tracking-wide" style="color: #166242;">Assessment Scope</h2>
        <p class="text-xs text-slate-500 mt-0.5">Filter metrics by critical tests (Readiness) or full suite (Health Check)</p>
      </div>
      <div class="flex items-center gap-3">
        <button id="btnReadiness" onclick="setExecutionMode('readiness')" class="px-5 py-2 text-xs font-bold rounded-lg transition-all border border-emerald-700 text-emerald-800 bg-white hover:bg-emerald-50 shadow-sm">
          Readiness
        </button>
        <button id="btnHealthCheck" onclick="setExecutionMode('health')" class="px-5 py-2 text-xs font-bold rounded-lg transition-all border border-emerald-700 bg-[#166242] text-white shadow-sm">
          Health Check
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <p class="text-xs font-bold text-slate-500 tracking-wider">Total Test Cases</p>
        <p id="totalExecuted" class="text-3xl font-extrabold text-slate-900 mt-2">0</p>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <p class="text-xs font-bold text-emerald-600 tracking-wider">Passed</p>
        <p id="passedCount" class="text-3xl font-extrabold text-emerald-600 mt-2">0</p>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <p class="text-xs font-bold text-rose-600 tracking-wider">Failed</p>
        <p id="failedCount" class="text-3xl font-extrabold text-rose-600 mt-2">0</p>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <p class="text-xs font-bold text-amber-600 tracking-wider">Skipped</p>
        <p id="skippedCount" class="text-3xl font-extrabold text-amber-600 mt-2">0</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
        <h2 class="text-base font-bold mb-2" style="color: #166242;">Execution Ratio</h2>
        
        <div class="relative flex items-center justify-center h-48">
          <canvas id="statusChart"></canvas>
        </div>

        <div id="customLegend" class="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-100"></div>
      </div>

      <div class="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
        <h2 class="text-base font-bold mb-4" style="color: #166242;">Test Run Information</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          
          <div class="sm:col-span-2 bg-slate-50 p-4 rounded-lg border border-slate-200 h-auto">
            <p class="text-slate-500 text-xs font-bold">Suites Scope</p>
            <p id="suitesScopeValue" class="font-semibold text-slate-800 mt-1 leading-relaxed break-words">-</p>
          </div>

          <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p class="text-slate-500 text-xs font-bold">Product Scope</p>
            <p id="productScopeValue" class="font-semibold text-slate-800 mt-1">-</p>
          </div>
          <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p class="text-slate-500 text-xs font-bold">Environment</p>
            <p id="environmentValue" class="font-semibold text-slate-800 mt-1">Pre-Prod</p>
          </div>
          <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p class="text-slate-500 text-xs font-bold">Total Duration</p>
            <p id="tagDurationValue" class="font-semibold text-indigo-600 mt-1">0s</p>
          </div>
          <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p class="text-slate-500 text-xs font-bold">Report Generated At</p>
            <p class="font-semibold text-slate-800 mt-1">${reportGeneratedAt}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <h2 class="text-base font-bold" style="color: #166242;">Test Cases (<span id="tableTagTitle">-</span>)</h2>
        
        <!-- Single Button Pill Status Filter -->
        <div class="relative inline-block text-left w-full sm:w-auto min-w-[180px]" id="statusDropdownContainer">
          <button id="statusDropdownBtn" onclick="toggleDropdown('statusDropdownMenu')" class="w-full bg-[#166242] hover:bg-[#125036] text-white font-semibold text-sm rounded-xl px-4 py-2 border-2 border-slate-200/60 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 cursor-pointer transition-all shadow-sm flex items-center justify-between gap-2.5">
            <div class="flex items-center gap-2 truncate">
              <svg class="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 6h10M3 10h8M3 14h6M3 18h4M17 6v12m0 0l-3-3m3 3l3-3"></path>
              </svg>
              <span class="truncate">Status: <strong id="statusDropdownSelected" class="font-bold">All</strong></span>
            </div>
            <svg class="w-3.5 h-3.5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div id="statusDropdownMenu" class="hidden absolute left-0 right-0 w-full mt-1.5 rounded-xl shadow-lg bg-white border border-slate-200 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
            <div onclick="selectStatusOption('all', 'All')" class="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-[#166242] hover:text-white cursor-pointer transition-colors">All</div>
            <div onclick="selectStatusOption('passed', 'Passed')" class="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-[#166242] hover:text-white cursor-pointer transition-colors">Passed</div>
            <div onclick="selectStatusOption('failed', 'Failed')" class="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-[#166242] hover:text-white cursor-pointer transition-colors">Failed</div>
            <div onclick="selectStatusOption('skipped', 'Skipped')" class="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-[#166242] hover:text-white cursor-pointer transition-colors">Skipped</div>
          </div>
        </div>

      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-700 table-fixed">
          <thead class="bg-slate-100 text-slate-500 text-xs font-bold border-b border-slate-200">
            <tr>
              <th class="py-3 px-4 font-bold w-[25%]">Suite</th>
              <th class="py-3 px-4 font-bold w-[50%]">Test Case</th>
              <th class="py-3 px-4 font-bold w-[12%] text-center">Duration</th>
              <th class="py-3 px-4 font-bold w-[13%] text-center">Status</th>
            </tr>
          </thead>
          <tbody id="testCasesTable" class="divide-y divide-slate-200"></tbody>
        </table>
      </div>
    </div>

  </div>

  <script>
    const healthCheckData = ${JSON.stringify(healthCheckData, null, 2)};
    const readinessData = ${JSON.stringify(readinessData, null, 2)};
    
    let currentMode = 'health';
    let currentStatusFilter = 'all';
    let selectedProductKey = "${Object.keys(healthCheckData)[0] || 'Sakani'}";
    let chartInstance = null;

    function toggleDropdown(menuId) {
      const menu = document.getElementById(menuId);
      const isHidden = menu.classList.contains('hidden');
      closeAllDropdowns();
      if (isHidden) {
        menu.classList.remove('hidden');
      }
    }

    function closeAllDropdowns() {
      document.getElementById('productDropdownMenu').classList.add('hidden');
      document.getElementById('statusDropdownMenu').classList.add('hidden');
    }

    document.addEventListener('click', function(event) {
      const pContainer = document.getElementById('productDropdownContainer');
      const sContainer = document.getElementById('statusDropdownContainer');
      if (!pContainer.contains(event.target) && !sContainer.contains(event.target)) {
        closeAllDropdowns();
      }
    });

    function selectProductOption(key) {
      selectedProductKey = key;
      document.getElementById('productDropdownSelected').innerText = key;
      closeAllDropdowns();
      renderDashboard(selectedProductKey);
    }

    function selectStatusOption(value, label) {
      currentStatusFilter = value;
      document.getElementById('statusDropdownSelected').innerText = label;
      closeAllDropdowns();
      renderDashboard(selectedProductKey);
    }

    function toggleSteps(stepRowId) {
      const stepRow = document.getElementById(stepRowId);
      if (!stepRow) return;
      stepRow.classList.toggle('hidden');
    }

    function setExecutionMode(mode) {
      currentMode = mode;
      const btnReadiness = document.getElementById('btnReadiness');
      const btnHealthCheck = document.getElementById('btnHealthCheck');

      if (mode === 'readiness') {
        btnReadiness.className = "px-5 py-2 text-xs font-bold rounded-lg transition-all border border-emerald-700 bg-[#166242] text-white shadow-sm";
        btnHealthCheck.className = "px-5 py-2 text-xs font-bold rounded-lg transition-all border border-emerald-700 text-emerald-800 bg-white hover:bg-emerald-50 shadow-sm";
      } else {
        btnHealthCheck.className = "px-5 py-2 text-xs font-bold rounded-lg transition-all border border-emerald-700 bg-[#166242] text-white shadow-sm";
        btnReadiness.className = "px-5 py-2 text-xs font-bold rounded-lg transition-all border border-emerald-700 text-emerald-800 bg-white hover:bg-emerald-50 shadow-sm";
      }

      renderDashboard(selectedProductKey);
    }

    function renderDashboard(productKey) {
      const activeDataMap = currentMode === 'readiness' ? readinessData : healthCheckData;
      const availableKeys = Object.keys(activeDataMap);
      const targetKey = activeDataMap[productKey] ? productKey : availableKeys[0];
      const data = activeDataMap[targetKey];

      if (!data) {
        document.getElementById("testCasesTable").innerHTML = \`<tr><td colspan="4" class="py-6 text-center text-slate-400 font-medium">No test cases available.</td></tr>\`;
        return;
      }

      const total = data.total;
      const passed = data.passed;
      const failed = data.failed;
      const skipped = data.skipped;

      document.getElementById("totalExecuted").innerText = total;
      document.getElementById("passedCount").innerText = passed;
      document.getElementById("failedCount").innerText = failed;
      document.getElementById("skippedCount").innerText = skipped;
      document.getElementById("tableTagTitle").innerText = data.product;

      document.getElementById("suitesScopeValue").innerText = data.suitesList || 'None';
      document.getElementById("productScopeValue").innerText = data.product;
      document.getElementById("environmentValue").innerText = data.environment || 'Pre-Prod';
      document.getElementById("tagDurationValue").innerText = data.formattedDuration;

      const tableBody = document.getElementById("testCasesTable");
      tableBody.innerHTML = "";

      const filteredSpecs = data.specs.filter(spec => {
        if (currentStatusFilter === 'passed') return spec.status === 'Passed';
        if (currentStatusFilter === 'failed') return spec.status === 'Failed';
        if (currentStatusFilter === 'skipped') return spec.status === 'Skipped';
        return true;
      });

      if (filteredSpecs.length === 0) {
        tableBody.innerHTML = \`<tr><td colspan="4" class="py-6 text-center text-slate-400 font-medium">No test cases found for this status filter.</td></tr>\`;
      } else {
        filteredSpecs.forEach(spec => {
          let statusBadgeClass = "bg-amber-100 text-amber-800 border-amber-300";
          if (spec.status === "Passed") statusBadgeClass = "bg-emerald-100 text-emerald-800 border-emerald-300";
          if (spec.status === "Failed") statusBadgeClass = "bg-rose-100 text-rose-800 border-rose-300";

          const isFailedWithSteps = spec.status === 'Failed' && spec.steps && spec.steps.length > 0;
          const stepRowId = \`steps-\${spec.id}\`;

          const cursorClass = isFailedWithSteps ? "cursor-pointer hover:bg-slate-100/80" : "hover:bg-slate-50";
          const clickAttr = isFailedWithSteps ? \`onclick="toggleSteps('\${stepRowId}')"\` : "";

          const row = \`
            <tr \${clickAttr} class="transition-colors \${cursorClass}">
              <td class="py-3.5 px-4 font-mono text-xs text-slate-600 break-words whitespace-normal">\${spec.suite}</td>
              <td class="py-3.5 px-4 font-medium text-slate-900 break-words whitespace-normal">
                <div class="flex items-center gap-2">
                  <span>\${spec.title}</span>
                  \${isFailedWithSteps ? \`<span class="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded px-1.5 py-0.5">Click to view steps</span>\` : ''}
                </div>
              </td>
              <td class="py-3.5 px-4 text-slate-600 font-mono text-xs text-center break-words whitespace-normal">\${spec.durationStr}</td>
              <td class="py-3.5 px-4 text-center">
                <span class="inline-block px-2.5 py-1 text-xs font-semibold border rounded-full \${statusBadgeClass}">
                  \${spec.status}
                </span>
              </td>
            </tr>
          \`;
          tableBody.insertAdjacentHTML('beforeend', row);

          if (isFailedWithSteps) {
            const stepsListHtml = spec.steps.map((step, idx) => \`
              <li class="flex items-center justify-between text-xs py-1.5 border-b border-slate-200 last:border-0">
                <span class="text-slate-800 font-medium break-words whitespace-normal"><strong class="text-rose-700 font-bold mr-1.5">Step \${idx + 1}:</strong> \${step.title}</span>
                <span class="font-mono text-slate-500 text-[11px] ml-2 shrink-0">\${step.durationStr}</span>
              </li>
            \`).join('');

            const stepRowHtml = \`
              <tr id="\${stepRowId}" class="hidden bg-slate-100/70 border-b border-slate-200">
                <td colspan="4" class="py-3 px-6">
                  <div class="bg-white rounded-lg border border-slate-200 p-3 shadow-inner">
                    <p class="text-xs font-bold text-rose-700 mb-2 pb-1 border-b border-slate-100">Failed Execution Steps</p>
                    <ul class="space-y-0.5">
                      \${stepsListHtml}
                    </ul>
                  </div>
                </td>
              </tr>
            \`;
            tableBody.insertAdjacentHTML('beforeend', stepRowHtml);
          }
        });
      }

      const passedPct = total > 0 ? ((passed / total) * 100).toFixed(1) + '%' : '0.0%';
      const failedPct = total > 0 ? ((failed / total) * 100).toFixed(1) + '%' : '0.0%';
      const skippedPct = total > 0 ? ((skipped / total) * 100).toFixed(1) + '%' : '0.0%';

      const legendContainer = document.getElementById('customLegend');
      legendContainer.innerHTML = \`
        <div class="flex flex-col items-center text-center">
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-sm bg-[#10B981] inline-block"></span>
            <span class="text-xs font-semibold" style="color: #166242;">Passed</span>
          </div>
          <span class="text-sm font-bold text-slate-900 mt-0.5">\${passedPct}</span>
        </div>

        <div class="flex flex-col items-center text-center">
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-sm bg-[#EF4444] inline-block"></span>
            <span class="text-xs font-semibold" style="color: #166242;">Failed</span>
          </div>
          <span class="text-sm font-bold text-slate-900 mt-0.5">\${failedPct}</span>
        </div>

        <div class="flex flex-col items-center text-center">
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-sm bg-[#F59E0B] inline-block"></span>
            <span class="text-xs font-semibold" style="color: #166242;">Skipped</span>
          </div>
          <span class="text-sm font-bold text-slate-900 mt-0.5">\${skippedPct}</span>
        </div>
      \`;

      if (chartInstance) chartInstance.destroy();

      const ctx = document.getElementById('statusChart').getContext('2d');
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Passed', 'Failed', 'Skipped'],
          datasets: [{
            data: [passed, failed, skipped],
            backgroundColor: ['#10B981', '#EF4444', '#F59E0B'],
            borderWidth: 2,
            borderColor: '#FFFFFF'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const totalVal = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = totalVal > 0 ? ((value / totalVal) * 100).toFixed(1) + '%' : '0.0%';
                  return \`\${label}: \${value} (\${percentage})\`;
                }
              }
            }
          },
          cutout: '60%'
        }
      });
    }

    setExecutionMode('health');
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'dashboard.html'), htmlContent);
console.log('✅ Dashboard generated successfully.');