# M-DRIVE

M-DRIVE is a visually appealing, Next.js–based file management application inspired by Google Drive. It leverages modern technologies such as Next.js (App Router), TypeScript, [Clerk](https://clerk.com) for authentication, [PostHog](https://posthog.com) for analytics, [UploadThing](https://uploadthing.com) for file uploads, and [Drizzle ORM](https://orm.drizzle.team) for database operations. The project is designed with a modular architecture for both server and client components.

## Features

**User Authentication:**
Integrated via [Clerk](https://clerk.com).

**Analytics:**
Page views and user events tracked using [PostHog](https://posthog.com).

**File Uploads:**
Handled by [UploadThing](https://uploadthing.com) with type-safe integration.

**Database Operations:**
Uses [Drizzle ORM](https://orm.drizzle.team) with [SingleStore/MySQL](https://www.singlestore.com) for handling file and folder data, including hierarchical folder structures.

**Responsive UI:**
Styled with CSS modules for a modern, responsive design.

**Modals for File Preview:**
Supports image, video, PDF, plain/text, and audio file types with both preview and download functionality.

## Setup

- Clone the Repository

```bash
git clone git@github.com:FilipsMasolovs/m-drive.git
cd m-drive
```

- Install Dependencies

```bash
npm install
# or
pnpm install
```

- Environment Variables

Create a .env file based on the provided example and set the following keys:

_NEXT_PUBLIC_POSTHOG_KEY_ – Your PostHog API key.<br/>
_SINGLESTORE_HOST_, _SINGLESTORE_PORT_, _SINGLESTORE_USER_, _SINGLESTORE_PASS_, _SINGLESTORE_DB_NAME_ – Your database credentials.<br/>
Plus any Clerk or other configuration variables as needed.

- Database Setup

Ensure that your [SingleStore/MySQL](https://www.singlestore.com) database is running and accessible. Run any necessary migrations (if applicable).

## Running the Project

### Development

Start the development server with:

```bash
npm run dev
# or
pnpm run dev
```

Your application will be available at [http://localhost:3000](http://localhost:3000).

### Production

Choose any means of production deploys you are comfortable with. One great option is deploying directly from GitHub to [Netlify](https://www.netlify.com/).

## Project Structure

- src/app/: Next.js application pages and API routes.
  - \_providers/: Context providers (e.g., PostHog).
  - api/: API routes (e.g., for file uploads with UploadThing).
  - drive/: Routes for the drive page.
  - m/[folderId]/: Dynamic routes for folder views.
- src/components/: Reusable UI components (HomeComponent, Actions, FileFolderUploads, modals, ListItem, Breadcrumbs, etc.).
- src/server/: Server-side actions, database queries, mutations, and schema definitions.
- src/lib/utils/: Utility functions (e.g., forceDownload, formatSize, getItemIcon, className merging).
- src/styles/: Global CSS files.

## Additional Notes

- **Authentication & Authorization:**  
  Ensure that Clerk is properly configured for user authentication. Protected routes use Clerk middleware to restrict access.

- **Analytics:**  
  PostHog is initialized via a dedicated provider. Ensure that `NEXT_PUBLIC_POSTHOG_KEY` is set.

- **File Uploads:**  
  The UploadButton is generated using UploadThing’s API and routed through a custom file router for type safety.

- **Error Handling:**  
  Server actions (e.g., file deletion, folder creation) include basic error handling. Review and extend these as needed for your production environment.

<br/><br/>

**Feel free to contribute, open issues, or reach out if you have any questions or suggestions!**

Happy driving!
