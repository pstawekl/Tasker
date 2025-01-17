import { Reminder } from '../lib/models/reminders';
import { Task } from '../lib/models/tasks';

export class NotificationService {
  private static instance: NotificationService;
  private hasPermission: boolean = false;
  private reminderTimeouts: Map<string, number> = new Map();

  private constructor() {
    this.checkPermission();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private validateReminderData(task: Task, reminder: Reminder): boolean {
    if (!task?.id || !reminder?.reminder_time) {
      console.error('Invalid reminder data:', { task, reminder });
      return false;
    }
    return true;
  }

  private validateTime(reminderTime: number): boolean {
    const currentTime = new Date().getTime();
    const localReminderTime = new Date(reminderTime).getTime();
    const timeUntilReminder = localReminderTime - currentTime;

    if (timeUntilReminder <= 0) {
      console.error('Reminder time has already passed:', {
        reminderTime: new Date(reminderTime).toLocaleDateString('pl-PL', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'UTC'
        }),
        currentTime: new Date(currentTime).toLocaleString(),
        difference: Math.floor(timeUntilReminder / (1000 * 60)) + ' minutes'
      });
      return false;
    }
    return true;
  }

  public async checkPermission(): Promise<boolean> {
    try {
      if (!('Notification' in window)) {
        console.error('This browser does not support notifications');
        return false;
      }

      if (Notification.permission === 'granted') {
        this.hasPermission = true;
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        this.hasPermission = permission === 'granted';
      }

      console.log('Notification permission status:', Notification.permission);
      return this.hasPermission;
    } catch (error) {
      console.error('Error checking notification permission:', error);
      return false;
    }
  }

  async scheduleTaskReminder(task: Task, reminder: Reminder): Promise<boolean> {
    try {
      if (!(await this.checkPermission())) {
        console.error('No notification permission');
        return false;
      }

      if (!this.validateReminderData(task, reminder)) {
        return false;
      }

      // Konwertuj UTC string na lokalny czas
      const localReminderTime = new Date(reminder.reminder_time).toLocaleDateString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
      });
      const utcDate = new Date(localReminderTime);
      const localReminderTimeNumber = new Date(
        utcDate.getUTCFullYear(),
        utcDate.getUTCMonth(),
        utcDate.getUTCDate(),
        utcDate.getUTCHours(),
        utcDate.getUTCMinutes()
      ).getTime();

      if (!this.validateTime(localReminderTimeNumber)) {
        return false;
      }

      const currentTime = new Date().getTime();
      const timeUntilReminder = localReminderTimeNumber - currentTime;

      console.log('Scheduling reminder:', {
        taskId: task.id,
        taskTitle: task.title,
        utcTime: utcDate.toUTCString(),
        localTime: new Date(localReminderTime).toLocaleString(),
        timeUntilReminder: Math.floor(timeUntilReminder / (1000 * 60)) + ' minutes'
      });

      const timeoutId = setTimeout(() => {
        this.showNotification(task);
      }, timeUntilReminder);

      this.reminderTimeouts.set(task.id.toString(), Number(timeoutId));
      return true;
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      return false;
    }
  }

  private async showNotification(task: Task): Promise<void> {
    try {
      if (!('Notification' in window)) {
        console.error('Notifications not supported');
        return;
      }

      const notification = new Notification('Task Reminder', {
        body: `Task "${task.title}" is due ${task.due_date ? `on ${new Date(task.due_date).toLocaleDateString()}` : 'soon'}`,
        icon: '/favicon.ico',
        tag: `task-${task.id}`,
        requireInteraction: true,
        silent: false
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      console.log('Notification shown for task:', task.title);
      this.reminderTimeouts.delete(task.id.toString());
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  async cancelTaskReminder(taskId: string): Promise<void> {
    const timeoutId = this.reminderTimeouts.get(taskId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.reminderTimeouts.delete(taskId);
    }
  }

  async updateTaskReminder(task: Task, reminder: Reminder): Promise<void> {
    await this.cancelTaskReminder(task.id.toString());
    await this.scheduleTaskReminder(task, reminder);
  }

  async deleteTaskReminder(taskId: string): Promise<void> {
    await this.cancelTaskReminder(taskId);
  }
}

export const notificationService = NotificationService.getInstance();
