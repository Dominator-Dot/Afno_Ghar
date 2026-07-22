# GitHub Push Guide for AfnoGhar

## Goal
Push the existing project to GitHub using VS Code, create a branch named `frontend`, and ensure `node_modules` is ignored.

## 1. Create or update `.gitignore`
1. In VS Code Explorer, create a file named `.gitignore` in the project root.
2. Add these lines:
   ```gitignore
   node_modules/
   /dist
   .env
   .env.local
   .DS_Store
   npm-debug.log*
   yarn-debug.log*
   yarn-error.log*
   ```
3. Save the file.

## 2. Initialize Git (if not already initialized)
If the folder is not already a Git repository, do this in VS Code Terminal:

```powershell
cd c:\Users\Dell\OneDrive\Desktop\4thsem\afnoghar-frontend
git init
```

> If `.git` already exists, skip this step.

## 3. Review repository status
In the terminal, run:

```powershell
git status
```

This shows the files that are new, modified, or ignored.

## 4. Create the `frontend` branch
In the terminal, run:

```powershell
git checkout -b frontend
```

This creates a new branch named `frontend` and switches to it.

## 5. Add files to Git
Stage all files except ignored ones:

```powershell
git add .
```

> `node_modules` will be skipped automatically because it is listed in `.gitignore`.

## 6. Commit your changes
Make a commit with a clear message:

```powershell
git commit -m "Initial frontend branch commit"
```

## 7. Create a GitHub repository
1. Open GitHub in your browser.
2. Create a new repository with the desired name.
3. Do not initialize it with a README, `.gitignore`, or license if you already have a local repo.

## 8. Connect the local repo to GitHub
Copy the GitHub repository URL and run in terminal:

```powershell
git remote add origin https://github.com/<your-username>/<repo-name>.git
```

If `origin` already exists, use:

```powershell
git remote set-url origin https://github.com/<your-username>/<repo-name>.git
```

## 9. Push the `frontend` branch
Send your branch to GitHub:

```powershell
git push -u origin frontend
```

## 10. Verify on GitHub
Open your repository page on GitHub and confirm:
- branch `frontend` exists
- files are uploaded
- `node_modules` is not present

## Optional: Set `frontend` as default branch on GitHub
1. On GitHub, go to Settings > Branches.
2. Choose `frontend` as the default branch.

## Extra notes for VS Code users
- Use the Source Control view (Ctrl+Shift+G) to see staged and unstaged files.
- If prompted by VS Code to install Git, follow the instructions.
- If `node_modules` already appeared in Git history, remove it with:
  ```powershell
git rm -r --cached node_modules
git commit -m "Remove node_modules from repo"
``` 

## Summary
1. Add `.gitignore`
2. Initialize Git if needed
3. Create and switch to `frontend`
4. Stage and commit
5. Add GitHub remote
6. Push branch

Now your project is on GitHub with a clean `frontend` branch and no `node_modules` folder stored in the repository.
