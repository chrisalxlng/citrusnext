import {
  ActionIcon,
  Box,
  Center,
  Dialog,
  Group,
  Input as MantineInput,
  InputVariant,
  InputWrapper,
  Popover,
  Space,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useClickOutside, useHotkeys, useMediaQuery } from '@mantine/hooks';
import {
  CSSProperties,
  memo,
  MemoExoticComponent,
  MutableRefObject,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FixedSizeList as WindowedList, areEqual } from 'react-window';

type ValueType = string | number;

type Item<Value> = { icon: ReactNode; value: Value };

type IconSelectProps<Value extends ValueType> = {
  required?: boolean;
  label?: string;
  variant?: InputVariant;
  data: Item<Value>[];
  value: Value;
  cols?: number;
  rows?: number;
  preloadedRows?: number;
  onChange: (value: Value) => void;
};

type RowProps = {
  index: number;
  style: CSSProperties;
  data: { itemsRef: MutableRefObject<HTMLButtonElement[]> };
};

export const IconSelect = <Value extends ValueType>({
  label = 'Icon',
  variant = 'default',
  data,
  value,
  cols = 5,
  rows = 4,
  preloadedRows = 3,
  required = false,
  onChange,
}: IconSelectProps<Value>) => {
  const [pickerOpened, setPickerOpened] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item<Value>>(
    data.find((item) => item.value === value)
  );

  const isPhoneDevice = useMediaQuery('(hover: none) and (max-width: 500px)');
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const clickOutsideRef = useClickOutside(() => setPickerOpened(false));
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);

  useHotkeys([['K', () => console.log(document.activeElement)]]);

  const getNextWindowItem = (
    itemIdx: number,
    itemsRefList: MutableRefObject<HTMLButtonElement[]>,
    event: KeyboardEvent
  ): number => {
    if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(event.key))
      event.preventDefault();
    switch (event.key) {
      case 'ArrowLeft':
        if (!(itemIdx === 0)) return itemIdx - 1;
        else return null;
      case 'ArrowUp':
        if (!(itemIdx - 5 < 0)) return itemIdx - 5;
        else return null;
      case 'ArrowRight':
        if (!(itemIdx === itemsRefList.current.length - 1)) return itemIdx + 1;
        else return null;
      case 'ArrowDown':
        if (!(itemIdx + 5 > itemsRef.current.length - 1)) return itemIdx + 5;
        else return null;
    }
  };

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, data.length);
  }, [data]);

  useEffect(() => {
    const newSelectedItem: Item<Value> = data.find(
      (item) => item.value === value
    );
    setSelectedItem(newSelectedItem);
  }, [value]);

  useEffect(() => {
    onChange(selectedItem.value);
    setPickerOpened(false);
    const element: HTMLElement = document.querySelector(
      '.mantine-UnstyledButton-root'
    );
    element.focus();
  }, [selectedItem]);

  const Input: JSX.Element = (
    <InputWrapper label={label} required={required}>
      <MantineInput
        className="picker-input"
        variant={variant}
        component="div"
        sx={{
          '.mantine-Input-input': {
            padding: 0,
            border: 'none',
            width: 36,
          },
        }}
      >
        <UnstyledButton
          p={6}
          onClick={() => setPickerOpened(!pickerOpened)}
          sx={{ width: 36, height: 36, borderRadius: 4 }}
        >
          {selectedItem.icon}
        </UnstyledButton>
      </MantineInput>
    </InputWrapper>
  );

  const Row: MemoExoticComponent<any> = memo(
    ({ index: row, style, data: listData }: RowProps) => (
      <Group style={style} py={8} pl={15} spacing={isPhoneDevice && 32}>
        {data
          .filter((_, index) => row * cols <= index && index < (row + 1) * cols)
          .map((item, index) => (
            <ActionIcon
              key={index}
              ref={(element: HTMLButtonElement) =>
                (listData.itemsRef.current[row * cols + index] = element)
              }
              onKeyDown={(event) =>
                listData.itemsRef.current[
                  getNextWindowItem(
                    row * cols + index,
                    listData.itemsRef,
                    event
                  )
                ]?.focus()
              }
              size={36}
              onClick={() => setSelectedItem(item)}
            >
              <Center>{item.icon}</Center>
            </ActionIcon>
          ))}
      </Group>
    ),
    areEqual
  );

  const List: JSX.Element = (
    <Box
      my={-8}
      mt={isPhoneDevice && 10}
      sx={isPhoneDevice && { display: 'flex', justifyContent: 'center' }}
    >
      {pickerOpened ? (
        <WindowedList
          style={{ marginLeft: -15, marginRight: -15 }}
          height={36 * rows + (rows - 1) * 16 + 16}
          width={isPhoneDevice ? '100%' : 36 * cols + 16 * (cols - 1) + 15 + 15}
          itemCount={Math.ceil(data.length / cols)}
          itemSize={36 + 16}
          overscanCount={preloadedRows}
          itemData={{ itemsRef }}
        >
          {Row}
        </WindowedList>
      ) : (
        <Space
          sx={{
            marginLeft: -15,
            marginRight: -15,
            width: isPhoneDevice ? '100%' : 36 * cols + 16 * (cols - 1) + 15,
            height: 36 * rows + (rows - 1) * 16 + 16,
          }}
        />
      )}
    </Box>
  );

  return isPhoneDevice ? (
    <>
      {Input}
      <Dialog
        ref={clickOutsideRef}
        opened={pickerOpened}
        position={{ bottom: 0, right: 0 }}
        onClose={() => setPickerOpened(false)}
        transition="slide-up"
        style={{
          width: '100vw',
          borderRadius: `${theme.radius.xl}px ${theme.radius.xl}px 0 0`,
        }}
      >
        {List}
      </Dialog>
    </>
  ) : (
    <Popover
      opened={pickerOpened}
      onClose={() => setPickerOpened(false)}
      target={Input}
      position="bottom"
      withArrow
      transition="pop"
      sx={{ maxWidth: 300 }}
      styles={
        colorScheme === 'dark' && {
          body: { borderColor: theme.colors.dark[5] },
          arrow: { borderColor: theme.colors.dark[5] },
        }
      }
    >
      {List}
    </Popover>
  );
};
