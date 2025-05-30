# Property Listing Web Application

A full-stack Node.js web application for listing, browsing, filtering, and managing real estate properties. Users can sign up, log in, create and edit property listings, filter properties with advanced criteria, and manage their favorite properties. Admin features and Redis caching are included.

---

## Features

- **User Authentication:** Sign up, log in, and log out with JWT-based authentication.
- **Property Management:** Create, update, and delete property listings (admin only).
- **Browse & Filter:** Browse all properties or filter by title, type, price, area, bedrooms, amenities, tags, and more.
- **Favorites:** Add or remove properties from your favorites, with Redis caching for fast access.
- **Responsive UI:** Built with EJS templates and Bootstrap for a modern, responsive interface.
- **Data Import:** Imports initial property data from a CSV file on server startup.
- **Admin Dashboard:** Manage your own listings and view your favorite properties.

---

## Tech Stack

- **Backend:** Node.js, Express.js, Mongoose (MongoDB)
- **Frontend:** EJS, Bootstrap 5
- **Authentication:** JWT, bcryptjs
- **Caching:** Redis
- **Database:** MongoDB

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB (running locally on default port)
- Redis (running locally on default port)

### Installation

1. **Clone the repository:**
   ```bash
   git clone {path}
   cd propertyListing


2. **Docker up**
    docker-compose up -d

3. **Firing up the Server**
    npm run dev

### To Remember

    Error handling is not great so its recommended to do graceful shutdown manually and do not forget to shut down docker with -v command to erase volumes else it will be a conflict

