import Mail from '#models/mail'
import router from '@adonisjs/core/services/router'

export function mapMailsDatasToDesktopTableMobileListEdgeView(
  mails: Mail[] | Mail | null
) {
  if (!mails) return null

  const mailArray = Array.isArray(mails) ? mails : [mails]

  return {
    columns: [
      { key: 'id', label: 'id', hidden: true },
      { key: 'fullMailCode', label: 'Kode Surat' },
      { key: 'agendaNumber', label: 'Nomor Agenda' },
      { key: 'mailCode', label: 'Kode Klasifikasi' },
      { key: 'mailYear', label: 'Tahun Surat' },
      { key: 'mailContentSumarry', label: 'Isi Singkat' },
      { key: 'paper', label: 'Jumlah Diarsipkan' },
      { key: 'archiveLocation', label: 'Tempat Arsip' },
      { key: 'boxName', label: 'Nama Kotak' },
      { key: 'envelopeName', label: 'Sampul' },
      { key: 'status', label: 'Status' },
      { key: 'actions', label: 'Aksi' },
    ],

    datas: mailArray.map((mail: Mail) => {
      return {
        id: { value: mail.id },

        // Mobile TITLE
        fullMailCode: {
          value: mail.fullMailCode || '-',
          mark: 'TITLE',
        },

        // Mobile SUBTITLE
        agendaNumber: {
          value: mail.agendaNumber ?? '-',
          mark: 'SUBTITLE',
        },

        mailCode: {
          value: `${mail.mailCode.code} - ${mail.mailCode.shortIndex}` || '-',
        },

        mailYear: {
          value: mail.mailDate?.toFormat('yyyy') || '-',
        },

        mailContentSumarry: {
          value: mail.mailContentSummary || '-',
          mark: 'CONTENT',
        },

        archiveLocation: {
          value: [
            mail.rackName && mail.shelfName ? `${mail.rackName}.${mail.shelfName}` : mail.rackName || mail.shelfName || null,
            [mail.boxName, mail.envelopeName].filter(Boolean).join(' | ')
          ]
            .filter(Boolean)
            .join(' | ')
            || '-',
          mark: 'SUBCONTENT',
        },

        boxName: {
          value: mail.boxName || '-',
        },

        envelopeName: {
          value: mail.envelopeName || '-',
        },

        status: {
          value: mail.rackName && mail.shelfName && mail.boxName ? 'Diarsipkan' : '',
          mark: 'STATUSBADGE',
        },

        paper: {
          value: [
            mail.mailPaperCount ? `${mail.mailPaperCount} lembar surat` : null,
            mail.mailAttachmentPaperCount
              ? `+ ${mail.mailAttachmentPaperCount} lembar lainnya`
              : null,
          ]
            .filter(Boolean)
            .join(' '),
        },

        actions: [
          {
            value: router.makeUrl('mails.show', {
              mailId: mail.id,
            }),
            mark: 'ACTIONVIEWDETAIL',
          },
          
          {
            value: router.makeUrl('mails.show', {
              mailId: mail.id,
            }, { qs: { edit: 'true' } }),
            mark: 'ACTIONEDIT',
          },

          ...(mail.uploadedMailFileId
            ? [
                {
                  value: router.makeUrl('mails.file.show', {
                    mailId: mail.id,
                  }),
                  mark: 'ACTIONDOWNLOAD',
                },
              ]
            : []),
        ],
      }
    }),
  }
}
