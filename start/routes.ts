/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import DashboardController from '#controllers/dashboard_controller'
import LoginController from '#controllers/login_controller'
import RegisterController from '#controllers/register_controller'
import UserProfileController from '#controllers/user_profile_controller'
import UserDataController from '#controllers/user_data_controller'
import SandboxesController from '#controllers/sandboxes_controller'
import GenderController from '#controllers/gender_controller'
import RegisterInviteLinkController from '#controllers/register_invite_link_controller'
import LogoutController from '#controllers/logout_controller'
import { middleware } from '#start/kernel'
import UserProfilePictureController from '#controllers/user_profile_picture_controller'
import UserDataProfilePictureController from '#controllers/user_data_profile_picture_controller'
import MailDashboardController from '#controllers/mail_dashboard_controller'
import MailFileController from '#controllers/mail_file_controller'
import MailArchiveDashboardController from '#controllers/mail_archive_dashboard_controller'
import MailCode from '#models/mail_code'
import MailCodesController from '#controllers/mail_code_controller'

router.on('/').redirect('auth.login.store')

router.get('/dashboard', [DashboardController, 'index']).as('dashboard.index').use(middleware.auth({ guards: ['web'] }))

// TODO: implement later 
// router.get('/error/bad_request', [BadRequsetController, 'index']).as('dashboard.index')

// GET /account/login?email=...
// show login form
// if email is provided autofill email field
router.get('/login', [LoginController, 'create']).as('auth.login.create').use(middleware.guest())

// POST /account/login
// login form submit
// body : MUST email, MUST password
router.post('/login', [LoginController, 'store']).as('auth.login.store')

// GET /account/register?register_code=...
// show register form
// MUST register_code is newly created user id
// MUST referrer is user who created the register_code
// no/invalid 'MUST' redirect to 404 not found
// router.get('/register', [RegisterController, 'create']).as('auth.register.create').use(middleware.guest())

// POST /account/register
// register form submit
// body : MUST register_code=[user_id], MUST referrer=[user_id]
// MUST email=[email], MUST password=[password]
// router.post('/register', [RegisterController, 'store']).as('auth.register.store')

// start/routes.ts
router.group(() => {
  router.get('/register', [RegisterController, 'create']).as('register.create')
  router.post('/register/verify', [RegisterController, 'verify']).as('register.verify')
  router.post('/register', [RegisterController, 'store']).as('register.store')
}).as('auth')

// GET /account/register/verify_otp?email=[email]&otp_code=[otp_code]
// show otp verification form
// MUST email
// OPTION otp_code, if code is provided
// autofill the otp code field
// router.get('/register/verify_otp', [OtpVerificationController, 'create']).as('auth.register.verify_otp.create') 

// POST /account/register/verify_otp
// otp verification form submit
// body : MUST email=[email], MUST otp_code=[otp_code]
// router.post('/register/verify_otp', [OtpVerificationController, 'store']).as('auth.register.verify_otp.store')

// GET /dashboard/invite_link
// invite link show ALL data
// router.get('/dashboard/invite_link', [RegisterInviteLinkController, 'index']).as('dashboard.invite_link.index')

// GET /dashboard/invite_link
// invite link show ONE data detail
// router.get('/dashboard/invite_link/:id', [RegisterInviteLinkController, 'show']).as('dashboard.invite_link.show')

// POST /dashboard/invite_link
// invite link creation endpoint
// body : MUST created_by_user_id TODO: get from session/auth?
// router.put('/dashboard/invite_link', [RegisterInviteLinkController, 'store']).as('dashboard.invite_link.store')

// NOTE: for now its safe to actually delete register invite link
// POST /dashboard/invite_link/[id]
// invite link updation endpoint
// workaround for html GET/POST limitation -> route('dashboard.invite_link.destroy', {}, { qs: { _method: 'DELETE' } })
// router.delete('/dashboard/invite_link/:id', [RegisterInviteLinkController, 'destroy']).as('dashboard.invite_link.destroy')

// own profile
// router.get('/profile', [UserProfileController, 'index']).as('account.profile.index').use(middleware.auth({ guards: ['web'] }))
// router.post('/profile', [UserProfileController, 'update']).as('account.profile.update').use(middleware.auth({ guards: ['web'] }))
// router.get('/profile/picture', [UserProfilePictureController, 'index']).as('account.profile.picture.show').use(middleware.auth({ guards: ['web'] }))
// router.post('/profile/picture', [UserProfilePictureController, 'update']).as('account.profile.picture.store').use(middleware.auth({ guards: ['web'] }))

