describe('Smoke tests', () => {
    beforeEach(() => {
        cy.request('GET', '/api/todos')
            .its('body')
            .each(todo => cy.request('DELETE', `/api/todos/${todo.id}`))
    })
    context('With no todos', () => {
        it('Saves new todo', () => {
            const items = [
                {text: 'Buy milk', expectedLenghth: 1},
                {text: 'Buy eggs', expectedLenghth: 2},
                {text: 'Buy car', expectedLenghth: 3},
            ]

            cy.wrap(items)
                .each(item => {
                    cy.visit('/')
                    cy.server()
                    cy.route('POST', '/api/todos')
                        .as('create')
        
                    cy.focused()
                        .type(item.text)
                        .type('{enter}')
        
                    cy.wait('@create')
        
                    cy.get('.todo-list li')
                        .should('have.length', item.expectedLenghth)
                        .and('contain', item.text)
                })
            
        })
    })
})