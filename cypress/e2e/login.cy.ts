describe("Login Flow", () => {
  beforeEach(() => {
    cy.visit("/login")
  })

  it("should display login form", () => {
    cy.get("h1").should("contain", "Creator Login")
    cy.get('input[name="email"]').should("exist")
    cy.get('input[name="password"]').should("exist")
    cy.get('button[type="submit"]').should("exist")
  })

  it("should show validation errors for empty fields", () => {
    cy.get('button[type="submit"]').click()
    cy.get("form").contains("Please enter a valid email address")
    cy.get("form").contains("Password is required")
  })

  it("should show error for invalid credentials", () => {
    cy.get('input[name="email"]').type("invalid@example.com")
    cy.get('input[name="password"]').type("wrongpassword")
    cy.get('button[type="submit"]').click()

    // Assuming the API returns an error
    cy.get('[role="alert"]').should("contain", "Invalid credentials")
  })

  it("should redirect to dashboard on successful login", () => {
    // Mock successful login
    cy.intercept("POST", "/api/login", {
      statusCode: 200,
      body: {
        success: true,
        message: "Login successful",
        user: { id: "user-123", role: "CREATOR" },
      },
    })

    cy.get('input[name="email"]').type("creator@example.com")
    cy.get('input[name="password"]').type("password123")
    cy.get('button[type="submit"]').click()

    // Check for toast notification
    cy.get('[role="status"]').should("contain", "Login successful")

    // Check redirection
    cy.url().should("include", "/dashboard/creator")
  })
})
