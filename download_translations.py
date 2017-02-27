import csv
import json
import requests
import codecs

SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1AkXyiIR0DYXRSk4_3h5NtUUR_D_1MHvnZTw6xNqdI2U/pub?gid=0&single=true&output=csv'
TRANSLATIONS_PATH = './translations'


def load_spreadsheet(url, path):
    reader = csv.reader(codecs.iterdecode(
        requests.get(url, stream=True).iter_lines(), 'utf-8'
    ))

    languages = next(reader)[2:]
    result = {}
    for lang in languages:
        try:
            result[lang] = json.load(open(path + '/' + lang + '.json', 'r'))
        except FileNotFoundError:
            result[lang] = {}
        if not isinstance(result[lang], dict):
            result[lang] = {}

    for row in reader:
        key = row[1]
        row = list(zip(languages, row[2:]))
        for language, translation in row:
            if translation != '':
                result[language][key] = translation

    for lang, values in result.items():
        json.dump(
            values,
            open(path + '/' + lang + '.json', 'w'),
            sort_keys=True, indent=2, separators=(',', ': ')
        )


def main():
    load_spreadsheet(SPREADSHEET_URL, TRANSLATIONS_PATH)


main()