// profile picture api

router.get('/archive', [SandboxesController, 'index']).as('archive.index').use(middleware.auth({ guards: ['web'] }))
router.get('/register_invite_link', [RegisterInviteLinkController, 'index']).as('registerInviteLink.index')

router.get('/api/v1/gender/search', [GenderController, 'searchApi']).as('api.gender.search')


router.get('/logout', [LogoutController, 'store']).as('auth.logout.store').use(middleware.auth({ guards: ['web'] }))

// shows user data dashboard
// router.get('/user', [UserDataController, 'index']).as('user.index').use(middleware.auth({ guards: ['web'] }))
// router.get('/user/:userId', [UserDataController, 'show']).as('user.show').use(middleware.auth({ guards: ['web'] }))
// router.post('/user/:userId', [UserDataController, 'show']).as('user.update').use(middleware.auth({ guards: ['web'] }))
// router.get('/user/:userId/picture', [UserDataProfilePictureController, 'user.profile.show']).as('api.account.profile.picture.show').use(middleware.auth({ guards: ['web'] }))
// router.post('/user/:userId/picture', [UserDataProfilePictureController, 'user.profile.update']).as('api.account.profile.picture.show').use(middleware.auth({ guards: ['web'] }))

router.group(() => {

  // --- Group 1: Own Profile (Current User) ---
  router.group(() => {
    // Main Profile View & Update
    router.get('/', [UserProfileController, 'index']).as('account.profile.index')
    // This single POST now handles both text and the avatar upload
    router.post('/', [UserProfileController, 'update']).as('account.profile.update')
    // The GET route remains necessary to stream the image to the <img> tag
    router.get('/picture', [UserProfileController, 'showAvatar']).as('account.profile.picture.show')
  }).prefix('profile')

  // --- Group 2: User Management (Admin/Dashboard) ---
  router.group(() => {
    // List & Show User Data
    router.get('/', [UserDataController, 'index']).as('users.index')
    // router.get('/:userId', [UserDataController, 'show']).as('users.show')
    // Update User General Info
    // router.post('/:userId', [UserDataController, 'update']).as('users.update')
    // User Picture Management (Now handled by UserDataController)
    router.get('/:userId/picture', [UserDataController, 'showPicture']).as('users.picture.show')
    router.post('/:userId/picture', [UserDataController, 'updatePicture']).as('users.picture.update')
  }).prefix('user').use(middleware.adminOnly())

  // --- Group 2: Mail Management (Admin/Dashboard) ---
  router.group(() => {

    // 1. Static Routes (MUST COME FIRST)
    // If these are below /:mailId, the router will think "create" is an ID
    router.get('/create', [MailDashboardController, 'create']).as('mails.create')
    router.post('/create', [MailDashboardController, 'store']).as('mails.store')

    // 2. Dynamic Routes (General)
    router.get('/', [MailDashboardController, 'index']).as('mails.index')
    router.get('/:mailId', [MailDashboardController, 'show']).as('mails.show')
    
    // Update Mail
    router.post('/:mailId', [MailDashboardController, 'update']).as('mails.update')

    // 3. Sub-Resources (Mail Files)
    // Changed :userId -> :mailId to allow fetching the file belonging to this specific mail
    router.get('/:mailId/file', [MailDashboardController, 'showFile']).as('mails.file.show')

  }).prefix('mail')

  router.group(() => {
    // static
    router.get('/create', [MailArchiveDashboardController, 'create']).as('mailArchives.create')
    router.post('/create', [MailArchiveDashboardController, 'store']).as('mailArchives.store')

    // 2. Dynamic Routes (General)
    router.get('/', [MailArchiveDashboardController, 'index']).as('mailArchives.index')
    router.get('/:mailArchiveId', [MailArchiveDashboardController, 'show']).as('mailArchives.show')
    
    // Update Mail
    router.post('/:mailArchiveId', [MailArchiveDashboardController, 'update']).as('mailArchives.update')

  }).prefix('mail_archive')

  router.get('/mail_code/search', [MailCodesController, 'index']).as('mailCode.search')

}).use(middleware.auth({ guards: ['web'] }))