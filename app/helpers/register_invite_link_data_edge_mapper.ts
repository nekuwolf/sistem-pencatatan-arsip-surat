import RegisterInviteLink from '#models/register_invite_link'
import router from '@adonisjs/core/services/router'
import { DateTime } from 'luxon'

export function mapRegisterInviteLinksToEdgeView(links: RegisterInviteLink[] | RegisterInviteLink | null) {
  
  // 1. Always define the columns structure first
  const columns = [
      { key: 'id', label: 'ID', hidden: true },
      { key: 'key', label: 'Kode Registrasi' },
      { key: 'targetPosition', label: 'Target Posisi' },
      { key: 'status', label: 'Status' },
      { key: 'createdBy', label: 'Dibuat Oleh' },
      { key: 'createdAt', label: 'Dibuat Pada' },
      { key: 'actions', label: 'Aksi' },
  ]

  // 2. Safety Check: Return structure with empty data if input is missing/empty
  // This prevents the "reading 'filter' of undefined" error in the view
  if (!links || (Array.isArray(links) && links.length === 0)) {
    return {
      columns: columns,
      datas: []
    }
  }

  const linkArray = Array.isArray(links) ? links : [links]

  return {
    columns: columns,

    datas: linkArray.map((link: RegisterInviteLink) => {
      // Logic for Status Badge
      let statusValue = 'Aktif (Belum Dipakai)'
      // Note: Ensure your Model has these fields or relations loaded
      if (link.usedAt) {
        statusValue = 'Sudah Dipakai'
      } else if (link.expireAt < DateTime.now()) {
        statusValue = 'Kadaluarsa'
      }

      return {
        id: { value: link.id, hidden: true },
        
        // Mark: TITLE -> Renders as main bold text in Mobile List
        key: { value: link.key, mark: 'TITLE' },
        
        // Mark: CONTENT -> Renders as main body text
        targetPosition: { 
          value: [
            link.newUserOrganization?.name, 
            link.newUserDepartment?.name, 
            link.newUserJobRole?.name
          ].filter(Boolean).join(' / ') || '-',
          mark: 'CONTENT'
        },

        // Mark: STATUSBADGE -> Renders as a badge
        status: { value: statusValue, mark: 'STATUSBADGE' },

        // Mark: SUBCONTENT -> Small text below content
        createdBy: { value: link.createdByUser?.fullName || 'System', mark: 'SUBCONTENT' },
        
        // Mark: SUBTITLE -> Small text next to Title
        createdAt: { value: link.createdAt.toFormat('dd/MM/yyyy HH:mm'), mark: 'SUBTITLE' },

        // Mark: ACTIONVIEWDETAIL -> Trigger for the "Detail" button/chevron
        actions: [{ 
          value: router.makeUrl('registerInviteLinks.show', { id: link.id }), 
          mark: 'ACTIONVIEWDETAIL' 
        }]
      }
    }),
  }
}