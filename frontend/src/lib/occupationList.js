// frontend/src/lib/occupationList.js

// List *without* "Other"
const mainOccupations = [
  { value: "Software Engineer", label: "Software Engineer" },
  { value: "Student", label: "Student" },
  { value: "Marketing Manager", label: "Marketing Manager" },
  { value: "Graphic Designer", label: "Graphic Designer" },
  { value: "Doctor", label: "Doctor" },
  { value: "Teacher", label: "Teacher" },
  { value: "Accountant", label: "Accountant" },
  { value: "Data Analyst", label: "Data Analyst" },
  { value: "Project Manager", label: "Project Manager" },
  { value: "Sales Executive", label: "Sales Executive" },
  { value: "Nurse", label: "Nurse" },
  { value: "Architect", label: "Architect" },
  { value: "Lawyer", label: "Lawyer" },
  { value: "Chef", label: "Chef" },
  { value: "Writer", label: "Writer" },
  { value: "Artist", label: "Artist" },
  { value: "Consultant", label: "Consultant" },
  { value: "Customer Service", label: "Customer Service" },
  { value: "Digital Marketing", label: "Digital Marketing" },
  { value: "Entrepreneur", label: "Entrepreneur" },
  { value: "Financial Analyst", label: "Financial Analyst" },
  { value: "Human Resources", label: "Human Resources" },
  { value: "Interior Designer", label: "Interior Designer" },
  { value: "Mechanic", label: "Mechanic" },
];

// 1. Sort the main list alphabetically
const sortedOccupations = mainOccupations.sort((a, b) => a.label.localeCompare(b.label));

// 2. Add "Other" to the end
sortedOccupations.push({ value: "Other", label: "Other" });

// 3. Export the final list
export const occupations = sortedOccupations;