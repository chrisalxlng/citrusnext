import { Card, ConfirmModal } from '@citrus/core';
import { useAuth, useModal } from '@citrus/hooks';
import { PageLayout } from '@citrus/layouts';
import { Button, Container, Group, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';

export const AccountPage = () => {
  const title = 'Account';
  const { currentUser, updateUser, deleteUser } = useAuth();
  const [modal, openModal] = useModal();
  const form = useForm({
    initialValues: {
      name: currentUser?.name,
      email: currentUser?.email,
    },

    validationRules: {
      email: (val) => /^\S+@\S+$/.test(val),
    },
  });

  return (
    <PageLayout title={title}>
      <ConfirmModal
        modal={modal}
        title="Are you absolutely sure?"
        text="You will be signed out and your account will be deleted permanently."
        confirmText={currentUser?.name}
        action={deleteUser}
      />
      <Container size={800}>
        <Group direction="column" spacing={50} pb="xl">
          <Group
            position="apart"
            direction="row"
            align="flex-start"
            spacing="xl"
            sx={{ width: '100%' }}
          >
            <Group
              direction="column"
              sx={{ flex: '1 1', minWidth: 230 }}
              py="md"
            >
              <Text weight={500} size="lg">
                Your Profile
              </Text>
              <Text color="dimmed" size="sm">
                Your name will only be exposed to yourself. <br />
                Your email address serves as the primary contact option and is
                used to sign into citrus.
              </Text>
            </Group>
            <Card p="xl" sx={{ flex: '1 1', minWidth: 230 }}>
              <form
                onSubmit={form.onSubmit((values) =>
                  updateUser(values.name, values.email)
                )}
              >
                <Group direction="column">
                  <TextInput
                    required
                    variant="filled"
                    label="Name"
                    placeholder="John"
                    value={form.values.name}
                    onChange={(event) =>
                      form.setFieldValue('name', event.currentTarget.value)
                    }
                    sx={{ width: '100%' }}
                  />
                  <TextInput
                    required
                    variant="filled"
                    label="Email"
                    placeholder="john.doe@mail.com"
                    value={form.values.email}
                    onChange={(event) =>
                      form.setFieldValue('email', event.currentTarget.value)
                    }
                    error={form.errors.email && 'Invalid email'}
                    sx={{ width: '100%' }}
                  />
                  <Button mt="sm" type="submit">
                    Save
                  </Button>
                </Group>
              </form>
            </Card>
          </Group>

          <Group
            position="apart"
            direction="row"
            align="flex-start"
            spacing="xl"
            sx={{ width: '100%' }}
          >
            <Group
              direction="column"
              sx={{ flex: '1 1', minWidth: 230 }}
              py="md"
            >
              <Text weight={500} size="lg">
                Your Account
              </Text>
              <Text color="dimmed" size="sm">
                Manage your citrus account.
              </Text>
            </Group>
            <Card p="xl" sx={{ flex: '1 1', minWidth: 230 }}>
              <Group direction="column">
                <Text size="sm">
                  Deleting your account is permanent and irreversible.
                </Text>
                <Button mt="sm" color="red" variant="light" onClick={openModal}>
                  Delete account
                </Button>
              </Group>
            </Card>
          </Group>
        </Group>
      </Container>
    </PageLayout>
  );
};
