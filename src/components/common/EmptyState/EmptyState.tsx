import { Center, Group, Text, Title } from '@mantine/core';

type EmptyStateProps = {
  title: string;
  subtitle: string;
  button: JSX.Element;
};

export const EmptyState = ({
  title,
  subtitle,
  button: Button,
}: EmptyStateProps) => {
  return (
    <Center sx={{ height: '100%' }}>
      <Group direction="column" align="center" spacing={50} grow>
        <Group direction="column" align="center">
          <Title order={1}>{title}</Title>
          <Text color="dimmed">{subtitle}</Text>
        </Group>
        {Button}
      </Group>
    </Center>
  );
};
