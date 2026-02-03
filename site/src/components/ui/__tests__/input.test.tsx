import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { Input } from '../input'

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Enter your email" />)

    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
  })

  it('accepts and displays value', () => {
    render(<Input value="test@example.com" readOnly />)

    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument()
  })

  it('fires onChange handler', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(<Input onChange={handleChange} placeholder="Type here" />)

    const input = screen.getByPlaceholderText('Type here')
    await user.type(input, 'hello')

    expect(handleChange).toHaveBeenCalled()
    expect(input).toHaveValue('hello')
  })

  it('applies className correctly', () => {
    render(<Input className="custom-class" data-testid="input" />)

    const input = screen.getByTestId('input')
    expect(input).toHaveClass('custom-class')
  })

  it('disabled state works', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(<Input disabled onChange={handleChange} placeholder="Disabled input" />)

    const input = screen.getByPlaceholderText('Disabled input')
    expect(input).toBeDisabled()

    await user.type(input, 'test')
    expect(handleChange).not.toHaveBeenCalled()
  })

  describe('different types work', () => {
    it('renders without explicit type attribute by default', () => {
      render(<Input data-testid="input" />)

      const input = screen.getByTestId('input')
      // HTML input defaults to text when no type is specified
      expect(input.getAttribute('type')).toBeNull()
      expect(input).toHaveProperty('type', 'text') // DOM property still resolves to 'text'
    })

    it('renders text type when explicitly set', () => {
      render(<Input type="text" data-testid="input" />)

      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('type', 'text')
    })

    it('renders email type', () => {
      render(<Input type="email" data-testid="input" />)

      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('type', 'email')
    })

    it('renders password type', () => {
      render(<Input type="password" data-testid="input" />)

      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('type', 'password')
    })

    it('renders number type', () => {
      render(<Input type="number" data-testid="input" />)

      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('type', 'number')
    })
  })

  it('forwards ref correctly', () => {
    const ref = createRef<HTMLInputElement>()

    render(<Input ref={ref} placeholder="Ref input" />)

    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    expect(ref.current?.placeholder).toBe('Ref input')
  })

  describe('error state', () => {
    it('applies error styles when error prop is true', () => {
      render(<Input error data-testid="input" />)

      const input = screen.getByTestId('input')
      expect(input).toHaveClass('border-destructive')
    })
  })

  describe('icon support', () => {
    it('renders with left icon', () => {
      render(
        <Input
          leftIcon={<span data-testid="left-icon">L</span>}
          data-testid="input"
        />
      )

      expect(screen.getByTestId('left-icon')).toBeInTheDocument()
      expect(screen.getByTestId('input')).toHaveClass('pl-10')
    })

    it('renders with right icon', () => {
      render(
        <Input
          rightIcon={<span data-testid="right-icon">R</span>}
          data-testid="input"
        />
      )

      expect(screen.getByTestId('right-icon')).toBeInTheDocument()
      expect(screen.getByTestId('input')).toHaveClass('pr-10')
    })

    it('renders with both icons', () => {
      render(
        <Input
          leftIcon={<span data-testid="left-icon">L</span>}
          rightIcon={<span data-testid="right-icon">R</span>}
          data-testid="input"
        />
      )

      expect(screen.getByTestId('left-icon')).toBeInTheDocument()
      expect(screen.getByTestId('right-icon')).toBeInTheDocument()
      const input = screen.getByTestId('input')
      expect(input).toHaveClass('pl-10')
      expect(input).toHaveClass('pr-10')
    })
  })

  it('has correct data-slot attribute', () => {
    render(<Input data-testid="input" />)

    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('data-slot', 'input')
  })
})
