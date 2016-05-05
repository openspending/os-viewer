module.exports = [
  {
    key: 'withoutHierarchy',
    name: 'Without hierarchy',
    dimensions: [
      {
        id: 'from',
        key: 'from.name',
        code: 'from',
        hierarchy: 'from',
        dimensionType: undefined,
        name: 'from.name',
        label: 'from.name',
        drillDown: undefined,
        original: {
          "ref": "from",
          "key_attribute": "name",
          "cardinality_class": null,
          "label_ref": "from.name",
          "label": "from",
          "hierarchy": "from",
          "attributes": {
            "name": {
              "ref": "from.name",
              "column": "from_name",
              "datatype": "string",
              "label": "name"
            },
            "label": {
              "ref": "from.label",
              "column": "from_label",
              "datatype": "string",
              "label": "label"
            }
          },
          "label_attribute": "name",
          "key_ref": "from.name"
        }
      },
      {
        id: 'to',
        key: 'to.name',
        code: 'to',
        hierarchy: 'to',
        dimensionType: undefined,
        name: 'to.name',
        label: 'to.name',
        drillDown: undefined,
        original: {
          "ref": "to",
          "key_attribute": "name",
          "cardinality_class": null,
          "label_ref": "to.name",
          "label": "to",
          "hierarchy": "to",
          "attributes": {
            "name": {
              "ref": "to.name",
              "column": "to_name",
              "datatype": "string",
              "label": "name"
            },
            "label": {
              "ref": "to.label",
              "column": "to_label",
              "datatype": "string",
              "label": "label"
            }
          },
          "label_attribute": "name",
          "key_ref": "to.name"
        }
      }

    ],
    common: true
  },
  {
    key: 'time',
    name: 'time',
    dimensions: [
      {
        id: 'time_day',
        key: 'time_day.day',
        code: 'time.day',
        hierarchy: 'time',
        dimensionType: undefined,
        name: 'time_day.day',
        label: 'time_day.day',
        drillDown: undefined,
        original: {
          "ref": "time_day",
          "key_attribute": "day",
          "cardinality_class": null,
          "label_ref": "time_day.day",
          "label": "time.day",
          "hierarchy": "time",
          "attributes": {
            "day": {
              "ref": "time_day.day",
              "column": "time_day",
              "datatype": "integer",
              "label": "day"
            }
          },
          "label_attribute": "day",
          "key_ref": "time_day.day"
        }
      },
      {
        id: 'time_month',
        key: 'time_month.month',
        code: 'time.month',
        hierarchy: 'time',
        dimensionType: undefined,
        name: 'time_month.month',
        label: 'time_month.month',
        drillDown: 'time_day.day',
        original: {
          "ref": "time_month",
          "key_attribute": "month",
          "cardinality_class": null,
          "label_ref": "time_month.month",
          "label": "time.month",
          "hierarchy": "time",
          "attributes": {
            "month": {
              "ref": "time_month.month",
              "column": "time_month",
              "datatype": "integer",
              "label": "month"
            }
          },
          "label_attribute": "month",
          "key_ref": "time_month.month"
        }
      },
      {
        id: 'time_year',
        key: 'time_year.year',
        code: 'time.year',
        hierarchy: 'time',
        dimensionType: undefined,
        name: 'time_year.year',
        label: 'time_year.year',
        drillDown: 'time_month.month',
        original: {
          "ref": "time_year",
          "key_attribute": "year",
          "cardinality_class": null,
          "label_ref": "time_year.year",
          "label": "time.year",
          "hierarchy": "time",
          "attributes": {
            "year": {
              "ref": "time_year.year",
              "column": "time_year",
              "datatype": "integer",
              "label": "year"
            }
          },
          "label_attribute": "year",
          "key_ref": "time_year.year"
        }
      }
    ],
    common: false
  }
];
