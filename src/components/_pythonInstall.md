
## 1 Installing **Python 3.11 Or Newer**
We will use Python version 3.11 or higher in this course. Please follow the below instructions to install a Python interpreter that works with VScode.

### 1.1 Confirm current version (if any)
Before installing anything, check if you already have a compatible version of Python

#### macOS
Open the Terminal application (it is pre-installed on all Macs), and run the following command

  ```bash
  python3 --version
  ```

If this results in an error, or reports a version of Python below **3.11**, follow the steps below. Otherwise, skip to [VSCode Setup](#2-vscode-setup)

**On Mac, if this opens a window to install Command Line Developer Tools, you can install this, as it will also install Git, which we need. You should STILL follow the [steps below to install Python](#12-install-python) after this is installed**

#### Windows
Open the Command Prompt or PowerShell (it is pre-installed on all Window computers), and run the following command
  ```bash
  py -3 --version
  ```

If this results in an error, or reports a version of Python below **3.11**, follow the steps below. Otherwise, skip to [VSCode Setup](#2-vscode-setup)

### 1.2 Install Python
#### Windows
1. Go to [python.org/downloads](https://www.python.org/downloads/).
2. Click **“Download Python install manager”** (the big yellow button).
  ![Python Website](/img/pythoninstall.png)
3. Run the installer and click **Install Now**.
4. After installation, open a new Terminal (be sure it's a new Terminal) and verify by typing the following and hitting return:
```bash
py -3 --version
```
You should see something like `Python 3.11.9`. Any version 3.11 or higher is fine.

#### macOS
  > ⚠️ Older versions of macOS came with an older “system Python” used by the OS, and may still be installed. Do **not** use that version. Instead, install your own Python 3.11+.
  1. Visit [python.org/downloads](https://www.python.org/downloads/).
  2. Download the **macOS 64-bit universal installer** for Python 3.11+.
  3. If the installer doesn't open automatically, go to the Downloads folder and open the `.pkg` file.
  4. Follow the prompts.
  5. After installation, open a VSCode Terminal and verify by typing the following and hitting return:
```bash
python3 --version
```

This should print something like `Python 3.11.9`. Any version 3.11 or higher is fine.


## 2 VSCode Setup
### 2.1 Install VSCode
**Windows & macOS**
1. Go to https://code.visualstudio.com/ and download VSCode.
2. Your next step will depend on your operating sytem.
    * On Windows, run the installer and accept defaults.
    * On macOS, you may need to double-click on the downloaded file to uncompress it (if the filename ends with "zip"). Drag into the **Applications folder** or, if you don't see it, follow these steps:
        1. Open a new Finder window with `⌘N`.
        2. In the new window, go to the Applications folder through the dropdown menu (`Go > Applications`) or with `⇧⌘A` (shift-command A).
        3. Drag `Visual Studio Code 2` from the Downloads folder to the Applications folder.
3. Drag Visual Studio Code 2 from the Applications folder to the dock for easy access.
4. Launch VSCode. 

### 2.2  VSCode Extensions: Python, Python Environments, Pylint, Mypy Type Checker
You will install each of the following from the Extensions view (left sidebar icon with 4 squares):
    ![VSCode Extensions Icon](/img/vscode-ext.png)

#### Install Python Extension
1. There is an extension in VSCode that enables Python features.  
1. Search for **“Python”** by **Microsoft**.
   - Make sure that the extension's entire name is "Python" (not "Python Debugger")
1. Click **Install**.  ![Python Extension](/img/pythonextension.png)

#### Install Python Environments Extension
1. Search for **"Python Environments"** by **Microsoft**
2. Click **Install**
  
#### Install Pylint Extension
We will use Pylint [(documentation here)](https://marketplace.visualstudio.com/items?itemName=ms-python.pylint) to check that our code follows the style guidelines. The autograder for each assignment will also be running Pylint.

1. In the Extensions tab, search “Pylint” and click Install.
![Pylint Install](/img/pylintinstall.png)
2. When it's done, click on the gear icon and then click Settings.
![Pylint Install](/img/pylint-settings-selection.png)
3. In the **Args** section, add these two args one at a time by clicking on "Add Item":
   - ```--disable=import-error```
   - ```--disable=assignment-from-no-return``` 

![Pylint Args](/img/pylintargs.png)

#### Install MyPy Type Checker Extension
We will use MyPy to report type errors in our programs.

1. In the Extensions tab, search for “Mypy Type Checker” and click Install.
2. Open the Settings (as you did in the previous step).
3. In the `Args` section, add these five args (one at a time):
  - ```--strict```
  - ```--disallow-untyped-defs```
  - ```--disable-error-code=empty-body```
  - ```--disable-error-code=return```
  - ```--explicit-package-bases``` 

See: ![MyPy Args](/img/mypyarg.png)

Now, any missing or mismatched types will be reported in the "Problems" tab (bottom pane where there is also an Output tab) every time you save or open a file


## 3 Installing Git
For homeworks and labs, we will use Git version control to keep track of changes, push, and pull from GitHub. Lets set that up

### macOS
1) In a terminal (either in VS Code, or the Terminal app), run the following command:
```bash
git --version
```
    - If the output looks something like ``git version 2.50.1`` (any version number should be fine), then you can skip this step and go to [Get Setup](#32-git-setup)
2) If you get an error, the following popup should appear:
![Command Line Developer Tools Popup](/img/Command-Line-Dev-Tools-Popup.png)
3) Click install and wait for it to complete
4) Quite VS Code, then reopen it
5) Confirm it worked by running the command above again

### Windows
1) In a terminal (either in VS Code, or the Command Prompt or PowerShell apps), run the following command:
```bash
git --version
```
    - If the output looks something like ``git version 2.50.1`` (any version number should be fine), then you can skip this step and go to [Get Setup](#32-git-setup)
2) If you get an error, visit [git-scm.com/install/](https://git-scm.com/install/windows), select Windows, and click where it says "Click here to download the latest" at the top
3) Follow the installation instructions
4) Quite VS Code, then reopen it
5) Confirm it worked by running the command above again

