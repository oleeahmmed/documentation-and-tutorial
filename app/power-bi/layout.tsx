import { powerBiSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/power-bi'>) {
  return (
    <DocsLayout tree={powerBiSource.getPageTree()} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
