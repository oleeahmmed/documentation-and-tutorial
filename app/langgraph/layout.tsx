import { langgraphSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/langgraph'>) {
  return (
    <DocsLayout tree={langgraphSource.getPageTree()} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
