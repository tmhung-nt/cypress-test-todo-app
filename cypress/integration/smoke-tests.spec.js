describe('Smoke tests', () => {
    beforeEach(() => {
        cy.request('GET', '/api/todos')
            .its('body')
            .each(todo => cy.request('DELETE', `/api/todos/${todo.id}`))
    })
    context('With no todos', () => {
        it('Saves new todo', () => {
            cy.visit('/')
            cy.server()
            cy.route('POST', '/api/todos')
                .as('create')

            cy.focused()
                .type("Buy milk{enter}")

            cy.wait('@create')
            
            cy.get('.todo-list li')
                .should('have.length', 1)
                .and('contain', 'Buy milk')
        })
    })
})