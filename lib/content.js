const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const CONTENT_DIR = path.join(process.cwd(), 'content');

function isMdxFile(fileName) {
  return fileName.endsWith('.mdx') || fileName.endsWith('.md');
}

function walkContentDirectory(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('_')) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walkContentDirectory(fullPath, fileList);
      continue;
    }

    if (entry.isFile() && isMdxFile(entry.name)) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

function toRelativeFilePath(fullPath) {
  return path.relative(CONTENT_DIR, fullPath).replace(/\\/g, '/');
}

function toSlugSegments(relativePath) {
  const noExtension = relativePath.replace(/\.(md|mdx)$/i, '');

  if (noExtension === 'home') {
    return [];
  }

  return noExtension.split('/');
}

function toRoutePath(segments) {
  if (!segments || segments.length === 0) {
    return '/';
  }

  return `/${segments.join('/')}`;
}

function getFilePathFromSlugSegments(slugSegments = []) {
  if (!slugSegments.length) {
    return path.join(CONTENT_DIR, 'home.mdx');
  }

  const base = path.join(CONTENT_DIR, ...slugSegments);
  const mdxPath = `${base}.mdx`;
  const mdPath = `${base}.md`;

  if (fs.existsSync(mdxPath)) {
    return mdxPath;
  }

  if (fs.existsSync(mdPath)) {
    return mdPath;
  }

  return null;
}

function getAllContentFiles() {
  return walkContentDirectory(CONTENT_DIR);
}

function getAllRoutes() {
  return getAllContentFiles().map((fullPath) => {
    const relativePath = toRelativeFilePath(fullPath);
    const slug = toSlugSegments(relativePath);

    return {
      slug,
      route: toRoutePath(slug),
      filePath: fullPath,
      relativePath,
    };
  });
}

function stripMarkdown(value = '') {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[#>*_~\-|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getPageMetaIndex() {
  return getAllRoutes().map((route) => {
    const source = fs.readFileSync(route.filePath, 'utf8');
    const { data, content } = matter(source);

    return {
      title: data.title || route.slug[route.slug.length - 1] || 'Home',
      description: data.description || '',
      route: route.route,
      slug: route.slug,
      excerpt: stripMarkdown(content).slice(0, 240),
      content: stripMarkdown(content),
      relativePath: route.relativePath,
    };
  });
}

function getDirectoryPageMeta(relativeDir, { exclude = ['index'] } = {}) {
  const directory = path.join(CONTENT_DIR, String(relativeDir).replace(/^\/+/, ''));

  if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) {
    return [];
  }

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && isMdxFile(entry.name))
    .map((entry) => ({
      entry,
      baseName: entry.name.replace(/\.(md|mdx)$/i, ''),
    }))
    .filter(({ baseName }) => !exclude.includes(baseName))
    .map(({ entry, baseName }) => {
      const fullPath = path.join(directory, entry.name);
      const relativePath = toRelativeFilePath(fullPath);
      const slug = toSlugSegments(relativePath);
      const route = toRoutePath(slug);
      const source = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(source);

      return {
        title: data.title || baseName || 'Untitled',
        description: data.description || '',
        route,
        relativePath,
        order: data.order ?? null,
        metadata: JSON.parse(JSON.stringify(data)),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
}

function countDirectoryPagesRecursively(relativeDir, { exclude = ['index'] } = {}) {
  const directory = path.join(CONTENT_DIR, String(relativeDir).replace(/^\/+/, ''));
  
  if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) {
    return 0;
  }

  const allFiles = walkContentDirectory(directory);
  
  return allFiles.filter(fullPath => {
    const baseName = path.basename(fullPath).replace(/\.(md|mdx)$/i, '');
    return !exclude.includes(baseName);
  }).length;
}

module.exports = {
  CONTENT_DIR,
  getAllRoutes,
  getFilePathFromSlugSegments,
  getPageMetaIndex,
  getDirectoryPageMeta,
  countDirectoryPagesRecursively,
};
