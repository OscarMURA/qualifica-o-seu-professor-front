describe("Universities list page", () => {
  it("lista y filtra universidades con API mockeada", () => {
    const universities = [
      {
        id: "uni-1",
        name: "Universidad Central",
        country: "Chile",
        city: "Santiago",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "uni-2",
        name: "Universidad del Sur",
        country: "Chile",
        city: "Concepción",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    cy.intercept("GET", "**/api/universities", {
      statusCode: 200,
      body: universities,
    }).as("getUniversities");

    cy.visit("/universities");

    cy.wait("@getUniversities");

    cy.contains("h1", /Lista de Universidades/i).should("be.visible");

    cy.contains("Universidad Central").should("be.visible");
    cy.contains("Universidad del Sur").should("be.visible");

    cy.get('input[placeholder^="Buscar por nombre"]').as("search");

    cy.get("@search").type("Santiago");

    cy.contains("Universidad Central").should("be.visible");
    cy.contains("Universidad del Sur").should("not.exist");

    cy.get("@search").clear();

    cy.contains("Universidad Central").should("be.visible");
    cy.contains("Universidad del Sur").should("be.visible");
  });

  it("muestra estado vacío cuando no hay universidades", () => {
    cy.intercept("GET", "**/api/universities", {
      statusCode: 200,
      body: [],
    }).as("getUniversitiesEmpty");

    cy.visit("/universities");

    cy.wait("@getUniversitiesEmpty");

    cy.contains("No se encontraron universidades").should("be.visible");
  });

  it("muestra el detalle de una universidad con sus profesores", () => {
    const university = {
      id: "uni-1",
      name: "Universidad Central",
      country: "Chile",
      city: "Santiago",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const professors = [
      {
        id: "prof-1",
        name: "Juan Pérez",
        department: "Matemáticas",
        universityId: "uni-1",
        university: {
          id: "uni-1",
          name: "Universidad Central",
          city: "Santiago",
          country: "Chile",
        },
        averageRating: 4.5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    cy.intercept("GET", "**/api/universities/uni-1", {
      statusCode: 200,
      body: university,
    }).as("getUniversity");

    cy.intercept("GET", "**/api/professors", {
      statusCode: 200,
      body: professors,
    }).as("getProfessors");

    cy.visit("/universities/uni-1");

    cy.wait(["@getUniversity", "@getProfessors"]);

    cy.contains("h1", university.name).should("be.visible");
    cy.contains("Santiago, Chile").should("be.visible");

    cy.contains("Juan Pérez").should("be.visible");
    cy.contains("Matemáticas").should("be.visible");
  });
});

