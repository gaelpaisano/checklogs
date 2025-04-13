document.getElementById('logForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const file = document.getElementById('fileInput').files[0];
    const keyword = document.getElementById('keyword').value.toLowerCase();
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
  
    resultsDiv.innerHTML = '';
    loadingDiv.style.display = 'block';
  
    if (!file || (!file.type.startsWith("text/") && !file.name.match(/\.(txt|log|csv|json)$/i))) {
      resultsDiv.innerHTML = '<p class="text-danger">Selecciona un archivo de texto válido.</p>';
      loadingDiv.style.display = 'none';
      return;
    }
  
    if (file.size > 20 * 1024 * 1024) {
      resultsDiv.innerHTML = '<p class="text-danger">El archivo supera los 20MB permitidos.</p>';
      loadingDiv.style.display = 'none';
      return;
    }
  
    const reader = new FileReader();
    reader.onload = function (e) {
      const lines = e.target.result.split(/\r?\n/);
      const matches = [];
  
      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(keyword)) {
          matches.push({ number: index + 1, line: line });
        }
      });
  
      loadingDiv.style.display = 'none';
  
      if (matches.length === 0) {
        resultsDiv.innerHTML = '<p class="text-danger">No se encontraron coincidencias.</p>';
        return;
      }
  
      resultsDiv.innerHTML += `<p><strong>${matches.length}</strong> coincidencias encontradas:</p>`;
  
      matches.forEach(m => {
        const div = document.createElement('div');
        div.className = 'match';
        const highlighted = m.line.replace(
          new RegExp(`(${keyword})`, 'gi'),
          '<mark>$1</mark>'
        );
        div.innerHTML = `<strong>Línea ${m.number}:</strong> ${highlighted}`;
        resultsDiv.appendChild(div);
      });
  
      const resultText = matches.map(m => `Línea ${m.number}: ${m.line}`).join('\n');
      const downloadBtn = document.createElement('button');
      downloadBtn.className = 'btn btn-success my-3';
      downloadBtn.innerHTML = '<i class="fas fa-download"></i> Descargar Resultados';
      downloadBtn.type = 'button';
      downloadBtn.addEventListener('click', () => {
        const blob = new Blob([resultText], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'resultados.txt';
        link.click();
        URL.revokeObjectURL(link.href);
      });
      resultsDiv.prepend(downloadBtn);
    };
  
    reader.readAsText(file);
  });
  
  const toggleBtn = document.getElementById('toggleTheme');
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    toggleBtn.innerHTML = isDark
      ? '<i class="fas fa-sun"></i> Modo Claro'
      : '<i class="fas fa-moon"></i> Modo Oscuro';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
  
  window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
      toggleBtn.innerHTML = '<i class="fas fa-sun"></i> Modo Claro';
    }
  });
  