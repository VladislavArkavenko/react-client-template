import routing from '../../../../utils/routing';

import SvgHome from '../../../../../../public/assets/svg/home.svg';
import SvgEyeEmpty from '../../../../../../public/assets/svg/eye-empty.svg';
import SvgMatch from '../../../../../../public/assets/svg/match.svg';
import SvgAnalyst from '../../../../../../public/assets/svg/analyst.svg';
import SvgStaff from '../../../../../../public/assets/svg/staff.svg';
import SvgClients from '../../../../../../public/assets/svg/clients.svg';
import SvgMegaphone from '../../../../../../public/assets/svg/megaphone.svg';
import SvgLightbulb from '../../../../../../public/assets/svg/lightbulb.svg';
import SvgCompany from '../../../../../../public/assets/svg/company.svg';
import SvgProfile from '../../../../../../public/assets/svg/user.svg';
import SvgMessages from '../../../../../../public/assets/svg/message.svg';
import SvgManager from '../../../../../../public/assets/svg/my-manager.svg';

import CONST from '../../../../utils/constants';

const { ADMIN, MANAGER, ANALYST, CUSTOMER } = CONST.ROLES;

const DASHBOARD = {
  title: 'Dashboard',
  Icon: SvgHome,
  to: routing().dashboard
};

const OPINIONS = {
  title: 'Opinions',
  Icon: SvgEyeEmpty,
  to: routing().opinions
};

const MATCHING = {
  title: 'Matching',
  Icon: SvgMatch,
  to: routing().notFound
};

const BENCHMARKS = {
  title: 'Benchmarks',
  Icon: SvgAnalyst,
  to: routing().notFound
};

const STAFF = {
  title: 'Staff',
  Icon: SvgStaff,
  to: routing().staff
};

const MY_CLIENTS = {
  title: 'My clients',
  Icon: SvgClients,
  to: routing().clients
};

const COMMUNITY = {
  title: 'Community',
  Icon: SvgMegaphone,
  to: routing().notFound
};

const SUBJECTS = {
  title: 'Subjects',
  Icon: SvgLightbulb,
  to: routing().notFound
};

const MY_COMPANY = {
  title: 'My company',
  Icon: SvgCompany,
  to: routing().company
};

const MY_PROFILE = {
  title: 'My profile',
  Icon: SvgProfile,
  to: routing().about,
  isActive(match, location) {
    return location.pathname.indexOf('profile') !== -1;
  }
};

const MESSAGES = {
  title: 'Messages',
  Icon: SvgMessages,
  to: routing().messages
};

const MY_MANAGER = {
  title: 'My manager',
  Icon: SvgManager,
  to: routing().manager
};

const NAV_LINKS = {
  [ADMIN]: [DASHBOARD, OPINIONS, MATCHING, BENCHMARKS, STAFF, MY_CLIENTS, COMMUNITY, SUBJECTS],
  [MANAGER]: [
    DASHBOARD,
    OPINIONS,
    MATCHING,
    MY_COMPANY,
    MY_PROFILE,
    MY_CLIENTS,
    MESSAGES,
    COMMUNITY
  ],
  [ANALYST]: [DASHBOARD, OPINIONS, MATCHING, BENCHMARKS, MY_CLIENTS, COMMUNITY],
  [CUSTOMER]: [
    DASHBOARD,
    OPINIONS,
    MATCHING,
    MY_COMPANY,
    MY_MANAGER,
    MY_PROFILE,
    MESSAGES,
    COMMUNITY
  ]
};

export const WORKING_NAV_LINKS = {
  [ADMIN]: [DASHBOARD, STAFF, MY_CLIENTS],
  [MANAGER]: [MY_PROFILE],
  [ANALYST]: [DASHBOARD],
  [CUSTOMER]: [OPINIONS, MY_PROFILE]
};

export default NAV_LINKS;
