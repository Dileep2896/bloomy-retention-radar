import { it, expect } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RepositoryProvider } from '../src/data/RepositoryProvider';
import { MemoryRetentionRepository } from '../src/data/memoryRepo';
import { App } from '../src/App';
function setup(path = '/radar') {
  const repo = new MemoryRetentionRepository();
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <RepositoryProvider repository={repo}>
        <MemoryRouter
          initialEntries={[path]}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <App />
        </MemoryRouter>
      </RepositoryProvider>
    </QueryClientProvider>,
  );
  return { repo, client, user: userEvent.setup() };
}
it('renders the class gauge and at least three groups', async () => {
  setup();
  expect(await screen.findByLabelText('Class retention: 61%')).toBeInTheDocument();
  expect(screen.getAllByTestId('group-card').length).toBeGreaterThanOrEqual(3);
});
it('opens a group, submits an Echo, and invalidates query data', async () => {
  const { user, client } = setup();
  await screen.findByLabelText('Class retention: 61%');
  await user.click(screen.getAllByRole('button', { name: /View group/ })[0]);
  const row = await screen.findByTestId('student-row-student-1');
  await user.click(within(row).getByRole('button', { name: 'Run Echo check' }));
  const dialog = await screen.findByRole('dialog');
  expect(within(dialog).queryByText(/tutor|hint|AI help/i)).not.toBeInTheDocument();
  const questions = within(dialog).getAllByRole('group');
  for (const q of questions) await user.click(within(q).getAllByRole('radio')[0]);
  await user.click(within(dialog).getByRole('button', { name: 'Submit Echo check' }));
  expect(await within(dialog).findByText('3 / 3')).toBeInTheDocument();
  await waitFor(() => expect(screen.getByLabelText('Class retention: 63%')).toBeInTheDocument());
  expect(client.getQueryState(['radar', 'period-3'])?.isInvalidated).toBe(false);
});
it('scripted checks update the gauge without navigation', async () => {
  const { user } = setup();
  await screen.findByLabelText('Class retention: 61%');
  await user.click(screen.getByRole('button', { name: /Run suggested checks/ }));
  expect(await screen.findByLabelText('Class retention: 84%')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Retention Radar' })).toBeInTheDocument();
});
it('student route shows review dates and retention history', async () => {
  setup('/radar/student/student-1');
  expect(await screen.findByRole('heading', { name: 'Destiny G.' })).toBeInTheDocument();
  expect(screen.getAllByText(/Mastery check passed/).length).toBeGreaterThan(0);
  expect(screen.getAllByLabelText(/Retention history/).length).toBeGreaterThan(0);
});
it('story has every section and final metric with reduced motion', async () => {
  setup('/story');
  for (const name of [
    'Mastered isn’t forever.',
    'How mastery learning works.',
    'But memory keeps moving.',
    'A signal worth building.',
    'From a count to a clear next step.',
    'Small checks. Lasting learning.',
    'Keep the learning with them.',
  ]) {
    expect(await screen.findByRole('heading', { name })).toBeInTheDocument();
  }
  expect(screen.getByLabelText('Class retention: 84%')).toHaveTextContent('84%');
  expect(screen.getByTestId('story-page')).toHaveAttribute('data-reduced-motion', 'true');
});
it('unknown student gives a helpful recovery link', async () => {
  setup('/radar/student/missing');
  expect(await screen.findByText('Student not found')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Back to Radar' })).toHaveAttribute('href', '/radar');
});
