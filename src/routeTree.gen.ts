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
import { Route as DashboardLayoutSettingsImport } from './routes/dashboard/_layout/settings'
import { Route as authLayoutRegisterImport } from './routes/(auth)/_layout/register'
import { Route as authLayoutPasswordResetImport } from './routes/(auth)/_layout/password-reset'
import { Route as authLayoutLoginImport } from './routes/(auth)/_layout/login'
import { Route as DashboardLayoutNewsIndexImport } from './routes/dashboard/_layout/news/index'
import { Route as DashboardLayoutManagerIndexImport } from './routes/dashboard/_layout/manager/index'
import { Route as DashboardLayoutHomesIndexImport } from './routes/dashboard/_layout/homes/index'
import { Route as DashboardLayoutAccountIndexImport } from './routes/dashboard/_layout/account/index'
import { Route as DashboardLayoutManagerAddImport } from './routes/dashboard/_layout/manager/add'
import { Route as DashboardLayoutAdminLayoutImport } from './routes/dashboard/_layout/admin/_layout'
import { Route as DashboardLayoutAccountEditImport } from './routes/dashboard/_layout/account/edit'
import { Route as DashboardLayoutManagerInfoFeeIdImport } from './routes/dashboard/_layout/manager/info.$feeId'
import { Route as DashboardLayoutManagerDeleteFeeIdImport } from './routes/dashboard/_layout/manager/delete.$feeId'
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

