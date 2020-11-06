describe('App initialization', () => {
    it('Loads todos on page load', () => {
        cy.seedAndVisit()

        cy.get('.todo-list li')
            .should('have.length', 4)
    })

    it('Display an error on failure', () => {
      cy.server()
      cy.route({
        method: 'GET',
        url: '/api/todos',
        status: 500,
        response: {}
      })

      cy.visit('/')

      cy.get('.todo-list li')
        .should('not.exist')
    })
  })