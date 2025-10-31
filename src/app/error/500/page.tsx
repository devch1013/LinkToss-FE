'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Error500Page() {
  const router = useRouter();
  const t = useTranslations();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-4 text-center">
        <div className="flex justify-center">
          <AlertCircle className="h-24 w-24 text-destructive" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">500</h1>
          <h2 className="text-2xl font-semibold">{t('error.500.title', { default: '서버 오류' })}</h2>
          <p className="text-muted-foreground">
            {t('error.500.description', {
              default: '서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
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
