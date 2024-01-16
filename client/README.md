## 🛠️ Installation

After downloading the repo, you have some prerequisites to install. Then you can run it on your localhost. You can view the package.json file to see which scripts are included.

### Install prerequisites (once for a machine)

- **Node Installation:** [Install node js](https://nodejs.org/en/download/) [Recommended LTS version]

### 👨🏻‍💻 Local setup

After successfully installing those dependencies, open this template with any IDE [[VS Code](https://code.visualstudio.com/) recommended], and then open the internal terminal of IDM [vs code shortcut <code>ctrl/cmd+\`</code>]

- 👉 Install dependencies for client folder by navigating to that folder

```
npm install
```

- 👉 Run locally - Client

```
npm run dev
```

- 👉 After that, below are steps to follow to create first Resume.
  - Visit localhost:5173 and you can register or login with a user.
  - After that you have to create some pre filled data so that you can create resume without the worry of thinking summaries.
  - Click on "collections" and you will see 4 cards -> "About Me" , "Education", "Experience", "Skills". You can add pre filled summary to any of these sections.
  - For Ex: By clicking on "About Me" you will be asked to select designation on which you want to add that summary.
  - After selecting the designation now you can click on "Add" and on the popup you can add your summary which will be helpful whenever you are creating a resume.
  - Like this you can fill up the data.
  - Now you are ready to make your first resume. Navigate to "resume" page and click on "New Resume" and you will be asked to fill bunch of personal information as well as designation,education,experience and skills.
  - Now apart from personal information you can see the dropdown from which you can select the designation and then you will be displayed with your filled summaries.
  - After finishing all steps you will be given a preview and you can download your resume as well.
  - The resume in which you haven't completed all steps or the resume which you fully created that will be listed on the "resume" page and by clicking on continue you can continue where you left.
