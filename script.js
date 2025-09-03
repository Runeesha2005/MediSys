
// // MediSys Diagnostics - Patient Monitoring Dashboard
// // API Configuration
// const API_URL = 'https://bslcqiqu61.execute-api.us-east-1.amazonaws.com/dev/DataRetrievalFunction';

// // DOM Elements
// const elements = {
//   // Statistics
//   totalPatientsEl: document.getElementById('total-patients'),
//   criticalPatientsEl: document.getElementById('critical-patients'),
//   normalPatientsEl: document.getElementById('normal-patients'),
  
//   // Controls
//   searchInput: document.getElementById('search-input'),
//   filterBtns: document.querySelectorAll('.filter-btn'),
//   refreshBtn: document.getElementById('refresh-btn'),
  
//   // Table and States
//   tableCountEl: document.getElementById('table-count'),
//   loadingState: document.getElementById('loading-state'),
//   errorState: document.getElementById('error-state'),
//   emptyState: document.getElementById('empty-state'),
//   patientsTable: document.getElementById('patients-table'),
//   patientsTbody: document.getElementById('patients-tbody'),
//   errorMessage: document.getElementById('error-message'),
  
//   // Modal
//   patientModal: document.getElementById('patient-modal'),
//   modalPatientId: document.getElementById('modal-patient-id'),
//   closeModal: document.getElementById('close-modal'),
//   patientInfoGrid: document.getElementById('patient-info-grid'),
//   patientReadingsTable: document.getElementById('patient-readings-table'),
//   patientReadingsTbody: document.getElementById('patient-readings-tbody')
// };

// // Application State
// let appState = {
//   allPatients: [],
//   filteredPatients: [],
//   currentFilter: 'all',
//   searchTerm: '',
//   isLoading: false,
//   lastRefresh: null
// };

// // Patient status determination based on medical thresholds
// function determinePatientStatus(heartRate, oxygenLevel, temperature) {
//   const hr = parseFloat(heartRate);
//   const ol = parseFloat(oxygenLevel);
//   const temp = parseFloat(temperature);
  
//   // Critical conditions based on medical standards
//   const isCritical = 
//     (hr && (hr < 60 || hr > 100)) ||  // Bradycardia or Tachycardia
//     (ol && ol < 95) ||                 // Low oxygen saturation
//     (temp && (temp < 10 || temp > 38)); // Hypothermia or Hyperthermia
  
//   return isCritical ? 'critical' : 'normal';
// }

// // Utility function to format timestamp
// function formatTimestamp(timestamp) {
//   const date = new Date(timestamp * 1000);
//   return date.toLocaleString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     second: '2-digit',
//     hour12: true
//   });
// }

// // Utility function to format vital signs
// function formatVitalSign(value, unit = '') {
//   if (value === null || value === undefined || value === '') {
//     return '<span style="color: #94a3b8;">N/A</span>';
//   }
//   return `${value}${unit}`;
// }

// // Show loading state
// function showLoadingState() {
//   elements.loadingState.style.display = 'block';
//   elements.errorState.style.display = 'none';
//   elements.emptyState.style.display = 'none';
//   elements.patientsTable.style.display = 'none';
//   elements.tableCountEl.textContent = 'Loading patient data...';
// }

// // Show error state
// function showErrorState(message) {
//   elements.loadingState.style.display = 'none';
//   elements.errorState.style.display = 'block';
//   elements.emptyState.style.display = 'none';
//   elements.patientsTable.style.display = 'none';
//   elements.errorMessage.textContent = message;
//   elements.tableCountEl.textContent = 'Error loading data';
// }

// // Show empty state
// function showEmptyState() {
//   elements.loadingState.style.display = 'none';
//   elements.errorState.style.display = 'none';
//   elements.emptyState.style.display = 'block';
//   elements.patientsTable.style.display = 'none';
//   elements.tableCountEl.textContent = 'No patients found';
// }

// // Show table with data
// function showTableWithData() {
//   elements.loadingState.style.display = 'none';
//   elements.errorState.style.display = 'none';
//   elements.emptyState.style.display = 'none';
//   elements.patientsTable.style.display = 'table';
// }

// // Animate number counting for statistics
// function animateNumber(element, targetValue, duration = 1500) {
//   const startValue = parseInt(element.textContent) || 0;
//   const increment = (targetValue - startValue) / (duration / 16);
//   let currentValue = startValue;
  
//   const animation = setInterval(() => {
//     currentValue += increment;
    
//     if ((increment > 0 && currentValue >= targetValue) || 
//         (increment < 0 && currentValue <= targetValue)) {
//       currentValue = targetValue;
//       clearInterval(animation);
//     }
    
//     element.textContent = Math.floor(currentValue);
//   }, 16);
// }

// // Update statistics cards
// function updateStatistics() {
//   const total = appState.allPatients.length;
//   const critical = appState.allPatients.filter(p => p.status === 'critical').length;
//   const normal = appState.allPatients.filter(p => p.status === 'normal').length;
  
//   // Animate the numbers
//   animateNumber(elements.totalPatientsEl, total);
//   animateNumber(elements.criticalPatientsEl, critical);
//   animateNumber(elements.normalPatientsEl, normal);
// }

// // Update table count display
// function updateTableCount() {
//   const filteredCount = appState.filteredPatients.length;
//   const totalCount = appState.allPatients.length;
  
//   if (filteredCount === totalCount) {
//     elements.tableCountEl.textContent = `Showing ${totalCount} patient${totalCount !== 1 ? 's' : ''}`;
//   } else {
//     elements.tableCountEl.textContent = `Showing ${filteredCount} of ${totalCount} patients`;
//   }
// }

