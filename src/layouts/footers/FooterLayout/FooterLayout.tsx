import { Box, Container, Divider, Text } from '@mantine/core';

export const FooterLayout = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box px={20}>
      <Divider />
      <Container p="xl" sx={{ maxWidth: '100%' }}>
        <Text size="xs">&copy; {currentYear} Christopher Lang</Text>
      </Container>
    </Box>
  );
};
