import User from "#models/user";
import router from '@adonisjs/core/services/router'

export function mapUsersDatasToDesktopTableMobileListEdgeView(users: User[] | User | null) {
  if (!users) return null;

  const userArray = Array.isArray(users) ? users : [users];

  return {
    columns: [
      { key: 'id', label: 'id', hidden: true },
      { key: 'fullName', label: 'Full Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'birthDatePlace', label: 'Birth Date/Place' },
      { key: 'home', label: 'Home' },
      { key: 'gender', label: 'Gender' },
      { key: 'deptOrg', label: 'Department/Organization' },
      { key: 'jobUserRole', label: 'Job Role' },
      { key: 'status', label: 'Status' },
      { key: 'profilePicture', label: 'Profile Picture' },
      { key: 'actions', label: 'Actions' },
    ],

    datas: userArray.map((user: User) => {
      return {
        id: { value: user.id, mark: 'SUBTITLE' },
        fullName: { value: user.full_name || '', mark: 'TITLE' },
        email: { value: user.email || '', mark: 'CONTENT' },
        phone: { value: user.personal_phone_number || '', mark: 'SUBCONTENT' },
        birthDatePlace: { value: [user.birth_date?.toISODate(), user.birth_place].filter(Boolean).join(', ') },
        home: { value: user.full_home_address || '' },
        gender: { value: user.gender?.name || '' },
        deptOrg: { value: [user.department?.name, user.organization?.name].filter(Boolean).join(' - ') },
        jobUserRole: {
          value: [user.job_role?.name, user.role?.name ? `(${user.role.name})` : null].filter(Boolean).join(' ')
        },
        status: user.user_status_tag?.map(tag => ({ value: tag.name, mark: 'STATUSBADGE' })) || [],
        profilePicture: { value: router.makeUrl('users.picture.show', { userId: user.id }), mark: 'PICTURE' },
        actions: [{ value: router.makeUrl('users.show', { userId: user.id }), mark: 'ACTIONVIEWDETAIL' }]
      };
    }),
  };

}
