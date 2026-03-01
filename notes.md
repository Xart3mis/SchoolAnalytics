# Required Toddle Endpoints

## Academics

### Curriculums
- `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/curriculums`

The endpoint returns the list of curriculums for the organization.

### Academic Years
- `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/academic-years`

The endpoint returns the list of academic years for the organization.

### Year Groups
- `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/year-groups`

The endpoint allows you to retrieve year groups, optionally filtered by curriculum.

**Query Parameters**

| Field | Data Type | Param Name | Description |
| --- | --- | --- | --- |
| curriculumId | Integer | `curriculumId` | _Unique identifier of the curriculum program._ |

If `curriculumId` is passed, it returns all year groups for that curriculum.
If `curriculumId` is not passed, it returns all year groups for the organization.

### Grades
- `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/grades`

The endpoint allows you to retrieve grades, optionally filtered by curriculum.

**Query Parameters**

| Field | Data Type | Param Name | Description |
| --- | --- | --- | --- |
| curriculumId | Integer | `curriculumId` | _Unique identifier of the curriculum program._ |

If `curriculumId` is passed, it returns all grades for that curriculum.
If `curriculumId` is not passed, it returns all grades for the organization.

### Grading Periods
- `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/grading-periods`

The endpoint allows you to retrieve grading periods with curriculum and academic year filters.

**Query Parameters**

| Field | Data Type | Param Name | Description |
| --- | --- | --- | --- |
| curriculumProgramId | Integer | `curriculumProgramId` | _Unique identifier of the curriculum program._ |
| academicYearId | Integer | `academicYearId` | _Unique identifier of the academic year._ |

### Org Roles
- `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/org-roles`

The endpoint allows you to retrieve organization roles with optional role filters.

**Query Parameters**

| Field | Data Type | Param Name | Description |
| --- | --- | --- | --- |
| roleId | Integer | `roleId` | _Unique identifier of the role._ |
| roleLevels | String[] | `roleLevels` | _Comma-separated list of role levels to filter by._ |

## Course

### Courses
- `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/courses`

The endpoint allows you to retrieve courses with optional curriculum and course filters.
If no filters are provided, it returns all courses for the organization.

**Query Parameters**

| Field | Data Type | Param Name | Description |
| --- | --- | --- | --- |
| curriculumId | Integer | `curriculumId` | _Unique identifier of the curriculum program._ |
| courseIds | String[] | `courseIds` | _Comma-separated unique identifiers for courses._ |

If `curriculumId` is passed, it returns courses for that curriculum.
If `courseIds` is passed, it returns courses for those IDs.

### Course Students
- `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/courses/:id/students`

The endpoint allows you to retrieve students enrolled in a specific course.

**Path Parameters**

| Field | Data Type | Param Name | Description |
| --- | --- | --- | --- |
| courseId | Integer | `id` | _Unique identifier of the course._ |

## Students
- `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/students`

The endpoint allows you to retrieve students with optional filters. If no filters are provided, it returns the complete list of organization students.

**Note:** The "custom field" feature is not available for everyone and will be provided only upon school request.

**Pagination is required (use `pageNumber` and `pageSize` in query parameters).**

**Query Parameters**

| Field | Data Type | Param Name | Description |
| --- | --- | --- | --- |
| curriculumId | Integer | `curriculumId` | _Unique identifier of the curriculum program._ |
| studentIds | String[] | `studentIds` | _Comma-separated unique identifiers for students._ |
| sourceIds | String[] | `sourceIds` | _Comma-separated source IDs for students._ |
| pageNumber | Integer | `pageNumber` | _Specifies the current page index starting with 1._ |
| pageSize | Integer | `pageSize` | _Defines the number of records per page, range (100, 400)._ |
| getFutureAyStudents | Boolean | `getFutureAyStudents` | _Fetch students of a future academic year (`true` / `false`)._ |

### Teacher-Notes for Student
- `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/students/:id/teacher-note`

