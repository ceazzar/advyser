import { zodResolver } from '@hookform/resolvers/zod'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form'
import { Input } from '../input'

// Test wrapper component for react-hook-form integration
interface TestFormProps {
  onSubmit?: (data: { email: string }) => void
  defaultValues?: { email: string }
  showDescription?: boolean
  showMessage?: boolean
  required?: boolean
}

function TestForm({
  onSubmit = () => {},
  defaultValues = { email: '' },
  showDescription = false,
  showMessage = false,
  required = false,
}: TestFormProps) {
  const schema = required
    ? z.object({ email: z.string().min(1, 'Email is required').email('Invalid email') })
    : z.object({ email: z.string() })

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} data-testid="form">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email" {...field} />
              </FormControl>
              {showDescription && (
                <FormDescription>We will never share your email.</FormDescription>
              )}
              {showMessage && <FormMessage />}
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  )
}

describe('Form Components', () => {
  describe('FormField', () => {
    it('renders with label', () => {
      render(<TestForm />)

      expect(screen.getByText('Email')).toBeInTheDocument()
    })

    it('renders input field', () => {
      render(<TestForm />)

      expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()
    })

    it('connects label to input via htmlFor', () => {
      render(<TestForm />)

      const label = screen.getByText('Email')
      const input = screen.getByPlaceholderText('Enter email')

      expect(label).toHaveAttribute('for', input.id)
    })
  })

  describe('FormDescription', () => {
    it('renders helper text', () => {
      render(<TestForm showDescription />)

      expect(screen.getByText('We will never share your email.')).toBeInTheDocument()
    })

    it('has correct data-slot attribute', () => {
      render(<TestForm showDescription />)

      const description = screen.getByText('We will never share your email.')
      expect(description).toHaveAttribute('data-slot', 'form-description')
    })

    it('is associated with input via aria-describedby', () => {
      render(<TestForm showDescription />)

      const input = screen.getByPlaceholderText('Enter email')
      const description = screen.getByText('We will never share your email.')

      expect(input.getAttribute('aria-describedby')).toContain(description.id)
    })
  })

  describe('FormMessage', () => {
    it('shows error messages', async () => {
      const user = userEvent.setup()
      render(<TestForm required showMessage />)

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument()
      })
    })

    it('has role="alert" for accessibility', async () => {
      const user = userEvent.setup()
      render(<TestForm required showMessage />)

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)

      await waitFor(() => {
        const errorMessage = screen.getByRole('alert')
        expect(errorMessage).toBeInTheDocument()
        expect(errorMessage).toHaveTextContent('Email is required')
      })
    })

    it('has correct data-slot attribute', async () => {
      const user = userEvent.setup()
      render(<TestForm required showMessage />)

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)

      await waitFor(() => {
        const errorMessage = screen.getByRole('alert')
        expect(errorMessage).toHaveAttribute('data-slot', 'form-message')
      })
    })

    it('does not render when there is no error', () => {
      render(<TestForm showMessage />)

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  describe('Form integration with react-hook-form', () => {
    it('submits form data correctly', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn()

      render(<TestForm onSubmit={handleSubmit} />)

      const input = screen.getByPlaceholderText('Enter email')
      await user.type(input, 'test@example.com')

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          { email: 'test@example.com' },
          expect.anything()
        )
      })
    })

    it('prevents submission with validation errors', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn()

      render(<TestForm required onSubmit={handleSubmit} showMessage />)

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      expect(handleSubmit).not.toHaveBeenCalled()
    })

    it('clears error when valid input is provided', async () => {
      const user = userEvent.setup()

      render(<TestForm required showMessage />)

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText('Enter email')
      await user.type(input, 'test@example.com')

      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      })
    })
  })

  describe('Required field validation', () => {
    it('shows error for empty required field', async () => {
      const user = userEvent.setup()

      render(<TestForm required showMessage />)

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument()
      })
    })

    it('shows email validation error for invalid email', async () => {
      const user = userEvent.setup()

      render(<TestForm required showMessage />)

      const input = screen.getByPlaceholderText('Enter email')
      await user.type(input, 'invalid-email')

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Invalid email')).toBeInTheDocument()
      })
    })
  })

  describe('Error state styling', () => {
    it('applies error styles to label when field has error', async () => {
      const user = userEvent.setup()

      render(<TestForm required showMessage />)

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)

      await waitFor(() => {
        const label = screen.getByText('Email')
        expect(label).toHaveAttribute('data-error', 'true')
      })
    })

    it('sets aria-invalid on input when field has error', async () => {
      const user = userEvent.setup()

      render(<TestForm required showMessage />)

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)

      await waitFor(() => {
        const input = screen.getByPlaceholderText('Enter email')
        expect(input).toHaveAttribute('aria-invalid', 'true')
      })
    })

    it('updates aria-describedby to include error message', async () => {
      const user = userEvent.setup()

      render(<TestForm required showMessage showDescription />)

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)

      await waitFor(() => {
        const input = screen.getByPlaceholderText('Enter email')
        const errorMessage = screen.getByRole('alert')
        expect(input.getAttribute('aria-describedby')).toContain(errorMessage.id)
      })
    })
  })

  describe('FormItem', () => {
    it('has correct data-slot attribute', () => {
      render(<TestForm />)

      const formItem = document.querySelector('[data-slot="form-item"]')
      expect(formItem).toBeInTheDocument()
    })

    it('applies grid gap styling', () => {
      render(<TestForm />)

      const formItem = document.querySelector('[data-slot="form-item"]')
      expect(formItem).toHaveClass('grid', 'gap-2')
    })
  })

  describe('FormControl', () => {
    it('has correct data-slot attribute', () => {
      render(<TestForm />)

      const formControl = document.querySelector('[data-slot="form-control"]')
      expect(formControl).toBeInTheDocument()
    })
  })

  describe('FormLabel', () => {
    it('has correct data-slot attribute', () => {
      render(<TestForm />)

      const label = screen.getByText('Email')
      expect(label).toHaveAttribute('data-slot', 'form-label')
    })
  })
})