// // Apply filters and search
// function applyFiltersAndSearch() {
//   let filtered = [...appState.allPatients];
  
//   // Apply status filter
//   if (appState.currentFilter !== 'all') {
//     filtered = filtered.filter(patient => patient.status === appState.currentFilter);
//   }
  
//   // Apply search filter
//   if (appState.searchTerm.trim()) {
//     const searchTerm = appState.searchTerm.toLowerCase().trim();
//     filtered = filtered.filter(patient => 
//       patient.patientID.toLowerCase().includes(searchTerm)
//     );
//   }
  
//   // Sort by timestamp (latest first)
//   filtered.sort((a, b) => b.timestamp - a.timestamp);
  
//   appState.filteredPatients = filtered;
//   updateTable();
//   updateTableCount();
// }

// // Update the main patients table
// function updateTable() {
//   if (appState.filteredPatients.length === 0) {
//     showEmptyState();
//     return;
//   }
  
//   showTableWithData();
  
//   // Clear existing rows
//   elements.patientsTbody.innerHTML = '';
  
//   // Populate table rows
//   appState.filteredPatients.forEach(patient => {
//     const row = document.createElement('tr');
//     row.setAttribute('data-patient-id', patient.patientID);
    
//     const statusIcon = patient.status === 'critical' ? 
//       '<i class="fas fa-exclamation-triangle"></i>' : 
//       '<i class="fas fa-check-circle"></i>';
    
//     row.innerHTML = `
//       <td>
//         <div class="patient-id">${patient.patientID}</div>
//       </td>
//       <td>
//         <span class="status-badge ${patient.status}">
//           ${statusIcon}
//           ${patient.status === 'critical' ? 'Critical' : 'Normal'}
//         </span>
//       </td>
//       <td>
//         <div class="timestamp">${formatTimestamp(patient.timestamp)}</div>
//       </td>
//       <td>
//         <div class="vital-sign">${formatVitalSign(patient.heartRate, ' bpm')}</div>
//       </td>
//       <td>
//         <div class="vital-sign">${formatVitalSign(patient.oxygenLevel, '%')}</div>
//       </td>
//       <td>
//         <div class="vital-sign">${formatVitalSign(patient.temperature, '°F')}</div>
//       </td>
//     `;
    
//     // Add click event to show patient details
//     row.addEventListener('click', () => showPatientDetails(patient.patientID));
    
//     elements.patientsTbody.appendChild(row);
//   });
// }

// // Fetch patient data from API
// async function fetchPatientData() {
//   if (appState.isLoading) return;
  
//   appState.isLoading = true;
//   showLoadingState();
  
//   // Update refresh button state
//   elements.refreshBtn.classList.add('loading');
//   elements.refreshBtn.disabled = true;
  
//   try {
//     const url = `${API_URL}?type=all&limit=1000`;
//     const response = await fetch(url);
    
//     if (!response.ok) {
//       throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//     }
    
//     const data = await response.json();
    
//     if (data.error) {
//       throw new Error(data.message || 'API returned an error');
//     }
    
//     if (!data.data || !Array.isArray(data.data)) {
//       throw new Error('Invalid data format received from API');
//     }
    
//     if (data.data.length === 0) {
//       appState.allPatients = [];
//       appState.filteredPatients = [];
//       updateStatistics();
//       showEmptyState();
//       return;
//     }
    
//     // Process patient data - get latest reading for each patient
//     const patientsMap = new Map();
    
//     data.data.forEach(record => {
//       const patientId = record.patientID;
//       if (!patientsMap.has(patientId) || 
//           record.timestamp > patientsMap.get(patientId).timestamp) {
//         patientsMap.set(patientId, record);
//       }
//     });
    
//     // Convert to array and add status
//     appState.allPatients = Array.from(patientsMap.values()).map(patient => ({
//       ...patient,
//       status: determinePatientStatus(patient.heartRate, patient.oxygenLevel, patient.temperature)
//     }));
    
//     // Sort by patient ID for consistency
//     appState.allPatients.sort((a, b) => a.patientID.localeCompare(b.patientID));
    
//     // Update UI
//     updateStatistics();
//     applyFiltersAndSearch();
    
//     appState.lastRefresh = new Date();
    
//   } catch (error) {
//     console.error('Error fetching patient data:', error);
//     showErrorState(`Failed to load patient data: ${error.message}`);
//   } finally {
//     appState.isLoading = false;
//     elements.refreshBtn.classList.remove('loading');
//     elements.refreshBtn.disabled = false;
//   }
// }

// // Fetch detailed data for a specific patient
// async function fetchPatientDetails(patientId) {
//   try {
//     // Try both endpoints to get patient data regardless of age
//     let url = `${API_URL}?type=patient&patientId=${patientId}&limit=100`;
//     let response = await fetch(url);
    
//     if (!response.ok) {
//       // If specific patient endpoint fails, try getting all data and filter
//       url = `${API_URL}?type=all&limit=5000`;
//       response = await fetch(url);
      
//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }
      
//       const allData = await response.json();
      
//       if (allData.error) {
//         throw new Error(allData.message || 'API returned an error');
//       }
      
//       // Filter for specific patient
//       const patientData = (allData.data || []).filter(record => record.patientID === patientId);
//       return patientData;
//     }
    
//     const data = await response.json();
    
//     if (data.error) {
//       throw new Error(data.message || 'API returned an error');
//     }
    
