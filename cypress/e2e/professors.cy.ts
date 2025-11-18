describe("Professors list page", () => {
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

  const baseProfessors = [
    {
      id: "prof-1",
      name: "Juan Pérez",
      department: "Matemáticas",
      bio: "Profesor de cálculo",
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
    {
      id: "prof-2",
      name: "Ana López",
      department: "Física",
      bio: "Profesora de mecánica",
      universityId: "uni-2",
      university: {
        id: "uni-2",
        name: "Universidad del Sur",
        city: "Concepción",
        country: "Chile",
      },
      averageRating: 3.8,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const ratings: Record<string, { average: number; count: number }> = {
    "prof-1": { average: 4.5, count: 10 },
    "prof-2": { average: 3.8, count: 5 },
  };

  const setupIntercepts = (professors: any[]) => {
    cy.intercept("GET", "**/api/universities", {
      statusCode: 200,
      body: universities,
    }).as("getUniversities");

    cy.intercept("GET", "**/api/professors", {
      statusCode: 200,
      body: professors,
    }).as("getProfessors");

    cy.intercept(
      "GET",
      "**/api/comments/professor/*/rating",
      (req): void => {
        const match = req.url.match(
          /\/comments\/professor\/([^/]+)\/rating/
        );
        const professorId = match ? match[1] : "";
        const rating = ratings[professorId] ?? { average: 0, count: 0 };

        req.reply({
          statusCode: 200,
          body: rating,
        });
      }
    ).as("getRating");
  };

  it("lista y filtra profesores con API mockeada", () => {
    setupIntercepts(baseProfessors);

    cy.visit("/professors");

    cy.wait(["@getUniversities", "@getProfessors"]);

    cy.contains("h1", /Lista de Profesores/i).should("be.visible");

    cy.contains("Juan Pérez").should("be.visible");
    cy.contains("Ana López").should("be.visible");

    cy.get('input[placeholder^="Buscar por nombre"]').as("searchInput");

    cy.get("@searchInput").type("Ana");

    cy.contains("Ana López").should("be.visible");
    cy.contains("Juan Pérez").should("not.exist");

    cy.get("@searchInput").clear();

    cy.contains("Juan Pérez").should("be.visible");
    cy.contains("Ana López").should("be.visible");

    cy.get("select").select("Universidad Central");

    cy.contains("Juan Pérez").should("be.visible");
    cy.contains("Ana López").should("not.exist");
  });

  it("muestra mensaje cuando no hay profesores", () => {
    setupIntercepts([]);

    cy.visit("/professors");

    cy.wait(["@getUniversities", "@getProfessors"]);

    cy.contains("No se encontraron profesores.").should("be.visible");
  });

  it("aplica el filtro desde el query param university", () => {
    setupIntercepts(baseProfessors);

    cy.visit("/professors?university=uni-1");

    cy.wait(["@getUniversities", "@getProfessors"]);

    cy.contains("Juan Pérez").should("be.visible");
    cy.contains("Ana López").should("not.exist");

    cy.contains("label", "Universidad")
      .parent()
      .find("select")
      .should("have.value", "uni-1");
  });
});

