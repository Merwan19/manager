export const DIRECTORY_INFO_STATUS = {
  todo: 'todo',
  doing: 'doing',
  error: 'error',
  problem: 'problem',
  done: 'done',
};

export const WAY_NUMBER_EXTRA = [
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'S',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

export const DIRECTORY_WAY_NUMBER_EXTRA_ENUM = {
  BE: ['&nbsp;', 'A', 'B', 'C', ...WAY_NUMBER_EXTRA],
  OTHER: [
    '&nbsp;',
    'bis',
    'ter',
    'quater',
    'quinquies',
    'sexto',
    'septimo',
    'octimo',
    'nono',
    'A',
    ...WAY_NUMBER_EXTRA,
  ],
};

export const LEGAL_FORM_ENUM = {
  FR: ['individual', 'professional', 'corporation'],
  BE: ['individual', 'corporation'],
};

const CORPORATION_FR = {
  legalForm: true,
  name: false,
  legalConcept: true,
  occupation: false,
  siret: true,
  tva: false,
  ape: true,
  socialNominationExtra: true,
  email: true,
  cedex: true,
  universalDirectoryAvailable: true,
  pjdenomination: true,
  directoryServiceCode: true,
  displayMarketingDirectory: true,
  contactDisplayFirstName: false,
  displayOnlyCity: false,
  contactServiceDescription: true,
};

export const AVAILABLE_FIELDS = {
  FR: {
    individual: {
      legalForm: true,
      name: true,
      legalConcept: false,
      email: true,
      cedex: true,
      universalDirectoryAvailable: true,
      pjdenomination: false,
      directoryServiceCode: false,
      displayMarketingDirectory: true,
      contactDisplayFirstName: true,
      displayOnlyCity: true,
      contactServiceDescription: true,
    },
    professional: {
      legalForm: true,
      name: false,
      legalConcept: true,
      occupation: true,
      siret: true,
      tva: false,
      ape: true,
      socialNominationExtra: true,
      email: true,
      cedex: true,
      universalDirectoryAvailable: true,
      pjdenomination: true,
      directoryServiceCode: true,
      displayMarketingDirectory: true,
      contactDisplayFirstName: false,
      displayOnlyCity: false,
      contactServiceDescription: true,
    },
    corporation: {
      ...CORPORATION_FR,
    },
    association: {
      ...CORPORATION_FR,
    },
    other: {
      ...CORPORATION_FR,
    },
  },
  BE: {
    individual: {
      legalForm: true,
      name: true,
      legalConcept: false,
      email: false,
      cedex: false,
      universalDirectoryAvailable: true,
      pjdenomination: false,
      directoryServiceCode: false,
      displayMarketingDirectory: false,
      contactDisplayFirstName: false,
      displayOnlyCity: false,
      contactServiceDescription: false,
    },
    corporation: {
      legalForm: true,
      name: false,
      legalConcept: true,
      occupation: false,
      siret: false,
      tva: true,
      ape: false,
      socialNominationExtra: false,
      email: false,
      cedex: false,
      universalDirectoryAvailable: true,
      pjdenomination: false,
      directoryServiceCode: false,
      displayMarketingDirectory: false,
      contactDisplayFirstName: false,
      displayOnlyCity: false,
      contactServiceDescription: false,
    },
  },
  OTHER: {
    legalForm: false,
    name: true,
    legalConcept: false,
    email: true,
    cedex: true,
    universalDirectoryAvailable: false,
  },
};

export const REGEX = {
  siret: /^\d{14}$/,
  tva: /^(?:be)?\d{10}$/i,
  ape: /^\d{4}\w$/,
  wayName: /[\w|\W|\s]+/,
  addressExtra: /^[A-Za-z0-9 ]*$/,
  ukNumber: /^0044\d+/g,
  inwardCode: /^\d[a-zA-Z]{2}$/,
  outwardCode: /^[a-zA-Z]\w{1,3}$/,
};

export const MARSEILLE_POST_CODE = [
  '13000',
  '13001',
  '13002',
  '13003',
  '13004',
  '13005',
  '13006',
  '13007',
  '13008',
  '13009',
  '13010',
  '13011',
  '13012',
  '13013',
  '13014',
  '13015',
  '13016',
];

export default {
  DIRECTORY_INFO_STATUS,
  DIRECTORY_WAY_NUMBER_EXTRA_ENUM,
  LEGAL_FORM_ENUM,
  AVAILABLE_FIELDS,
  REGEX,
  MARSEILLE_POST_CODE,
};