//     return data.data || [];
//   } catch (error) {
//     console.error(`Error fetching details for patient ${patientId}:`, error);
//     throw error;
//   }
// }

// // Show patient details in modal
// async function showPatientDetails(patientId) {
//   elements.modalPatientId.textContent = patientId;
//   elements.patientModal.style.display = 'flex';
//   document.body.style.overflow = 'hidden'; // Prevent background scroll
  
//   // Clear previous data
//   elements.patientInfoGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;"><div class="loading-spinner"></div><p>Loading patient details...</p></div>';
//   elements.patientReadingsTbody.innerHTML = '';
  
//   try {
//     const patientData = await fetchPatientDetails(patientId);
    
//     if (!patientData || patientData.length === 0) {
//       elements.patientInfoGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #64748b;"><i class="fas fa-exclamation-circle" style="font-size: 2rem; margin-bottom: 1rem;"></i><h3>No Data Available</h3><p>No detailed readings found for this patient.</p></div>';
//       return;
//     }
    
//     // Sort by timestamp (latest first)
//     patientData.sort((a, b) => b.timestamp - a.timestamp);
//     const latestReading = patientData[0];
    
//     // Fixed average values based on medical standards (for doctors to compare against)
//     const avgHeartRate = '80.0'; // Normal resting heart rate average
//     const avgOxygenLevel = '98.0'; // Normal oxygen saturation average  
//     const avgTemperature = '98.6'; // Normal body temperature average
    
//     const currentStatus = determinePatientStatus(latestReading.heartRate, latestReading.oxygenLevel, latestReading.temperature);
//     const statusIcon = currentStatus === 'critical' ? '<i class="fas fa-exclamation-triangle"></i>' : '<i class="fas fa-check-circle"></i>';
//     const statusColor = currentStatus === 'critical' ? '#dc2626' : '#059669';
    
//     // Update patient info grid - Current values are from latest reading, averages are calculated
//     elements.patientInfoGrid.innerHTML = `
//       <div class="info-card">
//         <div class="info-label">Current Status</div>
//         <div class="info-value" style="color: ${statusColor};">
//           ${statusIcon} ${currentStatus === 'critical' ? 'Critical' : 'Normal'}
//         </div>
//       </div>
      
//       <div class="info-card">
//         <div class="info-label">Last Updated</div>
//         <div class="info-value">${formatTimestamp(latestReading.timestamp)}</div>
//       </div>
      
//       <div class="info-card">
//         <div class="info-label">Total Readings</div>
//         <div class="info-value">${patientData.length}</div>
//       </div>
      
//       <div class="info-card">
//         <div class="info-label">Current Heart Rate</div>
//         <div class="info-value">${formatVitalSign(latestReading.heartRate, ' bpm')}</div>
//       </div>
      
//       <div class="info-card">
//         <div class="info-label">Average Heart Rate</div>
//         <div class="info-value">${avgHeartRate} bpm</div>
//       </div>
      
//       <div class="info-card">
//         <div class="info-label">Current Oxygen Level</div>
//         <div class="info-value">${formatVitalSign(latestReading.oxygenLevel, '%')}</div>
//       </div>
      
//       <div class="info-card">
//         <div class="info-label">Average Oxygen Level</div>
//         <div class="info-value">${avgOxygenLevel}%</div>
//       </div>
      
//       <div class="info-card">
//         <div class="info-label">Current Temperature</div>
//         <div class="info-value">${formatVitalSign(latestReading.temperature, '°F')}</div>
//       </div>
      
//       <div class="info-card">
//         <div class="info-label">Average Temperature</div>
//         <div class="info-value">${avgTemperature}°F</div>
//       </div>
//     `;
    
//     // Update readings table - Show all readings with latest on top
//     elements.patientReadingsTbody.innerHTML = '';
//     patientData.forEach(reading => {
//       const readingStatus = determinePatientStatus(reading.heartRate, reading.oxygenLevel, reading.temperature);
//       const readingIcon = readingStatus === 'critical' ? '<i class="fas fa-exclamation-triangle"></i>' : '<i class="fas fa-check-circle"></i>';
      
//       const row = document.createElement('tr');
//       row.innerHTML = `
//         <td>${formatTimestamp(reading.timestamp)}</td>
//         <td>${formatVitalSign(reading.heartRate, ' bpm')}</td>
//         <td>${formatVitalSign(reading.oxygenLevel, '%')}</td>
//         <td>${formatVitalSign(reading.temperature, '°F')}</td>
//         <td>
//           <span class="status-badge ${readingStatus}">
//             ${readingIcon}
//             ${readingStatus === 'critical' ? 'Critical' : 'Normal'}
//           </span>
//         </td>
//       `;
//       elements.patientReadingsTbody.appendChild(row);
//     });
    
//   } catch (error) {
//     console.error('Error loading patient details:', error);
//     elements.patientInfoGrid.innerHTML = `
//       <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #dc2626;">
//         <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
//         <h3>Error Loading Details</h3>
//         <p>Unable to load patient details: ${error.message}</p>
//       </div>
//     `;
//   }
// }

// // Close patient details modal
// function closePatientModal() {
//   elements.patientModal.style.display = 'none';
//   document.body.style.overflow = 'auto'; // Restore background scroll
// }

// // Event Listeners
// document.addEventListener('DOMContentLoaded', () => {
//   // Search input
//   elements.searchInput.addEventListener('input', (e) => {
//     appState.searchTerm = e.target.value.trim();
//     applyFiltersAndSearch();
//   });
  
