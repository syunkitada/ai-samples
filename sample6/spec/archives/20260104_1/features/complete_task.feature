Feature: Complete Task
  As a user
  I want to mark tasks as complete or incomplete
  So that I can track my progress

  Scenario: Mark an incomplete task as complete
    Given I am on the TODO app page
    And I have a task "Write documentation"
    And the task is incomplete
    When I click the checkbox for "Write documentation"
    Then the task should be marked as complete
    And the task text should be grayed out

  Scenario: Mark a complete task as incomplete
    Given I am on the TODO app page
    And I have a task "Review code"
    And the task is marked as complete
    When I click the checkbox for "Review code"
    Then the task should be marked as incomplete
    And the task text should not be grayed out

  Scenario: Toggle task completion multiple times
    Given I am on the TODO app page
    And I have a task "Test feature"
    When I click the checkbox for "Test feature"
    Then the task should be marked as complete
    When I click the checkbox for "Test feature" again
    Then the task should be marked as incomplete
    When I click the checkbox for "Test feature" again
    Then the task should be marked as complete

  Scenario: Visual appearance of completed task
    Given I am on the TODO app page
    And I have an incomplete task "Deploy application"
    When I mark the task as complete
    Then the task text should have a grayed out appearance
    And the checkbox should be checked
