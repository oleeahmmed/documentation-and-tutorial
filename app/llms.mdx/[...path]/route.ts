import {
  djangoLlms,
  docsLlms,
  fastapiLlms,
  landLlms,
  langgraphLlms,
  odooLlms,
  powerBiLlms,
  promptMasterLlms,
  pythonBasicLlms,
} from '@/lib/source';

export const revalidate = false;
// other paths are 404s, never cached responses
export const dynamicParams = false;

export async function GET(_req: Request, { params }: RouteContext<'/llms.mdx/[...path]'>) {
  const { path } = await params;
  const url = `/${path.join('/')}`;
  const llms = url.startsWith('/python-basic')
    ? pythonBasicLlms
    : url.startsWith('/prompt-master')
      ? promptMasterLlms
      : url.startsWith('/django')
        ? djangoLlms
        : url.startsWith('/odoo')
          ? odooLlms
          : url.startsWith('/fastapi')
            ? fastapiLlms
            : url.startsWith('/power-bi')
              ? powerBiLlms
              : url.startsWith('/langgraph')
                ? langgraphLlms
                : url.startsWith('/land')
                  ? landLlms
                  : docsLlms;

  return (await llms.serve(url)) ?? new Response(null, { status: 404 });
}

export async function generateStaticParams() {
  const params: { path: string[] }[] = [];
  const files = [
    ...(await docsLlms.files()),
    ...(await pythonBasicLlms.files()),
    ...(await promptMasterLlms.files()),
    ...(await djangoLlms.files()),
    ...(await odooLlms.files()),
    ...(await fastapiLlms.files()),
    ...(await powerBiLlms.files()),
    ...(await langgraphLlms.files()),
    ...(await landLlms.files()),
  ];
  for (const file of files) {
    // `/llms.txt` and `/llms-full.txt` have their own routes
    if (!/^\/llms(-full)?\.txt$/.test(file))
      params.push({ path: decodeURI(file).slice(1).split('/') });
  }
  return params;
}
