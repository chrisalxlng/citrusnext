import { useAuth } from '@citrus/hooks';
import { Button, Container, Group } from '@mantine/core';

export const DashboardPage = () => {
  const { currentUser, signOut } = useAuth();

  return (
    <Container p="xl">
      <Group direction="column" spacing="lg" align="center">
        <div>Dashboard</div>
        <div>Hello, {currentUser.name}!</div>
        <Button onClick={signOut}>Sign Out</Button>
      </Group>
    </Container>
  );
};
