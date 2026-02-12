import { render, RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { ReactElement } from 'react'

// Add providers here as needed (e.g., ThemeProvider, QueryClientProvider)
interface ProvidersProps {
  children: React.ReactNode
}

function Providers({ children }: ProvidersProps) {
  return <>{children}</>
}

// Custom render function that wraps components with providers
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: Providers, ...options }),
  }
}

// Re-export everything from testing-library
export * from '@testing-library/react'

// Override render with custom render
export { customRender as render }

// ============================================
// Mock Data Factories
// ============================================

export const mockFactories = {
  advisor: (overrides = {}) => ({
    id: crypto.randomUUID(),
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '0412 345 678',
    firm: 'Smith Financial Services',
    afslNumber: 'AFSL 123456',
    specialties: ['Retirement Planning', 'Superannuation'],
    rating: 4.8,
    reviewCount: 24,
    verified: true,
    createdAt: new Date().toISOString(),
    ...overrides,
  }),

  user: (overrides = {}) => ({
    id: crypto.randomUUID(),
    email: 'user@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
    role: 'consumer' as const,
    createdAt: new Date().toISOString(),
    ...overrides,
  }),

  message: (overrides = {}) => ({
    id: crypto.randomUUID(),
    senderId: crypto.randomUUID(),
    receiverId: crypto.randomUUID(),
    content: 'Hello, I would like to discuss my financial planning needs.',
    read: false,
    createdAt: new Date().toISOString(),
    ...overrides,
  }),
}
