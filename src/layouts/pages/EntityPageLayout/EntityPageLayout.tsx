import { EmptyState } from '@citrus/core';
import { PageLayout } from '@citrus/layouts/pages/PageLayout/PageLayout';
import { Button, Group, Space, Title } from '@mantine/core';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Plus } from 'tabler-icons-react';

type EntityPageLayoutProps = {
  children: ReactNode | ReactNode[];
  title: string;
  disableSpotlightMainActions?: boolean;
  footerKbds?: { label: string; keys: string[] }[];
};

type LoadingProps = {
  children: ReactNode[] | ReactNode;
  loading: boolean;
  title: string;
  button: {
    label: string;
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
  };
};

type BodyProps = {
  children: ReactNode[] | ReactNode;
  loading: boolean;
  emptyState: {
    empty: boolean;
    title: string;
    subtitle: string;
    showBodyTitle?: boolean;
  };
  title: string | ReactNode;
  button: {
    label: string;
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
  };
};

type HeadProps = {
  children: ReactNode[] | ReactNode;
  title: string | ReactNode;
  button: {
    label: string;
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
  };
};

const Head = ({ children, title, button }: HeadProps) => (
  <>
    <Group position="apart">
      {typeof title === 'string' ? <Title order={1}>{title}</Title> : title}
      {button.href ? (
        <Link href={button.href} passHref>
          <Button
            component={button.disabled ? 'button' : 'a'}
            leftIcon={<Plus size={16} />}
            disabled={button.disabled}
          >
            {button.label}
          </Button>
        </Link>
      ) : (
        <Button
          onClick={button.onClick}
          leftIcon={<Plus size={16} />}
          disabled={button.disabled}
        >
          {button.label}
        </Button>
      )}
    </Group>
    <Space h={30} />
    {children}
  </>
);

export const EntityPageLayout = ({
  children,
  title,
  disableSpotlightMainActions = false,
  footerKbds = null,
}: EntityPageLayoutProps) => {
  return (
    <PageLayout
      title={title}
      disableSpotlightMainActions={disableSpotlightMainActions}
      footerKbds={footerKbds}
    >
      {children}
    </PageLayout>
  );
};

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
      <>
        {emptyState.showBodyTitle &&
          (typeof title === 'string' ? (
            <Title order={1}>{title}</Title>
          ) : (
            title
          ))}
        <EmptyState
          title={emptyState.title}
          subtitle={emptyState.subtitle}
          button={
            button.href ? (
              <Link href={button.href} passHref>
                <Button
                  component={button.disabled ? 'button' : 'a'}
                  leftIcon={<Plus size={16} />}
                  disabled={button.disabled}
                >
                  {button.label}
                </Button>
              </Link>
            ) : (
              <Button
                onClick={button.onClick}
                leftIcon={<Plus size={16} />}
                disabled={button.disabled}
              >
                {button.label}
              </Button>
            )
          }
        />
      </>
    ) : (
      <Head title={title} button={button}>
        {children}
      </Head>
    )}
  </>
);

EntityPageLayout.Loading = Loading;
EntityPageLayout.Body = Body;
