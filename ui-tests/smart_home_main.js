// Smart Home Dashboard JavaScript

// Voice Assistant Functions
let isListening = false;

function toggleVoice() {
    const micButton = document.querySelector('.mic-button');
    const micIcon = document.querySelector('.mic-icon');
    
    if (!isListening) {
        // Start listening
        isListening = true;
        micButton.style.background = '#e74c3c';
        micIcon.textContent = '🔴';
        showNotification('Voice assistant activated. Listening...');
        
        // Simulate voice recognition (in real app, would use Web Speech API)
        setTimeout(() => {
            stopListening();
            showNotification('Voice command processed!');
        }, 3000);
    } else {
        stopListening();
    }
}

function stopListening() {
    isListening = false;
    const micButton = document.querySelector('.mic-button');
    const micIcon = document.querySelector('.mic-icon');
    
    micButton.style.background = '#27ae60';
    micIcon.textContent = '🎤';
}

// Light Control Functions
function toggleLight(lightId, switchElement) {
    const isOn = switchElement.checked;
    console.log(`${lightId} light turned ${isOn ? 'on' : 'off'}`);
    
    showNotification(`${lightId.replace('-', ' ')} light ${isOn ? 'turned on' : 'turned off'}`);
    
    // Simulate light response
    if (isOn) {
        updateLightLevel(Math.floor(Math.random() * 200) + 600);
    } else {
        updateLightLevel(Math.floor(Math.random() * 100) + 200);
    }
}

// Outlet Control Functions
function toggleOutlet(outletId, switchElement) {
    const isOn = switchElement.checked;
    console.log(`${outletId} outlet turned ${isOn ? 'on' : 'off'}`);
    
    showNotification(`${outletId.replace('-', ' ')} ${isOn ? 'turned on' : 'turned off'}`);
}

// Sensor Data Updates
function updateSensorData() {
    // Update temperature
    const temp = (Math.random() * 10 + 20).toFixed(1);
    document.getElementById('temperature').textContent = `${temp}°C`;
    
    // Update humidity
    const humidity = (Math.random() * 30 + 45).toFixed(1);
    document.getElementById('humidity').textContent = `${humidity}%`;
    
    // Update air quality
    const aqi = Math.floor(Math.random() * 100 + 50);
    const aqiElement = document.getElementById('airQuality');
    aqiElement.textContent = `${aqi} AQI`;
    
    // Update badge based on AQI
    const badge = aqiElement.nextElementSibling;
    if (aqi < 50) {
        badge.textContent = 'Good';
        badge.className = 'sensor-badge good';
        badge.style.background = '#27ae60';
    } else if (aqi < 100) {
        badge.textContent = 'Moderate';
        badge.className = 'sensor-badge moderate';
        badge.style.background = '#f39c12';
    } else {
        badge.textContent = 'Bad';
        badge.className = 'sensor-badge bad';
        badge.style.background = '#e74c3c';
    }
    
    // Update motion (random)
    const motionStates = ['Clear', 'Detected', 'Clear', 'Clear']; // More likely to be clear
    const motion = motionStates[Math.floor(Math.random() * motionStates.length)];
    document.getElementById('motion').textContent = motion;
}

function updateLightLevel(lux) {
    document.getElementById('lightLevel').textContent = `${lux} lux`;
}

// Climate Control Functions
function adjustTemperature(direction) {
    const tempElement = document.getElementById('targetTemp');
    let currentTemp = parseFloat(tempElement.textContent);
    
    if (direction === 'up') {
        currentTemp += 0.5;
    } else {
        currentTemp -= 0.5;
    }
    
    // Limit temperature range
    currentTemp = Math.max(16, Math.min(30, currentTemp));
    
    tempElement.textContent = `${currentTemp.toFixed(1)}°C`;
    showNotification(`Target temperature set to ${currentTemp.toFixed(1)}°C`);
}

// Notification System
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2c3e50;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        font-size: 14px;
    `;
    
    // Add animation styles
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Smart Home Dashboard initialized');
    
    // Start sensor data updates
    updateSensorData();
    setInterval(updateSensorData, 5000); // Update every 5 seconds
    
    // Add click handlers for temperature adjustment (if needed in future)
    // This can be expanded to add +/- buttons for climate control
    
    showNotification('Smart Home Dashboard is ready!');
});

// Device Status Simulation
const deviceStatus = {
    lights: {
        'living-room': false,
        'bedroom': false,
        'main-light': false
    },
    outlets: {
        'coffee-maker': false,
        'tv-stand': false
    },
    climate: {
        targetTemp: 22.5,
        mode: 'auto'
    }
};

// Save/Load Settings (localStorage)
function saveSettings() {
    localStorage.setItem('smartHomeSettings', JSON.stringify(deviceStatus));
}

function loadSettings() {
    const saved = localStorage.getItem('smartHomeSettings');
    if (saved) {
        const settings = JSON.parse(saved);
        Object.assign(deviceStatus, settings);
        
        // Apply saved settings to UI
        Object.keys(settings.lights).forEach(lightId => {
            const switchElement = document.querySelector(`input[onchange*="${lightId}"]`);
            if (switchElement) {
                switchElement.checked = settings.lights[lightId];
            }
        });
        
        Object.keys(settings.outlets).forEach(outletId => {
            const switchElement = document.querySelector(`input[onchange*="${outletId}"]`);
            if (switchElement) {
                switchElement.checked = settings.outlets[outletId];
            }
        });
    }
}

// Load settings on page load
window.addEventListener('load', loadSettings);
