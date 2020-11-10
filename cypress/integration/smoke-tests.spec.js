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
                {text: 'Buy house', expectedLenghth: 4}
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

    context('With active todos', () => {
        beforeEach(() => {
            cy.fixture('todos')
                .each(todo => {
                    const newTodo = Cypress._.merge(todo, {isComplete: false})

                    cy.request('POST', '/api/todos', newTodo)
                    
                })
            cy.visit('/')
        })

        it('Loads existing data from the DB', () => {
            cy.get('.todo-list li ')
                .should('have.length', 4)
        })

        it('Delete todos', () => {
            cy.server()
            cy.route('DELETE', '/api/todos/*')
                .as('delete')

            cy.get('.todo-list li')
                .each($todo => {
                    cy.wrap($todo)
                        .find('.destroy')
                        .invoke('show')
                        .click()
                    
                    cy.wait('@delete')                        
                })
                .should('not.exist')
        })

        it('Toggle todos', () => {
            const clickAndWait = ($el) => {
                cy.wrap($el)
                .as('item')
                .find('.toggle')
                .click()
            
                cy.wait('@update')       
            }
            cy.server()
            cy.route('PUT', '/api/todos/*')
                .as('update')

                cy.get('.todo-list li')
                .each($el => {
                    clickAndWait($el)
                    cy.get('@item')
                        .should('have.class', 'completed')
                })
                
            cy.get('.completed')
                .should('have.length', 4)
        })
    })
})