//   // Filter buttons
//   elements.filterBtns.forEach(btn => {
//     btn.addEventListener('click', () => {
//       // Remove active class from all buttons
//       elements.filterBtns.forEach(b => b.classList.remove('active'));
//       // Add active class to clicked button
//       btn.classList.add('active');
//       // Update current filter
//       appState.currentFilter = btn.dataset.filter;
//       // Apply filters
//       applyFiltersAndSearch();
//     });
//   });
  
//   // Refresh button
//   elements.refreshBtn.addEventListener('click', fetchPatientData);
  
//   // Modal close events
//   elements.closeModal.addEventListener('click', closePatientModal);
  
//   // Close modal when clicking outside
//   elements.patientModal.addEventListener('click', (e) => {
//     if (e.target === elements.patientModal) {
//       closePatientModal();
//     }
//   });
  
//   // Close modal with escape key
//   document.addEventListener('keydown', (e) => {
//     if (e.key === 'Escape' && elements.patientModal.style.display === 'flex') {
//       closePatientModal();
//     }
//   });
  
//   // Initial data load
//   fetchPatientData();
  
//   // Auto-refresh every 30 seconds
//   setInterval(fetchPatientData, 30000);
// });

// // Export functions for potential external use
// window.MediSysApp = {
//   refreshData: fetchPatientData,
//   showPatientDetails: showPatientDetails,
//   getAppState: () => ({ ...appState }),
//   API_URL
// };





// Enhanced MediSys Dashboard with ML Health Deterioration Predictions
// Replace your existing script.js with this enhanced version

// API Configuration
const API_URL = 'https://bslcqiqu61.execute-api.us-east-1.amazonaws.com/dev/DataRetrievalFunction';
const ML_API_URL = 'https://x6qekbrwxj.execute-api.us-east-1.amazonaws.com/prod/ml-predict'; // UPDATE THIS WITH YOUR ML LAMBDA API GATEWAY URL

// DOM Elements (same as before)
const elements = {
  totalPatientsEl: document.getElementById('total-patients'),
  criticalPatientsEl: document.getElementById('critical-patients'),
  normalPatientsEl: document.getElementById('normal-patients'),
  searchInput: document.getElementById('search-input'),
  filterBtns: document.querySelectorAll('.filter-btn'),
  refreshBtn: document.getElementById('refresh-btn'),
  tableCountEl: document.getElementById('table-count'),
  loadingState: document.getElementById('loading-state'),
  errorState: document.getElementById('error-state'),
  emptyState: document.getElementById('empty-state'),
  patientsTable: document.getElementById('patients-table'),
  patientsTbody: document.getElementById('patients-tbody'),
  errorMessage: document.getElementById('error-message'),
  patientModal: document.getElementById('patient-modal'),
  modalPatientId: document.getElementById('modal-patient-id'),
  closeModal: document.getElementById('close-modal'),
  patientInfoGrid: document.getElementById('patient-info-grid'),
  patientReadingsTable: document.getElementById('patient-readings-table'),
  patientReadingsTbody: document.getElementById('patient-readings-tbody')
};

// Enhanced Application State with ML predictions
let appState = {
  allPatients: [],
  filteredPatients: [],
  mlPredictions: new Map(), // Store ML predictions by patient ID
  currentFilter: 'all',
  searchTerm: '',
  isLoading: false,
  lastRefresh: null,
  mlEnabled: true
};

// ML Prediction Functions
async function getMlPrediction(patientId) {
  /**
   * Get ML deterioration prediction for a patient based on historical trends
   */
  try {
    if (!appState.mlEnabled) return null;
    
    const response = await fetch(ML_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patientID: patientId
      })
    });
    
    if (!response.ok) {
      console.error(`ML API error for ${patientId}: ${response.status}`);
      return null;
    }
    
    const result = await response.json();
    
    if (result.status === 'success') {
      return result;
    } else if (result.status === 'insufficient_data') {
      return {
        status: 'insufficient_data',
        prediction: {
          risk_level: 'Monitoring - Building History',
          confidence: 0,
          probability_deteriorate: 0
        },
        message: result.message
      };
    } else {
      console.error(`ML prediction error for ${patientId}:`, result.message);
      return null;
    }
    
  } catch (error) {
    console.error(`Error getting ML prediction for ${patientId}:`, error);
    return null;
  }
}

// Enhanced Patient Status Determination
function determineEnhancedPatientStatus(heartRate, oxygenLevel, temperature, mlPrediction = null) {
  /**
   * Determine patient status including ML prediction and traditional vital signs
   */
  const hr = parseFloat(heartRate);
  const ol = parseFloat(oxygenLevel);
  const temp = parseFloat(temperature);
  
  // Traditional vital signs check
  const isCriticalVitals = 
    (hr && (hr < 60 || hr > 100)) ||
    (ol && ol < 95) ||
    (temp && (temp < 36.1 || temp > 37.2));
  
  // ML prediction check for deterioration forecast
  const isCriticalMl = mlPrediction && 
    mlPrediction.prediction && 
    mlPrediction.prediction.prediction === 1 && 
    mlPrediction.prediction.confidence > 0.7;
  
  // Determine overall status and reason
  if (isCriticalVitals && isCriticalMl) {
    return {
      status: 'critical',
      reason: 'both_vitals_and_ml',
      mlPrediction: mlPrediction,
      priority: 'urgent'
    };
  } else if (isCriticalVitals) {
    return {
      status: 'critical',
      reason: 'vital_signs',
      mlPrediction: mlPrediction,
      priority: 'high'
    };
  } else if (isCriticalMl) {
    return {
      status: 'critical',
      reason: 'ml_forecast',
      mlPrediction: mlPrediction,
      priority: 'medium'
    };
  } else {
    return {
      status: 'normal',
      reason: 'all_normal',
      mlPrediction: mlPrediction,
      priority: 'low'
    };
  }
}

