import csv
import json
import os
import requests
import codecs

URL = 'https://docs.google.com/spreadsheets/d/1AkXyiIR0DYXRSk4_3h5NtUUR_D_1MHvnZTw6xNqdI2U/pub?gid=0&single=true&output=csv'


def load_local(path):
    result = {}
    for filename in os.listdir(path):
        language = filename[:-5]  # strip .json
        result[language] = json.load(open(path + '/' + filename, 'r'))

    return result


def load_spreadsheet(url):
    reader = csv.reader(codecs.iterdecode(
        requests.get(url, stream=True).iter_lines(), 'utf-8'
    ))

    languages = next(reader)[2:]
    result = dict(zip(languages, [{} for n in range(len(languages))]))

    for row in reader:
        key = row[1]
        row = list(zip(languages, row[2:]))
        for language, translation in row:
            if translation != '':
                result[language][key] = translation

    return result


def main():
    result = {}
    result.update(load_local('translations'))
    result.update(load_spreadsheet(URL))

    json.dump(
        result,
        open('app/config/translations.json', 'w'),
        sort_keys=True, indent=2, separators=(',', ': ')
    )


main()
