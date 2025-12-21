I will update the `RegisterPage.vue` file to match the visual style and layout of the `LoginPage.vue`. This involves porting the dynamic background, bubble animations, glassmorphism form style, and the interactive logo, while retaining the necessary registration fields (Username, Password, Confirm Password) and logic.

**Steps:**
1.  **Update `src/views/RegisterPage.vue`**:
    *   **Template**:
        *   Add the `.background-animation` with floating bubbles.
        *   Replace the static logo with the `<InteractiveLogo />` component (linked to password focus).
        *   Update the form structure to match the Login page's glassmorphism style.
        *   Add the "Confirm Password" input field.
        *   Change the "Login" button to a "Register" button.
        *   Update the bottom link to point to the Login page ("Already have an account? Login now").
    *   **Script**:
        *   Import `InteractiveLogo`.
        *   Add `isPasswordFocused` state to control the owl's eyes (triggered by focus on either password field).
        *   Retain the registration logic (`handleRegister`, `validateForm`) but adapt it to the new variable names and style.
        *   Ensure the success redirection goes to `/login?registered=true`.
    *   **Style**:
        *   Copy the CSS from `LoginPage.vue` (gradient background, animations, form styles).
        *   Ensure the color scheme matches the Login page (Yellow/Brown theme).

This will fix the "blank" page issue by providing a robust, styled layout and ensure consistency across the authentication pages.