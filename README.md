[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/LvSokF5s)
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## CSC 450-fa23-project-team-8 Pyschology Project

Created by
Noah Deda
Callum Pearson-Dunaj
Liam Coyle
Harrison Atchley

Testing Library
Puppeteer
https://pptr.dev/
To install
npm install puppeteer
To run tests
use node nameOfFile.js
List of tests found in root directory



Make sure you have node.js installed first
https://nodejs.org/en

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

Create a .env file

#The .env is hidden from github but includes all the api keys etc from firebase

```
    Use npm install then type the name of each package
    	ex npm install corepack
    --local packages--
    ├── npm install corepack@0.19.0
    ├── npm install -g firebase-tools@12.6.2
    ├── npm install node-gyp@9.4.0
    ├──npm install nopt@7.2.0
    ├── npm@9.8.1
    ├── npm install semver@7.5.0
    └── npm install --global yarn
    --!global packages!--
    ├── @types/node@20.6.2
    ├── @types/react-dom@18.2.7
    ├── @types/react@18.2.22
    ├── autoprefixer@10.4.16
    ├── encoding@0.1.13
    ├── eslint-config-next@13.5.1
    ├── eslint@8.50.0
    ├── firebase@10.4.0
    ├── jszip@3.10.1
    ├── lodash.debounce@4.0.8
    ├── next-auth@4.24.4
    ├── next@13.5.6
    ├── postcss@8.4.31
    ├── react-dom@18.2.0
    ├── react@18.2.0
    ├── npm install -D tailwindcss
    └── typescript@5.2.2
```


To connect to the project
https://youtu.be/ILJ4dfOL7zs?si=d-Hl4aAKkG7KFdU7

Link to the repository
https://github.com/UNCW-CSC-450/csc450-fa23-project-team-8.git

Then


git checkout main
```

Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

TESTS: <Noah Deda>'s
Assesment Black Box tests".
type in vercel --prod
then
node DedaUploadJson.js
node DedaTestCase0.js
node DedaTestCase1.js
node DedaUploadJson.js
node DedaTestCase2.js
TEST CASE 0
-Sign in
-jeff123 -- password [username, password]
-Click Assessment Manager
-ERROR too many hooks vvvvvv
-Click Assessment Manager OR try again
-loads the page properly
-Select a test

- Press Delete button
  -Removes from storage[The admin is able to delete assessments from the database.]
  TEST CASE 1
  -Sign in
  -jeff123 -- password [username, password]
  -click assessment manager
  -erorr
  -sign out
  -loads assessment manager page properly
  -click assessment
  -press delete button[The admin is able to delete assessments from the database.]
  TEST CASE 2
  -Sign in
  -dave 7 -- password [username,password]
  -type in http://localhost:3000/assessment_manager
  -not authorized

<Liam Coyle> TESTS: Upload Assesment tests.
SETUP FOR TESTS
type in vercel --prod
then
node LiamTestCase0.js
node LiamTestCase1.js
node LiamTestCase2.js
node LiamTestCase3.js
-Sign in
-jeff123 -- password [username, password]
-Click Assessment Manager
-loads the page slowly
-Click "Upload New Assessment"
-Switches current visible component
-Click choose file.
-Only accepts .zip files, that at is all that is shown in explorer selection.

    TEST CASE 0
    Not possible in windows to create empty zip files.

    TEST CASE 1
    Zip file with no assessment json, but has anything else.
    -Choose zip file
    -Upload button does not appear.
    -Red warning: "No JSON file found in ZIP"
    -Clear assessment button appears.
    -Clears selected assessment

    TEST CASE 2
    Zip file with no images, but images are specified in json assessment.
    -Choose zip file
    -Warning: "Missing data in ZIP"
    -Clear assessment button appears.
    -JSON is displayed and missing data is specified at the top.
    -Clear selected assessment

    TEST CASE 3
    Zip file with JSON, with required file data.
    -Choose zip file
    -Upload assessment button appears.
    -Clear assessment button appears.
    -JSON is displayed.
    -Upload button is hidden on success
    -Upload Successful indicated
    -Clear selected assessment
