import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog'

describe('Dialog', () => {
  it('opens when trigger is clicked', async () => {
    const user = userEvent.setup()

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByText('Open Dialog'))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('closes when close button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    await user.click(screen.getByText('Open Dialog'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('closes on escape key', async () => {
    const user = userEvent.setup()

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    await user.click(screen.getByText('Open Dialog'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('renders title and description', async () => {
    const user = userEvent.setup()

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description text</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    await user.click(screen.getByText('Open Dialog'))

    expect(screen.getByText('Dialog Title')).toBeInTheDocument()
    expect(screen.getByText('Dialog description text')).toBeInTheDocument()
  })

  it('has correct ARIA attributes', async () => {
    const user = userEvent.setup()

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
          <DialogDescription>Test description</DialogDescription>
        </DialogContent>
      </Dialog>
    )

    await user.click(screen.getByText('Open Dialog'))

    const dialog = screen.getByRole('dialog')
    // Radix Dialog sets role="dialog" which implicitly indicates modal behavior
    // The dialog should be associated with its title and description
    expect(dialog).toHaveAttribute('aria-labelledby')
    expect(dialog).toHaveAttribute('aria-describedby')

    // Verify the title and description are properly linked
    const titleId = dialog.getAttribute('aria-labelledby')
    const descId = dialog.getAttribute('aria-describedby')
    expect(titleId).toBeTruthy()
    expect(descId).toBeTruthy()
    expect(document.getElementById(titleId!)).toHaveTextContent('Test Dialog')
    expect(document.getElementById(descId!)).toHaveTextContent('Test description')
  })

  it('traps focus inside dialog', async () => {
    const user = userEvent.setup()

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Focus Test</DialogTitle>
          </DialogHeader>
          <input data-testid="input-1" placeholder="First input" />
          <input data-testid="input-2" placeholder="Second input" />
          <DialogFooter>
            <button type="button">Submit</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )

    await user.click(screen.getByText('Open Dialog'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    // Tab through interactive elements
    await user.tab()
    await user.tab()
    await user.tab()
    await user.tab()

    // Focus should stay within the dialog (close button, input-1, input-2, submit button)
    // After cycling through all, focus should return to first focusable element
    const dialog = screen.getByRole('dialog')
    expect(dialog.contains(document.activeElement)).toBe(true)
  })

  it('closes when overlay is clicked', async () => {
    const user = userEvent.setup()

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    await user.click(screen.getByText('Open Dialog'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    // Find and click the overlay (element with data-slot="dialog-overlay")
    const overlay = document.querySelector('[data-slot="dialog-overlay"]')
    expect(overlay).toBeInTheDocument()

    await user.click(overlay!)

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('can hide close button with showCloseButton prop', async () => {
    const user = userEvent.setup()

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogTitle>No Close Button</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    await user.click(screen.getByText('Open Dialog'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    // Close button should not be present
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
  })

  it('supports controlled open state', async () => {
    const onOpenChange = vi.fn()

    const { rerender } = render(
      <Dialog open={false} onOpenChange={onOpenChange}>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Controlled Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    rerender(
      <Dialog open={true} onOpenChange={onOpenChange}>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Controlled Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders DialogFooter with close button when showCloseButton is true', async () => {
    const user = userEvent.setup()

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Footer Test</DialogTitle>
          </DialogHeader>
          <DialogFooter showCloseButton>
            <button type="submit">Save</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )

    await user.click(screen.getByText('Open Dialog'))

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('applies custom className to DialogContent', async () => {
    const user = userEvent.setup()

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent className="custom-dialog-class">
          <DialogTitle>Styled Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    await user.click(screen.getByText('Open Dialog'))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveClass('custom-dialog-class')
  })
})
