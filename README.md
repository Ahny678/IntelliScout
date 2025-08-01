# 📄 IntelliScout

## Effortless Resume Parsing & Smart Job Matching with GPT-4.1, BullMQ, and Rapid API

---

### 🚀 Introduction

**IntelliScout** is an intelligent resume processing and job-matching backend built with NestJS, BullMQ, TypeORM, GPT-4.1 (via Azure OpenAI), and the RapidAPI Job Search API. It automates resume parsing using LLMs, calculates job match scores using a custom scoring algorithm, and notifies users via email—all while leveraging caching, authentication, and scalable job queues.

Ideal for recruitment platforms, HR tools, or job boards looking to streamline candidate intake and recommendation workflows.

---

### 📊 Architecture Overview

```plaintext
User Uploads Resume
        |
        v
 BullMQ Queue (process-resume)
        |
        v
 ResumeService → GPT-4.1 (Azure) → ClassTransformer
        |
        v
 Email Notification (On Success)
        |
        v
  TypeORM → Postgres DB
        |
        v
 JobService → RapidAPI → Job Matching + Scoring
        |
        v
 Cache (If Query is Empty)

```

---

### ⚙️ Installation (for End Users)

```bash
# Clone the repository
git clone https://github.com/your-username/intelliscout.git
cd intelliscout

# Install dependencies
npm install

# Set up your environment
cp .env.example .env
# Add your values to the .env file

# Start the application
npm run start:dev
```

---

### 🛠️ Installation (for Contributors/Developers)

```bash
# Install dependencies
npm install

# Run code linting
npm run lint

# Run tests
npm run test

# Compile TypeScript
npm run build

# Launch Swagger docs
# Available at http://localhost:<port>/api/
```

---

### 🤝 Contributing

We welcome contributions! Please follow these expectations:

- 🔧 Write clean, modular TypeScript (NestJS style guide)
- 🧪 Include unit tests for new features
- 📝 Document endpoints in Swagger decorators
- 🚀 Prefer async/await over callbacks
- ✅ Validate DTOs with `class-validator`

To get started:

1. Fork the repo
2. Create a branch: `feature/my-feature`
3. Open a PR with clear descriptions

---

### ⚠️ Known Issues

- ❗ GPT sometimes returns malformed JSON which causes parsing failures.
- ⌛ Resume processing fails silently if job queue or mailing fails.
- 🐞 Retry queue or fallback email notifications are not implemented yet.

---

## 🧠 Key Features Recap

- ✅ **Resume Parsing with GPT-4.1**: Uses Azure-hosted GPT model to extract structured data from resumes.
- 🧾 **Job Matching**: Fetches and ranks jobs based on resume content using RapidAPI.
- 📬 **Email Notification**: Sends confirmation emails post-successful resume processing.
- 🔐 **JWT Authentication**: Secure APIs with route-based guards.
- ⚙️ **Worker Queue (BullMQ)**: Processes resumes in background for scalability.
- 🗃️ **Caching**: Uses NestJS cache-manager for optimized job fetch.
- 📚 **Swagger Docs**: Auto-generated API documentation.
