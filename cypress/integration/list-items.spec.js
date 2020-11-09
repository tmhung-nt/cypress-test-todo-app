describe('List items', () => {
    beforeEach(() => {
        cy.seedAndVisit()
    })

    it('properly displays completed items', () => {
        cy.get('.todo-list li')
            .filter('.completed')
            .should('have.length', 1)
            .and('contain', 'Eggs')
            .find('.toggle')
            .should('be.checked')
    })

    it('show remaining todos in the footer', () => {
        cy.get('.todo-count')
            .should('contain', 3)
    })

    it('remove todo', () => {
        cy.server()
        cy.route({
            url: '/api/todos/1',
            method: 'DELETE',
            status: 200,
            response: {}
        })

        cy.get('.todo-list li').as('list')

        cy.get('@list')
            .first()
            .find('.destroy')
            .invoke('show')  // force shown element with class display:no
            .click({force: true}) // force click to none display element
        
        cy.get('.todo-count')
        .should('contain', 2)
    })

    it('Marks an incomplete item completed', () => {
        cy.fixture('todos')
            .then(todos => {
                const target = Cypress._.head(todos)
                cy.server()
                cy.route(
                    'PUT',
                    `/api/todos/${target.id}`,
                    Cypress._.merge(target, {isComplete: true})
                ) 
            })
        cy.get('.todo-list li')
            .first().as('first-todo')


        cy.get('@first-todo')
            .find('.toggle')
            .click()
            .should('be.checked')

        cy.get('@first-todo')    
            .should('have.class', 'completed')

        cy.get('.todo-count')
            .should('contain', 2)    
     
    })
})