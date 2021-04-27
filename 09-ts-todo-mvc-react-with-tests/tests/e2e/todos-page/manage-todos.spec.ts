import { todosEndpoint, getUserEndpoint, pageUrl } from '../../../src/consts/urls';

const userResponseJsonName = 'user.response.json';
const emptyTodosListResponseJsonName = 'empty-todos-list.response.json';
const todoItemResponseJsonName = 'todo-item.response.json';

function authorize() {
  cy.intercept(
      'GET',
      getUserEndpoint,
      { fixture: userResponseJsonName }
  ).as('authorize');

  cy.intercept(
      'GET',
      todosEndpoint,
      { fixture: emptyTodosListResponseJsonName }
  ).as('initialTodos');

  cy.visit(pageUrl)
      .wait('@authorize')
      .wait('@initialTodos');
}

describe('Manage Todos', () => {
  // context('Creation', () => {
    // it('Create todo', () => {
  //
  //     createTodo();
  //     authorize();
  //     const itemText = getItemText();
  //     cy.get('[data-test-id=create-new-todo-form__todo-text-input]').type(itemText);
  //     cy.get('[data-test-id=create-new-todo-form]').should('be.visible');
  //     cy.get('[data-test-id=create-new-todo-form]').submit();
  //
  //     cy.wait('@createTodo');
  //
  //     cy.get('[data-test-id=todos-list]').should('be.visible');
  //
  //     cy.get('[data-test-id=todo-item]').should('be.visible');
  //     cy.get('[data-test-id=todo-item__checked-checkbox]').should('not.be.checked');
  //     cy.get('[data-test-id=todo-item__text-input]').should('have.value', itemText);
  //     cy.get('[data-test-id=todo-item__remove-action]').should('be.visible');
  //   });
  // });
  //
  context('Deletion', () => {
    it('Delete todo', () => {

      createTodo();
      authorize();

      const itemText = getItemText();
      cy.get('[data-test-id=create-new-todo-form__todo-text-input]').type(itemText);
      cy.get('[data-test-id=create-new-todo-form]').submit();

      cy.wait('@createTodo');

      cy.get('[data-test-id=todo-item__remove-action]').click({force: true})
      cy.get('[data-test-id=todo-item]').should('not.exist');
      cy.get('[data-test-id=todos-list]').should('be.empty');
      cy.get('[data-test-id=task-counter]').should('have.text', "0 items left");
    });
  });
});

function createTodo() {
  cy.fixture(todoItemResponseJsonName).then((todoItemResponse)  => {
    cy.intercept(
        'POST',
        todosEndpoint,
        req => {
          const { body } = req;
          req.reply({
            statusCode: 200,
            body: JSON.stringify({
              ...todoItemResponse,
              text: body.text
            })
          });
        }
    ).as('createTodo');
  });
}

function getItemText(): string {
  return Math.random().toString() + '_' + Date.now();
}
