import { Resume } from 'src/resume/entities/resume.entity';

interface Job {
  title?: string;
  description?: string;
  skills?: string[];
  [key: string]: any;
}

export function computeMatchScore(job: Job, resume: Resume): number {
  const resumeSkills = resume.skills || [];
  const resumeTitle = resume.currentJobTitle?.toLowerCase() || '';
  const resumeCerts = resume.certifications || [];
  const jobTitle = job.title?.toLowerCase() || '';
  const jobDesc = job.description?.toLowerCase() || '';

  // Skill Match
  const matchedSkills = resumeSkills.filter((skill) =>
    jobDesc.includes(skill.toLowerCase()),
  );
  const skillScore = matchedSkills.length / (resumeSkills.length || 1);

  // Title Match
  const titleScore = jobTitle.includes(resumeTitle) ? 1 : 0;

  // Certification Match
  const certScore =
    resumeCerts.filter((cert) => jobDesc.includes(cert.toLowerCase())).length /
    (resumeCerts.length || 1);

  // Experience Score (basic heuristic)
  let experienceScore = 0;
  if (resume.yearsOfExperience && jobDesc) {
    const match = jobDesc.match(/(\d+)\s+year/);
    if (match && parseInt(match[1]) <= resume.yearsOfExperience) {
      experienceScore = 1;
    }
  }

  // Weighted score
  const finalScore =
    0.4 * skillScore +
    0.3 * titleScore +
    0.2 * certScore +
    0.1 * experienceScore;

  return parseFloat(finalScore.toFixed(2));
}

export function addMatchScores(jobs: Job[], resume: Resume): Job[] {
  return jobs.map((job) => ({
    ...job,
    match_score: computeMatchScore(job, resume),
  }));
}
