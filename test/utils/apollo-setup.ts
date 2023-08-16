// Silences "Download the Apollo DevTools for a better development experience" message
// https://github.com/apollographql/apollo-client/issues/10098
vi.stubGlobal('__DEV__', false)
