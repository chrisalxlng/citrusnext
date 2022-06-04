import { HEADER_HEIGHT } from '@citrus/constants';
import { Tooltip } from '@citrus/core';
import { ActionIcon, Group, Header, Text } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { X } from 'tabler-icons-react';

type AppCloseHeaderProps = {
  title?: string;
  submitButton?: JSX.Element;
};

export const AppCloseHeader = ({
  title = null,
  submitButton = null,
}: AppCloseHeaderProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  useHotkeys([['Escape', () => router.back()]]);

  return (
    <Header height={HEADER_HEIGHT} px="md">
      <Group position="apart" noWrap sx={{ height: '100%' }}>
        <Group noWrap>
          <Tooltip label={t('tooltip.close')} withArrow>
            <ActionIcon size="lg" onClick={router.back}>
              <X />
            </ActionIcon>
          </Tooltip>
          {title && (
            <Text weight={500} lineClamp={1}>
              {title}
            </Text>
          )}
        </Group>
        {submitButton}
      </Group>
    </Header>
  );
};
