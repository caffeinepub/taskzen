import { useEffect, useRef } from 'react';
import type { Task } from '../backend';
import { toast } from 'sonner';
import { useFocusMode } from './useFocusMode';
import { formatReminderTime } from '../lib/reminders';

const FIRED_REMINDERS_KEY = 'taskzen-fired-reminders';

function getFiredReminders(): Set<string> {
  try {
    const stored = sessionStorage.getItem(FIRED_REMINDERS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function markReminderFired(taskId: string, reminderTime: string) {
  const fired = getFiredReminders();
  fired.add(`${taskId}-${reminderTime}`);
  sessionStorage.setItem(FIRED_REMINDERS_KEY, JSON.stringify([...fired]));
}

function isReminderFired(taskId: string, reminderTime: string): boolean {
  const fired = getFiredReminders();
  return fired.has(`${taskId}-${reminderTime}`);
}

export function useReminderNotifications(tasks: Task[] | undefined) {
  const { isFocusModeEnabled } = useFocusMode();
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!tasks || tasks.length === 0) return;

    const checkReminders = () => {
      const now = Date.now();
      const nowNanos = BigInt(now) * BigInt(1_000_000);

      tasks.forEach(task => {
        if (!task.reminderTime || task.isCompleted) return;

        const reminderNanos = task.reminderTime;
        const reminderMs = Number(reminderNanos / BigInt(1_000_000));
        const reminderKey = `${task.id.toString()}-${reminderNanos.toString()}`;

        // Check if reminder is due (within 1 minute window)
        if (reminderMs <= now && reminderMs > now - 60000) {
          if (!isReminderFired(task.id.toString(), reminderNanos.toString())) {
            // Mark as fired first to prevent duplicates
            markReminderFired(task.id.toString(), reminderNanos.toString());

            // Show in-app toast
            toast.info(`Reminder: ${task.title}`, {
              description: `Due at ${formatReminderTime(task.reminderTime)}`,
              duration: 5000,
            });

            // Show browser notification if permission granted and focus mode enabled
            if (isFocusModeEnabled && 'Notification' in window && Notification.permission === 'granted') {
              new Notification('TaskZen Reminder', {
                body: task.title,
                icon: '/assets/generated/taskzen-logomark.dim_512x512.png',
                tag: reminderKey,
              });
            }
          }
        }
      });
    };

    // Check immediately
    checkReminders();

    // Check every 30 seconds
    checkIntervalRef.current = setInterval(checkReminders, 30000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [tasks, isFocusModeEnabled]);
}