### 3.2 Git Setup
1) <strong id="configure-git">Before you can commit & push, you must configure Git.</strong>

   a) Start a VSCode Terminal (Terminal -> New Terminal).

   b) Type `git config --global user.name "YOUR_NAME"` and hit enter (putting your own name instead of YOUR_NAME)

   c) Type `git config --global user.email "YOUR_EMAIL@northeastern.edu"` and hit enter (putting your own email instead of YOUR_EMAIL)

2) Whenever you want to commit & push, go to the Source Control panel as you did in Github.dev. You will be presented with a menu that defaults to Commit only. You will find the **Commit & Push** option in the menu activated via the small icon just to the right of the defeault Commit action. 


## 4 Your First Python Project
Let's use VSCode to create a project folder, and set up **virtual environment**
  
### 4.1 Set Up Project Folder And Python File
1. Open VS Code
2. Click on the **Explorer** icon on the left sidebar (top-left most icon) in the image below. 
3. Click Open Folder
![VSCode Open Folder](/img/vscode-folder.png)
4. In the dialog that appears:
    - Choose where you want your folder (e.g., Desktop or Documents). **You must not create your folder within your One Drive folder.**
    - Click **New Folder**
    - Name it `cs2000-day24` , then click Select Folder (Windows) or Open (Mac)
5. Once the folder opens in VS Code, look at the **Explorer** panel. It should now show your folder name at the top. (You might be asked whether you trust the authors.)
6. Hover over the folder name, and click on the **New File** icon.
7. Type `scratch.py` for the filename and press **Enter**. The file will open in the editor.
  
### 4.2 Check Python Environments Extension
**Important** Look in the sidebar, perhaps three dots, and check if you see the Python icon:
    ![VSCode Python Sidebar](/img/vscode-python-sidebar.png)

If it is **not there**, go to VSCode's Settings menu
    - Mac: `Code` > `Settings...` > `Settings` (or `Cmd` + `,`)
    - Windows: `File` > `Preferences` > `Settings` (or `Ctrl` + `,`):
      
Type "Environments Extension" in the search bar. Check the "Python: Use Environments Extension" box. Exit and restart VSCode, and the Python symbol should appear. 
    ![VSCode Enable Environments](/img/vscode-environments-enable.png)


### 4.3 Now Set Up The Virtual Environment
> We will use a per‑project virtual environment named `.venv` so tools run consistently.

1. Press `Cmd/Ctrl + Shift + P` and at the `>` prompt type **Python: Create Environment**.
2. If prompted, choose "Quick Create", which should say "Uses Python version 3.XX", where XX is the version you installed.
    - You may be prompted to choose a virtual environment, be sure to choose `Venv`
    - Be sure to select the appropriate Python version
3. Once the operation completes, you’ll see the Python version displayed in the bottom-right corner of the window when a `.py` file is open, written as `.venv (3.XX)`.

4. If MyPy is set up properly, then add this code to our `scratch.py` file:

    ```python
    def add(num1: int, num2) -> int:
        return num1 + num2

    result: str = add(3, 'hi')

    def func() -> int:
        pass
    ```

