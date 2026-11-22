import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/docs/:path*.md',
        destination: '/llms.mdx/docs/:path*.md',
      },
      {
        source: '/docs/:path*.txt',
        destination: '/llms.mdx/docs/:path*.txt',
      },
      {
        source: '/python-basic.md',
        destination: '/llms.mdx/python-basic.md',
      },
      {
        source: '/python-basic/:path*.md',
        destination: '/llms.mdx/python-basic/:path*.md',
      },
      {
        source: '/python-basic/:path*.txt',
        destination: '/llms.mdx/python-basic/:path*.txt',
      },
      {
        source: '/prompt-master.md',
        destination: '/llms.mdx/prompt-master.md',
      },
      {
        source: '/prompt-master/:path*.md',
        destination: '/llms.mdx/prompt-master/:path*.md',
      },
      {
        source: '/prompt-master/:path*.txt',
        destination: '/llms.mdx/prompt-master/:path*.txt',
      },
      {
        source: '/django.md',
        destination: '/llms.mdx/django.md',
      },
      {
        source: '/django/:path*.md',
        destination: '/llms.mdx/django/:path*.md',
      },
      {
        source: '/django/:path*.txt',
        destination: '/llms.mdx/django/:path*.txt',
      },
    ];
  },
};

export default withMDX(config);
