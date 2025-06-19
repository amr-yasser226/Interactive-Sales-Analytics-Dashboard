# Sales and Operations Analytics Dashboard

This repository contains the source code for a comprehensive, web-based analytics dashboard built as a project for the **DSAI 203: Data Visualization and Integration** course. The application serves as a dynamic reporting tool for a multinational electronics company, providing insights into sales performance, revenue trends, and operational metrics across different countries and product lines.

The project is architected with a Python and Flask backend that handles data processing and API requests, and a sophisticated frontend that uses the am5Charts library to render interactive visualizations.

## Project Overview

The dashboard presents five distinct visualizations that together offer a holistic view of the business:

1.  **Product Revenue Breakdown:** A stacked bar chart displaying the annual revenue composition for each product category from 2020 to 2024.
2.  **Product Revenue Over Time:** A time-series line chart tracking monthly revenue fluctuations for each product, allowing for detailed trend analysis.
3.  **Product Sales Percentage:** A donut chart that shows the proportional sales volume of each product, highlighting top-performing items.
4.  **Revenue Distribution by Country and Branch:** A multi-level, interactive pie chart that visualizes revenue share by country and allows users to drill down to see performance by individual city branches.
5.  **Average Employee Count by Country:** A bar chart comparing the average number of employees in each country of operation, offering an operational scale perspective.

## System Architecture

The application operates on a client-server model:

1.  **Client (Frontend):** The user interacts with a single-page `index.html` file styled with CSS. JavaScript functions make asynchronous API calls (`fetch`) to the backend for each chart's data. The received JSON data is then rendered into interactive charts using the am5Charts library.
2.  **Server (Backend):** A Flask server written in Python responds to the API requests. It uses the SQLAlchemy Core to execute SQL queries against a local SQLite database. The backend is responsible for aggregating, transforming, and formatting the data into the specific JSON structures required by the frontend charts.
3.  **Database:** The application uses an SQLite database (`Global_Electronics_Sales_Data.db`). A key feature of the backend is its ability to automatically download the database file from a Google Drive link on the first run, ensuring the application is self-contained and easy to set up.

## Technology Stack

* **Backend:** Python 3, Flask, SQLAlchemy, Gdown
* **Database:** SQLite
* **Frontend:** HTML5, CSS3, JavaScript (ES6)
* **Visualization Library:** am5Charts
* **Environment Management:** Python `venv`

## Project Structure

```
.
├── Dashboard
│   ├── Global_Electronics_Sales_Data.db  # Database (downloaded on first run)
│   ├── Images/                           # Project images and screenshots
│   ├── server.py                         # Main Flask application logic and API
│   ├── static/                           # Static assets
│   │   ├── style.css
│   │   └── chart1.js, chart2.js, ...
│   ├── templates/                        # HTML templates
│   │   └── index.html
│   └── venv/                             # Python virtual environment
├── README.md                             # This documentation
├── Report.pdf                            # Detailed project report
├── requirements.txt                      # Python dependencies list
└── Roles of DSAI.pptx                    # Project presentation slides
```

## Local Setup and Installation

To run the dashboard on your local machine, please follow these instructions carefully.

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/your-username/Sales-Analytics-Dashboard.git](https://github.com/your-username/Sales-Analytics-Dashboard.git)
    cd Sales-Analytics-Dashboard
    ```

2.  **Navigate to the Application Directory**
    It is important to run the server from within the `Dashboard` directory.
    ```bash
    cd Dashboard
    ```

3.  **Create and Activate the Python Virtual Environment**
    * On macOS/Linux:
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```
    * On Windows:
        ```bash
        python -m venv venv
        .\venv\Scripts\activate
        ```

4.  **Install Dependencies**
    Install all required Python packages using the `requirements.txt` file located in the project's root directory.
    ```bash
    pip install -r ../requirements.txt
    ```

5.  **Run the Flask Server**
    Execute the `server.py` script.
    ```bash
    python server.py
    ```
    On the first run, you will see a message in the console indicating that the database is being downloaded from Google Drive. Subsequent runs will use the locally saved database file.

6.  **Access the Dashboard**
    Once the server is running, open your web browser and navigate to:
    [http://127.0.0.1:5000](http://127.0.0.1:5000)

The interactive Multinational Company Dashboard should now be fully functional in your browser.