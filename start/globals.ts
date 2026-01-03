import env from '#start/env'
import edge from 'edge.js'

export const G_USER_ROLE = {
  ADMIN: {
    ID: 1,
    NAME: 'Admin',
  },
  EMPLOYEE: {
    ID: 2,
    NAME: 'Employee',
  },
  RESTRICTED_EMPLOYEE: {
    ID: 3,
    NAME: 'Restricted Employee',
  },
} as const

export const G_USER_STATUS_TAG = {
  ACTIVE: {
    ID: 1,
    NAME: 'Active',
  },
  ONLINE: {
    ID: 2,
    NAME: 'Online',
  },
  OFFLINE: {
    ID: 3,
    NAME: 'Offline',
  },
  WAITINGAPPROVAL: {
    ID: 4,
    NAME: 'Waiting Approval',
  },
  ARCHIVED: {
    ID: 5,
    NAME: 'Archived',
  },
  REGISTERING: {
    ID: 6,
    NAME: 'Registering',
  },
  EMAILNOTVERIFIED: {
    ID: 7,
    NAME: 'Email Not Verified',
  },
  EMAILVERIFIED: {
    ID: 8,
    NAME: 'Email Verified',
  },
  NEEDTOFILLOUTUSERINFO: {
    ID: 9,
    NAME: 'Need To Fill Out User Information',
  },
} as const

export enum G_TITLE_NAME_POSITION {
  PRE = 1,
  POST = 2,
}

export const G_REGISTER_CODE_LENGTH = env.get('REGISTER_CODE_LENGTH', 6)
export const G_ORGANIZATION_NAME = env.get('ORGANIZATION_NAME', 'Dinas Komunikasi, Informatika dan Statistik Pemerintah Kota Denpasar')
export const G_ORGANIZATION_SHORT_NAME = env.get('ORGANIZATION_SHORT_NAME', 'Dinas Komunikasi, Informatika dan Statistik Pemerintah Kota Denpasar')
export const G_APP_NAME = env.get('APP_NAME', 'Sistem Manajemen Arsip Record Center')
export const G_APP_SHORT_NAME = env.get('APP_SHORT_NAME', 'SMARC')
export const G_APP_YEAR_MADE = env.get('APP_YEAR_MADE', "2025")
export const G_USER_ACCOUNT_PASSWORD_MIN_LENGTH = env.get('USER_ACCOUNT_PASSWORD_MIN_LENGTH', 8)
export const G_REGISTER_CODE_EXPIRY_TIME_MINUTE = env.get('REGISTER_CODE_EXPIRY_TIME_MINUTE', 20160)

edge.global('G_REGISTER_CODE_LENGTH', G_REGISTER_CODE_LENGTH)
edge.global('G_USER_ROLE', G_USER_ROLE)
edge.global('G_ORGANIZATION_NAME', G_ORGANIZATION_NAME)
edge.global('G_ORGANIZATION_SHORT_NAME', G_ORGANIZATION_SHORT_NAME)
edge.global('G_APP_NAME', G_APP_NAME)
edge.global('G_APP_SHORT_NAME', G_APP_SHORT_NAME)
edge.global('G_APP_YEAR_MADE', G_APP_YEAR_MADE)
