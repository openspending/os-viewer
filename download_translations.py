import csv
import json
import requests
import codecs

URL = 'https://docs.google.com/spreadsheets/d/1AkXyiIR0DYXRSk4_3h5NtUUR_D_1MHvnZTw6xNqdI2U/pub?gid=0&single=true&output=csv'

reader = csv.reader(codecs.iterdecode(
    requests.get(URL, stream=True).iter_lines(), 'utf-8'
))
header = next(reader)
languages = ['en'] + header[2:]
ret = {'xx': {}}
for row in reader:
    for language, translation in zip(languages, row[1:]):
        ret.setdefault(language,{})[row[1]] = translation
        ret['xx'][row[1]] = row[1].upper()

translations = json.load(open('app/config/translations.json', 'r'))
translations.update(ret)

json.dump(
    translations, open('app/config/translations.json', 'w'),
    sort_keys=True, indent=2, separators=(',', ': ')
)
