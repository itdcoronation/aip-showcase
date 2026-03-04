# Developer Onboarding Guide
## Coronation WealthHub - Codebase Architecture & Patterns

**Version:** 1.0  
**Last Updated:** February 3, 2026  
**Target Audience:** New developers contributing to the codebase

---

## Table of Contents

1. [Tech Stack Overview](#tech-stack-overview)
2. [Project Structure](#project-structure)
3. [Architecture Patterns](#architecture-patterns)
4. [Component Design Patterns](#component-design-patterns)
5. [Module Structure & Organization](#module-structure--organization)
6. [API Integration Pattern](#api-integration-pattern)
7. [State Management](#state-management)
8. [Routing & Navigation](#routing--navigation)
9. [Form Handling](#form-handling)
10. [Table Implementation](#table-implementation)
11. [Styling Conventions](#styling-conventions)
12. [Type Safety & TypeScript](#type-safety--typescript)
13. [Adding a New Module - Step by Step](#adding-a-new-module---step-by-step)
14. [Updating an Existing Module](#updating-an-existing-module)
15. [Common Patterns & Best Practices](#common-patterns--best-practices)
16. [Testing & Validation](#testing--validation)

---

## 1. Tech Stack Overview

### Core Technologies
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **Component Library:** shadcn/ui (Radix UI primitives)
- **Data Fetching:** React Query (TanStack Query)
- **Form Management:** React Hook Form + Zod validation
- **State Management:** Zustand (global state) + React Query (server state)
- **Tables:** TanStack Table
- **HTTP Client:** Axios
- **Icons:** Lucide React

### Development Tools
- **Package Manager:** Yarn
- **Linting:** ESLint
- **Code Quality:** TypeScript strict mode

---

## 2. Project Structure

```
aip-vercel-prod/
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (authentication)/  # Auth routes (login, signup, etc.)
│   │   ├── (protected)/       # Protected routes (dashboard)
│   │   │   ├── layout.tsx     # Protected layout wrapper
│   │   │   ├── overview/      # Dashboard overview
│   │   │   ├── mutual-funds/  # Mutual funds module routes
│   │   │   ├── equities/      # Equities module routes
│   │   │   ├── fixed-income/  # Fixed income module routes
│   │   │   ├── service-hub/   # Service hub routes
│   │   │   ├── settings/      # Settings routes
│   │   │   └── trustees/      # Trustees module routes
│   │   ├── api/               # API routes (server-side)
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── equities/      # Equities API proxies
│   │   │   ├── mutual-funds/  # Mutual funds API proxies
│   │   │   ├── payments/      # Payment endpoints
│   │   │   └── user/          # User-related endpoints
│   │   ├── onboarding/        # Onboarding flow routes
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── head.tsx           # Head metadata
│   │
│   ├── modules/               # Feature modules (UI logic)
│   │   ├── authentication/    # Auth UI components
│   │   ├── mutual-funds/      # Mutual funds module
│   │   │   ├── index.tsx      # Main listing + exports
│   │   │   ├── fund.tsx       # Fund details view
│   │   │   ├── bought-fund.tsx # Owned fund view
│   │   │   ├── invest.tsx     # Investment flow
│   │   │   ├── redeem.tsx     # Redemption flow
│   │   │   └── _components/   # Module-specific components
│   │   ├── equities/          # Equities module
│   │   ├── fixed-income/      # Fixed income module
│   │   ├── overview/          # Dashboard overview
│   │   ├── service-hub/       # Service hub features
│   │   ├── settings/          # Settings management
│   │   └── trustees/          # Trustees services
│   │
│   ├── components/            # Shared/reusable components
│   │   ├── ui/                # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ... (other UI primitives)
│   │   ├── cards/             # Card components
│   │   ├── charts/            # Chart components
│   │   ├── form/              # Form input components
│   │   ├── layout/            # Layout components (Sidebar, Header)
│   │   ├── modals/            # Modal components
│   │   ├── tables/            # Table components
│   │   ├── collapsible.tsx    # Collapsible component
│   │   ├── modal.tsx          # Base modal
│   │   ├── notice.tsx         # Notice/alert component
│   │   └── payment-method.tsx # Payment method selector
│   │
│   ├── requests/              # API integration layer
│   │   ├── services/          # React Query service hooks
│   │   │   ├── equities/      # Equities API hooks
│   │   │   ├── mutual-funds/  # Mutual funds API hooks
│   │   │   ├── portfolio/     # Portfolio API hooks
│   │   │   ├── products/      # Products API hooks
│   │   │   ├── payments/      # Payment API hooks
│   │   │   └── user/          # User API hooks
│   │   ├── processor.ts       # Axios instances & interceptors
│   │   ├── error-handler.ts   # API error handling
│   │   └── token.ts           # Token management
│   │
│   ├── types/                 # TypeScript type definitions
│   │   ├── auth.ts            # Authentication types
│   │   ├── equity.ts          # Equity types
│   │   ├── mutual-fund.ts     # Mutual fund types
│   │   ├── fixed-income.ts    # Fixed income types
│   │   ├── portfolio.ts       # Portfolio types
│   │   ├── payment.ts         # Payment types
│   │   └── user.ts            # User types
│   │
│   ├── store/                 # Zustand global stores
│   │   ├── authentication.ts  # Auth state
│   │   ├── user.ts            # User state
│   │   ├── balance.ts         # Balance state
│   │   ├── onboarding.ts      # Onboarding state
│   │   └── useStores.ts       # Store aggregation
│   │
│   ├── lib/                   # Utility libraries
│   │   ├── constants.ts       # App constants & options
│   │   ├── routes.ts          # Route definitions (enum)
│   │   ├── utils.ts           # Utility functions (cn, formatCurrency)
│   │   ├── auth-guard.tsx     # Route protection HOC
│   │   ├── currency-mapping.ts # Currency utilities
│   │   ├── fund-minimums.ts   # Minimum investment amounts
│   │   ├── payment-utils.ts   # Payment transformation utilities
│   │   └── providers.tsx      # Context providers wrapper
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useClickOutside.tsx
│   │   ├── useCopyToClipboard.tsx
│   │   ├── useCountdown.tsx
│   │   ├── useDeviceSize.tsx
│   │   └── useExtractUrlFragments.ts
│   │
│   ├── assets/                # Static assets (images, vectors)
│   │   ├── images/
│   │   └── vectors/
│   │
│   └── context/               # React contexts
│       └── modal-context.tsx  # Modal state management
│
├── .env                       # Environment variables
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── tailwind.config.ts         # Tailwind configuration
├── next.config.ts             # Next.js configuration
└── components.json            # shadcn/ui config
```

---

## 3. Architecture Patterns

### 3.1 Three-Layer Architecture

The application follows a strict **three-layer architecture** for API integration:

```
External API
    ↓
[Layer 1: Next.js API Routes] (src/app/api/)
    ↓ (transforms, validates, adds auth)
[Layer 2: Service Hooks] (src/requests/services/)
    ↓ (React Query with caching)
[Layer 3: Components] (src/modules/ & src/components/)
    ↓ (UI rendering)
User Interface
```

#### Layer 1: Next.js API Routes
**Location:** `src/app/api/`

- **Purpose:** Server-side API proxy/middleware
- **Responsibilities:**
  - Forward requests to external APIs
  - Add authentication headers
  - Transform responses
  - Handle server-side logic
  - Error sanitization

**Example:** `src/app/api/payments/initiate/route.ts`
```typescript
"use server";
import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/requests/error-handler";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await axiosInstanceAuth.post("/payments/initiate", body);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return apiErrorHandler(error);
  }
}
```

**Key Points:**
- Always use `"use server"` directive
- Use `axiosInstanceAuth` for authenticated requests
- Use `axiosInstanceUnauth` for public endpoints
- Always wrap in try-catch with `apiErrorHandler`
- Return `NextResponse.json()` for responses

#### Layer 2: Service Hooks
**Location:** `src/requests/services/`

- **Purpose:** React Query hooks for data fetching
- **Responsibilities:**
  - Call Next.js API routes (not external APIs directly)
  - Cache responses
  - Handle loading/error states
  - Provide mutation capabilities
  - Type safety

**Example:** `src/requests/services/payments/initiate.ts`
```typescript
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { InitiatePaymentRequestBody, InitiatePaymentResponse } from "@/types/payment";

// Service function
export const initiatePaymentService = async (
  data: InitiatePaymentRequestBody
): Promise<InitiatePaymentResponse> => {
  try {
    const response = await axios.post<InitiatePaymentResponse>(
      "/api/payments/initiate",  // Call Next.js API route, not external API
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error during payment initiation:", error);
    return Promise.reject(error);
  }
};

// React Query hook
export const useInitiatePayment = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: InitiatePaymentResponse) => void;
  onError?: (error: AxiosError<any>) => void;
}) => {
  return useMutation({
    mutationFn: initiatePaymentService,
    onSuccess,
    onError,
    mutationKey: ["initiate-payment"],
  });
};
```

**Key Points:**
- Always use `axios` from `"axios"` package (not the custom instances)
- Call `/api/*` routes, never external APIs directly
- Export both service function and hook
- Use `useMutation` for POST/PUT/DELETE
- Use `useQuery` for GET requests
- Include proper TypeScript types
- Add error logging

#### Layer 3: Components
**Location:** `src/modules/` and `src/components/`

- **Purpose:** UI rendering and user interaction
- **Responsibilities:**
  - Consume service hooks
  - Transform data for display
  - Handle user input
  - Manage local UI state
  - Render components

**Example:** Component using service hook
```typescript
const { mutate: initiatePayment, isPending } = useInitiatePayment({
  onSuccess: (data) => {
    if (data.data?.checkoutUrl) {
      setCheckoutUrl(data.data.checkoutUrl);
    }
  },
  onError: (error) => {
    setShowErrorModal(true);
  },
});

// Trigger mutation
const handleCardPayment = () => {
  initiatePayment({
    amount: cleanAmount(investmentAmount),
    currency: getCurrencyCode(id as string),
    callback_url: process.env.NEXT_PUBLIC_PAYMENT_CALLBACK_URL,
    product_id: id as string,
    is_recurring: isRecurring,
  });
};
```

**Key Points:**
- Never call external APIs directly
- Always use service hooks
- Handle loading states with `isPending` or `isLoading`
- Handle errors with `onError` callbacks
- Transform data with `useMemo` for performance

---

### 3.2 Separation of Concerns

**Routes (Pages) are Thin Wrappers:**
```typescript
// src/app/(protected)/mutual-funds/page.tsx
"use client";
import { MutualFundsUI } from "@/modules";

export default function Page() {
  return <MutualFundsUI />;
}
```

**Business Logic Lives in Modules:**
```typescript
// src/modules/mutual-funds/index.tsx
"use client";
import { Balance } from "@/components/cards/balance";
import { Assets } from "./_components/assets";
import { useFetchPortfolioFull } from "@/requests/services/portfolio";

const MutualFundsUI = () => {
  const { data, isLoading } = useFetchPortfolioFull();
  // All logic here...
  return (
    <section>
      {/* UI rendering */}
    </section>
  );
};

export { MutualFundsUI };
```

---

## 4. Component Design Patterns

### 4.1 Component File Naming

**Conventions:**
- **Pages/Routes:** `page.tsx` or `layout.tsx`
- **Module Components:** `kebab-case.tsx` (e.g., `invest.tsx`, `buy-stock.tsx`)
- **Shared Components:** `kebab-case.tsx` (e.g., `payment-method.tsx`)
- **UI Components:** `kebab-case.tsx` (e.g., `button.tsx`, `input.tsx`)
- **Module Folders:** Prefix with underscore `_components/`

### 4.2 Component Export Pattern

**Named Exports (Preferred):**
```typescript
// ✅ CORRECT - Named export
export const MutualFundsUI = () => {
  return <div>...</div>;
};

// Import
import { MutualFundsUI } from "@/modules/mutual-funds";
```

**Default Exports (For Pages/Layouts Only):**
```typescript
// ✅ CORRECT - Only for pages
export default function Page() {
  return <MutualFundsUI />;
}
```

### 4.3 Component Structure Template

```typescript
"use client"; // Add for client components

// 1. Imports
import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useFetchData } from "@/requests/services/...";

// 2. Type Definitions
interface ComponentProps {
  id: string;
  onSuccess: () => void;
}

// 3. Main Component
const ComponentName = ({ id, onSuccess }: ComponentProps) => {
  // 3.1 Hooks (order matters)
  const router = useRouter();
  const params = useParams();
  
  // 3.2 State
  const [state, setState] = useState<string>("");
  
  // 3.3 Data Fetching
  const { data, isLoading } = useFetchData({ id });
  
  // 3.4 Computed Values
  const computedValue = useMemo(() => {
    return data?.value || 0;
  }, [data]);
  
  // 3.5 Event Handlers
  const handleClick = () => {
    // Logic here
  };
  
  // 3.6 Conditional Rendering
  if (isLoading) return <LoadingState />;
  if (!data) return <EmptyState />;
  
  // 3.7 Return JSX
  return (
    <section>
      {/* Component content */}
    </section>
  );
};

// 4. Export
export { ComponentName };
```

### 4.4 Props Pattern

**DO:**
```typescript
// ✅ CORRECT - Explicit interface
interface StepFormProps {
  handleNext: (isRecurring: boolean, amount: string) => void;
  currencySymbol: string;
  minimumInvestment: number;
}

const StepForm = ({ handleNext, currencySymbol, minimumInvestment }: StepFormProps) => {
  // Component logic
};
```

**DON'T:**
```typescript
// ❌ WRONG - No type safety
const StepForm = (props) => {
  // Component logic
};
```

### 4.5 Conditional Rendering Pattern

**Method 1: Early Returns**
```typescript
if (isLoading) return <PageLoader />;
if (error) return <ErrorState />;
if (!data) return <EmptyState />;

return <MainContent data={data} />;
```

**Method 2: Ternary Operator**
```typescript
return (
  <div>
    {isLoading ? (
      <Skeleton />
    ) : (
      <Content />
    )}
  </div>
);
```

**Method 3: Logical AND**
```typescript
return (
  <div>
    {hasData && <DataDisplay data={data} />}
  </div>
);
```

---

## 5. Module Structure & Organization

### 5.1 Module Folder Structure

Every module follows this **exact** structure:

```
src/modules/[module-name]/
├── index.tsx              # Main listing UI + barrel exports
├── [asset].tsx            # Detail view (e.g., fund.tsx, equity.tsx)
├── bought-[asset].tsx     # Owned asset view (optional)
├── [action].tsx           # Action flows (invest.tsx, redeem.tsx, buy-stock.tsx)
└── _components/           # Module-specific components
    ├── assets.tsx         # Portfolio table component
    ├── [feature].tsx      # Feature-specific components
    └── ...
```

### 5.2 Module Index File Pattern

**Purpose:** Serve as main entry point and export aggregator

**Template:** `src/modules/[module-name]/index.tsx`
```typescript
"use client";
import { Balance } from "@/components/cards/balance";
import { FeatureSection } from "./_components/feature-section";
import { Assets } from "./_components/assets";
import { useFetchPortfolioFull } from "@/requests/services/portfolio";
import { formatCurrency } from "@/lib/utils";

// Main listing component
const ModuleNameUI = () => {
  // 1. Data fetching
  const { data: portfolioData, isLoading } = useFetchPortfolioFull();

  // 2. Computed values
  const ngnBalance = portfolioData?.data?.balance?.module?.NGN || 0;
  const usdBalance = portfolioData?.data?.balance?.module?.USD || 0;

  // 3. Render
  return (
    <section className="grid gap-12">
      {/* Balance Cards */}
      <div className="flex-col sm:flex-row flex gap-8 sm:gap-10">
        <Balance
          amount={isLoading ? "Loading..." : formatCurrency(ngnBalance, "NGN")}
          title="Investment balance"
          isLoading={isLoading}
        />
        <Balance
          amount={isLoading ? "Loading..." : formatCurrency(usdBalance, "USD")}
          title="Investment balance"
          isLoading={isLoading}
        />
      </div>
      
      {/* Feature Section */}
      <FeatureSection />
      
      {/* Assets Table */}
      <Assets portfolioData={portfolioData} />
    </section>
  );
};

// Named export for main component
export { ModuleNameUI };

// Barrel exports for other module components
export * from "./asset-detail";
export * from "./bought-asset";
export * from "./action-flow";
```

**Key Points:**
- Always use `"use client"` directive
- Main component ends with `UI` suffix
- Use named export for main component
- Barrel export all other module components
- Follow consistent structure: Balance → Feature → Assets

### 5.3 Detail View Pattern

**Template:** `src/modules/[module-name]/[asset].tsx`
```typescript
"use client";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible } from "@/components/collapsible";
import { useFetchAssetDetails } from "@/requests/services/...";

const AssetDetailUI = () => {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const bought = searchParams.get("bought"); // Check if user owns asset

  // Fetch data
  const { data, isLoading } = useFetchAssetDetails({ id });
  
  // Transform data
  const assetData = useMemo(() => data?.Data?.[0], [data]);

  // Conditional rendering based on ownership
  if (bought) {
    return <BoughtAssetUI />;
  }

  // Loading state
  if (isLoading) return <PageLoader />;

  return (
    <section>
      {/* Back button */}
      <Button onClick={router.back} variant="ghost" size="sm">
        <XIcon /> Back
      </Button>

      {/* Header section */}
      <header>
        <img src={assetData?.logo} alt={assetData?.name} />
        <h1>{assetData?.name}</h1>
        <div className="flex gap-2">
          <Button onClick={() => router.push(`/module/${id}/action`)}>
            Action
          </Button>
        </div>
      </header>

      {/* Stats/Breakdown */}
      <section>
        {/* Metrics */}
      </section>

      {/* Collapsible sections */}
      <Collapsible title="About" defaultOpen>
        <p>{assetData?.about}</p>
      </Collapsible>

      <Collapsible title="Details">
        {/* Details content */}
      </Collapsible>
    </section>
  );
};

export { AssetDetailUI };
```

**Key Points:**
- Use `useSearchParams()` for query parameters (`?bought=true`)
- Redirect to owned view if user owns the asset
- Always include back button
- Use `Collapsible` for expandable sections
- Transform data with `useMemo`

### 5.4 Action Flow Pattern (Multi-Step)

**Template:** `src/modules/[module-name]/[action].tsx`
```typescript
"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { NoticeModal } from "@/components/modals/notice-modal";
import { useActionMutation } from "@/requests/services/...";

const ActionFlowUI = () => {
  const router = useRouter();
  const { id } = useParams();
  
  // State management
  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // API mutation
  const { mutate, isPending } = useActionMutation({
    onSuccess: () => setShowSuccessModal(true),
    onError: (error) => console.error(error),
  });

  return (
    <>
      {/* Modals */}
      <NoticeModal
        show={showSuccessModal}
        close={() => router.push("/module")}
        type="success"
        title="Success!"
        description="Action completed successfully"
      />

      {/* Cancel button */}
      <Button onClick={router.back} variant="ghost" size="sm">
        <XIcon /> Cancel
      </Button>

      {/* Multi-step UI */}
      <section className="mx-auto max-w-[940px] mt-8">
        <p className="text-txt-success mb-8">Step {step} of 2</p>
        
        {step === 1 ? (
          <Step1Form handleNext={() => setStep(2)} />
        ) : (
          <Step2Form onSubmit={mutate} isPending={isPending} />
        )}
      </section>
    </>
  );
};

// Step components
const Step1Form = ({ handleNext }) => {
  // Step 1 logic
  return <form>...</form>;
};

const Step2Form = ({ onSubmit, isPending }) => {
  // Step 2 logic
  return <form>...</form>;
};

export { ActionFlowUI };
```

**Key Points:**
- Use step state for multi-step flows
- Separate step components
- Include cancel button
- Use modals for confirmations
- Handle loading states

---

## 6. API Integration Pattern

### 6.1 API Route Creation

**Location:** `src/app/api/[module]/[endpoint]/route.ts`

**Template:**
```typescript
"use server";
import { NextResponse } from "next/server";
import { axiosInstanceAuth, axiosInstanceAuth2 } from "@/requests/processor";
import { apiErrorHandler } from "@/requests/error-handler";

// GET request
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const param = searchParams.get("param");
    
    const response = await axiosInstanceAuth.get("/external/endpoint", {
      params: { param },
    });
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    return apiErrorHandler(error);
  }
}

// POST request
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const response = await axiosInstanceAuth.post("/external/endpoint", body);
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    return apiErrorHandler(error);
  }
}
```

**Key Points:**
- Always use `"use server"` directive
- Choose correct axios instance:
  - `axiosInstanceAuth` - User service (authenticated)
  - `axiosInstanceAuth2` - Auth service (authenticated)
  - `axiosInstanceUnauth` - Public endpoints
- Always wrap in try-catch
- Always use `apiErrorHandler` for errors
- Use `NextResponse.json()` for responses
- Extract query params from `new URL(req.url).searchParams`
- Extract body from `await req.json()`

### 6.2 Axios Instances Configuration

**File:** `src/requests/processor.ts`

```typescript
import axios from "axios";
import { getAccessToken } from "./token";

const authBaseURL = process.env.NEXT_PUBLIC_AUTH_API_BASE_URL + "/api";
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL + "/api";

// Unauthenticated (public endpoints)
export const axiosInstanceUnauth = axios.create({
  baseURL: authBaseURL,
});

// Authenticated - Auth Service
export const axiosInstanceAuth2 = axios.create({
  baseURL: authBaseURL,
});

// Authenticated - User Service
export const axiosInstanceAuth = axios.create({
  baseURL,
});

// Interceptors add auth headers automatically
axiosInstanceAuth.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers["authorization"] = `Bearer ${token}`;
  }
  return config;
});
```

**When to Use Which:**
- `axiosInstanceAuth` - Most common, for user data endpoints
- `axiosInstanceAuth2` - Auth service endpoints (login, signup, etc.)
- `axiosInstanceUnauth` - Public endpoints (no auth required)

### 6.3 Service Hook Creation

**Location:** `src/requests/services/[module]/[endpoint].ts`

**Template for GET (Query):**
```typescript
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { ResponseType } from "@/types/...";

interface FetchDataParams {
  id: string;
  // other params
}

// Service function
export const fetchDataService = async (
  params: FetchDataParams
): Promise<ResponseType> => {
  try {
    const response = await axios.get<ResponseType>(
      `/api/module/endpoint?id=${params.id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// React Query hook
export const useFetchData = (
  params: FetchDataParams,
  options?: Partial<UseQueryOptions<ResponseType, Error>>
) => {
  return useQuery({
    queryKey: ["fetch-data", params.id],
    queryFn: () => fetchDataService(params),
    enabled: !!params.id, // Only run if required params exist
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};
```

**Template for POST/PUT/DELETE (Mutation):**
```typescript
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { RequestType, ResponseType } from "@/types/...";

// Service function
export const mutateDataService = async (
  data: RequestType
): Promise<ResponseType> => {
  try {
    const response = await axios.post<ResponseType>(
      "/api/module/endpoint",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error mutating data:", error);
    return Promise.reject(error);
  }
};

// React Query hook
export const useMutateData = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: ResponseType) => void;
  onError?: (error: AxiosError<any>) => void;
}) => {
  return useMutation({
    mutationFn: mutateDataService,
    onSuccess,
    onError,
    mutationKey: ["mutate-data"],
  });
};
```

**Key Points:**
- Always use plain `axios` from `"axios"` package (not custom instances)
- Always call `/api/*` routes (Next.js API routes), never external APIs
- Export both service function and hook
- Use `useQuery` for GET requests
- Use `useMutation` for POST/PUT/DELETE
- Include proper TypeScript types
- Add `enabled` option for conditional queries
- Set appropriate `staleTime` for caching
- Include error logging

### 6.4 Type Definitions

**Location:** `src/types/[module].ts`

**Template:**
```typescript
// API Response Type
export interface DataResponse {
  success: boolean;
  message?: string;
  data?: DataPayload;
  error?: any;
}

// Nested Data Type
export interface DataPayload {
  id: string;
  name: string;
  value: number;
  // ... other fields
}

// Table Display Type (for UI)
export interface DataTableRow {
  id: string;
  name: string;
  displayValue: string; // Formatted value
  // ... other display fields
}

// Request Type
export interface DataRequest {
  amount: number;
  currency: "NGN" | "USD";
  productId: string;
}
```

**Key Points:**
- Separate API response types from UI display types
- Use descriptive names (`Response`, `Request`, `TableData`)
- Include optional fields with `?`
- Use union types for enums (`"NGN" | "USD"`)
- Document complex types with comments

---

## 7. State Management

### 7.1 React Query (Server State)

**Purpose:** Manage server data (API responses)

**When to Use:**
- Fetching data from APIs
- Caching server responses
- Automatic refetching
- Loading/error states

**Example:**
```typescript
const { data, isLoading, error, refetch } = useFetchData({ id });
```

### 7.2 useState (Local UI State)

**Purpose:** Component-level state

**When to Use:**
- Modal visibility
- Form step tracking
- UI toggles
- Local selections

**Example:**
```typescript
const [showModal, setShowModal] = useState(false);
const [step, setStep] = useState(1);
```

### 7.3 React Hook Form (Form State)

**Purpose:** Form data and validation

**When to Use:**
- All form inputs
- Form validation
- Form submission

**Example:**
```typescript
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(formSchema),
});
```

### 7.4 Zustand (Global State)

**Purpose:** App-wide state that persists across routes

**Location:** `src/store/`

**Stores:**
- `authentication.ts` - Auth tokens, login status
- `user.ts` - User profile data
- `balance.ts` - Account balances
- `onboarding.ts` - Onboarding flow state

**When to Use:**
- Authentication state
- User session data
- App-wide settings
- Cross-route state

**Example:**
```typescript
// Store definition (src/store/example.ts)
import { create } from "zustand";

interface ExampleStore {
  value: string;
  setValue: (value: string) => void;
  reset: () => void;
}

const useExampleStore = create<ExampleStore>((set) => ({
  value: "",
  setValue: (value) => set({ value }),
  reset: () => set({ value: "" }),
}));

export default useExampleStore;

// Usage in component
import useExampleStore from "@/store/example";

const Component = () => {
  const { value, setValue } = useExampleStore();
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
};
```

### 7.5 State Decision Tree

```
Does the state come from an API?
  YES → Use React Query
  NO → Continue

Does the state need to persist across routes/components?
  YES → Use Zustand
  NO → Continue

Is it form data?
  YES → Use React Hook Form
  NO → Use useState
```

---

## 8. Routing & Navigation

### 8.1 Route Definition

**Centralized Routes:** `src/lib/routes.ts`

```typescript
export enum ROUTES {
  // Authentication
  login = "/",
  signup = "/signup",
  
  // Dashboard
  overview = "/overview",
  mutual_funds = "/mutual-funds",
  equities = "/equities",
  
  // Dynamic routes (use with params)
  mutual_fund_detail = "/mutual-funds/[id]",
  mutual_fund_invest = "/mutual-funds/[id]/invest",
  
  // Service Hub
  service_hub_statement = "/service-hub/account-statement",
}
```

**Usage:**
```typescript
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";

const Component = () => {
  const router = useRouter();
  
  // Static route
  router.push(ROUTES.overview);
  
  // Dynamic route with params
  router.push(`/mutual-funds/${id}/invest`);
  
  // With query params
  router.push(`/mutual-funds/${id}?bought=true`);
};
```

### 8.2 Navigation Patterns

**1. Programmatic Navigation:**
```typescript
import { useRouter } from "next/navigation";

const Component = () => {
  const router = useRouter();
  
  // Navigate forward
  router.push("/path");
  
  // Navigate back
  router.back();
  
  // Replace (no history)
  router.replace("/path");
  
  // Refresh
  router.refresh();
};
```

**2. Link Component:**
```typescript
import Link from "next/link";

<Link href="/mutual-funds">Mutual Funds</Link>
```

**3. Query Parameters:**
```typescript
import { useSearchParams } from "next/navigation";

const Component = () => {
  const searchParams = useSearchParams();
  const bought = searchParams.get("bought"); // ?bought=true
  
  if (bought) {
    return <BoughtView />;
  }
  return <DefaultView />;
};
```

**4. Dynamic Routes:**
```typescript
import { useParams } from "next/navigation";

const Component = () => {
  const { id } = useParams(); // From /mutual-funds/[id]
  return <div>Fund ID: {id}</div>;
};
```

### 8.3 Protected Routes

**Pattern:** All routes under `(protected)` folder are automatically protected

**Implementation:** `src/app/(protected)/layout.tsx`
```typescript
import DashboardLayout from "@/components/layout";
import PageLoader from "@/components/page-loader";
import { Suspense } from "react";

const Layout = ({ children }) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <DashboardLayout>{children}</DashboardLayout>
    </Suspense>
  );
};

export default Layout;
```

**Auth Guard:** `src/lib/auth-guard.tsx`
```typescript
// HOC that wraps protected components
export default isAuth(DashboardLayout);
```

---

## 9. Form Handling

### 9.1 Form Pattern with Zod + React Hook Form

**Complete Example:**

```typescript
"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { SelectInput } from "@/components/form/select-input";
import CurrencyInput from "react-currency-input-field";

// 1. Define Zod schema
const formSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => {
        const num = Number(val.replace(/,/g, ""));
        return !isNaN(num) && num >= 50000;
      },
      { message: "Minimum amount is ₦50,000" }
    ),
  frequency: z.string().optional(),
  start_date: z.date().optional(),
}).superRefine((data, ctx) => {
  // Cross-field validation
  if (data.recurring && !data.frequency) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["frequency"],
      message: "Frequency is required for recurring",
    });
  }
});

// 2. Infer TypeScript type
type FormData = z.infer<typeof formSchema>;

// 3. Component
const FormComponent = () => {
  // Initialize form
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Validate on change
  });

  // 4. Submit handler
  const onSubmit = (data: FormData) => {
    console.log(data);
    // Call API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Native Input */}
      <div>
        <input
          {...register("amount")}
          type="text"
          placeholder="Enter amount"
        />
        {errors.amount && (
          <span className="text-red-500">{errors.amount.message}</span>
        )}
      </div>

      {/* Currency Input */}
      <div>
        <CurrencyInput
          {...register("amount")}
          decimalsLimit={2}
          placeholder="0.00"
        />
        {errors.amount && <span>{errors.amount.message}</span>}
      </div>

      {/* Custom Input with Controller */}
      <Controller
        name="frequency"
        control={control}
        render={({ field }) => (
          <SelectInput
            label="Frequency"
            options={frequencyOptions}
            onChange={(value) => field.onChange(value)}
            validatormessage={errors.frequency?.message}
            value={field.value ?? ""}
          />
        )}
      />

      {/* Date Picker with Controller */}
      <Controller
        name="start_date"
        control={control}
        render={({ field }) => (
          <DatePicker
            label="Start date"
            value={field.value}
            handleChange={(value) => field.onChange(value)}
            validatormessage={errors.start_date?.message}
          />
        )}
      />

      {/* Watch value */}
      {watch("recurring") && (
        <div>Recurring options...</div>
      )}

      {/* Submit button */}
      <Button type="submit" disabled={!isValid}>
        Submit
      </Button>
    </form>
  );
};
```

### 9.2 Form Validation Patterns

**Required Field:**
```typescript
z.string().min(1, "Field is required")
```

**Minimum Value:**
```typescript
z.string().refine(
  (val) => Number(val) >= 50000,
  { message: "Minimum is 50,000" }
)
```

**Email:**
```typescript
z.string().email("Invalid email address")
```

**Date Validation:**
```typescript
z.date().refine(
  (date) => isAfter(date, new Date()),
  { message: "Date must be in the future" }
)
```

**Cross-Field Validation:**
```typescript
.superRefine((data, ctx) => {
  if (data.endDate && data.startDate) {
    if (isBefore(data.endDate, data.startDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date must be after start date",
      });
    }
  }
})
```

### 9.3 Custom Form Inputs

**Location:** `src/components/form/`

**Available Inputs:**
- `SelectInput` - Dropdown select
- `SelectInputPaginated` - Paginated select with infinite scroll
- `DatePicker` - Date selection
- `TextInput` - Standard text input
- `FileUpload` - File upload

**Always use `Controller` for custom inputs:**
```typescript
<Controller
  name="fieldName"
  control={control}
  rules={{ required: "Field is required" }}
  render={({ field }) => (
    <CustomInput
      value={field.value}
      onChange={field.onChange}
      error={errors.fieldName?.message}
    />
  )}
/>
```

---

## 10. Table Implementation

### 10.1 Table Structure

**Three Files Required:**

1. **Column Definition:** `src/components/tables/[module]-table/columns.tsx`
2. **Table Component:** `src/components/tables/[module]-table/index.tsx`
3. **Usage in Module:** `src/modules/[module]/_components/assets.tsx`

### 10.2 Column Definition Pattern

**File:** `src/components/tables/mutual-funds-table/columns.tsx`

```typescript
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CompletedFundTableData } from "@/types/mutual-fund";

export interface MutualFundTableActions {
  handleView: (id: string) => void;
  handleCancel: (id: string) => void;
  type: "active" | "pending" | "history";
}

export const getMutualFundTableColumns = ({
  handleView,
  handleCancel,
  type,
}: MutualFundTableActions): ColumnDef<CompletedFundTableData>[] => {
  let columns: ColumnDef<CompletedFundTableData>[] = [];

  switch (type) {
    case "active":
      columns = [
        {
          accessorKey: "name",
          header: "Name",
          cell: ({ row }) => {
            const { name, short_form, logo } = row.original;
            return (
              <div className="flex gap-2 items-center">
                <img src={logo} className="size-8" />
                <div>
                  <p className="font-medium">{name}</p>
                  <p className="text-xs text-txt-tertiary">{short_form}</p>
                </div>
              </div>
            );
          },
        },
        {
          accessorKey: "current_value",
          header: "Current value",
          cell: ({ row }) => {
            const { current_value } = row.original;
            return <p>₦ {current_value.toLocaleString()}</p>;
          },
        },
        {
          id: "actions",
          header: "",
          cell: ({ row }) => {
            const { id } = row.original;
            return (
              <Button
                onClick={() => handleView(id)}
                size="sm"
                variant="outline"
              >
                View
              </Button>
            );
          },
        },
      ];
      break;

    case "pending":
      columns = [
        // Pending columns...
        {
          id: "actions",
          cell: ({ row }) => {
            const { id } = row.original;
            return (
              <Button onClick={() => handleCancel(id)}>
                Cancel
              </Button>
            );
          },
        },
      ];
      break;

    case "history":
      columns = [
        // History columns...
      ];
      break;
  }

  return columns;
};
```

**Key Points:**
- Export interface for actions
- Use switch statement for different table types
- Always include `id` in row data
- Use `cell` function for custom rendering
- Use `accessorKey` for direct data access
- Actions column uses `id: "actions"`

### 10.3 Table Component Pattern

**File:** `src/components/tables/mutual-funds-table/index.tsx`

```typescript
"use client";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableProps<TData> {
  columns: any[];
  data: TData[];
}

export function MutualFundsTable<TData>({ columns, data }: TableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### 10.4 Table Usage Pattern

**File:** `src/modules/mutual-funds/_components/assets.tsx`

```typescript
"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MutualFundsTable } from "@/components/tables/mutual-funds-table";
import { getMutualFundTableColumns } from "@/components/tables/mutual-funds-table/columns";
import { CompletedFundTableData } from "@/types/mutual-fund";

const Assets = ({ portfolioData }) => {
  const router = useRouter();
  const [type, setType] = useState<"active" | "pending" | "history">("active");

  // Transform API data to table format
  const tableData = useMemo((): CompletedFundTableData[] => {
    if (!portfolioData?.data?.userFunds) return [];
    
    return portfolioData.data.userFunds.map((fund) => ({
      id: fund.productCode,
      name: fund.productName,
      short_form: fund.productCode,
      logo: fund.icon || "/default-logo.png",
      current_value: fund.currentValue,
      // ... other fields
    }));
  }, [portfolioData]);

  // Get columns
  const columns = getMutualFundTableColumns({
    handleView: (id) => router.push(`/mutual-funds/${id}?bought=true`),
    handleCancel: (id) => console.log("Cancel", id),
    type,
  });

  return (
    <Tabs value={type} onValueChange={(value) => setType(value as any)}>
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>

      <TabsContent value="active">
        <MutualFundsTable columns={columns} data={tableData} />
      </TabsContent>

      {/* Other tabs... */}
    </Tabs>
  );
};
```

**Key Points:**
- Transform data with `useMemo`
- Pass action handlers to column definition
- Use tabs for different table types
- Handle empty states

---

## 11. Styling Conventions

### 11.1 Tailwind CSS

**Utility-First Approach:**
```typescript
<div className="flex items-center gap-4 px-4 py-2">
  <p className="text-sm text-txt-primary font-semibold">Text</p>
</div>
```

**Common Patterns:**

**Layout:**
```typescript
// Flex container
<div className="flex items-center justify-between gap-4">

// Grid
<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">

// Responsive
<div className="flex-col sm:flex-row flex gap-4">
```

**Spacing:**
```typescript
// Padding
className="px-4 py-6"        // Horizontal 16px, Vertical 24px
className="p-4 sm:px-6"      // Responsive padding

// Margin
className="mb-4 mt-8"        // Bottom 16px, Top 32px
className="mx-auto max-w-[940px]" // Center with max width

// Gap
className="gap-2"            // 8px gap
className="gap-4 sm:gap-8"   // Responsive gap
```

**Typography:**
```typescript
// Text size (defined in theme)
className="text-p1"          // Paragraph 1
className="text-h3"          // Heading 3
className="text-xs sm:text-sm" // Responsive

// Text color (custom design tokens)
className="text-txt-primary"   // Primary text color
className="text-txt-secondary" // Secondary text color
className="text-txt-tertiary"  // Tertiary text color
className="text-txt-brand"     // Brand color text
className="text-txt-danger"    // Error/danger text
className="text-txt-success"   // Success text
```

**Colors (Design Tokens):**
```typescript
// Background
className="bg-bg-primary"      // Primary background
className="bg-bg-secondary"    // Secondary background
className="bg-bg-brand"        // Brand background
className="bg-bg-success"      // Success background
className="bg-bg-danger"       // Danger background

// Border
className="border border-stroke-primary"
className="border-0.5 border-[#EEEFF1]"
```

**Borders & Radius:**
```typescript
className="rounded-md"         // 6px
className="rounded-[12px]"     // 12px
className="rounded-[10px]"     // 10px
className="border border-stroke-primary"
```

### 11.2 Component Styling Pattern

**Always Use `cn()` Utility for Dynamic Classes:**

```typescript
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes here",
  condition && "conditional-classes",
  variant === "primary" && "variant-classes",
  className // Allow prop override
)}>
```

**Example:**
```typescript
<Button
  className={cn(
    "inline-flex items-center gap-2",
    loading && "opacity-50 pointer-events-none",
    variant === "brand" && "bg-bg-brand text-white",
    className
  )}
>
```

### 11.3 Responsive Design

**Mobile-First Approach:**
```typescript
// Base: Mobile
// sm: >= 640px
// md: >= 768px
// lg: >= 1024px
// xl: >= 1280px

<div className="text-sm sm:text-base md:text-lg">
  Responsive text size
</div>

<div className="flex-col sm:flex-row flex">
  Stacked on mobile, row on desktop
</div>

<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
  Responsive grid
</div>
```

### 11.4 Custom Hook for Device Size

```typescript
import { useDeviceSize } from "@/hooks/useDeviceSize";

const Component = () => {
  const { isMobile } = useDeviceSize(900); // Custom breakpoint
  
  return (
    <div className={isMobile ? "ml-0" : "ml-[270px]"}>
      Content
    </div>
  );
};
```

---

## 12. Type Safety & TypeScript

### 12.1 TypeScript Configuration

**Strict Mode Enabled:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 12.2 Type Definition Patterns

**1. Component Props:**
```typescript
interface ComponentProps {
  id: string;
  onSuccess: () => void;
  optional?: boolean;
}

const Component = ({ id, onSuccess, optional }: ComponentProps) => {
  // Component logic
};
```

**2. API Response Types:**
```typescript
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
}

export interface FundData {
  productCode: string;
  productName: string;
  currentValue: number;
}

// Usage
const response: ApiResponse<FundData[]> = await fetchFunds();
```

**3. Enum Types:**
```typescript
export type TransactionType = "invest" | "redeem" | "transfer";
export type Currency = "NGN" | "USD";
export type TableType = "active" | "pending" | "history";
```

**4. Utility Types:**
```typescript
// Pick specific properties
type PartialUser = Pick<User, "id" | "name">;

// Make all properties optional
type OptionalFund = Partial<FundData>;

// Omit properties
type PublicUser = Omit<User, "password">;
```

### 12.3 Type Inference

**Use `z.infer` for Zod Schemas:**
```typescript
const formSchema = z.object({
  amount: z.string(),
  frequency: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;
// Infers: { amount: string; frequency?: string }
```

**Use `typeof` for Constants:**
```typescript
const config = {
  maxAmount: 1000000,
  currency: "NGN" as const,
};

type Config = typeof config;
// Infers: { maxAmount: number; currency: "NGN" }
```

### 12.4 Avoid Any

**DO:**
```typescript
// ✅ Explicit types
const handleSubmit = (data: FormData) => { ... };
const response: ApiResponse = await fetchData();
```

**DON'T:**
```typescript
// ❌ Using any
const handleSubmit = (data: any) => { ... };
const response: any = await fetchData();
```

**Exception:** Only use `any` in error handlers:
```typescript
catch (error: any) {
  console.error(error);
}
```

---

## 13. Adding a New Module - Step by Step

### Step 1: Create Route Structure

**Location:** `src/app/(protected)/[module-name]/`

```
src/app/(protected)/bonds/
├── layout.tsx          # Module layout (copy from mutual-funds)
├── page.tsx            # Main listing page
├── [id]/
│   ├── page.tsx        # Bond details page
│   ├── purchase/
│   │   └── page.tsx    # Purchase flow page
│   └── redeem/
│       └── page.tsx    # Redeem flow page
```

**File:** `layout.tsx`
```typescript
"use client";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const Layout = ({ children }) => {
  const pathname = usePathname();
  const isMainPage = pathname === "/bonds";

  return (
    <section className="px-4 sm:px-6 py-4">
      {isMainPage && (
        <header className="mb-8">
          <h1 className="text-p1 font-semibold">Bonds</h1>
        </header>
      )}
      {children}
    </section>
  );
};

export default Layout;
```

**File:** `page.tsx` (thin wrapper)
```typescript
"use client";
import { BondsUI } from "@/modules";

export default function Page() {
  return <BondsUI />;
}
```

### Step 2: Create Module Components

**Location:** `src/modules/bonds/`

```
src/modules/bonds/
├── index.tsx           # Main listing + exports
├── bond.tsx            # Bond details view
├── bought-bond.tsx     # Owned bond view (if needed)
├── purchase-bond.tsx   # Purchase flow
├── redeem-bond.tsx     # Redeem flow
└── _components/
    ├── assets.tsx      # Portfolio table
    ├── bond-types.tsx  # Bond categories section
    └── ...
```

**File:** `index.tsx`
```typescript
"use client";
import { Balance } from "@/components/cards/balance";
import { BondTypes } from "./_components/bond-types";
import { Assets } from "./_components/assets";
import { useFetchPortfolioFull } from "@/requests/services/portfolio";
import { formatCurrency } from "@/lib/utils";

const BondsUI = () => {
  const { data: portfolioData, isLoading } = useFetchPortfolioFull();

  const ngnBalance = portfolioData?.data?.balance?.bonds?.NGN || 0;
  const usdBalance = portfolioData?.data?.balance?.bonds?.USD || 0;

  return (
    <section className="grid gap-12">
      {/* Balance Cards */}
      <div className="flex-col sm:flex-row flex gap-8 sm:gap-10">
        <Balance
          amount={isLoading ? "Loading..." : formatCurrency(ngnBalance, "NGN")}
          title="Bond Portfolio"
          isLoading={isLoading}
        />
        <Balance
          amount={isLoading ? "Loading..." : formatCurrency(usdBalance, "USD")}
          title="Bond Portfolio"
          isLoading={isLoading}
        />
      </div>

      {/* Bond Types Section */}
      <BondTypes />

      {/* Portfolio Table */}
      <Assets portfolioData={portfolioData} />
    </section>
  );
};

export { BondsUI };
export * from "./bond";
export * from "./bought-bond";
export * from "./purchase-bond";
export * from "./redeem-bond";
```

### Step 3: Create API Routes

**Location:** `src/app/api/bonds/`

```
src/app/api/bonds/
├── list/
│   └── route.ts        # GET bonds list
├── details/
│   └── route.ts        # GET bond details
└── purchase/
    └── route.ts        # POST purchase request
```

**File:** `list/route.ts`
```typescript
"use server";
import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/requests/error-handler";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const response = await axiosInstanceAuth.get("/bonds/list", {
      params: { type },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return apiErrorHandler(error);
  }
}
```

### Step 4: Create Service Hooks

**Location:** `src/requests/services/bonds/`

```
src/requests/services/bonds/
├── index.ts
├── list.ts             # useFetchBonds
├── details.ts          # useFetchBondDetails
└── purchase.ts         # usePurchaseBond
```

**File:** `list.ts`
```typescript
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { BondListResponse } from "@/types/bonds";

interface FetchBondsParams {
  type?: string;
}

export const fetchBondsService = async (
  params: FetchBondsParams
): Promise<BondListResponse> => {
  try {
    const response = await axios.get<BondListResponse>(
      `/api/bonds/list?type=${params.type || ""}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching bonds:", error);
    throw error;
  }
};

export const useFetchBonds = (
  params: FetchBondsParams,
  options?: Partial<UseQueryOptions<BondListResponse, Error>>
) => {
  return useQuery({
    queryKey: ["fetch-bonds", params.type],
    queryFn: () => fetchBondsService(params),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
```

**File:** `purchase.ts`
```typescript
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { PurchaseBondRequest, PurchaseBondResponse } from "@/types/bonds";

export const purchaseBondService = async (
  data: PurchaseBondRequest
): Promise<PurchaseBondResponse> => {
  try {
    const response = await axios.post<PurchaseBondResponse>(
      "/api/bonds/purchase",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error purchasing bond:", error);
    return Promise.reject(error);
  }
};

export const usePurchaseBond = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: PurchaseBondResponse) => void;
  onError?: (error: AxiosError<any>) => void;
}) => {
  return useMutation({
    mutationFn: purchaseBondService,
    onSuccess,
    onError,
    mutationKey: ["purchase-bond"],
  });
};
```

### Step 5: Define Types

**Location:** `src/types/bonds.ts`

```typescript
// API Response Types
export interface BondListResponse {
  success: boolean;
  data: BondData[];
}

export interface BondData {
  id: string;
  name: string;
  type: string;
  yield: number;
  maturity_date: string;
  minimum_investment: number;
}

// Table Display Type
export interface BondTableData {
  id: string;
  name: string;
  short_form: string;
  logo: string;
  yield: number;
  maturity_date: string;
  amount_invested: number;
  current_value: number;
}

// Request Types
export interface PurchaseBondRequest {
  bond_id: string;
  amount: number;
  currency: "NGN" | "USD";
}

export interface PurchaseBondResponse {
  success: boolean;
  message: string;
  data?: {
    transaction_id: string;
    status: string;
  };
}
```

### Step 6: Create Table Components

**Location:** `src/components/tables/bonds-table/`

```
src/components/tables/bonds-table/
├── index.tsx           # Table component
└── columns.tsx         # Column definitions
```

**File:** `columns.tsx`
```typescript
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { BondTableData } from "@/types/bonds";

export interface BondTableActions {
  handleView: (id: string) => void;
  handlePurchase: (id: string) => void;
  type: "active" | "available";
}

export const getBondTableColumns = ({
  handleView,
  handlePurchase,
  type,
}: BondTableActions): ColumnDef<BondTableData>[] => {
  const columns: ColumnDef<BondTableData>[] = [
    {
      accessorKey: "name",
      header: "Bond Name",
      cell: ({ row }) => {
        const { name, short_form, logo } = row.original;
        return (
          <div className="flex gap-2 items-center">
            <img src={logo} className="size-8 rounded" />
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-xs text-txt-tertiary">{short_form}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "yield",
      header: "Yield",
      cell: ({ row }) => {
        const { yield: bondYield } = row.original;
        return <p>{bondYield}%</p>;
      },
    },
    {
      accessorKey: "maturity_date",
      header: "Maturity Date",
    },
    {
      accessorKey: "current_value",
      header: "Current Value",
      cell: ({ row }) => {
        const { current_value } = row.original;
        return <p>₦ {current_value.toLocaleString()}</p>;
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const { id } = row.original;
        return type === "active" ? (
          <Button onClick={() => handleView(id)} size="sm" variant="outline">
            View
          </Button>
        ) : (
          <Button onClick={() => handlePurchase(id)} size="sm">
            Purchase
          </Button>
        );
      },
    },
  ];

  return columns;
};
```

**File:** `index.tsx`
```typescript
"use client";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BondsTableProps<TData> {
  columns: any[];
  data: TData[];
}

export function BondsTable<TData>({ columns, data }: BondsTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              No data available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
```

### Step 7: Add Routes to Constants

**File:** `src/lib/routes.ts`

```typescript
export enum ROUTES {
  // ... existing routes

  // Bonds
  bonds = "/bonds",
  bond_details = "/bonds/[id]",
  bond_purchase = "/bonds/[id]/purchase",
  bond_redeem = "/bonds/[id]/redeem",
}
```

### Step 8: Update Module Exports

**File:** `src/modules/index.ts`

```typescript
// Existing exports
export * from "./mutual-funds";
export * from "./equities";
export * from "./fixed-income";

// Add new module
export * from "./bonds";
```

### Step 9: Test the Module

**Checklist:**
- [ ] Routes are accessible
- [ ] API calls work correctly
- [ ] Data displays properly
- [ ] Forms submit successfully
- [ ] Error handling works
- [ ] Loading states show
- [ ] Navigation works
- [ ] TypeScript compiles without errors
- [ ] No console errors

---

## 14. Updating an Existing Module

### 14.1 Adding a New Feature to Existing Module

**Example: Adding "Top Up" Feature to Mutual Funds**

**Step 1: Create New Route (if needed)**
```
src/app/(protected)/mutual-funds/[id]/top-up/
└── page.tsx
```

**Step 2: Create Component**
```typescript
// src/modules/mutual-funds/top-up.tsx
"use client";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";

const TopUpMutualFundUI = () => {
  const { id } = useParams();
  const router = useRouter();

  return (
    <section>
      <h1>Top Up Fund {id}</h1>
      {/* Component logic */}
    </section>
  );
};

export { TopUpMutualFundUI };
```

**Step 3: Export from Module Index**
```typescript
// src/modules/mutual-funds/index.tsx
export { MutualFundsUI };
export * from "./fund";
export * from "./invest";
export * from "./redeem";
export * from "./top-up"; // Add this
```

**Step 4: Add API Route (if needed)**
```typescript
// src/app/api/mutual-funds/top-up/route.ts
"use server";
import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/requests/error-handler";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await axiosInstanceAuth.post("/mutual-funds/top-up", body);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return apiErrorHandler(error);
  }
}
```

**Step 5: Add Service Hook**
```typescript
// src/requests/services/mutual-funds/top-up.ts
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const topUpService = async (data: any) => {
  const response = await axios.post("/api/mutual-funds/top-up", data);
  return response.data;
};

export const useTopUp = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: topUpService,
    onSuccess,
    onError,
    mutationKey: ["top-up-fund"],
  });
};
```

**Step 6: Add Types (if needed)**
```typescript
// src/types/mutual-fund.ts (add to existing file)
export interface TopUpRequest {
  fund_id: string;
  amount: number;
  currency: "NGN" | "USD";
}

export interface TopUpResponse {
  success: boolean;
  message: string;
}
```

### 14.2 Modifying Existing Component

**Best Practices:**

1. **Read existing code first** - Understand current implementation
2. **Follow existing patterns** - Don't introduce new patterns
3. **Test thoroughly** - Ensure changes don't break existing functionality
4. **Update types** - Keep TypeScript types in sync
5. **Document changes** - Add comments for complex logic

**Example: Adding validation to existing form**

```typescript
// BEFORE
const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
});

// AFTER
const formSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => {
        const num = Number(val.replace(/,/g, ""));
        return !isNaN(num) && num >= minimumInvestment;
      },
      {
        message: `Minimum is ${currencySymbol}${minimumInvestment.toLocaleString()}`,
      }
    ),
});
```

### 14.3 Adding New API Endpoint

**Checklist:**

1. **Create API route** in `src/app/api/`
2. **Create service hook** in `src/requests/services/`
3. **Define types** in `src/types/`
4. **Update component** to use new hook
5. **Test with actual API**

---

## 15. Common Patterns & Best Practices

### 15.1 Error Handling

**API Error Handling:**
```typescript
// In API route
try {
  const response = await axiosInstanceAuth.get("/endpoint");
  return NextResponse.json(response.data);
} catch (error: any) {
  return apiErrorHandler(error); // Centralized error handling
}

// In service hook
try {
  const response = await axios.get("/api/endpoint");
  return response.data;
} catch (error) {
  console.error("Error:", error);
  throw error; // Let React Query handle
}

// In component
const { mutate } = useMutation({
  onSuccess: (data) => {
    setShowSuccessModal(true);
  },
  onError: (error: any) => {
    setErrorMessage(error.message);
    setShowErrorModal(true);
  },
});
```

### 15.2 Loading States

**Always handle loading:**
```typescript
const { data, isLoading, error } = useQuery(...);

if (isLoading) return <PageLoader />;
if (error) return <ErrorState error={error} />;

return <Content data={data} />;
```

**Button loading:**
```typescript
<Button loading={isPending} disabled={isPending}>
  Submit
</Button>
```

### 15.3 Data Transformation

**Use useMemo for expensive transformations:**
```typescript
const transformedData = useMemo(() => {
  if (!portfolioData?.data?.userFunds) return [];
  
  return portfolioData.data.userFunds.map((fund) => ({
    id: fund.productCode,
    name: fund.productName,
    value: fund.currentValue,
    displayValue: `₦ ${fund.currentValue.toLocaleString()}`,
  }));
}, [portfolioData]);
```

### 15.4 Conditional Rendering

**Early returns for clarity:**
```typescript
if (isLoading) return <Skeleton />;
if (error) return <Error />;
if (!data) return <EmptyState />;

return <MainContent />;
```

### 15.5 Environment Variables

**Always use Next.js public env vars for client-side:**
```typescript
// .env
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_PAYMENT_CALLBACK_URL=https://app.example.com/callback

// Usage
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
```

**Server-side only (no NEXT_PUBLIC_ prefix):**
```typescript
// .env
API_SECRET_KEY=secret123

// Only accessible in server components/API routes
```

### 15.6 Code Organization

**Import order:**
```typescript
// 1. React & Next.js
import { useState } from "react";
import { useRouter } from "next/navigation";

// 2. Third-party libraries
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

// 3. UI Components
import { Button } from "@/components/ui/button";
import { Balance } from "@/components/cards/balance";

// 4. Custom components
import { Assets } from "./_components/assets";

// 5. Hooks & Services
import { useFetchData } from "@/requests/services/...";

// 6. Types & Utils
import { DataType } from "@/types/...";
import { formatCurrency } from "@/lib/utils";
```

### 15.7 Commenting Standards

**Component headers:**
```typescript
/**
 * Main mutual funds listing component
 * Displays balance cards and user portfolio
 */
const MutualFundsUI = () => {
  // Component logic
};
```

**Complex logic:**
```typescript
// Transform API data to table format
// API returns nested structure, flatten for display
const tableData = useMemo(() => {
  // ... transformation logic
}, [portfolioData]);
```

**TODO comments:**
```typescript
// TODO: Integrate with v2 API when available
// TODO: Add pagination for large datasets
// TODO: Will be implemented in future sprint
```

### 15.8 Git Workflow

**Branch naming:**
```bash
feature/add-bonds-module
fix/payment-api-error
update/mutual-funds-validation
```

**Commit messages:**
```bash
feat: Add bonds module with purchase flow
fix: Resolve payment API timeout error
update: Enhance mutual funds form validation
refactor: Simplify table column definitions
docs: Update developer onboarding guide
```

---

## 16. Testing & Validation

### 16.1 Manual Testing Checklist

**Before committing code:**

- [ ] Page loads without errors
- [ ] API calls complete successfully
- [ ] Loading states display correctly
- [ ] Error states handle failures
- [ ] Forms validate properly
- [ ] Buttons are disabled during loading
- [ ] Success/error modals appear
- [ ] Navigation works correctly
- [ ] Data displays accurately
- [ ] Responsive design works on mobile
- [ ] TypeScript compiles without errors
- [ ] No console errors or warnings
- [ ] Lint passes (`yarn lint`)

### 16.2 Lint & Format

**Run before commit:**
```bash
# Check linting
yarn lint

# Fix linting issues
yarn lint --fix
```

### 16.3 TypeScript Validation

**Check types:**
```bash
# Verify TypeScript compilation
yarn tsc --noEmit
```

### 16.4 Common Issues & Solutions

**Issue: API route not found**
- Solution: Ensure route file is named `route.ts`
- Restart dev server after adding new routes

**Issue: Module not found**
- Solution: Check import paths use `@/` alias
- Verify file exists and is exported correctly

**Issue: Hydration errors**
- Solution: Ensure server and client render the same HTML
- Use `"use client"` directive for client components

**Issue: React Query data not updating**
- Solution: Check `queryKey` is unique and includes dependencies
- Use `refetch()` or `invalidateQueries()` after mutations

**Issue: Form validation not working**
- Solution: Ensure Zod schema matches form field names
- Check `resolver: zodResolver(formSchema)` is set

---

## 17. Resources & References

### 17.1 Documentation Links

- **Next.js:** https://nextjs.org/docs
- **React Query:** https://tanstack.com/query/latest
- **React Hook Form:** https://react-hook-form.com/
- **Zod:** https://zod.dev/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com/
- **TanStack Table:** https://tanstack.com/table/latest

### 17.2 Key Files to Reference

**When adding a new module, reference:**
- `src/modules/mutual-funds/` - Complete module example
- `src/app/api/mutual-funds/` - API route examples
- `src/requests/services/mutual-funds/` - Service hook examples
- `src/types/mutual-fund.ts` - Type definition examples

**When working with forms:**
- `src/modules/mutual-funds/invest.tsx` - Multi-step form example
- `src/components/form/` - Custom input components

**When working with tables:**
- `src/components/tables/mutual-funds-table/` - Complete table implementation

### 17.3 Code Review Checklist

**Before submitting PR:**

- [ ] Follows existing patterns and conventions
- [ ] All files properly named and organized
- [ ] TypeScript types defined correctly
- [ ] API routes follow three-layer architecture
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Responsive design works
- [ ] No hardcoded values (use constants/env vars)
- [ ] Code is commented where necessary
- [ ] No console.log statements (use console.error for errors)
- [ ] Imports are organized correctly
- [ ] Barrel exports updated
- [ ] Routes added to constants
- [ ] Tested on multiple browsers/devices

---

## 18. Quick Reference

### 18.1 File Naming Cheat Sheet

| Type | Pattern | Example |
|------|---------|---------|
| Page | `page.tsx` | `src/app/(protected)/bonds/page.tsx` |
| Layout | `layout.tsx` | `src/app/(protected)/bonds/layout.tsx` |
| API Route | `route.ts` | `src/app/api/bonds/list/route.ts` |
| Module Index | `index.tsx` | `src/modules/bonds/index.tsx` |
| Module Component | `kebab-case.tsx` | `src/modules/bonds/purchase-bond.tsx` |
| Shared Component | `kebab-case.tsx` | `src/components/payment-method.tsx` |
| UI Component | `kebab-case.tsx` | `src/components/ui/button.tsx` |
| Service Hook | `kebab-case.ts` | `src/requests/services/bonds/list.ts` |
| Type File | `kebab-case.ts` | `src/types/bonds.ts` |
| Utility | `kebab-case.ts` | `src/lib/payment-utils.ts` |
| Hook | `camelCase.tsx` | `src/hooks/useDeviceSize.tsx` |
| Component Folder | `_components/` | `src/modules/bonds/_components/` |

### 18.2 Import Path Aliases

```typescript
@/components      → src/components
@/modules         → src/modules
@/lib             → src/lib
@/types           → src/types
@/hooks           → src/hooks
@/requests        → src/requests
@/store           → src/store
@/assets          → src/assets
```

### 18.3 Common Commands

```bash
# Development
yarn dev                    # Start dev server

# Build
yarn build                  # Production build
yarn start                  # Start production server

# Code Quality
yarn lint                   # Check linting
yarn lint --fix             # Fix linting issues
yarn tsc --noEmit          # Check TypeScript

# Package Management
yarn add [package]          # Install dependency
yarn add -D [package]       # Install dev dependency
```

### 18.4 Key Design Tokens

**Text Colors:**
- `text-txt-primary` - Main text
- `text-txt-secondary` - Secondary text
- `text-txt-tertiary` - Subtle text
- `text-txt-brand` - Brand color
- `text-txt-danger` - Error text
- `text-txt-success` - Success text

**Background Colors:**
- `bg-bg-primary` - Main background
- `bg-bg-secondary` - Card background
- `bg-bg-brand` - Brand background
- `bg-bg-success` - Success background
- `bg-bg-danger` - Error background

**Spacing:**
- `gap-2` = 8px
- `gap-4` = 16px
- `gap-8` = 32px
- `px-4` = 16px horizontal
- `py-6` = 24px vertical

---

## Conclusion

This guide provides a comprehensive overview of the codebase architecture and patterns. Always refer to existing implementations when in doubt, and maintain consistency with established patterns.

**Key Principles:**
1. **Consistency** - Follow existing patterns
2. **Type Safety** - Use TypeScript properly
3. **Separation of Concerns** - Keep layers separate
4. **DRY** - Don't repeat yourself
5. **KISS** - Keep it simple
6. **Documentation** - Comment complex logic
7. **Testing** - Test thoroughly before committing

**When in Doubt:**
- Look at existing module implementations
- Follow the three-layer architecture
- Use TypeScript for type safety
- Test manually before committing
- Ask for code review



---

**Document Version:** 1.0  
**Last Updated:** February 3, 2026  
**Maintainer:** Development Team  
**Contact:** [Team Contact]
