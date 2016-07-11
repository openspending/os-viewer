'use strict';

module.exports = {
  id: 'Package1',
  meta: {
    name: 'ekondo-titi-trial',
    title: 'Ekondo Titi trial 04/29',
    description: undefined,
    owner: '8c248ff162c3c3b957f487138850eaf2',
    author: 'Victoria Vlad <victoriavladd@not.shown>',
    countryCode: 'CM',
    factTable: 'fdp__8c248ff162c3c3b957f487138850__ekondo_titi_trial',
    url: 'http://s3.amazonaws.com/datastore.openspending.org/' +
      '8c248ff162c3c3b957f487138850eaf2/ekondo-titi-trial/datapackage.json',
    resources: [
      {
        name: 'for-trial-viz-cameroon_afro',
        url: 'http://s3.amazonaws.com/datastore.openspending.org/' +
          '8c248ff162c3c3b957f487138850eaf2/ekondo-titi-trial/' +
          'for-trial-viz-cameroon_afro.csv'
      }
    ]
  },
  measures: [
    {
      id: 'Depenses_realisees',
      key: 'Depenses_realisees.sum',
      label: 'Dépenses réalisées',
      currency: 'XAF'
    }
  ],
  dimensions: [
    {
      id: 'date_2',
      key: 'date_2.Annee',
      label: 'Année',
      valueRef: 'date_2.Annee',
      hierarchy: 'date',
      dimensionType: 'datetime',
      values: [
        {
          key: 2015,
          label: 2015
        }
      ]
    },
    {
      id: 'economic_classification_3',
      key: 'economic_classification_3.Article',
      label: 'Article',
      valueRef: 'economic_classification_3.Article',
      hierarchy: 'economic_classification',
      dimensionType: 'classification',
      values: [
        {
          key: '610',
          label: '610'
        },
        {
          key: '611',
          label: '611'
        },
        {
          key: '612',
          label: '612'
        },
        {
          key: '620',
          label: '620'
        },
        {
          key: '630',
          label: '630'
        },
        {
          key: '640',
          label: '640'
        },
        {
          key: '650',
          label: '650'
        },
        {
          key: '660',
          label: '660'
        },
        {
          key: '670',
          label: '670'
        },
        {
          key: '680',
          label: '680'
        }
      ]
    },
    {
      id: 'economic_classification_2',
      key: 'economic_classification_2.Chapitre',
      label: 'Chapitre',
      valueRef: 'economic_classification_2.Chapitre',
      hierarchy: 'economic_classification',
      dimensionType: 'classification',
      values: [
        {
          key: '61',
          label: '61'
        },
        {
          key: '62',
          label: '62'
        },
        {
          key: '63',
          label: '63'
        },
        {
          key: '64',
          label: '64'
        },
        {
          key: '65',
          label: '65'
        },
        {
          key: '66',
          label: '66'
        },
        {
          key: '67',
          label: '67'
        },
        {
          key: '68',
          label: '68'
        }
      ]
    },
    {
      id: 'economic_classification_Compte',
      key: 'economic_classification_Compte.Compte',
      label: 'Compte',
      valueRef: 'economic_classification_Compte.Compte',
      hierarchy: 'economic_classification',
      dimensionType: 'classification',
      values: [
        {
          key: '610100',
          label: '610100'
        },
        {
          key: '610101',
          label: '610101'
        },
        {
          key: '610102',
          label: '610102'
        },
        {
          key: '610103',
          label: '610103'
        },
        {
          key: '610104',
          label: '610104'
        }
      ]
    },
    {
      id: 'activity_2',
      key: 'activity_2.Nature',
      label: 'Nature',
      valueRef: 'activity_2.Nature',
      hierarchy: 'activity',
      dimensionType: 'activity',
      values: [
        {
          key: '6',
          label: '6'
        }
      ]
    }
  ],
  hierarchies: [
    {
      id: 'activity',
      key: 'activity',
      label: 'Activity',
      dimensions: [
        {
          id: 'activity_2',
          key: 'activity_2.Nature',
          label: 'Nature',
          valueRef: 'activity_2.Nature',
          hierarchy: 'activity',
          dimensionType: 'activity',
          values: [
            {
              key: '6',
              label: '6'
            }
          ]
        }
      ]
    },
    {
      id: 'date',
      key: 'date',
      label: 'Date',
      dimensions: [
        {
          id: 'date_2',
          key: 'date_2.Annee',
          label: 'Année',
          valueRef: 'date_2.Annee',
          hierarchy: 'date',
          dimensionType: 'datetime',
          values: [
            {
              key: 2015,
              label: 2015
            }
          ]
        }
      ]
    },
    {
      id: 'economic_classification',
      key: 'economic_classification',
      label: 'Economic Classification',
      dimensions: [
        {
          id: 'economic_classification_2',
          key: 'economic_classification_2.Chapitre',
          label: 'Chapitre',
          valueRef: 'economic_classification_2.Chapitre',
          hierarchy: 'economic_classification',
          dimensionType: 'classification',
          values: [
            {
              key: '61',
              label: '61'
            },
            {
              key: '62',
              label: '62'
            },
            {
              key: '63',
              label: '63'
            },
            {
              key: '64',
              label: '64'
            },
            {
              key: '65',
              label: '65'
            },
            {
              key: '66',
              label: '66'
            },
            {
              key: '67',
              label: '67'
            },
            {
              key: '68',
              label: '68'
            }
          ]
        },
        {
          id: 'economic_classification_3',
          key: 'economic_classification_3.Article',
          label: 'Article',
          valueRef: 'economic_classification_3.Article',
          hierarchy: 'economic_classification',
          dimensionType: 'classification',
          values: [
            {
              key: '610',
              label: '610'
            },
            {
              key: '611',
              label: '611'
            },
            {
              key: '612',
              label: '612'
            },
            {
              key: '620',
              label: '620'
            },
            {
              key: '630',
              label: '630'
            },
            {
              key: '640',
              label: '640'
            },
            {
              key: '650',
              label: '650'
            },
            {
              key: '660',
              label: '660'
            },
            {
              key: '670',
              label: '670'
            },
            {
              key: '680',
              label: '680'
            }
          ]
        },
        {
          id: 'economic_classification_Compte',
          key: 'economic_classification_Compte.Compte',
          label: 'Compte',
          valueRef: 'economic_classification_Compte.Compte',
          hierarchy: 'economic_classification',
          dimensionType: 'classification',
          values: [
            {
              key: '610100',
              label: '610100'
            },
            {
              key: '610101',
              label: '610101'
            },
            {
              key: '610102',
              label: '610102'
            },
            {
              key: '610103',
              label: '610103'
            },
            {
              key: '610104',
              label: '610104'
            }
          ]
        }
      ]
    }
  ],
  columnHierarchies: [
    {
      id: 'activity',
      key: 'activity',
      label: 'Activity',
      dimensions: [
        {
          id: 'activity_2',
          key: 'activity_2.Nature',
          label: 'Nature',
          valueRef: 'activity_2.Nature',
          hierarchy: 'activity',
          dimensionType: 'activity',
          values: [
            {
              key: '6',
              label: '6'
            }
          ]
        }
      ]
    },
    {
      id: 'date',
      key: 'date',
      label: 'Date',
      dimensions: [
        {
          id: 'date_2',
          key: 'date_2.Annee',
          label: 'Année',
          valueRef: 'date_2.Annee',
          hierarchy: 'date',
          dimensionType: 'datetime',
          values: [
            {
              key: 2015,
              label: 2015
            }
          ]
        }
      ]
    },
    {
      id: 'economic_classification',
      key: 'economic_classification',
      label: 'Economic Classification',
      dimensions: [
        {
          id: 'economic_classification_2',
          key: 'economic_classification_2.Chapitre',
          label: 'Chapitre',
          valueRef: 'economic_classification_2.Chapitre',
          hierarchy: 'economic_classification',
          dimensionType: 'classification',
          values: [
            {
              key: '61',
              label: '61'
            },
            {
              key: '62',
              label: '62'
            },
            {
              key: '63',
              label: '63'
            },
            {
              key: '64',
              label: '64'
            },
            {
              key: '65',
              label: '65'
            },
            {
              key: '66',
              label: '66'
            },
            {
              key: '67',
              label: '67'
            },
            {
              key: '68',
              label: '68'
            }
          ]
        },
        {
          id: 'economic_classification_3',
          key: 'economic_classification_3.Article',
          label: 'Article',
          valueRef: 'economic_classification_3.Article',
          hierarchy: 'economic_classification',
          dimensionType: 'classification',
          values: [
            {
              key: '610',
              label: '610'
            },
            {
              key: '611',
              label: '611'
            },
            {
              key: '612',
              label: '612'
            },
            {
              key: '620',
              label: '620'
            },
            {
              key: '630',
              label: '630'
            },
            {
              key: '640',
              label: '640'
            },
            {
              key: '650',
              label: '650'
            },
            {
              key: '660',
              label: '660'
            },
            {
              key: '670',
              label: '670'
            },
            {
              key: '680',
              label: '680'
            }
          ]
        },
        {
          id: 'economic_classification_Compte',
          key: 'economic_classification_Compte.Compte',
          label: 'Compte',
          valueRef: 'economic_classification_Compte.Compte',
          hierarchy: 'economic_classification',
          dimensionType: 'classification',
          values: [
            {
              key: '610100',
              label: '610100'
            },
            {
              key: '610101',
              label: '610101'
            },
            {
              key: '610102',
              label: '610102'
            },
            {
              key: '610103',
              label: '610103'
            },
            {
              key: '610104',
              label: '610104'
            }
          ]
        }
      ]
    }
  ],
  locationHierarchies: [

  ],
  dateTimeHierarchies: [
    {
      id: 'date',
      key: 'date',
      label: 'Date',
      dimensions: [
        {
          id: 'date_2',
          key: 'date_2.Annee',
          label: 'Année',
          valueRef: 'date_2.Annee',
          hierarchy: 'date',
          dimensionType: 'datetime',
          values: [
            {
              key: 2015,
              label: 2015
            }
          ]
        }
      ]
    }
  ]
};
