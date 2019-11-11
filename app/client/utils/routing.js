import { RATE_PROFILE_TYPE, ROUTING_PARAMS } from './constants';

// function generateProfileLink({ id, type }) {
//   switch (type) {
//     case RATE_PROFILE_TYPE.MANAGER:
//       return `${ROUTING_PARAMS.MANAGER}_${id}`;
//     case RATE_PROFILE_TYPE.COMPANY:
//       return `${ROUTING_PARAMS.COMPANY}_${id}`;
//     default:
//       return '';
//   }
// }
function generateCompareLink({ type, ids } = {}) {
  const paramObj = new URLSearchParams();

  if (Array.isArray(ids) && ids.length === 2) {
    paramObj.append(ROUTING_PARAMS.MAIN_ID, ids[0]);
    paramObj.append(ROUTING_PARAMS.COMPARE_ID, ids[1]);
  }

  const paramsStr = paramObj.toString();
  const params = paramsStr.length ? `?${paramsStr}` : '';

  switch (type) {
    case ROUTING_PARAMS.MANAGER:
      return `${ROUTING_PARAMS.MANAGER}${params}`;

    case ROUTING_PARAMS.COMPANY:
      return `${ROUTING_PARAMS.COMPANY}${params}`;
    default:
      return ':type';
  }
}

function generateOpinionLink({ id, type, criteriaId, subjectId, topicId, onlyExpired } = {}) {
  const paramObj = new URLSearchParams();

  if (criteriaId) {
    paramObj.append(ROUTING_PARAMS.CRITERIA_ID, criteriaId);
  }

  if (subjectId) {
    paramObj.append(ROUTING_PARAMS.SUBJECT_ID, subjectId);
  }

  if (topicId) {
    paramObj.append(ROUTING_PARAMS.TOPIC_ID, topicId);
  }

  if (onlyExpired) {
    paramObj.append(ROUTING_PARAMS.SELECT_EXPIRED, 1);
  }

  const paramsStr = paramObj.toString();
  const params = paramsStr.length ? `?${paramsStr}` : '';

  switch (type) {
    case ROUTING_PARAMS.MANAGER:
    case RATE_PROFILE_TYPE.MANAGER:
      return `${ROUTING_PARAMS.MANAGER}_${id}${params}`;

    case ROUTING_PARAMS.COMPANY:
    case RATE_PROFILE_TYPE.COMPANY:
      return `${ROUTING_PARAMS.COMPANY}_${id}${params}`;
    default:
      return ':type\\_:id';
  }
}

export default (params) => ({
  root: '/',

  notFound: '/not-found',

  login: '/login',
  registration: '/registration',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset_password/',

  chooseRole: '/choose-role',

  account: '/account',

  profile: '/account/profile/:tab',
  about: '/account/profile/about',
  overview: '/account/profile/overview',

  managerProfile: `/manager/profile/${params || ':id'}/:tab`,
  managerProfileAbout: `/manager/profile/${params || ':id'}/about`,
  managerProfileOverview: `/manager/profile/${params || ':id'}/overview`,

  companyProfile: `/company/profile/${params || ':id'}/:tab`,
  companyProfileAbout: `/company/profile/${params || ':id'}/about`,
  companyProfileOverview: `/company/profile/${params || ':id'}/overview`,
  companyProfileProducts: `/company/profile/${params || ':id'}/products`,

  dashboard: '/account/dashboard',

  benchmarks: '/account/benchmarks',
  benchmarksWithTab: `/account/benchmarks/${params || ':tab'}`,
  benchmarksInternal: '/account/benchmarks/internal',
  benchmarksExternal: '/account/benchmarks/external',

  shareOpinion: '/account/share-opinion',
  shareOpinionWithProfile: `/account/share-opinion/${generateOpinionLink(params)}`,
  shareOpinionChart: '/account/share-opinion/rate',
  shareOpinionMessage: '/account/share-opinion/message',

  opinionDetails: `/opinions/${generateOpinionLink(params)}`,
  myOpinionDetails: `/opinions/dashboard`,

  staff: '/manage/staff',
  clients: '/manage/clients',
  kpiSettings: '/manage/kpi',

  messages: '/account/messages',
  opinions: '/account/opinions',
  myManagers: '/account/managers',
  myCompanies: '/account/companies',

  compare: `/compare/${generateCompareLink(params)}`

  // route with params example:
  // changePassword: `/auth/reset/${params ? params : ':token'}`,
});
