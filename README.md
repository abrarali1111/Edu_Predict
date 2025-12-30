# EduPredict - Student Retention Prediction System

A full-stack application for predicting student dropout risk using machine learning.


Dataset Link: https://www.kaggle.com/datasets/thedevastator/higher-education-predictors-of-student-retention


## Project Structure

```
Edu_Predict/
├── backend/                    # Django Backend
│   ├── edu_predict/           # Project configuration
│   │   ├── settings.py        # Django settings (DRF, JWT, CORS)
│   │   └── urls.py            # Main URL routing
│   ├── predictions/           # Main application
│   │   ├── ml_models/         # ⬅️ PLACE YOUR PICKLE FILES HERE
│   │   │   ├── model.pkl      # XGBoost classifier
│   │   │   ├── scaler.pkl     # StandardScaler
│   │   │   └── label_encoder.pkl # LabelEncoder
│   │   ├── models.py          # Student model (36 features)
│   │   ├── utils.py           # ML inference logic
│   │   ├── views.py           # API endpoints
│   │   ├── serializers.py     # DRF serializers
│   │   ├── permissions.py     # RBAC permissions
│   │   └── urls.py            # App URL routing
│   └── manage.py
│
└── frontend/                   # Next.js Frontend
    ├── app/
    │   ├── page.tsx           # Main dashboard page
    │   ├── layout.tsx         # Root layout
    │   └── globals.css        # Global styles
    ├── components/
    │   ├── Dashboard.tsx      # Main dashboard component
    │   ├── PredictForm.tsx    # Multi-step prediction form
    │   ├── GaugeChart.tsx     # Dropout risk gauge
    │   └── RadarComparison.tsx # Grade comparison radar
    └── lib/
        └── api.ts             # API client with JWT

```

## Quick Start

### 1. Place Your ML Models

Copy your pickle files to:
```
backend/predictions/ml_models/
├── model.pkl
├── scaler.pkl
└── label_encoder.pkl
```

### 2. Start Backend

```bash
cd backend
python manage.py runserver
```

The API will be available at `http://localhost:8000`

### 3. Start Frontend

```bash
cd frontend
npm run dev
```

The dashboard will be available at `http://localhost:3000`

## API Endpoints

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/predict/` | POST | Get dropout prediction | Teacher/Admin |
| `/api/students/` | GET | List student records | Authenticated |
| `/api/students/` | POST | Create student record | Authenticated |
| `/api/students/<id>/` | GET/PUT/DELETE | Student detail | Owner/Teacher/Admin |
| `/api/class-average/` | GET | Class grade averages | Authenticated |
| `/api/health/` | GET | Health check | Public |
| `/api/token/` | POST | Get JWT token | Public |
| `/api/token/refresh/` | POST | Refresh JWT token | Public |

## User Groups (RBAC)

- **Admin**: Full access to all features
- **Teacher**: View all students, make predictions
- **Student**: View own data only

## Creating Users

```bash
cd backend

# Create superuser (Admin)
python manage.py createsuperuser

# Access admin panel at http://localhost:8000/admin/
# - Create additional users
# - Assign users to groups (Admin, Teacher, Student)
```

## Features

- ✅ 36-feature Student model
- ✅ XGBoost dropout prediction
- ✅ Grade_Trend feature engineering
- ✅ JWT Authentication
- ✅ Role-based access control
- ✅ Multi-step prediction form
- ✅ Dropout risk gauge chart
- ✅ Grade comparison radar chart
- ✅ High-risk intervention alerts (>70% dropout probability)

## Tech Stack

- **Backend**: Django 6.0, Django REST Framework, SimpleJWT
- **Frontend**: Next.js 16, React, Tailwind CSS, Recharts
- **ML**: XGBoost, scikit-learn
- **Database**: SQLite (default)
