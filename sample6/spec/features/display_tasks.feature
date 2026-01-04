Feature: Display Tasks
  As a user
  I want to see my task list
  So that I can view all my tasks

  Scenario: Display empty task list
    Given I am on the TODO app page
    And I have no tasks
    Then I should see "No tasks available" message

  Scenario: Display single task
    Given I am on the TODO app page
    When I add a task "My first task"
    Then I should see 1 task in the list
    And the task "My first task" should be displayed

  Scenario: Display multiple tasks in order
    Given I am on the TODO app page
    When I add the following tasks in order:
      | Task name    |
      | First task   |
      | Second task  |
      | Third task   |
    Then I should see 3 tasks in the list
    And the tasks should be displayed in this order:
      | Task name    |
      | First task   |
      | Second task  |
      | Third task   |

  Scenario: Display tasks with different completion states
    Given I am on the TODO app page
    And I have the following tasks:
      | Task name        | Status     |
      | Incomplete one   | incomplete |
      | Completed one    | complete   |
      | Another pending  | incomplete |
    Then I should see 3 tasks in the list
    And "Completed one" should appear grayed out
    And "Incomplete one" should not appear grayed out
    And "Another pending" should not appear grayed out

  Scenario: Task list updates after adding a task
    Given I am on the TODO app page
    And I have 2 tasks
    When I add a new task "New task"
    Then I should see 3 tasks in the list
    And "New task" should be the last task in the list

  Scenario: Task list updates after deleting a task
    Given I am on the TODO app page
    And I have 3 tasks
    When I delete the second task
    Then I should see 2 tasks in the list
