const libraryTransferRecords = {
  path: '/library_home_page/library_transfer_records',
  meta: { title: '书馆转让', icon: 'Basic-Configuration', noCache: true },
  component: () => import('@/views/plibrary/library/manage/library_transfer_records'),
}

export default libraryTransferRecords

