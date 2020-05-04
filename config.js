const config = {
  'model3d': {
    'sides': {
      'steps': 30,
      'thickness': 0.03,
      'extraLength': 0.1,
      'minHeight': 0.015
    },
    'slats': {
      'defaultLength': 0.015,
      'thickness': 0.015,
      'space': 0.01
    },
    'struts': {
      'side': 0.08,
      'smallSide': 0.04,
      'maximumDistance': 0.3
    },
    'surface': {
      'thickness': 0.015
    }
  },
  'units': null,

  'UNIT_METERS': 'm',
  'UNIT_FEET': 'ft',
  'UNIT_DEGREES': '°'
};

export default config;