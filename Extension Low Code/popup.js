// Tải cấu hình đã lưu khi mở popup
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    
    document.getElementById('saveBtn').addEventListener('click', saveSettings);
    document.getElementById('toggleMonitor').addEventListener('change', toggleMonitoring);
});

// Tải cài đặt từ Chrome storage
function loadSettings() {
    chrome.storage.sync.get(['apiKey', 'interval', 'isActive'], function(data) {
        if (data.apiKey) {
            document.getElementById('apiKey').value = data.apiKey;
        }
        if (data.interval) {
            document.getElementById('interval').value = data.interval;
        }
        if (data.isActive !== undefined) {
            document.getElementById('toggleMonitor').checked = data.isActive;
        }
    });
}

// Lưu cài đặt
function saveSettings() {
    const apiKey = document.getElementById('apiKey').value.trim();
    const interval = parseInt(document.getElementById('interval').value);
    const isActive = document.getElementById('toggleMonitor').checked;
    
    // Kiểm tra validation
    if (!apiKey) {
        showStatus('Vui lòng nhập API Key!', 'error');
        return;
    }
    
    if (interval < 30 || interval > 600) {
        showStatus('Thời gian quét phải từ 30-600 giây!', 'error');
        return;
    }
    
    // Lưu vào Chrome storage
    chrome.storage.sync.set({
        apiKey: apiKey,
        interval: interval,
        isActive: isActive
    }, function() {
        showStatus('✓ Đã lưu cấu hình thành công!', 'success');
        
        // Gửi message đến background script để cập nhật
        chrome.runtime.sendMessage({
            action: 'updateSettings',
            data: { apiKey, interval, isActive }
        });
    });
}

// Bật/tắt giám sát
function toggleMonitoring() {
    const isActive = document.getElementById('toggleMonitor').checked;
    
    chrome.storage.sync.set({ isActive: isActive }, function() {
        chrome.runtime.sendMessage({
            action: 'toggleMonitoring',
            isActive: isActive
        });
        
        if (isActive) {
            showStatus('✓ Đã bật giám sát!', 'success');
        } else {
            showStatus('Đã tắt giám sát', 'success');
        }
    });
}

// Hiển thị thông báo trạng thái
function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 3000);
}