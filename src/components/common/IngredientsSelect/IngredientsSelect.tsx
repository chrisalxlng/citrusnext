import { FoodIcon } from '@citrus/icons';
import { Ingredient } from '@citrus/types';
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Space,
  Table,
  Text,
  UnstyledButton,
  useMantineColorScheme,
} from '@mantine/core';
import { Plus, Trash } from 'tabler-icons-react';
import { EmptyState } from '../EmptyState/EmptyState';

type IngredientsSelectProps = {
  ingredients: Ingredient[];
};

export const IngredientsSelect = ({ ingredients }: IngredientsSelectProps) => {
  const { colorScheme } = useMantineColorScheme();
  const isDarkTheme = colorScheme === 'dark';

  const rows = ingredients.map((ing, index) => (
    <tr key={ing.grocery.id}>
      <td
        style={{
          paddingTop: index === 0 && 0,
          paddingBottom: index === ingredients.length - 1 && 0,
        }}
      >
        <UnstyledButton
          sx={(theme) => ({
            width: '100%',
            borderRadius: theme.radius.md,
            padding: 7,
            color:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[0]
                : theme.colors.gray[7],

            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[5]
                  : theme.colors.gray[0],
            },
          })}
        >
          <Group noWrap>
            <Group noWrap align="center" sx={{ flexGrow: 1 }}>
              <FoodIcon id={ing.grocery.iconId} size={24} />
              <Box sx={{ maxWidth: '150px' }}>
                <Text
                  size="sm"
                  weight={500}
                  sx={{ overflow: 'clip', textOverflow: 'ellipsis' }}
                >
                  {ing.grocery.title}
                </Text>
                <Text
                  size="xs"
                  color="dimmed"
                  sx={{ overflow: 'clip', textOverflow: 'ellipsis' }}
                >
                  {`${ing.quantity} ${ing.grocery.unit} • ${ing.grocery.calories} kcal`}
                </Text>
              </Box>
            </Group>
            <ActionIcon
              size={36}
              color="red"
              sx={(theme) => ({
                '&:hover': {
                  backgroundColor: isDarkTheme
                    ? theme.colors.red[8]
                    : theme.colors.red[1],
                },
              })}
            >
              <Trash size={16} />
            </ActionIcon>
          </Group>
        </UnstyledButton>
      </td>
    </tr>
  ));

  return (
    <>
      {ingredients.length === 0 ? (
        <EmptyState
          order={3}
          title="No Ingredients"
          subtitle="Add an ingredient to get started."
          button={
            <Button variant="outline" leftIcon={<Plus size={16} />} fullWidth>
              Add Ingredient
            </Button>
          }
        />
      ) : (
        <>
          <Box
            sx={{
              maxHeight: '250px',
              overflow: 'auto',
              marginRight: -18,
            }}
          >
            <Box sx={{ paddingRight: 18 }}>
              <Table verticalSpacing="xs" horizontalSpacing={0}>
                <tbody>{rows}</tbody>
              </Table>
            </Box>
          </Box>
          <Space h={20} />
          <Button variant="outline" leftIcon={<Plus size={16} />} fullWidth>
            Add Ingredient
          </Button>
        </>
      )}
    </>
  );
};
