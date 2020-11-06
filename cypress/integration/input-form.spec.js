describe('Input form', () => {
  beforeEach(() => {
    cy.visit('/')
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
})
