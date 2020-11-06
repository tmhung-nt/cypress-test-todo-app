describe('Input form', () => {
  beforeEach(() => {
    cy.seedAndVisit([])
  })
  it('focuses input on load', () => {
    
    cy.focused()
      .should('have.class', 'new-todo')
  })

  it('accepts input', () => {
    const input_txt = 'Buy Milk'

    cy.get('.new-todo')
      .type(input_txt)
      .should('have.value', input_txt)
  })

  context('Form Submission', () => {
    beforeEach(() => {
      cy.server() // allow cypress to serve a stub response
    })
    const todoText = 'Buy egg'
    it('Adds a new todo on submit', () => {
      
      cy.route('POST', '/api/todos', {
        name: todoText,
        id: 1,
        isComplete: false
      })

      cy.get('.new-todo')
        .type(todoText)
        .type('{enter}')
        .should('have.value', '')


      cy.get('.todo-list li')
        .should('have.length', 1)
        .and('contain', todoText)
    })

    it('Show an error message on a failed submission', () => {
      cy.route({
        url: '/api/todos',
        method: 'POST',
        status: 500,
        response: {}
      })

      cy.get('.new-todo')
        .type('test{enter}')

      cy.get('.todo-list li')
        .should('not.exist')

      cy.get('.error').should('contain', 'Oh no!')
    })
  })
})