Using this API, you can fetch teacher notes of a student using the student ID.

**Path Parameters**

| Field | Data Type | Param Name | Description |
| --- | --- | --- | --- |
| id | N/A | `id` | _Unique identifier of the student._ |

### Student Other Info
- `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/students/:id/other-info`

Using this API, you can fetch other info for a student using the student ID.

**Path Parameters**

| Field | Data Type | Param Name | Description |
| --- | --- | --- | --- |
| id | N/A | `id` | _Unique identifier of the student._ |

## Subjects

### Subjects
- `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/subjects`

If `curriculumId` is passed, it returns all subjects of that curriculum and subjects that do not belong to any course of the organization.
If `curriculumId` is not passed, it returns all subjects of the organization.

**Query Parameters**

| Field | Data Type | Param Name | Description |
| --- | --- | --- | --- |
| curriculumId | N/A | `curriculumId` | _Unique identifier for curriculum program._ |

### Subject Groups
- `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/org-subject-groups/:curriculumId`

This API returns subject groups with all subjects and their variants.

**Path Parameters**

| Field | Data Type | Param Name | Description |
| --- | --- | --- | --- |
| curriculumId | N/A | `curriculumId` | _Unique identifier for curriculum program._ |

## Term Grades

### Term Grades
- `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/term-grades`

This API fetches term grade data for students, including ratings for subjects for the provided grading period IDs.
Supports cursor-based pagination.

**Query Parameters**

| Field | Data Type | Param Name | Description |
| --- | --- | --- | --- |
| curriculumProgramId | N/A | `curriculumProgramId` | _Unique identifier for curriculum program._ |
| academicYearId | N/A | `academicYearId` | _Unique identifier for academic year._ |
| cursor | N/A | `cursor` | _Pass the `endCursor` from the previous response to fetch the next set of entries._ |
| count | N/A | `count` | _Number of entries per page. Default is 100._ |
| criteriaType | N/A | `criteriaType` | _Use one of: `FINAL_SCORE`, `FINAL_GRADE`, `IB_DEFINED`, `LOCAL_GRADE`, `GRADE_SCALE`._ |
| gradingPeriodId | N/A | `gradingPeriodId` | _Unique identifier for grading period._ |
| showCategoryDetails | N/A | `showCategoryDetails` | _Shows category score details when `criteriaType` is `FINAL_SCORE`._ |
| studentId | N/A | `studentId` | _Unique identifier for the student._ |

### Grade Scale
- `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/grade-scale`

The endpoint allows you to retrieve grade scales, optionally filtered by curriculum program.

**Query Parameters**

| Field | Data Type | Param Name | Description |
| --- | --- | --- | --- |
| curriculumProgramId | N/A | `curriculumProgramId` | _Filter to get curriculum grade scales._ |

## Gradebook

### Progress Summary
- `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/progress-summary`

The endpoint returns gradebook progress summary entries with cursor-based pagination and filters.

**Note:** The docs section is `GET` with query parameters, but also states that all parameters should be added to the request body.

**Query Parameters**

| Field | Data Type | Param Name | Description |
| --- | --- | --- | --- |
| curriculumProgramId | Integer | `curriculumProgramId` | _Unique identifier of curriculum program. Required._ |
| ratingType | String | `ratingType` | _Use one of: `ProgressReportRatings`, `ObservationRatings`, `PlannerElementRatings`, `AssignmentRatings`, `ProjectReportRatings`. Required._ |
| sourceTitle | String | `sourceTitle` | _Unique identifier of the source title._ |
| gradingPeriodId | Integer | `gradingPeriodId` | _Unique identifier of the grading period._ |
| studentIds | Integer[] | `studentIds` | _Comma-separated unique identifiers of students._ |
| cursor | String | `cursor` | _End cursor of the previous paginated page._ |
| academicYearId | Integer | `academicYearId` | _Unique identifier of the academic year._ |
| count | Integer | `count` | _Number of rows to return (default 4000; max can change in future)._ |

