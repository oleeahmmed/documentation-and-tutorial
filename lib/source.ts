import { llms, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsRoute } from './shared';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

const pythonBasicDocs = defineDocs({
  dir: 'content/python-basic',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

const promptMasterDocs = defineDocs({
  dir: 'content/prompt-master',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const pythonBasicSource = loader({
  baseUrl: '/python-basic',
  source: pythonBasicDocs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const promptMasterSource = loader({
  baseUrl: '/prompt-master',
  source: promptMasterDocs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
});

export const pythonBasicLlms = llms(pythonBasicSource, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
});

export const promptMasterLlms = llms(promptMasterSource, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
});
