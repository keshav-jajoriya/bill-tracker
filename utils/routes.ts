export const ROUTES = {
  home: '/(tabs)',
  listDetail: (id: string) => ({ pathname: '/list/[id]', params: { id } }),
  PdfPreview: (id: string) => ({ pathname: '/pdf-preview/[id]', params: { id } }),
  profile: '/profile',
};