import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating a new mail record.
 * Used in MailDashboardController.store
 */
export const createMailValidator = vine.compile(
  vine.object({
    // Text and Numeric Fields
    mail_source: vine.string().trim().minLength(3).maxLength(255),
    full_mail_code: vine.string().trim(),
    agenda_number: vine.number().positive(),
    
    // Dates (HTML5 date inputs send 'YYYY-MM-DD')
    mail_date: vine.date({
      formats: ['YYYY-MM-DD']
    }),
    
    // DateTime-local sends 'YYYY-MM-DDTHH:mm'
    registered_at: vine.date({
      formats: ['YYYY-MM-DDTHH:mm', 'YYYY-MM-DD HH:mm:ss']
    }),

    mail_paper_count: vine.number().min(0),
    mail_attachment_paper_count: vine.number().min(0),
    mail_content_summary: vine.string().trim().maxLength(1000).optional(),

    // Foreign Keys (Ensure they exist in your DB)
    mail_type_id: vine.number(),
    mail_priority_id: vine.number(),
    mail_code_id: vine.number(),

    // File Upload (Optional during initial record creation)
    mail_file: vine.file({
      size: '10mb',
      extnames: [
        // Images
        'jpg', 'jpeg', 'png', 'gif', 'webp',

        // Documents
        'pdf',
        'doc', 'docx',
        'xls', 'xlsx',
        'ppt', 'pptx',
        'txt',
        'csv',
      ],
    }).optional(),

    rack_name: vine.string().trim().optional(),
    shelf_name: vine.string().trim().optional(),
    box_name: vine.string().trim().optional(),
    envelope_name: vine.string().trim().optional()
  })
)

/**
 * Validator to validate the payload when updating an existing mail record.
 * We use 'optional()' on fields to allow partial updates.
 */
export const updateMailValidator = vine.compile(
  vine.object({
    mail_source: vine.string().trim().optional(),
    full_mail_code: vine.string().trim().optional(),
    agenda_number: vine.number().positive().optional(),
    mail_date: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
    registered_at: vine.date({ formats: ['YYYY-MM-DDTHH:mm'] }).optional(),
    mail_paper_count: vine.number().min(0).optional(),
    mail_attachment_paper_count: vine.number().min(0).optional(),
    mail_content_summary: vine.string().trim().optional(),
    mail_type_id: vine.number().optional(),
    mail_priority_id: vine.number().optional(),
    mail_code_id: vine.number().optional(),
    rack_name: vine.string().trim().optional(),
    shelf_name: vine.string().trim().optional(),
    box_name: vine.string().trim().optional(),
    envelope_name: vine.string().trim().nullable().optional()
  })
)