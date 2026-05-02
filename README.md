# Personal Trainer Frontend Project

Final project for the **Frontend Programming** course.

This project is a React frontend application for a Personal Trainer company. The application uses an external REST API to manage customers and their trainings.

## Live Demo

Deployed app:

https://rakhimichi.github.io/personal-trainer-project/

## GitHub Repository

https://github.com/rakhimichi/personal-trainer-project

## Project Description

The application allows a personal trainer to manage customer data and training sessions. It includes customer and training list pages, CRUD functionality, CSV export, calendar view, and statistics.

The app is built as a frontend-only project and communicates with a ready-made REST API.

REST API documentation:

https://juhahinkula.github.io/personaltrainerdocs/

## Main Features

### Customers

- View all customers in a table
- Sort customer data
- Search and filter customers
- Add a new customer
- Edit existing customer information
- Delete customer with confirmation dialog
- Export customers to CSV file

### Trainings

- View all trainings in a table
- Sort training data
- Search and filter trainings
- Show customer name for each training
- Show formatted training date and time
- Add training to a customer
- Use date and time picker for training date
- Delete training with confirmation dialog

### Calendar

- View all trainings in a calendar
- Monthly, weekly, and daily calendar views
- Training events show activity and customer name
- Event duration is calculated from training duration

### Statistics

- View total trainings
- View total training minutes
- View number of different activities
- Bar chart showing total minutes grouped by activity

## Technologies Used

- React
- TypeScript
- Vite
- React Router
- Material UI
- MUI DataGrid
- MUI Date Pickers
- FullCalendar
- Recharts
- Lodash
- Dayjs
- GitHub Pages

## Project Structure

```text
src/
├── api/
│   ├── customers.ts
│   └── trainings.ts
├── components/
│   ├── ConfirmDialog.tsx
│   ├── CustomerDialog.tsx
│   ├── Navbar.tsx
│   └── TrainingDialog.tsx
├── constants/
│   └── api.ts
├── pages/
│   ├── CalendarPage.tsx
│   ├── CustomersPage.tsx
│   ├── StatisticsPage.tsx
│   └── TrainingsPage.tsx
├── types/
│   ├── customer.ts
│   └── training.ts
├── App.tsx
├── index.css
└── main.tsx
