import { pythonBasicSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/python-basic'>) {
  return (
    <DocsLayout tree={pythonBasicSource.getPageTree()} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
