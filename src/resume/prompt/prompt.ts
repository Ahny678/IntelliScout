export const promptText = `Extract the following structured information from this resume text and return it in a JSON object. Use the following fields:

{
  "name": string,
  "currentJobTitle": string,
  "yearsOfExperience": number,
  "skills": string[],
  "highestEducationLevel": string,
  "education": [
    {
      "degree": string,
      "field": string,
      "institution": string,
      "graduationYear": number
    }
  ],
  "workExperience": [
    {
      "title": string,
      "company": string,
      "startYear": number,
      "endYear": number,
      "industry": string
    }
  ],
  "certifications": string[],
  "desiredSalary": number
}

Resume Text:
`;
