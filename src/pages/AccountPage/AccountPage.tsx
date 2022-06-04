import { Card, ConfirmModal } from '@citrus/core';
import { useAuth, useModal } from '@citrus/hooks';
import { PageLayout } from '@citrus/layouts';
import { Button, Container, Group, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useTranslation } from 'next-i18next';

export const AccountPage = () => {
  const { t } = useTranslation('common');
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
    <PageLayout title={t('pages.account.title')}>
      <ConfirmModal
        modal={modal}
        title={t('pages.account.confirm_modal.title')}
        text={t('pages.account.confirm_modal.text')}
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
                {t('pages.account.helper.profile.title')}
              </Text>
              <Text color="dimmed" size="sm">
                {t('pages.account.helper.profile.text')}
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
                    label={t('common.form.inputs.name.label')}
                    placeholder={t('common.form.inputs.name.placeholder')}
                    value={form.values.name}
                    onChange={(event) =>
                      form.setFieldValue('name', event.currentTarget.value)
                    }
                    sx={{ width: '100%' }}
                  />
                  <TextInput
                    required
                    variant="filled"
                    label={t('common.form.inputs.email.label')}
                    placeholder={t('common.form.inputs.email.placeholder')}
                    value={form.values.email}
                    onChange={(event) =>
                      form.setFieldValue('email', event.currentTarget.value)
                    }
                    error={
                      form.errors.email && t('common.form.errors.invalid_email')
                    }
                    sx={{ width: '100%' }}
                  />
                  <Button mt="sm" type="submit">
                    {t('common.actions.save')}
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
                {t('pages.account.helper.account.title')}
              </Text>
              <Text color="dimmed" size="sm">
                {t('pages.account.helper.account.text')}
              </Text>
            </Group>
            <Card p="xl" sx={{ flex: '1 1', minWidth: 230 }}>
              <Group direction="column">
                <Text size="sm">
                  {t('pages.account.helper.account.card_text')}
                </Text>
                <Button mt="sm" color="red" variant="light" onClick={openModal}>
                  {t('pages.account.actions.delete')}
                </Button>
              </Group>
            </Card>
          </Group>
        </Group>
      </Container>
    </PageLayout>
  );
};
