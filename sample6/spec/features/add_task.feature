Feature: Add Task
  As a user
  I want to add a new task
  So that I can track things I need to do

  Scenario: Successfully add a valid task
    Given I am on the TODO app page
    When I enter "Buy groceries" in the task input field
    And I click the add button
    Then I should see "Buy groceries" in the task list

  Scenario: Cannot add an empty task
    Given I am on the TODO app page
    When I leave the task input field empty
    And I click the add button
    Then I should see an error message "Task cannot be empty"
    And the task should not be added to the list

  Scenario Outline: Cannot add a task exceeding character limit
    Given I am on the TODO app page
    When I enter a task with <characters> characters
    And I click the add button
    Then I should see an error message "Task must be 128 characters or less"
    And the task should not be added to the list

    Examples:
      | characters |
      | 129        |
      | 150        |
      | 200        |

  Scenario: Successfully add a task at maximum length
    Given I am on the TODO app page
    When I enter a task with exactly 128 characters
    And I click the add button
    Then the task should be added to the list

  Scenario: Add multiple tasks
    Given I am on the TODO app page
    When I add a task "Task 1"
    And I add a task "Task 2"
    And I add a task "Task 3"
    Then I should see 3 tasks in the list
    And the tasks should be displayed in the order they were added
