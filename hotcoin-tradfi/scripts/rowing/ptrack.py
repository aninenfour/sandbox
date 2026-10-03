import json, cv2
from ultralytics import YOLO
m = YOLO('yolov8m-pose.pt')
V = '/root/.claude/uploads/08b7d1e0-df49-5703-a4c9-aa238815ef35/40d95be2-publer-1791004104223.mp4'
out = []
for r in m.track(V, stream=True, persist=True, tracker='botsort.yaml', imgsz=960, conf=0.2, verbose=False):
    ppl = []
    if r.boxes is not None and r.boxes.id is not None:
        for b, tid, k, c in zip(r.boxes.xyxy.tolist(), r.boxes.id.int().tolist(), r.keypoints.xy.tolist(), r.keypoints.conf.tolist()):
            ppl.append({'id': tid, 'b': [round(v, 1) for v in b], 'k': [[round(x, 1), round(y, 1), round(cc, 2)] for (x, y), cc in zip(k, c)]})
    out.append(ppl)
json.dump(out, open('ptrack.json', 'w')); print('done', len(out))
