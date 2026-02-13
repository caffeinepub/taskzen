import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  public type Task = {
    id : Nat;
    title : Text;
    isCompleted : Bool;
    owner : Principal;
    reminderTime : ?Int;
  };

  public type Assignment = {
    id : Nat;
    taskId : Nat;
    subjectId : Nat;
    title : Text;
    dueDate : ?Int;
    owner : Principal;
  };

  public type StudySubject = {
    id : Nat;
    title : Text;
    assignments : [Assignment];
    owner : Principal;
  };

  public type OldActor = {
    tasks : Map.Map<Nat, Task>;
    studySubjects : Map.Map<Nat, StudySubject>;
    completedAssignments : Map.Map<Nat, Assignment>;
    nextTaskId : Nat;
    nextSubjectId : Nat;
    nextAssignmentId : Nat;
  };

  public type NewActor = {
    tasks : Map.Map<Nat, Task>;
    studySubjects : Map.Map<Nat, StudySubject>;
    nextTaskId : Nat;
    nextSubjectId : Nat;
    nextAssignmentId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newStudySubjects = old.studySubjects.map<Nat, StudySubject, StudySubject>(
      func(_id, subject) {
        { subject with assignments = subject.assignments };
      }
    );
    {
      old with
      studySubjects = newStudySubjects;
    };
  };
};
