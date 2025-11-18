describe("Home page", () => {
  it("muestra título, mensaje y CTAs públicos", () => {
    cy.visit("/");

    cy.contains("h1", /Califica a tu Profesor/i).should("be.visible");

    cy.contains(/Bienvenido a la plataforma/i).should("be.visible");

    cy.contains("button", /Comenzar/i).should("be.visible");
    cy.contains("button", /Iniciar/i).should("be.visible");
  });

  it("navega a signup al hacer clic en Comenzar", () => {
    cy.visit("/");

    cy.contains("button", /Comenzar/i).click();

    cy.url().should("match", /\/signup$/);
  });
});

