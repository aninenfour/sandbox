# GM v2: plain mono + grain (no recolouring), plus rembg cutouts for text-behind-subject layering.
import numpy as np
from PIL import Image
from rembg import remove, new_session
D='/home/user/sandbox/social/pt/art/'
rng=np.random.default_rng(9)
def mono(src,out,gamma):
    a=np.asarray(Image.open(D+src).convert('RGB')).astype(float)/255
    g=(0.3*a[...,0]+0.59*a[...,1]+0.11*a[...,2])**gamma
    g=np.clip(g+rng.normal(0,.035,g.shape),0,1)
    im=Image.fromarray((np.stack([g,g,g],-1)*255).astype('uint8')); im.save(D+out,quality=92); return im
s=new_session('u2net')
for src,out,gm in [('grass.jpg','grass-m',1.05),('umb2.jpg','umb-m',1.0)]:
    im=mono(src,out+'.jpg',gm)
    cut=remove(Image.open(D+src).convert('RGB'),session=s)
    alpha=cut.split()[-1]
    rgba=im.convert('RGBA'); rgba.putalpha(alpha); rgba.save(D+out+'-cut.png')
print('ok')
