import Document, { Html, Head, Main, NextScript } from 'next/document';

const setInitialThemeScript = `(function () {
  try {
    var theme = window.localStorage.getItem('miniwiki-theme');
    if (theme !== 'dark' && theme !== 'light') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.setProperty('--theme-transition-duration', '0ms');
    window.requestAnimationFrame(function () {
      document.documentElement.style.setProperty('--theme-transition-duration', '300ms');
    });
  } catch (e) {
    // Ignore if storage or matchMedia are unavailable.
  }
})();`;

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <script dangerouslySetInnerHTML={{ __html: setInitialThemeScript }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
