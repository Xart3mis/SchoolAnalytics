Knowledge Bank
Domain: IB MYP School Analytics (Progress, Assessment, Attendance, Administration)

1. Institutional Context

School follows IB MYP (Middle Years Programme) structure.

Academic periods are Trimester-based (e.g., Trimester 1 – Term 1).

Grades span:

MYP 1 → MYP 5

Mapped internally as Year 1 → Year 5

2. Core Data Domains Identified
A. Student Identity & Enrollment

Canonical identifiers

Student UID (primary, human-readable, e.g. 1-0046)


Attributes

Full legal name

Email (sometimes present)

Year group / Batch (e.g., Batch of 2028)

Grade / Year / MYP Level


B. Academic Structure

Hierarchy

School
 └── MYP Level (MYP 1–5)
     └── Year (Year 1–5)
         └── Class (e.g., MYP 2A Arabic)
             └── Subject
                 └── Assessment Criteria


Class identifiers

Class IDs (TDC-* codes, sometimes multiple)

Human-readable class name (e.g., MYP 1A Arabic)

Subjects

Language & Literature (Arabic, English)

Language Acquisition (French)

Digital Design

Drama / Music

Others implicit

C. Assessment & Grading Model (IB MYP)

Criterion-based grading

Criterion A

Criterion B

Criterion C

Criterion D

Derived fields

Criteria total = sum(A–D)

Final grade = IB 1–7 scale

Local grade = optional / often empty

Important

Some subjects (e.g., Digital Design) may not produce grades every term

Analytics implications

Final grade must be derived, not assumed

Platform should support:

Criterion-level analytics

Subject difficulty normalization

Cross-year performance tracking

D. Attendance (Cumulative)

Metrics

Present %

Absent %

Late %

Excused late / absence %

Overall presence (often unused / zero)

Granularity

Per student

Per grading period

Per year

Edge cases

Some students show extreme absence (>30%)

Presence % must be recomputed carefully

Use cases

Attendance risk detection

Academic correlation

Automated alerts

3. Analytics Capabilities Enabled
Academic

Criterion-level weakness detection

Subject performance heatmaps

Grade progression over years

Teacher grading distribution analysis

Skills vs grades correlation

Attendance

Absence risk scoring

Attendance vs performance modeling

Administrative

4. Guidance for Codex Agent (Explicit)

When using this knowledge bank:

Always normalize Student UID

Treat grades as derived facts

Design analytics first, UI second

Assume future data will be messier, not cleaner

5. What This Platform Is (and Is Not)

IS

Internal analytics & insight platform

Decision-support tool for admins & educators

Longitudinal student intelligence system

IS NOT

LMS replacement

Grade entry system

Parent-facing reporting tool
