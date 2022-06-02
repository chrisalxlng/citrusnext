import { PageLayout } from '@citrus/layouts/pages/PageLayout/PageLayout';
import { Button, Group, Space, Title } from '@mantine/core';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Plus } from 'tabler-icons-react';

type EntityPageLayoutProps = {
  children: ReactNode | ReactNode[];
  title: string;
  button: {
    label: string;
    href: string;
  };
};

export const EntityPageLayout = ({
  children,
  title,
  button,
}: EntityPageLayoutProps) => {
  return (
    <PageLayout title={title}>
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
    </PageLayout>
  );
};
