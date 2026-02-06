# Toddle Open API  - V2

## Overview
Please use the following URL format:
https://{region-name}-production-apis.toddleapp.com

You can replace "{ region-name}" with any of the following options:

eu-west-1

us-east-1

me-central-1

ap-southeast-2

ap-southeast-1

cn-north-1

For example:

https://eu-west-1-production-apis.toddleapp.com

V2 supports

Required validations

All endpoints of V1

Create course now support course creation for all curriculums

Support to create course in any academic year.

Archive/Unarchive endpoints for course/staff/students

Curriculum wise list of courses/grades/staff/students

List subjects endpoint added

List curriculums endpoint added

List academic year endpoint added

Support to add designation while creating staff

Year group is mandatory for student creation

NOTE : Please insert all the IDs in String format.

## Authentication
Bearer token via `Authorization` header.
Example: `Authorization: Bearer <token>`

## Endpoints

## Academics
This section contains a brief description of the curriculum, acadecmic year, grades and grading period API endpoints, including the request and response formats for fetching data.

### Get Curriculums
Method: `GET`
Path: `/public/v2/curriculums`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/curriculums`

Description:
This endpoint will return the list of curriculums of the organization

Auth: Bearer token (`Authorization: Bearer <token>`)

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/curriculums" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 200 OK
```json
{
    "response": {
        "curriculums": [
            {
                "id": "284899890096511865",
                "title": "UBD",
                "label": "N7 Subjects",
                "setupType": "SUBJECT_BASED_GRADING",
                "organizationId": "284898051347201887",
                "organizationName": "N7 Academy",
                "isTeacherCourseEnabled": true,
                "gradebookVersion": "2"
            },
            {
                "id": "284899890130066299",
                "title": "IB_MYP",
                "label": "Middle School",
                "setupType": "SUBJECT_BASED_GRADING",
                "organizationId": "284898051347201887",
                "organizationName": "N7 Academy",
                "isTeacherCourseEnabled": true,
                "gradebookVersion": "2"
            },
            {
                "id": "284899890109094778",
                "title": "UBD",
                "label": "N7 Courses",
                "setupType": "COURSE_BASED_GRADING",
                "organizationId": "284898051347201887",
                "organizationName": "N7 Academy",
                "isTeacherCourseEnabled": true,
                "gradebookVersion": "2"
            }
        ]
    }
}
```

### Get Academic Years
Method: `GET`
Path: `/public/v2/academic-years`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/academic-years`

Description:
This endpoint will return a list of academic_years of the organization

Auth: Bearer token (`Authorization: Bearer <token>`)

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/academic-years" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "academicYears": [
            {
                "id": "101422320425377671",
                "organization_id": "11381",
                "start_date": "2025-08-31T00:00:00.000Z",
                "end_date": "2026-04-01T00:00:00.000Z"
            },
            {
                "id": "17407",
                "organization_id": "11381",
                "start_date": "2024-04-08T00:00:00.000Z",
                "end_date": "2025-08-30T00:00:00.000Z"
            },
            {
                "id": "17406",
                "organization_id": "11381",
                "start_date": "2023-03-18T00:00:00.000Z",
                "end_date": "2024-04-01T00:00:00.000Z"
            },
            {
                "id": "17405",
                "organization_id": "11381",
                "start_date": "2022-03-18T00:00:00.000Z",
                "end_date": "2023-03-17T00:00:00.000Z"
            }
       ]
    }
}
```

### Get Year Groups
Method: `GET`
Path: `/public/v2/year-groups`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/year-groups`

Description:
Query Parameter

Field
Data Type
Required

curriculumId
Integer
No

If curriculumId is passed, it will return all the Year groups of that particular curriculum.

if curriculumId is not passed, it will return all the Year groups of this organisation.

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| curriculumId | <curriculumId> | Unique identifier of the curriculum program. | yes |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/year-groups" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "yearGroups": [
            {
                "id": "101424750252801961",
                "name": "Class of 2025 (DP)",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59187",
                        "name": "DP 1 $%^&^"
                    }
                ]
            },
            {
                "id": "277636480245963903",
                "name": "Class of 25 (MYP)",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59192",
                        "name": "Year 1 @#$%"
                    }
                ]
            },
            {
                "id": "278036772737260711",
                "name": "Batch of 2025",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59201",
                        "name": "Parent Toddler %^^&"
                    }
                ]
            },
            {
                "id": "278036772762426536",
                "name": "Batch of 2025",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59195",
                        "name": "Play Group"
                    }
                ]
            },
            {
                "id": "278036772762426537",
                "name": "Batch of 2025",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59196",
                        "name": "Pre-K"
                    }
                ]
            },
            {
                "id": "278036772762426538",
                "name": "Batch of 2025",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59197",
                        "name": "K1"
                    }
                ]
            },
            {
                "id": "278036772762426539",
                "name": "Batch of 2034",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59198",
                        "name": "K2"
                    }
                ]
            },
            {
                "id": "278036772762426540",
                "name": "Batch of 2033",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59199",
                        "name": "Grade 1.0"
                    }
                ]
            },
            {
                "id": "278036772762426541",
                "name": "Batch of 2032",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59200",
                        "name": "Grade 2"
                    }
                ]
            },
            {
                "id": "278036772762426542",
                "name": "Batch of 2031",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59202",
                        "name": "Grade 3"
                    }
                ]
            },
            {
                "id": "278036772762426543",
                "name": "Batch of 2030",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59203",
                        "name": "Grade 4"
                    }
                ]
            },
            {
                "id": "278036772762426544",
                "name": "Batch of 2029",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59204",
                        "name": "Grade 5"
                    }
                ]
            },
            {
                "id": "278036772762426545",
                "name": "Batch of 2028",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59205",
                        "name": "Grade 6"
                    }
                ]
            },
            {
                "id": "278036772762426546",
                "name": "Batch of 2027",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59206",
                        "name": "Others"
                    }
                ]
            },
            {
                "id": "278036772762426547",
                "name": "Batch of 2026",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "28634165750541914",
                        "name": "Others 2"
                    }
                ]
            },
            {
                "id": "289244209905409799",
                "name": "Class of 2k25",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59152",
                        "name": "Parent Toddler %%^"
                    }
                ]
            },
            {
                "id": "289881578018971493",
                "name": "Batch of 2044",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59182",
                        "name": "Pre-K"
                    }
                ]
            },
            {
                "id": "289881578023165798",
                "name": "Batch of 2043",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59170",
                        "name": "Parent Toddler"
                    }
                ]
            },
            {
                "id": "289881578027360103",
                "name": "Batch of 2042",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59169",
                        "name": "Play Group"
                    }
                ]
            },
            {
                "id": "289881578027360104",
                "name": "Batch of 2041",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59176",
                        "name": "K1"
                    }
                ]
            },
            {
                "id": "289881578027360105",
                "name": "Batch of 2040",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59186",
                        "name": "Other"
                    }
                ]
            },
            {
                "id": "289881578027360106",
                "name": "Batch of 2039",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59181",
                        "name": "K2"
                    }
                ]
            },
            {
                "id": "289881578027360107",
                "name": "Batch of 2038",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59185",
                        "name": "Grade 1"
                    }
                ]
            },
            {
                "id": "289881578031554412",
                "name": "Batch of 2037",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59178",
                        "name": "Grade 2"
                    }
                ]
            },
            {
                "id": "289881578031554413",
                "name": "Batch of 2036",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59179",
                        "name": "Grade 3"
                    }
                ]
            },
            {
                "id": "289881578031554414",
                "name": "Batch of 2035",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59172",
                        "name": "Grade 4"
                    }
                ]
            },
            {
                "id": "289881578031554415",
                "name": "Batch of 2034",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59174",
                        "name": "Grade 5"
                    }
                ]
            },
            {
                "id": "289881578031554416",
                "name": "Batch of 2033",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59184",
                        "name": "Grade 6"
                    }
                ]
            },
            {
                "id": "289881578031554417",
                "name": "Batch of 2032",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59171",
                        "name": "Grade 7"
                    }
                ]
            },
            {
                "id": "289881578031554418",
                "name": "Batch of 2031",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59183",
                        "name": "Grade 8"
                    }
                ]
            },
            {
                "id": "289881578031554419",
                "name": "Batch of 2030",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59180",
                        "name": "Grade 9"
                    }
                ]
            },
            {
                "id": "289881578031554420",
                "name": "Batch of 2029",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59175",
                        "name": "Grade 10"
                    }
                ]
            },
            {
                "id": "289881578031554421",
                "name": "Batch of 2028",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59173",
                        "name": "Grade 11"
                    }
                ]
            },
            {
                "id": "289881578031554422",
                "name": "Batch of 2027",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "59177",
                        "name": "Grade 12"
                    }
                ]
            },
            {
                "id": "289881578031554423",
                "name": "Batch of 2026",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "28634228006596187",
                        "name": "Others 2"
                    }
                ]
            },
            {
                "id": "290727233910218678",
                "name": "Batch of 2033",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "287901697878002463",
                        "name": "Grade 5"
                    }
                ]
            },
            {
                "id": "290727233914412983",
                "name": "Batch of 2032",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "287901697882196768",
                        "name": "Grade 6"
                    }
                ]
            },
            {
                "id": "290727233914412984",
                "name": "Batch of 2031",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "287901697882196769",
                        "name": "Grade 7"
                    }
                ]
            },
            {
                "id": "290727233914412985",
                "name": "Batch of 2030",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "287901697882196770",
                        "name": "Grade 8"
                    }
                ]
            },
            {
                "id": "290727233914412986",
                "name": "Batch of 2029",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "287901697882196771",
                        "name": "Grade 9"
                    }
                ]
            },
            {
                "id": "290727233914412987",
                "name": "Batch of 2028",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "287901697882196772",
                        "name": "Grade 10"
                    }
                ]
            },
            {
                "id": "290727233914412988",
                "name": "Batch of 2027",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "287901697882196773",
                        "name": "Others 1"
                    }
                ]
            },
            {
                "id": "290727233918607293",
                "name": "Batch of 2026",
                "organizationName": "Class Stream",
                "organizationId": "11381",
                "grades": [
                    {
                        "id": "287901697882196774",
                        "name": "Others 2"
                    }
                ]
            }
        ]
    }
}
```

### Get Grades
Method: `GET`
Path: `/public/v2/grades`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/grades?curriculumId=<curriculumId>`

Description:
Query Parameters

Field
Data Type
Required

curriculumId
Integer
No

If curriculumId is passed, it will return all the grades of that particular curriculum.

if curriculumId is not passed, it will return all the students of this organisation.

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| curriculumId | <curriculumId> | Unique identifier of the curriculum program. | no |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/grades?curriculumId=<curriculumId>" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "grades": [
            {
                "id": "59192",
                "name": "Year 1 @#$%",
                "curriculumType": "IB_MYP",
                "curriculumId": "13065",
                "organizationId": "11381"
            },
            {
                "id": "59189",
                "name": "Year 2",
                "curriculumType": "IB_MYP",
                "curriculumId": "13065",
                "organizationId": "11381"
            },
            {
                "id": "59190",
                "name": "Year 3",
                "curriculumType": "IB_MYP",
                "curriculumId": "13065",
                "organizationId": "11381"
            },
            {
                "id": "59191",
                "name": "Year 4",
                "curriculumType": "IB_MYP",
                "curriculumId": "13065",
                "organizationId": "11381"
            },
            {
                "id": "59193",
                "name": "Year 5",
                "curriculumType": "IB_MYP",
                "curriculumId": "13065",
                "organizationId": "11381"
            },
            {
                "id": "59194",
                "name": "Others",
                "curriculumType": "IB_MYP",
                "curriculumId": "13065",
                "organizationId": "11381"
            }
        ]
    }
}
```

### Grading Periods
Method: `GET`
Path: `/public/v2/grading-periods`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/grading-periods?curriculumProgramId=<curriculumId>`

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| curriculumProgramId | <curriculumId> | Unique Identifier for curriculum program | no |
| academicYearId | <academicYearId> | Unique Identifier for academic year | yes |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/grading-periods?curriculumProgramId=<curriculumId>" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": [
        {
            "id": "277634214763957306",
            "name": "T1",
            "label": "Term 1",
            "type": "REPORTING",
            "startDate": "2025-08-31",
            "endDate": "2025-09-30",
            "academicYearId": "101422320425377671",
            "curriculumProgramId": "13065",
            "isCurrentAcademicYear": true
        }
    ]
}
```

### Get Org Roles
Method: `GET`
Path: `/public/v2/org-roles`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/org-roles`

Description:
For roleLevel filter use any roleLevel : ACCOUNT, SCHOOL, CLASS, COURSE.

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| roleId | integer | To get details of specific role of an organization. | yes |
| roleLevels | [] string | To get all roles at the same Level in organization | yes |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/org-roles" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "roles": [
            {
                "roleId": "284888148763220490",
                "roleName": "Substitute Teacher",
                "roleDescription": "Substitute Teacher",
                "roleLevel": "CLASS",
                "organizationId": "284888126562778974"
            }
        ]
    }
}
```

## Course
This section contains a brief description of the course API endpoints, including the request and response formats for creating or updating course, fetching course data.

### Get Courses
Method: `GET`
Path: `/public/v2/courses`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/courses`

Description:
if any query parameter is not passed, it will return all the courses of this organisation.

If curriculumId is passed, it will return all the courses of that particular curriculum.

If courseIds is passed, it will return the courses for those ids.

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| curriculumId | <curriculumId> | Unique identifier of the curriculum program. | yes |
| courseIds | [] String | A comma-separated list of course IDs | yes |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/courses" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
  "response": {
    "courses": {
      "id": "148835622436479213",
      "title": "Teaching IPad Basics To Young Children",
      "curriculumId": "89937659681571156",
      "isArchived": false,
      "sourceId": "TDC-148835622436479213",
      "grades": [
        {
          "id": "89937676303601838",
          "grade": "17",
          "name": "DP 2"
        }
      ],
      "subjects": [
        {
          "id": "130075117521732429",
          "name": "Others"
        }
      ],
      "sisId": "5242",
      "subjectLevels": [],
      "resposneLanguage": []
    }
  }
}
```

### Update Course
Method: `PUT`
Path: `/public/v2/courses/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/courses/:id`

Description:
Request Body

Field
Data type
Required

title
String
No

This api will update the course using courseid.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <courseId> | Unique Identifier for Course |

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/courses/:id" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "course": {
            "id": 109012,
            "title": "Test Course",
            "grades": [
                "64431",
                "64432"
            ]
        }
    }
}
```

### Create Course
Method: `POST`
Path: `/public/v2/courses`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/courses`

Description:
Request Body

Field
Data Type
Required

title
String
Yes

grades
Array [ String ]
Yes

academicYearId
String
Yes

subjectIds
Array [ String ]
No

responseLanguageIds
Array [ String ]
No

subjectLevelIds
Array [ String ]
No

curriculumProgramId
String
Yes

staffIds
Array [ String ]
No

studentIds
Array [ String ]
No

sourcedId
String
No

subjectLevelIds and responseLanguageIds are only supproted in DP curriculum.
In DP and MYP only one subjectId to be passed, as they supprot only single subject.
In PYP no subjects to be passed, as there isn't subject support.
In UBD multiple subjects can be passed.
If academicYearId is not passed, it will take currentAcademicYear as default value.
In Get Subjects API you can find subjectLevelIds and responseLanguageIds.

Auth: Bearer token (`Authorization: Bearer <token>`)

Example Request (cURL):
```bash
curl -X POST "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/courses" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "course": {
            "id": 110828,
            "title": "Test Course",
            "grades": [
                "64921"
            ]
        }
    }
}
```

### Archive Course
Method: `PUT`
Path: `/public/v2/courses/:id/archive`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/courses/:id/archive`

Description:
Api to archive course for the given id.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <courseId> | Unique Identifier for Course |

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/courses/:id/archive" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "course": {
            "id": 109705,
            "title": "New Course",
            "grades": [
                "64920"
            ],
            "is_archived": true
        }
    }
}
```

### Unarchive Course
Method: `PUT`
Path: `/public/v2/courses/:id/unarchive`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/courses/:id/unarchive`

Description:
Api to unarchive course of given id.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <courseId> | Unique Identifier for Course |

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/courses/:id/unarchive" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "course": {
            "id": 109705,
            "title": "New Course",
            "grades": [
                "64920"
            ],
            "is_archived": false
        }
    }
}
```

### Course Students
Method: `GET`
Path: `/public/v2/courses/:id/students`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/courses/:id/students`

Description:
Endpoint to fetch students of course.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <courseId> | Unique Identifier for Course |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/courses/:id/students" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "students":[
            {
                "id": "289636822659644137",
                "dob": null,
                "city": null,
                "email": "ab@gmail.com",
                "sisId": "3292969",
                "state": null,
                "gender": null,
                "country": null,
                "zipcode": null,
                "families": [],
                "lastName": "Student",
                "sourceId": "284898051347201887",
                "createdAt": "2025-09-02T13:02:53.089618",
                "firstName": "Test",
                "isBlocked": false,
                "languages": [],
                "updatedAt": "2025-09-02T13:02:54.666067",
                "yearGroup": "Batch of 2026",
                "birthPlace": null,
                "isArchived": false,
                "middleName": null,
                "nationalId": null,
                "phoneNumber": null,
                "yearGroupId": "285774167712734639",
                "addressLine1": null,
                "addressLine2": null,
                "profileImage": null,
                "personalEmail": null,
                "preferredName": null,
                "contactDetails": [],
                "organizationId": "284898051347201887",
                "secondaryEmail": null,
                "last_name_locale": null,
                "organizationName": "N7 Academy",
                "first_name_locale": null,
                "primaryNationality": null,
                "registrationCategory": null,
                "secondaryNationality": null,
                "eighth_additional_field": null,
                "seventh_additional_field": null,
                "custom_fields": {},
                "familyInviteCode": "Y655345345345JG3",
                "studentSignInCode": "4365443",
                "grade": "Parent Toddler",
                "gradeLevelId": "284899893728774340",
                "academicYears": [
                    {
                        "id": "284898051544333908",
                        "startdate": "2025-08-20T00:00:00.000Z",
                        "endDate": "2026-08-19T00:00:00.000Z",
                        "isCurrent": true,
                        "student_grade": "Parent Toddler"
                    }
                ],
                "courseId": "290731010952276502",
                "courseName": "New History Class",
                "subjectLevel": null
            }
        ]
    }
}
```

### Add Students to Course
Method: `PUT`
Path: `/public/v2/courses/:id/students/add`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/courses/:id/students/add`

Description:
Request body

Field
Data Type
Required

studentIds
Array [ String ]
Yes

subjectLevelId
String
No

1. The provided API is used to add students to a course based on the courseId and their respective studentIds.
2. In courses following the DP (Diploma Programme) curriculum, there is an optional field called subjectLevelId.
3. The subjectLevelId is used to assign subject levels to the students being added to the DP curriculum course.
4. If subjectLevelId is not provided for DP curriculum courses, a default subject level will be assigned to the added students.
5. To obtain the subjectLevelIds data, you can refer to the Get Subjects API.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <courseId> | Unique Identifier for Course |

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/courses/:id/students/add" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "students": {
            "studentIds": [
                "289636822659644137"
            ],
            "courseId": "290731010952276502",
            "courseTitle": "New History Class"
        }
    }
}
```

### Remove Students from Course
Method: `PUT`
Path: `/public/v2/courses/:id/students/remove`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/courses/:id/students/remove`

Description:
Request body

Field
Data Type
Required

studentIds
Array [ String ]
Yes

The provided API removes students from a course using their staffIds and the corresponding courseId.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <courseId> | Unique Identifier for Course |

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/courses/:id/students/remove" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "students": {
            "studentIds": [],
            "courseId": "290731010952276502",
            "courseTitle": "New History Class"
        }
    }
}
```

### Course Staff
Method: `GET`
Path: `/public/v2/courses/:id/staffs`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/courses/:id/staffs`

Description:
End point to fetch staff of a coruse.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <courseId> | Unique Identifier for Course |

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| isPrimarySubjectTeacher | true | A filter to fetch the staff who are the primary teacher of at least 1 subject. | yes |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/courses/:id/staffs" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "staff": [
            {
                "id": "289636823221680884",
                "firstName": "Betty",
                "lastName": "Tyler",
                "email": "bettytyler@gmail.com.blackbaud",
                "gender": null,
                "courseId": "292153948909874774",
                "courseName": "11 New History Class",
                "courseRole": "Class Observer",
                "primaryTeacherSubjects": [
                    "284899893821060247"
                ]
            },
            {
                "id": "289636824387697410",
                "firstName": "Caitlin",
                "lastName": "Warner",
                "email": "caitlinwarner@gmail.com.blackbaud",
                "gender": null,
                "courseId": "292153948909874774",
                "courseName": "11 New History Class",
                "courseRole": "Class Teacher",
                "primaryTeacherSubjects": [
                    "284899893821060244",
                    "284899893821060245"
                ]
            },
            {
                "id": "289636824563858187",
                "firstName": "Bill",
                "lastName": "Palmerton",
                "email": "billpalmerton@gmail.com.blackbaud",
                "gender": null,
                "courseId": "292153948909874774",
                "courseName": "11 New History Class",
                "courseRole": "Class Teacher",
                "primaryTeacherSubjects": [
                    "284899893821060244",
                    "284899893821060245"
                ]
            },
            {
                "id": "289636824706464530",
                "firstName": "Alex",
                "lastName": "Dalbello",
                "email": "student17a@blackbaud.com.blackbaud",
                "gender": null,
                "courseId": "292153948909874774",
                "courseName": "11 New History Class",
                "courseRole": "Class Teacher",
                "primaryTeacherSubjects": [
                    "284899893821060244",
                    "284899893821060245"
                ]
            },
            {
                "id": "300776632937881678",
                "firstName": "Ben",
                "lastName": "Stokes",
                "email": "ben.ten@mail.com",
                "gender": null,
                "courseId": "292153948909874774",
                "courseName": "11 New History Class",
                "courseRole": "Class Teacher",
                "primaryTeacherSubjects": [
                    "284899893821060245",
                    "284899893821060246"
                ]
            }
        ]
    }
}
```

### Add Staff to Course
Method: `PUT`
Path: `/public/v2/courses/:id/staffs/add`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/courses/:id/staffs/add`

Description:
Request body

Field
Data Type
Required

staffs
Array [{ id , roleId }]
Yes

This apis takes courseId, to which we need to add staff using thier ids ( staffIds) and roleId (use the Get Org Roles API (found under the Academics section)).

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <courseId> | Unique Identifier for Course |

Request Body (raw):
```json
{
    "staffs": [
        {
            "id": "289930364636380802",
            "roleId": "284888148763220490"
        }
    ]
}
```

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/courses/:id/staffs/add" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  --data-raw "{
    \"staffs\": [
        {
            \"id\": \"289930364636380802\",
            \"roleId\": \"284888148763220490\"
        }
    ]
}"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "staff": {
            "response": {
                "addedStaffV2": [
                    {
                        "id": "289930364636380802",
                        "roleId": "284888148763220490"
                    }
                ],
                "courseId": "299749917847459636",
                "courseTitle": "Maths"
            }
        }
    }
}
```

### Remove Staff from Course
Method: `PUT`
Path: `/public/v2/courses/:id/staffs/remove`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/courses/:id/staffs/remove`

Description:
Request body

Field
Data Type
Required

staffIds
Array [ String ]
Yes

This apis takes courseid, from which we need to remove staff using thier ids. ( staffids)

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <courseId> | Unique Identifier for Course |

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/courses/:id/staffs/remove" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "staffs": {
            "staffIds": [
                "289636824165399293"
            ],
            "courseId": "289636810571654617",
            "courseTitle": "Updated Title"
        }
    }
}
```

## Students
This section contains a brief description of the Students API endpoints, including the request and response formats for creating or updating Students, fetching Students data.

### Get Students
Method: `GET`
Path: `/public/v2/students`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/students`

Description:
The endpoint allows you to retrieve students with optional filters. If no filters are provided, it returns the complete list of organization students.

Note: The "custom field" feature is not available for everyone and will be provided only upon school request.

** Pagination is Required (Use pageNumber and pageSize in Query Params)**

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| curriculumId | <curriculumId> | Unique identifier of the curriculum program. | yes |
| studentIds | [] String | Comma seperated unique Identifiers for students | yes |
| sourceIds | [] String | Comma seperated sourceId for students | yes |
| pageNumber | Integer | Specifies the current page index starting with 1 | yes |
| pageSize | Integer | Defines the number of records per page, range ( 100, 400 ) | yes |
| getFutureAyStudents | Boolean | To fetch the student of future academic year. [ true / false ] | yes |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/students" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
  "response": {
    "students": [
      {
        "id": "139493666430390074",
        "city": "NANNING, GUANGXI",
        "email": "24039869test@edu.my",
        "grade": "Play Group",
        "sisId": null,
        "state": "",
        "gender": "M",
        "country": "CN",
        "zipcode": "53000",
        "profileImage": null,
        "preferredName": "Zhou",
        "families": [
          {
            "id": "162356797393342303",
            "email": "goshdsfafafi.t@gmail.com",
            "gender": null,
            "last_name": "TSUKAMOTO",
            "created_at": "2024-09-16T07:37:30.317532",
            "first_name": "MR GOSHI",
            "updated_at": "2024-09-18T08:39:08.072624",
            "profile_image": null,
            "relationship": "Uncle"
          },
          {
            "id": "162384011438591852",
            "email": "gos4e@gmail.com",
            "gender": null,
            "last_name": "TSUKAMOTO",
            "created_at": "2024-09-16T09:25:38.651543",
            "first_name": "MRS GOSHI",
            "updated_at": "2024-09-16T09:25:38.651546",
            "profile_image": null
          }
        ],
        "lastName": "ZHOU",
        "sourceId": "240343439869",
        "createdAt": "2024-07-15T05:27:35.119497",
        "firstName": "GANG",
        "updatedAt": "2024-08-14T05:24:55.974749",
        "yearGroup": "YG1",
        "isArchived": true,
        "isBlocked": false,
        "middleName": null,
        "addressLine1": "02, BSHANGHUI, ANJI STREET,",
        "addressLine2": "IANGTANG, DISTRICT",
        "custom_fields": {
          "student_oen": "OEN99999",
          "residential_street_1": "BUILDING 8, DASUI,STREET,",
          "residential_street_2": "XNGTANG, DISTRICT",
          "residential_postcode": "53890",
          "residential_city": "NANNING,NGXI",
          "personal_email": "ganj@gmyai2l.com",
          "phone_number": "01226888",
          "pdpa_consent": "Y",
          "family_id": "S0394694",
          "residential_tel_no": "999999999999",
          "residential_country": "CHINA",
          "residential_state": null
        },
        "contactDetails": [
          {
            "id": "162357925057148020",
            "email": "ben_stokess@139.cn",
            "lastName": "TSUKAMOTO",
            "firstName": "MRS GOSHI",
            "phoneNumber": 4389584359,
            "relationship": "Mother"
          },
          {
            "id": "162374385565447286",
            "email": "goshdsfafafi.t@gmail.com",
            "lastName": "TSUKAMOTO",
            "firstName": "MR GOSHI",
            "phoneNumber": 348098349023,
            "relationship": "Father"
          }
        ],
        "organizationId": 12507,
        "secondaryEmail": "ga@gmayil.com",
        "organizationName": "schoolbase - staging",
        "registrationCategory": null,
        "last_name_local": "Last Name User",
        "pronouns": null,
        "class&section": "23 B",
        "eighth_additional_field": null,
        "secondary_nationality": null,
        "first_language": null,
        "second_language": null,
        "national_id": null,
        "first_name_locale": null,
        "dob": "2005 06 28",
        "primary_nationality": "CN",
        "birth_place": null,
        "regional_locale": null,
        "birth_place_locale": null,
        "dob_locale": null,
        "primary_nationality_locale": null,
        "familyInviteCode": "OGOJBXV",
        "studentSignInCode": "STN6346",
        "academicYears": [
          {
            "id": "20614",
            "startdate": "2024-07-10T00:00:00.000Z",
            "endDate": "2025-07-09T00:00:00.000Z",
            "student_grade": null
          }
        ]
      }
    ],
    "pageNumber": 1,
    "responseSize": 1,
    "totalStudents": "1"
  }
}
```

### Update Student
Method: `PUT`
Path: `/public/v2/students/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/students/:id`

Description:
Field Name
Data Type
Description
Required

firstName
String
First Name of the student
No

lastName
String
Last Name of the student
No

preferredName
String
Preferred Name of the student
No

email
String
Email of the student
No

gender
String
Gender of the student (values: M, F, X)
No

sourceId
String
Source ID of the student
No

dob
String
Date of Birth (YYYY-MM-DD)
No

primaryNationality
String
Primary Nationality in ISO 3166-1 alpha-2 code
No

secondaryNationality
String
Secondary Nationality in ISO 3166-1 alpha-2 code
No

secondaryEmail
String
Secondary email which can be used to login
No

languages
Array [String]
Array of languages code in ISO 639-1 alpha-3 code
No

addressLine1
String
Address line 1 of the student
No

addressLine2
String
Address line 2 of the student
No

city
String
City
No

state
String
State
No

zipcode
String
Zip Code
No

country
String
Country
No

registrationCategory
String
[ DIPLOMA, COURSE,
OTHERS ]
No

yearGroupId
String
ID
No

customFields

"The 'registrationCategory' is exclusive to DP curriculum students and can be categorized into three types: 'DIPLOMA', 'COURSE', and 'OTHERS.'"

Custom Fields Mapping:

Custom Field
Student Field

given_name
NAME

ic_passport
IC_PASSPORT

student_programme_id
STUDENT_PROGRAMME_ID

student_oen
STUDENT_OEN

marital_status
MARITAL_STATUS

race
RACE

religion
RELIGION

residential_street_1
RESIDENTIAL_STREET_1

residential_postcode
RESIDENTIAL_POSTCODE

family_id
FAMILY_ID

Note: The "custom field" feature is not available for everyone and will be provided only upon school request.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <subjectId> | Unique identifier of the student |

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/students/:id" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
  "response": {
    "student": {
      "id": "152912321327410342",
      "city": "NANNING, GUANGXI",
      "email": "25344st@yynway.edu.my",
      "grade": "Play Group",
      "sisId": null,
      "state": null,
      "gender": "M",
      "country": "CN",
      "zipcode": "53000",
      "families": [
        {
          "id": "162356797393342303",
          "email": "goshdsfafafi.t@gmail.com",
          "gender": null,
          "last_name": ":",
          "created_at": "2024-09-16T07:37:30.317532",
          "first_name": "MR GOSHI TSUKAMOTO",
          "updated_at": "2024-09-18T08:39:08.072624",
          "profile_image": null
        },
        {
          "id": "162384011438591852",
          "email": "gos4e@gmail.com",
          "gender": null,
          "last_name": ":",
          "created_at": "2024-09-16T09:25:38.651543",
          "first_name": "MR TSUKAMOTO",
          "updated_at": "2024-09-16T09:25:38.651546",
          "profile_image": null
        }
      ],
      "lastName": "ZHOU",
      "sourceId": "56342423432",
      "createdAt": "2024-08-21T06:08:31.752391",
      "firstName": "Tang",
      "updatedAt": "2024-08-21T06:10:20.342901",
      "yearGroup": "YG1",
      "isArchived": false,
      "isBlocked": false,
      "middleName": null,
      "addressLine1": "302, BUILDING 8, DASHANGHUI, ANJI STREET",
      "addressLine2": "XIXIANGTANG, DISTRICT",
      "profileImage": null,
      "custom_fields": {
        "family_id": "S0394694",
        "given_name": "ZMUS GYEO",
        "ic_passport": "EL8711937",
        "marital_status": "Single",
        "pdpa_consent": "Y",
        "permanent_tel_no": "18378842850",
        "personal_email": "email@email2.com",
        "phone_number": "324324234324",
        "race": "OTHERS",
        "religion": "OTHERS",
        "residential_city": "NANNING, GUANGXI",
        "residential_country": "CHINA",
        "residential_postcode": "53000",
        "residential_state": null,
        "residential_street_1": "302, BUILDING 8, DASHANGHUI, ANJI STREET",
        "residential_street_2": "XIXIANGTANG, DISTRICT",
        "residential_tel_no": "43534583490543",
        "secondary_email": "emial@gmail.com",
        "student_oen": "OEN99999",
        "student_programme_id": "CIMP99999"
      },
      "contactDetails": [
        {
          "id": "162357925057148020",
          "email": "ben_stokess@139.cn",
          "lastName": "TSUKAMOTO",
          "firstName": "MRS GOSHI",
          "phoneNumber": 4389584359,
          "relationship": "Mother"
        },
        {
          "id": "162374385565447286",
          "email": "goshdsfafafi.t@gmail.com",
          "lastName": "TSUKAMOTO",
          "firstName": "MR GOSHI",
          "phoneNumber": 348098349023,
          "relationship": "Father"
        }
      ],
      "organizationId": 12507,
      "secondaryEmail": "zhou3j@gmayil.com",
      "organizationName": "schoolbase - staging",
      "registrationCategory": null,
      "dob": "2005-06-28",
      "personal_email": "gangzj@gmyai2l.com",
      "phone_number": "012268268268888",
      "primary_nationality": "CN",
      "familyInviteCode": "OGOD49MXV",
      "studentSignInCode": "STN63L7B8W"
    }
  }
}
```

