import cv2, json
V='/root/.claude/uploads/08b7d1e0-df49-5703-a4c9-aa238815ef35/40d95be2-publer-1791004104223.mp4'
init={'eth':(512,250,80,90),'sol':(655,250,62,80),'doge':(610,430,130,160),'jersey':(650,330,68,100)}
cap=cv2.VideoCapture(V); ok,fr=cap.read()
tr={k:cv2.TrackerCSRT_create() for k in init}
for k,b in init.items(): tr[k].init(fr,b)
out={k:[[b[0]+b[2]/2,b[1]+b[3]/2]] for k,b in init.items()}
while True:
    ok,fr=cap.read()
    if not ok: break
    for k,t in tr.items():
        ok2,b=t.update(fr); out[k].append([b[0]+b[2]/2,b[1]+b[3]/2] if ok2 else out[k][-1])
json.dump(out,open('others.json','w'))