// Utility Functions
function formatTimestamp(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

function formatVitalSign(value, unit = '') {
  if (value === null || value === undefined || value === '') {
    return '<span style="color: #94a3b8;">N/A</span>';
  }
  return `${value}${unit}`;
}

function formatMlPrediction(mlData) {
  /**
   * Format ML prediction for display
   */
  if (!mlData || !mlData.prediction) {
    return '<span style="color: #94a3b8;">Processing...</span>';
  }
  
  const prediction = mlData.prediction;
  const confidence = (prediction.confidence * 100).toFixed(0);
  
  let color = '#64748b';
  let icon = '<i class="fas fa-brain"></i>';
  
  if (prediction.prediction === 1) {
    color = prediction.confidence > 0.8 ? '#dc2626' : '#f59e0b';
    icon = '<i class="fas fa-exclamation-triangle"></i>';
  } else {
    color = prediction.confidence > 0.8 ? '#059669' : '#0891b2';
    icon = '<i class="fas fa-shield-alt"></i>';
  }
  
  const riskText = prediction.prediction === 1 ? 'Will Deteriorate' : 'Stable';
  
  return `<span style="color: ${color}; font-weight: 600;">
    ${icon} ${riskText} (${confidence}%)
  </span>`;
}

function formatTrendAnalysis(mlData) {
  /**
   * Format trend analysis for detailed view
   */
  if (!mlData || !mlData.trend_analysis) {
    return 'No trend analysis available';
  }
  
  const trends = mlData.trend_analysis;
  const analysis = [];
  
  if (trends.heart_rate_trend && trends.heart_rate_trend !== '+0.0 bpm') {
    analysis.push(`Heart Rate: ${trends.heart_rate_trend}`);
  }
  
  if (trends.oxygen_trend && trends.oxygen_trend !== '+0.0%') {
    analysis.push(`Oxygen: ${trends.oxygen_trend}`);
  }
  
  if (trends.temperature_trend && trends.temperature_trend !== '+0.0°C') {
    analysis.push(`Temperature: ${trends.temperature_trend}`);
  }
  
  return analysis.length > 0 ? analysis.join(' | ') : 'No significant trends';
}

// Enhanced Data Fetching with ML Predictions
async function fetchPatientDataWithML() {
  /**
   * Fetch patient data and get ML predictions for deterioration forecasting
   */
  if (appState.isLoading) return;
  
  appState.isLoading = true;
  showLoadingState();
  
  elements.refreshBtn.classList.add('loading');
  elements.refreshBtn.disabled = true;
  
  try {
    // 1. Fetch regular patient data
    const url = `${API_URL}?type=all&limit=1000`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.message || 'API returned an error');
    }
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid data format received from API');
    }
    
    if (data.data.length === 0) {
      appState.allPatients = [];
      appState.filteredPatients = [];
      updateStatistics();
      showEmptyState();
      return;
    }
    
    // 2. Process patient data - get latest reading for each patient
    const patientsMap = new Map();
    
    data.data.forEach(record => {
      const patientId = record.patientID;
      if (!patientsMap.has(patientId) || 
          record.timestamp > patientsMap.get(patientId).timestamp) {
        patientsMap.set(patientId, record);
      }
    });
    
    const patientsArray = Array.from(patientsMap.values());
    
    // 3. Get ML predictions for all patients (parallel processing)
    console.log('Fetching ML deterioration predictions for', patientsArray.length, 'patients...');
    
    const mlPromises = patientsArray.map(async (patient) => {
      try {
        const prediction = await getMlPrediction(patient.patientID);
        if (prediction) {
          appState.mlPredictions.set(patient.patientID, prediction);
        }
        return prediction;
      } catch (error) {
        console.error(`ML prediction failed for ${patient.patientID}:`, error);
        return null;
      }
    });
    
    // Wait for ML predictions (with timeout)
    await Promise.allSettled(mlPromises);
    
    // 4. Process patients with enhanced status including ML predictions
    appState.allPatients = patientsArray.map(patient => {
      const mlPrediction = appState.mlPredictions.get(patient.patientID);
      const enhancedStatus = determineEnhancedPatientStatus(
        patient.heartRate, 
        patient.oxygenLevel, 
        patient.temperature,
        mlPrediction
      );
      
      return {
        ...patient,
        ...enhancedStatus
      };
    });
    
    // Sort by priority (urgent first, then by patient ID)
    appState.allPatients.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.patientID.localeCompare(b.patientID);
    });
    
    // Update UI
    updateStatistics();
    applyFiltersAndSearch();
    
    appState.lastRefresh = new Date();
    console.log('ML predictions loaded for', appState.mlPredictions.size, 'patients');
    
  } catch (error) {
    console.error('Error fetching patient data with ML:', error);
    showErrorState(`Failed to load patient data: ${error.message}`);
  } finally {
    appState.isLoading = false;
    elements.refreshBtn.classList.remove('loading');
    elements.refreshBtn.disabled = false;
  }
}