### Create Student
Method: `POST`
Path: `/public/v2/students`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/students`

Description:
Request Body

Field Name
Data Type
Description
Required

firstName
String
First name of the student
Yes

middleName
String
Middle name of the student
No

lastName
String
Last name of the student
Yes

preferredName
String
Preferred Name of the student
No

email
String
Email of the student
No

yearGroupId
String
Id of year group
Yes

academicYearId
String
Id of the academic year
No

gender
String
Gender of the student (values: M, F, X)
No

sourceId
String
Unique Identifier for the student
No

homeroomAdvisorId
String
Unique identifier of the homeroom Advisor.
No

dob
String
Date of Birth (YYYY-MM-DD)
No

primaryNationality
String
Primary Nationality in ISO 3166-1 alpha-2 code
No

secondaryNationality
String
Secondary Nationality in ISO 3166-1 alpha-2 code
No

secondaryEmail
String
Secondary email which can be used to login
No

languages
Array [String]
Array of languages in ISO 639-1 alpha-3 code
No

addressLine1
String
Address of the student
No

state
String
State
No

zipcode
String
Zip Code
No

country
String
Country
No

customFields
Object
key value pair of custom fields
No, Only available on school requests

Custom Fields Mapping:

Custom Field
Student Field

given_name
NAME

ic_passport
IC_PASSPORT

student_programme_id
STUDENT_PROGRAMME_ID

student_oen
STUDENT_OEN

marital_status
MARITAL_STATUS

race
RACE

religion
RELIGION

residential_street_1
RESIDENTIAL_STREET_1

residential_postcode
RESIDENTIAL_POSTCODE

family_id
FAMILY_ID

Note: The "custom field" feature is not available for everyone and will be provided only upon school request.

Auth: Bearer token (`Authorization: Bearer <token>`)

Example Request (cURL):
```bash
curl -X POST "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/students" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
"response": {
  "student": {
    "id": "152912321327410342",
    "city": "NANNING, GUANGXI",
    "email": "deept32@s666uyyynway.edu.my",
    "grade": "Play Group",
    "sisId": null,
    "state": null,
    "gender": "M",
    "country": "CN",
    "zipcode": "53000",
    "families": [],
    "lastName": "ZHOU",
    "sourceId": "9879823432",
    "createdAt": "2024-08-21T06:08:31.752391",
    "firstName": "Deep",
    "preferredName": "Deep",
    "updatedAt": "2024-08-21T06:08:31.752393",
    "yearGroup": "YG1",
    "isArchived": false,
    "isBlocked": false,
    "middleName": null,
    "addressLine1": "302, BUILDING 8, DASHANGHUI, ANJI STREET,",
    "addressLine2": "XIXIANGTANG, DISTRICT",
    "profileImage": null,
    "custom_fields": {
      "family_id": "S0394694",
      "given_name": "ZMUS GYEO",
      "ic_passport": "EL8711937",
      "marital_status": "Single",
      "pdpa_consent": "Y",
      "permanent_tel_no": "18378842850",
      "personal_email": "email@email2.com",
      "phone_number": "324324234324",
      "race": "OTHERS",
      "religion": "OTHERS",
      "residential_city": "NANNING, GUANGXI",
      "residential_country": "CHINA",
      "residential_postcode": "53000",
      "residential_state": null,
      "residential_street_1": "302, BUILDING 8, DASHANGHUI, ANJI STREET,",
      "residential_street_2": "XIXIANGTANG, DISTRICT",
      "residential_tel_no": "999999999999",
      "secondary_email": "emial@gmail.com",
      "student_oen": "OEN99999",
      "student_programme_id": "CIMP99999"
    },
    "contactDetails": [],
    "organizationId": 12507,
    "secondaryEmail": "gangzhou3j@gmayil.com",
    "organizationName": "schoolbase - staging",
    "registrationCategory": null,
    "dob": "2005-06-28",
    "personal_email": "gangzh34ou.jjjj@gmyai2l.com",
    "phone_number": "012268268268888",
    "primary_nationality": "CN",
    "familyInviteCode": "OGOD49MXV",
    "studentSignInCode": "STN63L7B8W"
  }
}
}
```

### Archive Student
Method: `PUT`
Path: `/public/v2/students/:id/archive`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/students/:id/archive`

Description:
This endpoint archives a student based on the provided ID.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <subjectId> | Unique identifier of the student |

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/students/:id/archive" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "student": {
            "id": 404039,
            "firstName": "John",
            "lastName": "Doe456",
            "email": "johndoe@gmail.com",
            "is_archived": true
        }
    }
}
```

### Unarchive Student
Method: `PUT`
Path: `/public/v2/students/:id/unarchive`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/students/:id/unarchive`

Description:
To unarchive an archived course use this api.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <subjectId> | Unique identifier of the student |

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/students/:id/unarchive" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "student": {
            "id": 404039,
            "firstName": "John",
            "lastName": "Doe456",
            "email": "johndoe@gmail.com",
            "is_archived": false
        }
    }
}
```

### Teacher-Notes for Student
Method: `GET`
Path: `/public/v2/students/:id/teacher-note`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/students/:id/teacher-note`

Description:
Using this api, we can fetch teacher notes of any student using Student ID as input.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <subjectId> | Unique identifier of the student |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/students/:id/teacher-note" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 200 OK
```json
{
    "response": {
        "student_notes": [
            {
                "title": "Random Notes",
                "description": "Random Notes",
                "id": "697"
            },
            {
                "title": "Somethihng",
                "description": "Something",
                "id": "698"
            }
        ]
    }
}
```

### Student Other Info
Method: `GET`
Path: `/public/v2/students/:id/other-info`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/students/:id/other-info`

Description:
Using this api, we can fetch students other info of any student using Student ID as input.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <subjectId> | Unique identifier of the student |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/students/:id/other-info" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 200 OK
```json
{
    "response": {
        "other_info": [
            {
                "sectionid": "472",
                "sectionTitle": "Section 1 ",
                "data": [
                    {
                        "questionid": "391",
                        "questionTitle": "Question 1",
                        "response": [
                            {
                                "title": "Answer 1",
                                "id": "19086"
                            }
                        ]
                    },
                    {
                        "questionid": "392",
                        "questionTitle": "Question 2",
                        "response": [
                            {
                                "title": "Answer 1",
                                "id": "19087"
                            },
                            {
                                "title": "Answer 2",
                                "id": "19088"
                            }
                        ]
                    }
                ]
            }
        ]
    }
}
```

### Create Student Other-Info Response
Method: `POST`
Path: `/public/v2/students/:id/other-info/response`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/students/:id/other-info/response`

Description:
This endpoint creates a new response for a student's other info using the student ID and question ID.

Request Body

Field Name
Data Type
Description
Required

questionId
String
Unique identifier of the question
Yes

response
String
The answer to the question
Yes

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <subjectId> | Unique identifier of the student |

Example Request (cURL):
```bash
curl -X POST "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/students/:id/other-info/response" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 201 Created
```json
{
    "response": {
        "other_info": {
            "questionId": "212447454636716506",
            "questionTitle": "Write an answer",
            "response": {
                "id": "213517289345544254",
                "title": "New response here"
            }
        }
    }
}
```

### Update Student Other-Info Response
Method: `PUT`
Path: `/public/v2/students/:id/other-info/response`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/students/:id/other-info/response`

Description:
This endpoint updates a student's other info response using the student ID and response ID.

Request Body

Field Name
Data Type
Description
Required

responseId
String
Unique identifier of the response to update
Yes

response
String
The updated answer to the question
Yes

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <subjectId> | Unique identifier of the student |

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/students/:id/other-info/response" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 201 Created
```json
{
    "response": {
        "other_info": {
            "questionId": "212447454636716506",
            "questionTitle": "Write an answer",
            "response": {
                "id": "213517289345544254",
                "title": "Updated response here"
            }
        }
    }
}
```

### Get Contact Details
Method: `GET`
Path: `/public/v2/contact-details/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/contact-details/:id`

Description:
This API retrieves the contact details of a student using the student ID as the identifier. By making use of this API and providing the student ID, you can obtain the necessary contact information associated with that particular student.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <subjectId> | Unique identifier of the student |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/contact-details/:id" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "contactDetails": [
            {
                "id": 2662,
                "firstName": "Ben",
                "lastName": "Stokes",
                "email": null,
                "phoneNumber": null,
                "relationship": "brother"
            },
            {
                "id": 2675,
                "firstName": "John",
                "lastName": "Stokes",
                "email": "johntofffffke@gmail.com",
                "phoneNumber": "+920040505500",
                "relationship": "Father"
            }
        ]
    }
}
```

### Create Contact Details
Method: `POST`
Path: `/public/v2/contact-details`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/contact-details`

Description:
Request Body

Field
Data Type
Required

firstName
String
Yes

lastName
String
Yes

studentId
String
Yes

relationship
String
Yes

email
String
No

phoneNumber
String
No

Auth: Bearer token (`Authorization: Bearer <token>`)

Example Request (cURL):
```bash
curl -X POST "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/contact-details" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "contactDetails": [
            {
                "id": 2660,
                "firstName": "Ben",
                "lastName": "Stokes",
                "email": "ben_stoke@gmail.com",
                "phoneNumber": "+920040505500",
                "relationship": "brother"
            }
        ]
    }
}
```

### Delete Contact details
Method: `DELETE`
Path: `/public/v2/contact-details/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/contact-details/:id`

Description:
This endpoint deletes contact details using the contact detail ID.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <contactId>  | Unique identifier of the contact detail |

Example Request (cURL):
```bash
curl -X DELETE "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/contact-details/:id" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "isSuccess": true
    }
}
```

### Update Contact details
Method: `PUT`
Path: `/public/v2/contact-details/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/contact-details/:id?studentIds=[] String`

Description:
This API updates contact details using the contact_details ID.

To update contact details of related students, with same email or phoneNumber in contacts can be updated by passing studentIds as query parameter

Request Body

Field
Data Type
Required

firstName
String
No

lastName
String
No

phoneNumber
String
No

relationship
String
No

email
String
No

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <contactId> | Unique identifier of the contact detail |

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| studentIds | [] String | comma seperated unique Ids of student with similar contact details, having same email or phoneNumber | no |

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/contact-details/:id?studentIds=[] String" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "contact": [
            {
                "id": 2660,
                "firstName": "Ben",
                "lastName": "Stokes",
                "email": "ben_stofffffke@gmail.com",
                "phoneNumber": "+920040505500",
                "relationship": "brother", 
                "studentId" : "32342423423"
            },
            {
                "id": 2663,
                "firstName": "Ben",
                "lastName": "Stokes",
                "email": "ben_stofffffke@gmail.com",
                "phoneNumber": "+920040505500",
                "relationship": "brother", 
                "studentId" : "234324324234"
            }
        ]
    }
}
```

### Block/unblock students
Method: `PUT`
Path: `/public/v2/students/:id/blockUnblockStudents`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/students/:id/blockUnblockStudents`

Description:
This Api blocks and unblocks the students which will refrain them to login into the system.

Request Body:

Field
Data Type
Required

isBlocked
Boolean
Yes

blockMessage
String
Yes (incase where isBlocked is true)

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <subjectId> | Unique identifier of the student |

Request Body (raw):
```json
{
    "isBlocked": "Boolean!",
    "blockMessage": "String"
}
```

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/students/:id/blockUnblockStudents" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  --data-raw "{
    \"isBlocked\": \"Boolean!\",
    \"blockMessage\": \"String\"
}"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "isSuccess": true
    }
}
```

### Profile Image Upload
Method: `PUT`
Path: `/public/v2/students/:id/profileImageUpload`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/students/:id/profileImageUpload`

Description:
Description:
This API endpoint allows for the upload of a profile image for a specific student by taking a base64-encoded image string in the request body. The uploaded image is added to the student's profile, replacing any existing profile image.

Path Parameters:

id (string): The unique identifier of the student whose profile image is being updated.

Request Body:

base64Image (string): The base64-encoded string representation of the image to be uploaded. The image should be properly encoded and should not exceed the size limits imposed by the server.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | ID | Students Unique Identity |

Headers:
| Name | Value | Description | Disabled |
| --- | --- | --- | --- |
| Content-Type | application/json |  | no |

Request Body (raw):
```json
{
    "base64Image" : "Base 64 Image String"
}
```

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/students/:id/profileImageUpload" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  --data-raw "{
    \"base64Image\" : \"Base 64 Image String\"
}"
```

Response Examples:
Status: (not specified)
```json
{
  "response": {
    "student": {
      "id": "152912321327410342",
      "city": "NANNING, GUANGXI",
      "email": "25344st@yynway.edu.my",
      "grade": "Play Group",
      "sisId": null,
      "state": null,
      "gender": "M",
      "country": "CN",
      "zipcode": "53000",
      "families": [],
      "lastName": "ZHOU",
      "sourceId": "56342423432",
      "createdAt": "2024-08-21T06:08:31.752391",
      "firstName": "Tang",
      "updatedAt": "2024-08-21T06:10:20.342901",
      "yearGroup": "YG1",
      "isArchived": false,
      "isBlocked" : false,
      "middleName": null,
      "addressLine1": "302, BUILDING 8, DASHANGHUI, ANJI STREET",
      "addressLine2": "XIXIANGTANG, DISTRICT",
      "profileImage": "https://s3.ap-southeast-1.amazonaws.com/bucketname/student12345/profile.jpg",
      "custom_fields": {
        "family_id": "S0394694",
        "given_name": "ZMUS GYEO",
        "ic_passport": "EL8711937",
        "marital_status": "Single",
        "pdpa_consent": "Y",
        "permanent_tel_no": "18378842850",
        "personal_email": "email@email2.com",
        "phone_number": "324324234324",
        "race": "OTHERS",
        "religion": "OTHERS",
        "residential_city": "NANNING, GUANGXI",
        "residential_country": "CHINA",
        "residential_postcode": "53000",
        "residential_state": null,
        "residential_street_1": "302, BUILDING 8, DASHANGHUI, ANJI STREET",
        "residential_street_2": "XIXIANGTANG, DISTRICT",
        "residential_tel_no": "43534583490543",
        "secondary_email": "emial@gmail.com",
        "student_oen": "OEN99999",
        "student_programme_id": "CIMP99999"
      },
      "contactDetails": [],
      "organizationId": 12507,
      "secondaryEmail": "zhou3j@gmayil.com",
      "organizationName": "schoolbase - staging",
      "registrationCategory": null,
      "dob": "2005-06-28",
      "personal_email": "gangzj@gmyai2l.com",
      "phone_number": "012268268268888",
      "primary_nationality": "CN",
      "familyInviteCode": "OGOD49MXV",
      "studentSignInCode": "STN63L7B8W"
    }
  }
}
```

## Staff
This section contains a brief description of the Staff API endpoints, including the request and response formats for creating or updating Staff, fetching Staff data.

### Get Staff
Method: `GET`
Path: `/public/v2/staff`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/staff`

Description:
Query Parameters

if query parameter is not passed, it will return all the staff of this organisation.

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| curriculumId | <curriculumId> | Unique identifier of the curriculum program. | yes |
| staffIds | [] String | Comma seperated list of Unique Identifier for Staff | yes |
| sourceIds | [] String | Comma seperated list of  SourceIds for Staff | yes |
| gradeIds | [] String | Comma seperated list of gradeIds | yes |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/staff" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "staff": [
            {
                "id": "299760003684767251",
                "role": "staff",
                "last_name": "Ghanghas",
                "first_name": "Ashwani",
                "email": "ashwani.1112ten@mail.com",
                "gender": "M",
                "profile_image": null,
                "created_at": "2025-09-30T11:28:47.525Z",
                "organization_id": "284888126562778974",
                "phone_number": null,
                "sourced_id": "TD-29ZK1WM3YWWJ",
                "sisId": null,
                "grades": [],
                "courses": [],
                "isArchived": false,
                "organizationName": "2.0 integration- OpenAPI test",
                "displayRole": "Teacher",
                "systemRole": "Teacher"
            }
        ]
    }
}
```

### Create Staff
Method: `POST`
Path: `/public/v2/staff`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/staff`

Description:
Request Body

Field Name
Data Type
Description
Required

firstName
String
First Name of the staff
Yes

middleName
String
Middle Name of the staff
No

lastName
String
Last Name of the staff
Yes

email
String
Email of the staff
Yes

gender
String
Gender of the staff
[ 'M', 'F', 'X' ]
No

sourceId
String
Unique Identifier of the staff
No

secondaryEmail
String
Secondary email for staff login
No

role
String
Designation of staff
No

systemRoleId
String
System Role of staff (ACCOUNT Role)
No

To assign a predefined role, use the role field in the request body.

To assign a custom role, use the systemRoleId field in the request body.

Here are the list of roles you can assign to a staff : [ 'Teacher', 'Other', 'IT Specialist', 'School Administrator' ].

Default value for role is 'Teacher'

To fetch the systemRoleId for custom ACCOUNT-level roles, use the Get Org Roles API (found under the Academics section).

Auth: Bearer token (`Authorization: Bearer <token>`)

Example Request (cURL):
```bash
curl -X POST "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/staff" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "staff": {
            "id": "299760003684767251",
            "firstName": "Ashwani",
            "middleName": "Ghanghas",
            "lastName": "Ghanghas",
            "email": "ashwani.1112ten@mail.com",
            "gender": "M",
            "sourceId": null,
            "secondaryEmail": null,
            "organizationId": "284888126562778974",
            "displayRole": "Teacher"
        }
    }
}
```

### Archive Staff
Method: `PUT`
Path: `/public/v2/staff/:id/archive`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/staff/:id/archive`

Description:
Api to arvhive staff using id.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <staffId> | Unique Identifier for Staff |

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/staff/:id/archive" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "staff": {
            "id": 403956,
            "firstName": "Ben",
            "lastName": "Stokes",
            "email": "ben1ten@mail.com",
            "is_archived": true
        }
    }
}
```

### Unarchive Staff
Method: `PUT`
Path: `/public/v2/staff/:id/unarchive`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/staff/:id/unarchive`

Description:
Api to unarchive archived course using staff and course id.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <staffId> | Unique Identifier for Staff |

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/staff/:id/unarchive" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "staff": {
            "id": 403956,
            "firstName": "Ben",
            "lastName": "Stokes",
            "email": "ben1ten@mail.com",
            "is_archived": false
        }
    }
}
```

### Update Staff
Method: `PUT`
Path: `/public/v2/staff/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/staff/:id`

Description:
Request Body

Field Name
Data Type
Description
Required

firstName
String
First Name of the staff
No

lastName
String
Last Name of the staff
No

email
String
Email of the staff
No

gender
String
Gender of the staff (values: M, F, X)
No

sourceId
String
Source ID of the staff
No

secondaryEmail
String
Secondary email for staff login
No

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <staffId> | Unique Identifier for Staff |

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/staff/:id" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "staff": {
            "id": 403956,
            "firstName": "Ben",
            "lastName": "Stokes",
            "email": "ben1ten@gmail.com",
            "gender": "M",
            "sourceId": "TD-403956",
            "secondaryEmail": "ben.ten.2@gmail.com"
        }
    }
}
```

### Profile Image Upload
Method: `PUT`
Path: `/public/v2/staff/:id/profileImageUpload`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/staff/:id/profileImageUpload`

Description:
Description:
This API endpoint allows for the upload of a profile image for a specific student by taking a base64-encoded image string in the request body. The uploaded image is added to the staff's profile, replacing any existing profile image.

Path Parameters:

id (string): The unique identifier of the staff whose profile image is being updated.

Request Body:

base64Image (string): The base64-encoded string representation of the image to be uploaded. The image should be properly encoded and should not exceed the size limits imposed by the server.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | ID | Staff Unique Identity |

Headers:
| Name | Value | Description | Disabled |
| --- | --- | --- | --- |
| Content-Type | application/json |  | no |

Request Body (raw):
```json
{
    "base64Image" : "Base 64 Image String"
}
```

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/staff/:id/profileImageUpload" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  --data-raw "{
    \"base64Image\" : \"Base 64 Image String\"
}"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "staff": {
            "id": 403956,
            "firstName": "Ben",
            "lastName": "Stokes",
            "email": "ben1ten@gmail.com",
            "gender": "M",
            "sourceId": "TD-403956",
            "secondaryEmail": "ben.ten.2@gmail.com"
            "profileImage": "https://s3.ap-southeast-1.amazonaws.com/bucketname/student12345/profile.jpg"
        }
    }
}
```

## Family
This section contains a brief description of the Family API endpoints, including the request and response formats for creating or updating Family, fetching Family data.

### Create Parent
Method: `POST`
Path: `/public/v2/parents`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/parents`

Description:
Request Body

Field Name
Data Type
Description
Required

firstName
String
The first name of the user
Yes

middleName
String
The middle name of the user
No

lastName
String
The last name of the user
Yes

gender
String
The gender of the user
No

email
String
The email address of the user
Yes

children
Array [ String ]
An array of child IDs associated with user
Yes

relationships
Array [ String ] of Objects
An array of objects, each object containing child ID and relationship to that child ID
No

Relationships' Input structure:

Field Name
Data Type
Description
Required

childId
String
Contains the child ID for whom you want to define relationship
Yes

relationship
String
Specifies what relationship you want parent to have with the given child ID
Yes

Auth: Bearer token (`Authorization: Bearer <token>`)

Example Request (cURL):
```bash
curl -X POST "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/parents" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "parent": {
            "id": 409321,
            "firstName": "Ramesh",
            "lastName": "Ram",
            "email": "leffo@gmail.com",
            "gender": "M",
            "sourceId": null,
            "secondaryEmail": null
        }
    }
}
```

### Update Parent
Method: `PUT`
Path: `/public/v2/parents/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/parents/:id`

Description:
Request Body

Field Name
Data Type
Description
Required

firstName
String
The first name of the user
No

lastName
String
The last name of the user
No

gender
String
The gender of the user
No

removedChildren
Array [ String ]
An array of child IDs to be removed from the parent
No

addedChildren
Array [ String ]
An array of child IDs to be added to the parent
No

relationships
Array [ String ] of Objects
An array of objects, each object containing child ID and relationship to that child ID
No

Relationships' Input structure:

Field Name
Data Type
Description
Required

childId
String
Contains the child ID for whom you want to define relationship
Yes

relationship
String
Specifies what relationship you want parent to have with the given child ID
Yes

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | parentId | Unique Identifier for Parent |

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/parents/:id" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "parent": {
            "id": 409321,
            "firstName": "Leo",
            "lastName": "Stark",
            "email": "leoffnnnfe.s@gmail.com",
            "gender": "M",
            "sourceId": null,
            "secondaryEmail": null
        }
    }
}
```

### Get Parents
Method: `GET`
Path: `/public/v2/parents`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/parents`

Description:
Api to get parents using parentIds.
If no parentIds provided, it will return all the parents of the organization.

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| parentIds | [] String | Comma seperated list of Id for parents | yes |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/parents" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "parents": [
            {
                "id": 409321,
                "firstName": "Leo",
                "lastName": "Stark",
                "email": "leoffnnnfe.s@gmail.com",
                "phoneNumber": null,
                "children": [
                    {
                        "id": "406126",
                        "firstName": "Jon",
                        "lastName": "Stark",
                        "relationship": "Father"
                    }
                ],
            }
        ]
    }
}
```

## Subjects
This section contains a brief description of the Subjects API endpoints, including the request and response formats for creating or updating subjects, fetching subjects data.

### Get Subjects
Method: `GET`
Path: `/public/v2/subjects`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/subjects`

Description:
If curriculumId is passed, it will return all the subjects of that particular curriculum and all subjects which does not belong to any course of this organisation.

if curriculumId is not passed, it will return all the subjects of this organisation.

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| curriculumId | <curriculumId> | Unique Identifier for curriculum program | yes |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/subjects" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 200 OK
```json
{
    "response": {
        "subjects": [
            {
                "id": "100396609417785732",
                "name": "Afrikaans A: literature",
                "variants": [
                    {
                        "response_language_id": "100396615038145034",
                        "subject_level_id": "92358471474745641",
                        "subject_level": "SL",
                        "response_language": "Afrikaans"
                    }
                ]
            }
        ]
    }
}
```

### Get Subject Groups
Method: `GET`
Path: `/public/v2/org-subject-groups/:curriculumId`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/org-subject-groups/:curriculumId`

Description:
This api returns subject groups with all subjects, and its variants.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| curriculumId | <curriculumId> | Unique Identifier for curriculum program |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/org-subject-groups/:curriculumId" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 200 OK
```json
For MYP subject groups resposne example. 
{
    "response": {
        "subjectGroups": [
            {
                "presetSubjectIds": [
                    {
                        "id": "48917",
                        "name": "MYP Design"
                    },
                    {
                        "id": "1860206451505800",
                        "name": "Design_prod"
                    }
                ],
                "subjectGroupId": "99617136107862453",
                "subjectGroupTitle": "Design",
                "curriculumId": "99617093908955694"
            }
        ]
    }
}

