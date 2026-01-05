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
      // { key: 'actions', label: 'Actions' },
    ],

    datas: userArray.map((user: User) => {
      return {
        id: { value: user.id, mark: 'SUBTITLE' },
        fullName: { value: user.fullName || '', mark: 'TITLE' },
        email: { value: user.email || '', mark: 'CONTENT' },
        phone: { value: user.personalPhoneNumber || '', mark: 'SUBCONTENT' },
        birthDatePlace: { value: [user.birthDate?.toISODate(), user.birthPlace].filter(Boolean).join(', ') },
        home: { value: user.fullHomeAddress || '' },
        gender: { value: user.gender?.name || '' },
        deptOrg: { value: [user.department?.name, user.organization?.name].filter(Boolean).join(' - ') },
        jobUserRole: {
          value: [user.jobRole?.name, user.role?.name ? `(${user.role.name})` : null].filter(Boolean).join(' ')
        },
        status: user.userStatusTag?.map(tag => ({ value: tag.name, mark: 'STATUSBADGE' })) || [],
        profilePicture: { value: router.makeUrl('users.picture.show', { userId: user.id }), mark: 'PICTURE' },
        // actions: [{ value: router.makeUrl('users.show', { userId: user.id }), mark: 'ACTIONVIEWDETAIL' }]
      };
    }),
  };

}
