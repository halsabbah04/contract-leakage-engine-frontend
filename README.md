# Contract Leakage Engine - Frontend

Modern React + TypeScript frontend for the AI-powered Contract Leakage Analysis System.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TanStack Query** - Server state management
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **date-fns** - Date formatting

## Design System

The frontend implements a **professional design system inspired by KPMG Master Guide standards**, matching the backend brand constants for consistency across PDF reports and web UI.

### Brand Colors

```typescript
// Primary brand colors
primary: '#1a237e'         // Deep blue
primary-light: '#1976d2'   // Accent blue
primary-dark: '#0d1b2a'    // Dark navy

// Severity colors (matching backend)
critical: '#d32f2f'        // Red
high: '#f57c00'            // Orange
medium: '#fbc02d'          // Yellow
low: '#388e3c'             // Green
```

## Project Structure

```
src/
├── components/              # Reusable UI components
│   └── layout/             # Layout components
│       ├── Layout.tsx      # Main layout wrapper
│       ├── Header.tsx      # Top navigation
│       └── Sidebar.tsx     # Side navigation
│
├── pages/                  # Page components (routes)
│   ├── HomePage.tsx        # Landing page
│   ├── UploadPage.tsx      # Contract upload
│   ├── ContractDetailPage.tsx
│   ├── FindingsPage.tsx
│   ├── ClausesPage.tsx
│   └── NotFoundPage.tsx
│
├── services/               # API service layer
│   ├── api.ts             # Axios client with interceptors
│   ├── contractService.ts # Contract operations
│   ├── findingsService.ts # Findings operations
│   ├── clausesService.ts  # Clauses operations
│   └── index.ts           # Service exports
│
├── utils/                  # Utility functions
│   └── format.ts          # Formatters (date, currency, severity)
│
├── App.tsx                 # Root component with routing
├── main.tsx               # App entry point
└── index.css              # Global styles and Tailwind
```

## Installation

### 1. Install Dependencies

```bash
cd contract-leakage-engine-frontend
npm install
```

### 2. Install Shared Types Package

```bash
# From shared-types directory
cd ../contract-leakage-engine-backend/shared-types
npm install
npm run build

# Link to frontend
cd ../../contract-leakage-engine-frontend
npm install ../contract-leakage-engine-backend/shared-types
```

Or for development with hot reload:

```bash
cd ../contract-leakage-engine-backend/shared-types
npm link

cd ../../contract-leakage-engine-frontend
npm link @contract-leakage/shared-types
```

### 3. Configure Backend Proxy

The Vite dev server is already configured to proxy `/api` requests to `http://localhost:7071` (Azure Functions backend).

Ensure your backend is running before starting the frontend:

```bash
# In backend directory
func start
```

### 4. Start Development Server

```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`.

## Available Scripts

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | HomePage | Landing page with feature overview |
| `/upload` | UploadPage | Contract file upload |
| `/contract/:contractId` | ContractDetailPage | Contract details and stats |
| `/contract/:contractId/findings` | FindingsPage | Leakage findings list |
| `/contract/:contractId/clauses` | ClausesPage | Extracted clauses viewer |
| `*` | NotFoundPage | 404 error page |

## API Services

### Contract Service

```typescript
import { contractService } from '@services';

// Upload contract
const response = await contractService.uploadContract(
  file,
  'Contract Name',
  'user@example.com'
);

// Analyze contract
await contractService.analyzeContract(contractId);

// Get contract details
const contract = await contractService.getContract(contractId);

// Download PDF report
await contractService.downloadReport(contractId, 'pdf', false);
```

### Findings Service

```typescript
import { findingsService } from '@services';

// Get all findings
const response = await findingsService.getFindings(contractId);

// Get findings by severity
const grouped = await findingsService.getFindingsBySeverity(contractId);

// Get total financial impact
const impact = await findingsService.getTotalFinancialImpact(contractId);
```

### Clauses Service

```typescript
import { clausesService } from '@services';

// Get all clauses
const response = await clausesService.getClauses(contractId);

// Get clauses by type
const grouped = await clausesService.getClausesByType(contractId);

// Search clauses
const results = await clausesService.searchClauses(contractId, 'payment');
```

