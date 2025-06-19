import os
import gdown
from flask import Flask, jsonify, render_template
from sqlalchemy import create_engine, text

# ============================
# Configuration
# ============================

# Google Drive File ID
FILE_ID = '1HU3PxbbopT7TWiiAYigQm4Zl1JsUED7E'  # Replace with your actual Google Drive file ID

# Download URL constructed from File ID
DOWNLOAD_URL = f'https://drive.google.com/uc?id={FILE_ID}'

# Local path to save the downloaded database
LOCAL_DB_PATH = 'Global_Electronics_Sales_Data.db'  # Modify as needed

# ============================
# Function to Download Database
# ============================

def download_database():
    """
    Downloads the SQLite database from Google Drive if it doesn't exist locally.
    """
    if not os.path.exists(LOCAL_DB_PATH):
        print("Database not found locally. Downloading from Google Drive...")
        try:
            gdown.download(DOWNLOAD_URL, LOCAL_DB_PATH, quiet=False)
            print("Download completed successfully.")
        except Exception as e:
            print(f"An error occurred while downloading the database: {e}")
            exit(1)
    else:
        print("Database already exists locally. Skipping download.")

# ============================
# Initialize Database
# ============================

# Download the database before creating the engine
download_database()

# Create the SQLAlchemy engine pointing to the local DB file
db_url = f'sqlite:///{LOCAL_DB_PATH}'
engine = create_engine(db_url, echo=True)

# ============================
# Initialize Flask App
# ============================

app = Flask(__name__)

@app.route('/favicon.ico')
def favicon():
    return ''

@app.route('/')
def index():
    return render_template('index.html')

# ============================
# Define Routes for Charts
# ============================

# Chart 1: Employee Count by Country
@app.route('/get-employee-count-by-country')
def get_employee_count_by_country():
    print("Accessing /get-employee-count-by-country endpoint...")

    with engine.connect() as conn:
        query = text("""
            SELECT Country, AVG(EmployeeCount) AS AverageEmployeeCount
            FROM sales_data
            GROUP BY Country
        """)
        
        result = list(conn.execute(query))
        data = [
            {'Country': row[0], 'AverageEmployeeCount': row[1]} 
            for row in result
        ]

    return jsonify(data)

# Chart 2: Country Sales Count
@app.route('/get-country-sales-count')
def get_country_sales_count():
    print("Accessing /get-country-sales-count endpoint...")

    with engine.connect() as conn:
        query = text("""
            SELECT Country, Branch, SUM(SalesQuantity) AS BranchSalesCount
            FROM sales_data
            GROUP BY Country, Branch
        """)
        result = list(conn.execute(query))

    # Organize data in the desired format
    data = []
    for row in result:
        country_entry = next(
            (entry for entry in data if entry['category'] == row[0]),
            None
        )

        if country_entry is None:
            # If the country doesn't exist in data, add a new entry
            country_entry = {'category': row[0], 'value': 0, 'subData': []}
            data.append(country_entry)

        # Update the total sales count for the country
        country_entry['value'] += row[2]

        # Add branch entry to subData
        country_entry['subData'].append({
            'category': row[1],
            'value': row[2]
        })

    return jsonify(data)

# Chart 3: Sales Count by Product
@app.route('/get-sales-count-by-product')
def get_sales_count_by_product():
    print("Accessing /get-sales-count-by-product endpoint...")

    with engine.connect() as conn:
        query = text("""
            SELECT Product, SUM(SalesQuantity) AS SalesCount
            FROM sales_data
            GROUP BY Product
        """)
        result = list(conn.execute(query))

    data = [{'product': row[0], 'salesCount': row[1]} for row in result]
    return jsonify(data)

# Chart 4: Product Revenue
@app.route('/get-product-revenue')
def get_product_revenue():
    print("Accessing /get-product-revenue endpoint...")

    with engine.connect() as conn:
        query = text("""
            SELECT Product, Year, Month, SUM(Revenue) AS ProductRevenue
            FROM sales_data
            GROUP BY Product, Year, Month
        """)
        result = list(conn.execute(query))

    data = [
        {
            'Product': row[0],
            'Year': row[1],
            'Month': row[2],
            'ProductRevenue': row[3]
        }
        for row in result
    ]
    return jsonify(data)

# Chart 5: Revenue Composition by Product
@app.route('/get-revenue-composition-by-product')
def get_revenue_composition_by_product():
    print("Accessing /get-revenue-composition-by-product endpoint...")

    with engine.connect() as conn:
        query = text("""
            SELECT Year, Product, SUM(Revenue) AS TotalRevenue
            FROM sales_data
            GROUP BY Year, Product
        """)
        result = list(conn.execute(query))
        
    # Organize data in the desired format
    data = []
    # Extract distinct years from the result
    distinct_years = sorted(set(row[0] for row in result))

    for year in distinct_years:
        year_data = {"year": str(year)}
        # Grab each row belonging to that year
        for row in result:
            if row[0] == year:
                # The product is row[1], convert to lowercase key
                product_key = row[1].lower()
                # The revenue is row[2]
                year_data[product_key] = float(row[2])
        data.append(year_data)

    return jsonify(data)

# ============================
# Run the Flask App
# ============================

if __name__ == '__main__':
    app.run(debug=True)
