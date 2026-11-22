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
    ];
  },
};

export default withMDX(config);
