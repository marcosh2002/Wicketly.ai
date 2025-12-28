from PIL import Image, ImageDraw
import os

# Create a cricket player silhouette
img = Image.new('RGBA', (420, 500), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Head (circle) - Gold
draw.ellipse([160, 30, 260, 130], fill='gold', outline='white', width=2)

# Body (rectangle) - Light Blue
draw.rectangle([170, 130, 250, 280], fill='lightblue', outline='white', width=2)

# Left arm
draw.line([(170, 150), (100, 180)], fill='gold', width=10)
draw.ellipse([80, 165, 120, 205], fill='gold')

# Right arm holding bat
draw.line([(250, 150), (320, 120)], fill='gold', width=10)
draw.ellipse([310, 100, 350, 140], fill='gold')

# Bat (brown)
draw.line([(320, 110), (380, 50)], fill='brown', width=8)

# Left leg - Dark Blue
draw.line([(190, 280), (170, 480)], fill='darkblue', width=12)

# Right leg - Dark Blue
draw.line([(230, 280), (250, 480)], fill='darkblue', width=12)

# Feet - Brown
draw.ellipse([(160, 470), (180, 500)], fill='brown')
draw.ellipse([(240, 470), (260, 500)], fill='brown')

img.save('cricket-player.png')
print('Cricket player PNG created successfully!')
