import { ColorSchemeToggle } from '@citrus/core';
import { useAuth } from '@citrus/hooks';
import { LogoIcon, LogoVariants } from '@citrus/icons';
import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  PasswordInput,
  Space,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { upperFirst, useFocusTrap, useForm } from '@mantine/hooks';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export enum PageState {
  signIn = 'Sign In',
  register = 'Register',
}

type AuthenticationPageProps = {
  pageState: PageState;
};

export const AuthenticationPage = ({ pageState }: AuthenticationPageProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const focusTrapRef = useFocusTrap();
  const { register, signIn } = useAuth();

  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
    },

    validationRules: {
      email: (val) => /^\S+@\S+$/.test(val),
      password: (val) => val.length >= 8,
    },
  });

  return (
    <Center
      ref={focusTrapRef}
      sx={(theme) => ({
        height: '100vh',
        position: 'relative',
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[8]
            : theme.colors.gray[0],
      })}
    >
      <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
        <ColorSchemeToggle />
      </Box>
      <Group direction="column" align="center" spacing={0}>
        <UnstyledButton onClick={() => router.push('/')}>
          <LogoIcon variant={LogoVariants.WithTitle} size={36} />
        </UnstyledButton>

        <Container size={450} p="xl">
          <Paper radius="md" p="xl" shadow="md" withBorder>
            <Text size="lg" weight={500} align="center">
              {pageState === PageState.register
                ? t('pages.authentication.register.title')
                : t('pages.authentication.login.title')}
            </Text>
            <Space h={3} />
            <Text color="dimmed" size="sm" align="center">
              {pageState === PageState.register
                ? t('pages.authentication.register.card_title')
                : t('pages.authentication.login.card_title')}
            </Text>

            <Space my="xl" />

            <form
              onSubmit={form.onSubmit((values) =>
                pageState === PageState.register
                  ? register(values.name, values.email, values.password)
                  : signIn(values.email, values.password)
              )}
            >
              <Group direction="column" grow>
                {pageState === PageState.register && (
                  <TextInput
                    data-autofocus
                    required
                    label={t('common.form.inputs.name.label')}
                    placeholder={t('common.form.inputs.name.placeholder')}
                    value={form.values.name}
                    onChange={(event) =>
                      form.setFieldValue('name', event.currentTarget.value)
                    }
                  />
                )}

                <TextInput
                  data-autofocus
                  required
                  label={t('common.form.inputs.email.label')}
                  placeholder={t('common.form.inputs.email.placeholder')}
                  value={form.values.email}
                  onChange={(event) =>
                    form.setFieldValue('email', event.currentTarget.value)
                  }
                  error={
                    form.errors.email && t('common.form.errors.invalid_email')
                  }
                />

                <PasswordInput
                  required
                  label={t('pages.authentication.form.password.label')}
                  placeholder={t(
                    'pages.authentication.form.password.placeholder'
                  )}
                  value={form.values.password}
                  onChange={(event) =>
                    form.setFieldValue('password', event.currentTarget.value)
                  }
                  error={
                    form.errors.password &&
                    t('common.form.errors.password_length')
                  }
                />
              </Group>

              <Group position="apart" mt="xl" spacing={50}>
                <Anchor
                  component="button"
                  type="button"
                  color="gray"
                  onClick={() =>
                    pageState === PageState.register
                      ? router.replace('/sign-in')
                      : router.replace('/register')
                  }
                  size="xs"
                >
                  {pageState === PageState.register
                    ? t('pages.authentication.login.link')
                    : t('pages.authentication.register.link')}
                </Anchor>
                <Button type="submit">{upperFirst(pageState)}</Button>
              </Group>
            </form>
          </Paper>
        </Container>
      </Group>
    </Center>
  );
};
