[![CI Server Unit Tests](https://github.com/luismda/book-wise/actions/workflows/run-server-unit-tests.yml/badge.svg)](https://github.com/luismda/book-wise/actions/workflows/run-server-unit-tests.yml)

---

# BookWise 📚

This project is a book ratings platform where a reader can see the recommendations of other readers and also make their own ratings of the books they have already read. The application also has social authentication through a Google and GitHub account.

[**See the layout in Figma**](https://www.figma.com/file/jTau6bMNSF10GkqwYAbuLA/BookWise/duplicate)

## Some instructions

- Clone the repository and install the dependencies
- Run the command `docker compose up -d` to start the MySQL container
- Create an `.env` file in the root of the project following the `.env.example`
- In the environment variables, inform the database connection URL
- Still in the environment variables, also inform the Google and GitHub oAuth client credentials, in addition to the Next Auth secret
- Run the `npx prisma db push` command to run all migrations on the database
- You can also run `npx prisma studio` command to view the database
- Run `npx prisma db seed` command to populate the database with some records
- Use the `npm run dev` command to start the application
- If you want, use the command `npm run test:server:unit` to run the unit tests of the use cases

## Technologies

- TypeScript
- Next.js
- React.js
- React Query
- React Hook Form
- React Loading Skeleton
- Radix UI
- TailwindCSS
- Next Auth
- Next SEO
- Prisma ORM
- MySQL
- Docker
- Zod
- Vitest
- ESLint

## Created by

Luís Miguel | [**LinkedIn**](https://www.linkedin.com/in/luis-miguel-dutra-alves/)

##

**#NeverStopLearning 🚀**