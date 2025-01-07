import { render, screen, waitFor } from '@testing-library/react';

import Layout from '../../components/Layout';
import { withUserProvider } from '../fixtures';

describe('Layout', () => {
  it('should render without crashing', async () => {
    render(<Layout>Text</Layout>, { wrapper: withUserProvider({ user: undefined }) });

    await waitFor(() => expect(screen.getByTestId('layout')).toBeInTheDocument());
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
