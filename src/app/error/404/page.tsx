'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Error404Page() {
  const router = useRouter();
  const t = useTranslations();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-4 text-center">
        <div className="flex justify-center">
          <FileQuestion className="h-24 w-24 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">404</h1>
          <h2 className="text-2xl font-semibold">{t('error.404.title', { default: '페이지를 찾을 수 없습니다' })}</h2>
          <p className="text-muted-foreground">
            {t('error.404.description', {
              default: '요청하신 페이지가 존재하지 않거나 삭제되었습니다.'
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
