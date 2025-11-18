describe("Not found page", () => {
  it("muestra mensaje de página no encontrada y permite volver al inicio", () => {
    cy.visit("/ruta-que-no-existe-xyz", { failOnStatusCode: false });

    cy.contains("h1", /no encontrada/i).should("be.visible");

    cy.contains("button", /Volver al Inicio/i).click();

    cy.url().should("eq", "http://localhost:3001/");
  });
});

