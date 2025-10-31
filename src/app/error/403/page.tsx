'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShieldX } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Error403Page() {
  const router = useRouter();
  const t = useTranslations();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-4 text-center">
        <div className="flex justify-center">
          <ShieldX className="h-24 w-24 text-destructive" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">403</h1>
          <h2 className="text-2xl font-semibold">{t('error.403.title', { default: '접근 거부' })}</h2>
          <p className="text-muted-foreground">
            {t('error.403.description', {
              default: '이 페이지에 접근할 권한이 없습니다.'
            })}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            onClick={() => router.back()}
            variant="outline"
          >
            {t('error.goBack', { default: '이전 페이지로' })}
          </Button>
          <Button
            onClick={() => router.push('/')}
          >
            {t('error.goHome', { default: '홈으로 이동' })}
          </Button>
        </div>
      </div>
    </div>
  );
}
