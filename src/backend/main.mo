import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Migration "migration";
import Iter "mo:core/Iter";
import Time "mo:core/Time";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Persistent actor state required for reminders and study zone as they MUST be preserved on canister upgrades
(with migration = Migration.run)
actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Functions
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

  // Task Management
  // TaskId and SubjectId must be persistent to guarantee uniqueness on upgrades.
  var nextTaskId : Nat = 0;
  var nextSubjectId : Nat = 0;

  public type Task = {
    id : Nat;
    title : Text;
    isCompleted : Bool;
    owner : Principal;
    reminderTime : ?Time.Time;
  };

  public type StudySubject = {
    id : Nat;
    title : Text;
    assignments : [Assignment];
    owner : Principal;
  };

  public type Assignment = {
    id : Nat;
    taskId : Nat;
    subjectId : Nat;
    title : Text;
    dueDate : ?Time.Time;
    owner : Principal;
  };

  // Use persistent variables instead of closures to avoid migration issues and make the code explicit.
  var tasks = Map.empty<Nat, Task>();
  var studySubjects = Map.empty<Nat, StudySubject>();

  // Task functions
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
        func(task) {
          task.owner == caller;
        }
      );
      filteredTasks;
    };
  };

  // Task Reminder Functions
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

  // Study Zone Functions
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

  public query ({ caller }) func getSubjects() : async [StudySubject] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view subjects");
    };
    
    if (AccessControl.isAdmin(accessControlState, caller)) {
      studySubjects.values().toArray();
    } else {
      studySubjects.values().toArray().filter(
        func(subject) {
          subject.owner == caller;
        }
      );
    };
  };

  public shared ({ caller }) func completeAssignment(taskId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete assignments");
    };

    let task = tasks.get(taskId);
    switch (task) {
      case (null) {
        Runtime.trap("Task not found");
      };
      case (?task) {
        if (task.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only complete your own assignments");
        };
      };
    };
  };

  public shared ({ caller }) func addAssignment(subjectId : Nat, title : Text, dueDate : ?Time.Time) : async ?Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add assignments");
    };

    switch (studySubjects.get(subjectId)) {
      case (null) { 
        Runtime.trap("Subject not found");
      };
      case (?subject) {
        if (subject.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only add assignments to your own subjects");
        };
        
        let taskId = await addTask(title);
        
        let assignment : Assignment = {
          id = subject.assignments.size();
          taskId;
          subjectId;
          title;
          dueDate;
          owner = caller;
        };
        let updatedAssignments = subject.assignments.concat([assignment]);
        let updatedSubject = { subject with assignments = updatedAssignments };
        studySubjects.add(subjectId, updatedSubject);
        ?assignment.id;
      };
    };
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
