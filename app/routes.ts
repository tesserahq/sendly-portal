import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
  // Theme
  route('/resources/update-theme', 'routes/resources/update-theme.ts'),

  // Home Route
  route('/', 'routes/index.tsx', { id: 'home' }),

  // Private Routes
  layout('layouts/private.layouts.tsx', [
    route('activity', 'routes/main/activity/index.tsx'),
    route('activity/:emailID', 'routes/main/activity/detail/layout.tsx', [
      index('routes/main/activity/detail/index.tsx'),
      route('overview', 'routes/main/activity/detail/overview.tsx'),
    ]),
    route('broadcasts', 'routes/main/broadcasts/index.tsx'),
    route('broadcasts/:batchID', 'routes/main/broadcasts/detail/layout.tsx', [
      index('routes/main/broadcasts/detail/index.tsx'),
      route('overview', 'routes/main/broadcasts/detail/overview.tsx'),
    ]),
    route('providers', 'routes/main/providers/index.tsx'),
    route('layouts', 'routes/main/layouts/layout.tsx', [
      index('routes/main/layouts/index.tsx'),
      route('new', 'routes/main/layouts/new.tsx'),
      route(':layoutID', 'routes/main/layouts/detail/layout.tsx', [
        index('routes/main/layouts/detail/index.tsx'),
        route('overview', 'routes/main/layouts/detail/overview.tsx'),
      ]),
      route(':layoutID/edit', 'routes/main/layouts/edit.tsx'),
    ]),
    route('templates', 'routes/main/templates/layout.tsx', [
      index('routes/main/templates/index.tsx'),
      route('new', 'routes/main/templates/new.tsx'),
      route(':templateID', 'routes/main/templates/detail/layout.tsx', [
        index('routes/main/templates/detail/index.tsx'),
        route('overview', 'routes/main/templates/detail/overview.tsx'),
      ]),
      route(':templateID/edit', 'routes/main/templates/edit.tsx'),
    ]),
  ]),

  // Access Denied
  route('access-denies', 'routes/access-denies.tsx'),

  // Logout Route
  route('logout', 'routes/logout.tsx', { id: 'logout' }),

  // Catch-all route for 404 errors - must be last
  route('*', 'routes/not-found.tsx'),
] as RouteConfig
