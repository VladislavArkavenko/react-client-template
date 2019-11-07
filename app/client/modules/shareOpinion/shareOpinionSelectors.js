const getSubjectsData = (state) => state.shareOpinion.subjects.data;

const getSelectedTopics = (state) => state.shareOpinion.selectedTopics;
const getSelectedTopicsId = (state) => getSelectedTopics(state).map((topic) => topic.id);

// const getExpiredOpinions = (state) => state.shareOpinion.expiredOpinions;
// const getExpiredOpinionsBySubject = (state, subjectId) => getExpiredOpinions(state)[subjectId];

const getNewTopic = (state) => state.shareOpinion.newTopic;
const getNewTopicInput = (state) => getNewTopic(state).input;
const getNewTopicErrors = (state) => getNewTopic(state).errors;
const getNewTopicSelected = (state) => getNewTopic(state).selected;
const getNewTopicStatus = (state) => getNewTopic(state).status;
const getNewTopicHints = (state) => getNewTopic(state).hints;
const getNewTopicShowModal = (state) => getNewTopic(state).showModal;

const getUnratedTopic = (state) => getSelectedTopics(state).find((topic) => topic.isRated !== true);

const getGlobalExpired = (state, { profileType, profileId, subjectId } = {}) => {
  const obj = state.shareOpinion.globalExpired;

  if (!profileType) {
    return obj;
  }

  if (!profileId) {
    return obj[profileType] || {};
  }

  if (!subjectId) {
    try {
      return obj[profileType][profileId] || {};
    } catch (err) {
      return {};
    }
  }

  try {
    return obj[profileType][profileId][subjectId] || [];
  } catch (err) {
    return [];
  }
};

const getGlobalOpinions = (state, { profileType, profileId } = {}) => {
  const obj = state.shareOpinion.globalOpinions;

  if (!profileType) {
    return obj;
  }

  if (!profileId) {
    return obj[profileType] || {};
  }

  return obj[profileType][profileId] || 0;
};

export default {
  saveTopicStatus: (state) => state.shareOpinion.saveTopicStatus,
  topicOpinions: (state) => state.shareOpinion.topicOpinions,
  selectedTopics: getSelectedTopics,
  selectedTopicsId: getSelectedTopicsId,
  selectedProfile: (state) => state.shareOpinion.selectedProfile,
  selectedOptions: (state) => state.shareOpinion.selectedOptions,
  // expiredOpinions: getExpiredOpinions,
  // expiredOpinionsById: getExpiredOpinionsBySubject,

  actualSubjectsId: (state) => state.shareOpinion.actualSubjects,

  subjectsStatus: (state) => state.shareOpinion.subjects.status,
  subjectsData: getSubjectsData,

  newTopic: getNewTopic,
  newTopicInput: getNewTopicInput,
  newTopicErrors: getNewTopicErrors,
  newTopicSelected: getNewTopicSelected,
  newTopicStatus: getNewTopicStatus,
  newTopicShowModal: getNewTopicShowModal,
  newTopicHints: getNewTopicHints,

  nextUnratedTopic: getUnratedTopic,

  averageRate: (state) => state.shareOpinion.averageRate,

  finishStatus: (state) => state.shareOpinion.selectedOptions.status,

  getGlobalExpired,
  getGlobalOpinions
};
