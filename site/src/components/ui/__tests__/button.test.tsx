import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { Button, buttonVariants } from "../button"

describe("Button", () => {
  describe("rendering", () => {
    it("renders with default variant", () => {
      render(<Button>Click me</Button>)
      const button = screen.getByRole("button", { name: "Click me" })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass("bg-primary")
    })

    it("renders children correctly", () => {
      render(<Button>Test Button</Button>)
      expect(screen.getByText("Test Button")).toBeInTheDocument()
    })
  })

  describe("variants", () => {
    it("renders default variant", () => {
      render(<Button variant="default">Default</Button>)
      const button = screen.getByRole("button")
      expect(button).toHaveClass("bg-primary")
      expect(button).toHaveClass("text-primary-foreground")
    })

    it("renders destructive variant", () => {
      render(<Button variant="destructive">Destructive</Button>)
      const button = screen.getByRole("button")
      expect(button).toHaveClass("bg-destructive")
      expect(button).toHaveClass("text-white")
    })

    it("renders outline variant", () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByRole("button")
      expect(button).toHaveClass("border-2")
      expect(button).toHaveClass("border-primary")
      expect(button).toHaveClass("bg-transparent")
    })

    it("renders secondary variant", () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole("button")
      expect(button).toHaveClass("bg-primary/10")
      expect(button).toHaveClass("text-primary")
    })

    it("renders ghost variant", () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole("button")
      expect(button).toHaveClass("bg-transparent")
      expect(button).toHaveClass("text-muted-foreground")
    })

    it("renders link variant", () => {
      render(<Button variant="link">Link</Button>)
      const button = screen.getByRole("button")
      expect(button).toHaveClass("text-primary")
      expect(button).toHaveClass("underline-offset-4")
    })
  })

  describe("sizes", () => {
    it("renders default size", () => {
      render(<Button size="default">Default</Button>)
      const button = screen.getByRole("button")
      expect(button).toHaveClass("h-11")
      expect(button).toHaveClass("px-5")
    })

    it("renders sm size", () => {
      render(<Button size="sm">Small</Button>)
      const button = screen.getByRole("button")
      expect(button).toHaveClass("h-11")
      expect(button).toHaveClass("px-3")
      expect(button).toHaveClass("text-xs")
    })

    it("renders lg size", () => {
      render(<Button size="lg">Large</Button>)
      const button = screen.getByRole("button")
      expect(button).toHaveClass("h-12")
      expect(button).toHaveClass("px-6")
      expect(button).toHaveClass("text-base")
    })

    it("renders icon size", () => {
      render(<Button size="icon">Icon</Button>)
      const button = screen.getByRole("button")
      expect(button).toHaveClass("size-11")
    })
  })

  describe("loading state", () => {
    it("shows loading spinner when loading is true", () => {
      render(<Button loading>Submit</Button>)
      const spinner = screen.getByRole("status")
      expect(spinner).toBeInTheDocument()
    })

    it("hides children text visually when loading", () => {
      render(<Button loading>Submit</Button>)
      // The children are wrapped in a span that becomes invisible when loading
      const childrenWrapper = screen.getByText("Submit").closest("span")
      expect(childrenWrapper).toHaveClass("invisible")
    })

    it("announces loading state to screen readers with aria-live", () => {
      render(<Button loading>Submit</Button>)
      const status = screen.getByRole("status")
      expect(status).toHaveAttribute("aria-live", "polite")
    })

    it("provides screen reader text for loading state", () => {
      render(<Button loading>Submit</Button>)
      expect(screen.getByText("Loading, please wait")).toBeInTheDocument()
      expect(screen.getByText("Loading, please wait")).toHaveClass("sr-only")
    })

    it("disables button when loading", () => {
      render(<Button loading>Submit</Button>)
      const button = screen.getByRole("button")
      expect(button).toBeDisabled()
    })

    it("does not show spinner when not loading", () => {
      render(<Button>Submit</Button>)
      expect(screen.queryByRole("status")).not.toBeInTheDocument()
    })
  })

  describe("disabled state", () => {
    it("is disabled when disabled prop is true", () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole("button")
      expect(button).toBeDisabled()
    })

    it("applies disabled styles", () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole("button")
      expect(button).toHaveClass("disabled:opacity-50")
      expect(button).toHaveClass("disabled:pointer-events-none")
    })

    it("is disabled when both disabled and loading are true", () => {
      render(
        <Button disabled loading>
          Submit
        </Button>
      )
      const button = screen.getByRole("button")
      expect(button).toBeDisabled()
    })
  })

  describe("click handling", () => {
    it("fires onClick handler when clicked", () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click me</Button>)
      const button = screen.getByRole("button")
      fireEvent.click(button)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it("does not fire onClick when disabled", () => {
      const handleClick = vi.fn()
      render(
        <Button onClick={handleClick} disabled>
          Click me
        </Button>
      )
      const button = screen.getByRole("button")
      fireEvent.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })

    it("does not fire onClick when loading", () => {
      const handleClick = vi.fn()
      render(
        <Button onClick={handleClick} loading>
          Click me
        </Button>
      )
      const button = screen.getByRole("button")
      fireEvent.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe("asChild prop", () => {
    it("renders as Slot when asChild is true", () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      )
      const link = screen.getByRole("link", { name: "Link Button" })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute("href", "/test")
    })

    it("applies button classes to child element when asChild", () => {
      render(
        <Button asChild variant="secondary">
          <a href="/test">Link Button</a>
        </Button>
      )
      const link = screen.getByRole("link")
      expect(link).toHaveClass("bg-primary/10")
    })

    it("does not show loading spinner when asChild is true", () => {
      render(
        <Button asChild loading>
          <a href="/test">Link Button</a>
        </Button>
      )
      expect(screen.queryByRole("status")).not.toBeInTheDocument()
    })
  })

  describe("custom className", () => {
    it("merges custom className with button classes", () => {
      render(<Button className="custom-class">Custom</Button>)
      const button = screen.getByRole("button")
      expect(button).toHaveClass("custom-class")
      expect(button).toHaveClass("bg-primary") // Still has default variant class
    })
  })

  describe("buttonVariants function", () => {
    it("generates correct classes for default variant", () => {
      const classes = buttonVariants({ variant: "default", size: "default" })
      expect(classes).toContain("bg-primary")
      expect(classes).toContain("h-11")
    })

    it("generates correct classes for destructive variant", () => {
      const classes = buttonVariants({ variant: "destructive" })
      expect(classes).toContain("bg-destructive")
    })

    it("generates correct classes for icon size", () => {
      const classes = buttonVariants({ size: "icon" })
      expect(classes).toContain("size-11")
    })
  })

  describe("accessibility", () => {
    it("supports aria-label", () => {
      render(<Button aria-label="Close dialog">X</Button>)
      const button = screen.getByRole("button", { name: "Close dialog" })
      expect(button).toBeInTheDocument()
    })

    it("has proper focus styles defined", () => {
      render(<Button>Focus me</Button>)
      const button = screen.getByRole("button")
      expect(button).toHaveClass("focus-visible:ring-2")
      expect(button).toHaveClass("focus-visible:ring-offset-2")
    })

    it("renders as button element by default", () => {
      render(<Button>Button</Button>)
      const button = screen.getByRole("button")
      expect(button.tagName).toBe("BUTTON")
    })

    it("can receive type attribute", () => {
      render(<Button type="submit">Submit</Button>)
      const button = screen.getByRole("button")
      expect(button).toHaveAttribute("type", "submit")
    })
  })

  describe("ref forwarding", () => {
    it("forwards ref to button element", () => {
      const ref = vi.fn()
      render(<Button ref={ref}>Button</Button>)
      expect(ref).toHaveBeenCalled()
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLButtonElement)
    })
  })
})
