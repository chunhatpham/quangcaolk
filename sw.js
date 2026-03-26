const CACHE_NAME = 'ff-hack-v2'; // Đổi tên này (ví dụ v3, v4) mỗi khi bạn sửa code để app cập nhật bản mới

// Danh sách các file cần lưu vào máy để chạy mượt và không bị lỗi
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png'
];

// Bước 1: Cài đặt Service Worker và lưu file vào cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Đã lưu cache thành công');
        return cache.addAll(urlsToCache);
      })
  );
});

// Bước 2: Bắt các yêu cầu tải trang (giúp app chạy mượt kể cả khi mạng yếu)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Nếu tìm thấy file trong cache thì trả về luôn, nếu không thì tải từ mạng
        return response || fetch(event.request);
      })
  );
});

// Bước 3: Kích hoạt Service Worker mới và dọn dẹp cache cũ (GIÚP FIX LỖI KẸT APP CŨ)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Đã xóa cache cũ:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
