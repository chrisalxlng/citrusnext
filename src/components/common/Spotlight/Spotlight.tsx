import { Search } from 'tabler-icons-react';
import { SpotlightAction, SpotlightProvider } from '@mantine/spotlight';
import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { navItems } from '@citrus/layouts';
import { useTranslation } from 'next-i18next';
import { useMediaQuery } from '@mantine/hooks';

type SpotlightProps = {
  children: ReactNode[] | ReactNode;
  disableMainActions?: boolean;
  customActions?: SpotlightAction[];
};

export const Spotlight = ({
  children,
  disableMainActions = false,
  customActions = null,
}: SpotlightProps) => {
  const { t } = useTranslation();
  const { push } = useRouter();
  const largerThanBreakpoint = useMediaQuery(`(min-width: 500px)`);

  const mainActions: SpotlightAction[] = navItems.map(
    ({ label, description, href, icon: Icon }) => ({
      id: href,
      title: t(label),
      description: description,
      onTrigger: () => push(`/app${href}`),
      icon: <Icon size={18} />,
    })
  );

  return (
    <SpotlightProvider
      actions={
        disableMainActions
          ? customActions ?? []
          : customActions
          ? customActions.concat(mainActions)
          : mainActions
      }
      searchIcon={<Search size={18} />}
      searchPlaceholder={t('spotlight.search')}
      shortcut="mod + K"
      nothingFoundMessage={t('spotlight.no_results')}
      transitionDuration={300}
      transition="slide-down"
      topOffset={largerThanBreakpoint ? 100 : 0}
    >
      {children}
    </SpotlightProvider>
  );
};
