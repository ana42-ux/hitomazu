self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('push', e => {
  const data = e.data?.json() || { title: 'ひとまず', body: '今日のタスクを確認しましょう' };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.icon,
      data: { url: data.url || '/hitomazu/' },
      requireInteraction: false,
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const target = '/hitomazu/?from=push';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes('/hitomazu')) {
          c.focus();
          c.postMessage({ type: 'FROM_PUSH' });
          return;
        }
      }
      return clients.openWindow(target);
    })
  );
});