// Enhanced Table Update with ML Predictions
function updateTableWithML() {
  /**
   * Update the main patients table including ML deterioration predictions
   */
  if (appState.filteredPatients.length === 0) {
    showEmptyState();
    return;
  }
  
  showTableWithData();
  
  // Clear existing rows
  elements.patientsTbody.innerHTML = '';
  
  // Populate table rows with ML predictions
  appState.filteredPatients.forEach(patient => {
    const row = document.createElement('tr');
    row.setAttribute('data-patient-id', patient.patientID);
    
    const mlPrediction = patient.mlPrediction;
    const statusIcon = patient.status === 'critical' ? 
      '<i class="fas fa-exclamation-triangle"></i>' : 
      '<i class="fas fa-check-circle"></i>';
    
    // Enhanced status with ML reasoning
    let statusText = patient.status === 'critical' ? 'Critical' : 'Normal';
    if (patient.reason === 'ml_forecast') {
      statusText += ' (ML Alert)';
    } else if (patient.reason === 'both_vitals_and_ml') {
      statusText += ' (Vitals + ML)';
    }
    
    // Priority indicator
    const priorityColors = {
      urgent: '#dc2626',
      high: '#f59e0b',
      medium: '#0891b2',
      low: '#059669'
    };
    
    const priorityColor = priorityColors[patient.priority] || '#64748b';
    
    row.innerHTML = `
      <td>
        <div class="patient-id" style="border-left: 3px solid ${priorityColor}; padding-left: 8px;">
          ${patient.patientID}
        </div>
      </td>
      <td>
        <span class="status-badge ${patient.status}">
          ${statusIcon}
          ${statusText}
        </span>
      </td>
      <td>
        <div class="timestamp">${formatTimestamp(patient.timestamp)}</div>
      </td>
      <td>
        <div class="vital-sign">${formatVitalSign(patient.heartRate, ' bpm')}</div>
      </td>
      <td>
        <div class="vital-sign">${formatVitalSign(patient.oxygenLevel, '%')}</div>
      </td>
      <td>
        <div class="vital-sign">${formatVitalSign(patient.temperature, '°F')}</div>
      </td>
      <td>
        <div class="ml-prediction">
          ${formatMlPrediction(mlPrediction)}
        </div>
      </td>
    `;
    
    // Add click event to show patient details
    row.addEventListener('click', () => showPatientDetailsWithML(patient.patientID));
    
    elements.patientsTbody.appendChild(row);
  });
}

