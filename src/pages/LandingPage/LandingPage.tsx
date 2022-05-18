import { ColorSchemeToggle } from '@citrus/core';
import { Button, Container, Group } from '@mantine/core';
import { useRouter } from 'next/router';

export const LandingPage = () => {
  const router = useRouter();

  return (
    <Container p="xl">
      <Group direction="column" spacing="lg" align="center">
        <div>Landing Page</div>
        <Button onClick={() => router.push('/register')}>Register</Button>
        <Button onClick={() => router.push('/sign-in')}>Sign In</Button>
        <ColorSchemeToggle />
      </Group>
    </Container>
  );
};
