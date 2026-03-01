import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach,describe, expect, it, vi } from "vitest"

import { PublicHeader } from "../public-header"

// Mock next/navigation
const mockPathname = vi.fn(() => "/")
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}))

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
    onClick?: () => void
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

// Mock auth context (legacy test helper for public-only mode)
const mockUser = vi.fn(() => null)
const mockLogout = vi.fn()
const mockIsLoading = vi.fn(() => false)
vi.mock("@/lib/auth-context", () => ({
  useAuth: () => ({
    user: mockUser(),
    logout: mockLogout,
    isLoading: mockIsLoading(),
  }),
}))

describe("PublicHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPathname.mockReturnValue("/")
    mockUser.mockReturnValue(null)
    mockIsLoading.mockReturnValue(false)
  })

  describe("Logo and branding", () => {
    it("renders the Advyser logo/brand name", () => {
      render(<PublicHeader />)

      expect(screen.getByText("Advyser")).toBeInTheDocument()
    })

    it("logo links to the home page", () => {
      render(<PublicHeader />)

      const logoLink = screen.getByText("Advyser").closest("a")
      expect(logoLink).toHaveAttribute("href", "/")
    })
  })

  describe("Navigation links", () => {
    it("renders Find Advisors link", () => {
      render(<PublicHeader />)

      const links = screen.getAllByRole("link", { name: "Find Advisors" })
      expect(links.length).toBeGreaterThan(0)
    })

    it("renders For Advisors link", () => {
      render(<PublicHeader />)

      const links = screen.getAllByRole("link", { name: "For Advisors" })
      expect(links.length).toBeGreaterThan(0)
    })

    it("renders Help link", () => {
      render(<PublicHeader />)

      const links = screen.getAllByRole("link", { name: "Help" })
      expect(links.length).toBeGreaterThan(0)
    })

    it("Find Advisors link has correct href", () => {
      render(<PublicHeader />)

      const links = screen.getAllByRole("link", { name: "Find Advisors" })
      expect(links[0]).toHaveAttribute("href", "/search")
    })

    it("For Advisors link has correct href", () => {
      render(<PublicHeader />)

      const links = screen.getAllByRole("link", { name: "For Advisors" })
      expect(links[0]).toHaveAttribute("href", "/for-advisors")
    })

    it("Help link has correct href", () => {
      render(<PublicHeader />)

      const links = screen.getAllByRole("link", { name: "Help" })
      expect(links[0]).toHaveAttribute("href", "/help")
    })
  })

  describe("Auth CTAs", () => {
    it('renders "Log in" link', () => {
      render(<PublicHeader />)

      const loginLinks = screen.getAllByRole("link", { name: "Log in" })
      expect(loginLinks.length).toBeGreaterThan(0)
    })

    it('renders "Sign up" CTA button', () => {
      render(<PublicHeader />)

      const signupLinks = screen.getAllByRole("link", { name: "Sign up" })
      expect(signupLinks.length).toBeGreaterThan(0)
    })

    it("auth CTAs link to auth routes", () => {
      render(<PublicHeader />)

      expect(screen.getAllByRole("link", { name: "Log in" })[0]).toHaveAttribute("href", "/login")
      expect(screen.getAllByRole("link", { name: "Sign up" })[0]).toHaveAttribute("href", "/signup")
    })
  })

  describe("Public-only header behavior", () => {
    it("renders login/signup and does not render dashboard/logout controls when logged out", () => {
      mockUser.mockReturnValue(null)
      render(<PublicHeader />)

      expect(screen.getAllByRole("link", { name: "Log in" }).length).toBeGreaterThan(0)
      expect(screen.getAllByRole("link", { name: "Sign up" }).length).toBeGreaterThan(0)
      expect(screen.queryByRole("link", { name: "Dashboard" })).not.toBeInTheDocument()
      expect(screen.queryByRole("button", { name: /log out/i })).not.toBeInTheDocument()
    })

    it("renders dashboard/logout and hides login/signup when authenticated", () => {
      const authStates = [
        { id: "123", email: "test@example.com", role: "consumer", displayName: "Test User" },
        { id: "456", email: "advisor@example.com", role: "advisor", displayName: "Test Advisor" },
        { id: "789", email: "admin@example.com", role: "admin", displayName: "Test Admin" },
      ]

      for (const authState of authStates) {
        mockUser.mockReturnValue(authState)
        const { unmount } = render(<PublicHeader />)

        expect(screen.queryByRole("link", { name: "Log in" })).not.toBeInTheDocument()
        expect(screen.queryByRole("link", { name: "Sign up" })).not.toBeInTheDocument()
        expect(screen.getAllByRole("link", { name: "Dashboard" }).length).toBeGreaterThan(0)
        expect(screen.getAllByRole("button", { name: /log out/i }).length).toBeGreaterThan(0)
        unmount()
      }
    })
  })

  describe("Mobile menu", () => {
    it("renders mobile menu trigger button", () => {
      render(<PublicHeader />)

      const menuButton = screen.getByRole("button", { name: /open menu/i })
      expect(menuButton).toBeInTheDocument()
    })

    it("mobile menu trigger is accessible with aria-label", () => {
      render(<PublicHeader />)

      const menuButton = screen.getByRole("button", { name: /open menu/i })
      expect(menuButton).toHaveAttribute("aria-label", "Open menu")
    })

    it("opens mobile menu when trigger is clicked", async () => {
      const user = userEvent.setup()
      render(<PublicHeader />)

      const menuButton = screen.getByRole("button", { name: /open menu/i })
      await user.click(menuButton)

      // Sheet content should be visible after clicking
      // Using getAllByRole since mobile menu duplicates nav links
      const mobileNav = screen.getByRole("dialog")
      expect(mobileNav).toBeInTheDocument()
    })

    it("mobile menu contains navigation links", async () => {
      const user = userEvent.setup()
      render(<PublicHeader />)

      const menuButton = screen.getByRole("button", { name: /open menu/i })
      await user.click(menuButton)

      const dialog = screen.getByRole("dialog")
      expect(within(dialog).getByRole("link", { name: "Find Advisors" })).toBeInTheDocument()
      expect(within(dialog).getByRole("link", { name: "For Advisors" })).toBeInTheDocument()
      expect(within(dialog).getByRole("link", { name: "Help" })).toBeInTheDocument()
    })

    it("mobile menu contains CTA button", async () => {
      const user = userEvent.setup()
      render(<PublicHeader />)

      const menuButton = screen.getByRole("button", { name: /open menu/i })
      await user.click(menuButton)

      const dialog = screen.getByRole("dialog")
      expect(within(dialog).getByRole("link", { name: "Log in" })).toBeInTheDocument()
      expect(within(dialog).getByRole("link", { name: "Sign up" })).toBeInTheDocument()
      expect(within(dialog).getByRole("link", { name: "Find an Advisor" })).toBeInTheDocument()
    })

    it("mobile menu shows dashboard/logout when authenticated", async () => {
      mockUser.mockReturnValue({
        id: "456",
        email: "advisor@example.com",
        role: "advisor",
        displayName: "Test Advisor",
      })

      const user = userEvent.setup()
      render(<PublicHeader />)

      const menuButton = screen.getByRole("button", { name: /open menu/i })
      await user.click(menuButton)

      const dialog = screen.getByRole("dialog")
      expect(within(dialog).getByRole("link", { name: "Dashboard" })).toBeInTheDocument()
      expect(within(dialog).getByRole("button", { name: "Log out" })).toBeInTheDocument()
      expect(within(dialog).queryByRole("link", { name: "Log in" })).not.toBeInTheDocument()
      expect(within(dialog).queryByRole("link", { name: "Sign up" })).not.toBeInTheDocument()
    })
  })

  describe("Active link styling", () => {
    it("applies active styling to Find Advisors when on /search", () => {
      mockPathname.mockReturnValue("/search")
      render(<PublicHeader />)

      const links = screen.getAllByRole("link", { name: "Find Advisors" })
      // Desktop link should have active styling (font-semibold text-primary)
      expect(links[0]).toHaveClass("font-semibold")
    })

  })

  describe("Header structure", () => {
    it("renders as a header element", () => {
      render(<PublicHeader />)

      const header = screen.getByRole("banner")
      expect(header).toBeInTheDocument()
    })

    it("header is sticky", () => {
      render(<PublicHeader />)

      const header = screen.getByRole("banner")
      expect(header).toHaveClass("sticky")
    })

    it("header has border bottom", () => {
      render(<PublicHeader />)

      const header = screen.getByRole("banner")
      expect(header).toHaveClass("border-b")
    })
  })
})
