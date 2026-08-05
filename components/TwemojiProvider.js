import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function TwemojiProvider({ children }) {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function parseEmojis() {
      try {
        const twemojiModule = await import('twemoji');
        const twemoji = twemojiModule.default || twemojiModule;
        if (cancelled) return;
        const container = document.querySelector('main') || document.body;
        twemoji.parse(container, { folder: 'svg', ext: '.svg' });
      } catch (e) {
        console.error('twemoji parse failed', e);
      }
    }

    parseEmojis();

    const handleRoute = () => {
      parseEmojis();
    };

    router.events?.on('routeChangeComplete', handleRoute);

    return () => {
      cancelled = true;
      router.events?.off('routeChangeComplete', handleRoute);
    };
  }, [router.events]);

  return children;
}
