import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";

// Apply data migration if needed

actor {
  include MixinStorage();

  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type Company = {
    id : Nat;
    name : Text;
    industry : Text;
    location : Text;
  };

  public type JobPosting = {
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

  public type StudentProfile = {
    principal : Principal;
    name : Text;
    email : Text;
    cgpa : Float;
    branches : [Text];
    skills : [Text];
    resumeLink : Text;
    bio : Text;
  };

  public type ApplicationStatus = { #applied; #reviewed; #interviewed; #offered; #rejected };

  public type JobApplication = {
    studentId : Principal;
    jobId : Nat;
    jobTitle : Text;
    companyName : Text;
    status : ApplicationStatus;
    submittedTime : Time.Time;
  };

  public type PlacementUpdate = {
    studentId : Principal;
    jobId : Nat;
    status : ApplicationStatus;
  };

  // User profile type for frontend compatibility
  public type UserProfile = StudentProfile;

  type InternalState = {
    var nextCompanyId : Nat;
    var nextJobId : Nat;
    var companies : Map.Map<Nat, Company>;
    var jobPostings : Map.Map<Nat, JobPosting>;
    var studentProfiles : Map.Map<Principal, StudentProfile>;
    var jobApplications : Map.Map<Nat, (JobApplication, Principal)>;
    var placementUpdates : Map.Map<Nat, PlacementUpdate>;
  };

  var state : InternalState = {
    var nextCompanyId = 1;
    var nextJobId = 1;
    var companies = Map.empty<Nat, Company>();
    var jobPostings = Map.empty<Nat, JobPosting>();
    var studentProfiles = Map.empty<Principal, StudentProfile>();
    var jobApplications = Map.empty<Nat, (JobApplication, Principal)>();
    var placementUpdates = Map.empty<Nat, PlacementUpdate>();
  };

  // Required profile management functions for frontend
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    state.studentProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or must be admin");
    };
    state.studentProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let updatedProfile = {
      profile with
      principal = caller;
    };
    state.studentProfiles.add(caller, updatedProfile);
  };

  // Companies - Admin only for adding
  public shared ({ caller }) func addCompany(name : Text, industry : Text, location : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add companies");
    };

    let companyId = state.nextCompanyId;
    let company : Company = {
      id = companyId;
      name;
      industry;
      location;
    };
    state.companies.add(companyId, company);
    state.nextCompanyId += 1;
    companyId;
  };

  // Public access - anyone can view companies
  public query ({ caller }) func getCompanies() : async [Company] {
    state.companies.values().toArray();
  };

  // Job Postings - Admin only for adding
  public shared ({ caller }) func addJobPosting(
    companyId : Nat,
    title : Text,
    description : Text,
    requiredSkills : [Text],
    minCGPA : Float,
    eligibleBranches : [Text],
    salaryRange : (Nat, Nat),
    logoUrl : ?Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add job postings");
    };

    if (not state.companies.containsKey(companyId)) {
      Runtime.trap("Company does not exist");
    };

    let jobId = state.nextJobId;
    let jobPosting : JobPosting = {
      id = jobId;
      companyId;
      title;
      description;
      requiredSkills;
      minCGPA;
      eligibleBranches;
      postedTime = Time.now();
      salaryRange;
      logoUrl;
    };

    state.jobPostings.add(jobId, jobPosting);
    state.nextJobId += 1;
    jobId;
  };

  // Public access - anyone can view job postings
  public query ({ caller }) func getJobPostings() : async [JobPosting] {
    state.jobPostings.values().toArray();
  };

  // Public access - anyone can view job postings by company
  public query ({ caller }) func getJobPostingsByCompany(companyId : Nat) : async [JobPosting] {
    state.jobPostings.values().toArray().filter(
      func(job) {
        job.companyId == companyId;
      }
    );
  };

  // Student Profiles - User only
  public shared ({ caller }) func createStudentProfile(name : Text, email : Text, cgpa : Float, branches : [Text], skills : [Text], resumeLink : Text, bio : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create student profiles");
    };

    let profile : StudentProfile = {
      principal = caller;
      name;
      email;
      cgpa;
      branches;
      skills;
      resumeLink;
      bio;
    };
    state.studentProfiles.add(caller, profile);
  };

  // User only - can only update own profile
  public shared ({ caller }) func updateStudentProfile(name : Text, email : Text, cgpa : Float, branches : [Text], skills : [Text], resumeLink : Text, bio : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update student profiles");
    };

    await createStudentProfile(name, email, cgpa, branches, skills, resumeLink, bio);
  };

  // Admins can view any profile, users can view any profile (for browsing)
  public query ({ caller }) func getStudentProfile(principal : Principal) : async ?StudentProfile {
    state.studentProfiles.get(principal);
  };

  // Job Applications - User only
  public shared ({ caller }) func applyForJob(jobId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can apply for jobs");
    };

    let studentProfile = switch (state.studentProfiles.get(caller)) {
      case (null) { Runtime.trap("Student profile not found") };
      case (?profile) { profile };
    };

    let jobPosting = switch (state.jobPostings.get(jobId)) {
      case (null) { Runtime.trap("Job posting not found") };
      case (?job) { job };
    };

    if (studentProfile.cgpa < jobPosting.minCGPA) {
      Runtime.trap("Student does not meet the minimum CGPA requirement");
    };

    let hasEligibleBranch = studentProfile.branches.any(
      func(branch) {
        jobPosting.eligibleBranches.any(
          func(eligible) {
            eligible == branch;
          }
        );
      }
    );
    if (not hasEligibleBranch) {
      Runtime.trap("Student's branch is not eligible");
    };

    let application : JobApplication = {
      studentId = caller;
      jobId;
      jobTitle = jobPosting.title;
      companyName = state.companies.get(jobPosting.companyId).unwrap().name;
      status = #applied;
      submittedTime = Time.now();
    };

    state.jobApplications.add(jobId, (application, caller));
    addPlacementUpdate(caller, jobId, #applied);
  };

  // Admin only - placement coordinators update application status
  public shared ({ caller }) func updateApplicationStatus(studentId : Principal, jobId : Nat, status : ApplicationStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update application status");
    };

    let application = switch (state.jobApplications.get(jobId)) {
      case (null) { Runtime.trap("Job application not found") };
      case (?app) {
        if (app.1 != studentId) {
          Runtime.trap("Application does not match student ID");
        };
        app.0;
      };
    };

    let updatedApplication = {
      application with
      status = status;
    };

    state.jobApplications.add(jobId, (updatedApplication, studentId));
    addPlacementUpdate(studentId, jobId, status);
  };

  func addPlacementUpdate(studentId : Principal, jobId : Nat, status : ApplicationStatus) {
    let update : PlacementUpdate = {
      studentId;
      jobId;
      status;
    };
    state.placementUpdates.add(jobId, update);
  };

  // Users can view their own applications, admins can view any
  public query ({ caller }) func getJobApplication(studentId : Principal, jobId : Nat) : async ?JobApplication {
    if (caller != studentId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own applications or must be admin");
    };

    switch (state.jobApplications.get(jobId)) {
      case (null) { null };
      case (?app) {
        if (app.1 != studentId) { null } else { ?app.0 };
      };
    };
  };

  // User only - view own applied jobs
  public query ({ caller }) func getAppliedJobs() : async [JobApplication] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their applied jobs");
    };

    let filtered = state.jobApplications.toArray().filter(
      func(tuple) { tuple.1.1 == caller }
    );
    let result = if (filtered.size() > 0) {
      filtered.map(func(tuple) { tuple.1.0 });
    } else {
      [];
    };
    result;
  };
};
