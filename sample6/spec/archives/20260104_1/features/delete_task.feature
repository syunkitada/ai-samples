Feature: Delete Task
  As a user
  I want to delete tasks
  So that I can remove tasks I no longer need

  Scenario: Delete an incomplete task
    Given I am on the TODO app page
    And I have a task "Old task"
    When I click the delete button for "Old task"
    Then the task "Old task" should be removed from the list

  Scenario: Delete a completed task
    Given I am on the TODO app page
    And I have a completed task "Finished work"
    When I click the delete button for "Finished work"
    Then the task "Finished work" should be removed from the list

  Scenario: Delete a task from multiple tasks
    Given I am on the TODO app page
    And I have the following tasks:
      | Task name       | Status     |
      | First task      | incomplete |
      | Second task     | incomplete |
      | Third task      | complete   |
    When I delete "Second task"
    Then I should see 2 tasks in the list
    And "Second task" should not be in the list
    And "First task" should still be in the list
    And "Third task" should still be in the list

  Scenario: Delete all tasks one by one
    Given I am on the TODO app page
    And I have 3 tasks
    When I delete all tasks one by one
    Then the task list should be empty
    And I should see "No tasks available" message
