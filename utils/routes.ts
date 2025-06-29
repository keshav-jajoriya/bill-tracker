export const ROUTES = {
  home: '/(tabs)',
  listDetail: (id: string) => ({ pathname: '/list/[id]', params: { id } }),
  profile: '/profile',
};