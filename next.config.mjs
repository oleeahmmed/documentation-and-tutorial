import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/docs/project-based/project-1',
        destination: '/docs/project-based/project-1/overview',
        permanent: true,
      },
      {
        source: '/docs/project-based/project-1.md',
        destination: '/docs/project-based/project-1/overview.md',
        permanent: true,
      },
      {
        source: '/docs/project-based/decision-matrix',
        destination: '/docs/project-based/project-1/decision-matrix',
        permanent: true,
      },
      {
        source: '/odoo/:page(server-check|system-setup|postgres-setup|source-clone|venv-setup|config-database|run-odoo|firewall-systemd)',
        destination: '/odoo/installation/:page',
        permanent: true,
      },
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
      {
        source: '/odoo/hrm/preparation',
        destination: '/odoo/hrm',
        permanent: true,
      },
      {
        source: '/odoo/hrm/preparation.md',
        destination: '/odoo/hrm.md',
        permanent: true,
      },
      {
        source: '/odoo/hrm/install',
        destination: '/odoo/installation',
        permanent: true,
      },
      {
        source: '/odoo/hrm/install.md',
        destination: '/odoo/installation.md',
        permanent: true,
      },
      {
        source: '/odoo/hrm/appraisals',
        destination: '/odoo/hrm/recruitment',
        permanent: true,
      },
      {
        source: '/odoo/hrm/appraisals.md',
        destination: '/odoo/hrm/recruitment.md',
        permanent: true,
      },
      {
        source: '/odoo/hrm/fleet',
        destination: '/odoo/hrm/expenses',
        permanent: true,
      },
      {
        source: '/odoo/hrm/fleet.md',
        destination: '/odoo/hrm/expenses.md',
        permanent: true,
      },
      {
        source: '/odoo/hrm/lunch',
        destination: '/odoo/hrm/maintenance',
        permanent: true,
      },
      {
        source: '/odoo/hrm/lunch.md',
        destination: '/odoo/hrm/maintenance.md',
        permanent: true,
      },
      {
        source: '/odoo/hrm/routine',
        destination: '/odoo/hrm/summary',
        permanent: true,
      },
      {
        source: '/odoo/hrm/routine.md',
        destination: '/odoo/hrm/summary.md',
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
      {
        source: '/fastapi.md',
        destination: '/llms.mdx/fastapi.md',
      },
      {
        source: '/fastapi/:path*.md',
        destination: '/llms.mdx/fastapi/:path*.md',
      },
      {
        source: '/fastapi/:path*.txt',
        destination: '/llms.mdx/fastapi/:path*.txt',
      },
      {
        source: '/power-bi.md',
        destination: '/llms.mdx/power-bi.md',
      },
      {
        source: '/power-bi/:path*.md',
        destination: '/llms.mdx/power-bi/:path*.md',
      },
      {
        source: '/power-bi/:path*.txt',
        destination: '/llms.mdx/power-bi/:path*.txt',
      },
      {
        source: '/langgraph.md',
        destination: '/llms.mdx/langgraph.md',
      },
      {
        source: '/langgraph/:path*.md',
        destination: '/llms.mdx/langgraph/:path*.md',
      },
      {
        source: '/langgraph/:path*.txt',
        destination: '/llms.mdx/langgraph/:path*.txt',
      },
      {
        source: '/land.md',
        destination: '/llms.mdx/land.md',
      },
      {
        source: '/land/:path*.md',
        destination: '/llms.mdx/land/:path*.md',
      },
      {
        source: '/land/:path*.txt',
        destination: '/llms.mdx/land/:path*.txt',
      },
    ];
  },
};

export default withMDX(config);
