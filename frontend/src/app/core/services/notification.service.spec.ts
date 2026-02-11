import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Notification Display', () => {
    it('should show success notification', () => {
      service.success('Success Title', 'Success message');
      
      const notifications = service.notifications$();
      expect(notifications.length).toBe(1);
      expect(notifications[0].type).toBe('success');
      expect(notifications[0].title).toBe('Success Title');
      expect(notifications[0].message).toBe('Success message');
    });

    it('should show error notification', () => {
      service.error('Error Title', 'Error message');
      
      const notifications = service.notifications$();
      expect(notifications.length).toBe(1);
      expect(notifications[0].type).toBe('error');
      expect(notifications[0].title).toBe('Error Title');
      expect(notifications[0].message).toBe('Error message');
    });

    it('should show warning notification', () => {
      service.warning('Warning Title', 'Warning message');
      
      const notifications = service.notifications$();
      expect(notifications.length).toBe(1);
      expect(notifications[0].type).toBe('warning');
      expect(notifications[0].title).toBe('Warning Title');
      expect(notifications[0].message).toBe('Warning message');
    });

    it('should show info notification', () => {
      service.info('Info Title', 'Info message');
      
      const notifications = service.notifications$();
      expect(notifications.length).toBe(1);
      expect(notifications[0].type).toBe('info');
      expect(notifications[0].title).toBe('Info Title');
      expect(notifications[0].message).toBe('Info message');
    });
  });

  describe('Notification Management', () => {
    it('should assign unique IDs to notifications', () => {
      service.success('Title 1', 'Message 1');
      service.success('Title 2', 'Message 2');
      
      const notifications = service.notifications$();
      expect(notifications[0].id).not.toBe(notifications[1].id);
    });

    it('should remove notification by ID', () => {
      service.success('Title 1', 'Message 1');
      service.success('Title 2', 'Message 2');
      
      const notifications = service.notifications$();
      const firstId = notifications[0].id;
      
      service.remove(firstId);
      
      const remaining = service.notifications$();
      expect(remaining.length).toBe(1);
      expect(remaining[0].id).not.toBe(firstId);
    });

    it('should clear all notifications', () => {
      service.success('Title 1', 'Message 1');
      service.error('Title 2', 'Message 2');
      service.warning('Title 3', 'Message 3');
      
      expect(service.notifications$().length).toBe(3);
      
      service.clear();
      
      expect(service.notifications$().length).toBe(0);
    });

    it('should handle multiple notifications', () => {
      for (let i = 0; i < 5; i++) {
        service.success(`Title ${i}`, `Message ${i}`);
      }
      
      expect(service.notifications$().length).toBe(5);
    });
  });

  describe('Auto-dismiss', () => {
    it('should auto-dismiss notification after duration', fakeAsync(() => {
      service.success('Title', 'Auto-dismiss message', 1000);
      
      expect(service.notifications$().length).toBe(1);
      
      tick(1000);
      
      expect(service.notifications$().length).toBe(0);
    }));

    it('should not auto-dismiss persistent notifications', fakeAsync(() => {
      service.error('Title', 'Persistent message', true);
      
      expect(service.notifications$().length).toBe(1);
      
      tick(10000);
      
      expect(service.notifications$().length).toBe(1);
    }));

    it('should handle multiple auto-dismiss notifications', fakeAsync(() => {
      service.success('Title 1', 'Message 1', 1000);
      service.success('Title 2', 'Message 2', 2000);
      service.success('Title 3', 'Message 3', 3000);
      
      expect(service.notifications$().length).toBe(3);
      
      tick(1000);
      expect(service.notifications$().length).toBe(2);
      
      tick(1000);
      expect(service.notifications$().length).toBe(1);
      
      tick(1000);
      expect(service.notifications$().length).toBe(0);
    }));
  });

  describe('Notification Limits', () => {
    it('should allow multiple notifications', () => {
      for (let i = 0; i < 10; i++) {
        service.success(`Title ${i}`, `Message ${i}`);
      }
      
      const notifications = service.notifications$();
      expect(notifications.length).toBe(10);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty message', () => {
      service.success('Title', '');
      
      const notifications = service.notifications$();
      expect(notifications.length).toBe(1);
      expect(notifications[0].message).toBe('');
    });

    it('should handle very long message', () => {
      const longMessage = 'A'.repeat(1000);
      service.success('Title', longMessage);
      
      const notifications = service.notifications$();
      expect(notifications[0].message).toBe(longMessage);
    });

    it('should handle special characters in message', () => {
      const specialMessage = '<script>alert("XSS")</script>';
      service.success('Title', specialMessage);
      
      const notifications = service.notifications$();
      expect(notifications[0].message).toBe(specialMessage);
    });

    it('should handle removing non-existent notification', () => {
      service.success('Title', 'Message');
      const initialCount = service.notifications$().length;
      
      service.remove('non-existent-id');
      
      expect(service.notifications$().length).toBe(initialCount);
    });
  });
});
