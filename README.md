**SmartSpend: A MERN-Based Personal Expense Tracker
Overview**

SmartSpend is a web app built with the MERN stack (MongoDB, Express.js, React, Node.js).
It helps users track expenses with simple CRUD operations (create, read, update, delete) and view a dashboard with:

Monthly total spend

Top spending category

Donut chart of categories

Line chart of monthly spending trends

**Backend:**

cd backend
npm install
npm run dev

Create .env with:

MONGODB_URI=your_mongo_uri
PORT=5050


**Frontend:**

cd frontend
npm install
npm run dev

Create .env with:

VITE_API_URL=http://localhost:5050/api

**Features**

Add, edit, delete, and view expenses

Dashboard with charts and KPIs

Categories and payment methods

Friendly error messages

**Future Work**

AI-based categorization

Authentication (JWT)

Budget alerts and exports
