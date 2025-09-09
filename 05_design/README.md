# Product Management UI

A modern, responsive React-based user interface for the Product Management FastAPI backend. This UI provides a comprehensive product management system with a clean, professional design.

## Features

### 🎨 Modern Design
- Clean, minimalist interface using Tailwind CSS
- Responsive design that works on all devices
- Professional color scheme with blue primary colors
- Smooth animations and transitions
- Toast notifications for user feedback

### 📊 Dashboard Overview
- **Statistics Cards**: Display key metrics at a glance
  - Total Products count
  - Total Inventory Value
  - Low Stock Items count
- **Real-time Updates**: Stats update automatically when data changes

### 🛍️ Product Management
- **Product List View**: Clean table layout with all essential information
- **Search Functionality**: Real-time search by product name or description
- **Stock Status Indicators**: Visual badges showing stock levels
  - Green: In Stock (10+ items)
  - Yellow: Low Stock (1-9 items)  
  - Red: Out of Stock (0 items)
- **Quick Actions**: Edit and delete buttons for each product

### ✨ Product Operations
- **Add New Products**: Modal form with validation
- **Edit Products**: Pre-filled form for updates
- **View Product Details**: Comprehensive modal with all product information
- **Delete Products**: Confirmation dialog for safety

### 🔧 Technical Features
- **Form Validation**: Real-time validation with helpful error messages
- **Loading States**: Smooth loading indicators during API calls
- **Error Handling**: User-friendly error messages
- **API Integration**: Full integration with FastAPI backend
- **CORS Support**: Configured for cross-origin requests

## Technology Stack

- **Frontend Framework**: React 18
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Feather Icons)
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Notifications**: React Toastify
- **Build Tool**: Vite
- **UI Components**: Headless UI (for accessible components)

## API Integration

The UI integrates with all FastAPI endpoints:

- `GET /products/` - Fetch all products
- `POST /products/` - Create new product
- `GET /products/{id}` - Get single product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- FastAPI backend running on `http://localhost:8000`

### Installation

1. Navigate to the design folder:
   ```bash
   cd 05_design
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and go to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Project Structure

```
05_design/
├── src/
│   ├── components/
│   │   ├── ProductList.jsx      # Main product listing component
│   │   ├── ProductForm.jsx      # Add/Edit product modal
│   │   ├── ProductDetails.jsx   # Product detail modal
│   │   ├── StatsCard.jsx        # Statistics card component
│   │   └── LoadingSpinner.jsx   # Loading indicator
│   ├── api.js                   # API service layer
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles with Tailwind
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Configuration

### API Base URL
The API base URL is configured in `src/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000';
```

Change this to match your FastAPI backend URL.

### Vite Proxy
The Vite configuration includes a proxy for API calls:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

## Styling

The UI uses Tailwind CSS with custom utility classes defined in `index.css`:
- `.btn-primary`, `.btn-secondary`, `.btn-danger` - Button styles
- `.form-input`, `.form-label` - Form element styles
- `.card`, `.card-header` - Card component styles
- `.badge-success`, `.badge-warning`, `.badge-danger` - Status badge styles

## Responsive Design

The UI is fully responsive with:
- Mobile-first design approach
- Responsive grid layouts
- Collapsible navigation on smaller screens
- Touch-friendly button sizes
- Readable typography at all screen sizes

## Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Screen reader friendly

## Future Enhancements

Potential improvements to consider:
- Pagination for large product lists
- Advanced filtering options
- Bulk operations (delete multiple products)
- Product categories/tags
- Image upload support
- Export functionality
- Dark mode theme
- Advanced search with filters
- Product comparison feature
