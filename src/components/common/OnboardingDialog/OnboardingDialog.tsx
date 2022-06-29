import { ModalObject } from '@citrus/hooks';
import { Button, Dialog, Group, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Link from 'next/link';

type OnboardingDialogProps = {
  dialog: ModalObject;
  visible: boolean;
  title: string;
  description: string;
  button: {
    label: string;
    href: string;
  };
};

export const OnboardingDialog = ({
  dialog,
  visible,
  title,
  description,
  button,
}: OnboardingDialogProps) => {
  const largerThanBreakpoint = useMediaQuery(`(min-width: 500px)`);

  return (
    <Dialog
      opened={visible && dialog.opened}
      withCloseButton
      onClose={dialog.close}
      size={largerThanBreakpoint ? 'lg' : 'md'}
      radius="md"
    >
      <Text size="md" style={{ marginBottom: 10 }} weight={500}>
        {title}
      </Text>

      <Group align="flex-end">
        <Text color="dimmed" size="sm" sx={{ flex: 1 }}>
          {description}
        </Text>
        <Link href={button.href} passHref>
          <Button component="a" onClick={() => dialog.close()}>
            {button.label}
          </Button>
        </Link>
      </Group>
    </Dialog>
  );
};
