/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as DashboardLayoutImport } from './routes/dashboard/_layout'
import { Route as authLayoutImport } from './routes/(auth)/_layout'
import { Route as DashboardLayoutIndexImport } from './routes/dashboard/_layout/index'
import { Route as authLayoutRegisterImport } from './routes/(auth)/_layout/register'
import { Route as authLayoutPasswordResetImport } from './routes/(auth)/_layout/password-reset'
import { Route as authLayoutLoginImport } from './routes/(auth)/_layout/login'
import { Route as DashboardLayoutAccountIndexImport } from './routes/dashboard/_layout/account/index'
import { Route as DashboardLayoutAdminLayoutImport } from './routes/dashboard/_layout/admin/_layout'
import { Route as DashboardLayoutAccountEditImport } from './routes/dashboard/_layout/account/edit'
import { Route as DashboardLayoutAdminLayoutAccountsImport } from './routes/dashboard/_layout/admin/_layout/accounts'

// Create Virtual Routes

const DashboardImport = createFileRoute('/dashboard')()
const authImport = createFileRoute('/(auth)')()
const DashboardLayoutAdminImport = createFileRoute('/dashboard/_layout/admin')()

// Create/Update Routes

const DashboardRoute = DashboardImport.update({
  path: '/dashboard',
  getParentRoute: () => rootRoute,
} as any)

const authRoute = authImport.update({
  id: '/(auth)',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const DashboardLayoutRoute = DashboardLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => DashboardRoute,
} as any)

const authLayoutRoute = authLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => authRoute,
} as any)

const DashboardLayoutAdminRoute = DashboardLayoutAdminImport.update({
  path: '/admin',
  getParentRoute: () => DashboardLayoutRoute,
} as any)

const DashboardLayoutIndexRoute = DashboardLayoutIndexImport.update({
  path: '/',
  getParentRoute: () => DashboardLayoutRoute,
} as any)

const authLayoutRegisterRoute = authLayoutRegisterImport.update({
  path: '/register',
  getParentRoute: () => authLayoutRoute,
} as any)

const authLayoutPasswordResetRoute = authLayoutPasswordResetImport.update({
  path: '/password-reset',
  getParentRoute: () => authLayoutRoute,
} as any)

const authLayoutLoginRoute = authLayoutLoginImport.update({
  path: '/login',
  getParentRoute: () => authLayoutRoute,
} as any)

const DashboardLayoutAccountIndexRoute =
  DashboardLayoutAccountIndexImport.update({
    path: '/account/',
    getParentRoute: () => DashboardLayoutRoute,
  } as any)

const DashboardLayoutAdminLayoutRoute = DashboardLayoutAdminLayoutImport.update(
  {
    id: '/_layout',
    getParentRoute: () => DashboardLayoutAdminRoute,
  } as any,
)

const DashboardLayoutAccountEditRoute = DashboardLayoutAccountEditImport.update(
  {
    path: '/account/edit',
    getParentRoute: () => DashboardLayoutRoute,
  } as any,
)

const DashboardLayoutAdminLayoutAccountsRoute =
  DashboardLayoutAdminLayoutAccountsImport.update({
    path: '/accounts',
    getParentRoute: () => DashboardLayoutAdminLayoutRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/(auth)': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof authImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/_layout': {
      id: '/_layout'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof authLayoutImport
      parentRoute: typeof authRoute
    }
    '/dashboard': {
      id: '/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof DashboardImport
      parentRoute: typeof rootRoute
    }
    '/dashboard/_layout': {
      id: '/dashboard/_layout'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof DashboardLayoutImport
      parentRoute: typeof DashboardRoute
    }
    '/(auth)/_layout/login': {
      id: '/_layout/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof authLayoutLoginImport
      parentRoute: typeof authLayoutImport
    }
    '/(auth)/_layout/password-reset': {
      id: '/_layout/password-reset'
      path: '/password-reset'
      fullPath: '/password-reset'
      preLoaderRoute: typeof authLayoutPasswordResetImport
      parentRoute: typeof authLayoutImport
    }
    '/(auth)/_layout/register': {
      id: '/_layout/register'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof authLayoutRegisterImport
      parentRoute: typeof authLayoutImport
    }
    '/dashboard/_layout/': {
      id: '/dashboard/_layout/'
      path: '/'
      fullPath: '/dashboard/'
      preLoaderRoute: typeof DashboardLayoutIndexImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/dashboard/_layout/account/edit': {
      id: '/dashboard/_layout/account/edit'
      path: '/account/edit'
      fullPath: '/dashboard/account/edit'
      preLoaderRoute: typeof DashboardLayoutAccountEditImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/dashboard/_layout/admin': {
      id: '/dashboard/_layout/admin'
      path: '/admin'
      fullPath: '/dashboard/admin'
      preLoaderRoute: typeof DashboardLayoutAdminImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/dashboard/_layout/admin/_layout': {
      id: '/dashboard/_layout/admin/_layout'
      path: '/admin'
      fullPath: '/dashboard/admin'
      preLoaderRoute: typeof DashboardLayoutAdminLayoutImport
      parentRoute: typeof DashboardLayoutAdminRoute
    }
    '/dashboard/_layout/account/': {
      id: '/dashboard/_layout/account/'
      path: '/account'
      fullPath: '/dashboard/account'
      preLoaderRoute: typeof DashboardLayoutAccountIndexImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/dashboard/_layout/admin/_layout/accounts': {
      id: '/dashboard/_layout/admin/_layout/accounts'
      path: '/accounts'
      fullPath: '/dashboard/admin/accounts'
      preLoaderRoute: typeof DashboardLayoutAdminLayoutAccountsImport
      parentRoute: typeof DashboardLayoutAdminLayoutImport
    }
  }
}

