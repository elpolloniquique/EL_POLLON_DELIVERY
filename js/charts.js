/**
 * Gráficos Chart.js — dashboard admin
 */
window.PollonCharts = (function () {
  'use strict';

  const instances = {};

  function destroy(id) {
    if (instances[id]) {
      instances[id].destroy();
      delete instances[id];
    }
  }

  function createBar(id, labels, data, label) {
    destroy(id);
    const ctx = document.getElementById(id);
    if (!ctx || typeof Chart === 'undefined') return;
    instances[id] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: label || 'Total',
          data,
          backgroundColor: 'rgba(214, 40, 40, 0.75)',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { callback: v => '$' + v.toLocaleString('es-CL') } }
        }
      }
    });
  }

  function createDoughnut(id, labels, data) {
    destroy(id);
    const ctx = document.getElementById(id);
    if (!ctx || typeof Chart === 'undefined') return;
    instances[id] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: ['#d62828', '#f77f00', '#fcbf49', '#1a1a1a', '#5c5c5c', '#e63946']
        }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
  }

  function createLine(id, labels, data) {
    destroy(id);
    const ctx = document.getElementById(id);
    if (!ctx || typeof Chart === 'undefined') return;
    instances[id] = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Ventas',
          data,
          borderColor: '#d62828',
          backgroundColor: 'rgba(214, 40, 40, 0.1)',
          fill: true,
          tension: 0.35
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  return { createBar, createDoughnut, createLine, destroy };
})();
