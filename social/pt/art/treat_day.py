# Mono + grain for day-demo photos (same treatment as tram/GM). Cafe re-done without any recolouring.
import numpy as np
from PIL import Image
D='/home/user/sandbox/social/pt/art/'
rng=np.random.default_rng(11)
for src,out,gm in [('bridge.jpg','bridge-m.jpg',1.1),('walker.jpg','walker-m.jpg',1.1),('cafe.jpg','cafe-m.jpg',1.05)]:
    a=np.asarray(Image.open(D+src).convert('RGB')).astype(float)/255
    g=(0.3*a[...,0]+0.59*a[...,1]+0.11*a[...,2])**gm
    g=np.clip(g+rng.normal(0,.04,g.shape),0,1)
    Image.fromarray((np.stack([g,g,g],-1)*255).astype('uint8')).save(D+out,quality=92)
    print(out, Image.open(D+out).size)
