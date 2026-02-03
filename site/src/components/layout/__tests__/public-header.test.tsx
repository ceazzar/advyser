import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
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

// Mock auth context
const mockUser = vi.fn(() => null)
const mockLogout = vi.fn()
vi.mock("@/lib/auth-context", () => ({
  useAuth: () => ({
    user: mockUser(),
    logout: mockLogout,
  }),
}))

describe("PublicHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPathname.mockReturnValue("/")
    mockUser.mockReturnValue(null)
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

    it("renders How It Works link", () => {
      render(<PublicHeader />)

      const links = screen.getAllByRole("link", { name: "How It Works" })
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

    it("How It Works link has correct href", () => {
      render(<PublicHeader />)

      const links = screen.getAllByRole("link", { name: "How It Works" })
      expect(links[0]).toHaveAttribute("href", "/how-it-works")
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

  describe("CTA button", () => {
    it('renders "Find an Advisor" CTA button', () => {
      render(<PublicHeader />)

      const ctaButtons = screen.getAllByRole("link", { name: "Find an Advisor" })
      expect(ctaButtons.length).toBeGreaterThan(0)
    })

    it("CTA button links to search page", () => {
      render(<PublicHeader />)

      const ctaButtons = screen.getAllByRole("link", { name: "Find an Advisor" })
      expect(ctaButtons[0]).toHaveAttribute("href", "/search")
    })
  })

  describe("Authentication state - logged out", () => {
    beforeEach(() => {
      mockUser.mockReturnValue(null)
    })

    it("renders Log in link when user is not authenticated", () => {
      render(<PublicHeader />)

      const loginLinks = screen.getAllByRole("link", { name: "Log in" })
      expect(loginLinks.length).toBeGreaterThan(0)
    })

    it("Log in link has correct href", () => {
      render(<PublicHeader />)

      const loginLinks = screen.getAllByRole("link", { name: "Log in" })
      expect(loginLinks[0]).toHaveAttribute("href", "/login")
    })
  })

  describe("Authentication state - logged in as consumer", () => {
    beforeEach(() => {
      mockUser.mockReturnValue({
        id: "123",
        email: "test@example.com",
        role: "consumer",
        displayName: "Test User",
      })
    })

    it("renders Dashboard link when user is authenticated", () => {
      render(<PublicHeader />)

      const dashboardLinks = screen.getAllByRole("link", { name: "Dashboard" })
      expect(dashboardLinks.length).toBeGreaterThan(0)
    })

    it("Dashboard link points to consumer dashboard for consumer role", () => {
      render(<PublicHeader />)

      const dashboardLinks = screen.getAllByRole("link", { name: "Dashboard" })
      expect(dashboardLinks[0]).toHaveAttribute("href", "/dashboard")
    })

    it("renders Log out button when user is authenticated", () => {
      render(<PublicHeader />)

      const logoutButtons = screen.getAllByRole("button", { name: /log out/i })
      expect(logoutButtons.length).toBeGreaterThan(0)
    })

    it("Log out button calls logout function when clicked", async () => {
      const user = userEvent.setup()
      render(<PublicHeader />)

      const logoutButtons = screen.getAllByRole("button", { name: /log out/i })
      await user.click(logoutButtons[0])

      expect(mockLogout).toHaveBeenCalledTimes(1)
    })

    it("does not render Log in link when user is authenticated", () => {
      render(<PublicHeader />)

      expect(screen.queryByRole("link", { name: "Log in" })).not.toBeInTheDocument()
    })
  })

  describe("Authentication state - logged in as advisor", () => {
    beforeEach(() => {
      mockUser.mockReturnValue({
        id: "456",
        email: "advisor@example.com",
        role: "advisor",
        displayName: "Test Advisor",
      })
    })

    it("Dashboard link points to advisor dashboard for advisor role", () => {
      render(<PublicHeader />)

      const dashboardLinks = screen.getAllByRole("link", { name: "Dashboard" })
      expect(dashboardLinks[0]).toHaveAttribute("href", "/advisor")
    })
  })

  describe("Authentication state - logged in as admin", () => {
    beforeEach(() => {
      mockUser.mockReturnValue({
        id: "789",
        email: "admin@example.com",
        role: "admin",
        displayName: "Test Admin",
      })
    })

    it("Dashboard link points to admin dashboard for admin role", () => {
      render(<PublicHeader />)

      const dashboardLinks = screen.getAllByRole("link", { name: "Dashboard" })
      expect(dashboardLinks[0]).toHaveAttribute("href", "/admin")
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
      expect(within(dialog).getByRole("link", { name: "How It Works" })).toBeInTheDocument()
      expect(within(dialog).getByRole("link", { name: "For Advisors" })).toBeInTheDocument()
      expect(within(dialog).getByRole("link", { name: "Help" })).toBeInTheDocument()
    })

    it("mobile menu contains CTA button", async () => {
      const user = userEvent.setup()
      render(<PublicHeader />)

      const menuButton = screen.getByRole("button", { name: /open menu/i })
      await user.click(menuButton)

      const dialog = screen.getByRole("dialog")
      expect(within(dialog).getByRole("link", { name: "Find an Advisor" })).toBeInTheDocument()
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

    it("applies active styling to How It Works when on /how-it-works", () => {
      mockPathname.mockReturnValue("/how-it-works")
      render(<PublicHeader />)

      const links = screen.getAllByRole("link", { name: "How It Works" })
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
