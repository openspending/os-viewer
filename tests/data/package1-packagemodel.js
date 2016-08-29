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
      valueRef: 'economic_classification_3.Intitule_article',
      hierarchy: 'economic_classification',
      dimensionType: 'classification',
      values: [
        {
          key: '610',
          label: 'Biens et Services Consommés'
        },
        {
          key: '611',
          label: 'Transports consommés'
        },
        {
          key: '612',
          label: 'Autres services consommés'
        },
        {
          key: '620',
          label: 'Frais de personnel'
        },
        {
          key: '630',
          label: 'Impôts et taxes'
        },
        {
          key: '640',
          label: 'Frais financiers'
        },
        {
          key: '650',
          label: 'Subventions versées'
        },
        {
          key: '660',
          label: 'Transferts versés'
        },
        {
          key: '670',
          label: 'Autres charges et pertes diverses'
        },
        {
          key: '680',
          label: 'Dotation aux amortissements'
        }
      ]
    },
    {
      id: 'economic_classification_2',
      key: 'economic_classification_2.Chapitre',
      label: 'Chapitre',
      valueRef: 'economic_classification_2.Intitule_chapitre',
      hierarchy: 'economic_classification',
      dimensionType: 'classification',
      values: [
        {
          key: '61',
          label: 'BIENS ET SERVICES CONSOMMES'
        },
        {
          key: '62',
          label: 'FRAIS DE PERSONNEL'
        },
        {
          key: '63',
          label: 'IMPOTS ET TAXES'
        },
        {
          key: '64',
          label: 'FRAIS FINANCIERS'
        },
        {
          key: '65',
          label: 'SUBVENTIONS VERSEES'
        },
        {
          key: '66',
          label: 'TRANSFERTS VERSES'
        },
        {
          key: '67',
          label: 'AUTRES CHARGES ET PERTES DIVERSES'
        },
        {
          key: '68',
          label: 'DOTATION AUX AMORTISSEMENTS'
        }
      ]
    },
    {
      id: 'economic_classification_Compte',
      key: 'economic_classification_Compte.Compte',
      label: 'Compte',
      valueRef: 'economic_classification_Compte.Intitule_compte',
      hierarchy: 'economic_classification',
      dimensionType: 'classification',
      values: [
        {
          key: '610100',
          label: 'Fournitures de bureau'
        },
        {
          key: '610101',
          label: 'Abonnement à divers publications'
        },
        {
          key: '610102',
          label: 'Frais d\'impression des tickets, timbres et vignettes'
        },
        {
          key: '610103',
          label: 'Frais d\'impression des registres et documents comptables'
        },
        {
          key: '610104',
          label: 'Dépenses de l\'état civil ' +
            '(registres, livrets, imprimés, etc.)'
        }
      ]
    },
    {
      id: 'activity_2',
      key: 'activity_2.Nature',
      label: 'Nature',
      valueRef: 'activity_2.Intitule_nature',
      hierarchy: 'activity',
      dimensionType: 'activity',
      values: [
        {
          key: '6',
          label: 'COMPTES DE CHARGES'
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
          valueRef: 'activity_2.Intitule_nature',
          hierarchy: 'activity',
          dimensionType: 'activity',
          values: [
            {
              key: '6',
              label: 'COMPTES DE CHARGES'
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
          valueRef: 'economic_classification_2.Intitule_chapitre',
          hierarchy: 'economic_classification',
          dimensionType: 'classification',
          values: [
            {
              key: '61',
              label: 'BIENS ET SERVICES CONSOMMES'
            },
            {
              key: '62',
              label: 'FRAIS DE PERSONNEL'
            },
            {
              key: '63',
              label: 'IMPOTS ET TAXES'
            },
            {
              key: '64',
              label: 'FRAIS FINANCIERS'
            },
            {
              key: '65',
              label: 'SUBVENTIONS VERSEES'
            },
            {
              key: '66',
              label: 'TRANSFERTS VERSES'
            },
            {
              key: '67',
              label: 'AUTRES CHARGES ET PERTES DIVERSES'
            },
            {
              key: '68',
              label: 'DOTATION AUX AMORTISSEMENTS'
            }
          ]
        },
        {
          id: 'economic_classification_3',
          key: 'economic_classification_3.Article',
          label: 'Article',
          valueRef: 'economic_classification_3.Intitule_article',
          hierarchy: 'economic_classification',
          dimensionType: 'classification',
          values: [
            {
              key: '610',
              label: 'Biens et Services Consommés'
            },
            {
              key: '611',
              label: 'Transports consommés'
            },
            {
              key: '612',
              label: 'Autres services consommés'
            },
            {
              key: '620',
              label: 'Frais de personnel'
            },
            {
              key: '630',
              label: 'Impôts et taxes'
            },
            {
              key: '640',
              label: 'Frais financiers'
            },
            {
              key: '650',
              label: 'Subventions versées'
            },
            {
              key: '660',
              label: 'Transferts versés'
            },
            {
              key: '670',
              label: 'Autres charges et pertes diverses'
            },
            {
              key: '680',
              label: 'Dotation aux amortissements'
            }
          ]
        },
        {
          id: 'economic_classification_Compte',
          key: 'economic_classification_Compte.Compte',
          label: 'Compte',
          valueRef: 'economic_classification_Compte.Intitule_compte',
          hierarchy: 'economic_classification',
          dimensionType: 'classification',
          values: [
            {
              key: '610100',
              label: 'Fournitures de bureau'
            },
            {
              key: '610101',
              label: 'Abonnement à divers publications'
            },
            {
              key: '610102',
              label: 'Frais d\'impression des tickets, timbres et vignettes'
            },
            {
              key: '610103',
              label: 'Frais d\'impression des registres et documents comptables'
            },
            {
              key: '610104',
              label: 'Dépenses de l\'état civil (registres, livrets, ' +
                'imprimés, etc.)'
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
          valueRef: 'activity_2.Intitule_nature',
          hierarchy: 'activity',
          dimensionType: 'activity',
          values: [
            {
              key: '6',
              label: 'COMPTES DE CHARGES'
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
          valueRef: 'economic_classification_2.Intitule_chapitre',
          hierarchy: 'economic_classification',
          dimensionType: 'classification',
          values: [
            {
              key: '61',
              label: 'BIENS ET SERVICES CONSOMMES'
            },
            {
              key: '62',
              label: 'FRAIS DE PERSONNEL'
            },
            {
              key: '63',
              label: 'IMPOTS ET TAXES'
            },
            {
              key: '64',
              label: 'FRAIS FINANCIERS'
            },
            {
              key: '65',
              label: 'SUBVENTIONS VERSEES'
            },
            {
              key: '66',
              label: 'TRANSFERTS VERSES'
            },
            {
              key: '67',
              label: 'AUTRES CHARGES ET PERTES DIVERSES'
            },
            {
              key: '68',
              label: 'DOTATION AUX AMORTISSEMENTS'
            }
          ]
        },
        {
          id: 'economic_classification_3',
          key: 'economic_classification_3.Article',
          label: 'Article',
          valueRef: 'economic_classification_3.Intitule_article',
          hierarchy: 'economic_classification',
          dimensionType: 'classification',
          values: [
            {
              key: '610',
              label: 'Biens et Services Consommés'
            },
            {
              key: '611',
              label: 'Transports consommés'
            },
            {
              key: '612',
              label: 'Autres services consommés'
            },
            {
              key: '620',
              label: 'Frais de personnel'
            },
            {
              key: '630',
              label: 'Impôts et taxes'
            },
            {
              key: '640',
              label: 'Frais financiers'
            },
            {
              key: '650',
              label: 'Subventions versées'
            },
            {
              key: '660',
              label: 'Transferts versés'
            },
            {
              key: '670',
              label: 'Autres charges et pertes diverses'
            },
            {
              key: '680',
              label: 'Dotation aux amortissements'
            }
          ]
        },
        {
          id: 'economic_classification_Compte',
          key: 'economic_classification_Compte.Compte',
          label: 'Compte',
          valueRef: 'economic_classification_Compte.Intitule_compte',
          hierarchy: 'economic_classification',
          dimensionType: 'classification',
          values: [
            {
              key: '610100',
              label: 'Fournitures de bureau'
            },
            {
              key: '610101',
              label: 'Abonnement à divers publications'
            },
            {
              key: '610102',
              label: 'Frais d\'impression des tickets, timbres et vignettes'
            },
            {
              key: '610103',
              label: 'Frais d\'impression des registres et documents comptables'
            },
            {
              key: '610104',
              label: 'Dépenses de l\'état civil (registres, livrets, ' +
                'imprimés, etc.)'
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
