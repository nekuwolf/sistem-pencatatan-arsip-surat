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
import BadRequsetController from '#controllers/bad_request_controller'
import UserProfileController from '#controllers/user_profile_controller'
import UserDataController from '#controllers/user_data_controller'
import SandboxesController from '#controllers/sandboxes_controller'
import GenderController from '#controllers/gender_controller'
import RegisterInviteLinkController from '#controllers/register_invite_link_controller'
import LogoutController from '#controllers/logout_controller'
import { middleware } from '#start/kernel'
import PersonTitleNameController from '#controllers/person_title_name_controller'

router.on('/').render('pages/home')
router.get('/dashboard', [DashboardController, 'index']).as('dashboard.index')

// TODO: implement later 
// router.get('/error/bad_request', [BadRequsetController, 'index']).as('dashboard.index')

// GET /account/login?email=...
// show login form
// if email is provided autofill email field
router.get('/login', [LoginController, 'create']).as('auth.login.create')

// POST /account/login
// login form submit
// body : MUST email, MUST password
router.post('/login', [LoginController, 'store']).as('auth.login.store')

// GET /account/register?register_code=...
// show register form
// MUST register_code is newly created user id
// MUST referrer is user who created the register_code
// no/invalid 'MUST' redirect to 404 not found
router.get('/register', [RegisterController, 'create']).as('auth.register.create')

// POST /account/register
// register form submit
// body : MUST register_code=[user_id], MUST referrer=[user_id]
// MUST email=[email], MUST password=[password]
router.post('/register', [RegisterController, 'store']).as('auth.register.store') 

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

router.get('/profile', [UserProfileController, 'create']).as('account.profile').use(middleware.auth({ guards: ['web'] }))
router.get('/api/v1/profile/:userId/picture', [UserProfileController, 'show']).as('api.account.profile.picture.show')
router.post('/api/v1/profile/:userId/picture', [UserProfileController, 'store']).as('api.account.profile.picture.store')

router.get('/user', [UserDataController, 'index']).as('user.index').use(middleware.auth({ guards: ['web'] }))

router.get('/mail', [SandboxesController, 'index']).as('mail.index')
router.get('/archive', [SandboxesController, 'index']).as('archive.index')
router.get('/register_invite_link', [RegisterInviteLinkController, 'index']).as('registerInviteLink.index')

router.get('/api/v1/gender/search', [GenderController, 'searchApi']).as('api.gender.search')

router.get('/gs', [SandboxesController, 'index']).as('gs')


router.get('/logout', [LogoutController, 'store']).as('auth.logout.store').use(middleware.auth({ guards: ['web'] }))

router.get('/api/v1/person_title_name/search', [PersonTitleNameController, 'searchApi']).as('api.personTitleName.search')
