# Cut the 3D hero object out of each official Hotcoin announcement banner (right side), transparent background via rembg.
from PIL import Image
from rembg import remove, new_session
import numpy as np
s=new_session('isnet-general-use')
for n in ['futures-loss-protection','HotcoinEarnRewardsBoost1','wall-street-earnings-season','HotcoinNEFEEarnLimitedOffer','HotcoinP2PEcosystemChallenge1']:
    im=Image.open(n+'.png').convert('RGB'); w,h=im.size
    crop=im.crop((int(w*.60),0,w,h))
    cut=remove(crop,session=s)
    bb=cut.getbbox(); cut=cut.crop(bb)
    cut.save(n+'-hero.png'); print(n,cut.size)
