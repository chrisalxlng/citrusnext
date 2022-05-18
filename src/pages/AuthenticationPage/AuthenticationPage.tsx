import { useAuth } from '@citrus/hooks';
import {
  Anchor,
  Button,
  Center,
  Container,
  Group,
  Paper,
  PasswordInput,
  Space,
  Text,
  TextInput,
} from '@mantine/core';
import { upperFirst, useFocusTrap, useForm } from '@mantine/hooks';
import { useRouter } from 'next/router';

export enum PageState {
  signIn = 'Sign In',
  register = 'Register',
}

type AuthenticationPageProps = {
  pageState: PageState;
};

export const AuthenticationPage = ({ pageState }: AuthenticationPageProps) => {
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
      sx={(styles) => ({
        height: '100vh',
        backgroundColor: styles.colors.gray[0],
      })}
    >
      <Container size={450} p="xl">
        <Paper radius="md" p="xl" shadow="md" withBorder>
          <Text size="lg" weight={500} align="center">
            {upperFirst(pageState)}
          </Text>
          <Space h={3} />
          <Text color="dimmed" size="sm" align="center">
            {pageState === PageState.register
              ? 'Get started with citrus.'
              : 'Continue right where you left off.'}
          </Text>

          <Space my="xl" />

          <form onSubmit={form.onSubmit(() => {})}>
            <Group direction="column" grow>
              {pageState === PageState.register && (
                <TextInput
                  data-autofocus
                  required
                  label="Name"
                  placeholder="Your name"
                  value={form.values.name}
                  onChange={(event) =>
                    form.setFieldValue('name', event.currentTarget.value)
                  }
                />
              )}

              <TextInput
                data-autofocus
                required
                label="Email"
                placeholder="hello@mantine.dev"
                value={form.values.email}
                onChange={(event) =>
                  form.setFieldValue('email', event.currentTarget.value)
                }
                error={form.errors.email && 'Invalid email'}
              />

              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={form.values.password}
                onChange={(event) =>
                  form.setFieldValue('password', event.currentTarget.value)
                }
                error={
                  form.errors.password &&
                  'Password should include at least 8 characters'
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
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Register"}
              </Anchor>
              <Button
                type="submit"
                onClick={
                  pageState === PageState.register
                    ? () =>
                        register(
                          form.values.name,
                          form.values.email,
                          form.values.password
                        )
                    : () => signIn(form.values.email, form.values.password)
                }
              >
                {upperFirst(pageState)}
              </Button>
            </Group>
          </form>
        </Paper>
      </Container>
    </Center>
  );
};
