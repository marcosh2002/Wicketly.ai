from PIL import Image, ImageDraw, ImageFilter

# Create universal stadium background image (1920x1080)
img = Image.new('RGB', (1920, 1080), color='#1a3a52')
draw = ImageDraw.Draw(img)

# Sky gradient effect (top to bottom)
for y in range(540):
    # Gradient from dark to lighter blue
    r = int(26 + (50 * (y / 540)))
    g = int(58 + (100 * (y / 540)))
    b = int(82 + (120 * (y / 540)))
    draw.line([(0, y), (1920, y)], fill=(r, g, b))

# Ground (green field)
draw.rectangle([(0, 540), (1920, 1080)], fill='#1b5c1f')

# Stadium structure (simplified)
# Left stand
draw.rectangle([(50, 400), (300, 700)], fill='#4a5f7f', outline='white', width=2)
# Right stand
draw.rectangle([(1620, 400), (1870, 700)], fill='#4a5f7f', outline='white', width=2)

# Back stand
draw.rectangle([(300, 200), (1620, 400)], fill='#5a6f8f', outline='white', width=2)

# Floodlights (poles)
for x in [400, 800, 1200, 1600]:
    draw.rectangle([(x-10, 100), (x+10, 300)], fill='gray')
    # Light bulbs
    draw.ellipse([(x-20, 80), (x+20, 120)], fill='yellow')

# Cricket pitch outline (rectangular)
pitch_left = 600
pitch_right = 1320
pitch_top = 450
pitch_bottom = 700

# Pitch boundary
draw.rectangle([(pitch_left, pitch_top), (pitch_right, pitch_bottom)], outline='white', width=3)

# Pitch center line
draw.line([(pitch_left, pitch_top), (pitch_left, pitch_bottom)], fill='white', width=2)
draw.line([(pitch_right, pitch_top), (pitch_right, pitch_bottom)], fill='white', width=2)
draw.line([(pitch_left, (pitch_top+pitch_bottom)//2), (pitch_right, (pitch_top+pitch_bottom)//2)], fill='white', width=2)

# Circle (center circle)
circle_center_x = (pitch_left + pitch_right) // 2
circle_center_y = (pitch_top + pitch_bottom) // 2
circle_radius = 80
draw.ellipse([
    (circle_center_x - circle_radius, circle_center_y - circle_radius),
    (circle_center_x + circle_radius, circle_center_y + circle_radius)
], outline='white', width=2)

# Save image
img.save('universal-stadium.jpg', quality=85)
print('Universal stadium background created successfully!')
print('File: universal-stadium.jpg (1920x1080 pixels)')
