from pathlib import Path
from PIL import Image

project = Path('/home/ubuntu/nsn-mobile')
source = Path('/home/ubuntu/webdev-static-assets/nsn-icon.png')
targets = [
    project / 'assets/images/icon.png',
    project / 'assets/images/splash-icon.png',
    project / 'assets/images/favicon.png',
    project / 'assets/images/android-icon-foreground.png',
]

with Image.open(source) as img:
    img = img.convert('RGB')
    img = img.resize((768, 768), Image.Resampling.LANCZOS)
    optimized = img.quantize(colors=192, method=Image.Quantize.MEDIANCUT)
    for target in targets:
        target.parent.mkdir(parents=True, exist_ok=True)
        optimized.save(target, format='PNG', optimize=True)
        print(f'{target}: {target.stat().st_size / 1024:.1f}KB')
