import { EmptyState } from '@citrus/core';
import { PageLayout } from '@citrus/layouts/pages/PageLayout/PageLayout';
import { Button, Group, Space, Title } from '@mantine/core';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Plus } from 'tabler-icons-react';

type EntityPageLayoutProps = {
  children: ReactNode | ReactNode[];
  title: string;
};

type LoadingProps = {
  children: ReactNode[] | ReactNode;
  loading: boolean;
  title: string;
  button: {
    label: string;
    href: string;
  };
};

type BodyProps = {
  children: ReactNode[] | ReactNode;
  loading: boolean;
  emptyState: {
    empty: boolean;
    title: string;
    subtitle: string;
  };
  title: string;
  button: {
    label: string;
    href: string;
  };
};

type HeadProps = {
  children: ReactNode[] | ReactNode;
  title: string;
  button: {
    label: string;
    href: string;
  };
};

const Head = ({ children, title, button }: HeadProps) => (
  <>
    <Group position="apart">
      <Title order={1}>{title}</Title>
      <Link href={button.href} passHref>
        <Button component="a" leftIcon={<Plus size={16} />}>
          {button.label}
        </Button>
      </Link>
    </Group>
    <Space h={30} />
    {children}
  </>
);

export const EntityPageLayout = ({
  children,
  title,
}: EntityPageLayoutProps) => <PageLayout title={title}>{children}</PageLayout>;

const Loading = ({ children, loading, title, button }: LoadingProps) => (
  <>
    {loading && (
      <Head title={title} button={button}>
        {children}
      </Head>
    )}
  </>
);

const Body = ({ children, loading, emptyState, title, button }: BodyProps) => (
  <>
    {loading ? null : emptyState.empty ? (
      <EmptyState
        title={emptyState.title}
        subtitle={emptyState.subtitle}
        button={
          <Link href={button.href} passHref>
            <Button component="a" leftIcon={<Plus size={16} />}>
              {button.label}
            </Button>
          </Link>
        }
      />
    ) : (
      <Head title={title} button={button}>
        {children}
      </Head>
    )}
  </>
);

EntityPageLayout.Loading = Loading;
EntityPageLayout.Body = Body;
