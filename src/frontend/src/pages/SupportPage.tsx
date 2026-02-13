import RequireAuth from '../components/auth/RequireAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Mail, MessageCircle, HelpCircle } from 'lucide-react';

export default function SupportPage() {
  const supportEmail = 'rohanchaudhari998@gmail.com';

  return (
    <RequireAuth>
      <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
                <HelpCircle className="w-10 h-10 text-primary" />
                Support & Help
              </h1>
              <p className="text-muted-foreground">
                We're here to help you get the most out of TaskZen
              </p>
            </div>

            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  Get in Touch
                </CardTitle>
                <CardDescription>
                  Have questions, feedback, or need assistance? We'd love to hear from you!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-foreground">Email Support</h3>
                      <p className="text-sm text-muted-foreground">
                        Send us an email and we'll get back to you as soon as possible.
                      </p>
                      <div className="pt-2">
                        <a 
                          href={`mailto:${supportEmail}`}
                          className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                        >
                          {supportEmail}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertDescription className="text-sm">
                    <strong>Response Time:</strong> We typically respond within 24-48 hours during business days.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* FAQ Card */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground">How do I create a new task?</h4>
                    <p className="text-sm text-muted-foreground">
                      Navigate to the Tasks page and click "Add Task" or use the "Add Task" button in the navigation menu.
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground">How do I set reminders?</h4>
                    <p className="text-sm text-muted-foreground">
                      On the Tasks page, click the bell icon next to any task to set a reminder time. Make sure to enable browser notifications when prompted.
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground">What is Focus Mode?</h4>
                    <p className="text-sm text-muted-foreground">
                      Focus Mode helps you concentrate by managing your notifications. When enabled, you can use the built-in timer to track your focus sessions.
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground">How do I organize my study assignments?</h4>
                    <p className="text-sm text-muted-foreground">
                      Use the Study Zone to create subjects and add assignments with due dates. You can track your progress and mark assignments as complete.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Help */}
            <Card>
              <CardContent className="py-6">
                <div className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Still need help? Don't hesitate to reach out!
                  </p>
                  <Button asChild>
                    <a href={`mailto:${supportEmail}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Support
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
