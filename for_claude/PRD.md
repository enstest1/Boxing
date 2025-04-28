Product Requirements Document: Rumble Boxing Music-Driven Combo Generator

Version: 1.1 (incorporating addendum)
Date: 2024-07-27
Status: Draft

1. Executive Summary

The Rumble Boxing Music-Driven Combo Generator is a web application designed to assist Rumble Boxing instructors in creating dynamic, engaging boxing combinations synchronized with the tempo and energy of their chosen music tracks. By uploading an MP3 file, instructors receive automatically generated combos tailored to the song's Beats Per Minute (BPM) and perceived energy levels. This tool aims to streamline class preparation, enhance the instructor's creative process, and ultimately deliver a more rhythmically consistent and motivating workout experience for Rumble members. The initial version focuses on core functionality: MP3 upload, BPM/energy analysis, and combo generation, with future iterations planned to include advanced features like batch processing and customizable intensity profiles.

2. Goals & Success Metrics

2.1. Goal 1: Streamline instructor class preparation time.
* Metric 1.1: Reduce average time spent creating combos per class by 25% within 3 months of launch (measured via instructor surveys).
* Metric 1.2: Achieve an average rating of 4.0/5.0 or higher on "Ease of Use" in instructor feedback surveys.

2.2. Goal 2: Enhance the quality and musicality of Rumble class programming.
* Metric 2.1: Achieve an average rating of 4.0/5.0 or higher on "Combo Quality & Relevance" in instructor feedback surveys.
* Metric 2.2: Track the number of unique songs analyzed and combos generated per active instructor per week (target: average > 3 songs/week).

2.3. Goal 3: Provide a reliable and performant tool for instructors.
* Metric 3.1: Maintain application uptime of > 99.5%.
* Metric 3.2: Ensure average analysis and combo generation time per track is under 30 seconds for files up to 10MB.
* Metric 3.3: Achieve a bug report rate of < 5 critical/high severity bugs per month post-launch stabilization.

3. User Personas & Key Use Cases

3.1. User Persona: Alex Chen, Rumble Instructor
* Background: Experienced Rumble instructor (2+ years), teaches 5-7 classes per week. Passionate about music and creating high-energy, motivating class experiences. Tech-savvy but time-constrained.
* Goals:
* Quickly find inspiration for boxing combinations that match the vibe and tempo of new music tracks.
* Reduce repetitive planning tasks to focus more on coaching technique and class energy.
* Ensure combos flow well and align with Rumble's standard punch numbering and style.
* Discover new ways to structure rounds based on song energy shifts.
* Frustrations:
* Spending hours listening to tracks repeatedly to map out combos manually.
* Hitting creative blocks when designing routines for multiple classes weekly.
* Ensuring combos are challenging but achievable and sync well with the beat.

3.2. Key Use Cases:
* Use Case 1: Generate Combos for a New Song: Alex uploads a newly discovered MP3 track intended for a specific round in their class. The application analyzes the track and suggests several 6-count and 8-count boxing combinations synchronized to the detected BPM and energy profile. Alex reviews the suggestions, perhaps regenerates a few, and incorporates them into their class plan.
* Use Case 2: Quick Inspiration: While planning a class, Alex feels stuck on a specific round. They upload the chosen song to the generator to get quick, relevant combo ideas based on its musical characteristics, jumpstarting their creative process.
* Use Case 3: Verify Song Tempo: Alex uploads a song they think is suitable for a speed round but wants to confirm the exact BPM before programming. The tool provides the BPM, confirming its suitability or prompting Alex to choose a different track.

4. Detailed Feature Specification

4.1. Upload MP3
* What: Allows authenticated instructors to upload a single MP3 audio file.
* Why: This is the primary input mechanism for the application, enabling the analysis of the instructor's chosen music.
* How:
1. User clicks an "Upload Song" button or drags/drops a file onto a designated area.
2. A standard file selection dialog appears.
3. User selects an MP3 file from their local machine.
4. Frontend performs basic validation (file type = MP3, size limit e.g., < 15MB).
5. File is securely uploaded to the backend via an API endpoint.
6. Frontend displays an uploading progress indicator.
7. Upon successful upload, the backend confirms receipt and initiates the analysis process. Error messages are displayed for failed uploads (size, type, server error).

4.2. BPM Detection
* What: Automatically analyzes the uploaded MP3 file to determine its primary Beats Per Minute (BPM).
* Why: BPM is crucial for synchronizing boxing combinations to the music's rhythm, ensuring combos feel natural and match the track's tempo.
* How:
1. Backend receives the uploaded MP3 file path (temporary storage).
2. A dedicated backend service utilizes a library (e.g., music-tempo) to process the audio data.
3. The library analyzes the audio waveform to detect dominant rhythmic patterns and calculates the BPM.
4. The calculated BPM value (e.g., 128.5) is stored, associated with the uploaded song analysis record.
5. Potential edge cases (variable BPM, detection errors) should return a best guess or a flag indicating uncertainty.

