import { NavbarLink } from '@citrus/core';
import { useAuth } from '@citrus/hooks';
import { Group, Navbar } from '@mantine/core';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';
import {
  Calendar,
  Grill,
  Icon,
  Logout,
  PaperBag,
  UserCircle,
} from 'tabler-icons-react';

type AppDefaultNavbarProps = {
  opened: boolean;
  largerThanBreakpoint: boolean;
  setNavbarOpened: Dispatch<SetStateAction<boolean>>;
};

type NavItem = {
  isMain: boolean;
  icon: Icon;
  label: string;
  href?: string;
  onClick?: () => void;
};

export const AppDefaultNavbar = ({
  opened,
  largerThanBreakpoint,
  setNavbarOpened,
}: AppDefaultNavbarProps) => {
  const router = useRouter();
  const { signOut } = useAuth();

  const items: NavItem[] = [
    { isMain: true, icon: Calendar, label: 'Today', href: '/today' },
    { isMain: true, icon: Grill, label: 'Dishes', href: '/dishes' },
    { isMain: true, icon: PaperBag, label: 'Groceries', href: '/groceries' },
    {
      isMain: false,
      icon: UserCircle,
      label: 'Account',
      href: '/account',
    },
    { isMain: false, icon: Logout, label: 'Sign Out', onClick: signOut },
  ];

  const pathname: string = router.pathname.replace('/app', '');
  const activePath: string = items.find((item) =>
    pathname.startsWith(item.href)
  )?.href;

  return (
    <Navbar
      p="md"
      hidden={!largerThanBreakpoint && !opened}
      width={largerThanBreakpoint ? { base: 80 } : { base: '100%' }}
    >
      <Navbar.Section grow>
        <Group
          direction="column"
          align="center"
          spacing={largerThanBreakpoint ? 0 : 'xs'}
        >
          {items
            .filter((item) => item.isMain)
            .map((link) => (
              <NavbarLink
                {...link}
                key={link.label}
                active={activePath === link?.href}
                onClick={link?.onClick}
                href={link?.href && `/app${link.href}`}
                largerThanBreakpoint={largerThanBreakpoint}
                setNavbarOpened={setNavbarOpened}
              />
            ))}
        </Group>
      </Navbar.Section>
      <Navbar.Section>
        <Group
          direction="column"
          align="center"
          spacing={largerThanBreakpoint ? 0 : 'xs'}
        >
          {items
            .filter((item) => !item.isMain)
            .map((link) => (
              <NavbarLink
                {...link}
                key={link.label}
                active={activePath === link?.href}
                onClick={link?.onClick}
                href={link?.href && `/app${link.href}`}
                largerThanBreakpoint={largerThanBreakpoint}
                setNavbarOpened={setNavbarOpened}
              />
            ))}
        </Group>
      </Navbar.Section>
    </Navbar>
  );
};
