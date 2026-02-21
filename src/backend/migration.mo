import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type Gender = { #male; #female };

  type HealthData = {
    age : Nat;
    gender : Gender;
    bloodSugar : Nat;
    bloodPressure : Nat;
    cholesterol : Nat;
  };

  type Recommendation = {
    treatment : Text;
    lifestyleAdvice : Text;
  };

  type OldActor = {
    recommendations : Map.Map<Principal, Recommendation>;
  };

  type Company = {
    id : Nat;
    name : Text;
    industry : Text;
    location : Text;
  };

  type JobPosting = {
    id : Nat;
    companyId : Nat;
    title : Text;
    description : Text;
    requiredSkills : [Text];
    minCGPA : Float;
    eligibleBranches : [Text];
    postedTime : Time.Time;
    salaryRange : (Nat, Nat);
    logoUrl : ?Text;
  };

  type StudentProfile = {
    principal : Principal;
    name : Text;
    email : Text;
    cgpa : Float;
    branches : [Text];
    skills : [Text];
    resumeLink : Text;
    bio : Text;
  };

  type ApplicationStatus = { #applied; #reviewed; #interviewed; #offered; #rejected };

  type JobApplication = {
    studentId : Principal;
    jobId : Nat;
    jobTitle : Text;
    companyName : Text;
    status : ApplicationStatus;
    submittedTime : Time.Time;
  };

  type PlacementUpdate = {
    studentId : Principal;
    jobId : Nat;
    status : ApplicationStatus;
  };

  type NewInternalState = {
    var nextCompanyId : Nat;
    var nextJobId : Nat;
    var companies : Map.Map<Nat, Company>;
    var jobPostings : Map.Map<Nat, JobPosting>;
    var studentProfiles : Map.Map<Principal, StudentProfile>;
    var jobApplications : Map.Map<Nat, (JobApplication, Principal)>;
    var placementUpdates : Map.Map<Nat, PlacementUpdate>;
  };

  type NewActor = {
    var state : NewInternalState;
  };

  public func run(_old : OldActor) : NewActor {
    {
      var state = {
        var nextCompanyId = 1;
        var nextJobId = 1;
        var companies = Map.empty<Nat, Company>();
        var jobPostings = Map.empty<Nat, JobPosting>();
        var studentProfiles = Map.empty<Principal, StudentProfile>();
        var jobApplications = Map.empty<Nat, (JobApplication, Principal)>();
        var placementUpdates = Map.empty<Nat, PlacementUpdate>();
      };
    };
  };
};
