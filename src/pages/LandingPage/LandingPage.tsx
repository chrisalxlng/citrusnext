import { UnauthenticatedPageLayout } from '@citrus/layouts';
import {
  Button,
  Container,
  createStyles,
  Group,
  Image,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { Trans, useTranslation } from 'next-i18next';

const BREAKPOINT = '@media (max-width: 755px)';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    boxSizing: 'border-box',
  },

  inner: {
    position: 'relative',
    paddingTop: 100,
    paddingBottom: 160,

    [BREAKPOINT]: {
      paddingBottom: 180,
      paddingTop: 80,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 62,
    fontWeight: 900,
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,

    [BREAKPOINT]: {
      fontSize: 42,
      lineHeight: 1.2,
    },
  },

  description: {
    marginTop: theme.spacing.xl,
    fontSize: 24,

    [BREAKPOINT]: {
      fontSize: 18,
    },
  },

  controls: {
    marginTop: theme.spacing.xl * 2,

    [BREAKPOINT]: {
      marginTop: theme.spacing.xl,
    },
  },

  control: {
    height: 54,
    paddingLeft: 38,
    paddingRight: 38,

    [BREAKPOINT]: {
      height: 54,
      paddingLeft: 18,
      paddingRight: 18,
      flex: 1,
    },
  },

  signInControl: {
    borderWidth: 2,
    borderColor:
      theme.colorScheme === 'dark' ? 'transparent' : theme.colors.dark[9],
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : 'transparent',

    '&:hover': {
      backgroundColor: `${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0]
      } !important`,
    },
  },
}));

export const LandingPage = () => {
  const { t } = useTranslation();
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();

  return (
    <UnauthenticatedPageLayout>
      <div className={classes.wrapper}>
        <Container size={700} className={classes.inner}>
          <h1 className={classes.title}>
            <Trans
              i18nKey="pages.landing.title"
              defaults="A <0>healthier diet</0> by keeping track of your daily meals"
              components={[
                <Text
                  component="span"
                  variant="gradient"
                  gradient={{ from: 'yellow', to: 'orange' }}
                  inherit
                />,
              ]}
            />
          </h1>

          <Text className={classes.description} color="dimmed">
            {t('pages.landing.subtitle')}
          </Text>

          <Group className={classes.controls}>
            <Button
              component="a"
              href="/register"
              size="xl"
              className={classes.control}
              variant="gradient"
              gradient={{ from: 'yellow', to: 'orange' }}
            >
              {t('common.actions.register')}
            </Button>

            <Button
              component="a"
              href="/sign-in"
              size="xl"
              variant="outline"
              className={cx(classes.control, classes.signInControl)}
              color={theme.colorScheme === 'dark' ? 'gray' : 'dark'}
            >
              {t('common.actions.sign_in')}
            </Button>
          </Group>
        </Container>
      </div>
      <Container size={900}>
        <Group
          position="apart"
          direction="row"
          align="flex-start"
          spacing="xl"
          sx={{ width: '100%' }}
        >
          <Group direction="column" sx={{ flex: '1 1', minWidth: 200 }} py="md">
            <Text weight={700} size="xl">
              {t('pages.landing.features.dark_mode.title')}
            </Text>
            <Text color="dimmed" size="sm">
              {t('pages.landing.features.dark_mode.description')}
            </Text>
          </Group>
          <Image
            src="/img/landing_dark_mode.png"
            radius="sm"
            sx={{ maxWidth: 600 }}
          />
        </Group>
        <Group
          position="apart"
          direction="row"
          align="flex-start"
          spacing="xl"
          py={80}
          sx={{ width: '100%' }}
        >
          <Group direction="column" sx={{ flex: '1 1', minWidth: 200 }} py="md">
            <Text weight={700} size="xl">
              {t('pages.landing.features.intuitive_forms.title')}
            </Text>
            <Text color="dimmed" size="sm">
              {t('pages.landing.features.intuitive_forms.description')}
            </Text>
          </Group>
          <Image
            src="/img/landing_update_dish.png"
            radius="sm"
            sx={{ maxWidth: 600 }}
          />
        </Group>
        <Group
          position="apart"
          direction="row"
          align="flex-start"
          spacing="xl"
          py={80}
          sx={{ width: '100%' }}
        >
          <Group direction="column" sx={{ flex: '1 1', minWidth: 200 }} py="md">
            <Text weight={700} size="xl">
              {t('pages.landing.features.mobile_support.title')}
            </Text>
            <Text color="dimmed" size="sm">
              {t('pages.landing.features.mobile_support.description')}
            </Text>
          </Group>
          <Group spacing={50} position="center">
            <Image
              src="/img/landing_groceries_list.png"
              radius="sm"
              sx={{ maxWidth: 250 }}
            />
            <Image
              src="/img/landing_add_grocery.png"
              radius="sm"
              sx={{ maxWidth: 250 }}
            />
          </Group>
        </Group>
      </Container>
    </UnauthenticatedPageLayout>
  );
};
