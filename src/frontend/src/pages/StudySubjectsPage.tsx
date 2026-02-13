import { useState } from 'react';
import RequireAuth from '../components/auth/RequireAuth';
import { useGetSubjects, useCreateSubject } from '../hooks/useStudyZone';
import { useGetCallerUserProfile } from '../hooks/useTasks';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from '@tanstack/react-router';
import { BookOpen, Plus, Loader2, AlertCircle, GraduationCap } from 'lucide-react';
import ProfileSetup from '../components/auth/ProfileSetup';

export default function StudySubjectsPage() {
  const { identity } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: subjects, isLoading, isError, error } = useGetSubjects();
  const createSubject = useCreateSubject();
  const [newSubjectTitle, setNewSubjectTitle] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectTitle.trim()) return;
    
    // Clear any previous error
    setCreateError(null);
    
    // Check if actor is ready
    if (!actor || actorFetching) {
      setCreateError('Please wait while connecting...');
      return;
    }

    createSubject.mutate(newSubjectTitle, {
      onSuccess: () => {
        setNewSubjectTitle('');
        setCreateError(null);
      },
      onError: (error: any) => {
        // Set inline error in addition to toast
        let errorMessage = 'Failed to create subject. Please try again.';
        if (error?.message) {
          if (error.message.includes('Unauthorized')) {
            errorMessage = 'You must be logged in to create subjects.';
          } else if (error.message.includes('trap')) {
            errorMessage = 'Authorization error. Please log in again.';
          } else {
            errorMessage = error.message;
          }
        }
        setCreateError(errorMessage);
      },
    });
  };

  return (
    <RequireAuth>
      <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                <GraduationCap className="w-10 h-10 text-primary" />
                Study Zone
              </h1>
              <p className="text-muted-foreground">
                Organize your subjects and track assignments
              </p>
            </div>

            {/* Add Subject Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add New Subject</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateSubject} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject-title">Subject Name</Label>
                    <Input
                      id="subject-title"
                      placeholder="e.g., Mathematics, Physics, History..."
                      value={newSubjectTitle}
                      onChange={(e) => setNewSubjectTitle(e.target.value)}
                      disabled={createSubject.isPending || !actor || actorFetching}
                    />
                  </div>
                  
                  {/* Inline error display */}
                  {createError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{createError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button 
                    type="submit" 
                    disabled={createSubject.isPending || !newSubjectTitle.trim() || !actor || actorFetching}
                    className="w-full gap-2"
                  >
                    {createSubject.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : actorFetching ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Add Subject
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Error State */}
            {isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error instanceof Error ? error.message : 'Failed to load subjects. Please try again.'}
                </AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                  <p className="text-muted-foreground">Loading your subjects...</p>
                </div>
              </div>
            )}

            {/* Subjects List */}
            {!isLoading && !isError && subjects && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Your Subjects</h2>
                {subjects.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="py-16">
                      <div className="text-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                          <BookOpen className="w-10 h-10 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-foreground">No subjects yet</h3>
                          <p className="text-muted-foreground max-w-sm mx-auto">
                            Create your first subject to start organizing your assignments.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {subjects.map((subject) => (
                      <Link 
                        key={subject.id.toString()} 
                        to="/study/$subjectId" 
                        params={{ subjectId: subject.id.toString() }}
                      >
                        <Card className="hover:shadow-md transition-all cursor-pointer h-full">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <BookOpen className="w-5 h-5 text-primary" />
                              {subject.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              {subject.assignments.length} assignment{subject.assignments.length !== 1 ? 's' : ''}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Setup Modal */}
      <ProfileSetup open={showProfileSetup} />
    </RequireAuth>
  );
}
