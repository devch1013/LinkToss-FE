import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async () => {
  // 클라이언트에서 보낸 locale 헤더 확인
  const headersList = await headers();
  const locale = headersList.get('x-locale') || 'ko';

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default
  };
});