4.3. Energy Analysis
* What: Analyzes the uploaded MP3 file to determine segments of varying energy levels (e.g., low, medium, high).
* Why: Understanding the song's energy dynamics (e.g., build-ups, drops, verses, choruses) allows the generator to suggest combos with appropriate intensity and complexity for different song sections.
* How:
1. Backend service uses an audio analysis library (e.g., Meyda) to extract relevant audio features over time windows (e.g., every 1 second).
2. Features like Root Mean Square (RMS) energy, spectral centroid, spectral flux, and potentially others are calculated.
3. These features are processed (e.g., normalized, potentially using a simple classifier or thresholding logic) to assign an energy level (e.g., 1-Low, 2-Medium, 3-High) to each time segment.
4. The time-based energy profile is stored, associated with the song analysis record.

4.4. Combo Generation & Regeneration
* What: Generates sequences of Rumble boxing punches (1-6, potentially including defensive moves later) based on the detected BPM and energy profile. Allows regeneration of combos if the initial suggestions are not suitable.
* Why: This is the core value proposition – providing instructors with relevant, musically-aligned combo ideas automatically. Regeneration allows for user control and refinement.
* How:
1. The backend service accesses the stored BPM and energy profile for the song.
2. The Combo Generation Engine (See Section 10) is invoked with these parameters.
3. The engine uses rules, heuristics, and potentially weighted randomness to create sequences of punches (e.g., "1-2-3", "1-2-Slip-2", "6-5-2-Roll-2") that fit the rhythm (based on BPM) and intensity (based on energy level).
4. It generates a set of distinct combos, potentially categorized by song section (e.g., "Verse Combos", "Chorus Combos").
5. The generated combos are stored and returned to the frontend.
6. If the user clicks a "Regenerate" button (for a specific combo or the whole set), the frontend sends a request to the backend.
7. The backend re-invokes the Combo Generation Engine, potentially with parameters to avoid previously generated combos (anti-repetition logic), and returns new suggestions.

4.5. Result Display
* What: Presents the analysis results (BPM, energy overview) and the generated combos clearly to the user.
* Why: Allows the instructor to easily consume the output, understand the song's characteristics, and evaluate the suggested combinations.
* How:
1. Frontend receives the analysis results and generated combos from the backend API.
2. Displays the detected BPM prominently.
3. Optionally, shows a simple visualization of the energy profile over the song's duration (e.g., a colored bar graph).
4. Lists the generated combos, potentially grouped by energy level or song section. Each combo is displayed using standard Rumble notation (e.g., "1-2-5-2").
5. Each combo or group of combos has a "Regenerate" button nearby.
6. Provides a "Copy" button for each combo or the entire set for easy pasting into planning documents.

4.6. (Future) Batch Uploads, Legs Modules, Intensity Presets
* What: Future enhancements planned post-MVP. Includes uploading multiple MP3s simultaneously, incorporating leg/footwork patterns, and allowing instructors to select desired combo intensity/complexity levels.
* Why: Increase efficiency for instructors planning multiple classes, add variety beyond just punches, and provide more granular control over the generated output.
* How:
* Batch Uploads: Modify the upload interface to accept multiple files. Backend processes uploads sequentially or in parallel (resource permitting). Results displayed in a list or dashboard view.
* Legs Modules: Expand the Combo Generation Engine's vocabulary to include standard footwork/leg movements (e.g., "Shuffle", "Switch", "Squat"). Update rules to incorporate these appropriately.
* Intensity Presets: Introduce UI controls (e.g., slider, dropdown: "Beginner", "Intermediate", "Advanced"). Modify the Combo Generation Engine logic to factor in the selected preset, adjusting combo length, complexity, and punch frequency.

5. API Design

Base URL: /api/v1

Authentication: Future: JWT Bearer Token. MVP: Potentially unsecured on internal network or basic auth.

Table of Endpoints:

Method	Path	Purpose	Authentication
POST	/songs	Upload a new MP3 file for analysis	Required (TBD)
GET	/songs/{songId}/analysis	Retrieve analysis results (BPM, energy)	Required (TBD)
GET	/songs/{songId}/combos	Retrieve generated combos for a song	Required (TBD)
POST	/songs/{songId}/combos/regenerate	Request regeneration of combos for a song	Required (TBD)

Endpoint Details:

