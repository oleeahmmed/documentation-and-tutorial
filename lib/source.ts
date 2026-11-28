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

const djangoDocs = defineDocs({
  dir: 'content/django',
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

const odooDocs = defineDocs({
  dir: 'content/odoo',
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

const fastapiDocs = defineDocs({
  dir: 'content/fastapi',
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

const powerBiDocs = defineDocs({
  dir: 'content/power-bi',
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

const langgraphDocs = defineDocs({
  dir: 'content/langgraph',
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

const landDocs = defineDocs({
  dir: 'content/land',
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

export const djangoSource = loader({
  baseUrl: '/django',
  source: djangoDocs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const odooSource = loader({
  baseUrl: '/odoo',
  source: odooDocs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const fastapiSource = loader({
  baseUrl: '/fastapi',
  source: fastapiDocs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const powerBiSource = loader({
  baseUrl: '/power-bi',
  source: powerBiDocs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const langgraphSource = loader({
  baseUrl: '/langgraph',
  source: langgraphDocs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const landSource = loader({
  baseUrl: '/land',
  source: landDocs.toFumadocsSource(),
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

export const djangoLlms = llms(djangoSource, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
});

export const odooLlms = llms(odooSource, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
});

export const fastapiLlms = llms(fastapiSource, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
});

export const powerBiLlms = llms(powerBiSource, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
});

export const langgraphLlms = llms(langgraphSource, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
});

export const landLlms = llms(landSource, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
});
