import { useState } from 'react';

export type ModalObject = {
  opened: boolean;
  close: () => void;
};

export const useModal = (): [ModalObject, () => void] => {
  const [opened, setOpened] = useState<boolean>(false);
  const open = () => setOpened(true);
  const close = () => setOpened(false);

  return [{ opened, close }, open];
};
