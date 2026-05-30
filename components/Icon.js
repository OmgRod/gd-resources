import * as LucideIcons from 'lucide-react';

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

const CUSTOM_BRAND_ICONS = {
  discord: ({ size = 18, ...props }) => (
    <svg
      viewBox="0 0 127.14 96.36"
      fill="currentColor"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-block',
        verticalAlign: 'middle',
        color: 'currentColor',
      }}
      {...props}
    >
      <path
        fill="currentColor"
        d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,52.88,6.83,77.19,77.19,0,0,0,49.58,0,105.15,105.15,0,0,0,19.14,8.07C2.81,32.22-1.71,55.76,.55,78.89A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.67-10.86,68.86,68.86,0,0,1-10.51-5c.87-.64,1.72-1.32,2.53-2a75.46,75.46,0,0,0,72.63,0c.81,.7,1.66,1.38,2.53,2a68.86,68.86,0,0,1-10.51,5,77.7,77.7,0,0,0,6.67,10.86,105.73,105.73,0,0,0,31.42-17.47C129.29,50.12,124.3,26.83,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"
      />
    </svg>
  ),
  github: ({ size = 18, ...props }) => (
    <svg 
      role="img" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
      {...props}
    >
      <title>GitHub</title>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  )
};

function resolveSimpleIconAlias(rawName) {
  const cleanName = rawName.replace(/^si[-_]?/i, '').toLowerCase();
  
  const brandMapping = {
    github: 'Github',
    discord: 'Discord',
    twitter: 'Twitter',
    x: 'Twitter',
    youtube: 'Youtube',
    twitch: 'Twitch',
    facebook: 'Facebook',
    instagram: 'Instagram',
    linkedin: 'Linkedin',
    slack: 'Slack',
    dribbble: 'Dribbble',
    figma: 'Figma',
    gitlab: 'Gitlab',
    trello: 'Trello',
    google: 'Chrome',
    steam: 'Gamepad2',
    reddit: 'Smile',
  };

  return brandMapping[cleanName] || toPascalCase(cleanName);
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

  const mappedName = resolveSimpleIconAlias(rawName);
  if (isIconComponent(LucideIcons[mappedName])) {
    return LucideIcons[mappedName];
  }

  const cleanPascalName = toPascalCase(rawName.replace(/^si[-_]?/i, ''));
  if (isIconComponent(LucideIcons[cleanPascalName])) {
    return LucideIcons[cleanPascalName];
  }

  return null;
}

const LOCAL_ICONS = ['github'];

export default function Icon({ name = 'info', size = 18, className = '' }) {
  const lowerName = String(name || '').trim().toLowerCase();
  const cleanBrandName = lowerName.replace(/^si[-_]?/i, '');

  if (CUSTOM_BRAND_ICONS[cleanBrandName]) {
    const CustomBrandIcon = CUSTOM_BRAND_ICONS[cleanBrandName];
    return <CustomBrandIcon size={size} className={className} aria-hidden="true" />;
  }

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
