# Enterprise Agent Platform ROI Modeler

This repository contains the source code for the Enterprise Agent Platform ROI Modeler application. The app allows organizations to estimate and compare the costs of implementing AI agents using different models such as Gemini 3.5 Pro/Flash, Claude 3.5/4.x Sonnet/Opus, and ChatGPT/Codex (GPT-5.4/5.5) models.

## Project Structure

The project is structured using vanilla web technologies:
- `index.html`: The main structural entry point of the app.
- `css/style.css`: Contains the extracted CSS, design tokens, responsive layouts, and glassmorphism styling.
- `js/main.js`: Contains the logic for the ROI calculations, interactive sliders, configuration panels, and event listeners.

## Running Locally

Because this is a vanilla HTML/CSS/JS application, you don't need any complex build tools to run it.

1.  **Directly via Browser**:
    You can simply open the `index.html` file in any modern web browser to view the application.

2.  **Using a Local Dev Server** (Recommended):
    If you have Python installed, you can start a simple HTTP server:
    ```bash
    python -m http.server 8000
    ```
    Then, navigate to `http://localhost:8000` in your browser.

    If you prefer Node.js, you can use `npx`:
    ```bash
    npx serve
    ```

## Customization

- **Design Tokens**: Colors, fonts, and other variables can be customized in the `:root` pseudo-class located at the top of `css/style.css`.
- **Logic**: The calculation parameters, base pricing, and token logic are defined at the top of `js/main.js`. You can tweak these constant values to adjust the pricing model as needed.

## License

This source code is provided as-is for educational and replication purposes.
