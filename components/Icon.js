import * as LucideIcons from 'lucide-react';
import * as SimpleIcons from '@icons-pack/react-simple-icons';

function toPascalCase(value = '') {
  return String(value)
    .trim()
    .replace(/[_\-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

function isIconComponent(value) {
  return (typeof value === 'function' || typeof value === 'object') && value !== null;
}

function resolveSimpleIconName(rawName) {
  const normalized = rawName.replace(/^si[-_]?/i, '');
  const pascalName = toPascalCase(normalized);
  const withPrefix = `Si${pascalName}`;

  if (isIconComponent(SimpleIcons[rawName])) {
    return rawName;
  }

  if (isIconComponent(SimpleIcons[pascalName])) {
    return pascalName;
  }

  if (isIconComponent(SimpleIcons[withPrefix])) {
    return withPrefix;
  }

  return null;
}

function resolveIcon(name = 'info') {
  const rawName = String(name || '').trim();
  const pascalName = toPascalCase(rawName);

  if (isIconComponent(LucideIcons[rawName])) {
    return LucideIcons[rawName];
  }

  if (isIconComponent(LucideIcons[pascalName])) {
    return LucideIcons[pascalName];
  }

  if (isIconComponent(SimpleIcons[rawName])) {
    return SimpleIcons[rawName];
  }

  if (isIconComponent(SimpleIcons[pascalName])) {
    return SimpleIcons[pascalName];
  }

  const simpleIconAlias = resolveSimpleIconName(rawName);
  if (simpleIconAlias && isIconComponent(SimpleIcons[simpleIconAlias])) {
    return SimpleIcons[simpleIconAlias];
  }

  return null;
}

const LOCAL_ICONS = ['github'];

export default function Icon({ name = 'info', size = 18, className = '' }) {
  const lowerName = String(name || '').trim().toLowerCase();
  const ResolvedIcon = resolveIcon(name);

  if (ResolvedIcon) {
    return <ResolvedIcon size={size} className={className} aria-hidden="true" />;
  }

  if (LOCAL_ICONS.includes(lowerName)) {
    return (
      <span
        className={`inline-block ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: 'currentColor',
          maskImage: `url(/icons/${lowerName}.svg)`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskImage: `url(/icons/${lowerName}.svg)`,
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          verticalAlign: 'middle',
        }}
        aria-label={name}
      />
    );
  }

  return <LucideIcons.Info size={size} className={className} aria-hidden="true" />;
}
