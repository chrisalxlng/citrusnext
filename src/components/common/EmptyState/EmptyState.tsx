import { Center, Group, Text, Title, TitleOrder } from '@mantine/core';

type EmptyStateProps = {
  title: string;
  subtitle: string;
  button: JSX.Element;
  order?: TitleOrder;
};

export const EmptyState = ({
  title,
  subtitle,
  button: Button,
  order = 1,
}: EmptyStateProps) => {
  return (
    <Center sx={{ height: '100%', width: '100%' }}>
      <Group
        direction="column"
        align="center"
        spacing={50}
        grow
        sx={{ width: '100%' }}
      >
        <Group direction="column" align="center">
          <Title order={order}>{title}</Title>
          <Text
            size={order <= 1 ? 'md' : order <= 3 ? 'sm' : 'xs'}
            color="dimmed"
          >
            {subtitle}
          </Text>
        </Group>
        {Button}
      </Group>
    </Center>
  );
};
