import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, BellOff, Info } from 'lucide-react';

export default function NotificationPermissionPrompt() {
  const [permission, setPermission] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  );

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
    } catch (error) {
      console.error('Failed to request notification permission:', error);
    }
  };

  if (!('Notification' in window)) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Your browser does not support notifications.
        </AlertDescription>
      </Alert>
    );
  }

  if (permission === 'granted') {
    return null;
  }

  if (permission === 'denied') {
    return (
      <Alert>
        <BellOff className="h-4 w-4" />
        <AlertDescription>
          Notifications are blocked. Please enable them in your browser settings to receive task reminders.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="w-5 h-5 text-primary" />
          Enable Notifications
        </CardTitle>
        <CardDescription>
          Get notified when your task reminders are due. Enable Focus Mode for enhanced notification support.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={requestPermission} className="w-full">
          Enable Notifications
        </Button>
      </CardContent>
    </Card>
  );
}
