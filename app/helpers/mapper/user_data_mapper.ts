import User from "#models/user";
import router from '@adonisjs/core/services/router'

export function mapUserWithUserData(users: User[] | User | null) {
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
      { key: 'avatar', label: 'Profile Picture' },
      { key: 'actions', label: 'Actions' },
    ],

    datas: userArray.map((user: User) => {
      return {
        id: { value: user.id },
        fullName: { value: user.latest_user_data?.full_name || '', mark: 'TITLE' },
        email: { value: user.latest_user_data?.email || '', mark: 'CONTENT' },
        phone: { value: user.latest_user_data?.personal_phone_number || '', mark: 'SUBCONTENT' },
        birthDatePlace: { value: [user.latest_user_data?.birth_date, user.latest_user_data?.birth_place].filter(Boolean).join(', ') },
        home: { value: user.latest_user_data?.full_home_address || '' },
        gender: { value: user.latest_user_data?.gender?.name || '' },
        deptOrg: { value: [user.latest_user_data?.department?.name, user.latest_user_data?.organization?.short_name].filter(Boolean).join(' - ') },
        jobUserRole: {
          value: [user.latest_user_data?.job_role?.name, user.latest_user_data?.role?.name ? `(${user.latest_user_data?.role.name})` : null].filter(Boolean).join(' ')
        },
        status: user.latest_user_data?.user_status_tag?.map(tag => ({ value: tag.name, mark: 'STATUSBADGE' })) || [],
        avatar: { value: router.makeUrl('api.account.profile.picture.show', { userId: user.id }), mark: 'PICTURE' },
        actions: [{ value: `#clickViewDetailId-${user.id}`, mark: 'ACTIONVIEWDETAIL' }]
      };
    }),
  };

  // if (!users) {
  //   return null
  // }

  // return {
  //   columns: [
  //     { key: 'id', label: 'id', hidden: true },
  //     { key: 'fullName', label: 'Full Name' },
  //     { key: 'email', label: 'Email' },
  //     { key: 'phone', label: 'Phone' },
  //     { key: 'birthDatePlace', label: 'Birth Date/Place' },
  //     { key: 'home', label: 'Home' },
  //     { key: 'gender', label: 'Gender' },
  //     { key: 'deptOrg', label: 'Department/Organization' },
  //     { key: 'jobUserRole', label: 'Job Role' },
  //     { key: 'status', label: 'Status' },
  //     { key: 'avatar', label: 'Profile Picture' },
  //     { key: 'actions', label: 'Actions' },
  //   ],

  //   datas: users.map((user: User) => ({
  //     id: { value: user.id },

  //     fullName: {
  //       value: user.latest_user_data?.full_name || '',
  //       mark: 'TITLE'
  //     },

  //     email: {
  //       value: user.latest_user_data?.email || '',
  //       mark: 'CONTENT'
  //     },

  //     phone: {
  //       value: user.latest_user_data?.personal_phone_number || '',
  //       mark: 'SUBCONTENT'
  //     },

  //     birthDatePlace: {
  //       value: (user.latest_user_data?.birth_date || user.latest_user_data?.birth_place) ? `${user.latest_user_data?.birth_date}, ${user.latest_user_data?.birth_place}` : user.latest_user_data?.birth_date ? user.latest_user_data?.birth_date : user.latest_user_data?.birth_place ? user.latest_user_data?.birth_place : ''
  //     },

  //     home: {
  //       value: user.latest_user_data?.full_home_address || '',
  //     },

  //     gender: {
  //       value: user.latest_user_data?.gender.name || '',
  //     },

  //     deptOrg: {
  //       value: (user.latest_user_data?.department?.name || user.latest_user_data?.organization?.short_name) ? `${user.latest_user_data?.department?.name || ''} - ${user.latest_user_data?.organization?.short_name || ''}` : user.latest_user_data?.department?.name ? user.latest_user_data?.department?.name : user.latest_user_data?.organization?.short_name ? user.latest_user_data?.organization?.short_name : ''
  //     },

  //     jobUserRole: {
  //       value: (user.latest_user_data?.job_role?.name || user.latest_user_data?.role?.name) ? `${user.latest_user_data?.job_role?.name ?? ''} (${user.latest_user_data?.role?.name ?? ''})` : user.latest_user_data?.job_role?.name ? user.latest_user_data?.job_role?.name : user.latest_user_data?.role?.name ? user.latest_user_data?.role?.name : ''
  //     },

  //     status: user.latest_user_data?.user_status_tag?.map((tag) => ({ 
  //       value: tag.name, 
  //       mark: 'STATUSBADGE'
  //     })) || '',

  //     avatar: {
  //       value: router.makeUrl('api.account.profile.picture.show', { userId: user.id }),
  //       mark: 'PICTURE',
  //     },

  //     actions: [
  //       { value: `#clickViewDetailId-${user.id}`, mark: 'ACTIONVIEWDETAIL' }
  //     ]
  //   })),
  // }

  
  // return users.map((user: User) => ({
  //   columns: [
  //     { key: 'id', label: 'id', hidden: true },
  //     { key: 'fullName', label: 'Full Name' },
  //     { key: 'email', label: 'Email' },
  //     { key: 'phone', label: 'Phone' },
  //     { key: 'birthDatePlace', label: 'Birth Date/Place'},
  //     { key: 'home', label: 'Home' },
  //     { key: 'gender', label: 'Gender' },
  //     { key: 'deptOrg', label: 'Department/Organization' },
  //     { key: 'jobUserRole', label: 'Job Role' },
  //     { key: 'status', label: 'Status' },
  //     { key: 'avatar', label: 'Profile Picture' },
  //   ],
  //   datas: {
  //     id: { value: user.id },
  //     fullName: { value: user.latest_user_data?.full_name, mark: 'TITLE' },
  //     email: { value: user.latest_user_data?.email, mark: 'SUBSUBTITLE' },
  //     phone: { value: user.latest_user_data?.personal_phone_number, mark: 'SUBTITLE' },
  //     birthDatePlace: { value: `${user.latest_user_data?.birth_date} ${user.latest_user_data?.birth_place}` },
  //     home: { value: user.latest_user_data?.full_home_address },
  //     gender: { value: user.latest_user_data?.gender },
  //     deptOrg: { value: `${user.latest_user_data?.department?.name} - ${user.latest_user_data?.organization?.name}` },
  //     jobUserRole: { value: `${user.latest_user_data?.job_role?.name} (${user.latest_user_data?.role?.name})` },
  //     status: [ user.latest_user_data?.user_status_tag?.map((tag) => ({ value: tag.name, mark: 'STATUSBADGE' })) ],
  //     avatar: { value: router.makeUrl('api.account.profile.picture.show', { userId: user.id }), mark: 'PICTURE' },
  //   }
  // }));
}
