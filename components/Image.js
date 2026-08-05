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

  const Wrapper = caption ? 'figure' : 'span';
  const wrapperClass = caption ? 'my-6' : 'inline-block';
  const wrapperStyle = {
    display: caption ? undefined : 'block',
    width: typeof width === 'number' ? `${width}px` : width || 'auto',
    maxWidth: '100%',
    aspectRatio: useFill ? aspect : undefined,
    ...style,
  };

  return (
    <Wrapper className={wrapperClass}>
      <span
        className={`relative overflow-hidden ${className}`.trim()}
        style={wrapperStyle}
      >
        {useNativeImg ? (
          <img
            src={normalizedSrc}
            alt={alt}
            style={{ width: 'auto', height: 'auto', maxWidth: '100%', objectFit: 'contain' }}
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
      </span>
      {caption ? (
        <figcaption className="mt-2 text-sm text-slate-600 dark:text-slate-400">{caption}</figcaption>
      ) : null}
    </Wrapper>
  );
}