For DP subejct groups resposne example. 
{
    "response": {
      "subjectGroups": [
        {
          "subjectGroupId": "9",
          "subjectGroupTitle": "Studies in language and literature",
          "curriculumId": "92358459462254986",
          "subjects": [
            {
              "subjecttitle": "Afrikaans A: literature",
              "subjectid": 287,
              "subjectvariants": [
                {
                  "subjectlevelId": 63,
                  "responseLanguageIds": [
                    {
                      "type": "RESPONSE_LANGUAGE",
                      "label": "Afrikaans",
                      "response_language_id": 2
                    }
                  ]
                },
                {
                  "subjectlevelId": 64,
                  "responseLanguageIds": [
                    {
                      "type": "RESPONSE_LANGUAGE",
                      "label": "Afrikaans",
                      "response_language_id": 2
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
  }
}
```

### Create Subject
Method: `POST`
Path: `/public/v2/subjects`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/subjects`

Description:
PYP Subject Creation :

name and curriculumId is required. grades is optional.
For PYP subject, Example request Body :

{
   "name" : "PYP Subject Title",
    "grades" : [
      "Grade 1"
   ],
   "curriculumId" : "99617093908955695"
}

To Create a MYP subject, use Subject Groups Api Using MYP curriculumId api to fetch presetSubjectId and subjectGroupId.

name, grades and curriculum are requred fields, including fields listed below.

Request Body Input
Fields From Subject Group Api
Required

presetSubjectId
presetSubjectId
Yes

subjectGroupId
subjectGroupId
Yes

For MYP subject, Example request Body :

{
   "name" : "MYP Subject Title",
    "grades" : [
      "Year 2"
   ],
   "presetSubjectId" : "3249043584324"
   "curriculumId" : "844039660941778573"
    "subjectGroupId": "99617136107862453",
}

To create a DP subject use Subject Groups Api Using DP curriculumId to get all the required data to create subject.
Here are the fields required.

Request Body Input
Fields From Subject Group Api
Required

responseLanguageId
responseLanguageId
Yes ( If not null )

subjectlevelId
subjectlevelId
Yes ( if not null )

subjectGroupId
subjectGroupId
Yes

ibOfferedSubjectId
subjectid
Yes

curriculumId
Curriculum ID for DP
Yes

For DP subject, Example request Body :

{
        "curriculumId" : "92358459462254986",
        "responseLanguageId" : "2",
        "subjectLevelId" : "63",
        "subjectGroupId" : "9",
        "ibOfferedSubjectId" : "287"
}

For some subject Groups from Subject Groups Api, subjectLevelId or responseLangaugeId is null, in that case here is the example request body.

{
        "curriculumId" : "92358459462254986",
        "subjectGroupId" : "9",
        "ibOfferedSubjectId" : "287"
}

Auth: Bearer token (`Authorization: Bearer <token>`)

Example Request (cURL):
```bash
curl -X POST "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/subjects" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "subjects": {
            "id": "100396609417785732",
            "name": "PYP Subject Title",
            "ibOfferedSubjectId": "287"
             "presetSubjectId": "1860206451505800",
        }
    }
}
```

### Archive Subject
Method: `PUT`
Path: `/public/v2/subjects/:id/archive`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/subjects/:id/archive`

Description:
Required : id of Subject which neetds to be archived in path variable.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <subjectId>  | Unique Identifier for Subject |

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/subjects/:id/archive" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "subjects": true
    }
}
```

### Unarchive Subject
Method: `PUT`
Path: `/public/v2/subjects/:id/unarchive`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/subjects/:id/unarchive`

Description:
Required : id of Subject which neetds to be unarchived as path variable.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <subjectId> | Unique Identifier for Subject |

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/subjects/:id/unarchive" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "subjects": true
    }
}
```

## Term Grades
This section contains a brief description of the term grades API endpoints, including the request and response formats for creating or updating student term grades, fetching student term grades data, and retrieving academic terms/ grading periods.

### Get Term Grades
Method: `GET`
Path: `/public/v2/term-grades`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/term-grades?curriculumProgramId=<curriculumId>`

Description:
This API fetches the term grade data for a specific student, including ratings for various subjects for the provided grading period Ids.

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| curriculumProgramId | <curriculumId> | Unique Identifier for CurriculumProgram | no |
| academicYeraId | <academicYearId> | Unique Identifier for Academic Year | yes |
| cursor | <cursor> | Pass the endCursor value received in the previous response to get the next set of entries beyond that cursor. Not required in the first API call | yes |
| count | <count>  | The number of entries per page. Default is 100. | yes |
| criteriaType | {{criteriaType}} | FINAL_SCORE, FINAL_GRADE, IB_DEFINED, LOCAL_GRADE, GRADE_SCALE.
Use FINAL_SCORE for term overall score, FINAL_GRADE for Term overall grade, IB_DEFINED for MYP criteria scores, LOCAL_GRADE for local grades, GRADE_SCALE for custom created grades. | yes |
| gradingPeriodId | {{gradingPeriodId}} | Unique Identifier for Grading Period | yes |
| showCategoryDetails | true | It will show the Category Score Details [ when the criteriaType is FINAL_SCORE ] | yes |
| studentId | Integer | Unique identifier for the student. | yes |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/term-grades?curriculumProgramId=<curriculumId>" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 200 OK
```json
{
    "response": {
        "totalCount": 37,
        "edges": [
            {
                "id": "289636821975972557",
                "name": "Gregory Stanfield",
                "yearGroup": "Batch of 2026",
                "ratings": []
            },
            {
                "id": "289636821980166862",
                "name": "sarah diaz",
                "yearGroup": "Batch of 2037",
                "ratings": [
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636765021514344",
                        "teacherCourseTitle": "AP European History",
                        "courseIds": [
                            {
                                "id": "289636807274931630",
                                "name": "AP European History - 1"
                            },
                            {
                                "id": "289636807325263279",
                                "name": "AP European History - 1"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "33",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    }
                ]
            },
            {
                "id": "289636821996944079",
                "name": "allan border",
                "yearGroup": "Batch of 2039",
                "ratings": []
            },
            {
                "id": "289636822022109904",
                "name": "Andrew Jeffs",
                "yearGroup": "Batch of 2026",
                "ratings": []
            },
            {
                "id": "289636822034692817",
                "name": "Joseph Cox",
                "yearGroup": "Batch of 2026",
                "ratings": [
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636765587745454",
                        "teacherCourseTitle": "20th Century Propaganda",
                        "courseIds": [
                            {
                                "id": "289636773246543189",
                                "name": "20th Century Propaganda - 2"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "77.0",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    }
                ]
            },
            {
                "id": "289636822055664338",
                "name": "Georgia Aftisse",
                "yearGroup": "Batch of 2026",
                "ratings": [
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636765587745454",
                        "teacherCourseTitle": "20th Century Propaganda",
                        "courseIds": [
                            {
                                "id": "289636773246543189",
                                "name": "20th Century Propaganda - 2"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "80.0",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    }
                ]
            },
            {
                "id": "289636822085024467",
                "name": "August Edwards",
                "yearGroup": "Batch of 2026",
                "ratings": []
            },
            {
                "id": "289636822206659284",
                "name": "Alexandra Fike",
                "yearGroup": "Batch of 2027",
                "ratings": [
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636765432556178",
                        "teacherCourseTitle": "Anatomy & Physiology",
                        "courseIds": [
                            {
                                "id": "289636808155735486",
                                "name": "Anatomy & Physiology - 9"
                            },
                            {
                                "id": "289636808193484223",
                                "name": "Anatomy & Physiology - 9"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "77",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    },
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636765587745454",
                        "teacherCourseTitle": "20th Century Propaganda",
                        "courseIds": [
                            {
                                "id": "289636773246543189",
                                "name": "20th Century Propaganda - 2"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "45.0",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    }
                ]
            },
            {
                "id": "289636822277962454",
                "name": "Charlotte Wears",
                "yearGroup": "Batch of 2026",
                "ratings": [
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636765587745454",
                        "teacherCourseTitle": "20th Century Propaganda",
                        "courseIds": [
                            {
                                "id": "289636773246543189",
                                "name": "20th Century Propaganda - 2"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "44.0",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    }
                ]
            },
            {
                "id": "289636822282156759",
                "name": "Barrett Anderson",
                "yearGroup": "Batch of 2027",
                "ratings": [
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "291710073493793594",
                        "teacherCourseTitle": "ak",
                        "courseIds": [
                            {
                                "id": "302670577758380118",
                                "name": "dance"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "89.0",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893728774340",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    }
                ]
            },
            {
                "id": "289636822282156760",
                "name": "Marc Cashin",
                "yearGroup": "Batch of 2026",
                "ratings": [
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636764987959911",
                        "teacherCourseTitle": "English IV",
                        "courseIds": [
                            {
                                "id": "289636806813558179",
                                "name": "English IV - 1"
                            },
                            {
                                "id": "289636808453531081",
                                "name": "English IV - 1"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "97",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    }
                ]
            },
            {
                "id": "289636822307322585",
                "name": "Billing Student",
                "yearGroup": "Batch of 2036",
                "ratings": [
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636765432556178",
                        "teacherCourseTitle": "Anatomy & Physiology",
                        "courseIds": [
                            {
                                "id": "289636808155735486",
                                "name": "Anatomy & Physiology - 9"
                            },
                            {
                                "id": "289636808193484223",
                                "name": "Anatomy & Physiology - 9"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "9",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    },
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636765587745454",
                        "teacherCourseTitle": "20th Century Propaganda",
                        "courseIds": [
                            {
                                "id": "289636773246543189",
                                "name": "20th Century Propaganda - 2"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "63.0",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    }
                ]
            },
            {
                "id": "289636822336682714",
                "name": "kwal bravory",
                "yearGroup": "Batch of 2038",
                "ratings": [
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636765587745454",
                        "teacherCourseTitle": "20th Century Propaganda",
                        "courseIds": [
                            {
                                "id": "289636773246543189",
                                "name": "20th Century Propaganda - 2"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "99.0",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    }
                ]
            },
            {
                "id": "289636822357654235",
                "name": "Caresse Abelle",
                "yearGroup": "Batch of 2026",
                "ratings": [
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636764987959911",
                        "teacherCourseTitle": "English IV",
                        "courseIds": [
                            {
                                "id": "289636806813558179",
                                "name": "English IV - 1"
                            },
                            {
                                "id": "289636808453531081",
                                "name": "English IV - 1"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "98",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    },
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636765587745454",
                        "teacherCourseTitle": "20th Century Propaganda",
                        "courseIds": [
                            {
                                "id": "289636773246543189",
                                "name": "20th Century Propaganda - 2"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "19.0",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    }
                ]
            },
            {
                "id": "289636822357654236",
                "name": "William Drake",
                "yearGroup": "Batch of 2026",
                "ratings": [
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636765587745454",
                        "teacherCourseTitle": "20th Century Propaganda",
                        "courseIds": [
                            {
                                "id": "289636773246543189",
                                "name": "20th Century Propaganda - 2"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "60.0",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    }
                ]
            },
            {
                "id": "289636822361848541",
                "name": "Samuel Carr",
                "yearGroup": "Batch of 2026",
                "ratings": [
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636764987959911",
                        "teacherCourseTitle": "English IV",
                        "courseIds": [
                            {
                                "id": "289636806813558179",
                                "name": "English IV - 1"
                            },
                            {
                                "id": "289636808453531081",
                                "name": "English IV - 1"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "99",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    }
                ]
            },
            {
                "id": "289636822361848542",
                "name": "Jon Gosling",
                "yearGroup": "Batch of 2026",
                "ratings": []
            },
            {
                "id": "289636822416374495",
                "name": "Krystal Lopez",
                "yearGroup": "Batch of 2036",
                "ratings": [
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636765021514344",
                        "teacherCourseTitle": "AP European History",
                        "courseIds": [
                            {
                                "id": "289636807274931630",
                                "name": "AP European History - 1"
                            },
                            {
                                "id": "289636807325263279",
                                "name": "AP European History - 1"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "20",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    }
                ]
            },
            {
                "id": "289636822437346016",
                "name": "Nathan Burks",
                "yearGroup": "Batch of 2026",
                "ratings": []
            },
            {
                "id": "289636822445734625",
                "name": "Andrew Craft",
                "yearGroup": "Batch of 2026",
                "ratings": []
            },
            {
                "id": "289636822470900450",
                "name": "Elizabeth Tsakas",
                "yearGroup": "Batch of 2026",
                "ratings": [
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636765021514344",
                        "teacherCourseTitle": "AP European History",
                        "courseIds": [
                            {
                                "id": "289636807274931630",
                                "name": "AP European History - 1"
                            },
                            {
                                "id": "289636807325263279",
                                "name": "AP European History - 1"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "43",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    },
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636765587745454",
                        "teacherCourseTitle": "20th Century Propaganda",
                        "courseIds": [
                            {
                                "id": "289636773246543189",
                                "name": "20th Century Propaganda - 2"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "3.0",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    }
                ]
            },
            {
                "id": "289636822479289059",
                "name": "Suzie Pierre",
                "yearGroup": "Batch of 2026",
                "ratings": [
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636765021514344",
                        "teacherCourseTitle": "AP European History",
                        "courseIds": [
                            {
                                "id": "289636807274931630",
                                "name": "AP European History - 1"
                            },
                            {
                                "id": "289636807325263279",
                                "name": "AP European History - 1"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "43",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    }
                ]
            },
            {
                "id": "289636822508649188",
                "name": "ryan reynolds",
                "yearGroup": "Batch of 2040",
                "ratings": [
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636765587745454",
                        "teacherCourseTitle": "20th Century Propaganda",
                        "courseIds": [
                            {
                                "id": "289636773246543189",
                                "name": "20th Century Propaganda - 2"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "90.0",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    }
                ]
            },
            {
                "id": "289636822554786533",
                "name": "Margarit Wilson",
                "yearGroup": "Batch of 2026",
                "ratings": []
            },
            {
                "id": "289636822575758054",
                "name": "Flex Clan",
                "yearGroup": "Batch of 2038",
                "ratings": [
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636765432556178",
                        "teacherCourseTitle": "Anatomy & Physiology",
                        "courseIds": [
                            {
                                "id": "289636808155735486",
                                "name": "Anatomy & Physiology - 9"
                            },
                            {
                                "id": "289636808193484223",
                                "name": "Anatomy & Physiology - 9"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "1",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    },
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636765587745454",
                        "teacherCourseTitle": "20th Century Propaganda",
                        "courseIds": [
                            {
                                "id": "289636773246543189",
                                "name": "20th Century Propaganda - 2"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "88.0",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    }
                ]
            },
            {
                "id": "289636822647061223",
                "name": "Whitney Abelle",
                "yearGroup": "Batch of 2026",
                "ratings": [
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636765587745454",
                        "teacherCourseTitle": "20th Century Propaganda",
                        "courseIds": [
                            {
                                "id": "289636773246543189",
                                "name": "20th Century Propaganda - 2"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "70.0",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    }
                ]
            },
            {
                "id": "289636822655449832",
                "name": "Aziz Amari",
                "yearGroup": "Batch of 2026",
                "ratings": [
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636765021514344",
                        "teacherCourseTitle": "AP European History",
                        "courseIds": [
                            {
                                "id": "289636807274931630",
                                "name": "AP European History - 1"
                            },
                            {
                                "id": "289636807325263279",
                                "name": "AP European History - 1"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "10",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    },
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "291710073493793594",
                        "teacherCourseTitle": "ak",
                        "courseIds": [
                            {
                                "id": "302670577758380118",
                                "name": "dance"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "98.0",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893728774340",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    }
                ]
            },
            {
                "id": "289636822659644137",
                "name": "Abbigail Leach",
                "yearGroup": "Batch of 2026",
                "ratings": [
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636764987959911",
                        "teacherCourseTitle": "English IV",
                        "courseIds": [
                            {
                                "id": "289636806813558179",
                                "name": "English IV - 1"
                            },
                            {
                                "id": "289636808453531081",
                                "name": "English IV - 1"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "90",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    }
                ]
            },
            {
                "id": "289636822777084650",
                "name": "Robert Aftisse",
                "yearGroup": "Batch of 2026",
                "ratings": [
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636765562579625",
                        "teacherCourseTitle": "Advanced Biology",
                        "courseIds": [
                            {
                                "id": "289636807883105719",
                                "name": "Advanced Biology - Average"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "90.0",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    },
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636765587745454",
                        "teacherCourseTitle": "20th Century Propaganda",
                        "courseIds": [
                            {
                                "id": "289636773246543189",
                                "name": "20th Century Propaganda - 2"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "98.0",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    }
                ]
            },
            {
                "id": "289636822823221995",
                "name": "Becca Baxter",
                "yearGroup": "Batch of 2036",
                "ratings": [
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636765432556178",
                        "teacherCourseTitle": "Anatomy & Physiology",
                        "courseIds": [
                            {
                                "id": "289636808155735486",
                                "name": "Anatomy & Physiology - 9"
                            },
                            {
                                "id": "289636808193484223",
                                "name": "Anatomy & Physiology - 9"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "8",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    },
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636765587745454",
                        "teacherCourseTitle": "20th Century Propaganda",
                        "courseIds": [
                            {
                                "id": "289636773246543189",
                                "name": "20th Century Propaganda - 2"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "71.0",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    }
                ]
            },
            {
                "id": "289636822839999212",
                "name": "Thomas Ajayi",
                "yearGroup": "Batch of 2026",
                "ratings": []
            },
            {
                "id": "289636822839999213",
                "name": "Rodney Rogers",
                "yearGroup": "Batch of 2026",
                "ratings": []
            },
            {
                "id": "289636822982605551",
                "name": "Rachel up Alvarez",
                "yearGroup": "Batch of 2026",
                "ratings": [
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "289636765021514344",
                        "teacherCourseTitle": "AP European History",
                        "courseIds": [
                            {
                                "id": "289636807274931630",
                                "name": "AP European History - 1"
                            },
                            {
                                "id": "289636807325263279",
                                "name": "AP European History - 1"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "19",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893732968649",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    }
                ]
            },
            {
                "id": "289636823137794802",
                "name": "Margaret Dominy",
                "yearGroup": "Batch of 2026",
                "ratings": []
            },
            {
                "id": "291755415329310273",
                "name": "a1 a1",
                "yearGroup": "Batch of 2026",
                "ratings": []
            },
            {
                "id": "291755757370607170",
                "name": "a2 a2",
                "yearGroup": "Batch of 2026",
                "ratings": [
                    {
                        "subjectId": null,
                        "subjectName": null,
                        "teacherCourseId": "291710073493793594",
                        "teacherCourseTitle": "ak",
                        "courseIds": [
                            {
                                "id": "302670577758380118",
                                "name": "dance"
                            }
                        ],
                        "gradingPeriodId": "285771587133639826",
                        "score": "97.0",
                        "academicCriteriaSetLabel": "Overall score",
                        "academicCriteriaSetId": "288442611285363959",
                        "academicCriteriaSetType": "FINAL_SCORE",
                        "criteriaLabel": null,
                        "gradeLevelId": "284899893728774340",
                        "criteriaValueId": null,
                        "criteriaValueLabel": null
                    }
                ]
            },
            {
                "id": "300757732414201926",
                "name": "Ashwani Ghanghas",
                "yearGroup": "Batch of 2026",
                "ratings": []
            }
        ],
        "pageInfo": {
            "hasNextPage": false,
            "hasPreviousPage": false,
            "startCursor": "eyJpZCI6IjI4OTYzNjgyMTk3NTk3MjU1NyJ9",
            "endCursor": "eyJpZCI6IjMwMDc1NzczMjQxNDIwMTkyNiJ9"
        }
    }
}
```

### Create Term Grades
Method: `POST`
Path: `/public/v2/term-grades`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/term-grades`

Description:
Description
This API allows the upserting of ratings for students.**

Use subjectId for Subject-Based Grading.

Use teacherCourseId for Course-Based Grading.

To post an overall score, only include postedGrade (omit gradeScaleId and criteriaType).

To post a grade, set criteriaType to GRADE_SCALE, include gradeScaleId (from GET Grade Scale), and use the grade abbreviation in postedGrade.

Request Body**

Field
Type
Required
Description

studentId
string
Yes
Unique identifier of the student.

gradingPeriodId
string
Yes
Unique identifier of the grading period.

criteriaType
string
No
GRADE_SCALE

gradeScaleId
string
No
Custom Grade Scale Id

postedGrade
string
Yes
The grade to be posted.

curriculumProgramId
string
Yes
Unique identifier of the curriculum program.

subjectId
string
No [ for subject based grading ]
Unique identifier of the subject.

teacherCourseId
string
No [ for course based grading ]
Unique identifier of the teacher Course.

academicYearId
string
Yes
Unique identifier of the academic year, default value is current academic year.

Auth: Bearer token (`Authorization: Bearer <token>`)

Request Body (raw):
```json
{
  "studentId": "289636822508649188",
  "gradingPeriodId": "285771587133639826",
  "criteriaType": "GRADE_SCALE",
  "gradeScaleId": "305559363186073091",
  "postedGrade": "3",
  "curriculumProgramId": "284899890109094778",
  "teacherCourseId": "289636765587745454",
  "academicYearId": "284898051544333908"
}
```

Example Request (cURL):
```bash
curl -X POST "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/term-grades" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  --data-raw "{
  \"studentId\": \"289636822508649188\",
  \"gradingPeriodId\": \"285771587133639826\",
  \"criteriaType\": \"GRADE_SCALE\",
  \"gradeScaleId\": \"305559363186073091\",
  \"postedGrade\": \"3\",
  \"curriculumProgramId\": \"284899890109094778\",
  \"teacherCourseId\": \"289636765587745454\",
  \"academicYearId\": \"284898051544333908\"
}"
```

Response Examples:
Status: 200 OK
```json
{
    "response": {
        "gradebook": [
            {
                "id": "305849972115388757",
                "studentId": "302614477310802906",
                "subjectId": "284899892323693713",
                "teacherCourseId": null,
                "academicCriteriaSetId": "285172519344815899",
                "criteriaType": "GRADE_SCALE",
                "value": "F",
                "gradingPeriodId": "289627017530313962"
            }
        ]
    }
}
```
Status: 200 OK
```json
{
    "response": {
        "gradebook": [
            {
                "id": "305875853378599378",
                "studentId": "289636822508649188",
                "subjectId": null,
                "teacherCourseId": "289636765587745454",
                "academicCriteriaSetId": "305559363186073091",
                "criteriaType": "GRADE_SCALE",
                "value": "3",
                "gradingPeriodId": "285771587133639826"
            }
        ]
    }
}
```

### Get Grade Scale
Method: `GET`
Path: `/public/v2/grade-scale`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/grade-scale?curriculumProgramId=<curriculumId>`

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| curriculumProgramId | <curriculumId> | filter to get curriculum Grade Scales. | no |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/grade-scale?curriculumProgramId=<curriculumId>" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 200 OK
```json
{
    "response": {
        "gradeScales": [
            {
                "gradeScaleId": "302219651310423584",
                "gradeScaleLabel": "Grades 1 to 10",
                "scaleType": "REGULAR",
                "valueType": "NUMERIC",
                "criteriaType": "GRADE_SCALE",
                "values": [
                    {
                        "gradeValueId": "302219651499172616",
                        "abbreviation": "10",
                        "label": "10"
                    },
                    {
                        "gradeValueId": "302219651499172615",
                        "abbreviation": "9",
                        "label": "9"
                    },
                    {
                        "gradeValueId": "302219651528532745",
                        "abbreviation": "8",
                        "label": "8"
                    },
                    {
                        "gradeValueId": "302219651536921354",
                        "abbreviation": "7",
                        "label": "7"
                    },
                    {
                        "gradeValueId": "302219651545309963",
                        "abbreviation": "6",
                        "label": "6"
                    },
                    {
                        "gradeValueId": "302219651562087181",
                        "abbreviation": "5",
                        "label": "5"
                    },
                    {
                        "gradeValueId": "302219651562087180",
                        "abbreviation": "4",
                        "label": "4"
                    },
                    {
                        "gradeValueId": "302219651578864398",
                        "abbreviation": "3",
                        "label": "3"
                    },
                    {
                        "gradeValueId": "302219651591447311",
                        "abbreviation": "2",
                        "label": "2"
                    },
                    {
                        "gradeValueId": "302219651599835920",
                        "abbreviation": "1",
                        "label": "1"
                    }
                ]
            },
            {
                "gradeScaleId": "305559363186073091",
                "gradeScaleLabel": "Grades A to H",
                "scaleType": "REGULAR",
                "valueType": "ALPHA",
                "criteriaType": "GRADE_SCALE",
                "values": [
                    {
                        "gradeValueId": "305559363278342708",
                        "abbreviation": "1",
                        "label": "A+"
                    },
                    {
                        "gradeValueId": "305559363278342709",
                        "abbreviation": "2",
                        "label": "2"
                    },
                    {
                        "gradeValueId": "305559363320285750",
                        "abbreviation": "3",
                        "label": "B+"
                    },
                    {
                        "gradeValueId": "305559363320285751",
                        "abbreviation": "4",
                        "label": "B"
                    }
                ]
            },
            {
                "gradeScaleId": "285172519353204509",
                "gradeScaleLabel": "Final grade",
                "scaleType": "REGULAR",
                "valueType": "ALPHA",
                "criteriaType": "GRADE_SCALE",
                "values": [
                    {
                        "gradeValueId": "285172519353189640",
                        "abbreviation": "A+",
                        "label": "Outstanding"
                    },
                    {
                        "gradeValueId": "285172519353189641",
                        "abbreviation": "A",
                        "label": "Confident"
                    },
                    {
                        "gradeValueId": "285172519353189642",
                        "abbreviation": "B+",
                        "label": "Skilled"
                    },
                    {
                        "gradeValueId": "285172519353189643",
                        "abbreviation": "B",
                        "label": "Competent"
                    },
                    {
                        "gradeValueId": "285172519353189644",
                        "abbreviation": "C+",
                        "label": "Progressing"
                    },
                    {
                        "gradeValueId": "285172519357383949",
                        "abbreviation": "C",
                        "label": "Developing"
                    },
                    {
                        "gradeValueId": "285172519357383950",
                        "abbreviation": "D",
                        "label": "Beginning"
                    },
                    {
                        "gradeValueId": "285172519357383951",
                        "abbreviation": "F",
                        "label": "Needs Support"
                    }
                ]
            },
            {
                "gradeScaleId": "285172519357398814",
                "gradeScaleLabel": "Special grades",
                "scaleType": "SPECIAL",
                "valueType": "ALPHA",
                "criteriaType": "GRADE_SCALE",
                "values": [
                    {
                        "gradeValueId": "285172519357383952",
                        "abbreviation": "ML",
                        "label": "Medical Leave"
                    },
                    {
                        "gradeValueId": "285172519357383953",
                        "abbreviation": "AB",
                        "label": "Absent"
                    },
                    {
                        "gradeValueId": "285172519357383954",
                        "abbreviation": "EX",
                        "label": "Excused"
                    },
                    {
                        "gradeValueId": "285172519357383955",
                        "abbreviation": "INC",
                        "label": "Incomplete"
                    },
                    {
                        "gradeValueId": "285172519357383956",
                        "abbreviation": "NA",
                        "label": "Not Applicable"
                    }
                ]
            }
        ]
    }
}
```

## Timetable
### Get Timetable Slots
Method: `GET`
Path: `/public/v2/timetable-slots`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/timetable-slots`

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| count | Integer | Number of slots to return | yes |
| cursor | String | Previous response endCursor to get next page | yes |
| curriculumIds | [] String (Required) | Comma seperated unique Identifiers for curriculums | yes |
| academicYearId | String (Required) | Unique identifier for academic year | yes |
| startDate | String (Required) | String containing startDate in the format "YYYY-MM-DD". | yes |
| endDate | String (Required) | String containing endDate in the format "YYYY-MM-DD". | yes |
| courseIds | [] String | Array of courseIDs (string), if passed, it will return all the timetable-slots for those courses. | yes |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/timetable-slots" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 200 OK
```json
{
    "response": {
        "totalCount": 26,
        "edges": [
            {
                "periodId": "16797",
                "courseId": "34852",
                "weekday": 2,
                "rotationDayId": null,
                "staffIds": [
                    "24452",
                    "14852"
                ],
                "location": "",
                "subjectInfo": "English",
                "startTime": "09:00:00",
                "endTime": "09:45:00",
                "curriculumProgramId": "2965",
                "date": "2024-12-31",
                "routineId": "132",
                "cursor": "eyJpZCI6IjExNTIxODk1NTA1NTkyNzU5NCIsImRhdGUiOiIyMDI0LTEyL"
            },
            {
                "periodId": "4700061380380114",
                "courseId": "34852",
                "weekday": 2,
                "rotationDayId": null,
                "staffIds": [
                    "24452",
                    "14852"
                ],
                "location": "",
                "subjectInfo": "Science",
                "startTime": "10:30:00",
                "endTime": "11:15:00",
                "curriculumProgramId": "2965",
                "date": "2024-12-24",
                "routineId": "132",
                "cursor": "eyJpZCI6IjExNTIxODk1NTA1NTkyNzU5NSIsImRhdGUiOiIyMDI0LTEyLTI"
            },
            {
                "periodId": "4700061380380114",
                "courseId": "34852",
                "weekday": 2,
                "rotationDayId": null,
                "staffIds": [
                    "24452",
                    "14852"
                ],
                "location": "",
                "subjectInfo": "Maths",
                "startTime": "10:30:00",
                "endTime": "11:15:00",
                "curriculumProgramId": "2965",
                "date": "2024-12-31",
                "routineId": "132",
                "cursor": "eyJpZCI6IjExNTIxODk1NTA1NTkyNzU5NSIsImRhd"
            },
            {
                "periodId": "4700061380380114",
                "courseId": "34852",
                "weekday": 3,
                "rotationDayId": null,
                "staffIds": [
                    "24452",
                    "14852"
                ],
                "location": "",
                "subjectInfo": "History",
                "startTime": "09:30:00",
                "endTime": "10:15:00",
                "curriculumProgramId": "2965",
                "date": "2024-12-25",
                "routineId": "132",
                "cursor": "eyJpZCI6IjExNTIxODk1NTA1NTkyNzU5NiIsImRhdGU"
            }
        ],
        "pageInfo": {
            "hasNextPage": true,
            "hasPreviousPage": true,
            "startCursor": "eyJpZCI6IjExNTIxODk1NTA1NTkyNzU5NCIsImRhdGUiOiI",
            "endCursor": "eyJpZCI6IjExNTIxODk1NTA1NTkyNzU5NiIsImRhdGUiOiIyMDI0LTE"
        }
    }
}
```

### Create Period
Method: `POST`
Path: `/public/v2/period`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/period`

Description:
This endpoint makes an HTTP POST request to create a new period.
Request Body for the same is as follows:

Field
Type
Description
Is Required ?

label
string
Unique name given to a period.
Yes

abbreviation
string
Short abbreviation given to the period.
Yes

type
string
Type of period to be created.
Yes

curriculumId
string
Unique identifier of the curriculum program.
Yes

academicYearId
string
Unique identifier of the academic year.
Yes

Auth: Bearer token (`Authorization: Bearer <token>`)

Request Body (raw):
```json
{
    "label": "String!",
    "type": "String!",
    "abbreviation": "String!",
    "curriculumId": "String!",
    "academicYearId": "String!"
}
```

Example Request (cURL):
```bash
curl -X POST "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/period" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  --data-raw "{
    \"label\": \"String!\",
    \"type\": \"String!\",
    \"abbreviation\": \"String!\",
    \"curriculumId\": \"String!\",
    \"academicYearId\": \"String!\"
}"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "period": {
            "id": "135911876696475302",
            "label": "Test Period",
            "abbreviation": "MP",
            "type": "REGULAR",
            "organizationId": "12499",
            "curriculumId": "14923",
            "academicYearId": "20589"
        }
    }
}
```

### Update Period
Method: `PUT`
Path: `/public/v2/period/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/period/:id`

Description:
This endpoint makes an HTTP PUT request to update an existing period.

Request Body for the same is as follows:
- Pass either the updated value or the existnig value.

Field
Type
Description
Is Required ?

label
string
Unique name given to a period.
Yes

abbreviation
string
Short abbreviation given to the period.
Yes

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <id> | unique identifier of the period to be updated (Required) |

Request Body (raw):
```json
{
    "label": "String!",
    "abbreviation": "String!"
}
```

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/period/:id" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  --data-raw "{
    \"label\": \"String!\",
    \"abbreviation\": \"String!\"
}"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "period": {
            "id": "135911876696475302",
            "label": "testperiod -2",
            "abbreviation": "MP",
            "type": "REGULAR"
        }
    }
}
```

### Delete Period
Method: `DELETE`
Path: `/public/v2/period/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/period/:id`

Description:
This endpoint makes an HTTP DELETE request to delete the existing period.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <id> | unique identifier of the period to be deleted (Required) |

Example Request (cURL):
```bash
curl -X DELETE "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/period/:id" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "isSuccess": true
    }
}
```

### Get Periods
Method: `GET`
Path: `/public/v2/periods`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/periods`

Description:
This endpoint makes an HTTP GET request to retrieve a list of periods. The request includes query parameters for curriculumIds, academicYearIds, count, and cursor.

Request Parameters

curriculumIds (optional) : A comma-separated list of curriculum IDs.

academicYearIds (required): A comma-separated list of academic year IDs.

count (optional): The number of periods to retrieve. (default 25)

cursor: A cursor for pagination.

Response
The response will include the list of periods based on the provided query parameters.

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| curriculumIds | [] String | Comma seperated unique Identifiers for curriculums | yes |
| academicYearIds | [] String | Comma seperated unique Identifiers for academic years | yes |
| count | Integer | Number of periods to return | yes |
| cursor | String | Previous response endCursor to get next page | yes |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/periods" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 200 OK
```json
{
    "response": {
        "totalCount": 32,
        "edges": [
            {
                "id": 32382832,
                "label": "Period 1",
                "abbreviation": "P1",
                "sourceId": "TDP-32382832",
                "type": "REGULAR",
                "academicYearId": 67632748,
                "curriculumId": 82327123
            },
            {
                "id": 98283732,
                "label": "Lunch",
                "abbreviation": "Lu",
                "sourceId": "TDP-98283732",
                "type": "BREAK",
                "academicYearId": 98273582,
                "curriculumId": 56725352
            }
        ],
        "pageInfo": {
            "hasNextPage": true,
            "hasPreviousPage": false,
            "startCursor": null,
            "endCursor": "eyJjdXJzb3IiOiJrdW1hciI"
        }
    }
}
```

### Get Period
Method: `GET`
Path: `/public/v2/periods/:periodId`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/periods/:periodId`

Description:
Get Period by ID
This endpoint retrieves information about a specific period identified by its unique ID.

Request
Request Path Parameters

periodId (Required): The unique ID of the period.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| periodId |  | The unique ID of the period. |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/periods/:periodId" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 200 OK
```json
{
 "response": {
   "period": {
     "id": 98283732,
     "label": "Lunch",
     "abbreviation": "Lu",
     "sourceId": "TDP-98283732",
     "type": "BREAK",
     "academicYearId": 98273582,
     "curriculumId": 56725352
   }
 }
}
```

### Create Bell Schedule
Method: `POST`
Path: `/public/v2/bell-schedule`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/bell-schedule`

Description:
This endpoint makes an HTTP POST request to create a new bell schedule.
Request Body for the same is as follows:

Field
Type
Description
Is Required ?

label
string
Unique name given to a period.
Yes

curriculumId
string
Unique identifier of the curriculum program.
Yes

academicYearId
string
Unique identifier of the academic year.
Yes

periods
Array
List of periods with startTime and endTime
Yes

Structure of Periods

Field
Type
Description
Is Required ?

startTime
string
Starting time of the period (00:00:00)
Yes

endTime
string
Ending time of the period (00:00:00)
Yes

periodId
string
Unique identifier of the period
Yes

Auth: Bearer token (`Authorization: Bearer <token>`)

Request Body (raw):
```json
{
 "label": "String!",
 "curriculumId": "String!",
 "academicYearId": "String!",
 "periods": [
   {
     "startTime": "String!",
     "endTime": "String!",
     "periodId": "String!"
   },
   {
     "startTime": "String!",
     "endTime": "String!",
     "periodId": "String!"
   }
 ]
}
```

Example Request (cURL):
```bash
curl -X POST "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/bell-schedule" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  --data-raw "{
 \"label\": \"String!\",
 \"curriculumId\": \"String!\",
 \"academicYearId\": \"String!\",
 \"periods\": [
   {
     \"startTime\": \"String!\",
     \"endTime\": \"String!\",
     \"periodId\": \"String!\"
   },
   {
     \"startTime\": \"String!\",
     \"endTime\": \"String!\",
     \"periodId\": \"String!\"
   }
 ]
}"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "isSuccess": true,
        "id": "135937124233905814",
        "label": "openAPI2.0"
    }
}
```

### Update Bell Schedule
Method: `PUT`
Path: `/public/v2/bell-schedule/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/bell-schedule/:id`

Description:
This endpoint makes an HTTP PUT request to update an existing bell schedule.
Request Body for the same is as follows:

- Pass either the updated value or the existnig value.

Field
Type
Description
Is Required ?

label
string
Unique name given to a period.
Yes

periods
Array
List of periods with startTime and endTime
Yes

Structure of Periods

Field
Type
Description
Is Required ?

startTime
string
Starting time of the period (00:00:00)
Yes

endTime
string
Ending time of the period (00:00:00)
Yes

periodId
string
Unique identifier of the period
Yes

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <id> | unique identifier of the Bell Schedule to be updated (Required) |

Request Body (raw):
```json
{
 "label": "String!",
 "periods": [
   {
     "startTime": "String!",
     "endTime": "String!",
     "periodId": "String!"
   },
   {
     "startTime": "String!",
     "endTime": "String!",
     "periodId": "String!"
   }
 ]
}
```

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/bell-schedule/:id" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  --data-raw "{
 \"label\": \"String!\",
 \"periods\": [
   {
     \"startTime\": \"String!\",
     \"endTime\": \"String!\",
     \"periodId\": \"String!\"
   },
   {
     \"startTime\": \"String!\",
     \"endTime\": \"String!\",
     \"periodId\": \"String!\"
   }
 ]
}"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "isSuccess": true,
        "id": "134834882273609331",
        "label": "Bell-schedule label"
    }
}
```

### Delete Bell Schedule
Method: `DELETE`
Path: `/public/v2/bell-schedule/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/bell-schedule/:id`

Description:
This endpoint makes an HTTP DELETE request to delete the existing bell schedule by its unique identifier.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <id> | unique identifier of the Bell Schedule to be deleted. (Required) |

Example Request (cURL):
```bash
curl -X DELETE "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/bell-schedule/:id" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "isSuccess": true
    }
}
```

### Get Bell Schedule By Id
Method: `GET`
Path: `/public/v2/bell-schedule/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/bell-schedule/:id`

Description:
This endpoint makes an HTTP GET request to retrieve a bell schedule by it's unique identifier.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <id> | unique identifier of the Bell Schedule. (Required) |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/bell-schedule/:id" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "bellSchedule": {
            "id": "134834882273609331",
            "label": "Updated BS",
            "curriculumId": "14923",
            "academicYearId": "20589",
            "periods": [
                {
                    "periodId": 15992,
                    "startTime": "08:00:00",
                    "endTime": "08:30:00"
                },
                {
                    "periodId": 15997,
                    "startTime": "09:00:00",
                    "endTime": "09:45:00"
                }
            ]
        }
    }
}
```

### Get Bell Schedule
Method: `GET`
Path: `/public/v2/bell-schedule`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/bell-schedule?curriculumIds=[] String&academicYearIds=[] String&count=Integer&cursor=String`

Description:
This endpoint makes an HTTP GET request to retrieve a list of bell schedule. The request includes query parameters for curriculumIds, academicYearIds, count, and cursor.

Request Parameters

curriculumIds (Optional): A comma-separated list of curriculum IDs.

academicYearIds (Required): A comma-separated list of academic year IDs.

count (Optional): The number of bell schedule to retrieve. (default 25)

cursor: A cursor for pagination.

Response
The response will include the list of bell schedule based on the provided query parameters.

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| curriculumIds | [] String | Comma seperated unique Identifiers for curriculums (Optional) | no |
| academicYearIds | [] String | Comma seperated unique Identifiers for academic years (Required) | no |
| count | Integer | Number of bell schedule to return (Optional) | no |
| cursor | String | Previous response endCursor to get next page | no |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/bell-schedule?curriculumIds=[] String&academicYearIds=[] String&count=Integer&cursor=String" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "totalCount": 29,
        "bellSchedules": [
            {
                "id": "34",
                "label": "Regular",
                "curriculumId": "14923",
                "academicYearId": "20589",
                "periodSet": [
                    {
                        "periodId": 15997,
                        "startTime": "00:30:00",
                        "endTime": "01:00:00"
                    },
                    {
                        "periodId": 15998,
                        "startTime": "01:00:00",
                        "endTime": "02:00:00"
                    },
                    {
                        "periodId": 15999,
                        "startTime": "02:00:00",
                        "endTime": "03:00:00"
                    },
                    {
                        "periodId": 16000,
                        "startTime": "03:00:00",
                        "endTime": "04:00:00"
                    },
                    {
                        "periodId": 16001,
                        "startTime": "04:00:00",
                        "endTime": "05:00:00"
                    },
                    {
                        "periodId": 16922,
                        "startTime": "05:00:00",
                        "endTime": "06:00:00"
                    },
                    {
                        "periodId": 5015488451053071,
                        "startTime": "06:00:00",
                        "endTime": "07:00:00"
                    },
                    {
                        "periodId": "44226694734679803",
                        "startTime": "10:00:00",
                        "endTime": "11:00:00"
                    },
                    {
                        "periodId": "44226737566912252",
                        "startTime": "11:00:00",
                        "endTime": "12:00:00"
                    },
                    {
                        "periodId": "44226764142022397",
                        "startTime": "12:00:00",
                        "endTime": "12:45:00"
                    },
                    {
                        "periodId": "44226798459817726",
                        "startTime": "13:00:00",
                        "endTime": "13:30:00"
                    },
                    {
                        "periodId": "44226827320823551",
                        "startTime": "13:30:00",
                        "endTime": "14:30:00"
                    },
                    {
                        "periodId": "44226857662418688",
                        "startTime": "14:30:00",
                        "endTime": "14:45:00"
                    },
                    {
                        "periodId": "44226884736651009",
                        "startTime": "14:45:00",
                        "endTime": "15:30:00"
                    },
                    {
                        "periodId": "44226908103118594",
                        "startTime": "15:30:00",
                        "endTime": "16:00:00"
                    },
                    {
                        "periodId": "44226937844928259",
                        "startTime": "16:00:00",
                        "endTime": "17:00:00"
                    },
                    {
                        "periodId": "44226961601466116",
                        "startTime": "17:00:00",
                        "endTime": "18:00:00"
                    },
                    {
                        "periodId": "44226982623317765",
                        "startTime": "18:00:00",
                        "endTime": "19:00:00"
                    },
                    {
                        "periodId": "44227006874783494",
                        "startTime": "19:00:00",
                        "endTime": "20:00:00"
                    },
                    {
                        "periodId": "44227028135710471",
                        "startTime": "20:00:00",
                        "endTime": "21:00:00"
                    },
                    {
                        "periodId": "44227052626251528",
                        "startTime": "21:00:00",
                        "endTime": "21:30:00"
                    },
                    {
                        "periodId": "44227077120986889",
                        "startTime": "21:30:00",
                        "endTime": "22:15:00"
                    },
                    {
                        "periodId": "44227101909323530",
                        "startTime": "22:15:00",
                        "endTime": "22:45:00"
                    },
                    {
                        "periodId": "44227140845047563",
                        "startTime": "22:45:00",
                        "endTime": "23:15:00"
                    },
                    {
                        "periodId": "44227166166060812",
                        "startTime": "23:15:00",
                        "endTime": "23:30:00"
                    },
                    {
                        "periodId": "44227216992636685",
                        "startTime": "23:30:00",
                        "endTime": "23:45:00"
                    },
                    {
                        "periodId": "44227241348960014",
                        "startTime": "23:45:00",
                        "endTime": "23:59:00"
                    },
                    {
                        "periodId": "97837929937778270",
                        "startTime": "09:00:00",
                        "endTime": "09:15:00"
                    }
                ]
            },
            {
                "id": "35",
                "label": "Early realease",
                "curriculumId": "14923",
                "academicYearId": "20589",
                "periodSet": [
                    {
                        "periodId": 15992,
                        "startTime": "08:00:00",
                        "endTime": "08:45:00"
                    },
                    {
                        "periodId": 15997,
                        "startTime": "08:45:00",
                        "endTime": "09:30:00"
                    },
                    {
                        "periodId": 15998,
                        "startTime": "09:30:00",
                        "endTime": "10:15:00"
                    }
                ]
            },
            {
                "id": "36",
                "label": "Bell Schd 1",
                "curriculumId": "14922",
                "academicYearId": "20589",
                "periodSet": [
                    {
                        "periodId": 15995,
                        "startTime": "01:15:00",
                        "endTime": "02:15:00"
                    },
                    {
                        "periodId": 16035,
                        "startTime": "08:45:00",
                        "endTime": "09:30:00"
                    },
                    {
                        "periodId": 16036,
                        "startTime": "09:30:00",
                        "endTime": "10:15:00"
                    },
                    {
                        "periodId": 16037,
                        "startTime": "10:15:00",
                        "endTime": "11:00:00"
                    },
                    {
                        "periodId": 16038,
                        "startTime": "11:00:00",
                        "endTime": "11:45:00"
                    },
                    {
                        "periodId": 16068,
                        "startTime": "11:45:00",
                        "endTime": "12:30:00"
                    },
                    {
                        "periodId": 16069,
                        "startTime": "12:30:00",
                        "endTime": "13:15:00"
                    },
                    {
                        "periodId": 16070,
                        "startTime": "13:15:00",
                        "endTime": "14:00:00"
                    },
                    {
                        "periodId": 16071,
                        "startTime": "14:00:00",
                        "endTime": "14:45:00"
                    },
                    {
                        "periodId": 16072,
                        "startTime": "14:45:00",
                        "endTime": "15:30:00"
                    },
                    {
                        "periodId": 16073,
                        "startTime": "15:30:00",
                        "endTime": "16:15:00"
                    },
                    {
                        "periodId": 16074,
                        "startTime": "16:15:00",
                        "endTime": "17:00:00"
                    },
                    {
                        "periodId": 16075,
                        "startTime": "17:00:00",
                        "endTime": "17:45:00"
                    }
                ]
            },
            {
                "id": "37",
                "label": "Early Release",
                "curriculumId": "14922",
                "academicYearId": "20589",
                "periodSet": [
                    {
                        "periodId": 15995,
                        "startTime": "08:00:00",
                        "endTime": "08:45:00"
                    },
                    {
                        "periodId": 16035,
                        "startTime": "08:45:00",
                        "endTime": "09:30:00"
                    },
                    {
                        "periodId": 16036,
                        "startTime": "09:30:00",
                        "endTime": "10:15:00"
                    }
                ]
            },
            {
                "id": "102",
                "label": "Half Days",
                "curriculumId": "14923",
                "academicYearId": "20589",
                "periodSet": [
                    {
                        "periodId": 15992,
                        "startTime": "08:00:00",
                        "endTime": "08:45:00"
                    },
                    {
                        "periodId": 15997,
                        "startTime": "08:45:00",
                        "endTime": "09:30:00"
                    },
                    {
                        "periodId": 15998,
                        "startTime": "09:30:00",
                        "endTime": "10:15:00"
                    }
                ]
            }
        ],
        "pageInfo": {
            "hasNextPage": true,
            "hasPreviousPage": false,
            "startCursor": "eyJpZCI6IjM0IiwibGFiZWwiOiJSZWd1bGFyIn0=",
            "endCursor": "eyJpZCI6IjEwMiIsImxhYmVsIjoiSGFsZiBEYXlzIn0="
        }
    }
}
```

### Create Routine
Method: `POST`
Path: `/public/v2/routine`
Base URL: `http://localhost`
Full URL: `http://localhost:3001/public/v2/routine`

Description:
This endpoint makes an HTTP POST request to create a new routine.

Request Body for the same is as follows:

Field
Type
Description
Is Required ?

label
String
The label for the request
Yes

gradeIds
Array of Strings
List of grade IDs
Yes

routineMode
String
The routine mode
(Rotation Cycle or Operational Days)
Yes

rotationDays
Array
List of rotation days (optional)
( Required only where routine mode is Rotation Cycle)
No

startDate
String
The start date (required)
Yes

endDate
String
The end date
Yes

curriculumId
String
Unique identifier of the curriculum
Yes

academicYearId
String
Unique identifier of the academic year
Yes

countHolidayAsRotationDay
Boolean
Whether to count holidays as rotation days
Yes

dayPatterns
Array
List of day patterns (Required only where routine mode is Rotation Cycle)
No

bellScheduleMap
Array
List of bell schedules
Yes

Structure of rotationDays

Field
Type
Description
Is Required ?

label
String
label of rotation day
Yes

abbreviation
String
short abbreviation given to rotation day label
Yes

Structure of dayPatterns

Field
Type
Description
Is Required ?

rotationDay
String
Rotation day label
Yes

isStartCycle
Boolean
specifies the start of the cycle
No

Structure of bellScheduleMap (In case where routine mode is Rotation Cycle)

Field
Type
Description
Is Required ?

rotationDay
String
Rotation day label
Yes

bellScheduleId
String
Unique identifier of the Bell Schedule
Yes

Structure of bellScheduleMap (In case where routine mode is Operational Days)

Field
Type
Description
Is Required ?

weekday
Integer
Weekday number of the organisation operational day
Yes

bellScheduleId
String
Unique identifier of the Bell Schedule
Yes

Auth: Bearer token (`Authorization: Bearer <token>`)

Request Body (raw):
```json
{
    "label": "String!",
    "gradeIds": [
        "String!"
    ],
    "routineMode": "String!",
    "rotationDays": [ // incase of rotation_cycle only
        {
            "label": "String!",
            "abbreviation": "String!"
        }
    ],
    "startDate": "String!",
    "endDate": "String!",
    "curriculumId": "String!",
    "academicYearId": "String!",
    "countHolidayAsRotationDay": "Boolean!",
    "dayPatterns": [ // incase of rotation_cycle only
        {
            "rotationDay": "String!",
            "isStartCycle": "Boolean"
        },
        {
            "rotationDay": "String!",
            "isStartCycle": "Boolean"
        }
    ],
    "bellScheduleMap": [
        {
            "rotationDay": "Integer", // weekday: incase of operational_days
            "bellScheduleId": "String!"
        }
    ]
}
```

Example Request (cURL):
```bash
curl -X POST "http://localhost:3001/public/v2/routine" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  --data-raw "{
    \"label\": \"String!\",
    \"gradeIds\": [
        \"String!\"
    ],
    \"routineMode\": \"String!\",
    \"rotationDays\": [ // incase of rotation_cycle only
        {
            \"label\": \"String!\",
            \"abbreviation\": \"String!\"
        }
    ],
    \"startDate\": \"String!\",
    \"endDate\": \"String!\",
    \"curriculumId\": \"String!\",
    \"academicYearId\": \"String!\",
    \"countHolidayAsRotationDay\": \"Boolean!\",
    \"dayPatterns\": [ // incase of rotation_cycle only
        {
            \"rotationDay\": \"String!\",
            \"isStartCycle\": \"Boolean\"
        },
        {
            \"rotationDay\": \"String!\",
            \"isStartCycle\": \"Boolean\"
        }
    ],
    \"bellScheduleMap\": [
        {
            \"rotationDay\": \"Integer\", // weekday: incase of operational_days
            \"bellScheduleId\": \"String!\"
        }
    ]
}"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "routine": {
            "id": "135967186786190632",
            "label": "routine_label",
            "routineMode": "ROTATION_CYCLE",
            "dayPatternType": "INDEPENDENT_OF_WEEKDAYS",
            "countHolidayAsRotationDay": false,
            "startDate": "2023-04-01",
            "endDate": "2023-04-03",
            "rotationDays": [
                {
                    "id": "135967195854278209",
                    "label": "Day 1",
                    "abbreviation": "1"
                },
                {
                    "id": "135967195963330114",
                    "label": "Day 2",
                    "abbreviation": "2"
                }
            ]
        }
    }
}
```

### Update Routine
Method: `POST`
Path: `/public/v2/routine/:id`
Base URL: `http://localhost`
Full URL: `http://localhost:3001/public/v2/routine/:id`

Description:
This endpoint makes an HTTP POST request to create a new routine.

Request Body for the same is as follows:

Field
Type
Description
Is Required ?

label
String
The label for the request
Yes

gradeIds
Array of Strings
List of grade IDs
Yes

routineMode
String
The routine mode
(Rotation Cycle / Opertional Days)
Yes

rotationDays
Array
List of rotation days (optional)
(Required only where routine mode is Rotation Cycle)
No

startDate
String
The start date
Yes

endDate
String
The end date
Yes

countHolidayAsRotationDay
Boolean
Whether to count holidays as rotation days
Yes

dayPatterns
Array
List of day patterns (optional)
(Required only where routine mode is Rotation Cycle)
No

bellScheduleMap
Array
List of bell schedules
Yes

Structure of rotationDays

Field
Type
Description
Is Required ?

id
String
ID of rotation day
Yes

label
String
label of rotation day
Yes

abbreviation
String
short abbreviation given to rotation day label
Yes

Structure of dayPatterns

Field
Type
Description
Is Required ?

rotationDayId
String
Rotation day Id
Yes

isStartCycle
Boolean
specifies the start of the cycle.
(Default: false)
No

Structure of bellScheduleMap (In case where routine mode is Rotation Cycle)

Field
Type
Description
Is Required ?

rotationDayId
String
Rotation day Id
Yes

bellScheduleId
String
List of grade IDs
Yes

Structure of bellScheduleMap (In case where routine mode is Operational Days)

Field
Type
Description
Is Required ?

weekday
Integer
weekday number of the organisation operational day
Yes

bellScheduleId
String
List of grade IDs
Yes

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <id> | Unique id of the routine to be updated. (Required) |

Example Request (cURL):
```bash
curl -X POST "http://localhost:3001/public/v2/routine/:id" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "routine": {
            "id": "134498390531638563",
            "label": "p906",
            "routineMode": "ROTATION_CYCLE",
            "dayPatternType": "INDEPENDENT_OF_WEEKDAYS",
            "countHolidayAsRotationDay": true,
            "startDate": "2023-11-28",
            "endDate": "2023-11-30"
        }
    }
}
```

### Delete Routine
Method: `DELETE`
Path: `/public/v2/routine/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/routine/:id`

Description:
This endpoint makes an HTTP DELETE request to delete the existing routine.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <id> | unique identifier of the routine to be deleted. (Required) |

Example Request (cURL):
```bash
curl -X DELETE "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/routine/:id" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "isSuccess": true
    }
}
```

### Get Routine
Method: `GET`
Path: `/public/v2/routine/:routineId`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/routine/:routineId`

Description:
This endpoint retrieves information about a specific routine identified by the routine Id parameter.

Request
Request Path Parameters

routineId (Required): The unique ID of the routine.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| routineId | <routineId> | Unique identifier for a specific routine (Required) |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/routine/:routineId" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 200 OK
```json
{
    "response": {
        "routine": {
            "id": "195",
            "curriculumProgramId": "2965",
            "academicYearId": "3913",
            "label": "Test routine",
            "routineMode": "ROTATION_CYCLE",
            "dayPatternType": "DEPENDENT_OF_WEEKDAYS",
            "countHolidayAsRotationDay": false,
            "validity": {
                "startDate": "2023-07-14",
                "endDate": "2024-06-01"
            },
            "rotationDays": [
                {
                    "id": "823",
                    "label": "Day 1"
                },
                {
                    "id": "824",
                    "label": "Day 2"
                },
                {
                    "id": "825",
                    "label": "Day 3"
                },
                {
                    "id": "826",
                    "label": "Day 4"
                },
                {
                    "id": "827",
                    "label": "Day 5"
                }
            ],
            "dayPatterns": [
                {
                    "id": "21142878088593628",
                    "relation": "CYCLES",
                    "rotationDays": [
                        {
                            "id": 823,
                            "isStartCycle": true
                        },
                        {
                            "id": 824,
                            "isStartCycle": false
                        }
                    ]
                },
                {
                    "id": "26136148321501423",
                    "relation": "CYCLES",
                    "rotationDays": [
                        {
                            "id": 823,
                            "isStartCycle": true
                        },
                        {
                            "id": 824,
                            "isStartCycle": false
                        },
                        {
                            "id": 824,
                            "isStartCycle": false
                        }
                    ]
                },
                {
                    "id": "26136148329890032",
                    "relation": "CYCLES",
                    "rotationDays": [
                        {
                            "id": 823,
                            "isStartCycle": true
                        },
                        {
                            "id": 824,
                            "isStartCycle": false
                        },
                        {
                            "id": 825,
                            "isStartCycle": false
                        },
                        {
                            "id": 826,
                            "isStartCycle": false
                        }
                    ]
                },
                {
                    "id": "26136148342472945",
                    "relation": "IS",
                    "rotationDays": [
                        {
                            "id": 826,
                            "isStartCycle": false
                        }
                    ]
                }
            ],
            "grades": [
                {
                    "id": "27890",
                    "name": "K1"
                },
                {
                    "id": "27889",
                    "name": "K2"
                },
                {
                    "id": "27891",
                    "name": "Pre-K"
                }
            ],
            "bellSchedulesMapping": [
                {
                    "id": "5489555956303112",
                    "weekday": null,
                    "rotationDay": {
                        "id": "823",
                        "label": "Day 1"
                    },
                    "bellSchedule": {
                        "id": "130",
                        "label": "REGULAR",
                        "periodSet": [
                            {
                                "period": {
                                    "id": "16305",
                                    "label": "Prayer"
                                },
                                "startTime": "08:15:00",
                                "endTime": "09:00:00"
                            },
                            {
                                "period": {
                                    "id": "16797",
                                    "label": "Period 1"
                                },
                                "startTime": "09:00:00",
                                "endTime": "09:45:00"
                            },
                            {
                                "period": {
                                    "id": "4700061380380114",
                                    "label": "Period 3"
                                },
                                "startTime": "10:30:00",
                                "endTime": "11:15:00"
                            },
                            {
                                "period": {
                                    "id": "54329277679669576",
                                    "label": "break 2"
                                },
                                "startTime": "10:30:00",
                                "endTime": "11:15:00"
                            }
                        ]
                    }
                },
                {
                    "id": "5489555968886025",
                    "weekday": null,
                    "rotationDay": {
                        "id": "824",
                        "label": "Day 2"
                    },
                    "bellSchedule": {
                        "id": "5492325841109369",
                        "label": "EARLY LEAVE",
                        "periodSet": [
                            {
                                "period": {
                                    "id": "16305",
                                    "label": "Prayer"
                                },
                                "startTime": "08:00:00",
                                "endTime": "08:45:00"
                            },
                            {
                                "period": {
                                    "id": "16797",
                                    "label": "Period 1"
                                },
                                "startTime": "08:45:00",
                                "endTime": "09:30:00"
                            },
                            {
                                "period": {
                                    "id": "4700061380380114",
                                    "label": "Period 3"
                                },
                                "startTime": "09:30:00",
                                "endTime": "10:15:00"
                            },
                            {
                                "period": {
                                    "id": "5491927365453372",
                                    "label": "Leaving talk"
                                },
                                "startTime": "10:15:00",
                                "endTime": "11:00:00"
                            }
                        ]
                    }
                },
                {
                    "id": "5489555973080330",
                    "weekday": null,
                    "rotationDay": {
                        "id": "825",
                        "label": "Day 3"
                    },
                    "bellSchedule": {
                        "id": "130",
                        "label": "REGULAR",
                        "periodSet": [
                            {
                                "period": {
                                    "id": "16305",
                                    "label": "Prayer"
                                },
                                "startTime": "08:15:00",
                                "endTime": "09:00:00"
                            },
                            {
                                "period": {
                                    "id": "16797",
                                    "label": "Period 1"
                                },
                                "startTime": "09:00:00",
                                "endTime": "09:45:00"
                            },
                            {
                                "period": {
                                    "id": "4700061380380114",
                                    "label": "Period 3"
                                },
                                "startTime": "10:30:00",
                                "endTime": "11:15:00"
                            },
                            {
                                "period": {
                                    "id": "54329277679669576",
                                    "label": "break 2"
                                },
                                "startTime": "10:30:00",
                                "endTime": "11:15:00"
                            }
                        ]
                    }
                },
                {
                    "id": "5489555973080331",
                    "weekday": null,
                    "rotationDay": {
                        "id": "826",
                        "label": "Day 4"
                    },
                    "bellSchedule": {
                        "id": "130",
                        "label": "REGULAR",
                        "periodSet": [
                            {
                                "period": {
                                    "id": "16305",
                                    "label": "Prayer"
                                },
                                "startTime": "08:15:00",
                                "endTime": "09:00:00"
                            },
                            {
                                "period": {
                                    "id": "16797",
                                    "label": "Period 1"
                                },
                                "startTime": "09:00:00",
                                "endTime": "09:45:00"
                            },
                            {
                                "period": {
                                    "id": "4700061380380114",
                                    "label": "Period 3"
                                },
                                "startTime": "10:30:00",
                                "endTime": "11:15:00"
                            },
                            {
                                "period": {
                                    "id": "54329277679669576",
                                    "label": "break 2"
                                },
                                "startTime": "10:30:00",
                                "endTime": "11:15:00"
                            }
                        ]
                    }
                },
                {
                    "id": "5489555973080332",
                    "weekday": null,
                    "rotationDay": {
                        "id": "827",
                        "label": "Day 5"
                    },
                    "bellSchedule": {
                        "id": "130",
                        "label": "REGULAR",
                        "periodSet": [
                            {
                                "period": {
                                    "id": "16305",
                                    "label": "Prayer"
                                },
                                "startTime": "08:15:00",
                                "endTime": "09:00:00"
                            },
                            {
                                "period": {
                                    "id": "16797",
                                    "label": "Period 1"
                                },
                                "startTime": "09:00:00",
                                "endTime": "09:45:00"
                            },
                            {
                                "period": {
                                    "id": "4700061380380114",
                                    "label": "Period 3"
                                },
                                "startTime": "10:30:00",
                                "endTime": "11:15:00"
                            },
                            {
                                "period": {
                                    "id": "54329277679669576",
                                    "label": "break 2"
                                },
                                "startTime": "10:30:00",
                                "endTime": "11:15:00"
                            }
                        ]
                    }
                }
            ],
            "routineUpdateEvents": [
                {
                    "date": "2024-01-10",
                    "eventType": "UPDATE",
                    "bellSchedule": {
                        "id": "130",
                        "label": "REGULAR"
                    },
                    "rotationDay": {
                        "id": "824",
                        "label": "Day 2"
                    },
                    "isHoliday": false
                },
                {
                    "date": "2024-03-04",
                    "eventType": "UPDATE",
                    "bellSchedule": {
                        "id": "5492325841109369",
                        "label": "EARLY LEAVE"
                    },
                    "rotationDay": {
                        "id": "824",
                        "label": "Day 2"
                    },
                    "isHoliday": true
                },
                {
                    "date": "2024-03-05",
                    "eventType": "UPDATE",
                    "bellSchedule": {
                        "id": "5492325841109369",
                        "label": "EARLY LEAVE"
                    },
                    "rotationDay": {
                        "id": "825",
                        "label": "Day 3"
                    },
                    "isHoliday": true
                },
                {
                    "date": "2024-03-26",
                    "eventType": "UPDATE",
                    "bellSchedule": {
                        "id": "5492325841109369",
                        "label": "EARLY LEAVE"
                    },
                    "rotationDay": {
                        "id": "823",
                        "label": "Day 1"
                    },
                    "isHoliday": false
                },
                {
                    "date": "2024-03-27",
                    "eventType": "UPDATE",
                    "bellSchedule": {
                        "id": "24332336359277027",
                        "label": "REGULAR(Copy)"
                    },
                    "rotationDay": {
                        "id": "826",
                        "label": "Day 4"
                    },
                    "isHoliday": false
                }
            ]
        }
    }
}
```

### Get Routines
Method: `GET`
Path: `/public/v2/routines`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/routines`

Description:
This endpoint makes an HTTP GET request to retrieve a list of routines for the specified curriculum and academic year.

Request
Query Parameters

curriculumIds (Optional): A comma-separated list of curriculum IDs to filter the routines.

academicYearIds (Required): A comma-separated list of academic year IDs to filter the routines.

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| curriculumIds | [] String | Comma seperated unique Identifiers for curriculums (Optional) | yes |
| academicYearIds | [] String | Comma seperated unique Identifiers for academic years (Required) | yes |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/routines" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 200 OK
```json
{
    "response": {
        "routines": [
            {
                "id": "109",
                "label": "test",
                "curriculumProgramId": "2965",
                "academicYearId": "3913",
                "routineMode": "OPERATIONAL_DAYS",
                "validity": {
                    "startDate": "2025-01-14",
                    "endDate": "2026-02-11"
                },
                "dayPatternType": null,
                "countHolidayAsRotationDay": false
            },
            {
                "id": "114",
                "label": "Grade 2 routine edit",
                "curriculumProgramId": "2965",
                "academicYearId": "3913",
                "routineMode": "ROTATION_CYCLE",
                "validity": {
                    "startDate": "2026-12-23",
                    "endDate": "2027-02-01"
                },
                "dayPatternType": "INDEPENDENT_OF_WEEKDAYS",
                "countHolidayAsRotationDay": true
            },
            {
                "id": "132",
                "label": "New Routine By Meet",
                "curriculumProgramId": "2965",
                "academicYearId": "3913",
                "routineMode": "OPERATIONAL_DAYS",
                "validity": {
                    "startDate": "2022-01-12",
                    "endDate": "2025-01-31"
                },
                "dayPatternType": "DEPENDENT_OF_WEEKDAYS",
                "countHolidayAsRotationDay": false
            },
            {
                "id": "195",
                "label": "Test routine",
                "curriculumProgramId": "2965",
                "academicYearId": "3913",
                "routineMode": "ROTATION_CYCLE",
                "validity": {
                    "startDate": "2023-07-14",
                    "endDate": "2024-06-01"
                },
                "dayPatternType": "DEPENDENT_OF_WEEKDAYS",
                "countHolidayAsRotationDay": false
            },
            {
                "id": "31951469749993903",
                "label": "routine 123",
                "curriculumProgramId": "2965",
                "academicYearId": "3913",
                "routineMode": "OPERATIONAL_DAYS",
                "validity": {
                    "startDate": "2023-09-22",
                    "endDate": "2024-02-01"
                },
                "dayPatternType": "INDEPENDENT_OF_WEEKDAYS",
                "countHolidayAsRotationDay": false
            },
            {
                "id": "33703866180567472",
                "label": "TestRoutine3",
                "curriculumProgramId": "2965",
                "academicYearId": "3913",
                "routineMode": "ROTATION_CYCLE",
                "validity": {
                    "startDate": "2024-03-19",
                    "endDate": "2025-01-31"
                },
                "dayPatternType": "DEPENDENT_OF_WEEKDAYS",
                "countHolidayAsRotationDay": false
            }
        ]
    }
}
```

### Post Timetable Slots
Method: `POST`
Path: `/public/v2/timetable-slots`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/timetable-slots`

Description:
Description:

The Post Timetable Slots API is used to create and configure timetable slots, specifying details such as curriculum, academic year, course, weekday/rotation day, period, and associated metadata like subject, location, and staff IDs.

Request Body:

Field
Type
Description
Is Required ?

curriculumId
String
Unique identifier of the curriculum program.
Yes

academicYearId
String
Unique identifier of the academic year.
Yes

courseId
String
Unique identifier of the course associated with the timetable slot.
Yes

rotationDayId
String
The rotation day on which the timetable slot occurs when the routine mode is ‘ROTATION CYCLE’.
Yes

weekDay
Integer
The weekday on which the timetable slot occurs when the routine mode is ‘OPERATIONAL DAYS’.
Yes

periodId
String
Unique identifier of the period associated with the timetable slot.
No

startTIme
String
The start time of the timetable slot in 24-hour format (hh:mm:ss)
No

endTime
String
The end time of the timetable slot in 24-hour format (hh:mm:ss)
No

tImeTableSlotData
Object
Object containing the info of timetable slot
No

applicableFrom
String
The date from which the timetable slot is applicable.
No

applicableTill
String
The date until which the timetable slot is applicable.
No

isEnabled
boolean
A boolean indicating whether the timetable slot is enabled.

This is set to true by default
No

timeTableSlotData Object

Field
Type
Description
Is Required?

subject
string
The subject associated with the timetable slot.
No

location
string
The location where the timetable slot takes place
No

staffIDs
[string]
An array of unique identifiers of the staff associated with the timetable slot.
No

Auth: Bearer token (`Authorization: Bearer <token>`)

Request Body (raw):
```json
{
  "curriculumId": "String!",
  "academicYearId": "String!",
  "courseId": "String!",
  "rotationDayId/weekDay": "String!",
  "periodId": "String",
  "startTime": "String",
  "endTime": "String",
  "timetableSlotData": {
    "subject": "String",
    "location": "String",
    "staffIDs": ["String"]
  },
  "applicableFrom": "String",
  "applicableTill": "String",
  "isEnabled": "boolean"
}
```

Example Request (cURL):
```bash
curl -X POST "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/timetable-slots" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  --data-raw "{
  \"curriculumId\": \"String!\",
  \"academicYearId\": \"String!\",
  \"courseId\": \"String!\",
  \"rotationDayId/weekDay\": \"String!\",
  \"periodId\": \"String\",
  \"startTime\": \"String\",
  \"endTime\": \"String\",
  \"timetableSlotData\": {
    \"subject\": \"String\",
    \"location\": \"String\",
    \"staffIDs\": [\"String\"]
  },
  \"applicableFrom\": \"String\",
  \"applicableTill\": \"String\",
  \"isEnabled\": \"boolean\"
}"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "isSuccess": true
    }
}
```
Status: (not specified)
```json
{
    "response": {
        "isSuccess": true
    }
}
```

## Attendance
### Get Attendance Codes
Method: `GET`
Path: `/public/v2/attendance-codes`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-codes`

Description:
This endpoint makes an HTTP GET request to retrieve attendance codes from the specified domain. The request includes query parameters for curriculumIds, academicYearIds, count, and cursor. These parameters allow for filtering and pagination of the results.

The response will include the attendance codes based on the provided query parameters, with details such as code name, code, and any additional information associated with each code.

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| curriculumIds | [] String | Comma seperated unique Identifiers for curriculums | yes |
| academicYearIds | [] String (Required) | Comma seperated unique Identifiers for academic years | yes |
| count | Integer | Number of periods to return | yes |
| cursor | String | Previous response endCursor to get next page | yes |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-codes" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 200 OK
```json
{
 "response": {
   "totalCount": 73,
   "edges": [
     {
       "id": 34859843,
       "label": "Present",
       "value": 1.0,
        "sendSMS": false,
        "sendEmail": true,
        "isDefault": true,
       "abbreviation": "P",
       "color": "#00ff00",
       "curriculumId": "2768",
       "academicYearId": "3913"
     },
     {
       "id": 34855534,
       "label": "Absent",
       "value": 0.0,
        "sendSMS": false,
        "sendEmail": true,
        "isDefault": true,
       "abbreviation": "A",
       "color": "#00ff01",
       "curriculumId": "2768",
       "academicYearId": "3913"
     }
   ],
   "pageInfo": {
     "hasNextPage": false,
     "hasPreviousPage": true,
     "startCursor": "eyJjdXJzb3IiiJrdW1hciI",
     "endCursor": null
   }
 }
}
```

### Get Attendance Codes by Id
Method: `GET`
Path: `/public/v2/attendance-codes/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-codes/:id`

Description:
This endpoint makes an HHTP GET request to fetch the exsting attendance code given by it's unique ID.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <id> | Unique Identifier of the attendance code (Required) |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-codes/:id" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "attendanceCodes": {
            "id": "137662837865589275",
            "label": "Weekend",
            "value": "0.50",
            "abbreviation": "WK",
            "sendSMS": false,
            "sendEmail": false,
            "isDefault": false,
            "curriculumId": "14923",
            "academicYearId": "20589"
        }
    }
}
```

### Create Attendance Codes
Method: `POST`
Path: `/public/v2/attendance-codes`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-codes`

Description:
This endpoint makes an HHTP POST request to create a new attendance code.

The request body structure is as follows:

Field
Type
Description
Is Required ?

label
String
Unique label name given to the attendance code.
Yes

abbreviation
String
Short name given to the attendance code.
Yes

value
Number
Value assigned to the code.
Yes

color
String
Color assigned to the code. Default: #6464dc
No

sendSMS
Boolean
Check to send sms to family. Default: false
No

sendEmail
Boolean
Check to send email to family. Default: false
No

curriculumId
String
Unique Identifier of the curriculum to which code belongs to.
yes

academicYearId
String
Unique Identifier of the academicYear to which code belongs to.
yes

Auth: Bearer token (`Authorization: Bearer <token>`)

Request Body (raw):
```json
{
    "label": "String!",
    "abbreviation": "String!",
    "value": "Number",
    "color": "String",
    "sendSMS": "Boolean",
    "sendEmail": "Boolean",
    "curriculumId": "String!",
    "academicYearId": "String!"
}
```

Example Request (cURL):
```bash
curl -X POST "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-codes" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  --data-raw "{
    \"label\": \"String!\",
    \"abbreviation\": \"String!\",
    \"value\": \"Number\",
    \"color\": \"String\",
    \"sendSMS\": \"Boolean\",
    \"sendEmail\": \"Boolean\",
    \"curriculumId\": \"String!\",
    \"academicYearId\": \"String!\"
}"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "attendanceCodes": {
            "id": "137662837865589275",
            "label": "Weekend",
            "value": "0.50",
            "abbreviation": "WK",
            "sendSMS": false,
            "sendEmail": false,
            "isDefault": false,
            "curriculumId": "14923",
            "academicYearId": "20589"
        }
    }
}
```

### Update Attendance Codes
Method: `PUT`
Path: `/public/v2/attendance-codes/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-codes/:id`

Description:
This endpoint makes an HHTP PUT request to update an existing attendance code given by its unique ID.

The request body structure is as follows:

Field
Type
Description
Is Required ?

label
String
Unique label name given to the attendance code.
Yes

abbreviation
String
Short name given to the attendance code.
Yes

value
Number
Value assigned to the code.
Yes

color
String
Color assigned to the code. Default: #6464dc
No

sendSMS
Boolean
Check to send sms to family. Default: false
No

sendEmail
Boolean
Check to send email to family. Default: false
No

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <id> | Unique Identifier of the attendance code (Required) |

Request Body (raw):
```json
{
    "label": "String!",
    "abbreviation": "String!",
    "value": "Number",
    "color": "String",
    "sendSMS": "Boolean",
    "sendEmail": "Boolean"
}
```

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-codes/:id" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  --data-raw "{
    \"label\": \"String!\",
    \"abbreviation\": \"String!\",
    \"value\": \"Number\",
    \"color\": \"String\",
    \"sendSMS\": \"Boolean\",
    \"sendEmail\": \"Boolean\"
}"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "attendanceCodes": {
            "id": "137662837865589275",
            "label": "weekend",
            "value": "0.50",
            "abbreviation": "WK",
            "sendSMS": false,
            "sendEmail": false,
            "isDefault": false
        }
    }
}
```

### Delete Attendance Codes
Method: `DELETE`
Path: `/public/v2/attendance-codes/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-codes/:id`

Description:
This endpoint makes an HHTP Delete request to delete the exsting attendance code given by it's unique ID.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <id> | Unique Identifier of the attendance code (Required) |

Example Request (cURL):
```bash
curl -X DELETE "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-codes/:id" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "isSuccess": true
    }
}
```

### Get Attendance
Method: `GET`
Path: `/public/v2/attendance`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance`

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| count | Integer | Numnber of records to return | yes |
| cursor | String | Previous response endCursor to get next page | yes |
| startDate | String  | String containing startDate in the format "YYYY-MM-DD". | yes |
| endDate | String  | String containing endDate in the format "YYYY-MM-DD". | yes |
| masterAttendance | Boolean | Indicates if it is homeroom attendance | yes |
| courseIds | [] String | Array of course IDs (string). If provided, it returns attendance for those courses. | yes |
| studentIds | [] String | Array of student IDs (string). If provided, it returns attendance for those students. | yes |
| modifiedSince | String | String containing modifiedSince in the format "YYYY-MM-DD". | yes |
| modifiedTill | String | String containing modifiedTill in the format "YYYY-MM-DD". | yes |
| attendanceCodeIds | [] String | Array of Attendnace code Id ( String) | yes |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 200 OK
```json
{
 "response": {
   "totalCount": 76,
   "edges": [
     {
       "id": 32754463,
       "studentId": 37834458,
       "courseId": 41552533,
       "periodId": 24578133,
       "date": "2024-01-21",
       "lastModifiedTimeStamp": "2024-09-16T01:29:58.365Z",
       "isDeleted": false,
       "notes": "message here",
       "startTime": "8:00:00",
       "endTime": "8:15:00",
       "attendanceOption": {
         "id": 98453493,
         "label": "Present",
         "abbreviation": "P"
       },
     {
       "id": 32754463,
       "studentId": 37834458,
       "courseId": 34458456,
       "periodId": null,
       "date": "2024-01-21",
       "lastModifiedTimeStamp": "2024-09-16T01:29:58.365Z",
       "isDeleted": false,
       "notes": "message here",
       "startTime": "null",
       "endTime": "null",
       "attendanceOption": {
         "id": 98453493,
         "label": "Present",
         "abbreviation": "P"
       },
     {
       "id": 32754463,
       "studentId": 37834458,
       "courseId": null,
       "periodId": null,
       "date": "2024-01-21",
       "lastModifiedTimeStamp": "2024-09-16T01:29:58.365Z",
       "isDeleted": false,
       "lastModifiedTimeStamp": "2024-09-16T01:29:58.365Z",
       "isDeleted": false,
       "notes": "message here",
       "startTime": "null",
       "endTime": "null",
       "attendanceOption": {
         "id": 98453493,
         "label": "Present",
         "abbreviation": "P"
       }
     },
     {
       "id": 32347463,
       "studentId": 63734473,
       "courseId": 89437454,
       "periodId": 3454513,
       "date": "2024-02-21",
       "lastModifiedTimeStamp": "2024-09-16T01:29:58.365Z",
       "isDeleted": false,
       "notes": "message here",
       "startTime": "9:00:00",
       "endTime": "9:15:00",
       "attendanceOption": {
         "id": 25612766,
         "label": "Absent",
         "abbreviation": "A"
       }
     }
   ],
   "pageInfo": {
     "hasNextPage": true,
     "hasPreviousPage": false,
     "startCursor": null,
     "endCursor": "eyJjdXJzb3IiOiJrdW1hciI"
   }
 }
}
```

### Post Attendance
Method: `POST`
Path: `/public/v2/attendance`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance`

Description:
Description

API for marking attendance record for a student.**

Request Body**

Field
Type
Description
Is Required?

curriculumId
string
Unique identifier of the curriculum program.
Conditional*

academicYearId
string
Unique identifier of the academic year, default value is current academic year.
No

attendanceData
Object
Attendance record
Yes

Attendance Data Object

Field
Type
Description
Is Required?

date
string
Date on which attendance is marked
Yes

studentId
string
Student for whom attendance is being marked
Conditional*

studentUID
string
Student UID for whom attendance is being marked
Conditional*

courseId
string
Course on which attendance is being marked
No

periodId
string
Period on which attendance is being marked
No

startTime
string
Start time of attendance record
No

endTime
string
End time of attendance record
No

optionId
string
Attendance option of the record
Conditional*

optionCode
string
Attendance status for the record, indicating whether the student is present or absent. Acceptable values are PRESENT or ABSENT.
Conditional*

isMasterAttendance
boolean
Is the attendance being taken for daily marking
No

remark
string
Remark for attendance record
No

Note: If periodId is not provided, startTime and endTime will be used to validate the corresponding timetable slots. When periodId is provided, startTime and endTime will not be considered.

Conditional* fields requirements:

curriculumId: Required when recording attendance for a specific class or period. Can be omitted for daily attendance.

studentId: Unique identifier for the student. Either studentId or studentUID must be provided, required if studentUID is not included.

studentUID: Alternate unique identifier for the student. Either studentUID or studentId must be provided, required if studentId is not included.

optionId: Either optionId or optionCode must be provided, required if optionCode is not included.

optionCode: Alternative representation for attendance status. Either optionCode or optionId must be provided, required if optionId is not included.

Auth: Bearer token (`Authorization: Bearer <token>`)

Request Body (raw):
```json
{
 "curriculumId": "String!",
 "academicYearId": "String!",
 "attendanceData": {
     "date": "String!",
     "studentId": "ID!",
     "courseId": "ID",
     "periodId": "ID",
     "startTime": "String",
     "endTime": "String",
     "optionId": "ID!",
     "isMasterAttendance": "boolean",
     "remark": "String"
   }
}
```

Example Request (cURL):
```bash
curl -X POST "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  --data-raw "{
 \"curriculumId\": \"String!\",
 \"academicYearId\": \"String!\",
 \"attendanceData\": {
     \"date\": \"String!\",
     \"studentId\": \"ID!\",
     \"courseId\": \"ID\",
     \"periodId\": \"ID\",
     \"startTime\": \"String\",
     \"endTime\": \"String\",
     \"optionId\": \"ID!\",
     \"isMasterAttendance\": \"boolean\",
     \"remark\": \"String\"
   }
}
"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "id": 327463,
        "studentId": 3783458,
        "courseId": 4152533,
        "date": "2024-12-21",
        "attendanceOption": {
            "id": 98493,
            "label": "Present",
            "abbreviation": "P"
        }
    }
}
```

## Attendance V4
Use this folder if you are using new attendance module in toddle.

### Get Attendance Categories
Method: `GET`
Path: `/public/v2/attendance-categories`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-categories`

Description:
This endpoint makes an HTTP GET request to retrieve attendance categories from the specified domain. The request includes query parameters for academicYearIds, count, and cursor. These parameters allow for filtering and pagination of the results.

The response will include the attendance categories based on the provided query parameters, with details such as category name, abbreviation, and any additional information associated with each category.

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| academicYearIds | [] String (Required) | Comma seperated unique Identifiers for academic years | yes |
| count | Integer | Number of periods to return | yes |
| cursor | String | Previous response endCursor to get next page | yes |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-categories" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 200 OK
```json
{
  "response": {
    "totalCount": 10,
    "edges": [
      {
        "id": 34859843,
        "label": "Present",
        "description": "Present category",
        "isDefault": true,
        "academicYearId": "3913"
      },
      {
        "id": 34859843,
        "label": "Excused",
        "description": "Excused category",
        "isDefault": false,
        "academicYearId": "3913"
      }
    ],
    "pageInfo": {
      "hasNextPage": false,
      "hasPreviousPage": true,
      "startCursor": "eyJjdXJzb3IiiJrdW1hciI",
      "endCursor": null
    }
  }
}
```

### Get Attendance Categories by Id
Method: `GET`
Path: `/public/v2/attendance-categories/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-categories/:id`

Description:
This endpoint makes an HTTP GET request to fetch the exsting attendance category given by it's unique ID.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <id> | Unique Identifier of the attendance category (Required) |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-categories/:id" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
  "response": {
    "attendanceCategory": {
      "id": 34859843,
      "label": "Excused",
      "description": "Excused category",
      "isDefault": false,
      "academicYearId": "3913"
    }
  }
}
```

### Create Attendance Categories
Method: `POST`
Path: `/public/v2/attendance-categories`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-categories`

Description:
This endpoint makes an HTTP POST request to create a new attendance category.

The request body structure is as follows:

Field
Type
Description
Is Required ?

label
String
Unique label name given to the attendance category.
Yes

description
String
Long description of what this category mean
Yes

academicYearId
String
Unique Identifier of the academicYear to which category belongs to.
Yes

Auth: Bearer token (`Authorization: Bearer <token>`)

Request Body (raw):
```json
{
    "label": "String!",
    "description": "String!",
    "academicYearId": "String!"
}
```

Example Request (cURL):
```bash
curl -X POST "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-categories" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  --data-raw "{
    \"label\": \"String!\",
    \"description\": \"String!\",
    \"academicYearId\": \"String!\"
}"
```

Response Examples:
Status: (not specified)
```json
{
  "response": {
    "attendanceCategory": {
        "id": 34859843,
        "label": "Present",	
        "description": "Student is in class",
        "isDefault": false
    }
  }
}
```

### Update Attendance Categories
Method: `PUT`
Path: `/public/v2/attendance-categories/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-categories/:id`

Description:
This endpoint makes an HHTP PUT request to update an existing attendance category given by its unique ID.

The request body structure is as follows:

Field
Type
Description
Is Required ?

label
String
Unique label name given to the attendance category.
Yes

description
String
Long description of what this category mean
Yes

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <id> | Unique Identifier of the attendance category (Required) |

Request Body (raw):
```json
{
    "label": "String!",
    "description": "String!"
}
```

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-categories/:id" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  --data-raw "{
    \"label\": \"String!\",
    \"description\": \"String!\"
}"
```

Response Examples:
Status: (not specified)
```json
{
  "response": {
    "attendanceCategory": {
        "id": 34859843,
        "label": "Excused",	
        "description": "Excused category",
        "isDefault": false
    }
  }
}
```

### Delete Attendance Categories
Method: `DELETE`
Path: `/public/v2/attendance-categories/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-categories/:id`

Description:
This endpoint makes an HTTP Delete request to delete the exsting attendance category given by it's unique ID. An attendance category can only be deleted if none of its attendance codes have been used to mark attendance.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <id> | Unique Identifier of the attendance category (Required) |

Example Request (cURL):
```bash
curl -X DELETE "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-categories/:id" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "isSuccess": true
    }
}
```

### Get Attendance Codes
Method: `GET`
Path: `/public/v2/attendance-codes-v2`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-codes-v2`

Description:
This endpoint makes an HTTP GET request to retrieve attendance codes from the specified domain. The request includes query parameters for curriculumIds, academicYearIds, count, and cursor. These parameters allow for filtering and pagination of the results.

The response will include the attendance codes based on the provided query parameters, with details such as code name, code, and any additional information associated with each code.

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| curriculumIds | [] String | Comma seperated unique Identifiers for curriculums | yes |
| academicYearIds | [] String (Required) | Comma seperated unique Identifiers for academic years | yes |
| count | Integer | Number of periods to return | yes |
| cursor | String | Previous response endCursor to get next page | yes |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-codes-v2" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 200 OK
```json
{
  "response": {
    "totalCount": 7,
    "edges": [
      {
        "id": 34859843,
        "label": "Present",
        "isDefault": true,
        "abbreviation": "P",
        "presentInCampus": true,
        "attendanceCategoryId": "2348",
        "curriculumProgramSettings": [
          {
            "curriculumId": "2769",
            "value": 1,
            "sendSMS": false,
            "sendEmail": true,
            "status": "ENABLED"
          },
          {
            "curriculumId": "2768",
            "value": 1,
            "sendSMS": false,
            "sendEmail": true,
            "status": "DISABLED"
          }
        ],
        "academicYearId": "3913"
      },
      {
        "id": 34855534,
        "label": "Absent",
        "value": 0,
        "isDefault": true,
        "abbreviation": "A",
        "presentInCampus": false,
        "attendanceCategoryId": "2348",
        "curriculumProgramSettings": [
          {
            "curriculumId": "2769",
            "value": 1,
            "sendSMS": false,
            "sendEmail": true,
            "status": "ENABLED"
          },
          {
            "curriculumId": "2768",
            "value": 1,
            "sendSMS": false,
            "sendEmail": true,
            "status": "DISABLED"
          }
        ],
        "academicYearId": "3913"
      }
    ],
    "pageInfo": {
      "hasNextPage": true,
      "hasPreviousPage": false,
      "startCursor": "eyJjdXJzb3IiiJrdW1hciI",
      "endCursor": "eyJjdXJzb3IiiJrdW2abdce"
    }
  }
}
```

### Get Attendance Codes by Id
Method: `GET`
Path: `/public/v2/attendance-codes-v2/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-codes-v2/:id`

Description:
This endpoint makes an HTTP GET request to fetch the exsting attendance code given by it's unique ID.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <id> | Unique Identifier of the attendance code (Required) |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-codes-v2/:id" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
  "response": {
    "attendanceCode": {
      "id": 34859843,
      "label": "Present",
      "isDefault": true,
      "abbreviation": "P",
      "presentInCampus": true,
      "attendanceCategoryId": "2348",
      "curriculumProgramSettings": [
        {
          "curriculumId": "2769",
          "value": 1,
          "sendSMS": false,
          "sendEmail": true,
          "status": "ENABLED"
        },
        {
          "curriculumId": "2768",
          "value": 1,
          "sendSMS": false,
          "sendEmail": true,
          "status": "DISABLED"
        }
      ],
      "academicYearId": "3913"
    }
  }
}
```

### Create Attendance Codes
Method: `POST`
Path: `/public/v2/attendance-codes-v2`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-codes-v2`

Description:
This endpoint makes an HTTP POST request to create a new attendance code.

The request body structure is as follows:

Field
Type
Description
Is Required ?

label
String
Unique label name given to the attendance code.
Yes

abbreviation
String
Short name given to the attendance code.
Yes

presentInCampus
Boolean
Boolean value indicating that student is present in campus or not.
No

attendanceCategoryId
String
Unique Identifier of attendance category to which code belongs.
Yes

academicYearId
String
Unique Identifier of the academicYear to which code belongs to.
Yes

curriculumProgramSettings
Object
Code settings at curriculum program. If not passed default settings will be applied.
No

Structure of curriculumProgramSettings

Field
Type
Description
Is Required ?

curriculumProgramId
String
Unique Identifier of curriculum program to which this settings belong
Yes

sendEmail
Boolean
Check to send sms to family. Default: false
No

sendSMS
Boolean
Check to send email to family. Default: false
No

status
String
To indicate enable or disable for given curriculum. Should consist of either of this values: ENABLED, DISABLED
Yes

value
Number
Value assigned to the code.
Yes

Auth: Bearer token (`Authorization: Bearer <token>`)

Request Body (raw):
```json
{
    "label": "String!",
    "abbreviation": "String!",
    "presentInCampus": "Boolean",
    "attendanceCategoryId": "String!",
    "curriculumProgramSettings": [
        {
            "curriculumProgramId": "String!",
            "sendEmail": "Boolean",
            "sendSMS": "Boolean",
            "status": "String!",
            "value": "Number!"
        }
    ],
    "academicYearId": "String!"
}
```

Example Request (cURL):
```bash
curl -X POST "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-codes-v2" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  --data-raw "{
    \"label\": \"String!\",
    \"abbreviation\": \"String!\",
    \"presentInCampus\": \"Boolean\",
    \"attendanceCategoryId\": \"String!\",
    \"curriculumProgramSettings\": [
        {
            \"curriculumProgramId\": \"String!\",
            \"sendEmail\": \"Boolean\",
            \"sendSMS\": \"Boolean\",
            \"status\": \"String!\",
            \"value\": \"Number!\"
        }
    ],
    \"academicYearId\": \"String!\"
}"
```

Response Examples:
Status: (not specified)
```json
{
  "response": {
    "attendanceCode": {
      "id": "137662837865589275",
      "label": "Weekend",
      "abbreviation": "WK",
      "isDefault": false,
      "attendanceCategoryId": "34443",
      "curriculumProgramSettings": [
        {
          "curriculumProgramId": "2345",
          "sendEmail": true,
          "sendSMS": false,
          "status": "ENABLED",
          "value": 1
        },
        {
          "curriculumProgramId": "2211",
          "sendEmail": true,
          "sendSMS": false,
          "status": "DISABLED",
          "value": 0.3
        }
      ],
      "academicYearId": "20589"
    }
  }
}
```

### Update Attendance Codes
Method: `PUT`
Path: `/public/v2/attendance-codes-v2/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-codes-v2/:id`

Description:
This endpoint makes an HHTP PUT request to update an existing attendance code given by its unique ID.

The request body structure is as follows:

Field
Type
Description
Is Required ?

label
String
Unique label name given to the attendance code.
Yes

abbreviation
String
Short name given to the attendance code.
Yes

presentInCampus
Boolean
Boolean value indicating that student is present in campus or not.
No

attendanceCategoryId
String
Unique Identifier of attendance category to which code belongs.
No

academicYearId
String
Unique Identifier of the academicYear to which code belongs to.
Yes

updatedCurriculumProgramSettings
Object
Code settings at curriculum program. If not passed default settings will be applied.
No

Structure of updatedCurriculumProgramSettings

Field
Type
Description
Is Required ?

curriculumProgramId
String
Unique Identifier of curriculum program to which this settings belong
Yes

sendEmail
Boolean
Check to send sms to family. Default: false
No

sendSMS
Boolean
Check to send email to family. Default: false
No

status
String
To indicate enable or disable for given curriculum. Should consist of either of this values: ENABLED, DISABLED
Yes

value
Number
Value assigned to the code.
Yes

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <id> | Unique Identifier of the attendance code (Required) |

Request Body (raw):
```json
{
    "label": "String!",
    "abbreviation": "String!",
    "presentInCampus": "Boolean",
    "attendanceCategoryId": "String",
    "academicYearId": "String!",
    "updatedCurriculumProgramSettings": [
        {
            "curriculumProgramId": "String!",
            "sendEmail": "Boolean",
            "sendSMS": "Boolean",
            "status": "String!",
            "value": "Number!"
        }
    ]
}
```

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-codes-v2/:id" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  --data-raw "{
    \"label\": \"String!\",
    \"abbreviation\": \"String!\",
    \"presentInCampus\": \"Boolean\",
    \"attendanceCategoryId\": \"String\",
    \"academicYearId\": \"String!\",
    \"updatedCurriculumProgramSettings\": [
        {
            \"curriculumProgramId\": \"String!\",
            \"sendEmail\": \"Boolean\",
            \"sendSMS\": \"Boolean\",
            \"status\": \"String!\",
            \"value\": \"Number!\"
        }
    ]
}"
```

Response Examples:
Status: (not specified)
```json
{
  "response": {
    "attendanceCode": {
      "label": "Present",
      "abbreviation": "P",
      "color": "#00FF00",
      "presentInCampus": true,
      "attendanceCategoryId": "232332",
      "curriculumProgramSettings": [
        {
          "curriculumProgramId": "12345",
          "sendEmail": true,
          "sendSMS": false,
          "status": "ENABLE",
          "value": 1
        },
        {
          "curriculumProgramId": "67890",
          "sendEmail": false,
          "sendSMS": true,
          "status": "DISABLE",
          "value": 2
        }
      ]
    }
  }
}
```

### Delete Attendance Codes
Method: `DELETE`
Path: `/public/v2/attendance-codes-v2/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-codes-v2/:id`

Description:
This endpoint makes an HHTP Delete request to delete the exsting attendance code given by it's unique ID. An attendance code can only be deleted if its not used to mark attendance.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | <id> | Unique Identifier of the attendance code (Required) |

Example Request (cURL):
```bash
curl -X DELETE "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance-codes-v2/:id" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "isSuccess": true
    }
}
```

### Get Attendance
Method: `GET`
Path: `/public/v2/attendance`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance`

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| count | Integer | Numnber of records to return | yes |
| cursor | String | Previous response endCursor to get next page | yes |
| startDate | String  | String containing startDate in the format "YYYY-MM-DD". | yes |
| endDate | String  | String containing endDate in the format "YYYY-MM-DD". | yes |
| masterAttendance | Boolean | Indicates if it is homeroom attendance | yes |
| courseIds | [] String | Array of course IDs (string). If provided, it returns attendance for those courses. | yes |
| studentIds | [] String | Array of student IDs (string). If provided, it returns attendance for those students. | yes |
| modifiedSince | String | String containing modifiedSince in the format "YYYY-MM-DD". | yes |
| modifiedTill | String | String containing modifiedTill in the format "YYYY-MM-DD". | yes |
| attendanceCodeIds | [] String | Array of Attendnace code Id ( String) | yes |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 200 OK
```json
{
  "response": {
    "totalCount": 76,
    "edges": [
      {
        "id": 32754463,
        "studentId": 37834458,
        "courseId": 41552533,
        "periodId": 24578133,
        "date": "2024-01-21",
        "lastModifiedTimeStamp": "2024-09-16T01:29:58.365Z",
        "isDeleted": false,
        "notes": "message here",
        "startTime": "8:00:00",
        "endTime": "8:15:00",
        "attendanceOption": {
          "id": 98453493,
          "label": "Present",
          "abbreviation": "P"
        },
        "attendanceCategory": {
          "id": 34859843,
          "label": "Excused"
        }
      },
      {
        "id": 32754463,
        "studentId": 37834458,
        "courseId": 34458456,
        "periodId": null,
        "date": "2024-01-21",
        "lastModifiedTimeStamp": "2024-09-16T01:29:58.365Z",
        "isDeleted": false,
        "notes": "message here",
        "startTime": "null",
        "endTime": "null",
        "attendanceOption": {
          "id": 98453493,
          "label": "Present",
          "abbreviation": "P"
        },
        "attendanceCategory": {
          "id": 34859843,
          "label": "Excused"
        }
      },
      {
        "id": 32754463,
        "studentId": 37834458,
        "courseId": null,
        "periodId": null,
        "date": "2024-01-21",
        "lastModifiedTimeStamp": "2024-09-16T01:29:58.365Z",
        "isDeleted": false,
        "notes": "message here",
        "startTime": "null",
        "endTime": "null",
        "attendanceOption": {
          "id": 98453493,
          "label": "Present",
          "abbreviation": "P"
        },
        "attendanceCategory": {
          "id": 34859843,
          "label": "Excused"
        }
      },
      {
        "id": 32347463,
        "studentId": 63734473,
        "courseId": 89437454,
        "periodId": 3454513,
        "date": "2024-02-21",
        "lastModifiedTimeStamp": "2024-09-16T01:29:58.365Z",
        "isDeleted": false,
        "notes": "message here",
        "startTime": "9:00:00",
        "endTime": "9:15:00",
        "attendanceOption": {
          "id": 25612766,
          "label": "Absent",
          "abbreviation": "A"
        },
        "attendanceCategory": {
          "id": 34859843,
          "label": "Excused"
        }
      }
    ],
    "pageInfo": {
      "hasNextPage": true,
      "hasPreviousPage": false,
      "startCursor": null,
      "endCursor": "eyJjdXJzb3IiOiJrdW1hciI"
    }
  }
}
```

### Post Attendance
Method: `POST`
Path: `/public/v2/attendance`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance`

Description:
Description

API for marking attendance record for a student.**

Request Body**

Field
Type
Description
Is Required?

curriculumId
string
Unique identifier of the curriculum program.
Conditional*

academicYearId
string
Unique identifier of the academic year, default value is current academic year.
No

attendanceData
Object
Attendance record
Yes

Attendance Data Object

Field
Type
Description
Is Required?

date
string
Date on which attendance is marked
Yes

studentId
string
Student for whom attendance is being marked
Conditional*

studentUID
string
Student UID for whom attendance is being marked
Conditional*

courseId
string
Course on which attendance is being marked
No

periodId
string
Period on which attendance is being marked
No

startTime
string
Start time of attendance record
No

endTime
string
End time of attendance record
No

optionId
string
Attendance option of the record
Conditional*

optionCode
string
Attendance status for the record, indicating whether the student is present or absent. Acceptable values are PRESENT or ABSENT.
Conditional*

isMasterAttendance
boolean
Is the attendance being taken for daily marking
No

remark
string
Remark for attendance record
No

Note: If periodId is not provided, startTime and endTime will be used to validate the corresponding timetable slots. When periodId is provided, startTime and endTime will not be considered.

Conditional* fields requirements:

curriculumId: Required when recording attendance for a specific class or period. Can be omitted for daily attendance.

studentId: Unique identifier for the student. Either studentId or studentUID must be provided, required if studentUID is not included.

studentUID: Alternate unique identifier for the student. Either studentUID or studentId must be provided, required if studentId is not included.

optionId: Either optionId or optionCode must be provided, required if optionCode is not included.

optionCode: Alternative representation for attendance status. Either optionCode or optionId must be provided, required if optionId is not included.

Auth: Bearer token (`Authorization: Bearer <token>`)

Request Body (raw):
```json
{
 "curriculumId": "String!",
 "academicYearId": "String!",
 "attendanceData": {
     "date": "String!",
     "studentId": "ID!",
     "courseId": "ID",
     "periodId": "ID",
     "startTime": "String",
     "endTime": "String",
     "optionId": "ID!",
     "isMasterAttendance": "boolean",
     "remark": "String"
   }
}
```

Example Request (cURL):
```bash
curl -X POST "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/attendance" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  --data-raw "{
 \"curriculumId\": \"String!\",
 \"academicYearId\": \"String!\",
 \"attendanceData\": {
     \"date\": \"String!\",
     \"studentId\": \"ID!\",
     \"courseId\": \"ID\",
     \"periodId\": \"ID\",
     \"startTime\": \"String\",
     \"endTime\": \"String\",
     \"optionId\": \"ID!\",
     \"isMasterAttendance\": \"boolean\",
     \"remark\": \"String\"
   }
}
"
```

Response Examples:
Status: (not specified)
```json
{
    "response": {
        "id": 327463,
        "studentId": 3783458,
        "courseId": 4152533,
        "date": "2024-12-21",
        "attendanceOption": {
            "id": 98493,
            "label": "Present",
            "abbreviation": "P"
        }
    }
}
```

### Get Excusals
Method: `GET`
Path: `/public/v2/excusals`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/excusals`

Description:
This endpoint makes an HTTP GET request to retrieve attendance excusals from the specified domain. The request includes query parameters for curriculumIds, academicYearIds, courseIds, studentIds, startDate, endDate, status, type, attendanceOptionIds, count, and cursor. These parameters allow for filtering and pagination of the results.

The response will include the attendance excusals based on the provided query parameters, with details such as excusal id, studentId, durationType, startDate, endDate, reason, periodIds, attendanceOptionId and status.

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| curriculumIds | ["872348723"] | Comma-separated unique identifiers for curriculums | yes |
| academicYearIds | [] String (Required) | Comma-separated unique identifiers for academic years | yes |
| courseIds | [] String | Comma-separated unique identifiers for courses. If provided, only excusals of those courses's students will be returned | yes |
| studentIds | [] String | Comma-separated unique identifiers for students. If provided, only excusals of those students will be returned | yes |
| startDate | String | String containing startDate in the format "YYYY-MM-DD" | yes |
| endDate | String | String containing endDate in the format "YYYY-MM-DD" | yes |
| status | String | ["ALL", "PENDING", "MARKED"] | yes |
| attendanceOptionIds | [] String | Comma-separated unique identifiers for attendance codes. If provided, only excusals marked with those attendance codes will be returned | yes |
| count | Integer | Number of periods to return | yes |
| cursor | String | Previous response endCursor to get next page | yes |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/excusals" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 200 OK
```json
{
  "response": {
    "totalCount": 7,
    "edges": [
      {
        "id": 34859843,
        "label": "Present",
        "isDefault": true,
        "abbreviation": "P",
        "presentInCampus": true,
        "attendanceCategoryId": "2348",
        "curriculumProgramSettings": [
          {
            "curriculumId": "2769",
            "value": 1,
            "sendSMS": false,
            "sendEmail": true,
            "status": "ENABLED"
          },
          {
            "curriculumId": "2768",
            "value": 1,
            "sendSMS": false,
            "sendEmail": true,
            "status": "DISABLED"
          }
        ],
        "academicYearId": "3913"
      },
      {
        "id": 34855534,
        "label": "Absent",
        "value": 0,
        "isDefault": true,
        "abbreviation": "A",
        "presentInCampus": false,
        "attendanceCategoryId": "2348",
        "curriculumProgramSettings": [
          {
            "curriculumId": "2769",
            "value": 1,
            "sendSMS": false,
            "sendEmail": true,
            "status": "ENABLED"
          },
          {
            "curriculumId": "2768",
            "value": 1,
            "sendSMS": false,
            "sendEmail": true,
            "status": "DISABLED"
          }
        ],
        "academicYearId": "3913"
      }
    ],
    "pageInfo": {
      "hasNextPage": true,
      "hasPreviousPage": false,
      "startCursor": "eyJjdXJzb3IiiJrdW1hciI",
      "endCursor": "eyJjdXJzb3IiiJrdW2abdce"
    }
  }
}
```

## Gradebook V1
### Progress Summary
Method: `POST`
Path: `/public/open-api/v1/students/progress-summary`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/open-api/v1/students/progress-summary`

Description:
Field Name
Data Type
Description
Required

cursor
String
pass the endCursor value received in the previous response to get the next set of entries beyond that cursor
No

fromDate
String
return entries published after the date specified
format: “yyyy-mm-dd”
No

toDate
String
return entries published before the date specified
format: “yyyy-mm-dd”
No

academicYearId
String
return entries published in the specified
academicYear
No

count
String
number of rows to return. Maximum value set to 4000 (this can change in future)
default: 4000
No

filters
Object
In order to selectively access data from specific sources, we support some filters. These help in filtering data for certain specific use cases.
No

Filters:

Field Name
Data Type
Description
Required

sourceTitle
String
filter by title, the student ratings pertaining to certain specific sources where ratings are picked from
applicable sources where this source title filter works:
Student Progress, Reports, Assessments, Projects
No

Note: All of these parameters should be added to the request body.

Limitations
Reports

UBD Overall score might not be visible based on the configuration of the template.

Cumulative Term ratings will not be visible in the API output.

Ratings from unlocked reports will not be present as part of the open API output.

Assessment Learning Goals

PYP Learning goal ratings like Subject Standards, ATLs, etc are not covered.

If an assessment is not linked with a term, its ratings will not be present as part of the output.

Only the ratings from assessments which are marked as completed will be part of the output.

Project Ratings

While ratings from Personal and Community Projects are covered as part of the output, ratings from Service as Actions are not part of the API output.

Ratings from Community Projects that are configured as "Individually assessed" are not yet supported as part of the API Output.

Worksheets

Ratings of worksheet assessments are not the part of API output.

Auth: Bearer token (`Authorization: Bearer <token>`)

Request Body (raw):
```json
{
    "count" : "1000",
    "fromDate" : "2025-08-01",
    "toDate" : "2025-09-01",
    "cursor" : "_cursor_",
    "filters" : {
        "sourceTitle" : "title filter text"
    }
}
```

Example Request (cURL):
```bash
curl -X POST "https://ap-southeast-1-production-apis.toddleapp.com/public/open-api/v1/students/progress-summary" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  --data-raw "{
    \"count\" : \"1000\",
    \"fromDate\" : \"2025-08-01\",
    \"toDate\" : \"2025-09-01\",
    \"cursor\" : \"_cursor_\",
    \"filters\" : {
        \"sourceTitle\" : \"title filter text\"
    }
}"
```

Response Examples:
Status: 200
```json
{
  "response": {
    "data": [
      {
        "org_id": "4829",
        "org_name": "Greenfield Academy",
        "curr_prog_id": "5911",
        "curr_prog_title": "Future Leaders Programme",
        "acad_year_id": "9735",
        "acad_year_title": "2023-2024",
        "term_id": "238",
        "term_title": "Semester 1",
        "grade_id": "47890",
        "grade_name": "Grade VII",
        "subject_id": "139284",
        "subject_name": "Design Thinking",
        "subject_title": "Design Thinking",
        "class_id": "137842",
        "class_sourced_id": "ID-137842",
        "class_title": "Design Thinking – G7 – Mira",
        "student_id": "605832",
        "student_fname": "Arnav",
        "student_lname": "Kapoor",
        "is_imported": false,
        "published_at": "2023-08-14 10:45:32.123456",
        "updated_at": "2023-08-14 10:44:11.987654",
        "id": "19837462",
        "source_id": "24501877",
        "source_type": "CLASS_ASSIGNMENT",
        "assmt_title": "Creative Impact – 14th Aug",
        "assmt_score_category_id": null,
        "assmt_score_category": null,
        "assmt_max_score": null,
        "assmt_type": "le",
        "assmt_tool_id": "6723",
        "assmt_tool_type": "CUSTOM",
        "assmt_tool_title": "Reflection",
        "evaluated_element_id": "8574920",
        "evaluated_element_type": "MYP_LEARNING_STANDARD",
        "evaluated_element_hierarchy_level": "Strands",
        "evaluated_element_title": "Creative Impact",
        "value_id": "41298",
        "value": "Demonstrating"
      }
    ],
    "pageInfo": {
      "hasNextPage": true,
      "hasPreviousPage": false,
      "startCursor": "eyJwdWJsaXNoZWRfYXQiOiIyMDIzLTA4LTE0IDEwOjQ1OjMyLjEyMzQ1NiIsImlkIjoiMTk4Mzc0NjIifQ==",
      "endCursor": "eyJwdWJsaXNoZWRfYXQiOiIyMDIzLTA4LTE0IDEwOjQ0OjExLjk4NzY1NCIsImlkIjoiMTk4Mzc0NjIifQ=="
    }
  }
}
```

## Gradebook V2
### Progress Summary
Method: `GET`
Path: `/public/v2/progress-summary`
Base URL: `http://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `http://ap-southeast-1-production-apis.toddleapp.com/public/v2/progress-summary?curriculumProgramId=284899890096511865&ratingType=AssignmentRatings`

Description:
Field Name
Data Type
Description
Required
Example

cursor
String
pass the endCursor value received in the previous response to get the next set of entries beyond that cursor
No
eyJzdHVkZW50X2lkIjoiMjc3NjM2ODI4NDg2NDQ0MzE0Iiwic291cmNlX2lkIjoiMzMwMDk4MDM2NDg1MTMwMjkzIn0=

academicYearId
Integer
return entries published in the specified
academicYear
No
284899890096511865

count
Integer
number of rows to return. Maximum value set to 4000 (this can change in future)
default: 4000
No
1000

gradingPeriodId
Integer
Unique Identifier of grading period
No
28489989009658879

studentIds
Array of Integers
Comma separated unique Identifier of students
No
28890096588794899, 28489989658879009

sourceTitle
String
Unique Identifier of source title
No
"the main chapter"

ratingType
String
Unique Identifier of rating type.
Use any of the following: ProgressReportRatings, ObservationRatings, PlannerElementRatings, AssignmentRatings, ProjectReportRatings
Yes
AssignmentRatings

curriculumProgramId
Integer
Unique Identifier of curriculum program
Yes
28489989009690880

Note: All of these parameters should be added to the request body.

Limitations
Reports

UBD Overall score might not be visible based on the configuration of the template.

Cumulative Term ratings will not be visible in the API output.

Ratings from unlocked reports will not be present as part of the open API output.

Assessment Learning Goals

PYP Learning goal ratings like Subject Standards, ATLs, etc are not covered.

If an assessment is not linked with a term, its ratings will not be present as part of the output.

Only the ratings from assessments which are marked as completed will be part of the output.

Project Ratings

While ratings from Personal and Community Projects are covered as part of the output, ratings from Service as Actions are not part of the API output.

Ratings from Community Projects that are configured as "Individually assessed" are not yet supported as part of the API Output.

Worksheets

Ratings of worksheet assessments are not the part of API output.

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| curriculumProgramId | 284899890096511865 | Unique Identifier of curriculumProgram | no |
| ratingType | AssignmentRatings | Use any of the following: ProgressReportRatings, ObservationRatings, PlannerElementRatings, AssignmentRatings, ProjectReportRatings | no |
| sourceTitle | "The Sound" | Unique Identifier of the source title | yes |
| gradingPeriodId | 284899890096511865 | Unique Identifier of the grading period | yes |
| studentIds | ["308079433099517259"] | Unique identifier for the students | yes |
| cursor |  | EndCursor of the previous paginated page. | yes |
| academicYearId | 284899890096511865 | Unique Identifier of the academic year. | yes |

Example Request (cURL):
```bash
curl -X GET "http://ap-southeast-1-production-apis.toddleapp.com/public/v2/progress-summary?curriculumProgramId=284899890096511865&ratingType=AssignmentRatings" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 200 OK
```json
{
    "response": {
        "totalCount": 20,
        "edges": [
            {
                "org_id": "284898051347201887",
                "org_name": "N7 Academy",
                "curr_prog_id": "284899890096511865",
                "curr_prog_title": "N7 Subjects",
                "acad_year_id": "284898051544333908",
                "acad_year_title": "2025-2026",
                "term_id": "289627017530313962",
                "term_name": "Term 1",
                "due_date": "2025-10-08 08:30",
                "grade_id": "284899892134938801",
                "grade_name": "Play Group",
                "subject_id": "284899892323693714",
                "subject_name": "Mathematics",
                "subject_title": "Mathematics",
                "class_id": "302614129628159881",
                "class_sourced_id": "1 no.",
                "class_name": "English 1A",
                "class_title": "English 1A",
                "student_id": "302614477310802906",
                "student_fname": "Andrew",
                "student_lname": "Clark",
                "is_imported": false,
                "published_at": "2025-10-08 10:58:23.250418",
                "updated_at": "2025-10-08 10:58:20.513011",
                "id": "302651443561639795",
                "source_id": "302614815765964822",
                "source_type": "CLASS_ASSIGNMENT",
                "source_title": "Test1 cvmku cvbnm,",
                "assignment_id": "302614815707249479",
                "assmt_score_category_id": null,
                "assmt_score_category": null,
                "assmt_max_score": "100",
                "assmt_tool_type": "SCORE",
                "assmt_tool_id": "302651355728714335",
                "assessment_type": "fmt",
                "assmt_tool_title": "Score",
                "evaluated_element_id": "302614815765964822",
                "evaluated_element_type": "CLASS_ASSIGNMENT",
                "evaluated_element_hierarchy_level": null,
                "evaluated_element_title": "Test1 cvmku cvbnm,",
                "value_id": null,
                "value": "90",
                "primary_subject_teachers": []
            },
            {
                "org_id": "284898051347201887",
                "org_name": "N7 Academy",
                "curr_prog_id": "284899890096511865",
                "curr_prog_title": "N7 Subjects",
                "acad_year_id": "284898051544333908",
                "acad_year_title": "2025-2026",
                "term_id": "289627017530313962",
                "term_name": "Term 1",
                "due_date": "2025-10-08 08:30",
                "grade_id": "284899892134938801",
                "grade_name": "Play Group",
                "subject_id": "284899892306916494",
                "subject_name": "English",
                "subject_title": "English",
                "class_id": "302614129628159881",
                "class_sourced_id": "1 no.",
                "class_name": "English 1A",
                "class_title": "English 1A",
                "student_id": "302614477310802906",
                "student_fname": "Andrew",
                "student_lname": "Clark",
                "is_imported": false,
                "published_at": "2025-10-08 10:58:23.250418",
                "updated_at": "2025-10-08 10:58:20.513011",
                "id": "302651443561639795",
                "source_id": "302614815765964822",
                "source_type": "CLASS_ASSIGNMENT",
                "source_title": "Test1 cvmku cvbnm,",
                "assignment_id": "302614815707249479",
                "assmt_score_category_id": null,
                "assmt_score_category": null,
                "assmt_max_score": "100",
                "assmt_tool_type": "SCORE",
                "assmt_tool_id": "302651355728714335",
                "assessment_type": "fmt",
                "assmt_tool_title": "Score",
                "evaluated_element_id": "302614815765964822",
                "evaluated_element_type": "CLASS_ASSIGNMENT",
                "evaluated_element_hierarchy_level": null,
                "evaluated_element_title": "Test1 cvmku cvbnm,",
                "value_id": null,
                "value": "90",
                "primary_subject_teachers": []
            },
            {
                "org_id": "284898051347201887",
                "org_name": "N7 Academy",
                "curr_prog_id": "284899890096511865",
                "curr_prog_title": "N7 Subjects",
                "acad_year_id": "284898051544333908",
                "acad_year_title": "2025-2026",
                "term_id": "289627017530313962",
                "term_name": "Term 1",
                "due_date": "2025-10-08 08:30",
                "grade_id": "284899892134938801",
                "grade_name": "Play Group",
                "subject_id": "284899892323693711",
                "subject_name": "Arts",
                "subject_title": "Arts",
                "class_id": "302614129628159881",
                "class_sourced_id": "1 no.",
                "class_name": "English 1A",
                "class_title": "English 1A",
                "student_id": "302614477310802906",
                "student_fname": "Andrew",
                "student_lname": "Clark",
                "is_imported": false,
                "published_at": "2025-10-08 10:58:23.250418",
                "updated_at": "2025-10-08 10:58:20.513011",
                "id": "302651443561639795",
                "source_id": "302614815765964822",
                "source_type": "CLASS_ASSIGNMENT",
                "source_title": "Test1 cvmku cvbnm,",
                "assignment_id": "302614815707249479",
                "assmt_score_category_id": null,
                "assmt_score_category": null,
                "assmt_max_score": "100",
                "assmt_tool_type": "SCORE",
                "assmt_tool_id": "302651355728714335",
                "assessment_type": "fmt",
                "assmt_tool_title": "Score",
                "evaluated_element_id": "302614815765964822",
                "evaluated_element_type": "CLASS_ASSIGNMENT",
                "evaluated_element_hierarchy_level": null,
                "evaluated_element_title": "Test1 cvmku cvbnm,",
                "value_id": null,
                "value": "90",
                "primary_subject_teachers": []
            },
            {
                "org_id": "284898051347201887",
                "org_name": "N7 Academy",
                "curr_prog_id": "284899890096511865",
                "curr_prog_title": "N7 Subjects",
                "acad_year_id": "284898051544333908",
                "acad_year_title": "2025-2026",
                "term_id": "289627017530313962",
                "term_name": "Term 1",
                "due_date": "2025-10-08 08:30",
                "grade_id": "284899892134938801",
                "grade_name": "Play Group",
                "subject_id": "284899892323693712",
                "subject_name": "Science and Technology",
                "subject_title": "Science and Technology",
                "class_id": "302614129628159881",
                "class_sourced_id": "1 no.",
                "class_name": "English 1A",
                "class_title": "English 1A",
                "student_id": "302614477310802906",
                "student_fname": "Andrew",
                "student_lname": "Clark",
                "is_imported": false,
                "published_at": "2025-10-08 10:58:23.250418",
                "updated_at": "2025-10-08 10:58:20.513011",
                "id": "302651443561639795",
                "source_id": "302614815765964822",
                "source_type": "CLASS_ASSIGNMENT",
                "source_title": "Test1 cvmku cvbnm,",
                "assignment_id": "302614815707249479",
                "assmt_score_category_id": null,
                "assmt_score_category": null,
                "assmt_max_score": "100",
                "assmt_tool_type": "SCORE",
                "assmt_tool_id": "302651355728714335",
                "assessment_type": "fmt",
                "assmt_tool_title": "Score",
                "evaluated_element_id": "302614815765964822",
                "evaluated_element_type": "CLASS_ASSIGNMENT",
                "evaluated_element_hierarchy_level": null,
                "evaluated_element_title": "Test1 cvmku cvbnm,",
                "value_id": null,
                "value": "90",
                "primary_subject_teachers": []
            },
            {
                "org_id": "284898051347201887",
                "org_name": "N7 Academy",
                "curr_prog_id": "284899890096511865",
                "curr_prog_title": "N7 Subjects",
                "acad_year_id": "284898051544333908",
                "acad_year_title": "2025-2026",
                "term_id": "289627017530313962",
                "term_name": "Term 1",
                "due_date": "2025-10-08 08:30",
                "grade_id": "284899892134938801",
                "grade_name": "Play Group",
                "subject_id": "284899892323693713",
                "subject_name": "Social Studies",
                "subject_title": "Social Studies",
                "class_id": "302614129628159881",
                "class_sourced_id": "1 no.",
                "class_name": "English 1A",
                "class_title": "English 1A",
                "student_id": "302614477310802906",
                "student_fname": "Andrew",
                "student_lname": "Clark",
                "is_imported": false,
                "published_at": "2025-10-08 10:58:23.250418",
                "updated_at": "2025-10-08 10:58:20.513011",
                "id": "302651443561639795",
                "source_id": "302614815765964822",
                "source_type": "CLASS_ASSIGNMENT",
                "source_title": "Test1 cvmku cvbnm,",
                "assignment_id": "302614815707249479",
                "assmt_score_category_id": null,
                "assmt_score_category": null,
                "assmt_max_score": "100",
                "assmt_tool_type": "SCORE",
                "assmt_tool_id": "302651355728714335",
                "assessment_type": "fmt",
                "assmt_tool_title": "Score",
                "evaluated_element_id": "302614815765964822",
                "evaluated_element_type": "CLASS_ASSIGNMENT",
                "evaluated_element_hierarchy_level": null,
                "evaluated_element_title": "Test1 cvmku cvbnm,",
                "value_id": null,
                "value": "90",
                "primary_subject_teachers": []
            },
            {
                "org_id": "284898051347201887",
                "org_name": "N7 Academy",
                "curr_prog_id": "284899890096511865",
                "curr_prog_title": "N7 Subjects",
                "acad_year_id": "284898051544333908",
                "acad_year_title": "2025-2026",
                "term_id": "289627017530313962",
                "term_name": "Term 1",
                "due_date": null,
                "grade_id": "284899892134938801",
                "grade_name": "Play Group",
                "subject_id": "284899892306916494",
                "subject_name": "English",
                "subject_title": "English",
                "class_id": "302614129628159881",
                "class_sourced_id": "1 no.",
                "class_name": "English 1A",
                "class_title": "English 1A",
                "student_id": "305876680260459815",
                "student_fname": "Alex",
                "student_lname": "Peirera",
                "is_imported": false,
                "published_at": "2025-10-24 07:42:04.056967",
                "updated_at": "2025-10-24 07:25:08.328862",
                "id": "308081569568930858",
                "source_id": "308078978659269746",
                "source_type": "CLASS_ASSIGNMENT",
                "source_title": "Rewriting a scene from a new perspective",
                "assignment_id": "308078978554412617",
                "assmt_score_category_id": null,
                "assmt_score_category": null,
                "assmt_max_score": "100",
                "assmt_tool_type": "SCORE",
                "assmt_tool_id": "308078257943616500",
                "assessment_type": "le",
                "assmt_tool_title": "Score",
                "evaluated_element_id": "308078978659269746",
                "evaluated_element_type": "CLASS_ASSIGNMENT",
                "evaluated_element_hierarchy_level": null,
                "evaluated_element_title": "Rewriting a scene from a new perspective",
                "value_id": null,
                "value": "80",
                "primary_subject_teachers": []
            },
            {
                "org_id": "284898051347201887",
                "org_name": "N7 Academy",
                "curr_prog_id": "284899890096511865",
                "curr_prog_title": "N7 Subjects",
                "acad_year_id": "284898051544333908",
                "acad_year_title": "2025-2026",
                "term_id": "289627017530313962",
                "term_name": "Term 1",
                "due_date": null,
                "grade_id": "284899892134938801",
                "grade_name": "Play Group",
                "subject_id": "284899892323693711",
                "subject_name": "Arts",
                "subject_title": "Arts",
                "class_id": "302614129628159881",
                "class_sourced_id": "1 no.",
                "class_name": "English 1A",
                "class_title": "English 1A",
                "student_id": "305876680260459815",
                "student_fname": "Alex",
                "student_lname": "Peirera",
                "is_imported": false,
                "published_at": "2025-10-24 07:42:04.056967",
                "updated_at": "2025-10-24 07:25:08.328862",
                "id": "308081569568930858",
                "source_id": "308078978659269746",
                "source_type": "CLASS_ASSIGNMENT",
                "source_title": "Rewriting a scene from a new perspective",
                "assignment_id": "308078978554412617",
                "assmt_score_category_id": null,
                "assmt_score_category": null,
                "assmt_max_score": "100",
                "assmt_tool_type": "SCORE",
                "assmt_tool_id": "308078257943616500",
                "assessment_type": "le",
                "assmt_tool_title": "Score",
                "evaluated_element_id": "308078978659269746",
                "evaluated_element_type": "CLASS_ASSIGNMENT",
                "evaluated_element_hierarchy_level": null,
                "evaluated_element_title": "Rewriting a scene from a new perspective",
                "value_id": null,
                "value": "80",
                "primary_subject_teachers": []
            },
            {
                "org_id": "284898051347201887",
                "org_name": "N7 Academy",
                "curr_prog_id": "284899890096511865",
                "curr_prog_title": "N7 Subjects",
                "acad_year_id": "284898051544333908",
                "acad_year_title": "2025-2026",
                "term_id": "289627017530313962",
                "term_name": "Term 1",
                "due_date": null,
                "grade_id": "284899892134938801",
                "grade_name": "Play Group",
                "subject_id": "284899892323693712",
                "subject_name": "Science and Technology",
                "subject_title": "Science and Technology",
                "class_id": "302614129628159881",
                "class_sourced_id": "1 no.",
                "class_name": "English 1A",
                "class_title": "English 1A",
                "student_id": "305876680260459815",
                "student_fname": "Alex",
                "student_lname": "Peirera",
                "is_imported": false,
                "published_at": "2025-10-24 07:42:04.056967",
                "updated_at": "2025-10-24 07:25:08.328862",
                "id": "308081569568930858",
                "source_id": "308078978659269746",
                "source_type": "CLASS_ASSIGNMENT",
                "source_title": "Rewriting a scene from a new perspective",
                "assignment_id": "308078978554412617",
                "assmt_score_category_id": null,
                "assmt_score_category": null,
                "assmt_max_score": "100",
                "assmt_tool_type": "SCORE",
                "assmt_tool_id": "308078257943616500",
                "assessment_type": "le",
                "assmt_tool_title": "Score",
                "evaluated_element_id": "308078978659269746",
                "evaluated_element_type": "CLASS_ASSIGNMENT",
                "evaluated_element_hierarchy_level": null,
                "evaluated_element_title": "Rewriting a scene from a new perspective",
                "value_id": null,
                "value": "80",
                "primary_subject_teachers": []
            },
            {
                "org_id": "284898051347201887",
                "org_name": "N7 Academy",
                "curr_prog_id": "284899890096511865",
                "curr_prog_title": "N7 Subjects",
                "acad_year_id": "284898051544333908",
                "acad_year_title": "2025-2026",
                "term_id": "289627017530313962",
                "term_name": "Term 1",
                "due_date": null,
                "grade_id": "284899892134938801",
                "grade_name": "Play Group",
                "subject_id": "284899892323693713",
                "subject_name": "Social Studies",
                "subject_title": "Social Studies",
                "class_id": "302614129628159881",
                "class_sourced_id": "1 no.",
                "class_name": "English 1A",
                "class_title": "English 1A",
                "student_id": "305876680260459815",
                "student_fname": "Alex",
                "student_lname": "Peirera",
                "is_imported": false,
                "published_at": "2025-10-24 07:42:04.056967",
                "updated_at": "2025-10-24 07:25:08.328862",
                "id": "308081569568930858",
                "source_id": "308078978659269746",
                "source_type": "CLASS_ASSIGNMENT",
                "source_title": "Rewriting a scene from a new perspective",
                "assignment_id": "308078978554412617",
                "assmt_score_category_id": null,
                "assmt_score_category": null,
                "assmt_max_score": "100",
                "assmt_tool_type": "SCORE",
                "assmt_tool_id": "308078257943616500",
                "assessment_type": "le",
                "assmt_tool_title": "Score",
                "evaluated_element_id": "308078978659269746",
                "evaluated_element_type": "CLASS_ASSIGNMENT",
                "evaluated_element_hierarchy_level": null,
                "evaluated_element_title": "Rewriting a scene from a new perspective",
                "value_id": null,
                "value": "80",
                "primary_subject_teachers": []
            },
            {
                "org_id": "284898051347201887",
                "org_name": "N7 Academy",
                "curr_prog_id": "284899890096511865",
                "curr_prog_title": "N7 Subjects",
                "acad_year_id": "284898051544333908",
                "acad_year_title": "2025-2026",
                "term_id": "289627017530313962",
                "term_name": "Term 1",
                "due_date": null,
                "grade_id": "284899892134938801",
                "grade_name": "Play Group",
                "subject_id": "284899892323693714",
                "subject_name": "Mathematics",
                "subject_title": "Mathematics",
                "class_id": "302614129628159881",
                "class_sourced_id": "1 no.",
                "class_name": "English 1A",
                "class_title": "English 1A",
                "student_id": "305876680260459815",
                "student_fname": "Alex",
                "student_lname": "Peirera",
                "is_imported": false,
                "published_at": "2025-10-24 07:42:04.056967",
                "updated_at": "2025-10-24 07:25:08.328862",
                "id": "308081569568930858",
                "source_id": "308078978659269746",
                "source_type": "CLASS_ASSIGNMENT",
                "source_title": "Rewriting a scene from a new perspective",
                "assignment_id": "308078978554412617",
                "assmt_score_category_id": null,
                "assmt_score_category": null,
                "assmt_max_score": "100",
                "assmt_tool_type": "SCORE",
                "assmt_tool_id": "308078257943616500",
                "assessment_type": "le",
                "assmt_tool_title": "Score",
                "evaluated_element_id": "308078978659269746",
                "evaluated_element_type": "CLASS_ASSIGNMENT",
                "evaluated_element_hierarchy_level": null,
                "evaluated_element_title": "Rewriting a scene from a new perspective",
                "value_id": null,
                "value": "80",
                "primary_subject_teachers": []
            },
            {
                "org_id": "284898051347201887",
                "org_name": "N7 Academy",
                "curr_prog_id": "284899890096511865",
                "curr_prog_title": "N7 Subjects",
                "acad_year_id": "284898051544333908",
                "acad_year_title": "2025-2026",
                "term_id": "289627017530313962",
                "term_name": "Term 1",
                "due_date": "2025-11-06 18:29",
                "grade_id": "284899892134938801",
                "grade_name": "Play Group",
                "subject_id": "284899892306916494",
                "subject_name": "English",
                "subject_title": "English",
                "class_id": "302614129628159881",
                "class_sourced_id": "1 no.",
                "class_name": "English 1A",
                "class_title": "English 1A",
                "student_id": "308079433099517259",
                "student_fname": "Diego",
                "student_lname": "Jonas",
                "is_imported": false,
                "published_at": "2025-10-30 10:42:45.001436",
                "updated_at": "2025-10-30 10:42:40.992657",
                "id": "310620035972335268",
                "source_id": "310593078522021945",
                "source_type": "CLASS_ASSIGNMENT",
                "source_title": "test ",
                "assignment_id": "310593078371041137",
                "assmt_score_category_id": null,
                "assmt_score_category": null,
                "assmt_max_score": "100",
                "assmt_tool_type": "SCORE",
                "assmt_tool_id": "310550205760019657",
                "assessment_type": "fmt",
                "assmt_tool_title": "Score",
                "evaluated_element_id": "310593078522021945",
                "evaluated_element_type": "CLASS_ASSIGNMENT",
                "evaluated_element_hierarchy_level": null,
                "evaluated_element_title": "test ",
                "value_id": null,
                "value": "80",
                "primary_subject_teachers": []
            },
            {
                "org_id": "284898051347201887",
                "org_name": "N7 Academy",
                "curr_prog_id": "284899890096511865",
                "curr_prog_title": "N7 Subjects",
                "acad_year_id": "284898051544333908",
                "acad_year_title": "2025-2026",
                "term_id": "289627017530313962",
                "term_name": "Term 1",
                "due_date": "2025-11-06 18:29",
                "grade_id": "284899892134938801",
                "grade_name": "Play Group",
                "subject_id": "284899892323693711",
                "subject_name": "Arts",
                "subject_title": "Arts",
                "class_id": "302614129628159881",
                "class_sourced_id": "1 no.",
                "class_name": "English 1A",
                "class_title": "English 1A",
                "student_id": "308079433099517259",
                "student_fname": "Diego",
                "student_lname": "Jonas",
                "is_imported": false,
                "published_at": "2025-10-30 10:42:45.001436",
                "updated_at": "2025-10-30 10:42:40.992657",
                "id": "310620035972335268",
                "source_id": "310593078522021945",
                "source_type": "CLASS_ASSIGNMENT",
                "source_title": "test ",
                "assignment_id": "310593078371041137",
                "assmt_score_category_id": null,
                "assmt_score_category": null,
                "assmt_max_score": "100",
                "assmt_tool_type": "SCORE",
                "assmt_tool_id": "310550205760019657",
                "assessment_type": "fmt",
                "assmt_tool_title": "Score",
                "evaluated_element_id": "310593078522021945",
                "evaluated_element_type": "CLASS_ASSIGNMENT",
                "evaluated_element_hierarchy_level": null,
                "evaluated_element_title": "test ",
                "value_id": null,
                "value": "80",
                "primary_subject_teachers": []
            },
            {
                "org_id": "284898051347201887",
                "org_name": "N7 Academy",
                "curr_prog_id": "284899890096511865",
                "curr_prog_title": "N7 Subjects",
                "acad_year_id": "284898051544333908",
                "acad_year_title": "2025-2026",
                "term_id": "289627017530313962",
                "term_name": "Term 1",
                "due_date": "2025-11-06 18:29",
                "grade_id": "284899892134938801",
                "grade_name": "Play Group",
                "subject_id": "284899892323693712",
                "subject_name": "Science and Technology",
                "subject_title": "Science and Technology",
                "class_id": "302614129628159881",
                "class_sourced_id": "1 no.",
                "class_name": "English 1A",
                "class_title": "English 1A",
                "student_id": "308079433099517259",
                "student_fname": "Diego",
                "student_lname": "Jonas",
                "is_imported": false,
                "published_at": "2025-10-30 10:42:45.001436",
                "updated_at": "2025-10-30 10:42:40.992657",
                "id": "310620035972335268",
                "source_id": "310593078522021945",
                "source_type": "CLASS_ASSIGNMENT",
                "source_title": "test ",
                "assignment_id": "310593078371041137",
                "assmt_score_category_id": null,
                "assmt_score_category": null,
                "assmt_max_score": "100",
                "assmt_tool_type": "SCORE",
                "assmt_tool_id": "310550205760019657",
                "assessment_type": "fmt",
                "assmt_tool_title": "Score",
                "evaluated_element_id": "310593078522021945",
                "evaluated_element_type": "CLASS_ASSIGNMENT",
                "evaluated_element_hierarchy_level": null,
                "evaluated_element_title": "test ",
                "value_id": null,
                "value": "80",
                "primary_subject_teachers": []
            },
            {
                "org_id": "284898051347201887",
                "org_name": "N7 Academy",
                "curr_prog_id": "284899890096511865",
                "curr_prog_title": "N7 Subjects",
                "acad_year_id": "284898051544333908",
                "acad_year_title": "2025-2026",
                "term_id": "289627017530313962",
                "term_name": "Term 1",
                "due_date": "2025-11-06 18:29",
                "grade_id": "284899892134938801",
                "grade_name": "Play Group",
                "subject_id": "284899892323693713",
                "subject_name": "Social Studies",
                "subject_title": "Social Studies",
                "class_id": "302614129628159881",
                "class_sourced_id": "1 no.",
                "class_name": "English 1A",
                "class_title": "English 1A",
                "student_id": "308079433099517259",
                "student_fname": "Diego",
                "student_lname": "Jonas",
                "is_imported": false,
                "published_at": "2025-10-30 10:42:45.001436",
                "updated_at": "2025-10-30 10:42:40.992657",
                "id": "310620035972335268",
                "source_id": "310593078522021945",
                "source_type": "CLASS_ASSIGNMENT",
                "source_title": "test ",
                "assignment_id": "310593078371041137",
                "assmt_score_category_id": null,
                "assmt_score_category": null,
                "assmt_max_score": "100",
                "assmt_tool_type": "SCORE",
                "assmt_tool_id": "310550205760019657",
                "assessment_type": "fmt",
                "assmt_tool_title": "Score",
                "evaluated_element_id": "310593078522021945",
                "evaluated_element_type": "CLASS_ASSIGNMENT",
                "evaluated_element_hierarchy_level": null,
                "evaluated_element_title": "test ",
                "value_id": null,
                "value": "80",
                "primary_subject_teachers": []
            },
            {
                "org_id": "284898051347201887",
                "org_name": "N7 Academy",
                "curr_prog_id": "284899890096511865",
                "curr_prog_title": "N7 Subjects",
                "acad_year_id": "284898051544333908",
                "acad_year_title": "2025-2026",
                "term_id": "289627017530313962",
                "term_name": "Term 1",
                "due_date": "2025-11-06 18:29",
                "grade_id": "284899892134938801",
                "grade_name": "Play Group",
                "subject_id": "284899892323693714",
                "subject_name": "Mathematics",
                "subject_title": "Mathematics",
                "class_id": "302614129628159881",
                "class_sourced_id": "1 no.",
                "class_name": "English 1A",
                "class_title": "English 1A",
                "student_id": "308079433099517259",
                "student_fname": "Diego",
                "student_lname": "Jonas",
                "is_imported": false,
                "published_at": "2025-10-30 10:42:45.001436",
                "updated_at": "2025-10-30 10:42:40.992657",
                "id": "310620035972335268",
                "source_id": "310593078522021945",
                "source_type": "CLASS_ASSIGNMENT",
                "source_title": "test ",
                "assignment_id": "310593078371041137",
                "assmt_score_category_id": null,
                "assmt_score_category": null,
                "assmt_max_score": "100",
                "assmt_tool_type": "SCORE",
                "assmt_tool_id": "310550205760019657",
                "assessment_type": "fmt",
                "assmt_tool_title": "Score",
                "evaluated_element_id": "310593078522021945",
                "evaluated_element_type": "CLASS_ASSIGNMENT",
                "evaluated_element_hierarchy_level": null,
                "evaluated_element_title": "test ",
                "value_id": null,
                "value": "80",
                "primary_subject_teachers": []
            },
            {
                "org_id": "284898051347201887",
                "org_name": "N7 Academy",
                "curr_prog_id": "284899890096511865",
                "curr_prog_title": "N7 Subjects",
                "acad_year_id": "284898051544333908",
                "acad_year_title": "2025-2026",
                "term_id": "289627017530313962",
                "term_name": "Term 1",
                "due_date": "2025-11-26 11:00",
                "grade_id": "284899892134938801",
                "grade_name": "Play Group",
                "subject_id": "284899892306916494",
                "subject_name": "English",
                "subject_title": "English",
                "class_id": "313133089419178707",
                "class_sourced_id": "TDC-284529314102252266",
                "class_name": "Ashwani",
                "class_title": "Ashwani",
                "student_id": "313160938456877611",
                "student_fname": "a11",
                "student_lname": "a11",
                "is_imported": false,
                "published_at": "2025-11-24 10:47:35.448992",
                "updated_at": "2025-11-24 10:47:32.906852",
                "id": "319680956988391727",
                "source_id": "319680880643679947",
                "source_type": "CLASS_ASSIGNMENT",
                "source_title": "Score Based",
                "assignment_id": "319680880580756351",
                "assmt_score_category_id": null,
                "assmt_score_category": null,
                "assmt_max_score": "100",
                "assmt_tool_type": "SCORE",
                "assmt_tool_id": "319680799999795833",
                "assessment_type": "fmt",
                "assmt_tool_title": "Score",
                "evaluated_element_id": "319680880643679947",
                "evaluated_element_type": "CLASS_ASSIGNMENT",
                "evaluated_element_hierarchy_level": null,
                "evaluated_element_title": "Score Based",
                "value_id": null,
                "value": "100",
                "primary_subject_teachers": []
            },
            {
                "org_id": "284898051347201887",
                "org_name": "N7 Academy",
                "curr_prog_id": "284899890096511865",
                "curr_prog_title": "N7 Subjects",
                "acad_year_id": "284898051544333908",
                "acad_year_title": "2025-2026",
                "term_id": "289627017530313962",
                "term_name": "Term 1",
                "due_date": "2025-11-26 11:00",
                "grade_id": "284899892134938801",
                "grade_name": "Play Group",
                "subject_id": "284899892323693711",
                "subject_name": "Arts",
                "subject_title": "Arts",
                "class_id": "313133089419178707",
                "class_sourced_id": "TDC-284529314102252266",
                "class_name": "Ashwani",
                "class_title": "Ashwani",
                "student_id": "313160938456877611",
                "student_fname": "a11",
                "student_lname": "a11",
                "is_imported": false,
                "published_at": "2025-11-24 10:47:35.448992",
                "updated_at": "2025-11-24 10:47:32.906852",
                "id": "319680956988391727",
                "source_id": "319680880643679947",
                "source_type": "CLASS_ASSIGNMENT",
                "source_title": "Score Based",
                "assignment_id": "319680880580756351",
                "assmt_score_category_id": null,
                "assmt_score_category": null,
                "assmt_max_score": "100",
                "assmt_tool_type": "SCORE",
                "assmt_tool_id": "319680799999795833",
                "assessment_type": "fmt",
                "assmt_tool_title": "Score",
                "evaluated_element_id": "319680880643679947",
                "evaluated_element_type": "CLASS_ASSIGNMENT",
                "evaluated_element_hierarchy_level": null,
                "evaluated_element_title": "Score Based",
                "value_id": null,
                "value": "100",
                "primary_subject_teachers": []
            },
            {
                "org_id": "284898051347201887",
                "org_name": "N7 Academy",
                "curr_prog_id": "284899890096511865",
                "curr_prog_title": "N7 Subjects",
                "acad_year_id": "284898051544333908",
                "acad_year_title": "2025-2026",
                "term_id": "289627017530313962",
                "term_name": "Term 1",
                "due_date": "2025-11-26 11:00",
                "grade_id": "284899892134938801",
                "grade_name": "Play Group",
                "subject_id": "284899892323693712",
                "subject_name": "Science and Technology",
                "subject_title": "Science and Technology",
                "class_id": "313133089419178707",
                "class_sourced_id": "TDC-284529314102252266",
                "class_name": "Ashwani",
                "class_title": "Ashwani",
                "student_id": "313160938456877611",
                "student_fname": "a11",
                "student_lname": "a11",
                "is_imported": false,
                "published_at": "2025-11-24 10:47:35.448992",
                "updated_at": "2025-11-24 10:47:32.906852",
                "id": "319680956988391727",
                "source_id": "319680880643679947",
                "source_type": "CLASS_ASSIGNMENT",
                "source_title": "Score Based",
                "assignment_id": "319680880580756351",
                "assmt_score_category_id": null,
                "assmt_score_category": null,
                "assmt_max_score": "100",
                "assmt_tool_type": "SCORE",
                "assmt_tool_id": "319680799999795833",
                "assessment_type": "fmt",
                "assmt_tool_title": "Score",
                "evaluated_element_id": "319680880643679947",
                "evaluated_element_type": "CLASS_ASSIGNMENT",
                "evaluated_element_hierarchy_level": null,
                "evaluated_element_title": "Score Based",
                "value_id": null,
                "value": "100",
                "primary_subject_teachers": []
            },
            {
                "org_id": "284898051347201887",
                "org_name": "N7 Academy",
                "curr_prog_id": "284899890096511865",
                "curr_prog_title": "N7 Subjects",
                "acad_year_id": "284898051544333908",
                "acad_year_title": "2025-2026",
                "term_id": "289627017530313962",
                "term_name": "Term 1",
                "due_date": "2025-11-26 11:00",
                "grade_id": "284899892134938801",
                "grade_name": "Play Group",
                "subject_id": "284899892323693713",
                "subject_name": "Social Studies",
                "subject_title": "Social Studies",
                "class_id": "313133089419178707",
                "class_sourced_id": "TDC-284529314102252266",
                "class_name": "Ashwani",
                "class_title": "Ashwani",
                "student_id": "313160938456877611",
                "student_fname": "a11",
                "student_lname": "a11",
                "is_imported": false,
                "published_at": "2025-11-24 10:47:35.448992",
                "updated_at": "2025-11-24 10:47:32.906852",
                "id": "319680956988391727",
                "source_id": "319680880643679947",
                "source_type": "CLASS_ASSIGNMENT",
                "source_title": "Score Based",
                "assignment_id": "319680880580756351",
                "assmt_score_category_id": null,
                "assmt_score_category": null,
                "assmt_max_score": "100",
                "assmt_tool_type": "SCORE",
                "assmt_tool_id": "319680799999795833",
                "assessment_type": "fmt",
                "assmt_tool_title": "Score",
                "evaluated_element_id": "319680880643679947",
                "evaluated_element_type": "CLASS_ASSIGNMENT",
                "evaluated_element_hierarchy_level": null,
                "evaluated_element_title": "Score Based",
                "value_id": null,
                "value": "100",
                "primary_subject_teachers": []
            },
            {
                "org_id": "284898051347201887",
                "org_name": "N7 Academy",
                "curr_prog_id": "284899890096511865",
                "curr_prog_title": "N7 Subjects",
                "acad_year_id": "284898051544333908",
                "acad_year_title": "2025-2026",
                "term_id": "289627017530313962",
                "term_name": "Term 1",
                "due_date": "2025-11-26 11:00",
                "grade_id": "284899892134938801",
                "grade_name": "Play Group",
                "subject_id": "284899892323693714",
                "subject_name": "Mathematics",
                "subject_title": "Mathematics",
                "class_id": "313133089419178707",
                "class_sourced_id": "TDC-284529314102252266",
                "class_name": "Ashwani",
                "class_title": "Ashwani",
                "student_id": "313160938456877611",
                "student_fname": "a11",
                "student_lname": "a11",
                "is_imported": false,
                "published_at": "2025-11-24 10:47:35.448992",
                "updated_at": "2025-11-24 10:47:32.906852",
                "id": "319680956988391727",
                "source_id": "319680880643679947",
                "source_type": "CLASS_ASSIGNMENT",
                "source_title": "Score Based",
                "assignment_id": "319680880580756351",
                "assmt_score_category_id": null,
                "assmt_score_category": null,
                "assmt_max_score": "100",
                "assmt_tool_type": "SCORE",
                "assmt_tool_id": "319680799999795833",
                "assessment_type": "fmt",
                "assmt_tool_title": "Score",
                "evaluated_element_id": "319680880643679947",
                "evaluated_element_type": "CLASS_ASSIGNMENT",
                "evaluated_element_hierarchy_level": null,
                "evaluated_element_title": "Score Based",
                "value_id": null,
                "value": "100",
                "primary_subject_teachers": []
            }
        ],
        "pageInfo": {
            "hasNextPage": false,
            "hasPreviousPage": false,
            "startCursor": "eyJwdWJsaXNoZWRfYXQiOiIyMDI1LTEwLTA4IDEwOjU4OjIzLjI1MDQxOCIsImlkIjoiMzAyNjUxNDQzNTYxNjM5Nzk1In0=",
            "endCursor": "eyJwdWJsaXNoZWRfYXQiOiIyMDI1LTExLTI0IDEwOjQ3OjM1LjQ0ODk5MiIsImlkIjoiMzE5NjgwOTU2OTg4MzkxNzI3In0="
        }
    }
}
```

## Student Flags
### Get FlagTypes
Method: `GET`
Path: `/public/v2/flag-types`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/flag-types`

Description:
Fetches a list of flag types configured for the authenticated user's organization.

Supports filtering by enabled status, curriculum IDs, and flag type IDs.

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| isEnabled | boolean | Filter flag types by enabled/disabled status. | yes |
| curriculums | array [] string | Filter flag types linked to specific curriculum IDs. | yes |
| ids | array [] string | Retrieve specific flag types by their IDs. | yes |

Headers:
| Name | Value | Description | Disabled |
| --- | --- | --- | --- |
| Content-Type | application/json |  | no |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/flag-types" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 200 OK
```json
{
    "response": {
        "edges": [
            {
                "id": "320325057639350659",
                "name": "Attention Required",
                "icon": {
                    "name": "BehaviorAlertColored"
                },
                "isEnabled": true,
                "createdAt": "2025-11-26T05:26:58.469Z",
                "updatedAt": "2025-11-26T05:29:34.928Z",
                "organizationId": "284898051347201887"
            },
            {
                "id": "320324768341426562",
                "name": "Medical Alert",
                "icon": {
                    "name": "MedicalAlertColored"
                },
                "isEnabled": true,
                "createdAt": "2025-11-26T05:25:49.495Z",
                "updatedAt": "2025-11-26T05:25:49.495Z",
                "organizationId": "284898051347201887"
            }
        ]
    }
}
```

### Create FlagTypes
Method: `POST`
Path: `/public/v2/flag-types`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/flag-types`

Description:
Creates a new flag type within the organization.

A flag type represents a label or category used for tagging or flagging entities such as behaviors, alerts, or curriculum elements.

When created, the flag type is automatically linked to all curriculums associated with the organization.

Field
Type
Description

name
String
Provide the name of the Flag Type.

Auth: Bearer token (`Authorization: Bearer <token>`)

Request Body (raw):
```json
{
    "name":"Medical Issue "
}
```

Example Request (cURL):
```bash
curl -X POST "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/flag-types" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  --data-raw "{
    \"name\":\"Medical Issue \"
}"
```

Response Examples:
Status: 201 Created
```json
{
    "response": {
        "edges": {
            "id": "322908555151671692",
            "name": "Medical Issue",
            "icon": {
                "name": "BehaviorAlertColored"
            },
            "isEnabled": true,
            "createdAt": "2025-12-03T08:32:52.275Z",
            "updatedAt": "2025-12-03T08:32:52.275Z",
            "organizationId": "284898051347201887"
        }
    }
}
```

### Update FlagTypes
Method: `PUT`
Path: `/public/v2/flag-types/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/flag-types/:id`

Description:
This endpoint allows updating flag type details such as its name, enabled status, and curriculum associations.

Request Body:

Field
Type
Description
Required
Example

name
String
Updated name of the flag type. Must be unique and non-empty.
No
"Urgent"

isEnabled
Boolean
Indicates whether the flag type is active.
No
false

curriculums
Object
Specifies curriculum mapping updates.
No
{ "added": ["284898051347201887"], "removed": ["284898051347201999"] }

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | 322908555151671692 |  |

Headers:
| Name | Value | Description | Disabled |
| --- | --- | --- | --- |
| Content-Type | application/json |  | no |

Request Body (raw):
```json
{
    "name": "Medical Issue Triggered",
    "icon": "MedicalAlertColored"
}
```

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/flag-types/:id" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  --data-raw "{
    \"name\": \"Medical Issue Triggered\",
    \"icon\": \"MedicalAlertColored\"
}"
```

Response Examples:
Status: 200 OK
```json
{
    "response": {
        "edges": [
            {
                "id": "322908555151671692",
                "name": "Medical Issue Triggered",
                "icon": {
                    "name": "BehaviorAlertColored"
                },
                "isEnabled": true,
                "createdAt": "2025-12-03T08:32:52.275Z",
                "updatedAt": "2025-12-03T08:34:55.975Z",
                "organizationId": "284898051347201887"
            }
        ]
    }
}
```

### Get StudentFlag
Method: `GET`
Path: `/public/v2/student-flags`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/student-flags`

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| studentIds | array [] string | Filter by student IDs. | yes |
| flagTypeIds | array [] string | Filter by flag type IDs. | yes |
| activeOnly | boolean | Returns only currently active flags when true. | yes |
| first | integer | Number of records to return per page. | yes |
| after | string | Cursor for pagination (used to fetch the next set of records). | yes |

Headers:
| Name | Value | Description | Disabled |
| --- | --- | --- | --- |
| Content-Type | application/json |  | no |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/student-flags" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 200 OK
```json
{
    "response": {
        "edges": [
            {
                "id": "320328234451340815",
                "studentId": "305876680260459815",
                "flagTypeId": "320325057639350659",
                "title": "Mathematics",
                "description": "Mathematics Need More Focus !",
                "expiresAt": "2025-12-05 23:59:59",
                "createdAt": "2025-11-26 05:39:35",
                "updatedAt": "2025-11-26 05:54:45",
                "isArchived": true,
                "organizationId": "284898051347201887"
            },
            {
                "id": "320326248444202509",
                "studentId": "305876680260459815",
                "flagTypeId": "320325057639350659",
                "title": "Science",
                "description": "Science Need More Focus !",
                "expiresAt": null,
                "createdAt": "2025-11-26 05:31:42",
                "updatedAt": "2025-11-26 05:31:42",
                "isArchived": false,
                "organizationId": "284898051347201887"
            }
        ],
        "pageInfo": {
            "hasNextPage": false,
            "hasPreviousPage": false,
            "startCursor": "2025-11-26 05:39:35.880228##==>##320328234451340815",
            "endCursor": null
        }
    }
}
```

### Create StudentFlag
Method: `POST`
Path: `/public/v2/student-flags`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/student-flags`

Description:
Creates a new student flag associated with a specific student and flag type.

A student flag is used to track behaviors, alerts, or observations, and may include additional descriptive information and an optional expiration date.

Request Body:

Field
Type
Description
Required

studentId
string
Identifier of the student for whom the flag is being created.
Yes

flagTypeId
string
Identifier of the flag type or category.
Yes

title
string
Title or short summary describing the flag.
Yes

description
string
Detailed explanation or context for the flag.
No

expiresAt
string
Expiration timestamp for the flag, if applicable.
fomat: "yyyy-mm-dd"
No

Auth: Bearer token (`Authorization: Bearer <token>`)

Request Body (raw):
```json
{
    "studentId": "305876680260459815",
    "flagTypeId": "320325057639350659",
    "title": "Science Alert",
    "description": "Study",
    "expiresAt": "2026-11-05"
}
```

Example Request (cURL):
```bash
curl -X POST "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/student-flags" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  --data-raw "{
    \"studentId\": \"305876680260459815\",
    \"flagTypeId\": \"320325057639350659\",
    \"title\": \"Science Alert\",
    \"description\": \"Study\",
    \"expiresAt\": \"2026-11-05\"
}"
```

Response Examples:
Status: 201 Created
```json
{
    "response": {
        "edges": [
            {
                "id": "322909533280144925",
                "studentId": "305876680260459815",
                "flagTypeId": "320325057639350659",
                "title": "Science Alert",
                "description": "Study",
                "expiresAt": "2026-11-05T23:59:59.999Z",
                "isArchived": false,
                "createdAt": "2025-12-03T08:36:45.479Z",
                "updatedAt": "2025-12-03T08:36:45.479Z",
                "organizationId": "284898051347201887"
            }
        ]
    }
}
```

### Update StudentFlag
Method: `PUT`
Path: `/public/v2/student-flags/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/student-flags/:id`

Description:
Updates the details of an existing student flag.

This endpoint allows modifications to the flag’s title, description, expiration date, flag type, or archival status.

Request Body:

Field
Type
Description
Required

flagTypeId
string
Identifier of the flag type to reassign the flag to.
No

title
string
Updated title or short description of the flag.
No

description
string
Updated detailed notes or comments for the flag.
No

expiresAt
string
New expiration date for the flag.
Format: "yyyy-mm-dd"
No

isArchived
boolean
Marks the flag as archived if true.
No

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | 322909533280144925 |  |

Request Body (raw):
```json
{
    "isArchived": true
}
```

Example Request (cURL):
```bash
curl -X PUT "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/student-flags/:id" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  --data-raw "{
    \"isArchived\": true
}"
```

Response Examples:
Status: 200 OK
```json
{
    "response": {
        "edges": [
            {
                "id": "322909533280144925",
                "studentId": "305876680260459815",
                "flagTypeId": "320325057639350659",
                "title": "Science Alert",
                "description": "Study",
                "expiresAt": "2026-11-05T23:59:59.999Z",
                "isArchived": true,
                "createdAt": "2025-12-03T08:36:45.479Z",
                "updatedAt": "2025-12-03T08:37:06.993Z",
                "organizationId": "284898051347201887"
            }
        ]
    }
}
```

## Behaviour
### Get Incidents
Method: `POST`
Path: `/public/v2/behaviour/get-incidents`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/behaviour/get-incidents`

Description:
This API retrieves a paginated list of behaviour incidents. It returns detailed information about each incident, including description, involved students, category, sub-category, level, location, linked incidence, actions, and the full activity log of updates and sharing history.
The API supports cursor-based pagination using the after parameter and allows fetching specific incidents by IDs if required.

Field
Type
Description
Required
Default Value

after
string
Cursor-based pagination token in the format: "timestamp##==>##incidentId". Use this to fetch incidents created after a specific point.
Yes
-

first
integer
The number of incidents to retrieve per request.
No
200

ids
array[string]
List of specific incident IDs to fetch. If empty, all matching incidents are returned based on pagination.
No
-

returnDescriptionInHTMLFormat
Boolean
This will return the description in HTML format
No
false

shouldIncludeStudentHomeroomAdvisorInfo
Boolean
This returns the homeroom advisor details for the involved student.
No
false

Auth: Bearer token (`Authorization: Bearer <token>`)

Request Body (raw):
```json
{
    "after": "2025-09-29 04:41:55.723068##==>##298282367909371909",
    "first": 5,
    "ids": [],
    "returnDescriptionInHTMLFormat" : false,
    "shouldIncludeStudentHomeroomAdvisorInfo" : false
}
```

Example Request (cURL):
```bash
curl -X POST "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/behaviour/get-incidents" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  --data-raw "{
    \"after\": \"2025-09-29 04:41:55.723068##==>##298282367909371909\",
    \"first\": 5,
    \"ids\": [],
    \"returnDescriptionInHTMLFormat\" : false,
    \"shouldIncludeStudentHomeroomAdvisorInfo\" : false
}"
```

Response Examples:
Status: 200 OK
```json
{
            "recordtype": "CREATE",
            "id": "298235771452661761",
            "uid": "IC775",
            "title": "test incident upated 2",
            "state": "DRAFT",
            "createdAt": "2025-09-26T01:02:02.242Z",
            "createdBy": {
                "userId": 211874,
                "userName": "Support Toddle S."
            },
            "updatedAt": "2025-10-08T04:55:30.804Z",
            "updatedBy": {
                "userId": 211874,
                "userName": "Support Toddle S."
            },
            "incidentTime": "2025-09-25T01:02:02.242Z",
            "description": {
                "text": "test",
                "attachments": [
                    {
                        "url": "https://cloud.toddleapp.com/eu-west-1/s/NPm2zL/content/buMegRBzj/3223023.jpeg",
                        "mimeType": "image/jpeg"
                    },
                    {
                        "url": "https://cloud.toddleapp.com/eu-west-1/s/NPm2zL/content/mK3ByVB8B/72da8e918336efe1313e62f05f090e08.jpeg",
                        "mimeType": "image/jpeg"
                    }
                ]
            },
            "confidentialNote": {
                "text": "ub-category:Sports AchievementsSeverity:GoodIncident description may be visible to families and students based on the sharing setting of the individual incident  Potter Harry S.ub-category:Sports AchievementsSeverity:GoodIncident description may be visible to families and students based on the sharing setting of the individual incident  Potter Harry S.ub-category:Sports AchievementsSeverity:GoodIncident description may be visible to families and students based on the sharing setting of the individual incident  Potter Harry S.jkdskjvd",
                "attachments": []
            },
            "involvedStudent": {
                "userId": "18479240710198398",
                "userName": "01 student",
                "grade": "Grade 5 PYP",
                "yearGroup": "Batch of 2024",
                "homeroomAdvisor": {
                    "userId": "18473702328898678",
                    "userName": "Test Teacher Andrew"
                }
            },
            "category": {
                "id": "155484036238672764",
                "name": "Achievement",
                "level": 0
            },
            "subCategory": {
                "id": "157274169044632602",
                "name": "High Grades",
                "level": 2
            },
            "level": {
                "id": "226855969403963268",
                "name": "Well"
            },
            "location": {
                "id": "134981730216968290",
                "name": "Academic office"
            },
            "linkedIncidents": [
                {
                    "id": "158752904868529400",
                    "uid": "IC356",
                    "title": "Test title 1"
                },
                {
                    "id": "302213866719290323",
                    "uid": "IC785",
                    "title": "test description template in email"
                }
            ],
            "actions": [
                {
                    "id": "134981405481369642",
                    "title": "Academic excellence award",
                    "status": "COMPLETED"
                },
                {
                    "id": "224377387905712379",
                    "title": "12",
                    "status": "COMPLETED"
                }
            ],
            "activityLog": [
                {
                    "id": "302643150101422778",
                    "text": "Support Toddle S. updated the description for the incident",
                    "createdAt": "2025-10-08T10:25:30.833879"
                },
                {
                    "id": "302196920648999508",
                    "text": "Support Toddle S. referred the incident to admin2 test",
                    "createdAt": "2025-10-07T04:52:13.805797"
                }
                
            ],
            "cursor": "2025-10-08 10:25:30.804351##==>##298235771452661761"
        }
```

## Assignments
### Get Assignments
Method: `GET`
Path: `/public/v2/assignments`
Base URL: `https://{{staging}}`
Full URL: `https://{{staging}}/public/v2/assignments?curriculumProgramId=13065`

Description:
Retrieves assignments associated with a curriculum program.

Supports filtering by assignment, class, teacher course, and academic year, along with cursor-based pagination.

Name
Type
Required
Description

curriculumProgramId
string
Yes
Unique identifier of the curriculum program. This parameter is mandatory.

classIds
array (comma-separated)
No
Unique identifiers of classes. Pass multiple values as a comma-separated list.

teacherCourseIds
array (comma-separated)
No
Unique identifiers of teacher courses. Pass multiple values as a comma-separated list.

assignmentId
string
No
Unique identifier of the assignment

academicYearId
string
No
Unique identifier of the academic year to filter assignments.

count
integer
No
Number of records per page. Default is 400. Maximum allowed value is 1000.

cursor
string
No
Cursor token from the previous response (endCursor) used to fetch the next page of results.

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| curriculumProgramId | 13065 | Unique Identifier of the curriculum Program. | no |
| classIds | 104414335496882348, 290699009910123023 | Unique Identifier of the classIds. Pass comma separate values | yes |
| teacherCourseIds | 284899890096511865 | Unique identifier of the teacher course. Pass comma separate values. | yes |
| assignmentId | 330430126355384436 | Unique identifier of the assignment | yes |
| academicYearId | 1014223204253776711 | Unique identifier of the academicYear | yes |
| count | 400 | Number of records per page. (400-1000) default 400 | yes |
| cursor | MjAyNS0wNy0zMSAxMDoyMTo1MS40MTk5MzgjIz09PiMjMjAyNS0wNy0zMSAxMDoyMTowMCMjPT0%2BIyMyNzc2Mzc0OTkxMjYyOTA4MDk%3D | Pass the endCursor of the previous page to fetch nextPage. | yes |

Example Request (cURL):
```bash
curl -X GET "https://{{staging}}/public/v2/assignments?curriculumProgramId=13065" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 200 OK
```json
{
    "response": {
        "edges": [
            {
                "id": "330098036485130293",
                "title": "Solar Workshop",
                "dueDate": "24-12-2025 10:30:00",
                "closeSubmissionDate": "26-12-2025 04:45:00",
                "publishedAt": "23-12-2025 04:41:00",
                "createdAt": "23-12-2025 04:41:18",
                "state": "PUBLISHED",
                "assessmentType": "assessment",
                "subAssessmentType": "fmt",
                "teacherCourseId": "",
                "teacherCourseName": "",
                "classId": "104414335496882348",
                "className": "Chahat's MYP class",
                "curriculumProgramId": "13065",
                "subjects": [
                    {
                        "id": "134155",
                        "name": "English A"
                    }
                ],
                "categoryId": "239229690064142340",
                "categoryName": "cat 2",
                "createdBy": "368261"
            }
        ],
        "pageInfo": {
            "hasNextPage": false,
            "hasPreviousPage": false,
            "startCursor": "MjAyNS0xMi0yMyAwNDo0MToxOC4xOTcxMjEjIz09PiMjMjAyNS0xMi0yMyAwNDo0MTowMCMjPT0%2BIyMzMzAwOTgwMzY0ODUxMzAyOTM%3D",
            "endCursor": "MjAyNS0xMi0yMyAwNDo0MToxOC4xOTcxMjEjIz09PiMjMjAyNS0xMi0yMyAwNDo0MTowMCMjPT0%2BIyMzMzAwOTgwMzY0ODUxMzAyOTM%3D"
        },
        "totalCount": 1
    }
}
```

### Get Assignment By Id
Method: `GET`
Path: `/public/v2/assignments/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/assignments/:id`

Description:
Fetches complete information about an assignment, including its title, description, due date, grading configuration, and associated class or course, identified by the provided assignment ID.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | 330430126355384436 |  |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/assignments/:id" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 200 OK
```json
{
    "response": {
        "edges": [
            {
                "id": "330430126355384436",
                "title": "Ashwani doing score test",
                "dueDate": "26-12-2025 10:30:00",
                "closeSubmissionDate": "27-12-2025 02:45:00",
                "publishedAt": "24-12-2025 12:28:00",
                "createdAt": "24-12-2025 02:40:54",
                "state": "PUBLISHED",
                "assessmentType": "assessment",
                "subAssessmentType": "fmt",
                "teacherCourseId": "",
                "teacherCourseName": "",
                "classId": "104414335496882348",
                "className": "Chahat's MYP class",
                "curriculumProgramId": "13065",
                "subjects": [
                    {
                        "id": "134155",
                        "name": "English A"
                    }
                ],
                "categoryId": "239229690038976515",
                "categoryName": "category 2",
                "createdBy": "368261"
            }
        ]
    }
}
```

### Get Student Assignments
Method: `GET`
Path: `/public/v2/student-assignments`
Base URL: `https://{{staging}}`
Full URL: `https://{{staging}}/public/v2/student-assignments?curriculumProgramId=13065`

Description:
Retrieves student-level assignment data for a given curriculum program.

Supports filtering by assignment IDs and student IDs, along with cursor-based pagination.

Name
Type
Required
Description

curriculumProgramId
string
Yes
Unique identifier of the curriculum program.

assignmentIds
array (comma-separated)
No
Unique identifier(s) of assignments. Pass multiple values as a comma-separated list.

studentIds
array (comma-separated)
No
Unique identifier(s) of students. Pass multiple values as a comma-separated list.

count
integer
No
Number of records per page. Default is 400. Maximum allowed value is 1000.

cursor
string
No
Cursor token from the previous response (endCursor) used to fetch the next page of results.

Auth: Bearer token (`Authorization: Bearer <token>`)

Query Parameters:
| Name | Example | Description | Disabled |
| --- | --- | --- | --- |
| curriculumProgramId | 13065 | Unique Identifier of the Curriculum Program | no |
| assignmentIds | 277637499126290809, 289239918977228728 | Unique Identifier of the assignments. Pass comma separated values | yes |
| studentIds | 299418884715319919, 277636828486444314 | Unique identifier of the students. Pass comma separated values | yes |
| count | 400 | Number of records per page. Range (400-1000) default 400 | yes |
| cursor | eyJzdHVkZW50X2lkIjoiMTQzMTM2Njg0NDAwMTkzMTgzIiwic291cmNlX2lkIjoiMjU0ODkwMjk3MzUwMTc1Mzk0In0= | Pass the end cursor of previous page to fetch the next page | yes |

Example Request (cURL):
```bash
curl -X GET "https://{{staging}}/public/v2/student-assignments?curriculumProgramId=13065" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 200 OK
```json
{
    "response": {
        "edges": [
            {
                "assignmentTitle": "Ozymandias",
                "assignmentType": "fmt",
                "studentName": "Reed Richards",
                "studentId": "277636828486444314",
                "evaluatedAt": null,
                "evaluationSharedAt": null,
                "assignmentId": "277637499126290809",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {
                    "remark": [
                        {
                            "id": "277951587530312429",
                            "message": "Comment"
                        }
                    ],
                    "mypObjectiveRubricRating": [
                        {
                            "id": "277942448116737589",
                            "value": "3-4",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356871",
                            "criteriaLabel": "Objective A: Analysing",
                            "objectiveLabel": "identify and comment upon significant aspects of texts",
                            "assessmentToolId": "277637375033606715"
                        },
                        {
                            "id": "295429498638186674",
                            "value": "1-2",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356911",
                            "criteriaLabel": "Objective B: Organizing",
                            "objectiveLabel": "organize opinions and ideas in a logical manner",
                            "assessmentToolId": "277637375033606715"
                        },
                        {
                            "id": "295429500676618419",
                            "value": "5-6",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356911",
                            "criteriaLabel": "Objective B: Organizing",
                            "objectiveLabel": "use referencing and formatting tools to create a presentation style suitable to the context and intention.",
                            "assessmentToolId": "277637375033606715"
                        },
                        {
                            "id": "295429508314446004",
                            "value": "1-2",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356874",
                            "criteriaLabel": "Objective C:  Producing text",
                            "objectiveLabel": "produce texts that demonstrate thought and imagination while exploring new perspectives and ideas arising from personal engagement with the creative process",
                            "assessmentToolId": "277637375033606715"
                        },
                        {
                            "id": "295429514354243765",
                            "value": "5-6",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356874",
                            "criteriaLabel": "Objective C:  Producing text",
                            "objectiveLabel": "make stylistic choices in terms of linguistic, literary and visual devices, demonstrating awareness of impact on an audience",
                            "assessmentToolId": "277637375033606715"
                        },
                        {
                            "id": "295429527675353270",
                            "value": "0",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356875",
                            "criteriaLabel": "Objective D: Using language",
                            "objectiveLabel": "use appropriate and varied vocabulary, sentence structures and forms of expression",
                            "assessmentToolId": "277637375033606715"
                        },
                        {
                            "id": "295429533731928247",
                            "value": "5-6",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356875",
                            "criteriaLabel": "Objective D: Using language",
                            "objectiveLabel": "write and speak in an appropriate register and style",
                            "assessmentToolId": "277637375033606715"
                        },
                        {
                            "id": "295429551800989881",
                            "value": "3-4",
                            "toolType": "MYP_INTERDISCIPLINARY_CRITERIA_RUBRIC",
                            "criteriaId": "19257718",
                            "criteriaLabel": "Objective A: Evaluating",
                            "objectiveLabel": "i. evaluate interdisciplinary perspectives.",
                            "assessmentToolId": "277637442436071996"
                        },
                        {
                            "id": "295429556246952122",
                            "value": "1-2",
                            "toolType": "MYP_INTERDISCIPLINARY_CRITERIA_RUBRIC",
                            "criteriaId": "19257719",
                            "criteriaLabel": "Objective B: Synthesizing",
                            "objectiveLabel": "i. justify how their product communicates interdisciplinary understanding.",
                            "assessmentToolId": "277637442436071996"
                        },
                        {
                            "id": "295429570495002812",
                            "value": "1-2",
                            "toolType": "MYP_INTERDISCIPLINARY_CRITERIA_RUBRIC",
                            "criteriaId": "19257720",
                            "criteriaLabel": "Objective C: Reflecting",
                            "objectiveLabel": "i. discuss how new interdisciplinary understanding enables action.",
                            "assessmentToolId": "277637442436071996"
                        },
                        {
                            "id": "295429542258948280",
                            "value": "1-2",
                            "toolType": "MYP_INTERDISCIPLINARY_CRITERIA_RUBRIC",
                            "criteriaId": "19257718",
                            "criteriaLabel": "Objective A: Evaluating",
                            "objectiveLabel": "ii. analyse disciplinary knowledge",
                            "assessmentToolId": "277637442436071996"
                        },
                        {
                            "id": "295429558750951611",
                            "value": "5-6",
                            "toolType": "MYP_INTERDISCIPLINARY_CRITERIA_RUBRIC",
                            "criteriaId": "19257719",
                            "criteriaLabel": "Objective B: Synthesizing",
                            "objectiveLabel": "ii. create a product that communicates a purposeful interdisciplinary understanding",
                            "assessmentToolId": "277637442436071996"
                        },
                        {
                            "id": "295429573363906749",
                            "value": "1-2",
                            "toolType": "MYP_INTERDISCIPLINARY_CRITERIA_RUBRIC",
                            "criteriaId": "19257720",
                            "criteriaLabel": "Objective C: Reflecting",
                            "objectiveLabel": "ii. discuss the development of their own interdisciplinary learning",
                            "assessmentToolId": "277637442436071996"
                        }
                    ],
                    "mypObjectiveCriteriaRating": [
                        {
                            "id": "277942457654584637",
                            "value": "1",
                            "criteriaId": "19356871",
                            "criteriaLabel": "Objective A: Analysing"
                        },
                        {
                            "id": "295429452517610377",
                            "value": "6",
                            "criteriaId": "19356871",
                            "criteriaLabel": "Objective A: Analysing"
                        },
                        {
                            "id": "295429504073995146",
                            "value": "2",
                            "criteriaId": "19356911",
                            "criteriaLabel": "Objective B: Organizing"
                        },
                        {
                            "id": "295429519706166155",
                            "value": "7",
                            "criteriaId": "19356874",
                            "criteriaLabel": "Objective C:  Producing text"
                        },
                        {
                            "id": "295429536068146060",
                            "value": "8",
                            "criteriaId": "19356875",
                            "criteriaLabel": "Objective D: Using language"
                        },
                        {
                            "id": "295429547636036493",
                            "value": "2",
                            "criteriaId": "19257718",
                            "criteriaLabel": "Objective A: Evaluating"
                        },
                        {
                            "id": "295429563683443598",
                            "value": "7",
                            "criteriaId": "19257719",
                            "criteriaLabel": "Objective B: Synthesizing"
                        },
                        {
                            "id": "295429578153792399",
                            "value": "0",
                            "criteriaId": "19257720",
                            "criteriaLabel": "Objective C: Reflecting"
                        }
                    ]
                }
            },
            {
                "assignmentTitle": "all tools and goals",
                "assignmentType": "fmt",
                "studentName": "Reed Richards",
                "studentId": "277636828486444314",
                "evaluatedAt": null,
                "evaluationSharedAt": null,
                "assignmentId": "289239918977228728",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {
                    "score": [
                        {
                            "id": "289240067786935999",
                            "value": "25",
                            "maxScore": "100"
                        }
                    ],
                    "remark": [
                        {
                            "id": "289240078717294814",
                            "message": "test comment"
                        }
                    ],
                    "rubric": [
                        {
                            "id": "289239989303115908",
                            "value": "Begin",
                            "toolType": "RUBRIC",
                            "criteriaLabel": "Beginning",
                            "indicatorLabel": "Description 1",
                            "assessmentToolId": "289239595189550147"
                        },
                        {
                            "id": "289240032357646469",
                            "value": "Begin",
                            "toolType": "RUBRIC",
                            "criteriaLabel": "Beginning",
                            "indicatorLabel": "Description 2",
                            "assessmentToolId": "289239595189550147"
                        }
                    ],
                    "checklist": [
                        {
                            "id": "289240053702459527",
                            "value": "No",
                            "toolType": "CHECKLIST",
                            "allOptions": [
                                {
                                    "id": "289239784440734007",
                                    "label": "No"
                                },
                                {
                                    "id": "289239784436539702",
                                    "label": "Yes"
                                }
                            ],
                            "assessmentToolId": "289239784474290450",
                            "checklistItemLabel": "List"
                        }
                    ],
                    "singlePointRubric": [
                        {
                            "id": "289240050963579014",
                            "value": "hi",
                            "toolType": "SINGLE_POINT_RUBRIC",
                            "criteriaLabel": "Title",
                            "standardLabel": "Concerns",
                            "assessmentToolId": "289239639439445553",
                            "criteriaSubLabel": "And if that diamond ring turn brass,\nPapa’s gonna buy you a looking glass.\n",
                            "standardSubLabel": "Areas that need work"
                        }
                    ]
                }
            }
        ],
        "pageInfo": {
            "hasNextPage": false,
            "hasPreviousPage": false,
            "startCursor": "Mjc3NjM3NDk5MTg5MjAyMDUz",
            "endCursor": "Mjg5MjM5OTE4OTk4MTk1MDA4"
        },
        "totalCount": 2
    }
}
```

### Get Student Assignment By Student Id
Method: `GET`
Path: `/public/v2/student-assignments/:id`
Base URL: `https://ap-southeast-1-production-apis.toddleapp.com`
Full URL: `https://ap-southeast-1-production-apis.toddleapp.com/public/v2/student-assignments/:id`

Description:
Fetches complete information for a single student assignment, including assignment metadata, student details, submission status, and related grading information, identified by the provided student ID.

Auth: Bearer token (`Authorization: Bearer <token>`)

Path Parameters:
| Name | Example | Description |
| --- | --- | --- |
| id | 299418884715319919 | Unique Identifier of the Student |

Example Request (cURL):
```bash
curl -X GET "https://ap-southeast-1-production-apis.toddleapp.com/public/v2/student-assignments/:id" \
  -H "Authorization: Bearer <token>"
```

Response Examples:
Status: 200 OK
```json
{
    "response": {
        "edges": [
            {
                "assignmentTitle": "tera",
                "assignmentType": "smt",
                "studentName": "Arohi Mehra",
                "studentId": "299418884715319919",
                "evaluatedAt": null,
                "evaluationSharedAt": null,
                "assignmentId": "304862478192360579",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {
                    "score": [],
                    "scoreBasedRubric": []
                }
            },
            {
                "assignmentTitle": "🌿 Photosynthesis Explorer",
                "assignmentType": "ai_tutor",
                "studentName": "Arohi Mehra",
                "studentId": "299418884715319919",
                "evaluatedAt": null,
                "evaluationSharedAt": null,
                "assignmentId": "322534284621513897",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {}
            },
            {
                "assignmentTitle": "myp rubric",
                "assignmentType": "fmt",
                "studentName": "Arohi Mehra",
                "studentId": "299418884715319919",
                "evaluatedAt": "12-01-2026 11:35:34",
                "evaluationSharedAt": null,
                "assignmentId": "324837101579273626",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {
                    "mypObjectiveRubricRating": [],
                    "mypObjectiveCriteriaRating": [
                        {
                            "id": "337449779300677230",
                            "value": "2",
                            "criteriaId": "19356911",
                            "criteriaLabel": "Objective B: Organizing"
                        },
                        {
                            "id": "337449791921337968",
                            "value": "2",
                            "criteriaId": "19356871",
                            "criteriaLabel": "Objective A: Analysing"
                        }
                    ]
                }
            },
            {
                "assignmentTitle": "Ashwani Testing 1.0",
                "assignmentType": "fmt",
                "studentName": "Arohi Mehra",
                "studentId": "299418884715319919",
                "evaluatedAt": "26-12-2025 08:23:10",
                "evaluationSharedAt": "29-12-2025 10:01:28",
                "assignmentId": "330098036485130293",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {
                    "score": [
                        {
                            "id": "330441606106716065",
                            "value": "99",
                            "maxScore": "100"
                        }
                    ],
                    "remark": [
                        {
                            "id": "330572841130923189",
                            "message": "Perfect Ashwani !!"
                        }
                    ],
                    "rubric": [
                        {
                            "id": "331193044650960377",
                            "value": "Demonstrates limited understanding of key features of Cubism",
                            "toolType": "RUBRIC",
                            "criteriaLabel": "Accomplished",
                            "indicatorLabel": "Understanding of Cubism",
                            "assessmentToolId": "331192815495152612"
                        },
                        {
                            "id": "331193051781277179",
                            "value": "Writes a critique with some reference to Cubism techniques",
                            "toolType": "RUBRIC",
                            "criteriaLabel": "Developing",
                            "indicatorLabel": "Critique Writing",
                            "assessmentToolId": "331192815495152612"
                        },
                        {
                            "id": "331193048094483962",
                            "value": "Analyzes the selected artwork effectively using all key features of Cubism",
                            "toolType": "RUBRIC",
                            "criteriaLabel": "Exemplary",
                            "indicatorLabel": "Analysis of Artwork",
                            "assessmentToolId": "331192815495152612"
                        },
                        {
                            "id": "331193057036740092",
                            "value": "Creates a highly creative artwork effectively using all key features of Cubism",
                            "toolType": "RUBRIC",
                            "criteriaLabel": "Exemplary",
                            "indicatorLabel": "Application of Knowledge (Optional)",
                            "assessmentToolId": "331192815495152612"
                        }
                    ],
                    "checklist": [
                        {
                            "id": "331188108445885934",
                            "value": "Yes",
                            "toolType": "CHECKLIST",
                            "allOptions": [
                                {
                                    "id": "331188011255471522",
                                    "label": "No"
                                },
                                {
                                    "id": "331188011247082913",
                                    "label": "Yes"
                                }
                            ],
                            "assessmentToolId": "331188011314185508",
                            "checklistItemLabel": "List"
                        }
                    ],
                    "gradeScaleTool": [
                        {
                            "label": "Very Good",
                            "abbreviation": "A",
                            "gradeScaleId": "286365418627530816",
                            "gradeScaleLabel": "A-E scale"
                        }
                    ],
                    "singlePointRubric": [
                        {
                            "id": "331240970907559422",
                            "value": "Ok1",
                            "toolType": "SINGLE_POINT_RUBRIC",
                            "criteriaLabel": "Beginning",
                            "standardLabel": "Concerns",
                            "assessmentToolId": "331192907979560592",
                            "criteriaSubLabel": "Able to do",
                            "standardSubLabel": "Areas that need work"
                        },
                        {
                            "id": "331240994903172608",
                            "value": "yes1",
                            "toolType": "SINGLE_POINT_RUBRIC",
                            "criteriaLabel": "Intermiediate",
                            "standardLabel": "Concerns",
                            "assessmentToolId": "331192907979560592",
                            "criteriaSubLabel": "Done",
                            "standardSubLabel": "Areas that need work"
                        },
                        {
                            "id": "331240979564602879",
                            "value": "ok2",
                            "toolType": "SINGLE_POINT_RUBRIC",
                            "criteriaLabel": "Beginning",
                            "standardLabel": "Advanced",
                            "assessmentToolId": "331192907979560592",
                            "criteriaSubLabel": "Able to do",
                            "standardSubLabel": "Evidence of Exceeding Standards"
                        },
                        {
                            "id": "331241005414098433",
                            "value": "yes2",
                            "toolType": "SINGLE_POINT_RUBRIC",
                            "criteriaLabel": "Intermiediate",
                            "standardLabel": "Advanced",
                            "assessmentToolId": "331192907979560592",
                            "criteriaSubLabel": "Done",
                            "standardSubLabel": "Evidence of Exceeding Standards"
                        },
                        {
                            "id": "331241027518080515",
                            "value": "good2",
                            "toolType": "SINGLE_POINT_RUBRIC",
                            "criteriaLabel": "Advanced",
                            "standardLabel": "Advanced",
                            "assessmentToolId": "331192907979560592",
                            "criteriaSubLabel": "Excellent",
                            "standardSubLabel": "Evidence of Exceeding Standards"
                        },
                        {
                            "id": "331241016239597058",
                            "value": "good1",
                            "toolType": "SINGLE_POINT_RUBRIC",
                            "criteriaLabel": "Advanced",
                            "standardLabel": "Concerns",
                            "assessmentToolId": "331192907979560592",
                            "criteriaSubLabel": "Excellent",
                            "standardSubLabel": "Areas that need work"
                        }
                    ],
                    "mypObjectiveRubricRating": [
                        {
                            "id": "330589046642320863",
                            "value": "7-8",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356871",
                            "criteriaLabel": "Objective A: Analysing",
                            "objectiveLabel": "identify and comment upon significant aspects of texts",
                            "assessmentToolId": "330588822632932512"
                        },
                        {
                            "id": "330589050224256480",
                            "value": "5-6",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356871",
                            "criteriaLabel": "Objective A: Analysing",
                            "objectiveLabel": "identify and comment upon the creator’s choices",
                            "assessmentToolId": "330588822632932512"
                        },
                        {
                            "id": "330589054892516833",
                            "value": "3-4",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356871",
                            "criteriaLabel": "Objective A: Analysing",
                            "objectiveLabel": "justify opinions and ideas, using examples, explanations and terminology",
                            "assessmentToolId": "330588822632932512"
                        },
                        {
                            "id": "330589058960991714",
                            "value": "1-2",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356871",
                            "criteriaLabel": "Objective A: Analysing",
                            "objectiveLabel": "identify similarities and differences in features within and between texts.",
                            "assessmentToolId": "330588822632932512"
                        },
                        {
                            "id": "331177014591497703",
                            "value": "5-6",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356911",
                            "criteriaLabel": "Objective B: Organizing",
                            "objectiveLabel": "organize opinions and ideas in a logical manner",
                            "assessmentToolId": "331176835461162145"
                        },
                        {
                            "id": "331177019247175144",
                            "value": "7-8",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356911",
                            "criteriaLabel": "Objective B: Organizing",
                            "objectiveLabel": "use referencing and formatting tools to create a presentation style suitable to the context and intention.",
                            "assessmentToolId": "331176835461162145"
                        },
                        {
                            "id": "330557430817629634",
                            "value": "5-6",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356874",
                            "criteriaLabel": "Objective C:  Producing text",
                            "objectiveLabel": "produce texts that demonstrate thought and imagination while exploring new perspectives and ideas arising from personal engagement with the creative process",
                            "assessmentToolId": "330556166356608159"
                        },
                        {
                            "id": "330557504511550915",
                            "value": "1-2",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356874",
                            "criteriaLabel": "Objective C:  Producing text",
                            "objectiveLabel": "make stylistic choices in terms of linguistic, literary and visual devices, demonstrating awareness of impact on an audience",
                            "assessmentToolId": "330556166356608159"
                        },
                        {
                            "id": "330557520579929540",
                            "value": "5-6",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356874",
                            "criteriaLabel": "Objective C:  Producing text",
                            "objectiveLabel": "select relevant details and examples to support ideas.",
                            "assessmentToolId": "330556166356608159"
                        },
                        {
                            "id": "331186166395053549",
                            "value": "0",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356875",
                            "criteriaLabel": "Objective D: Using language",
                            "objectiveLabel": "use appropriate and varied vocabulary, sentence structures and forms of expression",
                            "assessmentToolId": "331185996651570338"
                        },
                        {
                            "id": "331186161559021036",
                            "value": "7-8",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356875",
                            "criteriaLabel": "Objective D: Using language",
                            "objectiveLabel": "write and speak in an appropriate register and style",
                            "assessmentToolId": "331185996651570338"
                        },
                        {
                            "id": "331186159495423467",
                            "value": "5-6",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356875",
                            "criteriaLabel": "Objective D: Using language",
                            "objectiveLabel": "use correct grammar, syntax and punctuation",
                            "assessmentToolId": "331185996651570338"
                        },
                        {
                            "id": "331186153417876970",
                            "value": "0",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356875",
                            "criteriaLabel": "Objective D: Using language",
                            "objectiveLabel": "spell (alphabetic languages), write (character languages) and pronounce with accuracy",
                            "assessmentToolId": "331185996651570338"
                        },
                        {
                            "id": "331186150200845801",
                            "value": "7-8",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356875",
                            "criteriaLabel": "Objective D: Using language",
                            "objectiveLabel": "use appropriate non-verbal communication techniques.",
                            "assessmentToolId": "331185996651570338"
                        }
                    ],
                    "mypObjectiveCriteriaRating": [
                        {
                            "id": "330557559817641582",
                            "value": "7",
                            "criteriaId": "19356874",
                            "criteriaLabel": "Objective C:  Producing text"
                        },
                        {
                            "id": "330589064510054122",
                            "value": "2",
                            "criteriaId": "19356871",
                            "criteriaLabel": "Objective A: Analysing"
                        },
                        {
                            "id": "331177032291458934",
                            "value": "0",
                            "criteriaId": "19356911",
                            "criteriaLabel": "Objective B: Organizing"
                        },
                        {
                            "id": "331186137861201786",
                            "value": "3",
                            "criteriaId": "19356875",
                            "criteriaLabel": "Objective D: Using language"
                        }
                    ]
                }
            },
            {
                "assignmentTitle": "Ashwani doing score test",
                "assignmentType": "fmt",
                "studentName": "Arohi Mehra",
                "studentId": "299418884715319919",
                "evaluatedAt": "26-12-2025 08:32:30",
                "evaluationSharedAt": "26-12-2025 08:29:49",
                "assignmentId": "330430126355384436",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {
                    "score": [
                        {
                            "id": "331243373396500521",
                            "value": "2",
                            "maxScore": "4"
                        }
                    ],
                    "scoreBasedRubric": [
                        {
                            "id": "331243372406646277",
                            "value": 2,
                            "criteria": "CRITERION ",
                            "toolType": "SCORE_BASED_RUBRIC",
                            "descriptor": "",
                            "criteriaDescription": ""
                        }
                    ]
                }
            },
            {
                "assignmentTitle": "Ashwani Testing 2.0",
                "assignmentType": "smt",
                "studentName": "Arohi Mehra",
                "studentId": "299418884715319919",
                "evaluatedAt": "26-12-2025 10:32:51",
                "evaluationSharedAt": "26-12-2025 09:55:10",
                "assignmentId": "331249629549037792",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {
                    "gradeScaleTool": [
                        {
                            "label": "Poor",
                            "abbreviation": "D",
                            "gradeScaleId": "286365418627530816",
                            "gradeScaleLabel": "A-E scale"
                        },
                        {
                            "label": "Average",
                            "abbreviation": "C",
                            "gradeScaleId": "286365418627530816",
                            "gradeScaleLabel": "A-E scale"
                        }
                    ],
                    "standardBasedRubric": [
                        {
                            "label": "Good",
                            "criteriaId": "286366119852250945",
                            "abbreviation": "B",
                            "criteriaLabel": "Sing to match pitch.",
                            "gradeScaleId": "286365418627530816",
                            "gradeScaleLabel": "A-E scale"
                        }
                    ]
                }
            },
            {
                "assignmentTitle": "Checking comment",
                "assignmentType": "smt",
                "studentName": "Arohi Mehra",
                "studentId": "299418884715319919",
                "evaluatedAt": "10-01-2026 08:12:48",
                "evaluationSharedAt": null,
                "assignmentId": "336669470288251782",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {
                    "score": [
                        {
                            "id": "336674210166355073",
                            "value": "37",
                            "maxScore": "40"
                        }
                    ],
                    "remark": [],
                    "scoreBasedRubric": [
                        {
                            "id": "336674208668986011",
                            "value": 2,
                            "criteria": "Understanding of Cubism",
                            "toolType": "SCORE_BASED_RUBRIC",
                            "descriptor": "Demonstrates limited understanding of key features of Cubism"
                        },
                        {
                            "id": "336674217372166813",
                            "value": 12,
                            "criteria": "Critique Writing",
                            "toolType": "SCORE_BASED_RUBRIC",
                            "descriptor": "Writes an insightful critique with comprehensive references to Cubism techniques"
                        },
                        {
                            "id": "336674212724877980",
                            "value": 7,
                            "criteria": "Analysis of Artwork",
                            "toolType": "SCORE_BASED_RUBRIC",
                            "descriptor": "Analyzes the selected artwork using most Cubism features effectively"
                        },
                        {
                            "id": "336674224653478558",
                            "value": 16,
                            "criteria": "Application of Knowledge (Optional)",
                            "toolType": "SCORE_BASED_RUBRIC",
                            "descriptor": "Creates a highly creative artwork effectively using all key features of Cubism"
                        }
                    ]
                }
            },
            {
                "assignmentTitle": "testing 1.00",
                "assignmentType": "assessment",
                "studentName": "Arohi Mehra",
                "studentId": "299418884715319919",
                "evaluatedAt": "27-01-2026 05:59:16",
                "evaluationSharedAt": "27-01-2026 05:59:27",
                "assignmentId": "342799698047798817",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {
                    "remark": [
                        {
                            "id": "342801170693102544",
                            "message": "good work"
                        }
                    ]
                }
            },
            {
                "assignmentTitle": "testing 2.00",
                "assignmentType": "assessment",
                "studentName": "Arohi Mehra",
                "studentId": "299418884715319919",
                "evaluatedAt": null,
                "evaluationSharedAt": null,
                "assignmentId": "342814213200154148",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {
                    "gradeScaleTool": []
                }
            },
            {
                "assignmentTitle": "Yogesh test 1",
                "assignmentType": "assessment",
                "studentName": "Arohi Mehra",
                "studentId": "299418884715319919",
                "evaluatedAt": null,
                "evaluationSharedAt": null,
                "assignmentId": "342819186705174055",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {
                    "score": [],
                    "remark": [],
                    "gradeScaleTool": []
                }
            },
            {
                "assignmentTitle": "Yogesh tets 2",
                "assignmentType": "assessment",
                "studentName": "Arohi Mehra",
                "studentId": "299418884715319919",
                "evaluatedAt": null,
                "evaluationSharedAt": null,
                "assignmentId": "342819715523022376",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {}
            },
            {
                "assignmentTitle": "yogest test 3",
                "assignmentType": "assessment",
                "studentName": "Arohi Mehra",
                "studentId": "299418884715319919",
                "evaluatedAt": null,
                "evaluationSharedAt": null,
                "assignmentId": "342820351996071466",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {}
            },
            {
                "assignmentTitle": "Test Homwork",
                "assignmentType": "quick_task",
                "studentName": "Arohi Mehra",
                "studentId": "299418884715319919",
                "evaluatedAt": null,
                "evaluationSharedAt": null,
                "assignmentId": "342873090729971246",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {}
            },
            {
                "assignmentTitle": "Test HW",
                "assignmentType": "quick_task",
                "studentName": "Arohi Mehra",
                "studentId": "299418884715319919",
                "evaluatedAt": null,
                "evaluationSharedAt": null,
                "assignmentId": "342880077278613042",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {}
            },
            {
                "assignmentTitle": "Test LE",
                "assignmentType": "learning engagement",
                "studentName": "Arohi Mehra",
                "studentId": "299418884715319919",
                "evaluatedAt": null,
                "evaluationSharedAt": null,
                "assignmentId": "342880243192696371",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {}
            },
            {
                "assignmentTitle": "Test Homework 2",
                "assignmentType": "quick_task",
                "studentName": "Arohi Mehra",
                "studentId": "299418884715319919",
                "evaluatedAt": null,
                "evaluationSharedAt": null,
                "assignmentId": "342881003628400182",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {}
            },
            {
                "assignmentTitle": "Test HW",
                "assignmentType": "quick_task",
                "studentName": "Arohi Mehra",
                "studentId": "299418884715319919",
                "evaluatedAt": null,
                "evaluationSharedAt": null,
                "assignmentId": "342882077995175479",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {}
            },
            {
                "assignmentTitle": "Test FA",
                "assignmentType": "assessment",
                "studentName": "Arohi Mehra",
                "studentId": "299418884715319919",
                "evaluatedAt": null,
                "evaluationSharedAt": null,
                "assignmentId": "342883399498731064",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {}
            },
            {
                "assignmentTitle": "yogesh for1",
                "assignmentType": "assessment",
                "studentName": "Arohi Mehra",
                "studentId": "299418884715319919",
                "evaluatedAt": "28-01-2026 06:41:27",
                "evaluationSharedAt": "28-01-2026 06:34:21",
                "assignmentId": "343167119375994471",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {
                    "score": [
                        {
                            "id": "343173395728304410",
                            "value": "233",
                            "maxScore": "333"
                        }
                    ],
                    "mypObjectiveRubricRating": [
                        {
                            "id": "343171817092952155",
                            "value": "0",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356871",
                            "criteriaLabel": "Objective A: Analysing",
                            "objectiveLabel": "identify and comment upon the creator’s choices",
                            "assessmentToolId": "343166902417237730"
                        },
                        {
                            "id": "343171819093635164",
                            "value": "1-2",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356871",
                            "criteriaLabel": "Objective A: Analysing",
                            "objectiveLabel": "justify opinions and ideas, using examples, explanations and terminology",
                            "assessmentToolId": "343166902417237730"
                        }
                    ],
                    "mypObjectiveCriteriaRating": [
                        {
                            "id": "343173267059640599",
                            "value": "4",
                            "criteriaId": "19356911",
                            "criteriaLabel": "Objective B: Organizing"
                        }
                    ]
                }
            },
            {
                "assignmentTitle": "yog for 2",
                "assignmentType": "assessment",
                "studentName": "Arohi Mehra",
                "studentId": "299418884715319919",
                "evaluatedAt": null,
                "evaluationSharedAt": null,
                "assignmentId": "343175002377424490",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {
                    "mypObjectiveRubricRating": [
                        {
                            "id": "343175135076823148",
                            "value": "1-2",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356911",
                            "criteriaLabel": "Objective B: Organizing",
                            "objectiveLabel": "organize opinions and ideas in a logical manner",
                            "assessmentToolId": "343174945024517859"
                        },
                        {
                            "id": "343175138625204333",
                            "value": "3-4",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356911",
                            "criteriaLabel": "Objective B: Organizing",
                            "objectiveLabel": "use referencing and formatting tools to create a presentation style suitable to the context and intention.",
                            "assessmentToolId": "343174945024517859"
                        }
                    ],
                    "mypObjectiveCriteriaRating": [
                        {
                            "id": "343175145378023714",
                            "value": "2",
                            "criteriaId": "19356911",
                            "criteriaLabel": "Objective B: Organizing"
                        }
                    ]
                }
            },
            {
                "assignmentTitle": "yog for 3",
                "assignmentType": "assessment",
                "studentName": "Arohi Mehra",
                "studentId": "299418884715319919",
                "evaluatedAt": "28-01-2026 06:46:31",
                "evaluationSharedAt": null,
                "assignmentId": "343175350664040043",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {
                    "mypObjectiveRubricRating": [
                        {
                            "id": "343175412915908718",
                            "value": "1-2",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356871",
                            "criteriaLabel": "Objective A: Analysing",
                            "objectiveLabel": "identify and comment upon significant aspects of texts",
                            "assessmentToolId": "343175271030990564"
                        },
                        {
                            "id": "343175416774668399",
                            "value": "3-4",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356871",
                            "criteriaLabel": "Objective A: Analysing",
                            "objectiveLabel": "identify and comment upon the creator’s choices",
                            "assessmentToolId": "343175271030990564"
                        },
                        {
                            "id": "343175422680248440",
                            "value": "1-2",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356911",
                            "criteriaLabel": "Objective B: Organizing",
                            "objectiveLabel": "organize opinions and ideas in a logical manner",
                            "assessmentToolId": "343175271030990564"
                        },
                        {
                            "id": "343175430041251962",
                            "value": "1-2",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356911",
                            "criteriaLabel": "Objective B: Organizing",
                            "objectiveLabel": "use referencing and formatting tools to create a presentation style suitable to the context and intention.",
                            "assessmentToolId": "343175271030990564"
                        }
                    ],
                    "mypObjectiveCriteriaRating": [
                        {
                            "id": "343175432977254691",
                            "value": "5",
                            "criteriaId": "19356911",
                            "criteriaLabel": "Objective B: Organizing"
                        },
                        {
                            "id": "343175498710386980",
                            "value": "4",
                            "criteriaId": "19356871",
                            "criteriaLabel": "Objective A: Analysing"
                        }
                    ]
                }
            },
            {
                "assignmentTitle": "Rating Issue",
                "assignmentType": "assessment",
                "studentName": "Arohi Mehra",
                "studentId": "299418884715319919",
                "evaluatedAt": "28-01-2026 07:06:15",
                "evaluationSharedAt": null,
                "assignmentId": "343180390887853680",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {
                    "mypObjectiveRubricRating": [
                        {
                            "id": "343180445845827727",
                            "value": "1-2",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356871",
                            "criteriaLabel": "Objective A: Analysing",
                            "objectiveLabel": "identify and comment upon significant aspects of texts",
                            "assessmentToolId": "343180270368728805"
                        },
                        {
                            "id": "343180450610557072",
                            "value": "3-4",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356871",
                            "criteriaLabel": "Objective A: Analysing",
                            "objectiveLabel": "identify and comment upon the creator’s choices",
                            "assessmentToolId": "343180270368728805"
                        },
                        {
                            "id": "343180462153281681",
                            "value": "1-2",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356911",
                            "criteriaLabel": "Objective B: Organizing",
                            "objectiveLabel": "organize opinions and ideas in a logical manner",
                            "assessmentToolId": "343180270368728805"
                        },
                        {
                            "id": "343180706920280214",
                            "value": "3-4",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356911",
                            "criteriaLabel": "Objective B: Organizing",
                            "objectiveLabel": "use referencing and formatting tools to create a presentation style suitable to the context and intention.",
                            "assessmentToolId": "343180270368728805"
                        }
                    ],
                    "mypObjectiveCriteriaRating": [
                        {
                            "id": "343180456163805488",
                            "value": "4",
                            "criteriaId": "19356871",
                            "criteriaLabel": "Objective A: Analysing"
                        }
                    ]
                }
            },
            {
                "assignmentTitle": "for yog issue",
                "assignmentType": "assessment",
                "studentName": "Arohi Mehra",
                "studentId": "299418884715319919",
                "evaluatedAt": "29-01-2026 07:56:08",
                "evaluationSharedAt": null,
                "assignmentId": "343553849363009243",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {
                    "mypObjectiveRubricRating": [
                        {
                            "id": "343553991176631243",
                            "value": "1-2",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356871",
                            "criteriaLabel": "Objective A: Analysing",
                            "objectiveLabel": "identify and comment upon significant aspects of texts",
                            "assessmentToolId": "343553718735611686"
                        },
                        {
                            "id": "343555390534857678",
                            "value": "3-4",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356911",
                            "criteriaLabel": "Objective B: Organizing",
                            "objectiveLabel": "organize opinions and ideas in a logical manner",
                            "assessmentToolId": "343553718735611686"
                        },
                        {
                            "id": "343555394238428111",
                            "value": "1-2",
                            "toolType": "MYP_OBJECTIVE_RUBRIC",
                            "criteriaId": "19356911",
                            "criteriaLabel": "Objective B: Organizing",
                            "objectiveLabel": "use referencing and formatting tools to create a presentation style suitable to the context and intention.",
                            "assessmentToolId": "343553718735611686"
                        }
                    ],
                    "mypObjectiveCriteriaRating": [
                        {
                            "id": "343554001788210474",
                            "value": "8",
                            "criteriaId": "19356871",
                            "criteriaLabel": "Objective A: Analysing"
                        },
                        {
                            "id": "343555399829425452",
                            "value": "3",
                            "criteriaId": "19356911",
                            "criteriaLabel": "Objective B: Organizing"
                        }
                    ]
                }
            },
            {
                "assignmentTitle": "📜 Sonnet Time Machine",
                "assignmentType": "ai_tutor",
                "studentName": "Arohi Mehra",
                "studentId": "299418884715319919",
                "evaluatedAt": null,
                "evaluationSharedAt": null,
                "assignmentId": "343733298796695300",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {}
            },
            {
                "assignmentTitle": "This is a Test LE",
                "assignmentType": "learning engagement",
                "studentName": "Arohi Mehra",
                "studentId": "299418884715319919",
                "evaluatedAt": null,
                "evaluationSharedAt": null,
                "assignmentId": "343740190432431877",
                "academicTermId": "277634214763957306",
                "academicTermName": "Term 1",
                "assessmentToolData": {}
            }
        ]
    }
}
```
