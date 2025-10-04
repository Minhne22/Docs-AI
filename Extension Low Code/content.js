// Lắng nghe message từ background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'showNotification') {
        showAnimatedNotification(request.category, request.message);
    }
});

// Hiển thị thông báo động với GIF
function showAnimatedNotification(category, message) {
    // Xóa notification cũ nếu có
    const oldNotification = document.getElementById('focus-assistant-notification');
    if (oldNotification) {
        oldNotification.remove();
    }
    
    // Chọn GIF dựa trên category
    const gifUrls = {
        studying: 'https://media.giphy.com/media/3o7btNhMBytxAM6YBa/giphy.gif', // Study GIF
        working: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif', // Work GIF
        entertainment: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif', // Fun GIF
        social_media: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif', // Social GIF
        news: 'https://media.giphy.com/media/3o7TKP9ln2Dr6ze6f6/giphy.gif' // News GIF
    };
    
    const colors = {
        studying: '#4CAF50',
        working: '#2196F3',
        entertainment: '#FF9800',
        social_media: '#E91E63',
        news: '#9C27B0'
    };
    
    // Tạo container thông báo
    const notification = document.createElement('div');
    notification.id = 'focus-assistant-notification';
    notification.className = 'focus-notification';
    
    // Thiết lập màu dựa trên category
    const color = colors[category] || '#667eea';
    
    notification.innerHTML = `
        <div class="notification-content" style="border-left-color: ${color}">
            <div class="notification-gif">
                <img src="${gifUrls[category] || gifUrls.working}" alt="notification">
            </div>
            <div class="notification-text">
                <div class="notification-category" style="color: ${color}">
                    ${getCategoryText(category)}
                </div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Thêm vào trang
    document.body.appendChild(notification);
    
    // Thêm animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Xử lý nút đóng
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Âm thanh đã được phát từ background script
    
    // Tự động đóng sau 10 giây
    setTimeout(() => {
        closeNotification(notification);
    }, 10000);
}

// Đóng thông báo
function closeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification && notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// Lấy text hiển thị cho category
function getCategoryText(category) {
    const texts = {
        studying: '📚 Đang Học Tập',
        working: '💼 Đang Làm Việc',
        entertainment: '🎮 Giải Trí',
        social_media: '📱 Mạng Xã Hội',
        news: '📰 Tin Tức'
    };
    return texts[category] || '📌 Thông Báo';
}

// Phát âm thanh bằng Chrome TTS API
function speakMessage(text) {
    try {
        // Sử dụng Chrome TTS API (phương pháp chính)
        chrome.tts.speak(text, {
            lang: 'vi-VN',
            rate: 0.9,
            pitch: 1.0,
            volume: 0.7,
            onEvent: function(event) {
                if (event.type === 'error') {
                    console.log('Chrome TTS lỗi, thử phương pháp dự phòng');
                    // Thử phương pháp dự phòng
                    fallbackSpeak(text);
                }
            }
        });
    } catch (error) {
        console.error('Lỗi khi phát âm thanh:', error);
        // Thử phương pháp dự phòng
        fallbackSpeak(text);
    }
}

// Phương pháp dự phòng sử dụng Web Speech API
function fallbackSpeak(text) {
    try {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'vi-VN';
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            utterance.volume = 0.7;
            
            // Tìm giọng tiếng Việt
            const voices = speechSynthesis.getVoices();
            const vietnameseVoice = voices.find(voice => 
                voice.lang.includes('vi') || voice.lang.includes('VN')
            );
            
            if (vietnameseVoice) {
                utterance.voice = vietnameseVoice;
            }
            
            speechSynthesis.speak(utterance);
        } else {
            console.log('Trình duyệt không hỗ trợ Web Speech API');
        }
    } catch (error) {
        console.error('Lỗi phương pháp dự phòng:', error);
    }
}