5.1. POST /songs
* Purpose: Upload MP3, initiate analysis.
* Input: multipart/form-data containing the MP3 file.
* Output: 202 Accepted (Analysis started)
json { "songId": "sng_abc123xyz789", "status": "processing", "message": "Song uploaded successfully. Analysis in progress.", "estimatedCompletionTime": "2024-07-27T10:35:00Z" // Optional estimate }
* Error Output: 400 Bad Request (Invalid file type/size), 413 Payload Too Large, 500 Internal Server Error
json { "error": "InvalidFileType", "message": "Only MP3 files are supported." }

5.2. GET /songs/{songId}/analysis
* Purpose: Get BPM and energy analysis results.
* Input: Path parameter songId.
* Output: 200 OK
json { "songId": "sng_abc123xyz789", "status": "completed", // or "processing", "failed" "analyzedAt": "2024-07-27T10:36:15Z", "results": { "bpm": 128.5, "variableBpm": false, // See 10.5 "durationSeconds": 245, "energyProfile": [ // Example: energy level per 5-second segment { "startTime": 0, "endTime": 5, "energyLevel": 1 }, // 1=Low, 2=Medium, 3=High { "startTime": 5, "endTime": 10, "energyLevel": 1 }, { "startTime": 10, "endTime": 15, "energyLevel": 2 }, // ... more segments { "startTime": 240, "endTime": 245, "energyLevel": 2 } ] }, "errorMessage": null // Populated if status is "failed" }
* Error Output: 404 Not Found, 500 Internal Server Error

5.3. GET /songs/{songId}/combos
* Purpose: Get the initially generated combos.
* Input: Path parameter songId. Query parameters ?count=10 (optional: number of combos).
* Output: 200 OK
json { "songId": "sng_abc123xyz789", "generatedAt": "2024-07-27T10:36:20Z", "combos": [ { "comboId": "cmb_def456uvw123", "sequence": "1-2-3-2", "punchCount": 4, "suggestedEnergyLevel": 2 // Corresponds to energy levels in analysis }, { "comboId": "cmb_ghi789rst456", "sequence": "1-Jab-2-Cross-5-Lead Uppercut", // Expanded notation TBD "punchCount": 3, // Or adjust based on exact definition "suggestedEnergyLevel": 3 }, // ... more combos ] }
* Error Output: 404 Not Found (Song or analysis not found/ready), 500 Internal Server Error

5.4. POST /songs/{songId}/combos/regenerate
* Purpose: Trigger regeneration of combos.
* Input: Path parameter songId. Optional JSON body:
json { "excludeComboIds": ["cmb_def456uvw123"], // Optional: IDs of combos user disliked "targetEnergyLevel": 3, // Optional: Focus regeneration on a specific energy "count": 5 // Optional: Number of new combos desired }
* Output: 200 OK (New set of combos)
json // Same structure as GET /songs/{songId}/combos output, but with new combos { "songId": "sng_abc123xyz789", "generatedAt": "2024-07-27T10:40:05Z", "combos": [ // ... new list of combos ] }
* Error Output: 404 Not Found, 400 Bad Request (Invalid parameters), 500 Internal Server Error

6. Database Models

(Initial Schema - PostgreSQL Recommended)

-- Users Table (Future Authentication)
CREATE TABLE Users (
    "userId" TEXT PRIMARY KEY, -- e.g., usr_randomstring
    email TEXT UNIQUE NOT NULL,
    "hashedPassword" TEXT NOT NULL, -- Store securely hashed passwords
    "firstName" TEXT,
    "lastName" TEXT,
    role TEXT DEFAULT 'instructor' NOT NULL CHECK (role IN ('instructor', 'admin')),
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Songs Table (Metadata about uploaded tracks)
CREATE TABLE Songs (
    "songId" TEXT PRIMARY KEY, -- e.g., sng_randomstring
    "userId" TEXT, -- FK to Users added when auth implemented
    "originalFilename" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL, -- Path in secure storage (e.g., S3 key)
    "fileSizeBytes" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "uploadStatus" TEXT NOT NULL DEFAULT 'pending' CHECK ("uploadStatus" IN ('pending', 'uploaded', 'failed')),
    "uploadedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    -- CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES Users("userId") ON DELETE CASCADE -- Add later
);

-- AnalysisResults Table (Stores results from BPM/Energy analysis)
CREATE TABLE AnalysisResults (
    "analysisId" TEXT PRIMARY KEY, -- e.g., ana_randomstring
    "songId" TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    bpm REAL, -- Store BPM as floating point
    "variableBpm" BOOLEAN DEFAULT FALSE NOT NULL, -- See 10.5
    "durationSeconds" REAL,
    "energyProfileJson" JSONB, -- Store energy profile as JSONB for potential querying
    "errorMessage" TEXT, -- Store error details if status is 'failed'
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMPTZ,
    CONSTRAINT fk_song FOREIGN KEY ("songId") REFERENCES Songs("songId") ON DELETE CASCADE
);

-- GeneratedCombos Table (Stores generated combos for a song)
CREATE TABLE GeneratedCombos (
    "comboId" TEXT PRIMARY KEY, -- e.g., cmb_randomstring
    "analysisId" TEXT NOT NULL,
    "generationIteration" INTEGER DEFAULT 1 NOT NULL, -- Track regeneration cycles
    sequence TEXT NOT NULL, -- e.g., "1-2-3-2"
    "punchCount" INTEGER NOT NULL,
    "suggestedEnergyLevel" INTEGER, -- 1, 2, 3
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_analysis FOREIGN KEY ("analysisId") REFERENCES AnalysisResults("analysisId") ON DELETE CASCADE
);

-- Indexes (Examples for Postgres)
-- CREATE INDEX idx_songs_userid ON Songs("userId"); -- Add later
CREATE INDEX idx_analysisresults_songid ON AnalysisResults("songId");
CREATE INDEX idx_generatedcombos_analysisid ON GeneratedCombos("analysisId");


7. Frontend Component Inventory

(React 18, Vite, Tailwind CSS, TanStack Query)

App.tsx: Main application wrapper, routing (e.g., using react-router-dom).

Layout.tsx: Consistent page structure (header, footer, main content area).

Props: children

AuthGuard.tsx: (Future) Protects routes requiring authentication.

Props: children

LoginPage.tsx: (Future) User login form.

DashboardPage.tsx: Main landing page. Displays upload functionality.

FileUpload.tsx: Handles file drag-and-drop, selection via input, validation, and upload initiation.

Props: onUploadSuccess (e.g., callback with songId), maxFileSizeMB, acceptedMimeTypes

Hooks: Uses useMutation from react-query to handle API call to POST /songs. Displays progress, success, error states.

SongAnalysisView.tsx: Displays the results for a single song analysis. Fetches data based on songId from URL param.

Props: (implicit songId via router)

Hooks: Uses useQuery to poll /analysis endpoint until status is completed or failed. Uses another useQuery to fetch /combos data once analysis is complete. Handles loading/error states.

AnalysisResultsDisplay.tsx: Shows BPM, duration, variableBpm status, potentially energy visualization.

Props: analysisData (object matching results from analysis API response)

EnergyVisualizer.tsx: (Optional V1+) Renders the energy profile graph.

Props: energyProfile (parsed from JSON)

ComboList.tsx: Displays the list of generated combos.

Props: combos (array of combo objects), songId, analysisId (for regeneration)

ComboCard.tsx: Displays a single combo, with Copy and Regenerate buttons.

Props: comboData, onRegenerateClick (callback passing comboId to exclude)

Hooks: Uses useMutation to call POST /.../regenerate endpoint. Invalidates /combos query on success.

LoadingSpinner.tsx: Reusable loading indicator component.

ErrorMessage.tsx: Displays error messages consistently.

Props: error (object or string)

PWAInstallProvider.tsx: (Optional) Wraps app to provide PWA install prompt logic.

8. Backend Structure

(Node.js 18, Express, TypeScript)

The backend follows a standard layered architecture: Routes → Controllers → Services.

Routes (/apps/api/src/routes): Define API endpoints using Express Router. Apply necessary middleware (e.g., multer for file uploads, rateLimit, Zod validation). Map routes to Controller methods.

Example: songRoutes.ts defines router.post('/', upload.single('file'), validate(createSongSchema), songController.uploadSong);

Controllers (/apps/api/src/controllers): Handle HTTP request/response cycle. Extract validated data (from req.body, req.params, req.query, req.file). Call appropriate Service methods. Format Service responses into HTTP responses (status codes, JSON).

Example: songController.ts contains async uploadSong(req, res, next). It calls songService.initiateAnalysis(...), handles errors using next(error), and sends 202 Accepted.

Services (/apps/api/src/services): Contain core business logic. Interact with database via ORM/Query Builder (Prisma/Knex). Interact with external libraries (music-tempo, Meyda). Add jobs to BullMQ queues (analysisService). Encapsulate combo generation logic (comboService). Should be framework-agnostic where possible.

Example: analysisService.ts has addAnalysisJobToQueue(songId, storagePath).

Example: comboService.ts has generateCombos(bpm, energyProfile, count) and regenerateCombo(analysisId, excludeComboIds).

Models (Prisma Schema / Knex Migrations): Define database structure (Section 6). Prisma Client or Knex instance used within Services for data access.

Middleware (/apps/api/src/middleware): Reusable functions for cross-cutting concerns like error handling, logging (Winston), Zod validation, rate limiting (express-rate-limit).

Workers (/apps/api/src/workers): Contain BullMQ queue processors.

analysisWorker.ts: Listens to the analysis queue. Receives job data (songId, storagePath). Orchestrates calls to analysisService (perform analysis) and comboService (generate initial combos), updating database records upon completion or failure. Handles job retries and dead-lettering as configured.

Shared Types (/packages/shared-types): Zod schemas defining API data structures (DTOs) and potentially shared utility types. Used for validation in API and type safety in frontend API client.

Flow Example (Song Upload & Analysis):
POST /api/v1/songs (with MP3 file) → Express Server → rateLimit middleware → multer middleware (stores file, adds path to req.file) → validate(createSongSchema) middleware → songController.uploadSong → songService.initiateAnalysis(req.file, /* userId */) (creates Songs record, gets S3 presigned URL or confirms local save) → analysisService.addAnalysisJobToQueue(songId, storagePath) → songController sends 202 Accepted.
(Background) → BullMQ Worker (analysisWorker.ts) dequeues job → Retrieves file (downloads from S3 or reads local) → Calls analysisService.performFullAnalysis(filePath) (runs music-tempo, Meyda) → Calls comboService.generateInitialCombos(analysisResults) → Updates AnalysisResults & GeneratedCombos tables via services → Worker marks job complete.

──────────────────────── ADDENDUM – FINAL ───────────────────────

2.4 Non-Goals (v1 MVP)
* User-auth UI (login/registration)
* Batch uploads, legs/footwork modules, intensity presets
* ML energy-curve or variable-tempo segmentation
* Admin portal & analytics dashboards
* Native mobile apps (web-PWA only)

4.7 Mobile + PWA Requirement
* Must work on 375 px screens and be installable (PWA manifest).
* Use responsive Tailwind utilities; file-upload UX must work from iOS/Android share sheets.

6.4 Background-Worker Architecture
* BPM & energy analysis jobs run in BullMQ queues on Redis 7.
* Max job time 45 s, retries 3, exponential back-off; dead-letter queue analysis:failed.
* Worker entry: /apps/api/src/workers/analysisWorker.ts.

8.4 Project Scaffold & Dependencies 📁🛠️
Your repo root is Boxing/ (pnpm workspaces).

Boxing/
├─ apps/
│  ├─ api/                       # Node 18 + Express
│  │  ├─ src/
│  │  │  ├─ routes/
│  │  │  ├─ controllers/
│  │  │  ├─ services/
│  │  │  ├─ workers/             # BullMQ jobs
│  │  │  └─ index.ts
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  └─ web/                       # React 18 + Vite
│     ├─ src/{components,pages,…}
│     └─ vite.config.ts
├─ packages/
│  └─ shared-types/              # Zod DTOs & API typings
├─ pnpm-workspace.yaml
├─ .github/workflows/ci.yml      # lint → test → build → deploy
├─ .env.example
└─ README.md
for_claude/                 # LLM-consumable docs (PRD, instructions, etc.)
.cursor/                    # Cursor IDE settings and rules
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
IGNORE_WHEN_COPYING_END

Runtime dependencies to add (api unless noted)
express • music-tempo • meyda • bullmq • ioredis • @aws-sdk/client-s3 • winston • multer • express-rate-limit • zod (api + web) • react + react-dom (web) • @tanstack/react-query (web) • tailwindcss (web) • prisma or knex

Dev-only: typescript • ts-node • eslint • prettier • vitest • supertest • playwright • concurrently • c8/nyc

Root package.json scripts (authoritative)

{
  "scripts": {
    "dev": "concurrently -k \"pnpm --filter api run dev\" \"pnpm --filter web run dev\"",
    "dev:api": "pnpm --filter api exec ts-node --transpile-only apps/api/src/index.ts",
    "dev:web": "pnpm --filter web run dev",
    "build": "pnpm --parallel --filter \"./apps/*\" run build",
    "test": "vitest run --coverage",
    "lint": "eslint . --ext .ts,.tsx"
  }
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Json
IGNORE_WHEN_COPYING_END

.env.example (minimum)

DATABASE_URL=postgres://USERNAME:PASSWORD@localhost:5432/rumble
REDIS_URL=redis://localhost:6379
S3_BUCKET=rumble-audio
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
PORT=3001
JWT_SECRET=change-me
# External LLM routing
OPENROUTER_API_KEY=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
OPENPIPE_API_KEY=opk_eabb040c844dccf34b5275c7f0c7ce604b064b090f

# ⚠️ These values are placeholders for scaffolding; replace them with fresh keys in your local .env or CI secrets store before production.
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Dotenv
IGNORE_WHEN_COPYING_END

CI / Observability

GitHub Action: lint → type-check → test → build → deploy (Render/Fly).

Winston JSON logs, Sentry integration, /metrics Prometheus endpoint.

Acceptance Gate

pnpm dev starts API :3001 and Vite :5173 with zero TS errors.

pnpm test ≥ 80 % line coverage.

pnpm build emits production bundles.

Secrets loaded solely from .env.

────────────────────────────────────────────────────────────────────────

9. Security & Compliance Plan

9.1. File Validation:
* Frontend: Check file extension (.mp3) and size limit (e.g., 15MB) before initiating upload.
* Backend: Use multer limits for file size. Validate MIME type (audio/mpeg) using file-type library on the uploaded buffer/stream. Sanitize originalFilename before storing (e.g., remove path characters, limit length). Use UUIDs for storage keys/paths.
9.2. Secure File Storage:
* Recommended: Use AWS S3. Generate presigned POST URLs from the backend (@aws-sdk/client-s3) for direct client uploads. Configure bucket policies to restrict public access. Store only the S3 object key in the Songs table (storagePath).
* Alternative (Local): Store files in a non-web-accessible directory (/tmp/uploads or similar) with restrictive OS permissions. Use UUIDs as filenames. Ensure this volume persists if using ephemeral containers.
9.3. Temporary File Deletion:
* S3: Configure bucket lifecycle policy to automatically delete objects in the upload prefix after a short period (e.g., 1-7 days). Ensure presigned URLs have short expiry (e.g., 15-60 minutes).
* Local: Implement a cleanup job (BullMQ scheduled job or system cron) to delete files older than a defined threshold (e.g., 60 minutes) from the upload directory. Ensure deletion happens even if analysis fails.
9.4. Rate Limiting:
* Apply express-rate-limit middleware to the POST /api/v1/songs route.
* Hard cap: 20 uploads per user per hour; burst 5. Key by userId (once auth is added), fallback to IP address.
9.5. Input Sanitization:
* Use Zod schemas (from packages/shared-types) with validation middleware (e.g., express-zod-api or custom middleware) for all API endpoints to validate request bodies, query parameters, and path parameters.
* Use Prisma Client or Knex.js correctly; avoid raw SQL queries with user input. All database interactions must go through the ORM/query builder's mechanisms for parameterization.
9.6. Authentication & Authorization (Roadmap):
* MVP: No user authentication. Deploy in a trusted network environment or accept anonymous uploads with strict rate limiting.
* V1.1: Implement user accounts (email/password) using robust libraries (e.g., Lucia Auth, Passport.js) with secure password hashing (Argon2/bcrypt). Use HttpOnly, Secure cookies or JWTs for session management. Add userId foreign key to Songs table.
* Authorization: Check song.userId === req.user.id in services/controllers before allowing access or modification of song-related resources. Implement role checks ('admin' vs 'instructor') for future administrative features.
9.7. Dependencies: Use pnpm audit and Snyk/Dependabot via GitHub integration in CI to scan for vulnerabilities. Keep dependencies updated regularly.
9.8. Compliance:
* Copyright: Require users to explicitly acknowledge (e.g., checkbox during upload) that they possess the necessary rights for the uploaded audio content. Detail this in the Terms of Service.
* Privacy: Handle user data (email, name - post-MVP) according to applicable privacy laws (e.g., GDPR, CCPA). Provide clear privacy policy.
9.9. Error Handling & Logging:
* Implement a centralized Express error handling middleware. Catch errors, log them using Winston (JSON format to stdout), report critical errors to Sentry, and return standardized JSON error responses (e.g., { "error": "Code", "message": "Details" }) without leaking implementation details or stack traces in production.
9.10. Copyright & Retention:
* Users affirm they own or are licensed to use uploaded music via a UI element during upload.
* Uploaded audio files (S3 objects or local files) are targeted for deletion ≤ 60 minutes after analysis completion or failure, enforced by automated cleanup mechanisms (S3 lifecycle or cleanup jobs). Access URLs (presigned) expire within 60 minutes.

10. Combo Regeneration Engine

10.1. Algorithm Steps:
1. Input: Target BPM, energy profile (time segments with Low/Medium/High levels), existing combos (for anti-repetition), desired number of combos, optional intensity preset (Future).
2. Punch Vocabulary: Define the set of allowed punches (1: Jab, 2: Cross, 3: Lead Hook, 4: Rear Hook, 5: Lead Uppercut, 6: Rear Uppercut). Future: Add defensive moves (Slip, Roll, Block), leg movements. Store as constants/enum.
3. Rhythm Mapping: Determine basic beat patterns based on BPM (e.g., punches on downbeats, upbeat syncopation options). A 128 BPM song has ~2.13 beats/sec. A 4-count combo might take ~1.8 seconds. MVP: Assume punches align with primary beats.
4. Energy Mapping: Define rules based on energy level:
* Low Energy (Level 1): Target 3-4 punches, favor basic sequences (1-2, 1-1-2), higher probability of jabs/crosses.
* Medium Energy (Level 2): Target 4-6 punches, mix basic and moderate sequences (1-2-3, 3-4-3-2), balanced punch distribution.
* High Energy (Level 3): Target 6-8+ punches, allow more complex sequences (doubles like 1-2-1-2, power finishes like 3-6-3-2), higher probability of hooks/uppercuts.
5. Combo Construction (Heuristic Approach):
* Select a target combo length based on energy level (random within range).
* Start with a common opening punch/pair (e.g., 1, 1-2).
* Iteratively append punches: Choose next punch based on weighted probabilities derived from common Rumble flows (e.g., high chance of '2' after '1', '3' after '2'), energy level rules (favor power punches in high energy), and randomness. Avoid awkward transitions (e.g., two consecutive rear power punches).
6. Anti-Repetition Logic:
* Fetch recently generated combo sequences for the current analysisId and generationIteration.
* Before finalizing a new combo sequence, check for exact match against the recent list and any excludeComboIds provided in the regeneration request.
* If a duplicate is found, discard the generated sequence and retry the construction process (up to a limited number of retries per requested combo).
7. Output: Return the specified number of unique, valid combo sequences as strings.

10.2. Weighting:
* Implement transition probability matrix/weights: P(punch_B | punch_A) e.g., P(2|1) is high, P(3|1) is low, P(4|4) is very low.
* Adjust punch selection weights based on energy level (e.g., increase weight of 3, 4, 5, 6 for Level 3 energy).
* Weight target combo length based on energy level.

10.3. Configurable Knobs (Future):
* Store configuration (e.g., JSON in DB or env vars) for energy->length mapping, transition weights, probability of doubles, inclusion of future moves (defense/legs), anti-repetition strictness. Allow admin UI to modify.

10.5. Edge-Case BPM Handling
* If the music-tempo library analysis indicates significant variance (e.g., confidence score below a threshold, or multiple peaks > 10 BPM apart), the AnalysisService will:
1. Identify the dominant (highest confidence) BPM.
2. Store this dominant BPM in the AnalysisResults.bpm field.
3. Set the AnalysisResults.variableBpm flag to true.
4. The API response for GET /songs/{songId}/analysis will include both fields within the results object.
5. MVP combo generation will use the dominant BPM. Frontend should visually indicate variableBpm: true to the instructor.

11. Feather Agent Chain

Assumption: "Feather Agent" refers to the external system using the provided feather-stub.ts signature to interact with this application's API.

11.1. Call Sequence:
1. Agent Action: Agent has local MP3 file path.
2. API Call 1: Agent constructs FormData, adds MP3 file. Calls feather.call({ url: '/api/v1/songs', method: 'POST', data: formData }).
3. API Response 1: Server responds 202 Accepted with { songId: "sng_...", status: "processing" }. Agent extracts and stores songId.
4. Agent Action: Agent initiates polling mechanism for the analysis status using songId. Implement exponential backoff (e.g., 2s, 4s, 8s, 16s) with a max timeout (e.g., 60s total).
5. API Call 2 (Polling): Agent calls feather.call({ url: \/api/v1/songs/
{songId}/combos`, method: 'GET' }). 8. **API Response 3:** Server responds200 OKwith{ combos: [...] }. Agent receives the list of combos. 9. **Agent Action (Conditional - Regeneration):** Based on its internal logic or user input, the Agent determines if regeneration is needed (e.g., user disliked combocmb_abc). 10. **API Call 4:** Agent callsfeather.call({ url: `/api/v1/songs/${songId}/combos/regenerate`, method: 'POST', data: { excludeComboIds: ["cmb_abc"], count: 1 /* or more */ } }). 11. **API Response 4:** Server responds200 OK` with a new list of combos (ideally replacing or supplementing the disliked one). Agent processes/displays the updated list.

11.2. Error Handling:
* The feather.call stub implies it might throw exceptions on HTTP errors or network issues. The Agent script must wrap calls in try...catch blocks.
* Upload Failure (Call 1): Catch errors, log details (including status code and response data if available), terminate or retry based on error type (e.g., retry 5xx, not 4xx).
* Analysis Failure (Polling Call 2): Explicitly check for status: "failed" and log the errorMessage.
* Polling Timeout: Implement timeout logic within the polling loop; log error if max time/attempts exceeded.
* Combo Fetch/Regen Failure (Calls 3 & 4): Catch errors, log details.

11.3. Triggering Regeneration: The decision logic resides entirely within the Feather Agent. It uses the POST /regenerate endpoint when its criteria are met, passing necessary context like excludeComboIds.

12. Step-by-Step Build Plan

(MVP Checklist)

[Setup] Init Boxing/ repo, set up pnpm workspaces (api, web, shared-types).

[Setup] Define root package.json scripts (8.4). Install base dev deps (typescript, eslint, prettier, vitest, concurrently). Configure ESLint/Prettier.

[Setup] Bootstrap api (Node/Express/TS) & web (React/Vite/TS). Install runtime deps (8.4).

[Setup] Set up Prisma: schema.prisma (Section 6), generate client. Set up Postgres DB locally (Docker). Configure .env.example & .env.

[Shared] Define Zod schemas in shared-types for API endpoints (request/response DTOs).

[Backend] Basic Express app setup (index.ts), Winston logger middleware, central error handler. Add /metrics endpoint (prom-client).

[Backend] Implement POST /songs: multer (S3 storage engine recommended), Zod validation middleware, songController calls songService to save metadata, return 202.

[Backend] Configure BullMQ: Redis connection (ioredis), analysisQueue, analysisWorker.ts structure.

[Backend] songService: Add job to analysisQueue after successful metadata save.

[Backend] analysisWorker: Implement queue processor logic. Fetch job data, call services.

[Backend] AnalysisService: Implement performFullAnalysis using music-tempo, Meyda. Handle variableBpm. Update AnalysisResults via Prisma.

[Backend] ComboService: Implement generateInitialCombos (Section 10). Update GeneratedCombos via Prisma.

[Backend] Implement GET /analysis & GET /combos endpoints (controller, service, Prisma fetch).

[Frontend] Set up React Router, Tailwind CSS, TanStack Query client.

[Frontend] Build FileUpload component (useMutation for upload).

[Frontend] Build SongAnalysisView (useQuery polling /analysis, useQuery for /combos).

[Frontend] Build AnalysisResultsDisplay, ComboList, ComboCard components.

[Backend] Implement POST /regenerate endpoint (controller, service, Zod validation).

[Frontend] Add Regenerate button (useMutation, invalidate /combos query).

[Security] Add express-rate-limit (9.4). Implement S3 lifecycle / local file cleanup (9.3). Add copyright checkbox UI.

[Frontend] Ensure responsiveness (375px). Add PWA manifest & service worker (Vite PWA plugin). Test mobile upload flow.

[Testing] Write tests (Unit, Integration, E2E) per strategy (12.1). Aim for coverage (80%).

[CI/CD] Set up GitHub Actions (lint, typecheck, test, build, deploy). Configure Sentry.

[Deployment] Deploy to Render/Fly (configure Procfile/Dockerfile, DB, Redis). Monitor.

12.1 Testing Strategy
* Unit (Vitest): services/*, workers/* logic, utility functions. Mock DB (e.g., prisma-mock), audio libs, BullMQ. Use fixture MP3s/data. Target ≥ 80 % line coverage (c8). Run with pnpm test.
* Integration (Supertest): Test API endpoints (controllers/*, routes/*). Use a separate test DB, seed/clean between tests. Test middleware (validation, rate limit). Run via pnpm test:api (if configured).
* E2E (Playwright): Test critical user flow: Upload MP3 → Poll for results → Verify BPM & combos displayed. Test on desktop viewport and mobile viewport (375px). Run via pnpm test:e2e (if configured).

13. Future-Proof Notes

Batch Playlist Generation: Requires UI for multi-file upload/playlist parsing, backend queueing enhancements (handle many jobs), results dashboard UI.

Dynamic Legs/Footwork: Needs extending ComboService vocabulary/rules, potentially more complex timing logic relative to BPM.

Coach Intensity Profiles: Requires User auth, DB schema changes (UserProfiles), UI for profile selection, ComboService adapting to profile parameters.

Admin Portal: Likely separate app/route prefix, role-based access control (RBAC) middleware, views for user management, stats, config tuning.

Database Scaling: Migrate to managed PostgreSQL (e.g., RDS, Neon) if load increases. Ensure proper indexing.

Cloud Services: Consider AWS Batch or Lambda for analysis if dedicated workers become costly or hard to scale. Explore managed queues (SQS).

UI/UX: Waveform viz (wavesurfer.js), combo editing, saving favorites (requires user auth/DB changes).

API Versioning: Strictly maintain /v1. Plan /v2 for breaking changes. Use OpenAPI/Swagger for documentation.

14. Open Questions / Risks

Combo Quality Subjectivity: How well does V1 algorithm match instructor expectations? (High Risk) Mitigation: Iteration based on structured feedback.

Energy Analysis Accuracy: Is simple RMS sufficient? (Medium Risk) Mitigation: Evaluate V1 results, plan for spectral analysis/ML if needed.

Variable BPM Handling (MVP): MVP only flags variable BPM, doesn't adapt generation. (Low Risk for MVP, Medium for V2). Mitigation: Clear UI indication, prioritize adaptation post-MVP.

Performance @ Scale: Analysis time under load? Redis/DB connection limits? (Medium Risk) Mitigation: Load testing, async processing, worker scaling.

Music Copyright: User affirmation sufficient? (Low Risk - Standard Practice) Mitigation: Clear ToS, robust file deletion.

Rumble Style Fidelity: Capturing the "feel". (Medium Risk) Mitigation: Calibrate weights/rules with Rumble SMEs, possibly rule engine.

Adoption Rate: Will instructors use it? (Medium Risk) Mitigation: Focus on UX, speed, reliability, demonstrable value.

Feather Agent Integration: Specific needs/constraints of the agent? (Low Risk if API is well-defined). Mitigation: Clear communication/documentation.

Attachments for Claude/Gemini:

combos.sample.json – JSON file containing an array of ~20 sample combo objects (e.g., { "comboId": "cmb_...", "sequence": "1-2-5-2", "punchCount": 4, "suggestedEnergyLevel": 2 }).

Fixture MP3 files located at apps/api/fixtures/mp3/: track1_120.mp3 (short track, ~120 BPM), track2_150.mp3 (short track, ~150 BPM).

Stub file packages/shared-types/feather-stub.ts containing the minimal feather.call function signature or interface definition as provided previously.