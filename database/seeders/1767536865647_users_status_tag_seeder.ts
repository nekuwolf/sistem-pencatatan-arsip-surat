import UsersStatusTag from '#models/users_status_tags'
import { G_USER_STATUS_TAG } from '#start/globals'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { resetAutoIncrement } from '../../app/helpers/reset_auto_increment.js'
import UserStatusTag from '#models/users_status_tags'

export default class UserStatusTagSeeder extends BaseSeeder {
  async run() {
    await UsersStatusTag.updateOrCreateMany('id', [
      { 
        id: G_USER_STATUS_TAG.ACTIVE.ID,
        name: G_USER_STATUS_TAG.ACTIVE.NAME,
        description: 'This user account is active'
      },
      { 
        id: G_USER_STATUS_TAG.ONLINE.ID,
        name: G_USER_STATUS_TAG.ONLINE.NAME,
        description: 'This user account is online'
      },
      { 
        id: G_USER_STATUS_TAG.OFFLINE.ID,
        name: G_USER_STATUS_TAG.OFFLINE.NAME,
        description: 'This user account is offline'
      },
      { 
        id: G_USER_STATUS_TAG.WAITINGAPPROVAL.ID,
        name: G_USER_STATUS_TAG.WAITINGAPPROVAL.NAME,
        description: 'User awaiting approval or verification'
      },
      { 
        id: G_USER_STATUS_TAG.ARCHIVED.ID,
        name: G_USER_STATUS_TAG.ARCHIVED.NAME,
        description: 'This user is in archive/read-only state'
      },
      { 
        id: G_USER_STATUS_TAG.REGISTERING.ID,
        name: G_USER_STATUS_TAG.REGISTERING.NAME,
        description: 'This user is currently registering'
      },
      { 
        id: G_USER_STATUS_TAG.EMAILNOTVERIFIED.ID,
        name: G_USER_STATUS_TAG.EMAILNOTVERIFIED.NAME,
        description: 'This user Email is not verified'
      },
      { 
        id: G_USER_STATUS_TAG.EMAILVERIFIED.ID,
        name: G_USER_STATUS_TAG.EMAILVERIFIED.NAME,
        description: 'This user Email is verified'
      },
      { 
        id: G_USER_STATUS_TAG.NEEDTOFILLOUTUSERINFO.ID,
        name: G_USER_STATUS_TAG.NEEDTOFILLOUTUSERINFO.NAME,
        description: 'This user need to fill out their information'
      },
    ])

    await resetAutoIncrement(UserStatusTag.table, 100)
    
  }
}
