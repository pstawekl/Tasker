import { UserProvider } from '@auth0/nextjs-auth0/client';
import { render, screen } from '@testing-library/react';

import CSRPage from '../../app/csr/page';

describe('csr', () => {
  it('should render without crashing', async () => {
    render(
      <UserProvider user={{}}>
        <CSRPage />
      </UserProvider>
    );

    expect(screen.getByTestId('csr')).toBeInTheDocument();
    expect(screen.getByTestId('csr-title')).toBeInTheDocument();
    expect(screen.getByTestId('csr-text')).toBeInTheDocument();
  });
});
