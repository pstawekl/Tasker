'use  client';

import { useEffect, useState } from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar, NavItem, UncontrolledDropdown } from 'reactstrap';

import AnchorLink from './AnchorLink';
import PageLink from './PageLink';

import { auth } from '@/app/firebaseConfig';
import Logo from '@/public/logo.webp';
import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import { Button } from './ui/button';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Nie renderuj wrażliwych elementów przed montażem komponentu
  if (!isMounted) {
    return <div className="nav-container" data-testid="navbar"></div>;
  }

  return (
    <div className="nav-container" data-testid="navbar">
      <Navbar color="light" light expand="sm">
        <div className="navbar-container-inner d-flex flex-row justify-between w-100 mx-[10%]">
          <Image src={Logo} alt="Logo" width={40} height={40} />
          <Nav className="mr-auto" navbar data-testid="navbar-items"></Nav>
          <Nav className="d-none d-md-block" navbar>
            {!isLoading && !user && (
              <NavItem id="qsLoginBtn" className="flex gap-2">
                <AnchorLink href="/login" tabIndex={0} testId="navbar-login-mobile">
                  <Button variant="black">Zaloguj</Button>
                </AnchorLink>
                <AnchorLink href="/register" tabIndex={0} testId="navbar-login-mobile">
                  <Button variant="outline">Zarejestruj</Button>
                </AnchorLink>
              </NavItem>
            )}
            {user && (
              <UncontrolledDropdown nav inNavbar data-testid="navbar-menu-desktop">
                <DropdownToggle nav id="profileDropDown">
                  <img
                    src={user.picture}
                    alt="Profile"
                    className="nav-user-profile rounded-circle"
                    width="40"
                    height="40"
                    decode="async"
                    data-testid="navbar-picture-desktop"
                  />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem header data-testid="navbar-user-desktop">
                    {user.nickname}
                  </DropdownItem>
                  <DropdownItem className="dropdown-profile" tag="span">
                    <PageLink href="/dashboard/profile" icon="user" testId="navbar-profile-desktop">
                      Profil
                    </PageLink>
                  </DropdownItem>
                  <DropdownItem className="dropdown-profile" tag="span">
                    <PageLink href="/orders" icon="user" testId="navbar-profile-desktop">
                      Moje zamówienia
                    </PageLink>
                  </DropdownItem>
                  <DropdownItem id="qsLogoutBtn">
                    <AnchorLink href="/api/auth/logout" icon="power-off" testId="navbar-logout-desktop">
                      Wyloguj
                    </AnchorLink>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            )}
          </Nav>
        </div>
      </Navbar>
    </div>
  );
};

export default NavBar;
