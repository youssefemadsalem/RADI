# RADI Front-End Application

RADI is a modern, responsive, and animated e-commerce storefront and administration panel built with the latest web technologies. It provides a seamless shopping experience for customers and a comprehensive backoffice for administrators.

## 🚀 Technology Stack

This project leverages a cutting-edge frontend stack to deliver high performance and rich user experiences:

- **Framework**: [Angular 21](https://angular.dev/) with Server-Side Rendering (SSR) support.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & PostCSS for utility-first, highly customizable designs.
- **Animations**: [GSAP](https://gsap.com/) for complex, high-performance UI micro-animations and transitions.
- **Components & UI**: 
  - [Swiper](https://swiperjs.com/) for interactive touch-enabled carousels.
  - [Lucide Icons](https://lucide.dev/) (`@lucide/angular`) for clean and consistent iconography.
- **State & Reactivity**: [RxJS](https://rxjs.dev/) combined with Angular Services.
- **Testing**: [Vitest](https://vitest.dev/) for blazing fast unit testing.

## 📁 Project Structure & Features

The application architecture is divided into three main operational scopes:

### 1. Storefront (Customer Facing)
The public-facing e-commerce platform where users can browse and purchase products.
- **Shop & Catalog**: Browse products (`/shop`), view collections, and detailed product pages (`/product/:id`).
- **Cart & Checkout**: Interactive cart drawer, seamless checkout process (`/checkout`), and order confirmation (`/order-complete`).
- **Information Pages**: Comprehensive static pages including About, FAQ, Privacy Policy, Terms & Conditions, Returns & Exchanges, and Customer Care.

### 2. Authentication
Secure login and registration flows.
- **Auth Module**: Dedicated authentication portal (`/auth`).
- **Guards**: Client-side phase lock guards (`authGuard`) to secure protected routes.

### 3. Admin Backoffice
A secure, feature-rich dashboard for store managers. Protected by `adminGuard`.
- **Dashboard Overview**: High-level store metrics and analytics (`/admin/overview`).
- **Order Management**: Track and manage customer orders (`/admin/orders`).
- **Inventory Management**: Comprehensive product management including adding (`/admin/inventory/add-product`) and editing (`/admin/inventory/edit-product/:id`) products.

## 🛠️ Setup & Development

This project uses `npm` as the package manager.

### Prerequisites
- Node.js (v20+ recommended)
- npm (v11+ based on package-lock)

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <repository-url>
   cd RADI-front
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Development Server

Run the local development server:

```bash
npm start
```
Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Server-Side Rendering (SSR)

To test the application with SSR enabled locally:

```bash
npm run serve:ssr:RADI-front
```

### Building for Production

To build the project for production environments:

```bash
npm run build
```
The build artifacts will be stored in the `dist/` directory.

### Running Tests

Execute the unit tests via Vitest:

```bash
npm run test
```

## 🔒 Security & Routing

The application implements strict route guarding:
- **`authGuard`**: Ensures only authenticated users can access specific storefront features like checkout.
- **`adminGuard`**: Completely isolates the `/admin` backoffice routes, restricting access to users with administrative privileges only.

## 📝 Code Scaffolding

Angular CLI is used for code scaffolding. To generate a new component:

```bash
npx ng generate component components/component-name
```
