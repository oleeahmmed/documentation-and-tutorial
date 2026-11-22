import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/odoo/configuration/general-settings/users-companies',
        destination: '/odoo/users-access',
        permanent: true,
      },
      {
        source: '/odoo/configuration/general-settings/users-companies/:path*',
        destination: '/odoo/users-access/:path*',
        permanent: true,
      },
      {
        source: '/odoo/configuration/general-settings',
        destination: '/odoo/general-settings',
        permanent: true,
      },
      {
        source: '/odoo/configuration/general-settings/:path*',
        destination: '/odoo/general-settings/:path*',
        permanent: true,
      },
    ];
  },
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
      {
        source: '/odoo.md',
        destination: '/llms.mdx/odoo.md',
      },
      {
        source: '/odoo/:path*.md',
        destination: '/llms.mdx/odoo/:path*.md',
      },
      {
        source: '/odoo/:path*.txt',
        destination: '/llms.mdx/odoo/:path*.txt',
      },
    ];
  },
};

export default withMDX(config);
