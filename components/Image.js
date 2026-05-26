import NextImage from 'next/image';
import { normalizeAssetPath } from '../lib/asset-path';

export default function geImage({
  src,
  alt = '',
  caption,
  width,
  height,
  enforceAspect = false,
  aspect = '16/9',
  sizes = '100vw',
  priority = false,
  loading = 'lazy',
  placeholder = 'empty',
  blurDataURL,
  className = '',
  style = {},
  ...props
}) {
  const normalizedSrc = normalizeAssetPath(src || '');
  const useFill = enforceAspect && (!width || !height);
  const useNativeImg = !useFill && (!width || !height);
  const wrapperStyle = {
    width: typeof width === 'number' ? `${width}px` : width || '100%',
    aspectRatio: useFill ? aspect : undefined,
    ...style,
  };

  return (
    <figure className="my-6">
      <div
        className={`relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 ${className}`.trim()}
        style={wrapperStyle}
      >
        {useNativeImg ? (
          <img
            src={normalizedSrc}
            alt={alt}
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            {...props}
          />
        ) : (
          <NextImage
            src={normalizedSrc}
            alt={alt}
            {...(useFill ? { fill: true } : { width, height })}
            sizes={sizes}
            priority={priority}
            loading={loading}
            placeholder={blurDataURL ? 'blur' : placeholder}
            blurDataURL={blurDataURL}
            style={{ objectFit: 'contain' }}
            {...props}
          />
        )}
      </div>
      {caption ? (
        <figcaption className="mt-2 text-sm text-slate-600 dark:text-slate-400">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
