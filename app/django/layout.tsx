import { djangoSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/django'>) {
  return (
    <DocsLayout tree={djangoSource.getPageTree()} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
