import { HEADER_HEIGHT } from '@citrus/constants';
import { Tooltip } from '@citrus/core';
import { ActionIcon, Button, Group, Header, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import { X } from 'tabler-icons-react';

type AppCloseHeaderProps = {
  title?: string;
};

export const AppCloseHeader = ({ title = null }: AppCloseHeaderProps) => {
  const router = useRouter();

  return (
    <Header height={HEADER_HEIGHT} px="md">
      <Group position="apart" sx={{ height: '100%' }}>
        <Group>
          <Tooltip label="Close" withArrow>
            <ActionIcon size="lg" onClick={router.back}>
              <X />
            </ActionIcon>
          </Tooltip>
          {title && <Text weight={500}>{title}</Text>}
        </Group>
        <Button>Save</Button>
      </Group>
    </Header>
  );
};