// Create and export the route tree

interface authLayoutRouteChildren {
  authLayoutLoginRoute: typeof authLayoutLoginRoute
  authLayoutPasswordResetRoute: typeof authLayoutPasswordResetRoute
  authLayoutRegisterRoute: typeof authLayoutRegisterRoute
}

const authLayoutRouteChildren: authLayoutRouteChildren = {
  authLayoutLoginRoute: authLayoutLoginRoute,
  authLayoutPasswordResetRoute: authLayoutPasswordResetRoute,
  authLayoutRegisterRoute: authLayoutRegisterRoute,
}

const authLayoutRouteWithChildren = authLayoutRoute._addFileChildren(
  authLayoutRouteChildren,
)

interface authRouteChildren {
  authLayoutRoute: typeof authLayoutRouteWithChildren
}

const authRouteChildren: authRouteChildren = {
  authLayoutRoute: authLayoutRouteWithChildren,
}

const authRouteWithChildren = authRoute._addFileChildren(authRouteChildren)

interface DashboardLayoutAdminLayoutRouteChildren {
  DashboardLayoutAdminLayoutAccountsRoute: typeof DashboardLayoutAdminLayoutAccountsRoute
}

const DashboardLayoutAdminLayoutRouteChildren: DashboardLayoutAdminLayoutRouteChildren =
  {
    DashboardLayoutAdminLayoutAccountsRoute:
      DashboardLayoutAdminLayoutAccountsRoute,
  }

const DashboardLayoutAdminLayoutRouteWithChildren =
  DashboardLayoutAdminLayoutRoute._addFileChildren(
    DashboardLayoutAdminLayoutRouteChildren,
  )

interface DashboardLayoutAdminRouteChildren {
  DashboardLayoutAdminLayoutRoute: typeof DashboardLayoutAdminLayoutRouteWithChildren
}

const DashboardLayoutAdminRouteChildren: DashboardLayoutAdminRouteChildren = {
  DashboardLayoutAdminLayoutRoute: DashboardLayoutAdminLayoutRouteWithChildren,
}

const DashboardLayoutAdminRouteWithChildren =
  DashboardLayoutAdminRoute._addFileChildren(DashboardLayoutAdminRouteChildren)

interface DashboardLayoutRouteChildren {
  DashboardLayoutIndexRoute: typeof DashboardLayoutIndexRoute
  DashboardLayoutAccountEditRoute: typeof DashboardLayoutAccountEditRoute
  DashboardLayoutAdminRoute: typeof DashboardLayoutAdminRouteWithChildren
  DashboardLayoutAccountIndexRoute: typeof DashboardLayoutAccountIndexRoute
}

const DashboardLayoutRouteChildren: DashboardLayoutRouteChildren = {
  DashboardLayoutIndexRoute: DashboardLayoutIndexRoute,
  DashboardLayoutAccountEditRoute: DashboardLayoutAccountEditRoute,
  DashboardLayoutAdminRoute: DashboardLayoutAdminRouteWithChildren,
  DashboardLayoutAccountIndexRoute: DashboardLayoutAccountIndexRoute,
}

const DashboardLayoutRouteWithChildren = DashboardLayoutRoute._addFileChildren(
  DashboardLayoutRouteChildren,
)

interface DashboardRouteChildren {
  DashboardLayoutRoute: typeof DashboardLayoutRouteWithChildren
}

const DashboardRouteChildren: DashboardRouteChildren = {
  DashboardLayoutRoute: DashboardLayoutRouteWithChildren,
}

const DashboardRouteWithChildren = DashboardRoute._addFileChildren(
  DashboardRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof authLayoutRouteWithChildren
  '/dashboard': typeof DashboardLayoutRouteWithChildren
  '/login': typeof authLayoutLoginRoute
  '/password-reset': typeof authLayoutPasswordResetRoute
  '/register': typeof authLayoutRegisterRoute
  '/dashboard/': typeof DashboardLayoutIndexRoute
  '/dashboard/account/edit': typeof DashboardLayoutAccountEditRoute
  '/dashboard/admin': typeof DashboardLayoutAdminLayoutRouteWithChildren
  '/dashboard/account': typeof DashboardLayoutAccountIndexRoute
  '/dashboard/admin/accounts': typeof DashboardLayoutAdminLayoutAccountsRoute
}

