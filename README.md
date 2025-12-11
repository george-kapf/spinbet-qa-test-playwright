# SpinBet Quality Automation

## 1. Problem and Solution

**The Problem**
Ensuring the reliability and quality of the SpinBet user experience requires rigorous testing of critical user flows. Manual testing is time-consuming, prone to human error, and difficult to scale across different environments and release cycles. Key areas such as **User Registration** and **Casino Game Search** are fundamental to business revenue and user retention, making them high-priority candidates for automation.

**The Solution**
This repository delivers a robust, automated End-to-End (E2E) testing suite for SpinBet. It automates:

- **User Registration**: Verifying the multi-step sign-up flow, including form validation, data entry, and successful account creation logic.
- **Casino Search**: Validating game discovery mechanics, ensuring users can find and launch games effectively via direct, partial, and case-insensitive queries.

The solution is built to be run both locally by developers/QA and automatically in CI/CD pipelines, providing rapid feedback on system health.

## 2. Technical Choices and Reasoning

### **Framework: Playwright + TypeScript**

- **Speed & Reliability**: Playwright's auto-waiting mechanism significantly reduces flaky tests compared to Selenium or Cypress. It natively handles modern web features like shadow DOM and iframes (critical for game launchers).
- **Typing**: TypeScript ensures type safety across our data models and Page Objects, reducing runtime errors and improving developer experience with autocompletion.
- **Parallel Execution**: Native support for parallel test execution enables faster feedback loops.

### **Design Pattern: Page Object Model (POM)**

- **Maintainability**: Locators and interaction logic are encapsulated within `pages/` classes (`CasinoLobbyPage`, `RegistrationPage`).
- **Reusability**: Navigation and action methods are reusable across different test specs.
- **Readability**: Tests in `tests/` read like high-level user stories (e.g., `user.login()`, `lobby.searchForGame()`) rather than low-level DOM manipulations.

### **Data Management**

- **Environment Variables**: Sensitive credentials are managed via `.env` files, ensuring security and separating configuration from code.
- **Dynamic Data**: Helper functions (`generateUniqueUsername`, `generateUniqueEmail`) ensure test isolation by creating fresh user data for every registration run, preventing data collision.

### **CI/CD: GitHub Actions**

- **Automation**: A configured workflow (`.github/workflows/ci.yml`) runs tests on every push to `main` and on a daily schedule (5 AM UK time), ensuring regression issues are caught early.

---

## 3. Setup and Installation

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (LTS version recommended)
- npm

### Installation

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Install Playwright Browsers**

    ```bash
    npx playwright install --with-deps
    ```

4.  **Configure Environment**
    This project requires environment variables for authentication. Copy the example file to create your local interface.

    ```bash
    cp .env.example .env
    ```

    _(Note: For this assessment, `.env.example` contains the valid credentials required to run the tests immediately.)_

### Running Tests

- **Run All Tests (Headless)**

  ```bash
  npx playwright test
  ```

- **Run Tests with UI (Interactive Mode)**

  ```bash
  npx playwright test --ui
  ```

- **Run Specific Test File**
  ```bash
  npx playwright test tests/casinoSearch.spec.ts
  ```

### Project Structure

- `tests/`: Contains test specifications (`.spec.ts`).
- `pages/`: Page Object Model classes.
- `utils/`: Helper functions and static data.
- `.github/workflows/`: CI configuration.
- `playwright.config.ts`: Main configuration file.
