export default function Figure({ src, alt = '', caption, width = 'auto' }) {
  return (
    <figure className="my-6">
      <img
        src={src}
        alt={alt}
        style={{ width, height: 'auto', maxWidth: '100%' }}
      />
      {caption ? <figcaption className="mt-2 text-sm text-slate-600 dark:text-slate-400">{caption}</figcaption> : null}
    </figure>
  );
}