export interface FileRoutesByTo {
  '/': typeof authLayoutRouteWithChildren
  '/dashboard': typeof DashboardLayoutIndexRoute
  '/login': typeof authLayoutLoginRoute
  '/password-reset': typeof authLayoutPasswordResetRoute
  '/register': typeof authLayoutRegisterRoute
  '/dashboard/account/edit': typeof DashboardLayoutAccountEditRoute
  '/dashboard/admin': typeof DashboardLayoutAdminLayoutRouteWithChildren
  '/dashboard/account': typeof DashboardLayoutAccountIndexRoute
  '/dashboard/admin/accounts': typeof DashboardLayoutAdminLayoutAccountsRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof authRouteWithChildren
  '/_layout': typeof authLayoutRouteWithChildren
  '/dashboard': typeof DashboardRouteWithChildren
  '/dashboard/_layout': typeof DashboardLayoutRouteWithChildren
  '/_layout/login': typeof authLayoutLoginRoute
  '/_layout/password-reset': typeof authLayoutPasswordResetRoute
  '/_layout/register': typeof authLayoutRegisterRoute
  '/dashboard/_layout/': typeof DashboardLayoutIndexRoute
  '/dashboard/_layout/account/edit': typeof DashboardLayoutAccountEditRoute
  '/dashboard/_layout/admin': typeof DashboardLayoutAdminRouteWithChildren
  '/dashboard/_layout/admin/_layout': typeof DashboardLayoutAdminLayoutRouteWithChildren
  '/dashboard/_layout/account/': typeof DashboardLayoutAccountIndexRoute
  '/dashboard/_layout/admin/_layout/accounts': typeof DashboardLayoutAdminLayoutAccountsRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/dashboard'
    | '/login'
    | '/password-reset'
    | '/register'
    | '/dashboard/'
    | '/dashboard/account/edit'
    | '/dashboard/admin'
    | '/dashboard/account'
    | '/dashboard/admin/accounts'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/dashboard'
    | '/login'
    | '/password-reset'
    | '/register'
    | '/dashboard/account/edit'
    | '/dashboard/admin'
    | '/dashboard/account'
    | '/dashboard/admin/accounts'
  id:
    | '__root__'
    | '/'
    | '/_layout'
    | '/dashboard'
    | '/dashboard/_layout'
    | '/_layout/login'
    | '/_layout/password-reset'
    | '/_layout/register'
    | '/dashboard/_layout/'
    | '/dashboard/_layout/account/edit'
    | '/dashboard/_layout/admin'
    | '/dashboard/_layout/admin/_layout'
    | '/dashboard/_layout/account/'
    | '/dashboard/_layout/admin/_layout/accounts'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  authRoute: typeof authRouteWithChildren
  DashboardRoute: typeof DashboardRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  authRoute: authRouteWithChildren,
  DashboardRoute: DashboardRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/",
        "/dashboard"
      ]
    },
    "/": {
      "filePath": "(auth)",
      "children": [
        "/_layout"
      ]
    },
    "/_layout": {
      "filePath": "(auth)/_layout.tsx",
      "parent": "/",
      "children": [
        "/_layout/login",
        "/_layout/password-reset",
        "/_layout/register"
      ]
    },
    "/dashboard": {
      "filePath": "dashboard",
      "children": [
        "/dashboard/_layout"
      ]
    },
    "/dashboard/_layout": {
      "filePath": "dashboard/_layout.tsx",
      "parent": "/dashboard",
      "children": [
        "/dashboard/_layout/",
        "/dashboard/_layout/account/edit",
        "/dashboard/_layout/admin",
        "/dashboard/_layout/account/"
      ]
    },
    "/_layout/login": {
      "filePath": "(auth)/_layout/login.tsx",
      "parent": "/_layout"
    },
    "/_layout/password-reset": {
      "filePath": "(auth)/_layout/password-reset.tsx",
      "parent": "/_layout"
    },
    "/_layout/register": {
      "filePath": "(auth)/_layout/register.tsx",
      "parent": "/_layout"
    },
    "/dashboard/_layout/": {
      "filePath": "dashboard/_layout/index.tsx",
      "parent": "/dashboard/_layout"
    },
    "/dashboard/_layout/account/edit": {
      "filePath": "dashboard/_layout/account/edit.tsx",
      "parent": "/dashboard/_layout"
    },
    "/dashboard/_layout/admin": {
      "filePath": "dashboard/_layout/admin",
      "parent": "/dashboard/_layout",
      "children": [
        "/dashboard/_layout/admin/_layout"
      ]
    },
    "/dashboard/_layout/admin/_layout": {
      "filePath": "dashboard/_layout/admin/_layout.tsx",
      "parent": "/dashboard/_layout/admin",
      "children": [
        "/dashboard/_layout/admin/_layout/accounts"
      ]
    },
    "/dashboard/_layout/account/": {
      "filePath": "dashboard/_layout/account/index.tsx",
      "parent": "/dashboard/_layout"
    },
    "/dashboard/_layout/admin/_layout/accounts": {
      "filePath": "dashboard/_layout/admin/_layout/accounts.tsx",
      "parent": "/dashboard/_layout/admin/_layout"
    }
  }
}
ROUTE_MANIFEST_END */
