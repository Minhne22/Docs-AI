let monitoringInterval = null;
let settings = {
    apiKey: '',
    interval: 60,
    isActive: false
};

// Khởi tạo khi extension được cài đặt hoặc khởi động
chrome.runtime.onInstalled.addListener(() => {
    loadSettings();
});

chrome.runtime.onStartup.addListener(() => {
    loadSettings();
});

// Tải cài đặt từ storage
function loadSettings() {
    chrome.storage.sync.get(['apiKey', 'interval', 'isActive'], (data) => {
        settings = {
            apiKey: data.apiKey || '',
            interval: data.interval || 60,
            isActive: data.isActive || false
        };
        
        if (settings.isActive && settings.apiKey) {
            startMonitoring();
        }
    });
}

// Lắng nghe message từ popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateSettings') {
        settings = request.data;
        if (settings.isActive) {
            startMonitoring();
        } else {
            stopMonitoring();
        }
    } else if (request.action === 'toggleMonitoring') {
        settings.isActive = request.isActive;
        if (settings.isActive) {
            startMonitoring();
        } else {
            stopMonitoring();
        }
    }
});

// Bắt đầu giám sát
function startMonitoring() {
    stopMonitoring(); // Dừng interval cũ nếu có
    
    // Chạy ngay lập tức lần đầu
    checkCurrentActivity();
    
    // Sau đó chạy theo interval
    monitoringInterval = setInterval(() => {
        checkCurrentActivity();
    }, settings.interval * 1000);
}

// Dừng giám sát
function stopMonitoring() {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
        monitoringInterval = null;
    }
}

// Kiểm tra hoạt động hiện tại
async function checkCurrentActivity() {
    try {
        // Lấy tab đang active
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab || !tab.url) return;
        
        const url = tab.url;
        const title = tab.title || '';
        
        // Gửi đến ChatGPT để phân tích
        const analysis = await analyzeActivity(url, title);
        
        if (analysis) {
            // Hiển thị thông báo và phát âm thanh
            await showNotification(analysis);
        }
    } catch (error) {
        console.error('Lỗi khi kiểm tra hoạt động:', error);
    }
}

// Phân tích hoạt động với ChatGPT
async function analyzeActivity(url, title) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${settings.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `Bạn là trợ lý phân tích hoạt động web. Phân loại URL và tiêu đề trang vào 1 trong 5 loại: studying (học tập), working (làm việc), entertainment (giải trí), social_media (mạng xã hội), news (tin tức).

Quy tắc:
- studying: học tập - nếu URL chứa: course, learn, education, tutorial, study, khan, udemy, coursera, edx, stackoverflow, github (đọc docs)
- working: làm việc - nếu URL chứa: docs, workspace, meeting, calendar, email, drive, sheet, slides, jira, trello, notion, slack
- entertainment: giải trí - nếu URL chứa: youtube (không phải tutorial), netflix, spotify, game, music, video, movie, film, twitch
- social_media: mạng xã hội - nếu URL chứa: facebook, instagram, twitter, tiktok, reddit, linkedin (timeline)
- news: tin tức - nếi URL chứa: news, bbc, cnn, vnexpress, tuoitre, thanhnien, zing, báo

Trả về JSON với format:
{
  "category": "studying/working/entertainment/social_media/news",
  "message": "tin nhắn phù hợp bằng tiếng Việt"
}

Tin nhắn theo category:
- studying/working: động viên ngắn gọn (15-20 từ)
- entertainment/social_media: nhắc nhở tập trung (15-20 từ)
- news: tóm tắt cực ngắn tin tức từ tiêu đề (10-15 từ)`
                    },
                    {
                        role: 'user',
                        content: `URL: ${url}\nTiêu đề: ${title}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 150
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // Parse JSON response
        const result = JSON.parse(content);
        return result;
        
    } catch (error) {
        console.error('Lỗi khi gọi ChatGPT API:', error);
        return null;
    }
}

// Hiển thị thông báo và phát âm thanh
async function showNotification(analysis) {
    try {
        // Phát âm thanh từ background script
        chrome.tts.speak(analysis.message, {
            lang: 'vi-VN',
            rate: 0.9,
            pitch: 1.0,
            volume: 0.7,
            onEvent: function(event) {
                if (event.type === 'error') {
                    console.log('Chrome TTS lỗi:', event.errorMessage);
                }
            }
        });
        
        // Lấy tab hiện tại để gửi message
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (tab && tab.id) {
            // Gửi message đến content script để hiển thị notification
            chrome.tabs.sendMessage(tab.id, {
                action: 'showNotification',
                category: analysis.category,
                message: analysis.message
            });
        }
    } catch (error) {
        console.error('Lỗi khi hiển thị thông báo:', error);
    }
}