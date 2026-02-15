# CakeStreet

A modern, full-stack cake e-commerce platform with an interactive cake designer tool, built with Laravel, React, and TypeScript.

![Neo-Brutalism Design](https://img.shields.io/badge/Design-Neo--Brutalism-FFD700?style=for-the-badge)
![Laravel](https://img.shields.io/badge/Laravel-11+-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

## About

CakeStreet is a comprehensive cake e-commerce solution that allows customers to browse, customize, and order cakes online. The platform features an interactive cake designer powered by Fabric.js, enabling users to create custom cake designs with layers, text, drawings, and images. Bakery owners can manage their products, track orders, and respond to custom design requests through an intuitive dashboard.

### Key Features

- **Product Catalog**: Browse cakes with advanced filtering by category, flavor, and dietary requirements
- **Interactive Cake Designer**: Full-featured canvas tool with layers, drawing, text, and image support using Fabric.js
- **Shopping Cart & Checkout**: Seamless ordering experience with cart management
- **Payment Integration**: Supports M-Pesa and Stripe payment gateways
- **Bakery Owner Dashboard**: Complete product and order management system
- **Analytics**: Sales statistics and performance tracking
- **Multi-Role Authentication**: Customer, Owner, and Admin roles with OAuth support
- **Responsive Design**: Beautiful neo-brutalism aesthetic across all devices

## Technology Stack

### Backend
- **Laravel 11+** - PHP framework with Breeze for authentication
- **PostgreSQL** - Relational database
- **Inertia.js** - Server-side rendering bridge
- **Spatie Permissions** - Role and permission management
- **Laravel Sanctum** - API authentication

### Frontend
- **React 18+** - UI library
- **TypeScript** - Type-safe JavaScript (strict mode)
- **TailwindCSS** - Utility-first CSS framework
- **Fabric.js** - HTML5 canvas library for cake designer
- **React Query** - Data fetching and state management
- **Zustand** - Lightweight state management

### Payment Gateways
- **M-Pesa API** - Mobile money integration
- **Stripe** - Credit card processing

## Getting Started

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cakestreet.git
   cd cakestreet
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install JavaScript dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure database**
   
   Update your `.env` file with PostgreSQL credentials:
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=cakestreet
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

6. **Run migrations and seeders**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

7. **Create storage link**
   ```bash
   php artisan storage:link
   ```

8. **Build frontend assets**
   ```bash
   npm run build
   ```

9. **Start development servers**
   
   Terminal 1:
   ```bash
   php artisan serve
   ```
   
   Terminal 2:
   ```bash
   npm run dev
   ```

10. **Access the application**
    
    Open your browser and visit: `http://localhost:8000`

## Default Test Accounts

After seeding, you can log in with:

**Admin Account:**
- Email: `admin@cakestreet.com`
- Password: `password`

**Owner Account:**
- Email: `owner@cakestreet.com`
- Password: `password`

**Customer Account:**
- Email: `customer@cakestreet.com`
- Password: `password`

## Project Structure

```
cakestreet/
├── app/
│   ├── Http/
│   │   ├── Controllers/      # API and web controllers
│   │   ├── Middleware/       # Custom middleware
│   │   └── Requests/         # Form validation requests
│   ├── Models/               # Eloquent models
│   └── Services/             # Business logic services
├── database/
│   ├── migrations/           # Database migrations
│   ├── seeders/              # Database seeders
│   └── factories/            # Model factories
├── resources/
│   ├── js/
│   │   ├── Components/       # React components
│   │   ├── Layouts/          # Page layouts
│   │   ├── Pages/            # Inertia pages
│   │   ├── Stores/           # Zustand stores
│   │   └── Types/            # TypeScript types
│   └── views/                # Blade templates
├── routes/
│   ├── web.php               # Web routes
│   └── api.php               # API routes
└── tests/                    # Test files
```

## Design System

CakeStreet uses a **Neo-Brutalism** design aesthetic:

- **Thick borders**: 3-4px solid black outlines
- **Bold shadows**: `shadow-brutal` (8px 8px 0 0 #000)
- **High contrast**: Rich chocolate and coffee color palette
- **Bold typography**: Strong, impactful fonts
- **Raw design**: Minimal rounded corners, maximum impact

### Color Palette

```css
Chocolate Brown: #3E2723
Coffee Black: #1C1C1C
Cream White: #FFF8E1
Accent Gold: #FFD700
```

## User Roles & Permissions

### Customer
- Browse and search products
- Use cake designer tool
- Place orders
- Track order status
- Leave reviews

### Owner
- All customer features
- Manage bakery profile
- Create/edit/delete products
- View and manage orders
- Respond to custom design requests
- Access analytics dashboard

### Admin
- All owner features
- Manage multiple bakeries
- System-wide configuration
- User management

## Testing

Run the test suite:

```bash
# PHP tests
php artisan test

# JavaScript tests
npm run test

# End-to-end tests
npm run test:e2e
```

## Key Packages

### Backend
- `laravel/breeze` - Authentication scaffolding
- `inertiajs/inertia-laravel` - Server-side rendering
- `spatie/laravel-permission` - Role management
- `intervention/image` - Image manipulation

### Frontend
- `fabric` - Canvas manipulation
- `@tanstack/react-query` - Server state management
- `zustand` - Client state management
- `react-hook-form` - Form handling
- `zod` - Schema validation

## Deployment

### Production Checklist

- [ ] Update `.env` with production values
- [ ] Set `APP_ENV=production` and `APP_DEBUG=false`
- [ ] Configure production database
- [ ] Set up queue workers
- [ ] Configure payment gateway credentials
- [ ] Enable SSL certificate
- [ ] Set up cron jobs for scheduled tasks
- [ ] Configure file storage (S3, etc.)
- [ ] Set up logging and monitoring
- [ ] Run database migrations
- [ ] Build optimized assets: `npm run build`

### Recommended Hosting
- **Backend**: Laravel Forge, DigitalOcean, AWS
- **Database**: Managed PostgreSQL (AWS RDS, DigitalOcean)
- **Storage**: Amazon S3, DigitalOcean Spaces
- **CDN**: CloudFlare, AWS CloudFront

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open-source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [Laravel](https://laravel.com)
- UI powered by [React](https://react.dev)
- Canvas functionality by [Fabric.js](http://fabricjs.com)
- Generated with [Cursor AI](https://cursor.sh)

## Contact

For questions or support, please open an issue on GitHub.

---