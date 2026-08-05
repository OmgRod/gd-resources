import '../styles/globals.css';
import 'katex/dist/katex.min.css';
import TwemojiProvider from '../components/TwemojiProvider';

export default function App({ Component, pageProps }) {
  return (
    <TwemojiProvider>
      <Component {...pageProps} />
    </TwemojiProvider>
  );
}
