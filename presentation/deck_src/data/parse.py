import re, json, sys
src=open(sys.argv[1]).read()
models={}
for m in re.finditer(r'^model (\w+) \{(.*?)^\}', src, re.S|re.M):
    name, body = m.group(1), m.group(2)
    table=name; fields=[]; uniques=[]; fks={}
    for line in body.split('\n'):
        l=line.strip()
        if not l or l.startswith('//'): continue
        mm=re.search(r'@@map\("(\w+)"\)', l)
        if mm: table=mm.group(1); continue
        if l.startswith('@@unique'): uniques.append(re.search(r'\[(.*?)\]', l).group(1).replace(' ','')); continue
        if l.startswith('@@'): continue
        parts=l.split()
        fname, ftype = parts[0], parts[1]
        rel=re.search(r'@relation\((?:"\w+",\s*)?fields:\s*\[(\w+)\]', l)
        base=ftype.rstrip('?[]')
        if rel: fks[rel.group(1)]=base; continue
        if ftype.endswith('[]') and base[0].isupper() and base not in ('String','Int','Float','Boolean','DateTime','Json'):
            # back-relation list or enum list
            if base in re.findall(r'^model (\w+)', src, re.M): continue
        if base in re.findall(r'^model (\w+)', src, re.M): continue
        fields.append({'name':fname,'type':ftype,'pk':'@id' in l,'uq':'@unique' in l,'default':'@default' in l})
    for f in fields:
        f['fk']=fks.get(f['name'])
    models[name]={'table':table,'fields':fields,'uniques':uniques}
tables={v['table']:v for v in models.values()}
# map fk model names to table names
for v in models.values():
    for f in v['fields']:
        if f['fk']: f['fk']=models[f['fk']]['table']
json.dump({'models':models}, open(sys.argv[2],'w'), indent=1)
print(len(models), sum(len(v['fields']) for v in models.values()))
for k,v in models.items(): print(v['table'], len(v['fields']), [f['name']+'->'+f['fk'] for f in v['fields'] if f['fk']], v['uniques'])