## Student Flags

### FlagTypes
- `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/flag-types`

Fetches a list of flag types configured for the authenticated user's organization.
Supports filtering by enabled status, curriculum IDs, and flag type IDs.

**Query Parameters**

| Field | Data Type | Param Name | Description |
| --- | --- | --- | --- |
| isEnabled | Boolean | `isEnabled` | _Filter flag types by enabled/disabled status._ |
| curriculums | String[] | `curriculums` | _Filter flag types linked to specific curriculum IDs._ |
| ids | String[] | `ids` | _Retrieve specific flag types by their IDs._ |

### StudentFlag
- `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/student-flags`

The endpoint allows you to retrieve student flags with optional filters and cursor-based pagination.

**Query Parameters**

| Field | Data Type | Param Name | Description |
| --- | --- | --- | --- |
| studentIds | String[] | `studentIds` | _Filter by student IDs._ |
| flagTypeIds | String[] | `flagTypeIds` | _Filter by flag type IDs._ |
| activeOnly | Boolean | `activeOnly` | _Returns only currently active flags when `true`._ |
| first | Integer | `first` | _Number of records to return per page._ |
| after | String | `after` | _Cursor for pagination (used to fetch the next set of records)._ |

## Assignments

### Assignments
- `https://{{staging}}/public/v2/assignments`

Retrieves assignments associated with a curriculum program.
Supports filtering by assignment, class, teacher course, and academic year, with cursor-based pagination.

**Query Parameters**

| Field | Data Type | Param Name | Description |
| --- | --- | --- | --- |
| curriculumProgramId | String | `curriculumProgramId` | _Unique identifier of the curriculum program. Required._ |
| classIds | String[] | `classIds` | _Unique identifiers of classes. Pass multiple values as a comma-separated list._ |
| teacherCourseIds | String[] | `teacherCourseIds` | _Unique identifiers of teacher courses. Pass multiple values as a comma-separated list._ |
| assignmentId | String | `assignmentId` | _Unique identifier of the assignment._ |
| academicYearId | String | `academicYearId` | _Unique identifier of the academic year to filter assignments._ |
| count | Integer | `count` | _Number of records per page. Default is 400. Maximum allowed value is 1000._ |
| cursor | String | `cursor` | _Cursor token from the previous response (`endCursor`) used to fetch the next page of results._ |

### Assignment By Id
- `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/assignments/:id`

Fetches complete information about an assignment (title, description, due date, grading configuration, and associated class/course) by assignment ID.

**Path Parameters**

| Field | Data Type | Param Name | Description |
| --- | --- | --- | --- |
| id | N/A | `id` | _Assignment identifier._ |

### Student Assignments
- `https://{{staging}}/public/v2/student-assignments`

Retrieves student-level assignment data for a curriculum program.
Supports filtering by assignment IDs and student IDs, with cursor-based pagination.

**Query Parameters**

| Field | Data Type | Param Name | Description |
| --- | --- | --- | --- |
| curriculumProgramId | String | `curriculumProgramId` | _Unique identifier of the curriculum program. Required._ |
| assignmentIds | String[] | `assignmentIds` | _Unique identifier(s) of assignments. Pass multiple values as a comma-separated list._ |
| studentIds | String[] | `studentIds` | _Unique identifier(s) of students. Pass multiple values as a comma-separated list._ |
| count | Integer | `count` | _Number of records per page. Default is 400. Maximum allowed value is 1000._ |
| cursor | String | `cursor` | _Cursor token from the previous response (`endCursor`) used to fetch the next page of results._ |

### Student Assignment By Student Id
- `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/student-assignments/:id`

Fetches complete information for a single student assignment, identified by the provided student ID.

**Path Parameters**

| Field | Data Type | Param Name | Description |
| --- | --- | --- | --- |
| id | N/A | `id` | _Unique identifier of the student._ |
