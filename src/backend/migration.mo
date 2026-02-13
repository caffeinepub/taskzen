import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Time "mo:core/Time";

module {
  type OldUserProfile = {
    name : Text;
  };

  type OldTask = {
    id : Nat;
    title : Text;
    isCompleted : Bool;
    owner : Principal;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    tasks : Map.Map<Nat, OldTask>;
    nextTaskId : Nat;
  };

  type NewUserProfile = {
    name : Text;
  };

  type NewTask = {
    id : Nat;
    title : Text;
    isCompleted : Bool;
    owner : Principal;
    reminderTime : ?Time.Time;
  };

  type Assignment = {
    id : Nat;
    taskId : Nat;
    subjectId : Nat;
    title : Text;
    dueDate : ?Time.Time;
    owner : Principal;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
    tasks : Map.Map<Nat, NewTask>;
    studySubjects : Map.Map<Nat, StudySubject>;
    nextTaskId : Nat;
    nextSubjectId : Nat;
  };

  type StudySubject = {
    id : Nat;
    title : Text;
    assignments : [Assignment];
    owner : Principal;
  };

  public func run(old : OldActor) : NewActor {
    // Extend old task with reminderTime set to null
    let newTasks = old.tasks.map<Nat, OldTask, NewTask>(
      func(_id, oldTask) { { oldTask with reminderTime = null } }
    );

    {
      old with
      tasks = newTasks;
      nextSubjectId = 0;
      studySubjects = Map.empty<Nat, StudySubject>();
    };
  };
};
