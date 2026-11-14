# Treats Unsplash photos for the PT channel: mono + contrast + grain; cafe cup recoloured to brand green.
import numpy as np, sys
from PIL import Image, ImageFilter
D='/home/user/sandbox/social/pt/art/'
rng=np.random.default_rng(3)
def mono(a,gamma=1.0,lift=0):
    g=(0.3*a[...,0]+0.59*a[...,1]+0.11*a[...,2])/255.
    g=np.clip((g**gamma)*(1-lift)+lift,0,1); return g
def grain(g,s=.05): return np.clip(g+rng.normal(0,s,g.shape),0,1)
def save(g,name,tint=(0,0,0)):
    rgb=np.stack([g,g,g],-1)*255; Image.fromarray(rgb.astype('uint8')).save(D+name,quality=92)
for n,gam in [('hallway',1.25),('tram',1.15),('walker',1.2)]:
    a=np.asarray(Image.open(D+n+'.jpg').convert('RGB')).astype(float)
    save(grain(mono(a,gam),.045),n+'-t.jpg')
# cafe: mono everywhere, cup (teal hue) -> lime green
im=Image.open(D+'cafe.jpg').convert('RGB'); a=np.asarray(im).astype(float)
hsv=np.asarray(im.convert('HSV')).astype(float)
h,s,v=hsv[...,0]*360/255,hsv[...,1]/255,hsv[...,2]/255
m=((h>140)&(h<200)&(s>.25)).astype(float)
m=np.asarray(Image.fromarray((m*255).astype('uint8')).filter(ImageFilter.GaussianBlur(3))).astype(float)/255
g=grain(mono(a,1.05),.035)
lime=np.array([184,242,106])/255.; green=np.array([126,194,90])/255.
L=np.clip(v*1.15,0,1)[...,None]
col=np.where(L>.55, green+(lime-green)*((L-.55)/.45), green*(L/.55))
col=np.clip(col*1.0,0,1)
out=np.stack([g,g,g],-1)*(1-m[...,None])+col*m[...,None]
Image.fromarray((out*255).astype('uint8')).save(D+'cafe-t.jpg',quality=92)
print('ok')
