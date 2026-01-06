document.addEventListener('DOMContentLoaded', function() {
    // العناصر الرئيسية
    const photoCounter = document.getElementById('photo-counter');
    const videoCounter = document.getElementById('video-counter');
    const fileCounter = document.getElementById('file-counter');
    const terminal = document.getElementById('log-content');
    const gallery = document.getElementById('gallery');
    const downloadBtn = document.getElementById('download-btn');
    const encryptionModal = document.getElementById('encryption-modal');
    const closeModal = document.getElementById('close-modal');
    const continueBtn = document.getElementById('continue-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    
    // المتغيرات
    let photoCount = 0;
    let videoCount = 0;
    let fileCount = 0;
    let globalProgress = 0;
    let isRunning = true;
    
    const totalPhotos = 12458;
    const totalVideos = 312;
    const totalFiles = 4217;
    
    // قائمة الرسائل للتيرمينال
    const logMessages = [
        "[OK] IMG_20220115_083421.jpg recovered",
        "[OK] VID_20211203_192345.mp4 recovered",
        "[INFO] Scanning DCIM/Screenshots...",
        "[OK] Screenshot_2021-11-30-12-34-56.png recovered",
        "[INFO] Processing WhatsApp Media...",
        "[OK] Audio/voice_note_2022.opus recovered",
        "[WARNING] Corrupted file: IMG_20210302.jpg - Skipped",
        "[INFO] Found 4.2GB in Download folder",
        "[OK] document_contract.pdf recovered",
        "[INFO] Checking file integrity...",
        "[OK] All files passed CRC32 check",
        "[INFO] Creating recovery index...",
        "[WARNING] Low battery - 23% remaining",
        "[INFO] Switching to USB power mode",
        "[OK] Thumbnail generation complete",
        "[INFO] Compressing recovered data..."
    ];
    
    // صور وهمية للجاليري (استخدم صورًا عامة)
    const galleryImages = Array.from({length: 24}, (_, i) => ({
        id: i + 1,
        name: `IMG_${String(i+1001).padStart(4, '0')}.jpg`
    }));
    
    // تحديث الوقت
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {hour12: false});
        document.getElementById('current-time').textContent = timeString;
    }
    
    // تحديث العدادات
    function updateCounters() {
        if (!isRunning) return;
        
        // زيادة العدادات
        if (photoCount < totalPhotos) {
            photoCount += Math.floor(Math.random() * 10) + 5;
            if (photoCount > totalPhotos) photoCount = totalPhotos;
        }
        
        if (videoCount < totalVideos) {
            videoCount += Math.floor(Math.random() * 3) + 1;
            if (videoCount > totalVideos) videoCount = totalVideos;
        }
        
        if (fileCount < totalFiles) {
            fileCount += Math.floor(Math.random() * 15) + 8;
            if (fileCount > totalFiles) fileCount = totalFiles;
        }
        
        // تحديث العرض
        photoCounter.textContent = `${formatNumber(photoCount)} / ${formatNumber(totalPhotos)}`;
        videoCounter.textContent = `${formatNumber(videoCount)} / ${formatNumber(totalVideos)}`;
        fileCounter.textContent = `${formatNumber(fileCount)} / ${formatNumber(totalFiles)}`;
        
        // تحديث شريط التقدم
        const photoProgress = (photoCount / totalPhotos) * 100;
        const videoProgress = (videoCount / totalVideos) * 100;
        const fileProgress = (fileCount / totalFiles) * 100;
        
        document.getElementById('photo-progress').style.width = `${photoProgress}%`;
        document.getElementById('video-progress').style.width = `${videoProgress}%`;
        document.getElementById('file-progress').style.width = `${fileProgress}%`;
        
        // التقدم العام
        globalProgress = (photoCount + videoCount + fileCount) / (totalPhotos + totalVideos + totalFiles) * 100;
        document.getElementById('global-progress').style.width = `${globalProgress}%`;
        document.getElementById('global-percent').textContent = `${Math.round(globalProgress)}%`;
        
        // تحديث الوقت المتبقي
        updateETA();
    }
    
    // تنسيق الأرقام
    function formatNumber(num) {
        return num.toLocaleString('en-US');
    }
    
    // تحديث الوقت المتبقي
    function updateETA() {
        const remaining = 100 - globalProgress;
        const minutes = Math.floor(remaining / 2) + 5;
        const seconds = Math.floor((remaining % 2) * 30);
        document.getElementById('eta').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // إضافة رسالة للتيرمينال
    function addLogMessage() {
        if (!isRunning) return;
        
        const message = logMessages[Math.floor(Math.random() * logMessages.length)];
        const p = document.createElement('p');
        p.textContent = `> ${message}`;
        p.className = 'log-entry';
        
        terminal.appendChild(p);
        
        // عرض أحدث الرسائل
        terminal.scrollTop = terminal.scrollHeight;
        
        // إضافة صور للجاليري بشكل عشوائي
        if (Math.random() > 0.7 && gallery.children.length < galleryImages.length) {
            addGalleryImage();
        }
    }
    
    // إضافة صورة للجاليري
    function addGalleryImage() {
        const remainingImages = galleryImages.filter(img => 
            !Array.from(gallery.children).some(child => 
                child.getAttribute('data-id') == img.id
            )
        );
        
        if (remainingImages.length > 0) {
            const imgData = remainingImages[0];
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.setAttribute('data-id', imgData.id);
            div.setAttribute('data-number', imgData.id + 1000);
            
            // لون خلفية عشوائي
            const hue = Math.floor(Math.random() * 60) + 80; // ظلال خضراء
            div.style.background = `linear-gradient(45deg, hsl(${hue}, 70%, 10%), hsl(${hue}, 70%, 20%))`;
            
            gallery.appendChild(div);
            
            // تأثير ظهور
            div.style.opacity = '0';
            div.style.transform = 'scale(0.8)';
            setTimeout(() => {
                div.style.transition = 'all 0.5s';
                div.style.opacity = '1';
                div.style.transform = 'scale(1)';
            }, 10);
        }
    }
    
    // معالجة زر التحميل
    downloadBtn.addEventListener('click', function() {
        encryptionModal.style.display = 'flex';
    });
    
    // إغلاق المودال
    closeModal.addEventListener('click', function() {
        encryptionModal.style.display = 'none';
    });
    
    cancelBtn.addEventListener('click', function() {
        encryptionModal.style.display = 'none';
    });
    
    continueBtn.addEventListener('click', function() {
        encryptionModal.style.display = 'none';
        // إضافة رسالة في التيرمينال
        const p = document.createElement('p');
        p.textContent = '> [INFO] Continuing recovery despite encryption...';
        p.style.color = '#ff0';
        terminal.appendChild(p);
        terminal.scrollTop = terminal.scrollHeight;
    });
    
    // زر الإيقاف المؤقت
    document.getElementById('pause-btn').addEventListener('click', function() {
        isRunning = !isRunning;
        const icon = this.querySelector('i');
        const text = this.querySelector('span');
        
        if (isRunning) {
            icon.className = 'fas fa-pause';
            text.textContent = ' Pause Recovery';
            this.classList.remove('paused');
        } else {
            icon.className = 'fas fa-play';
            text.textContent = ' Resume Recovery';
            this.classList.add('paused');
            
            // إضافة رسالة إيقاف
            const p = document.createElement('p');
            p.textContent = '> [PAUSED] Recovery process paused by user';
            p.style.color = '#ff0';
            terminal.appendChild(p);
            terminal.scrollTop = terminal.scrollHeight;
        }
    });
    
    // إنشاء تأثير الجسيمات
    function createParticles() {
        if (Math.random() > 0.7) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            document.querySelector('.container').appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }
    
    // البدء
    updateTime();
    setInterval(updateTime, 1000);
    setInterval(updateCounters, 300);
    setInterval(addLogMessage, 2000);
    setInterval(createParticles, 500);
    
    // تهيئة الجاليري ببعض الصور
    for (let i = 0; i < 8; i++) {
        setTimeout(addGalleryImage, i * 500);
    }
});
