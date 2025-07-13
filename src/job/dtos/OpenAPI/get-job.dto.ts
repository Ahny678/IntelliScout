import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class JobResponseDto {
  /**
   * Job ID from the source site
   * @example "in-02f6dacbf43f7a18"
   */
  @ApiProperty()
  id: string;

  /**
   * Source of the job posting
   * @example "indeed"
   */
  @ApiProperty()
  site: string;

  /**
   * URL to the job listing on the original site
   * @example "https://www.indeed.com/viewjob?jk=02f6dacbf43f7a18"
   */
  @ApiProperty()
  job_url: string;

  /**
   * Direct link to the company’s application portal
   * @example "https://jobs.delekus.com/job/Odessa-People-Development-Partner-TX-79760/1299283400/?feedId=311100&utm_source=Indeed&utm_campaign=Delek_Indeed"
   */
  @ApiProperty()
  job_url_direct: string;

  /**
   * Job title
   * @example "People Development Partner"
   */
  @ApiProperty()
  title: string;

  /**
   * Hiring company name
   * @example "Delek US"
   */
  @ApiProperty()
  company: string;

  /**
   * Job location
   * @example "Odessa, TX, US"
   */
  @ApiProperty()
  location: string;

  /**
   * Date the job was posted
   * @example "2025-07-13"
   */
  @ApiProperty()
  date_posted: string;

  /**
   * Type of job (remote, onsite, hybrid, etc.)
   * @example ""
   */
  @ApiPropertyOptional()
  job_type: string;

  /**
   * Indicates the source of the salary info
   * @example "direct_data"
   */
  @ApiPropertyOptional()
  salary_source: string;

  /**
   * Payment interval (e.g., hourly, yearly)
   * @example "yearly"
   */
  @ApiPropertyOptional()
  interval: string;

  /**
   * Minimum salary amount
   * @example "33254.0"
   */
  @ApiPropertyOptional()
  min_amount: string;

  /**
   * Maximum salary amount
   * @example "40219.0"
   */
  @ApiPropertyOptional()
  max_amount: string;

  /**
   * Currency code
   * @example "USD"
   */
  @ApiPropertyOptional()
  currency: string;

  /**
   * Indicates if the job is remote
   * @example "False"
   */
  @ApiPropertyOptional()
  is_remote: string;

  /**
   * Level of the job (e.g., entry, senior)
   * @example ""
   */
  @ApiPropertyOptional()
  job_level: string;

  /**
   * Job function or department
   * @example ""
   */
  @ApiPropertyOptional()
  job_function: string;

  /**
   * Listing type (e.g., internal, external)
   * @example ""
   */
  @ApiPropertyOptional()
  listing_type: string;

  /**
   * Email contacts associated with the job post
   * @example ""
   */
  @ApiPropertyOptional()
  emails: string;

  /**
   * Full job description (HTML or plain text)
   * @example "**About OXXO USA**\\nAt OXXO USA, we’re on a mission to redefine..."
   */
  @ApiPropertyOptional()
  description: string;

  /**
   * Company industry
   * @example ""
   */
  @ApiPropertyOptional()
  company_industry: string;

  /**
   * Link to company profile on the job board
   * @example "https://www.indeed.com/cmp/Delek-US-Holdings"
   */
  @ApiPropertyOptional()
  company_url: string;

  /**
   * Company logo image URL
   * @example "https://d2q79iu7y748jz.cloudfront.net/s/_squarelogo/256x256/18e878f88e2e685b0ce69714f20d671a"
   */
  @ApiPropertyOptional()
  company_logo: string;

  /**
   * Link to the company’s official website
   * @example "http://www.delekus.com"
   */
  @ApiPropertyOptional()
  company_url_direct: string;

  /**
   * Company headquarters or main address
   * @example "Brentwood, TN"
   */
  @ApiPropertyOptional()
  company_addresses: string;

  /**
   * Company size (number of employees)
   * @example "1,001 to 5,000"
   */
  @ApiPropertyOptional()
  company_num_employees: string;

  /**
   * Company revenue
   * @example "more than $10B (USD)"
   */
  @ApiPropertyOptional()
  company_revenue: string;

  /**
   * Short company bio or description
   * @example "Delek US is a diversified downstream energy company..."
   */
  @ApiPropertyOptional()
  company_description: string;

  /**
   * Relevant skills mentioned in the job post
   * @example ""
   */
  @ApiPropertyOptional()
  skills: string;

  /**
   * Experience range required or suggested
   * @example ""
   */
  @ApiPropertyOptional()
  experience_range: string;

  /**
   * Company rating (e.g., from Glassdoor)
   * @example ""
   */
  @ApiPropertyOptional()
  company_rating: string;

  /**
   * Number of reviews the company has
   * @example ""
   */
  @ApiPropertyOptional()
  company_reviews_count: string;

  /**
   * Number of open vacancies for this job
   * @example ""
   */
  @ApiPropertyOptional()
  vacancy_count: string;

  /**
   * Work-from-home designation or type
   * @example ""
   */
  @ApiPropertyOptional()
  work_from_home_type: string;

  /**
   * Match score between resume and job
   * @example 0.23
   */
  @ApiPropertyOptional()
  match_score: number;
}