const DashboardLayoutSettingsRoute = DashboardLayoutSettingsImport.update({
  path: '/settings',
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

const DashboardLayoutNewsIndexRoute = DashboardLayoutNewsIndexImport.update({
  path: '/news/',
  getParentRoute: () => DashboardLayoutRoute,
} as any)

const DashboardLayoutManagerIndexRoute =
  DashboardLayoutManagerIndexImport.update({
    path: '/manager/',
    getParentRoute: () => DashboardLayoutRoute,
  } as any)

const DashboardLayoutHomesIndexRoute = DashboardLayoutHomesIndexImport.update({
  path: '/homes/',
  getParentRoute: () => DashboardLayoutRoute,
} as any)

const DashboardLayoutAccountIndexRoute =
  DashboardLayoutAccountIndexImport.update({
    path: '/account/',
    getParentRoute: () => DashboardLayoutRoute,
  } as any)

const DashboardLayoutManagerAddRoute = DashboardLayoutManagerAddImport.update({
  path: '/manager/add',
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

const DashboardLayoutManagerInfoFeeIdRoute =
  DashboardLayoutManagerInfoFeeIdImport.update({
    path: '/manager/info/$feeId',
    getParentRoute: () => DashboardLayoutRoute,
  } as any)

const DashboardLayoutManagerDeleteFeeIdRoute =
  DashboardLayoutManagerDeleteFeeIdImport.update({
    path: '/manager/delete/$feeId',
    getParentRoute: () => DashboardLayoutRoute,
  } as any)

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
    '/dashboard/_layout/settings': {
      id: '/dashboard/_layout/settings'
      path: '/settings'
      fullPath: '/dashboard/settings'
      preLoaderRoute: typeof DashboardLayoutSettingsImport
      parentRoute: typeof DashboardLayoutImport
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
    '/dashboard/_layout/manager/add': {
      id: '/dashboard/_layout/manager/add'
      path: '/manager/add'
      fullPath: '/dashboard/manager/add'
      preLoaderRoute: typeof DashboardLayoutManagerAddImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/dashboard/_layout/account/': {
      id: '/dashboard/_layout/account/'
      path: '/account'
      fullPath: '/dashboard/account'
      preLoaderRoute: typeof DashboardLayoutAccountIndexImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/dashboard/_layout/homes/': {
      id: '/dashboard/_layout/homes/'
      path: '/homes'
      fullPath: '/dashboard/homes'
      preLoaderRoute: typeof DashboardLayoutHomesIndexImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/dashboard/_layout/manager/': {
      id: '/dashboard/_layout/manager/'
      path: '/manager'
      fullPath: '/dashboard/manager'
      preLoaderRoute: typeof DashboardLayoutManagerIndexImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/dashboard/_layout/news/': {
      id: '/dashboard/_layout/news/'
      path: '/news'
      fullPath: '/dashboard/news'
      preLoaderRoute: typeof DashboardLayoutNewsIndexImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/dashboard/_layout/admin/_layout/accounts': {
      id: '/dashboard/_layout/admin/_layout/accounts'
      path: '/accounts'
      fullPath: '/dashboard/admin/accounts'
      preLoaderRoute: typeof DashboardLayoutAdminLayoutAccountsImport
      parentRoute: typeof DashboardLayoutAdminLayoutImport
    }
    '/dashboard/_layout/manager/delete/$feeId': {
      id: '/dashboard/_layout/manager/delete/$feeId'
      path: '/manager/delete/$feeId'
      fullPath: '/dashboard/manager/delete/$feeId'
      preLoaderRoute: typeof DashboardLayoutManagerDeleteFeeIdImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/dashboard/_layout/manager/info/$feeId': {
      id: '/dashboard/_layout/manager/info/$feeId'
      path: '/manager/info/$feeId'
      fullPath: '/dashboard/manager/info/$feeId'
      preLoaderRoute: typeof DashboardLayoutManagerInfoFeeIdImport
      parentRoute: typeof DashboardLayoutImport
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
  DashboardLayoutSettingsRoute: typeof DashboardLayoutSettingsRoute
  DashboardLayoutIndexRoute: typeof DashboardLayoutIndexRoute
  DashboardLayoutAccountEditRoute: typeof DashboardLayoutAccountEditRoute
  DashboardLayoutAdminRoute: typeof DashboardLayoutAdminRouteWithChildren
  DashboardLayoutManagerAddRoute: typeof DashboardLayoutManagerAddRoute
  DashboardLayoutAccountIndexRoute: typeof DashboardLayoutAccountIndexRoute
  DashboardLayoutHomesIndexRoute: typeof DashboardLayoutHomesIndexRoute
  DashboardLayoutManagerIndexRoute: typeof DashboardLayoutManagerIndexRoute
  DashboardLayoutNewsIndexRoute: typeof DashboardLayoutNewsIndexRoute
  DashboardLayoutManagerDeleteFeeIdRoute: typeof DashboardLayoutManagerDeleteFeeIdRoute
  DashboardLayoutManagerInfoFeeIdRoute: typeof DashboardLayoutManagerInfoFeeIdRoute
}

const DashboardLayoutRouteChildren: DashboardLayoutRouteChildren = {
  DashboardLayoutSettingsRoute: DashboardLayoutSettingsRoute,
  DashboardLayoutIndexRoute: DashboardLayoutIndexRoute,
  DashboardLayoutAccountEditRoute: DashboardLayoutAccountEditRoute,
  DashboardLayoutAdminRoute: DashboardLayoutAdminRouteWithChildren,
  DashboardLayoutManagerAddRoute: DashboardLayoutManagerAddRoute,
  DashboardLayoutAccountIndexRoute: DashboardLayoutAccountIndexRoute,
  DashboardLayoutHomesIndexRoute: DashboardLayoutHomesIndexRoute,
  DashboardLayoutManagerIndexRoute: DashboardLayoutManagerIndexRoute,
  DashboardLayoutNewsIndexRoute: DashboardLayoutNewsIndexRoute,
  DashboardLayoutManagerDeleteFeeIdRoute:
    DashboardLayoutManagerDeleteFeeIdRoute,
  DashboardLayoutManagerInfoFeeIdRoute: DashboardLayoutManagerInfoFeeIdRoute,
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
  '/dashboard/settings': typeof DashboardLayoutSettingsRoute
  '/dashboard/': typeof DashboardLayoutIndexRoute
  '/dashboard/account/edit': typeof DashboardLayoutAccountEditRoute
  '/dashboard/admin': typeof DashboardLayoutAdminLayoutRouteWithChildren
  '/dashboard/manager/add': typeof DashboardLayoutManagerAddRoute
  '/dashboard/account': typeof DashboardLayoutAccountIndexRoute
  '/dashboard/homes': typeof DashboardLayoutHomesIndexRoute
  '/dashboard/manager': typeof DashboardLayoutManagerIndexRoute
  '/dashboard/news': typeof DashboardLayoutNewsIndexRoute
  '/dashboard/admin/accounts': typeof DashboardLayoutAdminLayoutAccountsRoute
  '/dashboard/manager/delete/$feeId': typeof DashboardLayoutManagerDeleteFeeIdRoute
  '/dashboard/manager/info/$feeId': typeof DashboardLayoutManagerInfoFeeIdRoute
}

export interface FileRoutesByTo {
  '/': typeof authLayoutRouteWithChildren
  '/dashboard': typeof DashboardLayoutIndexRoute
  '/login': typeof authLayoutLoginRoute
  '/password-reset': typeof authLayoutPasswordResetRoute
  '/register': typeof authLayoutRegisterRoute
  '/dashboard/settings': typeof DashboardLayoutSettingsRoute
  '/dashboard/account/edit': typeof DashboardLayoutAccountEditRoute
  '/dashboard/admin': typeof DashboardLayoutAdminLayoutRouteWithChildren
  '/dashboard/manager/add': typeof DashboardLayoutManagerAddRoute
  '/dashboard/account': typeof DashboardLayoutAccountIndexRoute
  '/dashboard/homes': typeof DashboardLayoutHomesIndexRoute
  '/dashboard/manager': typeof DashboardLayoutManagerIndexRoute
  '/dashboard/news': typeof DashboardLayoutNewsIndexRoute
  '/dashboard/admin/accounts': typeof DashboardLayoutAdminLayoutAccountsRoute
  '/dashboard/manager/delete/$feeId': typeof DashboardLayoutManagerDeleteFeeIdRoute
  '/dashboard/manager/info/$feeId': typeof DashboardLayoutManagerInfoFeeIdRoute
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
  '/dashboard/_layout/settings': typeof DashboardLayoutSettingsRoute
  '/dashboard/_layout/': typeof DashboardLayoutIndexRoute
  '/dashboard/_layout/account/edit': typeof DashboardLayoutAccountEditRoute
  '/dashboard/_layout/admin': typeof DashboardLayoutAdminRouteWithChildren
  '/dashboard/_layout/admin/_layout': typeof DashboardLayoutAdminLayoutRouteWithChildren
  '/dashboard/_layout/manager/add': typeof DashboardLayoutManagerAddRoute
  '/dashboard/_layout/account/': typeof DashboardLayoutAccountIndexRoute
  '/dashboard/_layout/homes/': typeof DashboardLayoutHomesIndexRoute
  '/dashboard/_layout/manager/': typeof DashboardLayoutManagerIndexRoute
  '/dashboard/_layout/news/': typeof DashboardLayoutNewsIndexRoute
  '/dashboard/_layout/admin/_layout/accounts': typeof DashboardLayoutAdminLayoutAccountsRoute
  '/dashboard/_layout/manager/delete/$feeId': typeof DashboardLayoutManagerDeleteFeeIdRoute
  '/dashboard/_layout/manager/info/$feeId': typeof DashboardLayoutManagerInfoFeeIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/dashboard'
    | '/login'
    | '/password-reset'
    | '/register'
    | '/dashboard/settings'
    | '/dashboard/'
    | '/dashboard/account/edit'
    | '/dashboard/admin'
    | '/dashboard/manager/add'
    | '/dashboard/account'
    | '/dashboard/homes'
    | '/dashboard/manager'
    | '/dashboard/news'
    | '/dashboard/admin/accounts'
    | '/dashboard/manager/delete/$feeId'
    | '/dashboard/manager/info/$feeId'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/dashboard'
    | '/login'
    | '/password-reset'
    | '/register'
    | '/dashboard/settings'
    | '/dashboard/account/edit'
    | '/dashboard/admin'
    | '/dashboard/manager/add'
    | '/dashboard/account'
    | '/dashboard/homes'
    | '/dashboard/manager'
    | '/dashboard/news'
    | '/dashboard/admin/accounts'
    | '/dashboard/manager/delete/$feeId'
    | '/dashboard/manager/info/$feeId'
  id:
    | '__root__'
    | '/'
    | '/_layout'
    | '/dashboard'
    | '/dashboard/_layout'
    | '/_layout/login'
    | '/_layout/password-reset'
    | '/_layout/register'
    | '/dashboard/_layout/settings'
    | '/dashboard/_layout/'
    | '/dashboard/_layout/account/edit'
    | '/dashboard/_layout/admin'
    | '/dashboard/_layout/admin/_layout'
    | '/dashboard/_layout/manager/add'
    | '/dashboard/_layout/account/'
    | '/dashboard/_layout/homes/'
    | '/dashboard/_layout/manager/'
    | '/dashboard/_layout/news/'
    | '/dashboard/_layout/admin/_layout/accounts'
    | '/dashboard/_layout/manager/delete/$feeId'
    | '/dashboard/_layout/manager/info/$feeId'
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
        "/dashboard/_layout/settings",
        "/dashboard/_layout/",
        "/dashboard/_layout/account/edit",
        "/dashboard/_layout/admin",
        "/dashboard/_layout/manager/add",
        "/dashboard/_layout/account/",
        "/dashboard/_layout/homes/",
        "/dashboard/_layout/manager/",
        "/dashboard/_layout/news/",
        "/dashboard/_layout/manager/delete/$feeId",
        "/dashboard/_layout/manager/info/$feeId"
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
    "/dashboard/_layout/settings": {
      "filePath": "dashboard/_layout/settings.tsx",
      "parent": "/dashboard/_layout"
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
    "/dashboard/_layout/manager/add": {
      "filePath": "dashboard/_layout/manager/add.tsx",
      "parent": "/dashboard/_layout"
    },
    "/dashboard/_layout/account/": {
      "filePath": "dashboard/_layout/account/index.tsx",
      "parent": "/dashboard/_layout"
    },
    "/dashboard/_layout/homes/": {
      "filePath": "dashboard/_layout/homes/index.tsx",
      "parent": "/dashboard/_layout"
    },
    "/dashboard/_layout/manager/": {
      "filePath": "dashboard/_layout/manager/index.tsx",
      "parent": "/dashboard/_layout"
    },
    "/dashboard/_layout/news/": {
      "filePath": "dashboard/_layout/news/index.tsx",
      "parent": "/dashboard/_layout"
    },
    "/dashboard/_layout/admin/_layout/accounts": {
      "filePath": "dashboard/_layout/admin/_layout/accounts.tsx",
      "parent": "/dashboard/_layout/admin/_layout"
    },
    "/dashboard/_layout/manager/delete/$feeId": {
      "filePath": "dashboard/_layout/manager/delete.$feeId.tsx",
      "parent": "/dashboard/_layout"
    },
    "/dashboard/_layout/manager/info/$feeId": {
      "filePath": "dashboard/_layout/manager/info.$feeId.tsx",
      "parent": "/dashboard/_layout"
    }
  }
}
ROUTE_MANIFEST_END */
