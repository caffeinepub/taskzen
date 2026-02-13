import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Migration "migration";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type UserProfile = {
    name : Text;
  };

  public type Task = {
    id : Nat;
    title : Text;
    isCompleted : Bool;
    owner : Principal;
    reminderTime : ?Time.Time;
  };

  public type Assignment = {
    id : Nat;
    taskId : Nat;
    subjectId : Nat;
    title : Text;
    dueDate : ?Time.Time;
    owner : Principal;
  };

  public type StudySubject = {
    id : Nat;
    title : Text;
    assignments : [Assignment];
    owner : Principal;
  };

  var tasks = Map.empty<Nat, Task>();
  var studySubjects = Map.empty<Nat, StudySubject>();
  var userProfiles = Map.empty<Principal, UserProfile>();
  var dailyGoals = Map.empty<Principal, Nat>();

  var nextTaskId : Nat = 0;
  var nextSubjectId : Nat = 0;
  var nextAssignmentId = 0;

  public shared ({ caller }) func setDailyGoal(goal : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set goals");
    };
    dailyGoals.add(caller, goal);
  };

  public query ({ caller }) func getDailyGoal(user : Principal) : async ?Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view goals");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own goal");
    };
    dailyGoals.get(user);
  };

  public query ({ caller }) func getUserProgress(user : Principal) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check progress");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own progress");
    };

    let userTasks = tasks.values().toArray().filter(
      func(task : Task) : Bool {
        task.owner == user and task.isCompleted;
      }
    );
    userTasks.size();
  };

  public query ({ caller }) func getProgressPercentage(user : Principal) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check progress");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own progress");
    };

    let completedTasks = tasks.values().toArray().filter(
      func(task : Task) : Bool {
        task.owner == user and task.isCompleted;
      }
    ).size();

    let goal = switch (dailyGoals.get(user)) {
      case (null) { 0 };
      case (?goalVal) { goalVal };
    };

    if (goal == 0) { 0 } else { (completedTasks * 100) / goal };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func addTask(title : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create tasks");
    };

    let task : Task = {
      id = nextTaskId;
      title;
      isCompleted = false;
      owner = caller;
      reminderTime = null;
    };

    tasks.add(nextTaskId, task);
    nextTaskId += 1;
    task.id;
  };

  public shared ({ caller }) func completeTask(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete tasks");
    };

    let existingTask = tasks.get(id);
    switch (existingTask) {
      case (null) {
        Runtime.trap("Task not found");
      };
      case (?task) {
        if (task.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only complete your own tasks");
        };
        let updatedTask = { task with isCompleted = true };
        tasks.add(id, updatedTask);
      };
    };
  };

  public shared ({ caller }) func deleteTask(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete tasks");
    };

    let existingTask = tasks.get(id);
    switch (existingTask) {
      case (null) {
        Runtime.trap("Task not found");
      };
      case (?task) {
        if (task.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own tasks");
        };
        tasks.remove(id);
      };
    };
  };

  public query ({ caller }) func getAllTasks() : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };

    if (AccessControl.isAdmin(accessControlState, caller)) {
      tasks.values().toArray();
    } else {
      let filteredTasks = tasks.values().toArray().filter(
        func(task : Task) : Bool {
          task.owner == caller;
        }
      );
      filteredTasks;
    };
  };

  public shared ({ caller }) func setTaskReminder(taskId : Nat, reminderTime : Time.Time) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set reminders");
    };

    let existingTask = tasks.get(taskId);
    switch (existingTask) {
      case (null) {
        Runtime.trap("Task not found");
      };
      case (?task) {
        if (task.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only set reminders for your own tasks");
        };
        let updatedTask = { task with reminderTime = ?reminderTime };
        tasks.add(taskId, updatedTask);
      };
    };
  };

  public shared ({ caller }) func clearTaskReminder(taskId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear reminders");
    };

    let existingTask = tasks.get(taskId);
    switch (existingTask) {
      case (null) {
        Runtime.trap("Task not found");
      };
      case (?task) {
        if (task.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only clear reminders for your own tasks");
        };
        let updatedTask = { task with reminderTime = null };
        tasks.add(taskId, updatedTask);
      };
    };
  };

  public shared ({ caller }) func createSubject(title : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create subjects");
    };

    let subject : StudySubject = {
      id = nextSubjectId;
      title;
      assignments = [];
      owner = caller;
    };

    studySubjects.add(nextSubjectId, subject);
    nextSubjectId += 1;
    subject.id;
  };

  public shared ({ caller }) func deleteSubject(subjectId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete subjects");
    };

    switch (studySubjects.get(subjectId)) {
      case (null) {
        Runtime.trap("Subject not found");
      };
      case (?subject) {
        if (subject.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own subjects");
        };
        studySubjects.remove(subjectId);
      };
    };
  };

  public query ({ caller }) func getSubjects() : async [StudySubject] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view subjects");
    };
    if (AccessControl.isAdmin(accessControlState, caller)) {
      studySubjects.values().toArray();
    } else {
      studySubjects.values().toArray().filter(
        func(subject : StudySubject) : Bool {
          subject.owner == caller;
        }
      );
    };
  };

  public shared ({ caller }) func addAssignment(subjectId : Nat, title : Text, dueDate : ?Time.Time) : async ?Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add assignments");
    };

    switch (studySubjects.get(subjectId)) {
      case (null) { Runtime.trap("Subject not found") };
      case (?subject) {
        if (subject.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only add assignments to your own subjects");
        };

        let taskId = await addTask(title);

        let assignment : Assignment = {
          id = nextAssignmentId;
          taskId;
          subjectId;
          title;
          dueDate;
          owner = caller;
        };
        let updatedAssignments = subject.assignments.concat([assignment]);
        let updatedSubject = { subject with assignments = updatedAssignments };
        studySubjects.add(subjectId, updatedSubject);
        nextAssignmentId += 1;
        ?assignment.id;
      };
    };
  };

  public shared ({ caller }) func deleteAssignment(subjectId : Nat, assignmentId : Nat) : async () {
    // Check access rights - only authenticated users can delete assignments
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete assignments");
    };

    // Retrieve the subject
    let subject = switch (studySubjects.get(subjectId)) {
      case (null) {
        Runtime.trap("Subject not found");
      };
      case (?subject) { subject };
    };

    // Find the assignment to verify ownership
    let assignmentOpt = subject.assignments.find(
      func(assignment : Assignment) : Bool {
        assignment.id == assignmentId;
      }
    );

    let assignment = switch (assignmentOpt) {
      case (null) {
        Runtime.trap("Assignment not found");
      };
      case (?a) { a };
    };

    // Authorization check: Only the assignment owner or an admin can delete it
    if (assignment.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only delete your own assignments");
    };

    // Remove the assignment from the subject's assignment list
    let updatedAssignments = subject.assignments.filter(
      func(a : Assignment) : Bool {
        a.id != assignmentId;
      }
    );

    // Update the subject with the new assignments array
    let updatedSubject = { subject with assignments = updatedAssignments };
    studySubjects.add(subjectId, updatedSubject);
  };

  public query ({ caller }) func getAssignments(subjectId : Nat) : async ?[Assignment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view assignments");
    };

    switch (studySubjects.get(subjectId)) {
      case (null) { null };
      case (?subject) {
        if (subject.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own assignments");
        };
        ?subject.assignments;
      };
    };
  };
};