// Enhanced Patient Details Modal with ML Analysis
async function showPatientDetailsWithML(patientId) {
  /**
   * Show patient details including detailed ML prediction analysis
   */
  elements.modalPatientId.textContent = patientId;
  elements.patientModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  // Clear previous data
  elements.patientInfoGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;"><div class="loading-spinner"></div><p>Loading patient details and ML analysis...</p></div>';
  elements.patientReadingsTbody.innerHTML = '';
  
  try {
    const patientData = await fetchPatientDetails(patientId);
    
    if (!patientData || patientData.length === 0) {
      elements.patientInfoGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #64748b;"><i class="fas fa-exclamation-circle" style="font-size: 2rem; margin-bottom: 1rem;"></i><h3>No Data Available</h3><p>No detailed readings found for this patient.</p></div>';
      return;
    }
    
    patientData.sort((a, b) => b.timestamp - a.timestamp);
    const latestReading = patientData[0];
    const mlPrediction = appState.mlPredictions.get(patientId);
    
    // Calculate actual averages from historical data
    const heartRates = patientData.map(d => parseFloat(d.heartRate)).filter(hr => !isNaN(hr));
    const oxygenLevels = patientData.map(d => parseFloat(d.oxygenLevel)).filter(ol => !isNaN(ol));
    const temperatures = patientData.map(d => parseFloat(d.temperature)).filter(temp => !isNaN(temp));
    
    const avgHeartRate = heartRates.length > 0 ? (heartRates.reduce((a, b) => a + b, 0) / heartRates.length).toFixed(1) : 'N/A';
    const avgOxygenLevel = oxygenLevels.length > 0 ? (oxygenLevels.reduce((a, b) => a + b, 0) / oxygenLevels.length).toFixed(1) : 'N/A';
    const avgTemperature = temperatures.length > 0 ? (temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(1) : 'N/A';
    
    const currentStatus = determineEnhancedPatientStatus(
      latestReading.heartRate, 
      latestReading.oxygenLevel, 
      latestReading.temperature,
      mlPrediction
    );
    
    const statusIcon = currentStatus.status === 'critical' ? 
      '<i class="fas fa-exclamation-triangle"></i>' : 
      '<i class="fas fa-check-circle"></i>';
    const statusColor = currentStatus.status === 'critical' ? '#dc2626' : '#059669';
    
    // Enhanced patient info grid with detailed ML analysis
    let mlAnalysisInfo = '';
    if (mlPrediction && mlPrediction.prediction) {
      const pred = mlPrediction.prediction;
      const riskColor = pred.prediction === 1 ? '#dc2626' : '#059669';
      const riskIcon = pred.prediction === 1 ? 
        '<i class="fas fa-exclamation-triangle"></i>' : 
        '<i class="fas fa-shield-alt"></i>';
      
      mlAnalysisInfo = `
        <div class="info-card" style="border-left: 4px solid ${riskColor};">
          <div class="info-label">ML Deterioration Forecast</div>
          <div class="info-value" style="color: ${riskColor};">
            ${riskIcon} ${pred.risk_level}
          </div>
        </div>
        
        <div class="info-card">
          <div class="info-label">Prediction Confidence</div>
          <div class="info-value">${(pred.confidence * 100).toFixed(1)}%</div>
        </div>
        
        <div class="info-card">
          <div class="info-label">Deterioration Probability</div>
          <div class="info-value">${(pred.probability_deteriorate * 100).toFixed(1)}%</div>
        </div>
        
        <div class="info-card" style="grid-column: span 3;">
          <div class="info-label">Trend Analysis (${mlPrediction.trend_analysis?.time_period || '7 days'})</div>
          <div class="info-value" style="font-size: 1rem; line-height: 1.4;">
            ${formatTrendAnalysis(mlPrediction)}
          </div>
        </div>
        
        <div class="info-card" style="grid-column: span 3;">
          <div class="info-label">AI Interpretation</div>
          <div class="info-value" style="font-size: 0.9rem; line-height: 1.4;">
            ${mlPrediction.trend_analysis?.interpretation ? 
              mlPrediction.trend_analysis.interpretation.join(' • ') : 
              'No specific patterns detected'}
          </div>
        </div>
      `;
    } else {
      mlAnalysisInfo = `
        <div class="info-card">
          <div class="info-label">ML Analysis Status</div>
          <div class="info-value" style="color: #64748b;">
            ${mlPrediction?.status === 'insufficient_data' ? 
              'Building patient history...' : 
              'Processing...'}
          </div>
        </div>
      `;
    }
    
    elements.patientInfoGrid.innerHTML = `
      <div class="info-card">
        <div class="info-label">Current Status</div>
        <div class="info-value" style="color: ${statusColor};">
          ${statusIcon} ${currentStatus.status === 'critical' ? 'Critical' : 'Normal'}
        </div>
      </div>
      
      <div class="info-card">
        <div class="info-label">Last Updated</div>
        <div class="info-value">${formatTimestamp(latestReading.timestamp)}</div>
      </div>
      
      <div class="info-card">
        <div class="info-label">Total Readings</div>
        <div class="info-value">${patientData.length}</div>
      </div>
      
      ${mlAnalysisInfo}
      
      <div class="info-card">
        <div class="info-label">Current Heart Rate</div>
        <div class="info-value">${formatVitalSign(latestReading.heartRate, ' bpm')}</div>
      </div>
      
      <div class="info-card">
        <div class="info-label">Average Heart Rate</div>
        <div class="info-value">${avgHeartRate} bpm</div>
      </div>
      
      <div class="info-card">
        <div class="info-label">Current Oxygen Level</div>
        <div class="info-value">${formatVitalSign(latestReading.oxygenLevel, '%')}</div>
      </div>
      
      <div class="info-card">
        <div class="info-label">Average Oxygen Level</div>
        <div class="info-value">${avgOxygenLevel}%</div>
      </div>
      
      <div class="info-card">
        <div class="info-label">Current Temperature</div>
        <div class="info-value">${formatVitalSign(latestReading.temperature, '°F')}</div>
      </div>
      
      <div class="info-card">
        <div class="info-label">Average Temperature</div>
        <div class="info-value">${avgTemperature}°F</div>
      </div>
    `;
    
    // Update readings table with trend indicators
    elements.patientReadingsTbody.innerHTML = '';
    patientData.forEach((reading, index) => {
      const readingStatus = determinePatientStatus(reading.heartRate, reading.oxygenLevel, reading.temperature);
      const readingIcon = readingStatus === 'critical' ? 
        '<i class="fas fa-exclamation-triangle"></i>' : 
        '<i class="fas fa-check-circle"></i>';
      
      // Add trend arrows for recent readings
      let trendIndicator = '';
      if (index > 0 && index < 5) { // Show trends for last 5 readings
        const prevReading = patientData[index - 1];
        const hrTrend = parseFloat(reading.heartRate) - parseFloat(prevReading.heartRate);
        const spo2Trend = parseFloat(reading.oxygenLevel) - parseFloat(prevReading.oxygenLevel);
        
        if (Math.abs(hrTrend) > 5) {
          trendIndicator += hrTrend > 0 ? ' ↗' : ' ↘';
        }
        if (Math.abs(spo2Trend) > 2) {
          trendIndicator += spo2Trend > 0 ? ' ↗' : ' ↘';
        }
      }
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${formatTimestamp(reading.timestamp)}</td>
        <td>${formatVitalSign(reading.heartRate, ' bpm')}${trendIndicator}</td>
        <td>${formatVitalSign(reading.oxygenLevel, '%')}</td>
        <td>${formatVitalSign(reading.temperature, '°F')}</td>
        <td>
          <span class="status-badge ${readingStatus}">
            ${readingIcon}
            ${readingStatus === 'critical' ? 'Critical' : 'Normal'}
          </span>
        </td>
      `;
      elements.patientReadingsTbody.appendChild(row);
    });
    
  } catch (error) {
    console.error('Error loading patient details with ML:', error);
    elements.patientInfoGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #dc2626;">
        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
        <h3>Error Loading Details</h3>
        <p>Unable to load patient details: ${error.message}</p>
      </div>
    `;
  }
}

// Existing utility functions (keep your existing ones)
function determinePatientStatus(heartRate, oxygenLevel, temperature) {
  const hr = parseFloat(heartRate);
  const ol = parseFloat(oxygenLevel);
  const temp = parseFloat(temperature);
  
  const isCritical = 
    (hr && (hr < 60 || hr > 100)) ||
    (ol && ol < 95) ||
    (temp && (temp < 36.1 || temp > 37.2));
  
  return isCritical ? 'critical' : 'normal';
}

async function fetchPatientDetails(patientId) {
  try {
    let url = `${API_URL}?type=patient&patientId=${patientId}&limit=100`;
    let response = await fetch(url);
    
    if (!response.ok) {
      url = `${API_URL}?type=all&limit=5000`;
      response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const allData = await response.json();
      
      if (allData.error) {
        throw new Error(allData.message || 'API returned an error');
      }
      
      const patientData = (allData.data || []).filter(record => record.patientID === patientId);
      return patientData;
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.message || 'API returned an error');
    }
    
    return data.data || [];
  } catch (error) {
    console.error(`Error fetching details for patient ${patientId}:`, error);
    throw error;
  }
}

// State management functions (keep existing ones and add ML versions)
function showLoadingState() {
  elements.loadingState.style.display = 'block';
  elements.errorState.style.display = 'none';
  elements.emptyState.style.display = 'none';
  elements.patientsTable.style.display = 'none';
  elements.tableCountEl.textContent = 'Loading patient data and ML predictions...';
}

function showErrorState(message) {
  elements.loadingState.style.display = 'none';
  elements.errorState.style.display = 'block';
  elements.emptyState.style.display = 'none';
  elements.patientsTable.style.display = 'none';
  elements.errorMessage.textContent = message;
  elements.tableCountEl.textContent = 'Error loading data';
}

function showEmptyState() {
  elements.loadingState.style.display = 'none';
  elements.errorState.style.display = 'none';
  elements.emptyState.style.display = 'block';
  elements.patientsTable.style.display = 'none';
  elements.tableCountEl.textContent = 'No patients found';
}

function showTableWithData() {
  elements.loadingState.style.display = 'none';
  elements.errorState.style.display = 'none';
  elements.emptyState.style.display = 'none';
  elements.patientsTable.style.display = 'table';
}

function animateNumber(element, targetValue, duration = 1500) {
  const startValue = parseInt(element.textContent) || 0;
  const increment = (targetValue - startValue) / (duration / 16);
  let currentValue = startValue;
  
  const animation = setInterval(() => {
    currentValue += increment;
    
    if ((increment > 0 && currentValue >= targetValue) || 
        (increment < 0 && currentValue <= targetValue)) {
      currentValue = targetValue;
      clearInterval(animation);
    }
    
    element.textContent = Math.floor(currentValue);
  }, 16);
}

function updateStatistics() {
  const total = appState.allPatients.length;
  const critical = appState.allPatients.filter(p => p.status === 'critical').length;
  const normal = appState.allPatients.filter(p => p.status === 'normal').length;
  
  animateNumber(elements.totalPatientsEl, total);
  animateNumber(elements.criticalPatientsEl, critical);
  animateNumber(elements.normalPatientsEl, normal);
}

function updateTableCount() {
  const filteredCount = appState.filteredPatients.length;
  const totalCount = appState.allPatients.length;
  
  if (filteredCount === totalCount) {
    elements.tableCountEl.textContent = `Showing ${totalCount} patient${totalCount !== 1 ? 's' : ''}`;
  } else {
    elements.tableCountEl.textContent = `Showing ${filteredCount} of ${totalCount} patients`;
  }
}

function applyFiltersAndSearch() {
  let filtered = [...appState.allPatients];
  
  if (appState.currentFilter !== 'all') {
    filtered = filtered.filter(patient => patient.status === appState.currentFilter);
  }
  
  if (appState.searchTerm.trim()) {
    const searchTerm = appState.searchTerm.toLowerCase().trim();
    filtered = filtered.filter(patient => 
      patient.patientID.toLowerCase().includes(searchTerm)
    );
  }
  
  appState.filteredPatients = filtered;
  updateTableWithML();
  updateTableCount();
}

function closePatientModal() {
  elements.patientModal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Add ML Risk column to table header
  const tableHeader = document.querySelector('.patients-table thead tr');
  if (tableHeader && !document.querySelector('th[data-ml-column]')) {
    const mlHeader = document.createElement('th');
    mlHeader.setAttribute('data-ml-column', 'true');
    mlHeader.innerHTML = '<i class="fas fa-brain"></i> ML Deterioration Forecast';
    tableHeader.appendChild(mlHeader);
  }
  
  // Search input
  elements.searchInput.addEventListener('input', (e) => {
    appState.searchTerm = e.target.value.trim();
    applyFiltersAndSearch();
  });
  
  // Filter buttons
  elements.filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.currentFilter = btn.dataset.filter;
      applyFiltersAndSearch();
    });
  });
  
  // Refresh button
  elements.refreshBtn.addEventListener('click', fetchPatientDataWithML);
  
  // Modal close events
  elements.closeModal.addEventListener('click', closePatientModal);
  
  elements.patientModal.addEventListener('click', (e) => {
    if (e.target === elements.patientModal) {
      closePatientModal();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.patientModal.style.display === 'flex') {
      closePatientModal();
    }
  });
  
  // Initial data load with ML predictions
  fetchPatientDataWithML();
  
  // Auto-refresh every 30 seconds (includes ML predictions)
  setInterval(fetchPatientDataWithML, 30000);
});

// Export enhanced functions
window.MediSysApp = {
  refreshData: fetchPatientDataWithML,
  showPatientDetails: showPatientDetailsWithML,
  getMlPredictions: () => Object.fromEntries(appState.mlPredictions),
  toggleMlPredictions: (enabled) => {
    appState.mlEnabled = enabled;
    if (enabled) {
      fetchPatientDataWithML();
    }
  },
  getAppState: () => ({ ...appState }),
  API_URL,
  ML_API_URL
};

console.log('MediSys ML-Enhanced Dashboard loaded successfully');
console.log('ML predictions enabled:', appState.mlEnabled);