# GM posts: mono + grain, selected hues remapped to brand greens (grass -> lime; warm night light -> green glow).
import numpy as np
from PIL import Image, ImageFilter
D='/home/user/sandbox/social/pt/art/'
rng=np.random.default_rng(5)
lime=np.array([184,242,106])/255.; green=np.array([126,194,90])/255.; deep=np.array([30,60,22])/255.
def run(src,out,hlo,hhi,smin,gamma,boost):
    im=Image.open(D+src).convert('RGB'); a=np.asarray(im).astype(float)/255
    hsv=np.asarray(im.convert('HSV')).astype(float)/255
    h,s,v=hsv[...,0]*360,hsv[...,1],hsv[...,2]
    m=((h>hlo)&(h<hhi)&(s>smin)).astype(float)*np.clip((s-smin)/.25,0,1)
    mi=Image.fromarray((m*255).astype('uint8')).filter(ImageFilter.MaxFilter(11)).filter(ImageFilter.MinFilter(11)).filter(ImageFilter.GaussianBlur(2))
    m=np.asarray(mi).astype(float)/255
    g=(0.3*a[...,0]+0.59*a[...,1]+0.11*a[...,2])**gamma
    g=np.clip(g+rng.normal(0,.04,g.shape),0,1)
    L=np.clip(v*boost,0,1)[...,None]
    col=np.where(L<.5, deep+(green-deep)*(L/.5), green+(lime-green)*((L-.5)/.5))
    o=np.stack([g,g,g],-1)*(1-m[...,None])+col*m[...,None]
    Image.fromarray((np.clip(o,0,1)*255).astype('uint8')).save(D+out,quality=92)
run('grass.jpg','grass-t.jpg',50,170,.12,1.1,1.1)
run('umb2.jpg','umb-t.jpg',10,60,.35,1.0,1.4)
print('ok')
