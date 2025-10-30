'use client';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [selectedLocale, setSelectedLocale] = useState(locale);

  const handleLanguageChange = (newLocale: string) => {
    setSelectedLocale(newLocale);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    toast.success(t('settings.languageChanged'));
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-2xl">🔗</div>
          <p className="mt-2 text-sm text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const userInitials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container max-w-4xl py-8">
            <h1 className="mb-8 text-3xl font-bold">{t('settings.title')}</h1>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">{t('settings.profile')}</TabsTrigger>
                <TabsTrigger value="security">{t('settings.security')}</TabsTrigger>
                <TabsTrigger value="notifications">{t('settings.notifications')}</TabsTrigger>
                <TabsTrigger value="language">{t('settings.language')}</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('settings.profileInfo')}</CardTitle>
                    <CardDescription>{t('settings.managePublicProfile')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={user.avatarUrl || undefined} />
                        <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm">{t('settings.change')}</Button>
                        <Button variant="ghost" size="sm">{t('common.delete')}</Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">{t('settings.name')}</Label>
                      <Input id="name" defaultValue={user.name} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t('settings.email')}</Label>
                      <Input id="email" defaultValue={user.email} disabled />
                      <p className="text-xs text-muted-foreground">{t('settings.emailCannotChange')}</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">{t('settings.username')}</Label>
                      <Input id="username" defaultValue={user.username} />
                      <p className="text-xs text-muted-foreground">linktoss.com/@{user.username}</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">{t('settings.bio')}</Label>
                      <Textarea id="bio" defaultValue={user.bio || ''} rows={3} />
                    </div>

                    <Button>{t('settings.saveChanges')}</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('settings.connectedSocialAccounts')}</CardTitle>
                    <CardDescription>{t('settings.manageSocialAccounts')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Google</p>
                          <p className="text-sm text-muted-foreground">{t('settings.connected')}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">{t('settings.disconnect')}</Button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">GitHub</p>
                          <p className="text-sm text-muted-foreground">{t('settings.notConnected')}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">{t('settings.connect')}</Button>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {t('settings.minOneAccountRequired')}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('settings.notificationSettings')}</CardTitle>
                    <CardDescription>{t('settings.chooseNotificationMethod')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t('settings.emailNotifications')}</p>
                        <p className="text-sm text-muted-foreground">{t('settings.emailNotificationsDesc')}</p>
                      </div>
                      <input type="checkbox" className="h-4 w-4" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t('settings.pushNotifications')}</p>
                        <p className="text-sm text-muted-foreground">{t('settings.pushNotificationsDesc')}</p>
                      </div>
                      <input type="checkbox" className="h-4 w-4" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t('settings.repositoryInvitation')}</p>
                        <p className="text-sm text-muted-foreground">{t('settings.repositoryInvitationDesc')}</p>
                      </div>
                      <input type="checkbox" className="h-4 w-4" defaultChecked />
                    </div>

                    <Button>{t('settings.save')}</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Language Tab */}
              <TabsContent value="language" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('settings.languageSettings')}</CardTitle>
                    <CardDescription>{t('settings.chooseLanguage')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div
                      className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-colors ${selectedLocale === 'ko' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                      onClick={() => handleLanguageChange('ko')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🇰🇷</div>
                        <div>
                          <p className="font-medium">{t('settings.korean')}</p>
                          <p className="text-sm text-muted-foreground">한국어</p>
                        </div>
                      </div>
                      {selectedLocale === 'ko' && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div
                      className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-colors ${selectedLocale === 'en' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                      onClick={() => handleLanguageChange('en')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🇺🇸</div>
                        <div>
                          <p className="font-medium">{t('settings.english')}</p>
                          <p className="text-sm text-muted-foreground">English</p>
                        </div>
                      </div>
                      {selectedLocale === 'en' && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
