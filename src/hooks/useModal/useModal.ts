import { useState } from 'react';

export type ModalObject = {
  opened: boolean;
  close: () => void;
};

export type ModalOptions<Type, Data> = {
  data?: Data;
  type?: Type;
};

export const useModal = <Type, Data>(): [
  ModalObject,
  ({ data, type }: ModalOptions<Type, Data>) => void,
  Data,
  Type
] => {
  const [opened, setOpened] = useState<boolean>(false);
  const [data, setData] = useState<Data>(null);
  const [type, setType] = useState<Type>(null);

  const open = ({ data, type }: ModalOptions<Type, Data>) => {
    setData(data);
    setType(type);
    setOpened(true);
  };
  const close = () => setOpened(false);

  return [{ opened, close }, open, data, type];
};
