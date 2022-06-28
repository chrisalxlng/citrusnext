import { ActionIcon, Box, Group, Text, Title } from '@mantine/core';
import { Dispatch, SetStateAction } from 'react';
import { ChevronLeft, ChevronRight } from 'tabler-icons-react';
import dayjs from 'dayjs';

type DateControlProps = {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
};

export const DateControl = ({ date, setDate }: DateControlProps) => {
  return (
    <Group spacing={0}>
      <ActionIcon
        size={45}
        onClick={() =>
          setDate((current) => dayjs(current).subtract(1, 'day').toDate())
        }
      >
        <ChevronLeft size={36} />
      </ActionIcon>
      <Box sx={{ width: 220 }}>
        <Title order={1} sx={{ width: '100%', textAlign: 'center' }}>
          {dayjs(date).format('DD MMM YYYY')}
        </Title>
      </Box>
      <ActionIcon
        size={45}
        onClick={() =>
          setDate((current) => dayjs(current).add(1, 'day').toDate())
        }
      >
        <ChevronRight size={36} />
      </ActionIcon>
    </Group>
  );
};
