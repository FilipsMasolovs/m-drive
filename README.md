# M-DRIVE

M-DRIVE is a visually appealing, Next.js–based file management application inspired by Google Drive. It leverages modern technologies such as Next.js (App Router), TypeScript, [Clerk](https://clerk.com) for authentication, [PostHog](https://posthog.com) for analytics, [UploadThing](https://uploadthing.com) for file uploads, and [Drizzle ORM](https://orm.drizzle.team) for database operations. The project is designed with a modular architecture for both server and client components.

## 🚀 Features

### Core Functionality

- **File Management:** Upload, download, rename, and delete files
- **Folder Organization:** Create, navigate, and manage nested folder structures
- **Search:** Global search functionality for files and folders
- **File Preview:** Built-in preview support for various file types
- **Storage Management:** Visual storage usage indicator with limits

### Technical Features

- **Authentication & Authorization:** Secure user authentication via [Clerk](https://clerk.com)
- **Analytics:** User behavior tracking with [PostHog](https://posthog.com)
- **File Handling:** Type-safe file uploads using [UploadThing](https://uploadthing.com)
- **Database:** Efficient data management with [Drizzle ORM](https://orm.drizzle.team) and [SingleStore](https://www.singlestore.com)
- **Type Safety:** Full TypeScript implementation
- **Responsive Design:** Mobile-first approach using CSS modules

### Supported File Types

- 📷 Images (JPEG, PNG, GIF, WebP)
- 📹 Videos (MP4, WebM, OGG)
- 📄 Documents (PDF, TXT)
- 🎵 Audio (MP3, WAV, OGG)
- 📦 Other file types (with download option, no preview)

## 🛠 Setup

### Prerequisites

- Node.js 18.x or higher
- npm or pnpm
- SingleStore/MySQL database
- Clerk account
- PostHog account
- UploadThing account

### Installation

1. **Clone the Repository**

```bash
git clone git@github.com:FilipsMasolovs/m-drive.git
cd m-drive
```

2. **Install Dependencies**

```bash
npm install
# or
pnpm install
```

3. **Environment Setup**

Create a **.env** file with the following variables:

```env
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=

# Database
SINGLESTORE_HOST=
SINGLESTORE_PORT=
SINGLESTORE_USER=
SINGLESTORE_PASS=
SINGLESTORE_DB_NAME=

# File Upload
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
```

### Running the Project

1. **Development**

```bash
npm run dev
# or
pnpm run dev
```

2. **Production & Deployment**

Choose any means of production deploys you are comfortable with.\
Recommended deployment platforms:

- **[Vercel](https://vercel.com)**
- **[Netlify](https://www.netlify.com)**
- **[Railway](https://railway.com)**

## 📁 Project Structure

```text
src/
├── app/                  # Next.js pages and API routes
├── components/
│   ├── common/          # Reusable UI components
│   ├── drive/          # Drive-specific components
│   ├── layout/         # Layout components
│   └── modals/         # Modal components
├── hooks/              # Custom React hooks
├── lib/
│   ├── api/           # API utilities
│   ├── constants/     # Constants and configurations
│   └── utils/         # Utility functions
├── server/
│   ├── actions/       # Server actions
│   ├── db/           # Database related code
│   └── api/          # API routes
├── store/             # State management
│   ├── slices/       # Store slices
│   └── index.ts      # Store exports
└── types/            # TypeScript types
```

## 🔒 Security

- **Authentication:** Protected routes and API endpoints using Clerk middleware
- **File Access:** User-specific file access control
- **API Security:** Rate limiting and request validation
- **Database:** Prepared statements and input sanitization

## ⚡ Performance

- **File Preloading:** Intelligent file preloading for faster previews
- **Lazy Loading:** Components and modals loaded on demand
- **Caching:** Browser and server-side caching strategies
- **Image Optimization:** Next.js image optimization

## 📈 Monitoring

- **Analytics:** PostHog dashboard for user behavior
- **Error Tracking:** Console logging and error boundaries
- **Performance Monitoring:** Built-in Next.js analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Clerk](https://clerk.com)
- [PostHog](https://posthog.com)
- [UploadThing](https://uploadthing.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [SingleStore](https://www.singlestore.com)

- And for the first steps **Theo**: [twitch.tv/theo](https://www.twitch.tv/theo) | [youtube.com/c/TheoBrowne1017](https://www.youtube.com/c/TheoBrowne1017)

### Made with ❤️ by Filips Masolovs [GitHub](https://github.com/FilipsMasolovs) | [LinkedIn](https://www.linkedin.com/in/filips-masolovs)
