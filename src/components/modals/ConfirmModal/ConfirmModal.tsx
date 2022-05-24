import { ModalObject } from '@citrus/hooks';
import { Button, Group, Modal, Space, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';

type ConfirmModalProps = {
  modal: ModalObject;
  title: string;
  text?: string;
  confirmText: string;
  action: () => void;
};

export const ConfirmModal = ({
  modal,
  title,
  text = null,
  confirmText,
  action,
}: ConfirmModalProps) => {
  const { opened, close } = modal;
  const form = useForm({
    initialValues: {
      confirmText: '',
    },
  });

  return (
    <Modal
      opened={opened}
      onClose={() => {
        form.setValues({
          confirmText: '',
        });
        close();
      }}
      centered
      title={<Text weight={500}>{title}</Text>}
    >
      {text && (
        <>
          <Text size="sm">{text}</Text>
          <Space h={20} />
        </>
      )}
      <Text size="sm">
        Please type{' '}
        <Text component="span" size="sm" weight={700}>
          {confirmText}
        </Text>{' '}
        to confirm.
      </Text>
      <Space h={10} />
      <form
        onSubmit={form.onSubmit(() => {
          form.setValues({
            confirmText: '',
          });
          action();
        })}
      >
        <TextInput
          data-autofocus
          value={form.values.confirmText}
          onChange={(event) =>
            form.setFieldValue('confirmText', event.currentTarget.value)
          }
        />
        <Space h={50} />
        <Group position="right">
          <Button
            type="submit"
            color="red"
            variant="light"
            disabled={form.values.confirmText !== confirmText}
          >
            Confirm
          </Button>
        </Group>
      </form>
    </Modal>
  );
};