## Utility Functions

### Formatting

```typescript
import {
  formatDate,
  formatCurrency,
  formatConfidence,
  getSeverityBadgeClasses,
  formatCategory,
} from '@utils/format';

// Format date
formatDate('2026-01-12T10:30:00Z');  // "January 12, 2026"

// Format currency
formatCurrency(150000, 'USD');  // "$150,000.00"

// Format confidence
formatConfidence(0.95);  // "95%"

// Get severity classes
getSeverityBadgeClasses(Severity.HIGH);  // "bg-severity-high text-white"
```

## Type Safety

All data models are imported from the shared types package:

```typescript
import type {
  Contract,
  Clause,
  LeakageFinding,
  Severity,
  GetFindingsResponse,
} from '@contract-leakage/shared-types';

// Type-safe component props
interface FindingCardProps {
  finding: LeakageFinding;
  onSelect: (id: string) => void;
}

// Type-safe API responses
const response: GetFindingsResponse = await findingsService.getFindings(id);
```

## Styling Guidelines

### Tailwind Utility Classes

```tsx
// Cards
<div className="card">                     // Standard card with hover
<div className="card-compact">             // Compact card

// Buttons
<button className="btn btn-primary">      // Primary button
<button className="btn btn-secondary">    // Secondary button

// Severity badges
<span className="severity-badge severity-critical">  // Critical badge
<span className="severity-badge severity-high">      // High badge
```

### Custom Severity Components

```tsx
import { Severity } from '@contract-leakage/shared-types';
import { getSeverityBadgeClasses } from '@utils/format';

function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={`severity-badge ${getSeverityBadgeClasses(severity)}`}>
      {severity}
    </span>
  );
}
```

## State Management

Using **TanStack Query** (React Query) for server state:

```typescript
import { useQuery } from '@tanstack/react-query';
import { findingsService } from '@services';

function FindingsList({ contractId }: { contractId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['findings', contractId],
    queryFn: () => findingsService.getFindings(contractId),
  });

  if (isLoading) return <div className="spinner" />;
  if (error) return <div>Error loading findings</div>;

  return (
    <div>
      {data?.findings.map((finding) => (
        <FindingCard key={finding.id} finding={finding} />
      ))}
    </div>
  );
}
```

## Environment Variables

Create `.env.local` for environment-specific configuration:

```env
VITE_API_BASE_URL=http://localhost:7071/api
VITE_ENABLE_MOCK_DATA=false
```

## Development Workflow

1. **Install dependencies**: `npm install`
2. **Start backend**: `cd ../backend && func start`
3. **Start frontend**: `npm run dev`
4. **Open browser**: `http://localhost:3000`
5. **Make changes**: Hot reload enabled
6. **Run type check**: `npm run type-check`
7. **Build for production**: `npm run build`

## Build for Production

```bash
npm run build
```

Output will be in `dist/` directory. Deploy to:
- **Azure Static Web Apps**
- **Vercel**
- **Netlify**
- Any static hosting service

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Performance Considerations

- **Code splitting**: Vite automatically splits routes
- **Lazy loading**: Use React.lazy() for heavy components
- **React Query caching**: 5-minute stale time configured
- **Image optimization**: Use WebP format when possible
- **Bundle size**: Tree-shaking enabled by Vite

## Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Color contrast ratios meet WCAG AA standards
- Focus indicators visible

## Next Steps

- [ ] Task 15: Implement contract upload component
- [ ] Task 16: Build findings list and detail views
- [ ] Task 17: Create clause viewer with highlighting
- [ ] Task 18: Add user overrides and adjustments
- [ ] Task 19: Deploy and test end-to-end

## Related Documentation

- [Shared Types Package](../contract-leakage-engine-backend/shared-types/README.md)
- [Backend API Reference](../contract-leakage-engine-backend/API_REFERENCE.md)
- [Phase 6 Export Summary](../contract-leakage-engine-backend/PHASE_6_EXPORT_SUMMARY.md)