Once we save, you should see three errors in red (there will also be warnings from Pylint, in blue, about missing doc strings, both for the functions, and at the top of the file):
    1. `num2`'s missing type
    2. `add()`'s returning something other than the promised `int`, 
    3. `result`'s value being an `int` when the variable type is `str`.


## 5 Install **pandas**, **pandas-stubs**, And **pytest**
Each project we work in should have its own virtual environment, which means it will have its own set of packages; a package consists of existing pieces of software that allow us to work on particular tasks. 

We will use [Pandas](https://pandas.pydata.org/), a popular library for data analysis, for work with tables and spreadsheets, and the [pytest](https://docs.pytest.org/en/stable/) library for writing tests.

You can add Pandas & Pytest to your virtual environment by clicking on the Python icon in the side bar (it may be hidden behind the three dots -- if you don't see this, please review [3.2](#32-check-python-environments-extension) above, and that you installed the Python Environments extension):

![VSCode Python Icon](/img/vscode-python-sidebar.png)

Then, under Environment Managers, find your Venv as `.venv (3.XX)`, and click the little icon that says "Manage Packages" when you hover over it:

![VSCode venv packages](/img/venvpackages.png)

Now type "pandas" and check both "pandas", "pandas-stubs":

![VSCode Pandas Pkg](/img/pandaspkg.png)

And also search for and check "pytest", and now hit "OK":

![VSCode Pytest Pkg](/img/vscodepytest.png)


## 6 Log Into **Github** In **VSCode**
1. Click on the accounts icon in the bottom left of VSCode:
  ![VSCode Login](/img/vscodesignin.png)

1. Click "Sign in" (or, if that's not an option, "Sign in to use AI features..." or "Sign in to use Copilot").
   
1. Select "Github", and follow prompts in browser that pops up.

1. You should be redirected back to VSCode, and now if you click on the same icon, it should now say `yourusername (Github)` at the top.

### 6.1 VSCode: Disable AI Autocomplete
- Using AI autocomplete is against our course [AI Policy](/syllabus#the-ai-policy), so we need to disable Copilot/any AI autocompletions.

  > **Note:** If this is your first time installing VSCode, you can likely skip this step. It’s mainly for people who already had VSCode installed and might have GitHub Copilot or another AI completion tool enabled.  Do not enable any AI completions for the remainder of this course.

  1. In VSCode, open the **Extensions** tab on the left sidebar. It looks like this:
  ![VSCode Extensions Icon](/img/vscode-ext.png)
  2. In the search bar, type **“Copilot”**.
  3. If you see **GitHub Copilot** or **Copilot Chat** extensions:
  ![VSCode Github Copilot Extension](/img/vscode-copilot.png)
     - Click **Disable**
  4. Repeat for any other AI completion extensions you may have (e.g., Codeium, Tabnine, CodeWhisperer).
  5. Restart VSCode.

### 6.2 Access Homework Repository
1. To get one of your HW repositories, first find it on Github.com (follow the link from Pawtograder). Click on the green Code button, click on the HTTPS option, and click the icon to copy the url.

   ![Github HTTPS Code](/img/githubhttps.png)
  
1. Now open a **new VSCode window** (`File` > `New Window`), and then click on the Source Control icon. (If you don't see, type Control-Shift-G.) Click the button that says "Clone Repository". Paste the url you got in the previous step into the text field that pops up. Select "Clone from URL".

   ![VSCode Clone](/img/vscodeclone.png)

1. The first time you Clone a Repository, you will be asked to authenticate with Github.

1. VSCode will prompt you to select a folder where it will store this on your computer. Remember where you place it!

1. If you get an error about "Github SSO" (seems to occur on Windows), please follow these instructions:
  
    a. Download GitHub CLI from [cli.github.com](https://cli.github.com/) and follow the instructions when prompted in the popup.
        ![Github CLI Download](/img/ghcli.png)

    b. Type in `gh auth login` in a VSCode Terminal (Terminal Menu -> New Terminal), pick “GitHub.com”, HTTPS, Y, “Login with a web browser”, then press Enter.

    c. Authorize github, then quit VSCode and reopen it to ensure changes are saved.

    d. Redo the “Clone repository” instructions and you should have access now.

1. Once you open the repository, you can say "Yes, Trust the Authors"

    ![VSCode Trust](/img/vscodetrust.png)

1. Create a Virtual Environment for the HW. **NOTE: YOU MUST DO THIS FOR EVERY Python HW/LAB**  

    1. Press `Cmd/Ctrl + Shift + P` → type **Python: Create Environment**.
    1. Choose "Quick Create", which should say "Uses Python version 3.XX", where that was the version you installed.
    1. You’ll see the Python version displayed in the bottom-right corner once a `.py` file is open, written as `.venv (3.XX)`.
