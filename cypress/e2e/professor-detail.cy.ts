describe("Professor detail page", () => {
  const professorId = "prof-1";

  const professor = {
    id: professorId,
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
  };

  const comments = [
    {
      id: "c1",
      content: "Excelente profesor, explica muy bien.",
      rating: 5,
      professorId,
      userId: "user-1",
      author: {
        id: "user-1",
        name: "Estudiante 1",
        email: "estu1@example.com",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "c2",
      content: "Las evaluaciones son justas.",
      rating: 4,
      professorId,
      userId: "user-2",
      author: {
        id: "user-2",
        name: "Estudiante 2",
        email: "estu2@example.com",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  it("muestra datos del profesor y sus comentarios", () => {
    cy.intercept("GET", "**/api/professors/prof-1", {
      statusCode: 200,
      body: professor,
    }).as("getProfessor");

    cy.intercept(
      "GET",
      "**/api/comments/professor/prof-1/comments",
      {
        statusCode: 200,
        body: comments,
      }
    ).as("getComments");

    cy.visit(`/professors/${professorId}`);

    cy.wait(["@getProfessor", "@getComments"]);

    cy.contains("h1", professor.name).should("be.visible");

    cy.contains("Universidad Central").should("be.visible");
    cy.contains("Matemáticas").should("be.visible");

    cy.contains("Excelente profesor, explica muy bien.").should(
      "be.visible"
    );
    cy.contains("Las evaluaciones son justas.").should("be.visible");
  });

  it("permite enviar un nuevo comentario cuando el usuario está autenticado", () => {
    const student = {
      id: "user-1",
      email: "student@example.com",
      name: "Estudiante Test",
      role: "student" as const,
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
    };

    const newComment = {
      id: "c3",
      content: "Comentario nuevo desde Cypress",
      rating: 5,
      professorId,
      userId: student.id,
      author: {
        id: student.id,
        name: student.name,
        email: student.email,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    cy.intercept("GET", "**/api/professors/prof-1", {
      statusCode: 200,
      body: professor,
    }).as("getProfessor");

    cy.intercept(
      "GET",
      "**/api/comments/professor/prof-1/comments",
      {
        statusCode: 200,
        body: comments,
      }
    ).as("getComments");

    cy.intercept("POST", "**/api/comments", {
      statusCode: 201,
      body: newComment,
    }).as("createComment");

    cy.visit(`/professors/${professorId}`, {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "califica-auth-storage",
          JSON.stringify({
            state: {
              user: student,
              token: "fake-token",
              isAuthenticated: true,
            },
            version: 0,
          })
        );
      },
    });

    cy.wait(["@getProfessor", "@getComments"]);

    cy.get('button[aria-label*="Calificar con 4"]').click();

    cy.get("textarea[placeholder^='Escribe tu opini']").type(
      newComment.content
    );

    cy.contains("button", /Publicar comentario/i).click();

    cy.wait("@createComment");

    cy.contains(newComment.content).should("be.visible");
  });

  it("muestra CTA para iniciar sesión cuando no está autenticado", () => {
    cy.intercept("GET", "**/api/professors/prof-1", {
      statusCode: 200,
      body: professor,
    }).as("getProfessor");

    cy.intercept(
      "GET",
      "**/api/comments/professor/prof-1/comments",
      {
        statusCode: 200,
        body: comments,
      }
    ).as("getComments");

    cy.visit(`/professors/${professorId}`);

    cy.wait(["@getProfessor", "@getComments"]);

    cy.contains(/Quieres comentar/i).should("be.visible");
    cy.contains(/Inicia sesi/i).should("be.visible");
    cy.contains("button", /Iniciar sesi/i).should("be.visible");
  });
});

