Feature: Persist Tasks
  As a user
  I want my tasks to be saved automatically
  So that I don't lose my data when I reload the browser

  Scenario: Tasks are saved to localStorage when added
    Given I am on the TODO app page
    When I add a task "Buy groceries"
    And I reload the page
    Then I should see "Buy groceries" in the task list

  Scenario: Tasks are saved to localStorage when completed
    Given I am on the TODO app page
    And I have added a task "Buy groceries"
    When I mark the task "Buy groceries" as completed
    And I reload the page
    Then I should see "Buy groceries" in the task list
    And the task "Buy groceries" should be marked as completed

  Scenario: Tasks are saved to localStorage when deleted
    Given I am on the TODO app page
    And I have added a task "Buy groceries"
    And I have added a task "Walk the dog"
    When I delete the task "Buy groceries"
    And I reload the page
    Then I should see "Walk the dog" in the task list
    And I should not see "Buy groceries" in the task list

  Scenario: Multiple tasks are persisted correctly
    Given I am on the TODO app page
    When I add a task "Task 1"
    And I add a task "Task 2"
    And I mark the task "Task 1" as completed
    And I reload the page
    Then I should see 2 tasks in the list
    And the task "Task 1" should be marked as completed
    And the task "Task 2" should not be marked as completed

  Scenario: App starts with empty list when no data in localStorage
    Given localStorage is empty
    When I visit the TODO app page for the first time
    Then I should see an empty task list
    And I should see the empty state message

  Scenario: App handles corrupted localStorage data gracefully
    Given localStorage contains corrupted data
    When I visit the TODO app page
    Then I should see an error message "Failed to load tasks. Starting with an empty list."
    And I should see an empty task list
    And localStorage should be reset with an empty list

  Scenario: App handles localStorage not available
    Given localStorage is not available
    When I visit the TODO app page
    Then I should see an error message "localStorage is not available. Please enable it to use this app."
    And the app should be in a disabled state
