describe("Auth flows", () => {
  it("muestra feedback cuando las contraseñas no coinciden en registro", () => {
    cy.visit("/signup");

    cy.get('input[name="name"]').type("Nuevo Usuario");
    cy.get('input[name="email"]').type("nuevo+test@example.com");
    cy.get('input[name="password"]').type("123456");
    cy.get('input[name="confirmPassword"]').type("654321");

    cy.contains(/Las contraseñ?as no coinciden/i).should("be.visible");
  });
});
