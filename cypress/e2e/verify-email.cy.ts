describe("Verify email page", () => {
  it("muestra mensaje de éxito cuando el token es válido", () => {
    cy.intercept("GET", "**/api/auth/verify-email*", {
      statusCode: 200,
      body: {
        message: "Email verificado exitosamente.",
        user: {
          id: "user-1",
          email: "student@example.com",
          name: "Estudiante Test",
          role: "student",
        },
      },
    }).as("verifyEmail");

    cy.visit("/auth/verify?token=fake-token");

    cy.wait("@verifyEmail");

    cy.contains(/Email verificado exitosamente/i).should("be.visible");

    cy.contains("button", /Ir a Iniciar Sesi/i).click();

    cy.location("pathname").should("eq", "/login");
  });

  it("muestra mensaje de error cuando el token es inválido", () => {
    cy.intercept("GET", "**/api/auth/verify-email*", {
      statusCode: 400,
      body: {
        message: "El enlace de verificación ha expirado.",
      },
    }).as("verifyEmailError");

    cy.visit("/auth/verify?token=expired-token");

    cy.wait("@verifyEmailError");

    cy.contains(/Error en la verificaci/i).should("be.visible");
    cy.contains(/El enlace de verificación ha expirado/i).should(
      "be.visible"
    );
  });
});

