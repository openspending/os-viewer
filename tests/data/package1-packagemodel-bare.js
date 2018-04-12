'use strict';

module.exports = {
  id: 'Package1',
  meta: {
    name: 'ekondo-titi-trial',
    title: 'Ekondo Titi trial 04/29',
    description: undefined,
    defaultParams: undefined,
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
      sortKey: 'date_2.Annee',
      hierarchy: 'date',
      dimensionType: 'datetime'
    },
    {
      id: 'economic_classification_3',
      key: 'economic_classification_3.Article',
      label: 'Article',
      valueRef: 'economic_classification_3.Intitule_article',
      sortKey: 'economic_classification_3.Intitule_article',
      hierarchy: 'economic_classification',
      dimensionType: 'classification'
    },
    {
      id: 'economic_classification_2',
      key: 'economic_classification_2.Chapitre',
      label: 'Chapitre',
      valueRef: 'economic_classification_2.Intitule_chapitre',
      sortKey: 'economic_classification_2.Intitule_chapitre',
      hierarchy: 'economic_classification',
      dimensionType: 'classification'
    },
    {
      id: 'economic_classification_Compte',
      key: 'economic_classification_Compte.Compte',
      label: 'Compte',
      valueRef: 'economic_classification_Compte.Intitule_compte',
      sortKey: 'economic_classification_Compte.Intitule_compte',
      hierarchy: 'economic_classification',
      dimensionType: 'classification'
    },
    {
      id: 'activity_2',
      key: 'activity_2.Nature',
      label: 'Nature',
      valueRef: 'activity_2.Intitule_nature',
      sortKey: 'activity_2.Intitule_nature',
      hierarchy: 'activity',
      dimensionType: 'activity'
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
          sortKey: 'activity_2.Intitule_nature',
          hierarchy: 'activity',
          dimensionType: 'activity'
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
          sortKey: 'date_2.Annee',
          hierarchy: 'date',
          dimensionType: 'datetime'
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
          sortKey: 'economic_classification_2.Intitule_chapitre',
          hierarchy: 'economic_classification',
          dimensionType: 'classification'
        },
        {
          id: 'economic_classification_3',
          key: 'economic_classification_3.Article',
          label: 'Article',
          valueRef: 'economic_classification_3.Intitule_article',
          sortKey: 'economic_classification_3.Intitule_article',
          hierarchy: 'economic_classification',
          dimensionType: 'classification'
        },
        {
          id: 'economic_classification_Compte',
          key: 'economic_classification_Compte.Compte',
          label: 'Compte',
          valueRef: 'economic_classification_Compte.Intitule_compte',
          sortKey: 'economic_classification_Compte.Intitule_compte',
          hierarchy: 'economic_classification',
          dimensionType: 'classification'
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
          sortKey: 'activity_2.Intitule_nature',
          hierarchy: 'activity',
          dimensionType: 'activity'
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
          sortKey: 'date_2.Annee',
          hierarchy: 'date',
          dimensionType: 'datetime'
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
          sortKey: 'economic_classification_2.Intitule_chapitre',
          hierarchy: 'economic_classification',
          dimensionType: 'classification'
        },
        {
          id: 'economic_classification_3',
          key: 'economic_classification_3.Article',
          label: 'Article',
          valueRef: 'economic_classification_3.Intitule_article',
          sortKey: 'economic_classification_3.Intitule_article',
          hierarchy: 'economic_classification',
          dimensionType: 'classification'
        },
        {
          id: 'economic_classification_Compte',
          key: 'economic_classification_Compte.Compte',
          label: 'Compte',
          valueRef: 'economic_classification_Compte.Intitule_compte',
          sortKey: 'economic_classification_Compte.Intitule_compte',
          hierarchy: 'economic_classification',
          dimensionType: 'classification'
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
          sortKey: 'date_2.Annee',
          hierarchy: 'date',
          dimensionType: 'datetime'
        }
      ]
    }
  ]
};
