import RequireAuth from '../components/auth/RequireAuth';
import { useGetCallerUserProfile } from '../hooks/useTasks';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useFocusMode } from '../hooks/useFocusMode';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Focus, Bell, Info } from 'lucide-react';
import ProfileSetup from '../components/auth/ProfileSetup';
import FocusModeTimer from '../components/focus/FocusModeTimer';

export default function FocusModePage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { isFocusModeEnabled, setFocusModeEnabled } = useFocusMode();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const notificationPermission = 'Notification' in window ? Notification.permission : 'denied';

  return (
    <RequireAuth>
      <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                <Focus className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">Focus Mode</h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Minimize distractions and enhance your productivity with focused notifications
              </p>
            </div>

            {/* Focus Mode Control */}
            <Card>
              <CardHeader>
                <CardTitle>Enable Focus Mode</CardTitle>
                <CardDescription>
                  When enabled, you'll receive browser notifications for task reminders to help you stay on track
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label htmlFor="focus-mode" className="text-base cursor-pointer">
                    Focus Mode {isFocusModeEnabled ? 'On' : 'Off'}
                  </Label>
                  <Switch
                    id="focus-mode"
                    checked={isFocusModeEnabled}
                    onCheckedChange={setFocusModeEnabled}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Timer - Only visible when Focus Mode is enabled */}
            {isFocusModeEnabled ? (
              <FocusModeTimer />
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                    <Focus className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-2 font-medium">
                    Timer Available in Focus Mode
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Enable Focus Mode above to access the focus timer
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Notification Status */}
            {isFocusModeEnabled && (
              <Alert className={notificationPermission === 'granted' ? 'border-primary/20 bg-primary/5' : ''}>
                <Bell className="h-4 w-4" />
                <AlertDescription>
                  {notificationPermission === 'granted' ? (
                    'Browser notifications are enabled. You will receive alerts when task reminders are due.'
                  ) : notificationPermission === 'denied' ? (
                    'Browser notifications are blocked. Please enable them in your browser settings to receive reminders.'
                  ) : (
                    'Please enable browser notifications on the Tasks page to receive reminder alerts.'
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Information */}
            <Card className="border-muted">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  How Focus Mode Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Enhanced Notifications:</strong> When Focus Mode is enabled and you've granted notification permission, you'll receive browser notifications for task reminders even when TaskZen is in the background.
                </p>
                <p>
                  <strong className="text-foreground">Focus Timer:</strong> Use the built-in timer to track your focus sessions and maintain deep work periods with mindful time management.
                </p>
                <p>
                  <strong className="text-foreground">Stay on Track:</strong> Browser notifications help ensure you never miss an important task deadline, keeping you focused and productive.
                </p>
                <p>
                  <strong className="text-foreground">Mindful Productivity:</strong> Focus Mode is designed to support your workflow without overwhelming you with distractions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Profile Setup Modal */}
      <ProfileSetup open={showProfileSetup} />
    </RequireAuth>
  );
}
